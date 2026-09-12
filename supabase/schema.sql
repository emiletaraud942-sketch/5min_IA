-- 5min IA — schema V1
-- Run this once against your Supabase project (SQL editor or `supabase db push`).

create extension if not exists "pgcrypto";

create type track_enum as enum ('pro', 'particulier');
create type metier_enum as enum ('commercial', 'rh', 'assistant', 'comptabilite', 'autre');
create type niveau_enum as enum ('jamais_utilise', 'un_peu', 'a_l_aise');
create type statut_enum as enum ('non_commence', 'termine');

-- Profile table, one row per auth user (id mirrors auth.users.id).
create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  profil track_enum,
  metier metier_enum,
  niveau_depart niveau_enum,
  objectif_principal text,
  onboarding_complete boolean not null default false,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  constraint metier_only_for_pro check (
    (profil = 'pro') or (profil is distinct from 'pro' and metier is null)
  )
);

-- Lesson content, written by hand for V1 (no dynamic generation).
create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  track track_enum not null,
  metier metier_enum,
  ordre int not null,
  titre text not null,
  mise_en_situation text not null,
  consigne text not null,
  criteres_evaluation text not null,
  -- Themed folder a lesson belongs to (e.g. 'agent_pro'). null = regular
  -- daily lesson, no folder, no quota. See migration_premium.sql.
  groupe text,
  -- Which frontend component renders this lesson. 'standard' = the
  -- original write-a-prompt format, unchanged. See migration_lesson_types.sql.
  type_lecon text not null default 'standard' check (type_lecon in (
    'standard',
    'explication_etendue',
    'qu_aurais_tu_fait',
    'devine_la_difference',
    'corrige_le_prompt',
    'defi_chronometre',
    'choisis_la_fiable',
    'trouve_erreur',
    'relance_en_deux_temps',
    'question_guidee'
  )),
  -- Type-specific structured content (choices, alternate prompts, etc.).
  -- null for 'standard' lessons, which use the columns above instead.
  contenu jsonb,
  -- Which of the 4 AI-fluency pillars this lesson trains (0 or more).
  piliers text[] not null default '{}',
  created_at timestamptz not null default now(),
  unique (track, metier, ordre)
);

-- One row per (user, lesson): tracks completion + the streak snapshot at completion time.
create table public.user_progress (
  user_id uuid not null references public.users (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  statut statut_enum not null default 'non_commence',
  date_completion timestamptz,
  streak_count int not null default 0,
  primary key (user_id, lesson_id)
);

-- Every prompt a user submits for evaluation, whether or not the lesson gets validated.
create table public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  prompt_soumis text not null,
  feedback_claude text not null,
  points_forts text[] not null default '{}',
  points_a_ameliorer text[] not null default '{}',
  score int not null check (score between 1 and 5),
  date timestamptz not null default now()
);

create index attempts_user_lesson_idx on public.attempts (user_id, lesson_id, date desc);

-- One row per user: counts of completed lessons per AI-fluency pillar,
-- incremented from `lessons.piliers` the first time each lesson is
-- completed. Feeds the competency gauge on the progress page.
create table public.competences_utilisateur (
  user_id uuid primary key references public.users (id) on delete cascade,
  delegation_count int not null default 0,
  description_count int not null default 0,
  discernement_count int not null default 0,
  diligence_count int not null default 0,
  updated_at timestamptz not null default now()
);

-- One row per (user, lesson, day) the user opened a "groupe" lesson. Used
-- to count how many distinct special lessons were started today.
create table public.lesson_opens (
  user_id uuid not null references public.users (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  opened_on date not null default current_date,
  created_at timestamptz not null default now(),
  primary key (user_id, lesson_id, opened_on)
);

-- One row per (user, lesson) once paid for — unlocks it permanently, it
-- never counts against the daily quota again. Only ever written by the
-- Stripe webhook using the service role key (see lib/supabase/admin.ts).
create table public.lesson_unlocks (
  user_id uuid not null references public.users (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  stripe_session_id text,
  created_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

-- Auto-create the public profile row whenever someone signs up via Supabase Auth.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Row Level Security ---------------------------------------------------

alter table public.users enable row level security;
alter table public.lessons enable row level security;
alter table public.user_progress enable row level security;
alter table public.attempts enable row level security;
alter table public.competences_utilisateur enable row level security;
alter table public.lesson_opens enable row level security;
alter table public.lesson_unlocks enable row level security;

create policy "users can read own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "users can update own profile"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "authenticated users can read lessons"
  on public.lessons for select
  to authenticated
  using (true);

create policy "users can read own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "users can upsert own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "users can update own progress"
  on public.user_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users can read own attempts"
  on public.attempts for select
  using (auth.uid() = user_id);

create policy "users can insert own attempts"
  on public.attempts for insert
  with check (auth.uid() = user_id);

create policy "users can read own competences"
  on public.competences_utilisateur for select
  using (auth.uid() = user_id);

create policy "users can insert own competences"
  on public.competences_utilisateur for insert
  with check (auth.uid() = user_id);

create policy "users can update own competences"
  on public.competences_utilisateur for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users can read own lesson opens"
  on public.lesson_opens for select
  using (auth.uid() = user_id);

create policy "users can insert own lesson opens"
  on public.lesson_opens for insert
  with check (auth.uid() = user_id);

create policy "users can read own lesson unlocks"
  on public.lesson_unlocks for select
  using (auth.uid() = user_id);

-- No insert policy for lesson_unlocks: only the Stripe webhook (service
-- role key, bypasses RLS) writes rows here.
