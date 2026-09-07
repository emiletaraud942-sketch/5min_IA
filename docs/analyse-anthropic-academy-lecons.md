# Analyse Anthropic Academy → banque de leçons pour le SaaS

Découpage de la formation officielle d'Anthropic (anthropic.com/learn) en 3 blocs, avec pour chaque sous-partie une proposition de leçon ORIGINALE pour ton produit (jamais une reprise de leur contenu — juste le sujet comme point de départ).

---

## BLOC 1 — Usage personnel / grand public (le plus riche pour toi)

Basé sur leur cours pivot "AI Fluency: Framework & Foundations", construit autour d'un cadre en 4 étapes : Délégation, Description, Discernement, Diligence.

### 1.1 — Comprendre ce qu'est vraiment l'IA générative (démystification)
Chez Anthropic : une leçon dédiée à expliquer simplement comment fonctionne l'IA générative.
**Leçon proposée** : "Comment l'IA devine ce qu'elle va écrire" — mise en situation où l'utilisateur découvre en 2 minutes, sans jargon, pourquoi l'IA peut se tromper avec assurance. Bonne leçon d'ouverture pour rassurer un vrai novice dès le jour 1.

### 1.2 — Délégation (quoi confier à l'IA, et quoi garder pour soi)
Partie totalement absente de tes 3 leçons actuelles.
**Leçon proposée** : "Cette tâche, tu la fais toi ou tu la délègues ?" — une série de mini-cas (rédiger un mail simple / répondre à un client mécontent / trancher une décision RH délicate) où l'utilisateur doit dire ce qu'il confierait à l'IA et pourquoi. Apprend à poser la bonne limite, pas juste à écrire un prompt.

### 1.3 — Description (bien formuler sa demande)
C'est exactement ce que couvrent déjà tes 3 premières leçons (compte-rendu, rendez-vous client, mail administratif). Rien à ajouter ici pour l'instant, c'est ton socle.

### 1.4 — Discernement (savoir si la réponse de l'IA est fiable) — **le vrai trou dans ta V1**
Chez Anthropic, une étape à part entière du framework : apprendre à évaluer une réponse avant de l'utiliser.
**Leçon proposée** : "L'IA t'a répondu. Peux-tu lui faire confiance ?" — on donne à l'utilisateur une réponse générée par l'IA contenant une erreur discrète (un chiffre faux, une affirmation trop catégorique), et on lui demande de la repérer. C'est une compétence différente de "bien écrire son prompt" et elle manque totalement à ta V1 actuelle.

### 1.5 — La boucle Description-Discernement (itérer)
**Leçon proposée** : "Ta première réponse n'est jamais la bonne — voici comment la corriger" — montrer qu'il faut reformuler/préciser plutôt qu'abandonner après un premier essai décevant. Combat directement le réflexe du novice qui essaie une fois et laisse tomber.

### 1.6 — Diligence (vérifier, rester responsable)
**Leçon proposée** : "3 erreurs à ne jamais faire en copiant-collant une réponse IA" — sensibiliser sans faire peur : toujours relire, ne jamais envoyer tel quel à un client/employeur, savoir que la responsabilité finale reste la sienne.

---

## BLOC 2 — Usage professionnel par métier

Anthropic propose déjà des guides séparés par fonction : RH, Marketing, Ventes, Gestion de produit, Ingénierie. Ça valide directement ton découpage par métier et donne un ordre de priorité pour élargir tes parcours pro au-delà du commercial déjà couvert :

- **RH** (à faire ensuite, priorité haute vu ta cible PME) → leçons possibles : rédiger une fiche de poste, préparer une grille d'entretien, reformuler une annonce d'offre d'emploi
- **Marketing/communication** → rédiger un post réseau social, décliner un message en plusieurs formats
- **Gestion de produit / Ingénierie** → hors cible pour l'instant, ton public PME normand n'en a pas l'usage

---

## BLOC 3 — Fonctionnalités pratiques de l'outil (Claude 101)

Leur cours d'introduction couvre les bases d'usage : conversations structurées, "Projects" (garder du contexte sans tout retaper), upload de documents.
**Leçon proposée** : "Arrête de tout réexpliquer à chaque fois" — leçon courte sur l'idée qu'on peut garder du contexte d'une conversation à l'autre au lieu de repartir de zéro à chaque prompt. Utile en leçon un peu plus avancée, une fois les bases acquises.

---

## Ce qui n'est PAS pertinent pour ton SaaS

Le troisième grand bloc de leur catalogue (API, Claude Code, MCP, agents, déploiement cloud) est entièrement destiné aux développeurs — aucune valeur pour ton public de salariés/cadres non-tech et de particuliers. À ignorer complètement, sauf si un jour tu vises un public IT (pas ton plan actuel).

---

## BLOC 4 — Issu d'autres ressources (Elements of AI, chaînes YouTube grand public)

### 4.1 — Pourquoi l'IA peut dire des choses fausses avec assurance
Inspiré des modules "limites et biais" d'Elements of AI et du style de vulgarisation de chaînes comme Défend Intelligence.
**Leçon proposée** : "Pourquoi l'IA ment parfois sans le savoir" — explique en langage simple le principe de l'hallucination (l'IA complète un texte de façon plausible, pas toujours vraie), avec un exemple concret où l'utilisateur doit repérer l'erreur. Complète directement le bloc "Discernement" (1.4) avec un angle différent : comprendre la cause plutôt que juste détecter l'erreur.

### 4.2 — L'IA a des biais parce qu'elle a appris sur des données humaines
**Leçon proposée** : "Ton IA a des préjugés — voici pourquoi" — mise en situation où une réponse de l'IA reflète un biais courant (ex. stéréotype de genre dans une description de métier), l'utilisateur doit le repérer et reformuler sa demande pour l'éviter. Bonne leçon de sensibilisation, complémentaire au bloc Diligence (1.6).

---

## Le constat le plus important de cette analyse

Tes 3 leçons actuelles couvrent uniquement l'étape "Description" (bien formuler sa demande) du framework en 4 étapes. Il te manque tout le volet **Discernement** (savoir juger une réponse) et **Diligence** (vérifier, rester responsable) — deux compétences aussi importantes que "bien écrire un prompt", et qui n'existent dans aucune de tes leçons actuelles. Je recommande de les intégrer dès le prochain lot de leçons (idées 1.4 et 1.6 ci-dessus) : c'est exactement le genre de trou qu'un concurrent pourrait combler avant toi, et c'est aussi ce qui rendrait ton produit plus complet qu'un simple "générateur de prompts".
