"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LessonCompletedCard } from "@/components/lesson-types/LessonCompletedCard";
import type { ContenuQuestionGuidee, Lesson } from "@/lib/types";

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

export function QuestionGuideeForm({
  lesson,
  contenu,
}: {
  lesson: Pick<Lesson, "id" | "titre" | "mise_en_situation" | "consigne">;
  contenu: ContenuQuestionGuidee;
}) {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [reflexionEnvoyee, setReflexionEnvoyee] = useState(false);
  const [reponseReflexion, setReponseReflexion] = useState("");
  const [attemptCount, setAttemptCount] = useState(0);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validated, setValidated] = useState(false);
  const [streak, setStreak] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleEvaluate() {
    if (!prompt.trim() || evaluating) return;
    setError(null);
    setEvaluating(true);
    setEvaluation(null);

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: lesson.id, prompt }),
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
          Mise en situation
        </span>
        <h1 className="text-xl font-bold text-brand-950">{lesson.titre}</h1>
        <p className="whitespace-pre-line text-brand-800">{lesson.mise_en_situation}</p>
        <div className="mt-2 rounded-lg bg-brand-50 p-4">
          <p className="whitespace-pre-line text-sm font-medium text-brand-900">
            {lesson.consigne}
          </p>
        </div>
      </Card>

      {!reflexionEnvoyee ? (
        <Card className="flex flex-col gap-3">
          <label htmlFor="prompt" className="text-sm font-semibold text-brand-900">
            Ton prompt
          </label>
          <textarea
            id="prompt"
            rows={6}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Écris ici le prompt que tu enverrais à Claude..."
            className="rounded-lg border border-sand-300 px-3 py-2 text-base focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <Button
            onClick={() => setReflexionEnvoyee(true)}
            disabled={!prompt.trim()}
            className="self-start"
          >
            Envoyer mon prompt
          </Button>
        </Card>
      ) : (
        <>
          <Card className="flex flex-col gap-3 border-brand-200 bg-brand-50">
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
              Avant de te répondre, Claude te pose une question
            </span>
            <p className="font-medium text-brand-900">{contenu.question_reflexive}</p>
            <textarea
              rows={3}
              value={reponseReflexion}
              onChange={(e) => setReponseReflexion(e.target.value)}
              placeholder="Écris ta réponse ici..."
              className="rounded-lg border border-sand-300 bg-white px-3 py-2 text-base focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            {!evaluation && (
              <Button
                onClick={handleEvaluate}
                disabled={!reponseReflexion.trim() || evaluating}
                className="self-start"
              >
                {evaluating ? "Claude prépare ton feedback..." : "Voir le feedback complet"}
              </Button>
            )}
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
          </Card>

          {evaluation && (
            <Card className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-brand-500">
                  Feedback complet de Claude
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
