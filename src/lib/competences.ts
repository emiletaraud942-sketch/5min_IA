import type { SupabaseClient } from "@supabase/supabase-js";
import type { CompetencesUtilisateur, Pilier } from "@/lib/types";

const ZERO: Omit<CompetencesUtilisateur, "user_id"> = {
  delegation_count: 0,
  description_count: 0,
  discernement_count: 0,
  diligence_count: 0,
};

const COLUMN_BY_PILIER: Record<Pilier, keyof typeof ZERO> = {
  delegation: "delegation_count",
  description: "description_count",
  discernement: "discernement_count",
  diligence: "diligence_count",
};

export async function getCompetences(
  supabase: SupabaseClient,
  userId: string,
): Promise<CompetencesUtilisateur> {
  const { data } = await supabase
    .from("competences_utilisateur")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) return { user_id: userId, ...ZERO };
  return data as CompetencesUtilisateur;
}

/** Increment the counters for each given pillar by 1 (once per completed lesson). */
export async function incrementCompetences(
  supabase: SupabaseClient,
  userId: string,
  piliers: Pilier[],
) {
  if (piliers.length === 0) return;

  const current = await getCompetences(supabase, userId);
  const updated = { ...current };

  for (const pilier of piliers) {
    const column = COLUMN_BY_PILIER[pilier];
    if (column) updated[column] = (updated[column] ?? 0) + 1;
  }

  await supabase.from("competences_utilisateur").upsert(
    {
      user_id: userId,
      delegation_count: updated.delegation_count,
      description_count: updated.description_count,
      discernement_count: updated.discernement_count,
      diligence_count: updated.diligence_count,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
}
