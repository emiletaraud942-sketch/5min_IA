"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LessonCompletedCard } from "@/components/lesson-types/LessonCompletedCard";
import { submitStaticAttempt } from "@/components/lesson-types/staticAttempt";
import type { ContenuQuAuraisTuFait, Lesson } from "@/lib/types";

export function QuAuraisTuFaitForm({
  lesson,
  contenu,
}: {
  lesson: Pick<Lesson, "id" | "titre">;
  contenu: ContenuQuAuraisTuFait;
}) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [validated, setValidated] = useState(false);
  const [streak, setStreak] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selected = contenu.choix.find((c) => c.id === selectedId) ?? null;

  async function handleValidate() {
    if (!selected) return;
    setSubmitting(true);
    setError(null);

    const result = await submitStaticAttempt({
      lessonId: lesson.id,
      promptSoumis: selected.label,
      feedback: selected.explication,
      score: selected.bonne ? 5 : 2,
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
          Qu&apos;aurais-tu fait ?
        </span>
        <h1 className="text-xl font-bold text-brand-950">{lesson.titre}</h1>
        <p className="whitespace-pre-line text-brand-800">{contenu.situation}</p>
      </Card>

      <Card className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          {contenu.choix.map((choix) => {
            const isSelected = selectedId === choix.id;
            const showResult = isSelected;
            return (
              <div key={choix.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(choix.id)}
                  disabled={selectedId !== null}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition-colors disabled:cursor-not-allowed ${
                    isSelected
                      ? choix.bonne
                        ? "border-brand-600 bg-brand-50 ring-1 ring-brand-600"
                        : "border-amber-400 bg-amber-50 ring-1 ring-amber-400"
                      : "border-sand-300 bg-white hover:border-brand-300 disabled:opacity-60"
                  }`}
                >
                  <span className="block font-medium text-brand-950">{choix.label}</span>
                </button>
                {showResult && (
                  <p
                    className={`mt-1.5 rounded-lg px-3 py-2 text-sm ${
                      choix.bonne ? "bg-brand-50 text-brand-800" : "bg-amber-50 text-amber-900"
                    }`}
                  >
                    {choix.bonne ? "✅ " : "⚠️ "}
                    {choix.explication}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        {selected ? (
          <Button onClick={handleValidate} disabled={submitting} className="self-start">
            {submitting ? "Validation..." : "Valider la leçon"}
          </Button>
        ) : null}
      </Card>
    </>
  );
}
