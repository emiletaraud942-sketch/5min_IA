-- 5min IA — seed content, lot 5: "Construire ton assistant repas au quotidien" (Particulier).
-- Run after schema.sql, seed.sql, seed_lot2.sql and seed_lot3.sql (and,
-- optionally, seed_lot4.sql). Safe to re-run (clears and re-inserts these
-- lessons by titre).
--
-- Symétrique du lot 4 côté "Particulier" : un parcours continu de 15 leçons
-- qui construit pas à pas un assistant repas personnel (recettes de
-- dépannage quand le frigo est vide, menus, listes de courses, batch
-- cooking) plutôt que des demandes isolées et à refaire de zéro à chaque
-- fois. Même logique pédagogique que le lot 4 : 1-2 posent les fondations
-- (usages attendus, préférences permanentes), 3-11 couvrent les situations
-- concrètes du quotidien, 9 et 12 posent des limites (santé, vérification),
-- 13-15 font vivre l'assistant dans la durée (mémoire, rituel, bilan).

delete from public.lessons where titre in (
  'Dire précisément à ton assistant ce que tu attends de lui',
  'Donner tes préférences permanentes à ton assistant',
  'Le frigo est vide : obtenir une vraie recette de dépannage',
  'Adapter une recette à une contrainte précise',
  'Transformer un menu de la semaine en liste de courses',
  'Construire un menu de la semaine varié en un seul prompt',
  'Éviter le gaspillage avec ce qui va périmer',
  'Adapter les quantités au bon nombre de personnes',
  'Poser une contrainte santé sans suivre un conseil médical aveuglément',
  'Construire un plan de courses mensuel et du batch cooking',
  'Préparer un menu pour des invités',
  'Vérifier une recette avant de la suivre',
  'Sauvegarder tes recettes préférées comme mémoire permanente',
  'Mettre en place ton rituel du dimanche soir',
  'Faire le bilan du mois avec ton assistant'
);

