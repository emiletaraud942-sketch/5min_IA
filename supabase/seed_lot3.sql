-- 5min IA — seed content, lot 3: Hallucinations + Biais.
-- Run after schema.sql, seed.sql and seed_lot2.sql. Safe to re-run (clears and
-- re-inserts these lessons by titre).
--
-- Contexte : complète le volet "Discernement" (lot 2) avec l'angle de la
-- cause plutôt que de la seule détection (pourquoi l'IA peut inventer un
-- chiffre avec assurance), et ajoute un angle "biais" au volet "Diligence"
-- (reformuler sa demande pour éviter de reproduire un stéréotype). Chaque
-- leçon est déclinée pour les deux parcours.

delete from public.lessons where titre in (
  'Pourquoi l''IA ment parfois sans le savoir',
  'Ton IA a des préjugés — voici pourquoi'
);

insert into public.lessons (track, metier, ordre, titre, mise_en_situation, consigne, criteres_evaluation)
values
(
  'pro',
  null,
  5,
  'Pourquoi l''IA ment parfois sans le savoir',
  $$Tu demandes à Claude une statistique précise sur ton secteur d'activité pour l'intégrer dans une présentation : "Quelle est la part de marché moyenne des PME du secteur X en France ?" Il te donne aussitôt un chiffre précis, cité avec assurance — alors qu'il n'a probablement pas accès à cette donnée exacte. Il complète le texte de la façon la plus plausible possible, ce qui n'est pas la même chose que "savoir".$$,
  $$Écris le prompt que tu enverrais dès le départ à Claude pour réduire le risque qu'il invente un chiffre, plutôt que de lui poser la question à l'aveugle.$$,
  $$Le prompt doit demander explicitement à Claude de distinguer ce qu'il sait avec certitude de ce qu'il déduit ou estime, et de dire clairement "je ne sais pas" ou de signaler une incertitude plutôt que d'inventer un chiffre précis. Un prompt qui se contente de demander la statistique brute, sans anticiper le risque d'invention, doit être noté bas. Récompense un prompt qui prévient le problème avant de recevoir la réponse, pas seulement un prompt qui vérifierait après coup.$$
),
(
  'particulier',
  null,
  4,
  'Pourquoi l''IA ment parfois sans le savoir',
  $$Tu demandes à une IA le montant exact d'une aide sociale à laquelle tu pourrais avoir droit. Elle te donne aussitôt un montant précis, avec un ton très sûr d'elle — alors qu'elle n'a probablement pas accès aux barèmes à jour. Elle complète sa réponse de façon plausible, ce qui n'est pas la même chose que "savoir".$$,
  $$Écris le prompt que tu enverrais dès le départ à l'IA pour réduire le risque qu'elle invente ce montant, plutôt que de lui poser la question à l'aveugle.$$,
  $$Le prompt doit demander explicitement à l'IA de distinguer ce qu'elle sait avec certitude de ce qu'elle déduit ou estime, et de dire clairement "je ne sais pas" ou de signaler une incertitude plutôt que d'inventer un montant précis. Un prompt qui se contente de demander le montant brut, sans anticiper le risque d'invention, doit être noté bas. Récompense un prompt qui prévient le problème avant de recevoir la réponse, pas seulement un prompt qui vérifierait après coup.$$
),
(
  'pro',
  null,
  6,
  'Ton IA a des préjugés — voici pourquoi',
  $$Tu demandes à Claude de rédiger une courte description des postes "infirmier" et "ingénieur" pour une offre d'emploi. Sa réponse utilise spontanément "elle" pour l'infirmier et "il" pour l'ingénieur, sans que tu l'aies précisé — un reflet des stéréotypes présents dans les textes sur lesquels l'IA a appris.$$,
  $$Écris le prompt que tu enverrais pour obtenir une description neutre dès le départ, sans reproduire ce genre de stéréotype, plutôt que de laisser l'IA choisir par défaut.$$,
  $$Le prompt doit demander explicitement une formulation neutre ou inclusive (éviter les stéréotypes de genre, d'âge ou d'origine) dès la demande initiale, pas seulement "corrige ça" une fois le biais déjà présent dans une première réponse. Un prompt qui ne mentionne aucune exigence de neutralité doit être noté bas. Récompense un prompt qui anticipe le problème plutôt qu'un prompt qui le corrige après coup.$$
),
(
  'particulier',
  null,
  5,
  'Ton IA a des préjugés — voici pourquoi',
  $$Tu demandes à une IA de te décrire à quoi ressemble une famille "typique" pour rédiger un texte destiné à l'école de tes enfants. Sa réponse reflète spontanément un modèle de famille bien précis (composition, rôles de chacun), sans que tu l'aies demandé — un reflet des habitudes présentes dans les textes sur lesquels elle a appris.$$,
  $$Écris le prompt que tu enverrais pour obtenir un texte neutre et inclusif dès le départ, plutôt que de laisser l'IA partir sur un modèle par défaut.$$,
  $$Le prompt doit demander explicitement un texte neutre ou inclusif qui n'impose pas un modèle unique de famille, dès la demande initiale, pas seulement "corrige ça" une fois le biais déjà présent dans une première réponse. Un prompt qui ne mentionne aucune exigence de neutralité doit être noté bas. Récompense un prompt qui anticipe le problème plutôt qu'un prompt qui le corrige après coup.$$
);
