# 5min IA

Apprendre à utiliser Claude/ChatGPT au quotidien, façon Duolingo, en 5 minutes par jour.
V1 : une leçon par jour, un prompt à écrire, un feedback de Claude, un streak.

## Stack

- Next.js 14 (App Router) + TypeScript
- Supabase (Postgres + Auth)
- Tailwind CSS
- API Anthropic (Claude) pour l'évaluation des prompts
- Déploiement Vercel

## 1. Configurer Supabase

1. Crée un projet sur [supabase.com](https://supabase.com).
2. Dans **SQL Editor**, exécute dans l'ordre :
   - `supabase/schema.sql` (tables, RLS, trigger de création de profil)
   - `supabase/seed.sql` (les 3 premières leçons — étape "Description")
   - `supabase/seed_lot2.sql` (2 leçons supplémentaires — étapes "Discernement"
     et "Diligence", voir `docs/analyse-anthropic-academy-lecons.md`)
   - `supabase/seed_lot3.sql` (2 leçons supplémentaires — hallucinations et
     biais, complément aux étapes "Discernement" et "Diligence")
3. Dans **Project Settings > API**, récupère `Project URL` et la clé `anon public`.
4. Optionnel mais recommandé pour un test rapide entre 5 et 10 personnes : dans
   **Authentication > Providers > Email**, désactive « Confirm email » pour que les
   comptes soient utilisables immédiatement après inscription (sinon chaque
   utilisateur doit cliquer sur le lien reçu par email avant de pouvoir se
   connecter — géré par `/auth/callback`).

## 2. Configurer l'API Anthropic

1. Crée une clé sur [console.anthropic.com](https://console.anthropic.com/settings/keys).
2. C'est la seule API externe utilisée par le produit : elle évalue le prompt
   soumis par l'utilisateur et renvoie une note sur 5 + un feedback structuré.

## 3. Variables d'environnement

Copie `.env.example` vers `.env.local` et renseigne :

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-sonnet-5   # optionnel
```

## 4. Lancer en local

```bash
npm install
npm run dev
```

L'app tourne sur http://localhost:3000.

## 5. Déployer sur Vercel

1. Importe le repo dans Vercel.
2. Renseigne les mêmes variables d'environnement que `.env.local` dans
   **Project Settings > Environment Variables**.
3. Déploie — aucune configuration supplémentaire n'est nécessaire (pas de build
   step particulier, `next build` suffit).

## Modèle de données

Voir `supabase/schema.sql` pour le détail complet (types, contraintes, RLS).

- `users` — profil applicatif (1 ligne par utilisateur Supabase Auth), créé
  automatiquement à l'inscription via un trigger Postgres.
- `lessons` — contenu des leçons, écrit à la main pour cette V1 (pas de
  génération dynamique).
- `user_progress` — statut de complétion par (utilisateur, leçon) + streak.
- `attempts` — historique de chaque prompt soumis, avec le feedback et la
  note renvoyés par Claude.

## Parcours produit

- **Onboarding** (3 questions, obligatoire) : profil pro/particulier (+
  métier si pro), niveau de départ, objectif principal. Ces réponses
  déterminent uniquement le parcours de leçons affiché.
- **Boucle de leçon quotidienne** : mise en situation → l'utilisateur écrit
  son prompt → évaluation Claude (note /5 + feedback) → un réessai possible →
  validation → mise à jour du streak.
- **Progression** : streak actuel, leçons terminées / total, historique des
  tentatives. Pas de classement public en V1.

## Ce qui n'est pas dans cette V1

Paiement, tableau de bord entreprise, génération dynamique de leçons,
fonctionnalités sociales — voir le brief produit.
