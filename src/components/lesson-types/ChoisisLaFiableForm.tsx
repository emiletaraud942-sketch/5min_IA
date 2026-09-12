"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LessonCompletedCard } from "@/components/lesson-types/LessonCompletedCard";
import { submitStaticAttempt } from "@/components/lesson-types/staticAttempt";
import type { ContenuChoisisLaFiable, Lesson } from "@/lib/types";

export function ChoisisLaFiableForm({
  lesson,
  contenu,
}: {
  lesson: Pick<Lesson, "id" | "titre">;
  contenu: ContenuChoisisLaFiable;
}) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [validated, setValidated] = useState(false);
  const [streak, setStreak] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selected = contenu.reponses.find((r) => r.id === selectedId) ?? null;

  async function handleValidate() {
    if (!selected) return;
    setSubmitting(true);
    setError(null);

    const result = await submitStaticAttempt({
      lessonId: lesson.id,
      promptSoumis: `Réponse choisie : ${selected.label}`,
      feedback: contenu.explication,
      score: selected.fiable ? 5 : 2,
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
          Choisis la réponse la plus fiable
        </span>
        <h1 className="text-xl font-bold text-brand-950">{lesson.titre}</h1>
        <div className="rounded-lg bg-sand-50 p-4">
          <p className="text-sm font-medium text-brand-900">« {contenu.question} »</p>
        </div>
      </Card>

      <div className="flex flex-col gap-3">
        {contenu.reponses.map((reponse) => {
          const isSelected = selectedId === reponse.id;
          return (
            <button
              key={reponse.id}
              type="button"
              disabled={selectedId !== null}
              onClick={() => setSelectedId(reponse.id)}
              className="text-left disabled:cursor-not-allowed"
            >
              <Card
                className={`transition-shadow ${
                  isSelected
                    ? reponse.fiable
                      ? "border-brand-600 ring-1 ring-brand-600"
                      : "border-amber-400 ring-1 ring-amber-400"
                    : selectedId
                      ? "opacity-70"
                      : "hover:shadow-md"
                }`}
              >
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-500">
                  {reponse.label}
                </p>
                <p className="text-sm text-brand-800">{reponse.texte}</p>
                {isSelected ? (
                  <p
                    className={`mt-2 text-sm font-semibold ${
                      reponse.fiable ? "text-brand-700" : "text-amber-800"
                    }`}
                  >
                    {reponse.fiable ? "✅ La plus fiable" : "⚠️ Pas la plus fiable"}
                  </p>
                ) : null}
              </Card>
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
