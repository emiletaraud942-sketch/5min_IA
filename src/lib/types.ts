export type Track = "pro" | "particulier";

export type NiveauDepart = "jamais_utilise" | "un_peu" | "a_l_aise";

export type Metier = "commercial" | "rh" | "assistant" | "comptabilite" | "autre";

export type StatutProgress = "non_commence" | "termine";

export interface UserProfile {
  id: string;
  email: string;
  profil: Track | null;
  metier: Metier | null;
  niveau_depart: NiveauDepart | null;
  objectif_principal: string | null;
  onboarding_complete: boolean;
  is_admin: boolean;
  created_at: string;
}

export type TypeLecon =
  | "standard"
  | "explication_etendue"
  | "qu_aurais_tu_fait"
  | "devine_la_difference"
  | "corrige_le_prompt"
  | "defi_chronometre"
  | "choisis_la_fiable"
  | "trouve_erreur"
  | "relance_en_deux_temps"
  | "question_guidee";

export type Pilier = "delegation" | "description" | "discernement" | "diligence";

export const PILIER_LABELS: Record<Pilier, string> = {
  delegation: "Délégation",
  description: "Description",
  discernement: "Discernement",
  diligence: "Diligence",
};

// contenu shapes per type_lecon — all optional/partial since it's jsonb.
export interface ContenuExplicationEtendue {
  explication_principe: string;
}

export interface Choix {
  id: string;
  label: string;
  bonne: boolean;
  explication: string;
}

export interface ContenuQuAuraisTuFait {
  situation: string;
  choix: Choix[];
}

export interface ContenuDevineLaDifference {
  situation: string;
  prompt_faible: string;
  reponse_faible: string;
  prompt_fort: string;
  reponse_fort: string;
  explication: string;
}

export interface ContenuCorrigeLePrompt {
  prompt_depart: string;
}

export interface ContenuDefiChronometre {
  chrono_secondes: number;
}

export interface ReponseFiabilite {
  id: string;
  label: string;
  texte: string;
  fiable: boolean;
}

export interface ContenuChoisisLaFiable {
  question: string;
  reponses: ReponseFiabilite[];
  explication: string;
}

export interface Passage {
  id: string;
  texte: string;
  correct: boolean;
}

export interface ContenuTrouveErreur {
  reponse_texte: string;
  consigne_choix: string;
  passages: Passage[];
  explication: string;
}

export interface ContenuRelanceEnDeuxTemps {
  situation: string;
  premiere_reponse: string;
}

export interface ContenuQuestionGuidee {
  question_reflexive: string;
}

export interface Lesson {
  id: string;
  track: Track;
  metier: Metier | null;
  ordre: number;
  titre: string;
  mise_en_situation: string;
  consigne: string;
  criteres_evaluation: string;
  groupe: string | null;
  type_lecon: TypeLecon;
  contenu: unknown;
  piliers: Pilier[];
}

export interface CompetencesUtilisateur {
  user_id: string;
  delegation_count: number;
  description_count: number;
  discernement_count: number;
  diligence_count: number;
}

export const LESSON_GROUPS: Record<string, { title: string; description: string; icon: string }> = {
  agent_pro: {
    title: "Construire ton agent IA au travail",
    description: "Un parcours de 15 leçons pour te monter un vrai assistant personnel au travail.",
    icon: "🤖",
  },
  agent_perso: {
    title: "Construire ton assistant repas au quotidien",
    description:
      "Un parcours de 15 leçons : recettes de dépannage, menus, listes de courses, anti-gaspillage.",
    icon: "🍽️",
  },
};

export interface UserProgress {
  user_id: string;
  lesson_id: string;
  statut: StatutProgress;
  date_completion: string | null;
  streak_count: number;
}

export interface Attempt {
  id: string;
  user_id: string;
  lesson_id: string;
  prompt_soumis: string;
  feedback_claude: string;
  points_forts: string[];
  points_a_ameliorer: string[];
  score: number;
  date: string;
}

export const NIVEAU_LABELS: Record<NiveauDepart, string> = {
  jamais_utilise: "Jamais utilisé",
  un_peu: "Un peu",
  a_l_aise: "À l'aise",
};

export const METIER_LABELS: Record<Metier, string> = {
  commercial: "Commercial",
  rh: "RH",
  assistant: "Assistant / Secrétariat",
  comptabilite: "Comptabilité",
  autre: "Autre",
};

export const OBJECTIF_OPTIONS: Record<Track, string[]> = {
  pro: [
    "Gagner du temps sur l'écrit",
    "Mieux préparer mes rendez-vous",
    "Comprendre ce que je peux vraiment faire avec l'IA",
  ],
  particulier: [
    "Gagner du temps au quotidien",
    "Comprendre l'IA sans me sentir dépassé",
    "Aider mes proches (enfants, parents...)",
  ],
};
