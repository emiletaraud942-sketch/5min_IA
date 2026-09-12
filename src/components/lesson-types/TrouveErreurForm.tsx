"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LessonCompletedCard } from "@/components/lesson-types/LessonCompletedCard";
import { submitStaticAttempt } from "@/components/lesson-types/staticAttempt";
import type { ContenuTrouveErreur, Lesson } from "@/lib/types";

export function TrouveErreurForm({
  lesson,
  contenu,
}: {
  lesson: Pick<Lesson, "id" | "titre">;
  contenu: ContenuTrouveErreur;
}) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [validated, setValidated] = useState(false);
  const [streak, setStreak] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selected = contenu.passages.find((p) => p.id === selectedId) ?? null;

  async function handleValidate() {
    if (!selected) return;
    setSubmitting(true);
    setError(null);

    const result = await submitStaticAttempt({
      lessonId: lesson.id,
      promptSoumis: `Passage repéré : « ${selected.texte} »`,
      feedback: contenu.explication,
      score: selected.correct ? 5 : 2,
    });

    setSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setStreak(result.streak);
    setValidated(true);
    router.refresh();
  }

  if (validated) return <LessonCompletedCard streak={streak} />;

  return (
    <>
      <Card className="flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-500">
          Trouve l&apos;erreur
        </span>
        <h1 className="text-xl font-bold text-brand-950">{lesson.titre}</h1>
        <div className="rounded-lg bg-sand-50 p-4">
          <p className="whitespace-pre-line text-sm text-brand-900">{contenu.reponse_texte}</p>
        </div>
        <p className="text-sm font-medium text-brand-700">{contenu.consigne_choix}</p>
      </Card>

      <div className="flex flex-col gap-2">
        {contenu.passages.map((passage) => {
          const isSelected = selectedId === passage.id;
          return (
            <button
              key={passage.id}
              type="button"
              disabled={selectedId !== null}
              onClick={() => setSelectedId(passage.id)}
              className={`w-full rounded-xl border px-4 py-3 text-left transition-colors disabled:cursor-not-allowed ${
                isSelected
                  ? passage.correct
                    ? "border-brand-600 bg-brand-50 ring-1 ring-brand-600"
                    : "border-amber-400 bg-amber-50 ring-1 ring-amber-400"
                  : "border-sand-300 bg-white hover:border-brand-300 disabled:opacity-60"
              }`}
            >
              <span className="text-sm text-brand-900">« {passage.texte} »</span>
              {isSelected && (
                <span
                  className={`mt-1 block text-xs font-semibold ${
                    passage.correct ? "text-brand-700" : "text-amber-800"
                  }`}
                >
                  {passage.correct ? "✅ C'est bien ça" : "⚠️ Pas le bon passage"}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {selected ? (
        <Card className="flex flex-col gap-3">
          <p className="text-brand-900">{contenu.explication}</p>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button onClick={handleValidate} disabled={submitting} className="self-start">
            {submitting ? "Validation..." : "Valider la leçon"}
          </Button>
        </Card>
      ) : null}
    </>
  );
}
