import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { computeStreakAfterCompletionToday } from "@/lib/streak";
import { incrementCompetences } from "@/lib/competences";
import type { Pilier } from "@/lib/types";

export async function POST(request: Request) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const lessonId = body?.lessonId;

  if (!lessonId || typeof lessonId !== "string") {
    return NextResponse.json({ error: "lessonId manquant." }, { status: 400 });
  }

  const { data: lastAttempt } = await supabase
    .from("attempts")
    .select("id")
    .eq("user_id", user.id)
    .eq("lesson_id", lessonId)
    .order("date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!lastAttempt) {
    return NextResponse.json(
      { error: "Écris au moins un prompt avant de valider la leçon." },
      { status: 400 },
    );
  }

  const [{ data: previousCompletions }, { data: existingProgress }] = await Promise.all([
    supabase
      .from("user_progress")
      .select("date_completion")
      .eq("user_id", user.id)
      .eq("statut", "termine")
      .not("date_completion", "is", null)
      .neq("lesson_id", lessonId),
    supabase
      .from("user_progress")
      .select("statut")
      .eq("user_id", user.id)
      .eq("lesson_id", lessonId)
      .maybeSingle(),
  ]);

  const isFirstCompletion = existingProgress?.statut !== "termine";

  const streakCount = computeStreakAfterCompletionToday(
    (previousCompletions ?? []).map((row) => row.date_completion as string),
  );

  const { error: upsertError } = await supabase.from("user_progress").upsert(
    {
      user_id: user.id,
      lesson_id: lessonId,
      statut: "termine",
      date_completion: new Date().toISOString(),
      streak_count: streakCount,
    },
    { onConflict: "user_id,lesson_id" },
  );

  if (upsertError) {
    console.error("Failed to complete lesson", upsertError);
    return NextResponse.json(
      { error: "Impossible d'enregistrer la progression." },
      { status: 500 },
    );
  }

  if (isFirstCompletion) {
    const { data: lesson } = await supabase
      .from("lessons")
      .select("piliers")
      .eq("id", lessonId)
      .single();

    if (lesson?.piliers?.length) {
      await incrementCompetences(supabase, user.id, lesson.piliers as Pilier[]);
    }
  }

  return NextResponse.json({ streakCount });
}
