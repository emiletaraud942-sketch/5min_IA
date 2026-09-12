import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/data";
import { canOpenLesson, getLessonAccess, recordLessonOpen } from "@/lib/access";
import { Navbar } from "@/components/Navbar";
import { LessonForm } from "@/components/LessonForm";
import { Paywall } from "@/components/Paywall";
import type { Lesson } from "@/lib/types";

export default async function LessonPage({
  params,
}: {
  params: { lessonId: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const profile = await getProfile(supabase, user.id);
  if (!profile || (!profile.onboarding_complete && !profile.is_admin)) redirect("/onboarding");

  const { data: lesson } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", params.lessonId)
    .single<Lesson>();

  if (!lesson) notFound();

  const isForUser =
    profile.is_admin ||
    (lesson.track === profile.profil && (lesson.metier === null || lesson.metier === profile.metier));

  if (!isForUser) redirect("/dashboard");

  const isSpecial = Boolean(lesson.groupe);

  if (isSpecial) {
    const access = await getLessonAccess(supabase, user.id);
    const allowed = canOpenLesson({
      lessonId: lesson.id,
      isSpecial: true,
      isAdmin: profile.is_admin,
      access,
    });

    if (!allowed) {
      return (
        <>
          <Navbar loggedIn />
          <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
            <Paywall lesson={lesson} />
          </main>
        </>
      );
    }

    if (!access.openedTodayIds.has(lesson.id) && !access.unlockedIds.has(lesson.id)) {
      await recordLessonOpen(supabase, user.id, lesson.id);
    }
  }

  const { data: progress } = await supabase
    .from("user_progress")
    .select("statut")
    .eq("user_id", user.id)
    .eq("lesson_id", lesson.id)
    .maybeSingle();

  return (
    <>
      <Navbar loggedIn />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <LessonForm
          lesson={lesson}
          alreadyCompleted={progress?.statut === "termine"}
          unlimitedAttempts={profile.is_admin}
        />
      </main>
    </>
  );
}
