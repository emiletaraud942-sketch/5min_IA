"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LessonCompletedCard } from "@/components/lesson-types/LessonCompletedCard";
import { submitStaticAttempt } from "@/components/lesson-types/staticAttempt";
import type { ContenuDevineLaDifference, Lesson } from "@/lib/types";

export function DevineLaDifferenceForm({
  lesson,
  contenu,
}: {
  lesson: Pick<Lesson, "id" | "titre">;
  contenu: ContenuDevineLaDifference;
}) {
  const router = useRouter();
  // Stable per mount so the labels don't shuffle after the user picks.
  const swap = useMemo(() => Math.random() < 0.5, []);
  const [picked, setPicked] = useState<"A" | "B" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [validated, setValidated] = useState(false);
  const [streak, setStreak] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const optionA = swap
    ? { prompt: contenu.prompt_fort, reponse: contenu.reponse_fort, estFort: true }
    : { prompt: contenu.prompt_faible, reponse: contenu.reponse_faible, estFort: false };
  const optionB = swap
    ? { prompt: contenu.prompt_faible, reponse: contenu.reponse_faible, estFort: false }
    : { prompt: contenu.prompt_fort, reponse: contenu.reponse_fort, estFort: true };

  const correctLetter = optionA.estFort ? "A" : "B";
  const isCorrect = picked === correctLetter;

  async function handleValidate() {
    if (!picked) return;
    setSubmitting(true);
    setError(null);

    const result = await submitStaticAttempt({
      lessonId: lesson.id,
      promptSoumis: `Choix : prompt ${picked}`,
      feedback: contenu.explication,
      score: isCorrect ? 5 : 2,
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
          Devine la différence
        </span>
        <h1 className="text-xl font-bold text-brand-950">{lesson.titre}</h1>
        <p className="whitespace-pre-line text-brand-800">{contenu.situation}</p>
        <p className="text-sm font-medium text-brand-700">
          Quel prompt donne le meilleur résultat ?
        </p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {([
          ["A", optionA],
          ["B", optionB],
        ] as const).map(([letter, option]) => {
          const isPicked = picked === letter;
          const isThisCorrect = letter === correctLetter;
          return (
            <button
              key={letter}
              type="button"
              disabled={picked !== null}
              onClick={() => setPicked(letter)}
              className={`text-left disabled:cursor-not-allowed ${picked ? "" : ""}`}
            >
              <Card
                className={`h-full transition-shadow ${
                  picked
                    ? isThisCorrect
                      ? "border-brand-600 ring-1 ring-brand-600"
                      : isPicked
                        ? "border-amber-400 ring-1 ring-amber-400"
                        : "opacity-70"
                    : "hover:shadow-md"
                }`}
              >
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-500">
                  Prompt {letter}
                </p>
                <p className="mb-3 text-sm font-medium text-brand-900">{option.prompt}</p>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-500">
                  Réponse obtenue
                </p>
                <p className="text-sm text-brand-700">{option.reponse}</p>
                {picked && isThisCorrect ? (
                  <p className="mt-3 text-sm font-semibold text-brand-700">✅ Le bon choix</p>
                ) : null}
              </Card>
            </button>
          );
        })}
      </div>

      {picked ? (
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
