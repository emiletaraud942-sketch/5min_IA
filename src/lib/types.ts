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
