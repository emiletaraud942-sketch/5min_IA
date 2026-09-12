import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCompletionDates, getProfile, getProgressMap, getTrackLessons } from "@/lib/data";
import { computeCurrentStreak } from "@/lib/streak";
import { Navbar } from "@/components/Navbar";
import { AdminTrackSwitcher } from "@/components/AdminTrackSwitcher";
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
  if (!profile || (!profile.onboarding_complete && !profile.is_admin)) redirect("/onboarding");

  const [lessons, progressMap, completionDates] = await Promise.all([
    getTrackLessons(supabase, profile),
    getProgressMap(supabase, user.id),
    getCompletionDates(supabase, user.id),
  ]);

  // The daily "lesson of the day" flow only ever picks from the regular
  // lessons — never from a paid "groupe" folder, so it's never blocked by
  // a paywall unexpectedly.
  const dailyLessons = lessons.filter((l) => !l.groupe);
  const completedCount = dailyLessons.filter(
    (l) => progressMap[l.id]?.statut === "termine",
  ).length;
  const nextLesson = dailyLessons.find((l) => progressMap[l.id]?.statut !== "termine");
  const streak = computeCurrentStreak(completionDates);
  const allDone = dailyLessons.length > 0 && completedCount === dailyLessons.length;

  return (
    <>
      <Navbar loggedIn />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {profile.is_admin && (
          <AdminTrackSwitcher currentProfil={profile.profil} currentMetier={profile.metier} />
        )}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-brand-600">Bienvenue</p>
            <h1 className="text-2xl font-bold text-brand-950 lg:text-3xl">Ta leçon du jour</h1>
          </div>
          <StreakBadge days={streak} size="lg" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
          <div className="lg:col-span-2">
            {nextLesson ? (
              <Card className="flex flex-col gap-4 lg:p-8">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-brand-500">
                    Leçon {dailyLessons.indexOf(nextLesson) + 1} / {dailyLessons.length}
                  </span>
                  <h2 className="mt-1 text-xl font-bold text-brand-950 lg:text-2xl">
                    {nextLesson.titre}
                  </h2>
                </div>
                <p className="text-brand-800">{nextLesson.mise_en_situation}</p>
                <LinkButton href={`/lesson/${nextLesson.id}`} className="self-start">
                  Commencer la leçon (5 min)
                </LinkButton>
              </Card>
            ) : allDone ? (
              <Card className="text-center lg:p-8">
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
          </div>

          <div className="flex flex-col gap-4">
            <Card>
              <ProgressBar
                value={completedCount}
                total={dailyLessons.length}
                label="Progression du parcours"
              />
            </Card>
            <Link
              href="/lessons"
              className="rounded-xl2 border border-sand-200 bg-white px-5 py-4 text-center text-sm font-semibold text-brand-800 shadow-card transition-colors hover:bg-sand-50"
            >
              Voir toutes mes leçons
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
