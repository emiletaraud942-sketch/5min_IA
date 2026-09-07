import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/Navbar";
import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

function LessonPreview() {
  return (
    <Card className="w-full max-w-md shrink-0 lg:p-7">
      <span className="text-xs font-semibold uppercase tracking-wide text-brand-500">
        Leçon du jour
      </span>
      <h3 className="mt-1 text-lg font-bold text-brand-950">
        Rédiger un compte-rendu de réunion en 2 minutes
      </h3>
      <p className="mt-2 text-sm text-brand-700">
        Écris le prompt que tu enverrais à Claude pour transformer tes notes en
        compte-rendu structuré.
      </p>
      <div className="mt-4 rounded-lg border border-sand-200 bg-sand-50 px-3 py-2.5 text-sm text-brand-600">
        Résume-moi ces notes de réunion avec une structure claire...
      </div>
      <div className="mt-4 flex items-center justify-between rounded-lg bg-brand-50 px-3 py-2.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
          Feedback de Claude
        </span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              className={`h-2.5 w-2.5 rounded-full ${n <= 4 ? "bg-brand-600" : "bg-brand-100"}`}
            />
          ))}
          <span className="ml-1 text-xs font-semibold text-brand-800">4/5</span>
        </div>
      </div>
    </Card>
  );
}

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <Navbar loggedIn={Boolean(user)} />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-16 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <section className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-start gap-6">
            <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
              5 minutes par jour
            </span>
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-brand-950 sm:text-4xl lg:text-5xl">
              Apprends à utiliser l&apos;IA au quotidien, sans jamais te sentir largué.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-brand-800">
              Une courte mise en situation, un prompt à écrire, un retour immédiat et
              personnalisé. Pas de jargon, pas de formation interminable : juste une
              leçon par jour, pensée pour ton métier ou ta vie de tous les jours.
            </p>
            <LinkButton href={user ? "/dashboard" : "/signup"} className="mt-2">
              {user ? "Reprendre ma leçon" : "Commencer gratuitement"}
            </LinkButton>
          </div>
          <div className="flex justify-center lg:justify-end">
            <LessonPreview />
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <Card>
            <h2 className="mb-2 font-semibold text-brand-900">1. Une mise en situation</h2>
            <p className="text-sm text-brand-700">
              Un cas concret tiré du quotidien : un compte-rendu, un rendez-vous, un
              mail administratif.
            </p>
          </Card>
          <Card>
            <h2 className="mb-2 font-semibold text-brand-900">2. Ton propre prompt</h2>
            <p className="text-sm text-brand-700">
              Tu écris exactement ce que tu enverrais à Claude ou ChatGPT, comme dans
              la vraie vie.
            </p>
          </Card>
          <Card>
            <h2 className="mb-2 font-semibold text-brand-900">3. Un retour immédiat</h2>
            <p className="text-sm text-brand-700">
              Claude évalue ton prompt et te donne un feedback concret pour
              progresser dès la prochaine leçon.
            </p>
          </Card>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <Card className="border-brand-200 bg-brand-50">
            <h2 className="mb-1 font-semibold text-brand-900">Parcours Pro</h2>
            <p className="text-sm text-brand-700">
              Commercial, RH, assistant, comptabilité... des leçons pensées pour ton
              métier.
            </p>
          </Card>
          <Card className="border-brand-200 bg-brand-50">
            <h2 className="mb-1 font-semibold text-brand-900">Parcours Particulier</h2>
            <p className="text-sm text-brand-700">
              Administratif, organisation, famille : de l&apos;IA utile pour la vie de
              tous les jours.
            </p>
          </Card>
        </section>
      </main>
      <footer className="border-t border-sand-200 py-6 text-center text-xs text-brand-500">
        5min IA — apprendre l&apos;IA au quotidien.
      </footer>
    </>
  );
}
