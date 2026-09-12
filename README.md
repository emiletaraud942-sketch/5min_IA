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
   - `supabase/seed_lot4.sql` (parcours de 15 leçons pour le parcours Pro :
     "Construire ton agent IA au travail" — rôle, instructions permanentes,
     contexte, prompts-modèles, relecture, limites, entretien dans la durée)
   - `supabase/seed_lot5.sql` (parcours de 15 leçons pour le parcours
     Particulier : "Construire ton assistant repas au quotidien" — recettes
     de dépannage quand le frigo est vide, menus, listes de courses,
     batch cooking, anti-gaspillage)
   - `supabase/migration_admin.sql` (ajoute le rôle admin — navigation libre
     sans passer par l'onboarding, plus un sélecteur de parcours Pro/Particulier
     sur le dashboard — attribué par défaut à `emiletaraud942@gmail.com`, à
     adapter si besoin)
   - `supabase/migration_premium.sql` (regroupe les leçons "agent" (lots 4 et
     5) dans un dossier à part sur `/lessons`, plafonné à 2 leçons gratuites
     par jour — au-delà, 1€ par leçon via Stripe, voir section dédiée
     ci-dessous)
   - `supabase/migration_lesson_types.sql` (V1.1 — système de types de leçon :
     colonnes `type_lecon`/`contenu`/`piliers`, table `competences_utilisateur`
     pour la jauge de compétences, tag rétroactif des piliers sur toutes les
     leçons déjà en base)
   - `supabase/seed_lot6.sql` (un exemple jouable de chacun des 9 nouveaux
     types de leçon)
3. Dans **Project Settings > API**, récupère `Project URL` et la clé `anon public`.
4. Optionnel mais recommandé pour un test rapide entre 5 et 10 personnes : dans
   **Authentication > Providers > Email**, désactive « Confirm email » pour que les
   comptes soient utilisables immédiatement après inscription (sinon chaque
   utilisateur doit cliquer sur le lien reçu par email avant de pouvoir se
   connecter — géré par `/auth/callback`).

### Activer la connexion Google (optionnel mais recommandé)

