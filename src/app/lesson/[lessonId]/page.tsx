import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/data";
import { canOpenLesson, getLessonAccess, recordLessonOpen } from "@/lib/access";
import { Navbar } from "@/components/Navbar";
import { LessonForm } from "@/components/LessonForm";
import { Paywall } from "@/components/Paywall";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { QuAuraisTuFaitForm } from "@/components/lesson-types/QuAuraisTuFaitForm";
import { DevineLaDifferenceForm } from "@/components/lesson-types/DevineLaDifferenceForm";
import { ChoisisLaFiableForm } from "@/components/lesson-types/ChoisisLaFiableForm";
import { TrouveErreurForm } from "@/components/lesson-types/TrouveErreurForm";
import { RelanceEnDeuxTempsForm } from "@/components/lesson-types/RelanceEnDeuxTempsForm";
import { QuestionGuideeForm } from "@/components/lesson-types/QuestionGuideeForm";
import type {
  ContenuChoisisLaFiable,
  ContenuCorrigeLePrompt,
  ContenuDefiChronometre,
  ContenuDevineLaDifference,
  ContenuExplicationEtendue,
  ContenuQuAuraisTuFait,
  ContenuQuestionGuidee,
  ContenuRelanceEnDeuxTemps,
  ContenuTrouveErreur,
  Lesson,
} from "@/lib/types";

function AlreadyCompletedCard({ titre }: { titre: string }) {
  return (
    <Card className="text-center">
      <h1 className="mb-2 text-xl font-bold text-brand-950">
        Tu as déjà validé cette leçon ✅
      </h1>
      <p className="mb-4 text-brand-700">{titre}</p>
      <LinkButton href="/dashboard" variant="secondary">
        Retour à mes leçons
      </LinkButton>
    </Card>
  );
}

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

  const alreadyCompleted = progress?.statut === "termine";

  function renderContent() {
    switch (lesson!.type_lecon) {
      case "explication_etendue": {
        const contenu = lesson!.contenu as ContenuExplicationEtendue;
        return (
          <LessonForm
            lesson={lesson!}
            alreadyCompleted={alreadyCompleted}
            unlimitedAttempts={profile!.is_admin}
            explicationPrincipe={contenu?.explication_principe}
          />
        );
      }
      case "corrige_le_prompt": {
        const contenu = lesson!.contenu as ContenuCorrigeLePrompt;
        return (
          <LessonForm
            lesson={lesson!}
            alreadyCompleted={alreadyCompleted}
            unlimitedAttempts={profile!.is_admin}
            promptInitial={contenu?.prompt_depart}
          />
        );
      }
      case "defi_chronometre": {
        const contenu = lesson!.contenu as ContenuDefiChronometre;
        return (
          <LessonForm
            lesson={lesson!}
            alreadyCompleted={alreadyCompleted}
            unlimitedAttempts={profile!.is_admin}
            chronoSecondes={contenu?.chrono_secondes}
          />
        );
      }
      case "qu_aurais_tu_fait":
        if (alreadyCompleted && !profile!.is_admin)
          return <AlreadyCompletedCard titre={lesson!.titre} />;
        return (
          <QuAuraisTuFaitForm lesson={lesson!} contenu={lesson!.contenu as ContenuQuAuraisTuFait} />
        );
      case "devine_la_difference":
        if (alreadyCompleted && !profile!.is_admin)
          return <AlreadyCompletedCard titre={lesson!.titre} />;
        return (
          <DevineLaDifferenceForm
            lesson={lesson!}
            contenu={lesson!.contenu as ContenuDevineLaDifference}
          />
        );
      case "choisis_la_fiable":
        if (alreadyCompleted && !profile!.is_admin)
          return <AlreadyCompletedCard titre={lesson!.titre} />;
        return (
          <ChoisisLaFiableForm
            lesson={lesson!}
            contenu={lesson!.contenu as ContenuChoisisLaFiable}
          />
        );
      case "trouve_erreur":
        if (alreadyCompleted && !profile!.is_admin)
          return <AlreadyCompletedCard titre={lesson!.titre} />;
        return (
          <TrouveErreurForm lesson={lesson!} contenu={lesson!.contenu as ContenuTrouveErreur} />
        );
      case "relance_en_deux_temps":
        if (alreadyCompleted && !profile!.is_admin)
          return <AlreadyCompletedCard titre={lesson!.titre} />;
        return (
          <RelanceEnDeuxTempsForm
            lesson={lesson!}
            contenu={lesson!.contenu as ContenuRelanceEnDeuxTemps}
          />
        );
      case "question_guidee":
        if (alreadyCompleted && !profile!.is_admin)
          return <AlreadyCompletedCard titre={lesson!.titre} />;
        return (
          <QuestionGuideeForm
            lesson={lesson!}
            contenu={lesson!.contenu as ContenuQuestionGuidee}
          />
        );
      case "standard":
      default:
        return (
          <LessonForm
            lesson={lesson!}
            alreadyCompleted={alreadyCompleted}
            unlimitedAttempts={profile!.is_admin}
          />
        );
    }
  }

  return (
    <>
      <Navbar loggedIn />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {renderContent()}
      </main>
    </>
  );
}
