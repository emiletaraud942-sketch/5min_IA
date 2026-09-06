-- 5min IA — seed content for the first 3 lessons.
-- Run after schema.sql. Safe to re-run (clears and re-inserts these 3 lessons by titre).

delete from public.lessons where titre in (
  'Rédiger un compte-rendu de réunion en 2 minutes',
  'Préparer un rendez-vous client en 5 minutes',
  'Écrire un mail administratif compliqué'
);

insert into public.lessons (track, metier, ordre, titre, mise_en_situation, consigne, criteres_evaluation)
values
(
  'pro',
  null,
  1,
  'Rédiger un compte-rendu de réunion en 2 minutes',
  $$Tu sors d'une réunion d'1h. Tu as pris des notes en vrac, à la va-vite. Il faut maintenant en faire un compte-rendu clair à envoyer à l'équipe.$$,
  $$Écris le prompt que tu enverrais à Claude pour transformer ces notes en compte-rendu structuré.

Notes fournies à l'utilisateur en exemple :
"Appel entreprise lundi 14h, parle avec le gérant, entrepôt 800m2, problème de perte de traçabilité des colis, 3 personnes gèrent le stock chacun sur son fichier excel, veut un truc simple, budget pas clair, rappeler mardi pour fixer un rdv."$$,
  $$Le prompt doit demander une structure claire (ex : contexte / problématiques / actions à faire / points en suspens), préciser un ton ou un format, et ne pas se contenter de "résume ça". Récompense la précision, pas la longueur.$$
),
(
  'pro',
  'commercial',
  2,
  'Préparer un rendez-vous client en 5 minutes',
  $$Tu as un rendez-vous client demain matin et tu n'as pas eu le temps de te préparer. Tu as juste le nom de l'entreprise et le sujet du rendez-vous.$$,
  $$Écris le prompt que tu enverrais à Claude pour qu'il t'aide à préparer les points clés à aborder et les questions à poser.$$,
  $$Le prompt doit donner du contexte (secteur, objectif du rdv, ce qu'on vend), demander un format actionnable (liste de points, questions), et éviter une demande trop vague ("aide-moi pour mon rdv").$$
),
(
  'particulier',
  null,
  1,
  'Écrire un mail administratif compliqué',
  $$Tu dois écrire un mail à la CAF ou aux impôts pour contester quelque chose, mais tu ne sais pas comment le formuler correctement.$$,
  $$Écris le prompt que tu enverrais à Claude pour obtenir un mail clair et bien formulé, à partir de ta situation.$$,
  $$Le prompt doit inclure les faits concrets de la situation (montant, date, ce qui semble incohérent), préciser le ton souhaité (poli mais ferme), et demander une structure de lettre administrative plutôt qu'un simple brouillon.$$
);
