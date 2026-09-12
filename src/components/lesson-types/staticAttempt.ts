/**
 * Shared by the choice-based lesson types (no Claude call): records the
 * attempt with a locally-derived score/feedback, then marks the lesson
 * complete via the same /api/complete-lesson route the standard flow uses.
 */
export async function submitStaticAttempt(params: {
  lessonId: string;
  promptSoumis: string;
  feedback: string;
  score: number;
}): Promise<{ ok: true; streak: number } | { ok: false; error: string }> {
  const { lessonId, promptSoumis, feedback, score } = params;

  try {
    const attemptRes = await fetch("/api/attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, promptSoumis, feedback, score }),
    });
    const attemptData = await attemptRes.json();
    if (!attemptRes.ok) {
      return { ok: false, error: attemptData.error || "Impossible d'enregistrer ta réponse." };
    }

    const completeRes = await fetch("/api/complete-lesson", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId }),
    });
    const completeData = await completeRes.json();
    if (!completeRes.ok) {
      return { ok: false, error: completeData.error || "Impossible de valider la leçon." };
    }

    return { ok: true, streak: completeData.streakCount };
  } catch {
    return { ok: false, error: "Impossible de contacter le serveur, vérifie ta connexion." };
  }
}
