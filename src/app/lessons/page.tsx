import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getProfile, getProgressMap, getTrackLessons } from "@/lib/data";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/Card";

export default async function LessonsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const profile = await getProfile(supabase, user.id);
  if (!profile || (!profile.onboarding_complete && !profile.is_admin)) redirect("/onboarding");

  const [lessons, progressMap] = await Promise.all([
    getTrackLessons(supabase, profile),
    getProgressMap(supabase, user.id),
  ]);

  const completedCount = lessons.filter(
    (l) => progressMap[l.id]?.statut === "termine",
  ).length;

  return (
    <>
      <Navbar loggedIn />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div>
          <p className="text-sm text-brand-600">
            {completedCount}/{lessons.length} leçons terminées
          </p>
          <h1 className="text-2xl font-bold text-brand-950">Toutes tes leçons</h1>
          <p className="mt-1 text-sm text-brand-700">
            Clique sur n&apos;importe quelle leçon pour la faire ou la refaire.
          </p>
        </div>

        <ol className="flex flex-col gap-3">
          {lessons.map((lesson, i) => {
            const progress = progressMap[lesson.id];
            const done = progress?.statut === "termine";

            return (
              <li key={lesson.id}>
                <Link href={`/lesson/${lesson.id}`} className="block">
                  <Card className="flex items-center gap-4 transition-shadow hover:shadow-md">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        done
                          ? "bg-brand-600 text-white"
                          : "bg-brand-100 text-brand-700"
                      }`}
                    >
                      {done ? "✓" : i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-brand-950">{lesson.titre}</p>
                      <p className="truncate text-sm text-brand-600">
                        {lesson.mise_en_situation}
                      </p>
                    </div>
                    {done ? (
                      <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                        Terminée
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-full bg-sand-100 px-2.5 py-1 text-xs font-semibold text-brand-600">
                        À faire
                      </span>
                    )}
                  </Card>
                </Link>
              </li>
            );
          })}
        </ol>

        {lessons.length === 0 ? (
          <Card className="text-center text-brand-700">
            Aucune leçon disponible pour le moment.
          </Card>
        ) : null}
      </main>
    </>
  );
}
