-- 5min IA — seed content, lot 6: nouvelles dynamiques de leçon (V1.1).
-- Run after schema.sql, all seed_lotN scripts, and migration_lesson_types.sql
-- (needs the type_lecon/contenu/piliers columns to exist). Safe to re-run.
--
-- One playable example of each of the 9 new type_lecon values, on the Pro
-- track (metier null) so every account can reach them regardless of métier.
-- Not part of any paid "groupe" folder (groupe stays null) — these are free,
-- regular lessons like the rest.

delete from public.lessons where titre in (
  'Rédiger un compte-rendu de réunion, et comprendre pourquoi ça marche',
  'Un client agressif t''écrit — qu''aurais-tu fait ?',
  'Devine quel prompt donne le meilleur post LinkedIn',
  'Corrige ce prompt trop vague',
  'Préparer un rendez-vous client en 45 secondes chrono',
  'Trois réponses sur le CDI — laquelle est fiable ?',
  'Repère le biais dans cette description de poste',
  'Ta première réponse est décevante — relance-la',
  'Écrire un mail administratif — Claude te questionne d''abord'
);

insert into public.lessons
  (track, metier, ordre, titre, mise_en_situation, consigne, criteres_evaluation, type_lecon, contenu, piliers)
values
(
  'pro', null, 22,
  'Rédiger un compte-rendu de réunion, et comprendre pourquoi ça marche',
  $$Tu sors d'une réunion d'1h. Tu as pris des notes en vrac, à la va-vite. Il faut maintenant en faire un compte-rendu clair à envoyer à l'équipe.$$,
  $$Écris le prompt que tu enverrais à Claude pour transformer ces notes en compte-rendu structuré.

Notes fournies en exemple :
"Appel entreprise lundi 14h, parle avec le gérant, entrepôt 800m2, problème de perte de traçabilité des colis, 3 personnes gèrent le stock chacun sur son fichier excel, veut un truc simple, budget pas clair, rappeler mardi pour fixer un rdv."$$,
  $$Le prompt doit demander une structure claire (contexte / problématiques / actions à faire / points en suspens), préciser un ton ou un format, et ne pas se contenter de "résume ça". Récompense la précision, pas la longueur.$$,
  'explication_etendue',
  $${"explication_principe": "Un bon prompt donne toujours trois choses : le contexte (d'où ça vient), la consigne (ce qu'on veut), et le format (comment le présenter). Sans l'une des trois, l'IA doit deviner — et elle devine rarement juste."}$$::jsonb,
  array['description']
),
(
  'pro', null, 23,
  'Un client agressif t''écrit — qu''aurais-tu fait ?',
  $$Un client t'envoie un message agressif suite à un retard de livraison. Tu veux utiliser l'IA pour préparer ta réponse.$$,
  $$Choisis l'action que tu aurais menée.$$,
  $$Leçon à choix multiples : l'évaluation est automatique, basée sur le choix sélectionné.$$,
  'qu_aurais_tu_fait',
  $${
    "situation": "Un client t'envoie un message agressif suite à un retard de livraison. Tu veux utiliser l'IA pour préparer ta réponse.",
    "choix": [
      {"id": "a", "label": "Demander à l'IA d'écrire une réponse ferme qui remet le client à sa place", "bonne": false, "explication": "Risqué : tu perds le client sans résoudre le problème."},
      {"id": "b", "label": "Demander à l'IA de préparer une réponse qui reconnaît le problème, explique la cause, et propose un geste commercial", "bonne": true, "explication": "Tu désamorces la tension et gardes la relation."},
      {"id": "c", "label": "Ne pas répondre tout de suite, demander à l'IA si ça vaut le coup d'attendre", "bonne": false, "explication": "Mauvaise idée : un client agressif qui n'a pas de réponse rapide s'énerve davantage."}
    ]
  }$$::jsonb,
  array['discernement', 'diligence']
),
(
  'pro', null, 24,
  'Devine quel prompt donne le meilleur post LinkedIn',
  $$Tu veux préparer un post LinkedIn pour parler de ton usage de l'IA.$$,
  $$Devine quel prompt donne la meilleure réponse.$$,
  $$Leçon à choix : l'évaluation est automatique, basée sur le choix sélectionné.$$,
  'devine_la_difference',
  $${
    "situation": "Tu veux préparer un post LinkedIn pour parler de ton usage de l'IA.",
    "prompt_faible": "Écris-moi un post LinkedIn sur l'IA",
    "reponse_faible": "« L'intelligence artificielle transforme notre façon de travailler. Elle offre de nombreuses opportunités pour gagner en productivité et innover. #IA #Innovation #Productivité »",
    "prompt_fort": "Écris-moi un post LinkedIn qui raconte une vraie difficulté que j'ai eue avant de comprendre un truc sur l'IA, ton personnel, pas de langage corporate",
    "reponse_fort": "« Pendant des mois, j'ai écrit des prompts d'une ligne à Claude en espérant des miracles. Résultat : des réponses génériques que je réécrivais à moitié. Le déclic est venu le jour où j'ai commencé à donner du contexte, comme à un collègue. Depuis, je gagne un temps fou. »",
    "explication": "La différence n'est pas la longueur, c'est la précision du contexte personnel demandé."
  }$$::jsonb,
  array['description']
),
(
  'pro', null, 25,
  'Corrige ce prompt trop vague',
  $$Tu tapes souvent des prompts sur le pouce, sans trop y réfléchir. Voici un exemple typique de prompt bâclé, envoyé tel quel à l'IA.$$,
  $$Ce prompt est trop vague pour être utile. Corrige-le pour qu'il donne un vrai résultat exploitable.$$,
  $$Le prompt corrigé doit ajouter le contexte (quel client, quelle situation) et une consigne précise sur le résultat attendu. Un prompt qui reste aussi vague que l'original doit être noté bas.$$,
  'corrige_le_prompt',
  $${"prompt_depart": "Aide-moi avec mon client"}$$::jsonb,
  array['description']
),
(
  'pro', null, 26,
  'Préparer un rendez-vous client en 45 secondes chrono',
  $$Tu as un rendez-vous client demain matin et tu n'as pas eu le temps de te préparer. Tu as juste le nom de l'entreprise et le sujet du rendez-vous. Cette fois, le temps presse vraiment.$$,
  $$Écris le prompt que tu enverrais à Claude pour qu'il t'aide à préparer les points clés à aborder et les questions à poser — avant que le chrono n'arrive à zéro.$$,
  $$Le prompt doit donner du contexte (secteur, objectif du rdv, ce qu'on vend), demander un format actionnable (liste de points, questions), et éviter une demande trop vague ("aide-moi pour mon rdv").$$,
  'defi_chronometre',
  $${"chrono_secondes": 45}$$::jsonb,
  array['description', 'delegation']
),
(
  'pro', null, 27,
  'Trois réponses sur le CDI — laquelle est fiable ?',
  $$Tu poses une question juridique à l'IA et reçois trois réponses très différentes dans le ton.$$,
  $$Choisis la réponse la plus fiable.$$,
  $$Leçon à choix : l'évaluation est automatique, basée sur le choix sélectionné.$$,
  'choisis_la_fiable',
  $${
    "question": "Quelles sont les obligations légales pour un contrat de travail en CDI ?",
    "reponses": [
      {"id": "a", "label": "Réponse A", "texte": "Un CDI doit obligatoirement être écrit, signé sous 48h, et inclure une clause de non-concurrence de 2 ans minimum.", "fiable": false},
      {"id": "b", "label": "Réponse B", "texte": "En France, un CDI peut être verbal, mais l'écrit est fortement recommandé. Les grandes lignes incluent la rémunération, le poste et la durée du travail — pour les détails précis (préavis, clauses spécifiques), mieux vaut vérifier avec un professionnel du droit du travail.", "fiable": true},
      {"id": "c", "label": "Réponse C", "texte": "Il y a plusieurs règles à respecter, ça dépend des cas.", "fiable": false}
    ],
    "explication": "Une réponse fiable reconnaît ses limites plutôt que d'affirmer avec un aplomb qui cache l'incertitude."
  }$$::jsonb,
  array['discernement']
),
(
  'pro', null, 28,
  'Repère le biais dans cette description de poste',
  $$Tu as demandé à l'IA de rédiger une description de poste de manager, sans préciser de genre.$$,
  $$Cette réponse contient un biais. Repère le passage qui le montre.$$,
  $$Leçon à choix : l'évaluation est automatique, basée sur le choix sélectionné.$$,
  'trouve_erreur',
  $${
    "reponse_texte": "Nous recherchons un manager expérimenté pour notre équipe commerciale. Il devra encadrer une équipe de 5 personnes, définir les objectifs trimestriels et rendre compte directement à la direction. Il est attendu qu'il fasse preuve de leadership et de rigueur dans le suivi des indicateurs.",
    "consigne_choix": "Cette réponse contient un biais. Lequel des passages suivants le montre le mieux ?",
    "passages": [
      {"id": "a", "texte": "Il devra encadrer une équipe de 5 personnes", "correct": false},
      {"id": "b", "texte": "Il est attendu qu'il fasse preuve de leadership et de rigueur", "correct": true},
      {"id": "c", "texte": "rendre compte directement à la direction", "correct": false}
    ],
    "explication": "L'IA utilise systématiquement « il » pour ce poste alors que rien dans le contexte n'indique le genre — elle reproduit parfois des stéréotypes présents dans ses données d'entraînement, même sans mauvaise intention. Le réflexe : reformuler la demande pour l'éviter explicitement."
  }$$::jsonb,
  array['diligence']
),
(
  'pro', null, 29,
  'Ta première réponse est décevante — relance-la',
  $$Tu demandes à l'IA de préparer un plan de post pour tes réseaux sociaux.$$,
  $$La réponse est trop générique. Écris une relance pour obtenir mieux.$$,
  $$La relance doit apporter une précision nouvelle (exemple concret demandé, ton, longueur, plateforme visée), pas juste répéter "sois plus précis". Un message qui ne fait que redire la même consigne sans rien ajouter de concret doit être noté bas.$$,
  'relance_en_deux_temps',
  $${
    "situation": "Tu demandes à l'IA de préparer un plan de post pour tes réseaux sociaux.",
    "premiere_reponse": "Voici un plan de post pour vos réseaux sociaux : 1. Introduction accrocheuse. 2. Présentez votre sujet. 3. Développez vos idées avec des exemples. 4. Ajoutez un appel à l'action. 5. Terminez par une question pour encourager les commentaires."
  }$$::jsonb,
  array['description', 'discernement']
),
(
  'pro', null, 30,
  'Écrire un mail administratif — Claude te questionne d''abord',
  $$Tu dois écrire un mail à la CAF ou aux impôts pour contester quelque chose, mais tu ne sais pas comment le formuler correctement.$$,
  $$Écris le prompt que tu enverrais à Claude pour obtenir un mail clair et bien formulé, à partir de ta situation.$$,
  $$Le prompt doit inclure les faits concrets de la situation (montant, date, ce qui semble incohérent), préciser le ton souhaité (poli mais ferme), et demander une structure de lettre administrative plutôt qu'un simple brouillon.$$,
  'question_guidee',
  $${"question_reflexive": "Avant de voir mon retour complet : qu'est-ce qui, selon toi, manque peut-être dans ta demande ?"}$$::jsonb,
  array['discernement', 'description']
);
