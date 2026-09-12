-- 5min IA — seed content, lot 4: "Construire ton agent IA au travail" (Pro).
-- Run after schema.sql, seed.sql, seed_lot2.sql and seed_lot3.sql. Safe to
-- re-run (clears and re-inserts these lessons by titre).
--
-- Contexte : les leçons précédentes couvrent une compétence à la fois
-- (Description / Discernement / Diligence). Ce lot est un parcours de 15
-- leçons continu, générique à tous les métiers, qui construit pas à pas un
-- "agent" IA personnel au travail : un Claude bien configuré (rôle,
-- instructions permanentes, contexte, prompts-modèles réutilisables) plutôt
-- qu'un simple générateur de réponses ponctuelles. Chaque leçon explique
-- explicitement le "pourquoi" avant le "comment" pour ne perdre personne en
-- route : 1-4 posent les fondations (rôle, instructions, ton, contexte),
-- 5-11 construisent les usages concrets (tâches récurrentes, relecture,
-- questions, compte-rendu, priorisation, documents longs, processus),
-- 12-13 posent les limites (incertitude, garde-fous), 14-15 font vivre et
-- partager l'agent dans la durée (bilan, documentation).

delete from public.lessons where titre in (
  'Donne un rôle précis à ton agent, pas une mission floue',
  'Écrire les instructions permanentes de ton agent',
  'Donner le bon ton par défaut à ton agent',
  'Donner à ton agent le contexte qui ne change jamais',
  'Créer ton premier prompt réutilisable pour une tâche récurrente',
  'Apprendre à ton agent à se relire lui-même',
  'Apprendre à ton agent à te poser des questions avant de répondre',
  'Automatiser ton compte-rendu hebdomadaire',
  'Apprendre à ton agent à prioriser une liste en vrac',
  'Donner à ton agent un document long comme mémoire',
  'Construire un processus en plusieurs étapes',
  'Apprendre à ton agent à dire qu''il ne sait pas',
  'Fixer les limites de ce que ton agent ne doit jamais faire seul',
  'Faire le bilan mensuel de ton agent',
  'Documenter ton agent pour qu''il ne reste pas que dans ta tête'
);