1. Dans [Google Cloud Console](https://console.cloud.google.com/apis/credentials),
   crée des identifiants **OAuth 2.0 Client ID** (type "Web application").
2. Dans **Authorized redirect URIs**, ajoute l'URL de callback de ton projet
   Supabase : `https://<ton-projet>.supabase.co/auth/v1/callback` (visible dans
   Supabase sous **Authentication > Providers > Google** une fois l'écran
   ouvert).
3. Copie le **Client ID** et le **Client Secret** générés par Google.
4. Dans Supabase, **Authentication > Providers > Google** : active le
   provider et colle-y le Client ID / Client Secret.
5. Rien à faire côté code : le bouton "Continuer avec Google" (login et
   inscription) appelle `supabase.auth.signInWithOAuth` et repasse par
   `/auth/callback`, exactement comme la confirmation email.

## 2. Configurer l'API Anthropic

1. Crée une clé sur [console.anthropic.com](https://console.anthropic.com/settings/keys).
2. C'est la seule API externe utilisée pour le produit pédagogique : elle
   évalue le prompt soumis par l'utilisateur et renvoie une note sur 5 + un
   feedback structuré.

## 3. Configurer Stripe (leçons spéciales payantes)

Uniquement nécessaire si tu veux que le bouton "Débloquer pour 1€" des
leçons spéciales fonctionne réellement (sinon il affichera une erreur, le
reste du site n'est pas affecté).

1. Crée un compte sur [dashboard.stripe.com](https://dashboard.stripe.com)
   (le mode test suffit pour développer/tester).
2. Dans **Développeurs > Clés API**, récupère la **clé secrète**
   (`sk_test_...` ou `sk_live_...` en production) → `STRIPE_SECRET_KEY`.
3. Dans **Développeurs > Webhooks**, crée un endpoint pointant vers
   `https://<ton-domaine>/api/stripe/webhook`, écoutant l'événement
   `checkout.session.completed`. Copie le **signing secret** (`whsec_...`)
   → `STRIPE_WEBHOOK_SECRET`.
4. Dans Supabase, **Project Settings > API**, récupère la clé
   **`service_role`** (⚠️ ne jamais l'exposer côté client, elle contourne
   toutes les règles de sécurité) → `SUPABASE_SERVICE_ROLE_KEY`. Elle sert
   uniquement au webhook Stripe pour enregistrer un déblocage de leçon, en
   dehors de toute session utilisateur.
5. En local, teste avec le [Stripe CLI](https://stripe.com/docs/stripe-cli) :
   `stripe listen --forward-to localhost:3000/api/stripe/webhook`.

## 4. Variables d'environnement

Copie `.env.example` vers `.env.local` et renseigne :

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-sonnet-5   # optionnel

# Optionnel — uniquement pour le paiement des leçons spéciales
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
SUPABASE_SERVICE_ROLE_KEY=
```

## 5. Lancer en local

```bash
npm install
npm run dev
```

L'app tourne sur http://localhost:3000.

## 6. Déployer sur Vercel

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
- `competences_utilisateur` — compteurs par pilier (délégation / description
  / discernement / diligence), incrémentés à chaque première complétion
  d'une leçon tagguée avec ce pilier. Alimente la jauge sur `/progress`.

## Parcours produit

- **Onboarding** (3 questions, obligatoire) : profil pro/particulier (+
  métier si pro), niveau de départ, objectif principal. Ces réponses
  déterminent uniquement le parcours de leçons affiché.
- **Boucle de leçon quotidienne** : mise en situation → l'utilisateur écrit
  son prompt → évaluation Claude (note /5 + feedback) → un réessai possible →
  validation → mise à jour du streak.
- **Toutes les leçons** (`/lessons`) : liste complète des leçons du parcours,
  chacune cliquable indépendamment de l'ordre pour la faire ou la refaire.
- **Dossier de leçons spéciales** : les parcours "agent" de 15 leçons (lots
  4 et 5) apparaissent regroupés à part sur `/lessons`, clairement identifiés
  comme un parcours spécial. Limités à 2 leçons gratuites par jour — au-delà,
  débloquer une leçon coûte 1€ (paiement Stripe), et reste ensuite acquise
  définitivement (elle ne recompte plus jamais dans le quota).
- **Progression** : streak actuel, leçons terminées / total, historique des
  tentatives, jauge de compétences à 4 axes. Pas de classement public en V1.

## Types de leçon (V1.1)

Le format d'origine ("standard" : mise en situation → prompt écrit par
l'utilisateur → évaluation Claude) reste le type par défaut et continue de
fonctionner à l'identique. La colonne `type_lecon` sur `lessons` route vers
9 formats supplémentaires, chacun avec son propre composant
(`src/components/lesson-types/` pour les 6 nouveaux composants dédiés, le
composant `LessonForm` existant est réutilisé et étendu par des props
optionnelles pour les 3 qui restent proches du format standard) :

| type_lecon | Composant | Principe |
|---|---|---|
| `explication_etendue` | `LessonForm` (+ prop) | Bloc dépliable après le feedback, expliquant le principe général |
| `qu_aurais_tu_fait` | `QuAuraisTuFaitForm` | Choix entre 2-3 actions possibles, révélation immédiate |
| `devine_la_difference` | `DevineLaDifferenceForm` | Deux prompts/réponses côte à côte, deviner le meilleur |
| `corrige_le_prompt` | `LessonForm` (+ prop) | Prompt de départ imparfait pré-rempli, à corriger |
| `defi_chronometre` | `LessonForm` (+ prop) | Le format standard avec un minuteur visible |
| `choisis_la_fiable` | `ChoisisLaFiableForm` | 3 réponses IA, repérer la plus fiable |
| `trouve_erreur` | `TrouveErreurForm` | Repérer le passage biaisé/erroné dans une réponse IA |
| `relance_en_deux_temps` | `RelanceEnDeuxTempsForm` | 1ère réponse volontairement plate → l'utilisateur relance → évaluation Claude de la relance |
| `question_guidee` | `QuestionGuideeForm` | Une question réflexive avant de révéler le feedback complet |

Les 4 types "à choix" (`qu_aurais_tu_fait`, `devine_la_difference`,
`choisis_la_fiable`, `trouve_erreur`) n'appellent pas l'API Claude : le
score et le feedback sont dérivés localement du `contenu` (jsonb) de la
leçon, via `/api/attempt`. Les types qui demandent un vrai prompt continuent
de passer par `/api/evaluate`.

Chaque leçon porte aussi un tableau `piliers` (`delegation` / `description`
/ `discernement` / `diligence`, un ou plusieurs). À la première complétion
d'une leçon, `/api/complete-lesson` incrémente les compteurs correspondants
dans `competences_utilisateur` — c'est ce qui alimente la jauge à 4 axes sur
`/progress`.

## Installer l'app (PWA)

Le site est installable comme une application depuis un navigateur mobile ou
desktop (manifest + icônes fournis) :

- **iPhone/Safari** : bouton Partager → "Sur l'écran d'accueil".
- **Android/Chrome** : menu ⋮ → "Installer l'application" (ou bandeau
  automatique proposé par Chrome).
- **Desktop/Chrome** : icône d'installation dans la barre d'adresse.

## Ce qui n'est pas dans cette V1

Tableau de bord entreprise, génération dynamique de leçons, fonctionnalités
sociales — voir le brief produit. (Le paiement des leçons spéciales, prévu
initialement pour une V2, a finalement été ajouté — voir section Stripe
ci-dessus.)
