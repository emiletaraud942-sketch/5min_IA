import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { evaluatePrompt } from "@/lib/anthropic";

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
  const promptSoumis = typeof body?.prompt === "string" ? body.prompt.trim() : "";

  if (!lessonId || typeof lessonId !== "string") {
    return NextResponse.json({ error: "lessonId manquant." }, { status: 400 });
  }

  if (!promptSoumis) {
    return NextResponse.json({ error: "Le prompt est vide." }, { status: 400 });
  }

  if (promptSoumis.length > 4000) {
    return NextResponse.json({ error: "Le prompt est trop long." }, { status: 400 });
  }

  const { data: lesson, error: lessonError } = await supabase
    .from("lessons")
    .select("mise_en_situation, consigne, criteres_evaluation")
    .eq("id", lessonId)
    .single();

  if (lessonError || !lesson) {
    return NextResponse.json({ error: "Leçon introuvable." }, { status: 404 });
  }

  let evaluation;
  try {
    evaluation = await evaluatePrompt({ lesson, promptSoumis });
  } catch (err) {
    console.error("Anthropic evaluation failed", err);
    return NextResponse.json(
      { error: "L'évaluation a échoué, réessaie dans quelques instants." },
      { status: 502 },
    );
  }

  const { data: attempt, error: attemptError } = await supabase
    .from("attempts")
    .insert({
      user_id: user.id,
      lesson_id: lessonId,
      prompt_soumis: promptSoumis,
      feedback_claude: evaluation.feedback,
      points_forts: evaluation.points_forts,
      points_a_ameliorer: evaluation.points_a_ameliorer,
      score: evaluation.score,
    })
    .select("id, date")
    .single();

  if (attemptError) {
    console.error("Failed to store attempt", attemptError);
    return NextResponse.json(
      { error: "Impossible d'enregistrer la tentative." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    attemptId: attempt.id,
    score: evaluation.score,
    feedback: evaluation.feedback,
    points_forts: evaluation.points_forts,
    points_a_ameliorer: evaluation.points_a_ameliorer,
  });
}
