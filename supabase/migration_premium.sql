-- 5min IA — premium lessons migration.
-- Run once against an existing database. Safe to re-run.
--
-- Groups the "agent" deep-dive courses (lot 4 & 5) into a distinct,
-- clearly-labelled folder on /lessons, and caps them at 2 per day for
-- free — beyond that, unlocking one costs 1€ via Stripe Checkout
-- (src/lib/stripe.ts, /api/checkout, /api/stripe/webhook).

-- Which themed folder a lesson belongs to. null = regular daily lesson.
alter table public.lessons add column if not exists groupe text;

update public.lessons set groupe = 'agent_pro'
where track = 'pro' and ordre between 7 and 21;

update public.lessons set groupe = 'agent_perso'
where track = 'particulier' and ordre between 6 and 20;

-- One row per (user, lesson, day) the user opened a "groupe" lesson.
-- Used to count how many distinct special lessons were started today.
create table if not exists public.lesson_opens (
  user_id uuid not null references public.users (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  opened_on date not null default current_date,
  created_at timestamptz not null default now(),
  primary key (user_id, lesson_id, opened_on)
);

-- One row per (user, lesson) once paid for — unlocks it permanently,
-- it never counts against the daily quota again.
create table if not exists public.lesson_unlocks (
  user_id uuid not null references public.users (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  stripe_session_id text,
  created_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

alter table public.lesson_opens enable row level security;
alter table public.lesson_unlocks enable row level security;

drop policy if exists "users can read own lesson opens" on public.lesson_opens;
create policy "users can read own lesson opens"
  on public.lesson_opens for select
  using (auth.uid() = user_id);

drop policy if exists "users can insert own lesson opens" on public.lesson_opens;
create policy "users can insert own lesson opens"
  on public.lesson_opens for insert
  with check (auth.uid() = user_id);

drop policy if exists "users can read own lesson unlocks" on public.lesson_unlocks;
create policy "users can read own lesson unlocks"
  on public.lesson_unlocks for select
  using (auth.uid() = user_id);

-- No insert policy for lesson_unlocks: rows are only ever written by the
-- Stripe webhook using the service role key (bypasses RLS), never by the
-- client, so a payment can't be faked by calling the API directly.
