"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LessonCompletedCard } from "@/components/lesson-types/LessonCompletedCard";
import type { ContenuRelanceEnDeuxTemps, Lesson } from "@/lib/types";

interface Evaluation {
  score: number;
  feedback: string;
  points_forts: string[];
  points_a_ameliorer: string[];
}

const MAX_ATTEMPTS = 2;

function ScoreDots({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Note : ${score} sur 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`h-3 w-3 rounded-full ${n <= score ? "bg-brand-600" : "bg-brand-100"}`}
        />
      ))}
      <span className="ml-1 text-sm font-semibold text-brand-800">{score}/5</span>
    </div>
  );
}

export function RelanceEnDeuxTempsForm({
  lesson,
  contenu,
}: {
  lesson: Pick<Lesson, "id" | "titre">;
  contenu: ContenuRelanceEnDeuxTemps;
}) {
  const router = useRouter();
  const [premierPrompt, setPremierPrompt] = useState("");
  const [reponseRevelee, setReponseRevelee] = useState(false);
  const [relance, setRelance] = useState("");
  const [attemptCount, setAttemptCount] = useState(0);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validated, setValidated] = useState(false);
  const [streak, setStreak] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleEvaluateRelance() {
    if (!relance.trim() || evaluating) return;
    setError(null);
    setEvaluating(true);
    setEvaluation(null);

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: lesson.id, prompt: relance }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Une erreur est survenue, réessaie.");
        return;
      }

      setEvaluation(data);
      setAttemptCount((c) => c + 1);
    } catch {
      setError("Impossible de contacter le serveur, vérifie ta connexion.");
    } finally {
      setEvaluating(false);
    }
  }

  async function handleValidate() {
    setValidating(true);
    setError(null);

    try {
      const res = await fetch("/api/complete-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: lesson.id }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Impossible de valider la leçon.");
        return;
      }

      setStreak(data.streakCount);
      setValidated(true);
      router.refresh();
    } catch {
      setError("Impossible de contacter le serveur, vérifie ta connexion.");
    } finally {
      setValidating(false);
    }
  }

  if (validated) return <LessonCompletedCard streak={streak} />;

  return (
    <>
      <Card className="flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-500">
          Relance en deux temps
        </span>
        <h1 className="text-xl font-bold text-brand-950">{lesson.titre}</h1>
        <p className="whitespace-pre-line text-brand-800">{contenu.situation}</p>
      </Card>

      {!reponseRevelee ? (
        <Card className="flex flex-col gap-3">
          <label htmlFor="premier-prompt" className="text-sm font-semibold text-brand-900">
            Étape 1 — Ton premier prompt
          </label>
          <textarea
            id="premier-prompt"
            rows={4}
            value={premierPrompt}
            onChange={(e) => setPremierPrompt(e.target.value)}
            placeholder="Écris ici le prompt que tu enverrais en premier..."
            className="rounded-lg border border-sand-300 px-3 py-2 text-base focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <Button
            onClick={() => setReponseRevelee(true)}
            disabled={!premierPrompt.trim()}
            className="self-start"
          >
            Envoyer
          </Button>
        </Card>
      ) : (
        <>
          <Card className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-500">
              Réponse obtenue
            </span>
            <p className="whitespace-pre-line text-brand-800">{contenu.premiere_reponse}</p>
          </Card>

          <Card className="flex flex-col gap-3">
            <label htmlFor="relance" className="text-sm font-semibold text-brand-900">
              Étape 2 — Cette réponse est trop générique. Écris ta relance.
            </label>
            <textarea
              id="relance"
              rows={5}
              value={relance}
              onChange={(e) => setRelance(e.target.value)}
              disabled={evaluating}
              placeholder="Écris ici ta relance pour obtenir mieux..."
              className="rounded-lg border border-sand-300 px-3 py-2 text-base focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-sand-50"
            />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            {!evaluation && (
              <Button
                onClick={handleEvaluateRelance}
                disabled={!relance.trim() || evaluating}
                className="self-start"
              >
                {evaluating ? "Claude évalue ta relance..." : "Évaluer ma relance"}
              </Button>
            )}
          </Card>

          {evaluation && (
            <Card className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-brand-500">
                  Feedback de Claude
                </span>
                <ScoreDots score={evaluation.score} />
              </div>
              <p className="text-brand-900">{evaluation.feedback}</p>

              {evaluation.points_forts.length > 0 && (
                <div>
                  <p className="mb-1 text-sm font-semibold text-brand-900">Points forts</p>
                  <ul className="list-inside list-disc text-sm text-brand-700">
                    {evaluation.points_forts.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}

              {evaluation.points_a_ameliorer.length > 0 && (
                <div>
                  <p className="mb-1 text-sm font-semibold text-brand-900">
                    Pistes d&apos;amélioration
                  </p>
                  <ul className="list-inside list-disc text-sm text-brand-700">
                    {evaluation.points_a_ameliorer.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {attemptCount < MAX_ATTEMPTS && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEvaluation(null);
                      setError(null);
                    }}
                  >
                    Réessayer
                  </Button>
                )}
                <Button onClick={handleValidate} disabled={validating}>
                  {validating ? "Validation..." : "Valider la leçon"}
                </Button>
              </div>
            </Card>
          )}
        </>
      )}
    </>
  );
}
