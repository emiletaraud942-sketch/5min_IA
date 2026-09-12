"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button, LinkButton } from "@/components/ui/Button";
import type { Lesson } from "@/lib/types";

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

function Chrono({ secondes }: { secondes: number }) {
  const [remaining, setRemaining] = useState(secondes);

  useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, [remaining]);

  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  const low = remaining <= 10 && remaining > 0;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold ${
        remaining === 0
          ? "bg-sand-200 text-sand-600"
          : low
            ? "bg-red-100 text-red-700"
            : "bg-amber-100 text-amber-800"
      }`}
    >
      ⏱️ {remaining === 0 ? "Temps écoulé" : `${m}:${s.toString().padStart(2, "0")}`}
    </span>
  );
}

export function LessonForm({
  lesson,
  alreadyCompleted,
  unlimitedAttempts = false,
  explicationPrincipe,
  promptInitial = "",
  chronoSecondes,
}: {
  lesson: Lesson;
  alreadyCompleted: boolean;
  unlimitedAttempts?: boolean;
  explicationPrincipe?: string;
  promptInitial?: string;
  chronoSecondes?: number;
}) {
  const router = useRouter();
  const [prompt, setPrompt] = useState(promptInitial);
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

  function handleRetry() {
    setEvaluation(null);
    setError(null);
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

  if (alreadyCompleted && !unlimitedAttempts && !validated) {
    return (
      <Card className="text-center">
        <h1 className="mb-2 text-xl font-bold text-brand-950">
          Tu as déjà validé cette leçon ✅
        </h1>
        <p className="mb-4 text-brand-700">{lesson.titre}</p>
        <LinkButton href="/dashboard" variant="secondary">
          Retour à mes leçons
        </LinkButton>
      </Card>
    );
  }

  if (validated) {
    return (
      <Card className="text-center">
        <h1 className="mb-2 text-xl font-bold text-brand-950">Leçon validée 🎉</h1>
        {streak !== null && (
          <p className="mb-4 text-brand-700">
            Tu es à <strong>{streak}</strong> jour{streak > 1 ? "s" : ""} d&apos;affilée.
          </p>
        )}
        <div className="flex justify-center gap-3">
          <LinkButton href="/dashboard">Continuer</LinkButton>
          <LinkButton href="/progress" variant="secondary">
            Ma progression
          </LinkButton>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-500">
            Mise en situation
          </span>
          {chronoSecondes ? <Chrono secondes={chronoSecondes} /> : null}
        </div>
        <h1 className="text-xl font-bold text-brand-950">{lesson.titre}</h1>
        <p className="whitespace-pre-line text-brand-800">{lesson.mise_en_situation}</p>
        <div className="mt-2 rounded-lg bg-brand-50 p-4">
          <p className="whitespace-pre-line text-sm font-medium text-brand-900">
            {lesson.consigne}
          </p>
        </div>
      </Card>

      <Card className="flex flex-col gap-3">
        <label htmlFor="prompt" className="text-sm font-semibold text-brand-900">
          Ton prompt
        </label>
        <textarea
          id="prompt"
          rows={6}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={evaluating}
          placeholder="Écris ici le prompt que tu enverrais à Claude..."
          className="rounded-lg border border-sand-300 px-3 py-2 text-base focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-sand-50"
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {!evaluation && (
          <Button
            onClick={handleEvaluate}
            disabled={!prompt.trim() || evaluating}
            className="self-start"
          >
            {evaluating ? "Claude évalue ton prompt..." : "Évaluer mon prompt"}
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

          {explicationPrincipe ? (
            <details className="rounded-lg border border-brand-200 bg-brand-50 p-3 open:pb-3">
              <summary className="cursor-pointer text-sm font-semibold text-brand-800">
                Pourquoi ça marche mieux ? Le principe général
              </summary>
              <p className="mt-2 text-sm text-brand-800">{explicationPrincipe}</p>
            </details>
          ) : null}

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex flex-wrap gap-3">
            {(unlimitedAttempts || attemptCount < MAX_ATTEMPTS) && (
              <Button variant="outline" onClick={handleRetry}>
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
  );
}
