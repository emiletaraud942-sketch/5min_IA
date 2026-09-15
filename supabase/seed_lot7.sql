-- 5min IA — seed content, lot 7: combler le trou métier (RH, Assistant, Comptabilité).
-- Run after schema.sql, all previous seed_lotN scripts, and
-- migration_lesson_types.sql. Safe to re-run (clears and re-inserts these
-- lessons by titre).
--
-- Jusqu'ici, seul le métier "commercial" avait des leçons dédiées ; RH,
-- Assistant/Secrétariat et Comptabilité ne voyaient que les leçons
-- génériques du parcours Pro. Ce lot ajoute 2-3 leçons par métier, avec un
-- peu de variété dans les types (standard, corrige_le_prompt,
-- defi_chronometre, qu_aurais_tu_fait) pour montrer le système de types en
-- contexte métier, pas juste sur les démos génériques.

delete from public.lessons where titre in (
  'Rédiger une fiche de poste qui donne envie',
  'Préparer une grille d''entretien structurée',
  'Corriger une offre d''emploi trop terne',
  'Trier une boîte mail qui déborde',
  'Rédiger un compte-rendu d''appel contre la montre',
  'Expliquer un écart budgétaire en langage clair',
  'Rédiger une relance client impayé, ferme mais pas agressive'
);

insert into public.lessons
  (track, metier, ordre, titre, mise_en_situation, consigne, criteres_evaluation, type_lecon, contenu, piliers)
