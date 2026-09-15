-- 5min IA — seed content, lot 8: mini-cours "Claude 101" pour vrais débutants.
-- Run after schema.sql, all previous seed_lotN scripts, and
-- migration_lesson_types.sql. Safe to re-run (clears and re-inserts these
-- lessons by titre).
--
-- 4 leçons d'introduction, placées AVANT la leçon 1 actuelle (ordre négatif,
-- donc affichées en premier) pour ne perdre personne dès le jour 0 : ce
-- qu'est une conversation avec l'IA, comment ne plus tout retaper à chaque
-- fois, donner un document à lire, et continuer une conversation plutôt que
-- d'en recommencer une nouvelle. Génériques aux deux parcours (metier null).

delete from public.lessons where titre in (
  'Comprendre ce qu''est une conversation avec l''IA',
  'Garder le contexte sans tout retaper',
  'Donner un document à lire à l''IA',
  'Une conversation, plusieurs échanges'
);

insert into public.lessons
  (track, metier, ordre, titre, mise_en_situation, consigne, criteres_evaluation, type_lecon, contenu, piliers)
values
(
  'pro', null, -4,
  'Comprendre ce qu''est une conversation avec l''IA',
  $$Tu ouvres Claude pour la première fois. Tu tapes une question courte en imaginant qu'il "sait déjà" qui tu es et ce que tu fais dans la vie — comme avec un moteur de recherche.$$,
  $$Écris le tout premier prompt que tu enverrais à Claude pour bien démarrer une conversation utile, en te présentant et en donnant le contexte minimum nécessaire, plutôt que de partir d'une question sèche.$$,
  $$Le prompt doit inclure au moins un élément de contexte sur qui est l'utilisateur ou ce qu'il cherche à faire, pas juste une question isolée sans aucune présentation. Un prompt du type "c'est quoi la meilleure stratégie ?" sans aucun contexte doit être noté bas. Récompense un prompt qui montre que l'utilisateur a compris qu'une conversation démarre à zéro à chaque fois.$$,
  'standard', null, array['description']
),
(
  'pro', null, -3,
  'Garder le contexte sans tout retaper',
  $$Chaque jour, tu recommences une nouvelle conversation avec Claude et tu retapes les mêmes informations sur toi (ton métier, tes préférences). Tu commences à trouver ça lourd.$$,
  $$Écris le prompt que tu enverrais pour résumer, en une fois, les informations stables sur toi que tu voudrais que Claude retienne durablement (dans les instructions personnalisées ou un Projet), pour ne plus avoir à les répéter.$$,
  $$Le prompt doit contenir des informations vraiment stables, pas un besoin ponctuel du jour, organisées clairement. Récompense un texte réutilisable qui pourrait être collé tel quel dans les paramètres de Claude.$$,
  'explication_etendue',
  $${"explication_principe": "Une conversation Claude ne se souvient de rien d'une fois sur l'autre, sauf si tu utilises les instructions personnalisées ou un « Projet » — un espace où tu poses une fois pour toutes le contexte qui reste vrai à chaque fois. C'est la différence entre reprendre à zéro et vraiment construire un outil qui te connaît."}$$::jsonb,
  array['description']
),
(
  'pro', null, -2,
  'Donner un document à lire à l''IA',
  $$Tu as un long document (contrat, guide interne, notes) et tu voudrais que l'IA t'aide à y voir clair, plutôt que de tout relire toi-même.$$,
  $$Écris le prompt que tu utiliserais pour donner ce document à Claude (collé dans le message ou en pièce jointe) et lui poser une première question dessus.$$,
  $$Le prompt doit préciser clairement ce qu'on veut que l'IA fasse avec le document (résumer, répondre à une question précise, repérer un point particulier), pas juste "lis ça". Récompense un prompt qui pose une vraie question exploitable sur le contenu, plutôt qu'une demande vague.$$,
  'standard', null, array['description']
),
(
  'pro', null, -1,
  'Une conversation, plusieurs échanges',
  $$Tu poses une première question à Claude et sa réponse est correcte, mais pas exactement ce dont tu as besoin. Beaucoup de débutants referment la conversation et recommencent de zéro ailleurs — alors qu'il suffit de continuer à échanger.$$,
  $$Cette réponse est trop générale pour toi. Plutôt que de recommencer une nouvelle conversation, écris la relance qui va préciser ta vraie situation pour obtenir un conseil réellement utile.$$,
  $$La relance doit apporter un vrai contexte personnel nouveau (la situation précise, le problème concret), pas juste redire "sois plus précis". Récompense une relance qui montre que l'utilisateur a compris qu'il peut continuer la même conversation plutôt que d'en ouvrir une nouvelle.$$,
  'relance_en_deux_temps',
  $${
    "situation": "Tu demandes à Claude des conseils pour être plus organisé au travail.",
    "premiere_reponse": "Voici quelques conseils généraux pour être plus organisé au travail : priorisez vos tâches, utilisez un agenda, et accordez-vous des pauses régulières."
  }$$::jsonb,
  array['description', 'discernement']
);

