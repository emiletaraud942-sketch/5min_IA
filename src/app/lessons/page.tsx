import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getProfile, getProgressMap, getTrackLessons } from "@/lib/data";
import { canOpenLesson, getLessonAccess } from "@/lib/access";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/Card";
import { LESSON_GROUPS, type Lesson } from "@/lib/types";

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

  const standardLessons = lessons.filter((l) => !l.groupe);
  const groupedLessons = lessons.filter((l) => l.groupe);

  const access = groupedLessons.length > 0 ? await getLessonAccess(supabase, user.id) : null;

  const completedCount = lessons.filter(
    (l) => progressMap[l.id]?.statut === "termine",
  ).length;

  const groups = new Map<string, Lesson[]>();
  for (const lesson of groupedLessons) {
    const key = lesson.groupe as string;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(lesson);
  }

  return (
    <>
      <Navbar loggedIn />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div>
          <p className="text-sm text-brand-600">
            {completedCount}/{lessons.length} leçons terminées
          </p>
          <h1 className="text-2xl font-bold text-brand-950">Toutes tes leçons</h1>
          <p className="mt-1 text-sm text-brand-700">
            Clique sur n&apos;importe quelle leçon pour la faire ou la refaire.
          </p>
        </div>

        {standardLessons.length > 0 && (
          <ol className="flex flex-col gap-3">
            {standardLessons.map((lesson, i) => {
              const done = progressMap[lesson.id]?.statut === "termine";
              return (
                <li key={lesson.id}>
                  <Link href={`/lesson/${lesson.id}`} className="block">
                    <Card className="flex items-center gap-4 transition-shadow hover:shadow-md">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          done ? "bg-brand-600 text-white" : "bg-brand-100 text-brand-700"
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
        )}

        {Array.from(groups.entries()).map(([groupeKey, groupLessons]) => {
          const meta = LESSON_GROUPS[groupeKey] ?? {
            title: "Leçons spéciales",
            description: "",
            icon: "⭐",
          };

          return (
            <div key={groupeKey} className="rounded-xl2 border-2 border-brand-200 bg-brand-50/50 p-4 sm:p-5">
              <div className="mb-4 flex items-start gap-3">
                <span className="text-2xl leading-none">{meta.icon}</span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                    Parcours spécial
                  </p>
                  <h2 className="text-lg font-bold text-brand-950">{meta.title}</h2>
                  {meta.description ? (
                    <p className="mt-0.5 text-sm text-brand-700">{meta.description}</p>
                  ) : null}
                  {!profile.is_admin && (
                    <p className="mt-1 text-xs text-brand-600">
                      2 leçons gratuites par jour. Au-delà, débloque une leçon pour 1€.
                    </p>
                  )}
                </div>
              </div>

              <ol className="flex flex-col gap-3">
                {groupLessons.map((lesson, i) => {
                  const done = progressMap[lesson.id]?.statut === "termine";
                  const locked =
                    access !== null &&
                    !canOpenLesson({
                      lessonId: lesson.id,
                      isSpecial: true,
                      isAdmin: profile.is_admin,
                      access,
                    });

                  return (
                    <li key={lesson.id}>
                      <Link href={`/lesson/${lesson.id}`} className="block">
                        <Card className="flex items-center gap-4 bg-white transition-shadow hover:shadow-md">
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                              done
                                ? "bg-brand-600 text-white"
                                : locked
                                  ? "bg-sand-200 text-sand-500"
                                  : "bg-brand-100 text-brand-700"
                            }`}
                          >
                            {done ? "✓" : locked ? "🔒" : i + 1}
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
                          ) : locked ? (
                            <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                              1€ à débloquer
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
            </div>
          );
        })}

        {lessons.length === 0 ? (
          <Card className="text-center text-brand-700">
            Aucune leçon disponible pour le moment.
          </Card>
        ) : null}
      </main>
    </>
  );
}