values
-- RH ------------------------------------------------------------------
(
  'pro', 'rh', 31,
  'Rédiger une fiche de poste qui donne envie',
  $$Tu dois publier une offre pour un poste de chargé·e de clientèle, mais la dernière fiche de poste que ton entreprise a utilisée est un pavé générique copié-collé d'un vieux modèle, qui ne donne envie à personne de postuler.$$,
  $$Écris le prompt que tu enverrais à Claude pour obtenir une fiche de poste claire et attractive, à partir des informations clés du poste (missions, profil recherché, ce que l'entreprise offre).$$,
  $$Le prompt doit fournir les informations concrètes du poste (missions principales, compétences attendues, contexte de l'entreprise) et préciser un ton engageant plutôt que corporate. Un prompt du type "écris une fiche de poste pour un commercial" sans aucun détail doit être noté bas. Récompense un prompt qui donne assez de matière pour un résultat vraiment utilisable, pas juste un squelette.$$,
  'standard', null, array['description']
),
(
  'pro', 'rh', 32,
  'Préparer une grille d''entretien structurée',
  $$Tu as un entretien dans 30 minutes pour un poste que tu ne connais pas très bien. Tu veux que l'IA t'aide à préparer tes questions.$$,
  $$Choisis l'action que tu aurais menée.$$,
  $$Leçon à choix multiples : l'évaluation est automatique, basée sur le choix sélectionné.$$,
  'qu_aurais_tu_fait',
  $${
    "situation": "Tu as un entretien dans 30 minutes pour un poste que tu ne connais pas très bien. Tu veux que l'IA t'aide à préparer tes questions.",
    "choix": [
      {"id": "a", "label": "Demander à l'IA de te donner « des questions d'entretien classiques »", "bonne": false, "explication": "Tu obtiens des questions génériques, pas adaptées au poste ni à ce que tu dois vraiment évaluer."},
      {"id": "b", "label": "Donner à l'IA la fiche de poste et lui demander une grille de questions organisée par compétence à évaluer", "bonne": true, "explication": "Tu obtiens des questions ciblées sur ce qui compte vraiment pour ce poste précis."},
      {"id": "c", "label": "Demander à l'IA d'improviser les questions pendant l'entretien, en direct", "bonne": false, "explication": "Risqué : tu perds le contrôle de la structure et tu peux passer à côté de points essentiels."}
    ]
  }$$::jsonb,
  array['description', 'delegation']
),
(
  'pro', 'rh', 33,
  'Corriger une offre d''emploi trop terne',
  $$Ton entreprise a déjà rédigé une offre d'emploi, mais elle est plate et ne se distingue pas des autres. Tu veux la rendre plus vivante avant publication.$$,
  $$Voici le prompt qu'un collègue a utilisé pour générer l'offre actuelle. Corrige-le pour obtenir une offre plus engageante.$$,
  $$Le prompt corrigé doit ajouter des détails concrets (missions réelles, ambiance d'équipe, ce qui distingue l'entreprise) et demander un ton vivant plutôt que standard. Un prompt qui reste aussi générique que l'original doit être noté bas.$$,
  'corrige_le_prompt',
  $${"prompt_depart": "Écris une offre d'emploi pour un poste de RH"}$$::jsonb,
  array['description']
),
-- Assistant / Secrétariat ----------------------------------------------
(
  'pro', 'assistant', 31,
  'Trier une boîte mail qui déborde',
  $$Tu reviens de congés avec 200 mails non lus. Tu veux que l'IA t'aide à savoir par lesquels commencer.$$,
  $$Écris le prompt que tu enverrais à Claude, en lui donnant les objets et expéditeurs de tes mails en vrac, pour qu'il te dise lesquels traiter en priorité et pourquoi.$$,
  $$Le prompt doit fournir une vraie liste (objets/expéditeurs, même résumée) et demander une priorisation justifiée (urgence, expéditeur important, délai), pas juste "aide-moi à trier mes mails". Récompense un prompt qui permet une vraie priorisation exploitable.$$,
  'standard', null, array['delegation', 'description']
),
(
  'pro', 'assistant', 32,
  'Rédiger un compte-rendu d''appel contre la montre',
  $$Tu viens de raccrocher après un appel important avec un fournisseur, et tu dois immédiatement passer à autre chose. Il faut noter l'essentiel avant d'oublier — vite.$$,
  $$Écris le prompt que tu enverrais à Claude pour transformer tes notes prises en vrac pendant l'appel en un compte-rendu clair à partager, avant que le chrono n'arrive à zéro.$$,
  $$Le prompt doit demander une structure claire (qui, sujet, décisions prises, actions à suivre) et donner le contexte brut de l'appel, pas juste "résume mon appel". Récompense la précision plutôt que la vitesse d'écriture.$$,
  'defi_chronometre',
  $${"chrono_secondes": 60}$$::jsonb,
  array['description']
),
-- Comptabilité -----------------------------------------------------------
(
  'pro', 'comptabilite', 31,
  'Expliquer un écart budgétaire en langage clair',
  $$Tu dois présenter à ton manager, qui n'est pas du tout à l'aise avec les chiffres, un écart budgétaire du mois. Un tableau brut ne suffira pas, il faut une explication compréhensible.$$,
  $$Écris le prompt que tu enverrais à Claude pour transformer tes chiffres bruts en explication claire, sans jargon comptable, pour quelqu'un de non-financier.$$,
  $$Le prompt doit fournir les chiffres/contexte de l'écart et demander explicitement une explication en langage simple, sans jargon comptable, avec les causes probables. Un prompt qui demande juste "explique cet écart" sans donner les chiffres doit être noté bas.$$,
  'standard', null, array['description']
),
(
  'pro', 'comptabilite', 32,
  'Rédiger une relance client impayé, ferme mais pas agressive',
  $$Un client n'a toujours pas payé une facture 30 jours après l'échéance. C'est le 2e rappel. Tu veux que l'IA t'aide à rédiger le message.$$,
  $$Choisis l'action que tu aurais menée.$$,
  $$Leçon à choix multiples : l'évaluation est automatique, basée sur le choix sélectionné.$$,
  'qu_aurais_tu_fait',
  $${
    "situation": "Un client n'a toujours pas payé une facture 30 jours après l'échéance. C'est le 2e rappel. Tu veux que l'IA t'aide à rédiger le message.",
    "choix": [
      {"id": "a", "label": "Demander à l'IA d'écrire un message très agressif pour « faire peur » au client", "bonne": false, "explication": "Risqué : tu abîmes la relation commerciale pour un retard qui a peut-être une explication simple."},
      {"id": "b", "label": "Donner à l'IA le contexte (montant, date d'échéance, nombre de relances déjà envoyées) et demander un ton ferme mais professionnel, avec une échéance claire", "bonne": true, "explication": "Tu restes ferme sur le fond sans braquer le client, et tu poses une échéance claire."},
      {"id": "c", "label": "Demander à l'IA d'écrire un message très doux en espérant que le client comprenne de lui-même", "bonne": false, "explication": "Un message trop mou après un 2e rappel ne crée aucune urgence réelle à payer."}
    ]
  }$$::jsonb,
  array['description', 'diligence']
);