insert into public.lessons (track, metier, ordre, titre, mise_en_situation, consigne, criteres_evaluation, groupe)
values
(
  'pro', null, 7,
  'Donne un rôle précis à ton agent, pas une mission floue',
  $$Tu as ouvert Claude en te disant "je vais me faire un assistant pour mon travail", mais tu ne sais pas par où commencer. Tu tapes juste : "Aide-moi dans mon travail au quotidien." La réponse que tu reçois est générique et ne te sert à rien.$$,
  $$Écris le prompt qui décrit précisément à Claude le rôle que tu veux qu'il joue pour toi : sur quelles tâches, dans quel contexte, avec quelles limites. Sois aussi précis que si tu briefais un nouveau collègue.$$,
  $$Le prompt doit préciser au moins : le métier/contexte de l'utilisateur, 2 à 3 tâches concrètes que l'agent doit couvrir en priorité, et ce qui reste hors de son périmètre. Un prompt du type "aide-moi au travail" sans aucune précision doit être noté bas. Récompense un prompt qui définit un périmètre clair et réaliste, plutôt qu'une liste de vœux trop large.$$,
  'agent_pro'
),
(
  'pro', null, 8,
  'Écrire les instructions permanentes de ton agent',
  $$Tu ne veux plus réexpliquer à chaque conversation qui tu es et comment tu veux que Claude te réponde. Tu as entendu parler des instructions personnalisées (dans les paramètres de Claude ou dans un "Projet"), mais tu ne sais pas quoi y mettre.$$,
  $$Rédige le texte d'instructions permanentes que tu mettrais dans les paramètres de Claude (ou dans un Projet) pour qu'il se souvienne durablement de qui tu es, ton contexte de travail, et comment tu veux qu'il te réponde.$$,
  $$Le texte doit couvrir : qui est l'utilisateur (métier/contexte), le ton attendu par défaut (ex : direct, sans jargon, avec des listes), et une consigne de comportement claire (ex : poser une question si l'info manque plutôt que d'inventer). Une simple phrase du type "sois utile et clair" sans contexte concret doit être notée bas. Récompense des instructions qui resteraient valables sur des dizaines de conversations différentes, pas juste pour une tâche ponctuelle.$$,
  'agent_pro'
),
(
  'pro', null, 9,
  'Donner le bon ton par défaut à ton agent',
  $$Un collègue a testé ton agent en lui demandant de rédiger un mail à sa place, et le résultat était trop formel et robotique alors que dans ton équipe on écrit de façon plus directe et chaleureuse. Le fond était bon, le ton ne collait pas.$$,
  $$Écris le prompt (ou l'ajout à tes instructions permanentes) qui explique précisément à Claude le style d'écriture que tu veux par défaut : niveau de formalité, longueur, tournures à éviter.$$,
  $$Le prompt doit donner des repères concrets sur le ton (ex : tutoiement ou vouvoiement, phrases courtes ou longues, avec ou sans formules de politesse type "cordialement") plutôt qu'un adjectif vague comme "sois sympa". Idéalement, il inclut un exemple de phrase ou un contre-exemple à éviter. Récompense la précision et les exemples concrets plutôt qu'une description abstraite du ton souhaité.$$,
  'agent_pro'
),
(
  'pro', null, 10,
  'Donner à ton agent le contexte qui ne change jamais',
  $$Chaque fois que tu demandes de l'aide à Claude sur un dossier, tu dois réexpliquer en quoi consiste ton poste, ton entreprise et ton secteur. C'est cette info stable, pas le dossier ponctuel du jour, qu'il faudrait ne donner qu'une seule fois.$$,
  $$Rédige le prompt qui résume, en une fois, le contexte stable de ton poste (entreprise, secteur, taille d'équipe, type de clients ou de missions) à donner à ton agent pour qu'il n'ait plus besoin de le redemander.$$,
  $$Le prompt doit contenir des informations qui restent vraies sur plusieurs mois (pas un dossier ponctuel), organisées clairement, par exemple en quelques puces. Un prompt qui mélange contexte stable et détail d'un cas précis du jour doit être noté moyen. Récompense un texte réutilisable tel quel dans un Projet ou des instructions permanentes.$$,
  'agent_pro'
),
(
  'pro', null, 11,
  'Créer ton premier prompt réutilisable pour une tâche récurrente',
  $$Chaque lundi, tu passes 20 minutes à rédiger le même type de message de lancement de semaine à ton équipe, en changeant juste 2 ou 3 détails. C'est exactement le genre de tâche qu'un prompt réutilisable peut t'éviter de refaire de zéro.$$,
  $$Identifie une tâche que tu fais régulièrement (au moins une fois par semaine) et écris un prompt-modèle réutilisable pour cette tâche, avec des emplacements clairs à remplir à chaque fois (ex : [ORDRE_DU_JOUR], [NOM_CLIENT]).$$,
  $$Le prompt doit être structuré comme un vrai modèle réutilisable, avec des variables ou emplacements explicites à remplacer, pas un prompt écrit pour un seul cas précis. Récompense un prompt que l'utilisateur pourrait littéralement recopier-coller la semaine prochaine en changeant seulement 2 ou 3 mots.$$,
  'agent_pro'
),
(
  'pro', null, 12,
  'Apprendre à ton agent à se relire lui-même',
  $$Ton agent t'a donné une première version d'un document, mais tu sais par expérience qu'une première réponse contient souvent des approximations. Plutôt que de tout relire toi-même ligne par ligne, tu veux qu'il fasse un premier passage de relecture critique.$$,
  $$Écris le prompt qui demande à Claude de relire de façon critique sa propre réponse précédente et de signaler les points faibles ou incertains, avant que toi tu la valides.$$,
  $$Le prompt doit demander explicitement une auto-critique ciblée (ex : repérer les affirmations non vérifiées, les formulations ambiguës, les oublis probables), pas juste "relis-toi". Récompense un prompt qui donne des critères précis de relecture plutôt qu'une demande vague.$$,
  'agent_pro'
),
(
  'pro', null, 13,
  'Apprendre à ton agent à te poser des questions avant de répondre',
  $$Tu demandes à ton agent de préparer un plan d'action, mais il te manque des infos qu'il ne peut pas deviner (budget, délai, priorité). Plutôt que de le laisser inventer, tu veux qu'il te les demande d'abord.$$,
  $$Écris le prompt qui demande à Claude de poser les questions nécessaires avant de répondre, plutôt que de faire des hypothèses, chaque fois qu'une information essentielle lui manque.$$,
  $$Le prompt doit contenir une consigne explicite du type "si une information te manque, demande-la moi avant de répondre" plutôt que d'espérer que Claude le fasse spontanément. Récompense un prompt qui précise sur quel type d'information cette règle s'applique (les infos qui changent vraiment la réponse), pas une règle si générale qu'elle bloquerait toute réponse simple.$$,
  'agent_pro'
),
(
  'pro', null, 14,
  'Automatiser ton compte-rendu hebdomadaire',
  $$Chaque vendredi, tu dois envoyer un résumé de la semaine à ton manager, à partir de notes prises en vrac dans la semaine. C'est une tâche récurrente parfaite à déléguer à ton agent, une fois le bon prompt en place.$$,
  $$Écris le prompt-modèle que tu utiliserais chaque vendredi pour transformer tes notes de la semaine en compte-rendu prêt à envoyer, avec une structure fixe que tu réutilises à chaque fois.$$,
  $$Le prompt doit imposer une structure fixe et réutilisable (ex : réalisations / points bloquants / priorités semaine prochaine), pas juste "résume ma semaine". Récompense un prompt qui pourrait tourner en pilote automatique chaque vendredi sans être réécrit.$$,
  'agent_pro'
),
(
  'pro', null, 15,
  'Apprendre à ton agent à prioriser une liste en vrac',
  $$Tu balances à ton agent une liste de dix tâches en vrac, sans ordre. Tu veux qu'il t'aide à savoir par quoi commencer, pas juste qu'il reformate la liste.$$,
  $$Écris le prompt qui demande à Claude de prioriser une liste de tâches selon des critères que tu donnes (urgence, impact, dépendances), pas juste de la remettre en forme.$$,
  $$Le prompt doit donner explicitement les critères de priorisation à appliquer (ex : ce qui bloque d'autres personnes en premier, ce qui a une échéance proche) plutôt que de demander vaguement "aide-moi à prioriser". Récompense un prompt qui produit un ordre justifié, pas juste une liste réorganisée sans explication.$$,
  'agent_pro'
),
(
  'pro', null, 16,
  'Donner à ton agent un document long comme mémoire',
  $$Tu as un guide interne de vingt pages que tu consultes régulièrement. Plutôt que de chercher dedans à chaque fois, tu veux pouvoir le donner une fois à ton agent et lui poser des questions dessus.$$,
  $$Écris le prompt que tu utiliserais pour donner un document long à Claude (en pièce jointe ou collé) et lui demander de répondre à tes questions en te citant précisément où il a trouvé l'information dans le document.$$,
  $$Le prompt doit demander explicitement que les réponses s'appuient sur le document fourni et le signalent, plutôt que sur des connaissances générales, et idéalement demander une citation ou un renvoi à la section concernée. Récompense un prompt qui réduit le risque que l'IA invente une réponse plutôt que de chercher dans le document.$$,
  'agent_pro'
),
(
  'pro', null, 17,
  'Construire un processus en plusieurs étapes',
  $$Préparer un appel d'offres demande plusieurs étapes à la suite : analyser le besoin, lister les points à couvrir, rédiger une première version, puis la relire. Aujourd'hui tu fais ça en plusieurs prompts décousus, sans fil conducteur.$$,
  $$Écris le prompt qui décrit à Claude un processus en plusieurs étapes numérotées pour une tâche complexe de ton travail, en lui demandant de suivre les étapes une par une plutôt que de tout faire d'un coup.$$,
  $$Le prompt doit lister des étapes numérotées et logiquement enchaînées, chaque étape s'appuyant sur la précédente, pas une simple liste de tâches indépendantes. Récompense un prompt qui prévoit un point de validation intermédiaire (ex : "attends ma validation après l'étape 2") plutôt qu'un enchaînement automatique sans contrôle.$$,
  'agent_pro'
),
(
  'pro', null, 18,
  'Apprendre à ton agent à dire qu''il ne sait pas',
  $$Ton agent t'a donné une réponse très assurée sur un point réglementaire de ton métier. Tu te rends compte après coup qu'il n'avait probablement pas l'information exacte et qu'il a comblé le vide avec une réponse plausible.$$,
  $$Écris le prompt (ou l'ajout à tes instructions permanentes) qui demande explicitement à Claude de signaler clairement quand il n'est pas sûr d'une information, plutôt que de répondre avec la même assurance dans tous les cas.$$,
  $$Le prompt doit demander un signal explicite d'incertitude (ex : une mention "à vérifier" ou un niveau de confiance) intégré durablement à son comportement, pas juste pour une question ponctuelle. Récompense un prompt qui s'applique à toutes les futures réponses (instruction permanente) plutôt qu'à une seule question isolée.$$,
  'agent_pro'
),
(
  'pro', null, 19,
  'Fixer les limites de ce que ton agent ne doit jamais faire seul',
  $$Tu réalises que ton agent pourrait, si tu ne le lui interdis pas explicitement, rédiger et presque envoyer un message à un client sans que tu valides le fond. Certaines actions doivent toujours passer par toi.$$,
  $$Écris les instructions permanentes qui listent clairement ce que ton agent ne doit jamais faire de lui-même (ex : donner des chiffres officiels non vérifiés, engager un délai ou un prix) sans que tu valides avant.$$,
  $$Le texte doit lister des limites concrètes et vérifiables, pas "sois prudent" mais des actions précises interdites sans validation, en lien avec de vrais risques du métier de l'utilisateur. Récompense une liste réaliste et actionnable plutôt qu'une liste si longue ou vague qu'elle serait inapplicable.$$,
  'agent_pro'
),
(
  'pro', null, 20,
  'Faire le bilan mensuel de ton agent',
  $$Un mois après avoir mis en place ton agent, tu te rends compte qu'il fait encore quelques erreurs récurrentes de ton et qu'il n'a pas capté certaines priorités. C'est le moment d'ajuster ses instructions, pas de tout garder tel quel indéfiniment.$$,
  $$Écris le prompt que tu enverrais à Claude pour lui demander de t'aider à repérer, à partir de 3 ou 4 exemples de réponses récentes qui ne t'ont pas convenu, ce qu'il faudrait changer dans ses instructions permanentes.$$,
  $$Le prompt doit fournir des exemples concrets de ce qui n'a pas fonctionné, pas juste "améliore-toi", et demander explicitement une proposition de modification des instructions permanentes. Récompense un prompt qui transforme des frustrations vagues en changements précis et actionnables.$$,
  'agent_pro'
),
(
  'pro', null, 21,
  'Documenter ton agent pour qu''il ne reste pas que dans ta tête',
  $$Tu pars en congés une semaine et un collègue doit reprendre certaines de tes tâches. Il ne sait pas que tu as un agent bien configuré ni comment il fonctionne : toute cette organisation ne sert à personne d'autre que toi si elle n'est nulle part écrite.$$,
  $$Écris le prompt qui demande à Claude de produire, à partir de tes instructions permanentes et de 2 ou 3 prompts-modèles que tu utilises, une fiche courte expliquant à un collègue comment utiliser ton agent.$$,
  $$Le prompt doit demander un document court et actionnable, pas un pavé théorique, pensé pour quelqu'un qui découvre l'outil, avec des exemples concrets d'usage. Récompense un prompt qui vise vraiment la transmission à un tiers, pas juste un résumé pour soi-même.$$,
  'agent_pro'
);
