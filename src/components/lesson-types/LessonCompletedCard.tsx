import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";

export function LessonCompletedCard({ streak }: { streak: number | null }) {
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
