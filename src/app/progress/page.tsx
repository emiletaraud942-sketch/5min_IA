import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCompletionDates, getProfile, getProgressMap, getTrackLessons } from "@/lib/data";
import { computeCurrentStreak } from "@/lib/streak";
import { getCompetences } from "@/lib/competences";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StreakBadge } from "@/components/ui/StreakBadge";
import { CompetenceGauge } from "@/components/ui/CompetenceGauge";

interface AttemptRow {
  id: string;
  score: number;
  date: string;
  lessons: { titre: string } | null;
}

export default async function ProgressPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const profile = await getProfile(supabase, user.id);
  if (!profile || (!profile.onboarding_complete && !profile.is_admin)) redirect("/onboarding");

  const [lessons, progressMap, completionDates, attemptsRes, competences] = await Promise.all([
    getTrackLessons(supabase, profile),
    getProgressMap(supabase, user.id),
    getCompletionDates(supabase, user.id),
    supabase
      .from("attempts")
      .select("id, score, date, lessons(titre)")
      .eq("user_id", user.id)
      .order("date", { ascending: false }),
    getCompetences(supabase, user.id),
  ]);

  const attempts = (attemptsRes.data ?? []) as unknown as AttemptRow[];
  const completedCount = lessons.filter(
    (l) => progressMap[l.id]?.statut === "termine",
  ).length;
  const streak = computeCurrentStreak(completionDates);

  return (
    <>
      <Navbar loggedIn />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <h1 className="text-2xl font-bold text-brand-950 lg:text-3xl">Ma progression</h1>

        <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="flex flex-col items-center gap-2 text-center">
                <span className="text-sm text-brand-600">Streak actuel</span>
                <StreakBadge days={streak} size="lg" />
              </Card>
              <Card className="flex flex-col items-center gap-2 text-center">
                <span className="text-sm text-brand-600">Leçons terminées</span>
                <span className="text-2xl font-bold text-brand-950">
                  {completedCount}/{lessons.length}
                </span>
              </Card>
            </div>

            <Card>
              <ProgressBar
                value={completedCount}
                total={lessons.length}
                label="Ton parcours"
              />
            </Card>

            <Card>
              <CompetenceGauge competences={competences} />
            </Card>
          </div>

          <div className="lg:col-span-2">
            <h2 className="mb-3 text-lg font-semibold text-brand-950">
              Historique des leçons
            </h2>
            {attempts.length === 0 ? (
              <Card className="text-center text-brand-700">
                Tu n&apos;as pas encore de tentative enregistrée.
              </Card>
            ) : (
              <Card className="divide-y divide-sand-200 p-0">
                {attempts.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between gap-4 px-5 py-3.5"
                  >
                    <div>
                      <p className="font-medium text-brand-950">
                        {a.lessons?.titre ?? "Leçon"}
                      </p>
                      <p className="text-xs text-brand-500">
                        {new Date(a.date).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-800">
                      {a.score}/5
                    </span>
                  </div>
                ))}
              </Card>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
