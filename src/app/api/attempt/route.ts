import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Records an attempt for the lesson types that don't go through Claude
 * (multiple-choice / spot-the-difference types): the score and feedback are
 * derived locally from the fixed `contenu` in the lesson row, not from an
 * LLM call. Kept separate from /api/evaluate so the two responsibilities
 * (real AI evaluation vs. static content scoring) don't get mixed up.
 */
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
  const promptSoumis = typeof body?.promptSoumis === "string" ? body.promptSoumis.trim() : "";
  const feedback = typeof body?.feedback === "string" ? body.feedback.trim() : "";
  const score = Number(body?.score);

  if (!lessonId || typeof lessonId !== "string") {
    return NextResponse.json({ error: "lessonId manquant." }, { status: 400 });
  }
  if (!promptSoumis || !feedback) {
    return NextResponse.json({ error: "Réponse invalide." }, { status: 400 });
  }
  if (!Number.isInteger(score) || score < 1 || score > 5) {
    return NextResponse.json({ error: "Score invalide." }, { status: 400 });
  }

  const { data: lesson } = await supabase
    .from("lessons")
    .select("id")
    .eq("id", lessonId)
    .single();

  if (!lesson) {
    return NextResponse.json({ error: "Leçon introuvable." }, { status: 404 });
  }

  const { data: attempt, error } = await supabase
    .from("attempts")
    .insert({
      user_id: user.id,
      lesson_id: lessonId,
      prompt_soumis: promptSoumis,
      feedback_claude: feedback,
      score,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to store attempt", error);
    return NextResponse.json(
      { error: "Impossible d'enregistrer la tentative." },
      { status: 500 },
    );
  }

  return NextResponse.json({ attemptId: attempt.id });
}
