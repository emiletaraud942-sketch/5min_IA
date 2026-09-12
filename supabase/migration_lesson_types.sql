-- 5min IA — lesson types + competency gauge migration (V1.1).
-- Run once against an existing database (after schema.sql and all seed_lotN
-- scripts already applied). Safe to re-run.
--
-- Adds a `type_lecon` system on top of the existing lesson format (which
-- stays the default "standard" type, unchanged): each type routes to a
-- different frontend component and stores its own structured content in
-- `contenu` (jsonb). Also adds `piliers` (which of the 4 AI-fluency
-- competencies a lesson trains) on every lesson, retroactively tagged on
-- everything already in the database, feeding a new competency gauge on
-- the progress page via `competences_utilisateur`.

alter table public.lessons
  add column if not exists type_lecon text not null default 'standard';

alter table public.lessons
  add constraint lessons_type_lecon_check
  check (type_lecon in (
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
  ));

alter table public.lessons add column if not exists contenu jsonb;
alter table public.lessons add column if not exists piliers text[] not null default '{}';

-- Retroactively tag every existing lesson with the pillar(s) it trains.
-- The original 3 lessons work "description" (writing a good prompt); the
-- Discernement/Diligence/hallucination/biais lessons map directly; the two
-- 15-lesson "agent" courses (lot 4 & 5) are tagged per-lesson below.

update public.lessons set piliers = array['description'] where titre in (
  'Rédiger un compte-rendu de réunion en 2 minutes',
  'Préparer un rendez-vous client en 5 minutes',
  'Écrire un mail administratif compliqué'
);

update public.lessons set piliers = array['discernement'] where titre in (
  'L''IA t''a répondu. Peux-tu lui faire confiance ?',
  'Pourquoi l''IA ment parfois sans le savoir'
);

update public.lessons set piliers = array['diligence'] where titre in (
  '3 réflexes avant d''envoyer une réponse IA telle quelle',
  'Ton IA a des préjugés — voici pourquoi'
);

-- Lot 4 — "Construire ton agent IA au travail" (Pro)
update public.lessons set piliers = array['delegation', 'description'] where titre = 'Donne un rôle précis à ton agent, pas une mission floue';
update public.lessons set piliers = array['description'] where titre = 'Écrire les instructions permanentes de ton agent';
update public.lessons set piliers = array['description'] where titre = 'Donner le bon ton par défaut à ton agent';
update public.lessons set piliers = array['description'] where titre = 'Donner à ton agent le contexte qui ne change jamais';
update public.lessons set piliers = array['delegation', 'description'] where titre = 'Créer ton premier prompt réutilisable pour une tâche récurrente';
update public.lessons set piliers = array['diligence'] where titre = 'Apprendre à ton agent à se relire lui-même';
update public.lessons set piliers = array['discernement'] where titre = 'Apprendre à ton agent à te poser des questions avant de répondre';
update public.lessons set piliers = array['delegation', 'description'] where titre = 'Automatiser ton compte-rendu hebdomadaire';
update public.lessons set piliers = array['delegation'] where titre = 'Apprendre à ton agent à prioriser une liste en vrac';
update public.lessons set piliers = array['description'] where titre = 'Donner à ton agent un document long comme mémoire';
update public.lessons set piliers = array['delegation', 'description'] where titre = 'Construire un processus en plusieurs étapes';
update public.lessons set piliers = array['discernement'] where titre = 'Apprendre à ton agent à dire qu''il ne sait pas';
update public.lessons set piliers = array['diligence', 'delegation'] where titre = 'Fixer les limites de ce que ton agent ne doit jamais faire seul';
update public.lessons set piliers = array['diligence'] where titre = 'Faire le bilan mensuel de ton agent';
update public.lessons set piliers = array['diligence'] where titre = 'Documenter ton agent pour qu''il ne reste pas que dans ta tête';

-- Lot 5 — "Construire ton assistant repas au quotidien" (Particulier)
update public.lessons set piliers = array['delegation', 'description'] where titre = 'Dire précisément à ton assistant ce que tu attends de lui';
update public.lessons set piliers = array['description'] where titre = 'Donner tes préférences permanentes à ton assistant';
update public.lessons set piliers = array['description'] where titre = 'Le frigo est vide : obtenir une vraie recette de dépannage';
update public.lessons set piliers = array['description'] where titre = 'Adapter une recette à une contrainte précise';
update public.lessons set piliers = array['delegation', 'description'] where titre = 'Transformer un menu de la semaine en liste de courses';
update public.lessons set piliers = array['delegation', 'description'] where titre = 'Construire un menu de la semaine varié en un seul prompt';
update public.lessons set piliers = array['discernement'] where titre = 'Éviter le gaspillage avec ce qui va périmer';
update public.lessons set piliers = array['description'] where titre = 'Adapter les quantités au bon nombre de personnes';
update public.lessons set piliers = array['discernement'] where titre = 'Poser une contrainte santé sans suivre un conseil médical aveuglément';
update public.lessons set piliers = array['delegation'] where titre = 'Construire un plan de courses mensuel et du batch cooking';
update public.lessons set piliers = array['description'] where titre = 'Préparer un menu pour des invités';
update public.lessons set piliers = array['discernement'] where titre = 'Vérifier une recette avant de la suivre';
update public.lessons set piliers = array['diligence'] where titre = 'Sauvegarder tes recettes préférées comme mémoire permanente';
update public.lessons set piliers = array['delegation'] where titre = 'Mettre en place ton rituel du dimanche soir';
update public.lessons set piliers = array['diligence'] where titre = 'Faire le bilan du mois avec ton assistant';

-- Competency gauge: one row per user, incremented (see src/lib/competences.ts)
-- the first time a lesson tagged with each pillar is completed.
create table if not exists public.competences_utilisateur (
  user_id uuid primary key references public.users (id) on delete cascade,
  delegation_count int not null default 0,
  description_count int not null default 0,
  discernement_count int not null default 0,
  diligence_count int not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.competences_utilisateur enable row level security;

drop policy if exists "users can read own competences" on public.competences_utilisateur;
create policy "users can read own competences"
  on public.competences_utilisateur for select
  using (auth.uid() = user_id);

drop policy if exists "users can insert own competences" on public.competences_utilisateur;
create policy "users can insert own competences"
  on public.competences_utilisateur for insert
  with check (auth.uid() = user_id);

drop policy if exists "users can update own competences" on public.competences_utilisateur;
create policy "users can update own competences"
  on public.competences_utilisateur for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
