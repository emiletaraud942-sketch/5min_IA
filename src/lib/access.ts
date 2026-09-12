import type { SupabaseClient } from "@supabase/supabase-js";

/** Free special lessons a user can open per calendar day (UTC). */
export const FREE_SPECIAL_LESSONS_PER_DAY = 2;

export interface LessonAccess {
  /** Lesson ids permanently unlocked (paid for). */
  unlockedIds: Set<string>;
  /** Lesson ids already opened today (count against / already counted in the quota). */
  openedTodayIds: Set<string>;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export async function getLessonAccess(
  supabase: SupabaseClient,
  userId: string,
): Promise<LessonAccess> {
  const [unlocksRes, opensRes] = await Promise.all([
    supabase.from("lesson_unlocks").select("lesson_id").eq("user_id", userId),
    supabase
      .from("lesson_opens")
      .select("lesson_id")
      .eq("user_id", userId)
      .eq("opened_on", todayKey()),
  ]);

  return {
    unlockedIds: new Set((unlocksRes.data ?? []).map((r) => r.lesson_id as string)),
    openedTodayIds: new Set((opensRes.data ?? []).map((r) => r.lesson_id as string)),
  };
}

/**
 * Can this lesson be opened right now, given today's access state? Free
 * (non-"groupe") lessons and admins are always allowed. A "groupe" lesson
 * is allowed if it's already unlocked, already opened today (revisiting
 * doesn't cost another slot), or there's still room in today's free quota.
 */
export function canOpenLesson(params: {
  lessonId: string;
  isSpecial: boolean;
  isAdmin: boolean;
  access: LessonAccess;
}): boolean {
  const { lessonId, isSpecial, isAdmin, access } = params;

  if (!isSpecial || isAdmin) return true;
  if (access.unlockedIds.has(lessonId)) return true;
  if (access.openedTodayIds.has(lessonId)) return true;

  return access.openedTodayIds.size < FREE_SPECIAL_LESSONS_PER_DAY;
}

/** Record that a special lesson was opened today (no-op if already recorded). */
export async function recordLessonOpen(
  supabase: SupabaseClient,
  userId: string,
  lessonId: string,
) {
  await supabase
    .from("lesson_opens")
    .upsert(
      { user_id: userId, lesson_id: lessonId, opened_on: todayKey() },
      { onConflict: "user_id,lesson_id,opened_on", ignoreDuplicates: true },
    );
}
