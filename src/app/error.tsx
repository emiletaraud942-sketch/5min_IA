"use client";

import { useEffect } from "react";
import { Button, LinkButton } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <span className="text-4xl">😕</span>
      <h1 className="text-xl font-bold text-brand-950">Une erreur est survenue</h1>
      <p className="text-brand-700">
        Ce n&apos;est pas grave, réessaie — si ça persiste, reviens un peu plus tard.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset}>Réessayer</Button>
        <LinkButton href="/dashboard" variant="secondary">
          Tableau de bord
        </LinkButton>
      </div>
    </main>
  );
}
