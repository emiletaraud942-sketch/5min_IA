-- 5min IA — admin role migration.
-- Run once against an existing database (schema.sql already applied).
-- Safe to re-run.
--
-- Grants a real "admin" role: unrestricted access to every lesson across
-- both tracks (not just the user's own profil/métier), and free navigation
-- without being forced through onboarding first. Enforced in application
-- code (src/lib/data.ts, src/lib/supabase/middleware.ts, lesson pages).

alter table public.users add column if not exists is_admin boolean not null default false;

update public.users
set is_admin = true
where email = 'emiletaraud942@gmail.com';