-- Même contenu, adapté et dupliqué pour le parcours Particulier (ordre
-- négatif aussi, pour que personne ne soit largué dès le jour 0, quel que
-- soit le parcours).
insert into public.lessons
  (track, metier, ordre, titre, mise_en_situation, consigne, criteres_evaluation, type_lecon, contenu, piliers)
values
(
  'particulier', null, -4,
  'Comprendre ce qu''est une conversation avec l''IA',
  $$Tu ouvres Claude pour la première fois. Tu tapes une question courte en imaginant qu'il "sait déjà" qui tu es et ce que tu vis — comme avec un moteur de recherche.$$,
  $$Écris le tout premier prompt que tu enverrais à Claude pour bien démarrer une conversation utile, en te présentant et en donnant le contexte minimum nécessaire, plutôt que de partir d'une question sèche.$$,
  $$Le prompt doit inclure au moins un élément de contexte sur qui est l'utilisateur ou ce qu'il cherche à faire, pas juste une question isolée sans aucune présentation. Un prompt du type "c'est quoi la meilleure solution ?" sans aucun contexte doit être noté bas. Récompense un prompt qui montre que l'utilisateur a compris qu'une conversation démarre à zéro à chaque fois.$$,
  'standard', null, array['description']
),
(
  'particulier', null, -3,
  'Garder le contexte sans tout retaper',
  $$Chaque fois que tu demandes de l'aide à Claude pour ta vie quotidienne, tu retapes les mêmes informations sur toi (ta situation, tes préférences). Tu commences à trouver ça lourd.$$,
  $$Écris le prompt que tu enverrais pour résumer, en une fois, les informations stables sur toi que tu voudrais que Claude retienne durablement (dans les instructions personnalisées ou un Projet), pour ne plus avoir à les répéter.$$,
  $$Le prompt doit contenir des informations vraiment stables, pas un besoin ponctuel du jour, organisées clairement. Récompense un texte réutilisable qui pourrait être collé tel quel dans les paramètres de Claude.$$,
  'explication_etendue',
  $${"explication_principe": "Une conversation Claude ne se souvient de rien d'une fois sur l'autre, sauf si tu utilises les instructions personnalisées ou un « Projet » — un espace où tu poses une fois pour toutes le contexte qui reste vrai à chaque fois. C'est la différence entre reprendre à zéro et vraiment construire un outil qui te connaît."}$$::jsonb,
  array['description']
),
(
  'particulier', null, -2,
  'Donner un document à lire à l''IA',
  $$Tu as un long document (bail, courrier administratif, notice) et tu voudrais que l'IA t'aide à y voir clair, plutôt que de tout relire toi-même.$$,
  $$Écris le prompt que tu utiliserais pour donner ce document à Claude (collé dans le message ou en pièce jointe) et lui poser une première question dessus.$$,
  $$Le prompt doit préciser clairement ce qu'on veut que l'IA fasse avec le document (résumer, répondre à une question précise, repérer un point particulier), pas juste "lis ça". Récompense un prompt qui pose une vraie question exploitable sur le contenu, plutôt qu'une demande vague.$$,
  'standard', null, array['description']
),
(
  'particulier', null, -1,
  'Une conversation, plusieurs échanges',
  $$Tu poses une première question à Claude et sa réponse est correcte, mais pas exactement ce dont tu as besoin. Beaucoup de débutants referment la conversation et recommencent de zéro ailleurs — alors qu'il suffit de continuer à échanger.$$,
  $$Cette réponse est trop générale pour toi. Plutôt que de recommencer une nouvelle conversation, écris la relance qui va préciser ta vraie situation pour obtenir un conseil réellement utile.$$,
  $$La relance doit apporter un vrai contexte personnel nouveau (la situation précise, le problème concret), pas juste redire "sois plus précis". Récompense une relance qui montre que l'utilisateur a compris qu'il peut continuer la même conversation plutôt que d'en ouvrir une nouvelle.$$,
  'relance_en_deux_temps',
  $${
    "situation": "Tu demandes à Claude des conseils pour être mieux organisé dans ta vie de tous les jours.",
    "premiere_reponse": "Voici quelques conseils généraux pour être plus organisé : priorisez vos tâches, utilisez un agenda, et accordez-vous des pauses régulières."
  }$$::jsonb,
  array['description', 'discernement']
);
