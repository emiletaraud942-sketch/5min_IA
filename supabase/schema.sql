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
