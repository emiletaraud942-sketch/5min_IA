import type { SupabaseClient } from "@supabase/supabase-js";
import type { Lesson, UserProfile, UserProgress } from "@/lib/types";

export async function getProfile(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserProfile | null> {
  const { data } = await supabase.from("users").select("*").eq("id", userId).single();
  return data as UserProfile | null;
}

export async function getTrackLessons(
  supabase: SupabaseClient,
  profile: Pick<UserProfile, "profil" | "metier">,
): Promise<Lesson[]> {
  // Admins preview the site as a normal user of their currently selected
  // track (see AdminTrackSwitcher) — no "every lesson at once" bypass here.
  if (!profile.profil) return [];

  const { data } = await supabase
    .from("lessons")
    .select("*")
    .eq("track", profile.profil)
    .order("ordre", { ascending: true });

  const lessons = (data ?? []) as Lesson[];

  return lessons.filter((lesson) => lesson.metier === null || lesson.metier === profile.metier);
}

export async function getProgressMap(
  supabase: SupabaseClient,
  userId: string,
): Promise<Record<string, UserProgress>> {
  const { data } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId);

  const map: Record<string, UserProgress> = {};
  for (const row of (data ?? []) as UserProgress[]) {
    map[row.lesson_id] = row;
  }
  return map;
}

export async function getCompletionDates(
  supabase: SupabaseClient,
  userId: string,
): Promise<string[]> {
  const { data } = await supabase
    .from("user_progress")
    .select("date_completion")
    .eq("user_id", userId)
    .eq("statut", "termine")
    .not("date_completion", "is", null);

  return (data ?? []).map((row) => row.date_completion as string);
}
