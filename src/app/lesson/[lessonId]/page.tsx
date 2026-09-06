import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/data";
import { Navbar } from "@/components/Navbar";
import { LessonForm } from "@/components/LessonForm";
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
  if (!profile || !profile.onboarding_complete) redirect("/onboarding");

  const { data: lesson } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", params.lessonId)
    .single<Lesson>();

  if (!lesson) notFound();

  const isForUser =
    lesson.track === profile.profil && (lesson.metier === null || lesson.metier === profile.metier);

  if (!isForUser) redirect("/dashboard");

  const { data: progress } = await supabase
    .from("user_progress")
    .select("statut")
    .eq("user_id", user.id)
    .eq("lesson_id", lesson.id)
    .maybeSingle();

  return (
    <>
      <Navbar loggedIn />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8">
        <LessonForm lesson={lesson} alreadyCompleted={progress?.statut === "termine"} />
      </main>
    </>
  );
}
