"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button, LinkButton } from "@/components/ui/Button";

/**
 * Wraps an interactive lesson component: if the lesson was already
 * completed, shows a confirmation screen first with a "Refaire cette leçon"
 * button before mounting the real interactive form. Redoing never double
 * counts the competency gauge — that's guarded server-side in
 * /api/complete-lesson (only the first-ever completion increments it).
 */
export function AlreadyCompletedGate({
  titre,
  skip = false,
  children,
}: {
  titre: string;
  /** true = render children directly (not completed yet, or admin). */
  skip?: boolean;
  children: React.ReactNode;
}) {
  const [practicing, setPracticing] = useState(false);

  if (skip || practicing) return <>{children}</>;

  return (
    <Card className="text-center">
      <h1 className="mb-2 text-xl font-bold text-brand-950">
        Tu as déjà validé cette leçon ✅
      </h1>
      <p className="mb-4 text-brand-700">{titre}</p>
      <div className="flex justify-center gap-3">
        <Button onClick={() => setPracticing(true)}>Refaire cette leçon</Button>
        <LinkButton href="/dashboard" variant="secondary">
          Retour à mes leçons
        </LinkButton>
      </div>
    </Card>
  );
}
