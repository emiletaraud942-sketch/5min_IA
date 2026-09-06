import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCompletionDates, getProfile, getProgressMap, getTrackLessons } from "@/lib/data";
import { computeCurrentStreak } from "@/lib/streak";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StreakBadge } from "@/components/ui/StreakBadge";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const profile = await getProfile(supabase, user.id);
  if (!profile || !profile.onboarding_complete) redirect("/onboarding");

  const [lessons, progressMap, completionDates] = await Promise.all([
    getTrackLessons(supabase, profile),
    getProgressMap(supabase, user.id),
    getCompletionDates(supabase, user.id),
  ]);

  const completedCount = lessons.filter(
    (l) => progressMap[l.id]?.statut === "termine",
  ).length;
  const nextLesson = lessons.find((l) => progressMap[l.id]?.statut !== "termine");
  const streak = computeCurrentStreak(completionDates);
  const allDone = lessons.length > 0 && completedCount === lessons.length;

  return (
    <>
      <Navbar loggedIn />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-brand-600">Bienvenue</p>
            <h1 className="text-2xl font-bold text-brand-950">Ta leçon du jour</h1>
          </div>
          <StreakBadge days={streak} size="lg" />
        </div>

        <ProgressBar
          value={completedCount}
          total={lessons.length}
          label="Progression du parcours"
        />

        {nextLesson ? (
          <Card className="flex flex-col gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-brand-500">
                Leçon {lessons.indexOf(nextLesson) + 1} / {lessons.length}
              </span>
              <h2 className="mt-1 text-xl font-bold text-brand-950">{nextLesson.titre}</h2>
            </div>
            <p className="text-brand-800">{nextLesson.mise_en_situation}</p>
            <LinkButton href={`/lesson/${nextLesson.id}`} className="self-start">
              Commencer la leçon (5 min)
            </LinkButton>
          </Card>
        ) : allDone ? (
          <Card className="text-center">
            <h2 className="mb-2 text-xl font-bold text-brand-950">
              Bravo, tu as terminé toutes les leçons disponibles !
            </h2>
            <p className="mb-4 text-brand-700">
              De nouvelles leçons arrivent bientôt. En attendant, jette un œil à ta
              progression.
            </p>
            <LinkButton href="/progress" variant="secondary">
              Voir ma progression
            </LinkButton>
          </Card>
        ) : (
          <Card className="text-center text-brand-700">
            Aucune leçon disponible pour le moment.
          </Card>
        )}

        <Link
          href="/progress"
          className="text-center text-sm font-medium text-brand-700 underline underline-offset-2"
        >
          Voir l&apos;historique de mes leçons
        </Link>
      </main>
    </>
  );
}
