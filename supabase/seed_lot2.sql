-- 5min IA — seed content, lot 2: Discernement + Diligence.
-- Run after schema.sql and seed.sql. Safe to re-run (clears and re-inserts these
-- lessons by titre).
--
-- Contexte : les 3 premières leçons couvrent uniquement l'étape "Description"
-- (bien formuler sa demande). Ce lot ajoute les étapes "Discernement" (savoir
-- juger une réponse IA avant de s'y fier) et "Diligence" (rester responsable
-- avant d'envoyer/utiliser une réponse telle quelle). Chaque leçon est
-- déclinée pour les deux parcours (pro générique et particulier) pour que
-- tous les utilisateurs en bénéficient.

delete from public.lessons where titre in (
  'L''IA t''a répondu. Peux-tu lui faire confiance ?',
  '3 réflexes avant d''envoyer une réponse IA telle quelle'
);

insert into public.lessons (track, metier, ordre, titre, mise_en_situation, consigne, criteres_evaluation)
values
(
  'pro',
  null,
  3,
  'L''IA t''a répondu. Peux-tu lui faire confiance ?',
  $$Tu as demandé à Claude de préparer un point chiffré à partir d'un export de données pour ta réunion de cet après-midi. Il te répond avec assurance : "Les ventes du segment entreprise ont progressé de 24% par rapport au trimestre précédent." Tu n'as pas eu le temps de vérifier ce chiffre toi-même, et la réunion commence dans 10 minutes.$$,
  $$Avant de recopier ce chiffre dans ta présentation, écris le prompt que tu enverrais à Claude pour vérifier s'il faut vraiment lui faire confiance sur ce point précis.$$,
  $$Le prompt doit demander à Claude de justifier son calcul ou d'indiquer sur quelles données précises il s'est basé, de signaler son niveau de certitude, et de dire clairement s'il a supposé ou déduit quelque chose plutôt que de l'avoir lu directement dans les données. Un prompt qui se contente de "tu es sûr ?" ou "vérifie" sans redonner le contexte à vérifier doit être noté bas. Récompense un prompt qui remet les données brutes sur la table pour permettre une vraie vérification, pas juste une reformulation rassurante.$$
),
(
  'particulier',
  null,
  2,
  'L''IA t''a répondu. Peux-tu lui faire confiance ?',
  $$Tu as demandé à une IA d'estimer le montant que tu vas devoir rembourser suite à un trop-perçu de la CAF. Elle te répond avec un chiffre précis et un ton très assuré. Tu n'as aucune idée si ce montant est juste, et tu dois décider si tu contestes ou si tu payes.$$,
  $$Avant de faire confiance à ce chiffre, écris le prompt que tu enverrais à l'IA pour vérifier s'il est vraiment fiable.$$,
  $$Le prompt doit demander à l'IA de détailler comment elle est arrivée à ce montant, de préciser sur quelles informations elle s'est basée (et lesquelles elle a supposées faute de les avoir), et d'indiquer son niveau de certitude. Un prompt qui demande juste "tu es sûr ?" sans redonner sa situation précise à revérifier doit être noté bas. Récompense un prompt qui permet de vraiment vérifier le raisonnement, pas seulement d'obtenir une réponse rassurante.$$
),
(
  'pro',
  null,
  4,
  '3 réflexes avant d''envoyer une réponse IA telle quelle',
  $$Claude vient de te rédiger un mail à envoyer à un client important, à partir de quelques informations que tu lui as données en vrac. Le texte est fluide, bien tourné, et tu es tenté de l'envoyer tel quel sans le relire en détail.$$,
  $$Écris le prompt que tu enverrais à Claude pour qu'il t'aide, toi, à relire ce mail de façon critique avant de l'envoyer, plutôt que de simplement lui redemander de le récrire.$$,
  $$Le prompt doit demander à Claude de repérer les éléments à vérifier soi-même avant l'envoi (chiffres, noms propres, dates, engagements pris au nom de l'utilisateur), par exemple sous forme de checklist ou de liste de points sensibles. Un prompt qui demande juste "relis et vérifie" sans préciser ce qui doit être contrôlé doit être noté bas. Récompense un prompt qui pousse à garder la responsabilité finale de la vérification plutôt que de la déléguer entièrement à l'IA.$$
),
(
  'particulier',
  null,
  3,
  '3 réflexes avant d''envoyer une réponse IA telle quelle',
  $$Une IA vient de te rédiger une réponse à envoyer à ton assurance suite à un sinistre, à partir des quelques infos que tu lui as données. Le texte a l'air parfait, mais tu ne l'as pas relu ligne par ligne.$$,
  $$Écris le prompt que tu enverrais à l'IA pour qu'elle t'aide à relire cette réponse de façon critique avant de l'envoyer, plutôt que de simplement lui redemander de la récrire.$$,
  $$Le prompt doit demander à l'IA de pointer les éléments à vérifier soi-même avant l'envoi (dates, montants, numéros de dossier, engagements pris), par exemple sous forme de checklist. Un prompt qui demande juste "relis et vérifie" sans préciser ce qui doit être contrôlé doit être noté bas. Récompense un prompt qui pousse à garder la responsabilité finale de la vérification plutôt que de tout déléguer à l'IA.$$
);