insert into public.lessons (track, metier, ordre, titre, mise_en_situation, consigne, criteres_evaluation)
values
(
  'particulier', null, 6,
  'Dire précisément à ton assistant ce que tu attends de lui',
  $$Tu ouvres Claude en pensant "je vais m'en servir pour les repas", mais tu tapes juste "aide-moi à manger mieux" et la réponse est trop générale pour t'être utile au quotidien.$$,
  $$Écris le prompt qui décrit précisément à ton assistant ce que tu veux qu'il fasse pour toi au quotidien : dépannage quand le frigo est vide, menus de la semaine, listes de courses, ou les trois.$$,
  $$Le prompt doit lister au moins deux ou trois usages concrets attendus (ex : recettes de dépannage, menu hebdo, liste de courses), pas une intention vague. Récompense un prompt qui délimite clairement ce qu'on attend de l'assistant, comme si on briefait quelqu'un qui va nous aider régulièrement.$$
),
(
  'particulier', null, 7,
  'Donner tes préférences permanentes à ton assistant',
  $$Tu es allergique aux fruits de mer, tu cuisines pour deux personnes, tu n'as que vingt minutes en semaine le soir, et tu détestes le fenouil. Si tu ne le dis qu'une fois par recette, tu vas devoir le répéter à chaque fois.$$,
  $$Rédige le texte d'instructions permanentes (préférences, allergies, nombre de personnes, temps de cuisine disponible, budget) que tu donnerais une fois pour toutes à ton assistant repas.$$,
  $$Le texte doit couvrir des informations stables et précises (allergies ou intolérances, nombre de personnes, contraintes de temps ou de budget, aliments détestés), pas des goûts vagues du type "j'aime manger sain". Récompense un texte réutilisable pour toutes les futures demandes de recettes, sans rien à répéter.$$
),
(
  'particulier', null, 8,
  'Le frigo est vide : obtenir une vraie recette de dépannage',
  $$Il est 19h, tu ouvres le frigo, il ne te reste que trois œufs, un reste de riz, une carotte et du fromage. Tu n'as ni l'envie ni le temps d'aller faire des courses.$$,
  $$Écris le prompt qui donne à ton assistant la liste exacte de ce qu'il te reste, pour qu'il te propose une vraie recette réalisable avec ça, et rien d'autre à acheter.$$,
  $$Le prompt doit donner une liste précise des ingrédients disponibles et demander explicitement une recette qui n'utilise QUE ces ingrédients (plus des basiques comme sel, huile), pas une recette qui suppose des courses. Un prompt du type "donne-moi une recette" sans lister les ingrédients doit être noté bas. Récompense la précision de la liste donnée et la contrainte explicite de ne rien ajouter d'imprévu.$$
),
(
  'particulier', null, 9,
  'Adapter une recette à une contrainte précise',
  $$Ton assistant t'a proposé une recette sympa, mais elle prend une heure alors que tu n'as que vingt-cinq minutes, et elle utilise un ingrédient que tu n'as pas. Plutôt que de tout recommencer, tu veux l'adapter.$$,
  $$Écris le prompt qui demande à ton assistant d'adapter une recette existante à une contrainte précise (moins de temps, sans un ingrédient, moins cher), en gardant l'esprit du plat.$$,
  $$Le prompt doit donner la recette de départ, préciser la contrainte exacte à respecter, et demander explicitement que la recette adaptée reste cohérente, pas juste supprimer un ingrédient sans ajuster le reste. Récompense un prompt qui permet une vraie adaptation utilisable, pas une modification bâclée.$$
),
(
  'particulier', null, 10,
  'Transformer un menu de la semaine en liste de courses',
  $$Tu as enfin un menu pour les cinq prochains jours, mais tu te retrouves encore à improviser ta liste de courses au supermarché et à oublier la moitié des ingrédients.$$,
  $$Écris le prompt qui donne ton menu de la semaine à ton assistant et lui demande une liste de courses organisée, par exemple par rayon, sans doublons et avec les quantités.$$,
  $$Le prompt doit fournir le menu complet et demander explicitement une liste structurée avec quantités et regroupement logique (par rayon ou par type d'aliment), pas juste "fais-moi une liste". Récompense un prompt qui anticipe les quantités pour le bon nombre de personnes plutôt que de laisser l'IA deviner.$$
),
(
  'particulier', null, 11,
  'Construire un menu de la semaine varié en un seul prompt',
  $$Tu te retrouves régulièrement à manger trois fois la même chose dans la semaine parce que tu improvises jour par jour. Tu veux un vrai menu pensé à l'avance, pas au coup par coup.$$,
  $$Écris le prompt qui demande à ton assistant de construire un menu complet pour cinq ou sept jours, varié, en tenant compte de tes contraintes déjà connues (temps, budget, préférences).$$,
  $$Le prompt doit demander explicitement de la variété, pas deux fois le même type de plat dans la semaine, et s'appuyer sur les contraintes déjà données plutôt que de les répéter en détail à chaque fois. Récompense un prompt court qui exploite les instructions permanentes déjà en place plutôt qu'un prompt qui réexplique tout depuis zéro.$$
),
(
  'particulier', null, 12,
  'Éviter le gaspillage avec ce qui va périmer',
  $$Tu as des yaourts qui périment demain et de la salade qui commence à faner, pendant que ton menu de la semaine prévoyait autre chose. Tu préférerais adapter le menu plutôt que jeter la nourriture.$$,
  $$Écris le prompt qui demande à ton assistant d'ajuster ton menu de la semaine pour utiliser en priorité les aliments qui vont bientôt périmer que tu lui indiques.$$,
  $$Le prompt doit lister précisément les aliments proches de la péremption et demander explicitement qu'ils soient intégrés en priorité dans les prochains repas, pas juste mentionnés en passant. Récompense un prompt qui traite vraiment l'anti-gaspillage comme une contrainte forte, pas comme un détail optionnel.$$
),
(
  'particulier', null, 13,
  'Adapter les quantités au bon nombre de personnes',
  $$Une recette trouvée est prévue pour quatre personnes, mais vous n'êtes que deux ce soir-là, ou à l'inverse des amis viennent dîner et vous serez six. Il faut recalculer les quantités, pas juste diviser au hasard.$$,
  $$Écris le prompt qui donne une recette et son nombre de portions d'origine, et demande à ton assistant de recalculer précisément les quantités pour le bon nombre de personnes.$$,
  $$Le prompt doit indiquer le nombre de portions d'origine et le nombre de personnes réel visé, et demander des quantités recalculées, pas juste "divise par deux", y compris pour les ingrédients difficiles à diviser (ex : un œuf, une boîte de conserve). Récompense un prompt qui anticipe ces cas particuliers.$$
),
(
  'particulier', null, 14,
  'Poser une contrainte santé sans suivre un conseil médical aveuglément',
  $$Tu dois réduire ton sel pour des raisons de santé et tu demandes à ton assistant des recettes adaptées. C'est utile pour des idées de recettes, mais ce n'est pas un avis médical, et il faut garder ça en tête.$$,
  $$Écris le prompt qui demande des recettes adaptées à ta contrainte de santé, en précisant clairement à ton assistant qu'il doit rester sur des suggestions de recettes et te renvoyer vers un professionnel de santé pour toute question médicale précise.$$,
  $$Le prompt doit poser la contrainte de santé clairement ET demander explicitement que l'assistant ne donne pas de conseil médical au-delà des suggestions de recettes (ex : quantités de sel, substituts). Un prompt qui demande une contrainte santé sans cette limite doit être noté moyen. Récompense un prompt qui montre une vraie prise de recul sur ce qu'une IA peut et ne peut pas trancher en matière de santé.$$
),
(
  'particulier', null, 15,
  'Construire un plan de courses mensuel et du batch cooking',
  $$Tu voudrais arrêter de faire des courses trois fois par semaine dans l'urgence et passer à un vrai rythme mensuel avec des sessions de cuisine en avance (batch cooking), mais tu ne sais pas par où commencer.$$,
  $$Écris le prompt qui demande à ton assistant de construire un plan de courses pour un mois organisé autour de quelques sessions de batch cooking (préparation à l'avance), avec ce qui se congèle bien.$$,
  $$Le prompt doit demander explicitement une organisation autour de sessions de préparation groupées et tenir compte de ce qui se conserve ou se congèle, pas juste une liste de courses classique sur un mois. Récompense un prompt qui pense la logistique réelle (temps de préparation, conservation), pas juste la liste des plats.$$
),
(
  'particulier', null, 16,
  'Préparer un menu pour des invités',
  $$Tu reçois six personnes ce week-end, dont une personne végétarienne et une allergique aux noix. Tu veux un menu qui marche pour tout le monde sans faire trois plats différents.$$,
  $$Écris le prompt qui donne le nombre d'invités et leurs contraintes alimentaires, et demande un menu complet qui fonctionne pour tout le monde en un minimum de plats différents.$$,
  $$Le prompt doit lister précisément toutes les contraintes des invités, pas juste "quelques restrictions", et demander explicitement une solution qui limite le nombre de versions différentes à préparer. Récompense un prompt qui anticipe les vraies contraintes de la vraie vie (temps de préparation le jour J, nombre de plats à gérer en même temps).$$
),
(
  'particulier', null, 17,
  'Vérifier une recette avant de la suivre',
  $$Ton assistant t'a donné une recette avec un temps de cuisson qui te semble bizarrement court pour un plat en sauce, et une quantité de levure qui te paraît énorme. Tu hésites à la suivre telle quelle.$$,
  $$Écris le prompt qui demande à ton assistant de vérifier lui-même la cohérence d'une recette qu'il vient de te donner (temps de cuisson, quantités, températures), avant que tu la suives.$$,
  $$Le prompt doit demander une vérification ciblée sur les points concrets qui te semblent incohérents (temps, quantités, températures), pas juste "relis-toi". Récompense un prompt qui pousse à une vraie vérification de cohérence plutôt qu'une confirmation de façade.$$
),
(
  'particulier', null, 18,
  'Sauvegarder tes recettes préférées comme mémoire permanente',
  $$Tu as testé et adoré cinq recettes proposées par ton assistant ces dernières semaines, mais elles sont perdues dans différentes conversations. Tu voudrais qu'il s'en souvienne pour te les reproposer ou s'en inspirer.$$,
  $$Écris le prompt, à mettre dans tes instructions permanentes ou un Projet, qui liste tes recettes préférées validées, pour que ton assistant puisse s'en inspirer ou te les reproposer à l'avenir.$$,
  $$Le prompt doit lister des recettes concrètes déjà testées et validées, pas de nouvelles envies, organisées de façon à être réutilisables durablement. Récompense un prompt qui transforme un historique dispersé en une vraie mémoire structurée et exploitable.$$
),
(
  'particulier', null, 19,
  'Mettre en place ton rituel du dimanche soir',
  $$Tu voudrais que chaque dimanche soir, en cinq minutes, tu obtiennes ton menu de la semaine ET ta liste de courses, sans avoir à tout redemander depuis zéro à chaque fois.$$,
  $$Écris le prompt-modèle unique que tu réutiliserais chaque dimanche soir pour obtenir en une fois ton menu de la semaine et la liste de courses correspondante.$$,
  $$Le prompt doit combiner en une seule demande structurée le menu ET la liste de courses qui en découle, avec un format qui se répète à l'identique chaque semaine. Récompense un prompt qui devient un vrai rituel copier-coller, sans avoir besoin d'être réécrit à chaque fois.$$
),
(
  'particulier', null, 20,
  'Faire le bilan du mois avec ton assistant',
  $$Un mois après avoir commencé à utiliser ton assistant repas, tu te rends compte qu'il te propose encore parfois des plats trop longs à préparer en semaine, ou qu'il a oublié une allergie que tu avais mentionnée une fois.$$,
  $$Écris le prompt que tu enverrais à ton assistant pour lui demander de t'aider à ajuster tes instructions permanentes, à partir de deux ou trois exemples récents où ses propositions ne convenaient pas.$$,
  $$Le prompt doit s'appuyer sur des exemples concrets de ce qui n'a pas fonctionné, pas une critique vague, et demander explicitement une proposition de mise à jour des instructions permanentes. Récompense un prompt qui transforme les petites frustrations du quotidien en réglages précis et durables.$$
);
