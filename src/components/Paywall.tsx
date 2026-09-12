"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button, LinkButton } from "@/components/ui/Button";
import { FREE_SPECIAL_LESSONS_PER_DAY } from "@/lib/access";
import type { Lesson } from "@/lib/types";

export function Paywall({ lesson }: { lesson: Pick<Lesson, "id" | "titre"> }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUnlock() {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: lesson.id }),
      });
      const data = await res.json();

      if (!res.ok || !data.url) {
        setError(data.error || "Impossible de démarrer le paiement, réessaie.");
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Impossible de contacter le serveur, vérifie ta connexion.");
      setLoading(false);
    }
  }

  return (
    <Card className="text-center">
      <span className="text-3xl">🔒</span>
      <h1 className="mb-2 mt-3 text-xl font-bold text-brand-950">
        Quota gratuit atteint pour aujourd&apos;hui
      </h1>
      <p className="mb-1 text-brand-700">
        Tu as déjà utilisé tes {FREE_SPECIAL_LESSONS_PER_DAY} leçons spéciales gratuites du jour.
      </p>
      <p className="mb-5 text-brand-700">
        Débloque « <strong>{lesson.titre}</strong> » dès maintenant pour 1€ — elle sera à toi pour
        toujours, sans compter dans ton quota les prochaines fois.
      </p>
      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={handleUnlock} disabled={loading}>
          {loading ? "Redirection..." : "Débloquer pour 1€"}
        </Button>
        <LinkButton href="/lessons" variant="secondary">
          Revenir demain
        </LinkButton>
      </div>
    </Card>
  );
}
