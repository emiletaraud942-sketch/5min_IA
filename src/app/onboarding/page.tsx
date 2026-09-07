"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  METIER_LABELS,
  NIVEAU_LABELS,
  OBJECTIF_OPTIONS,
  type Metier,
  type NiveauDepart,
  type Track,
} from "@/lib/types";

const METIERS = Object.keys(METIER_LABELS) as Metier[];
const NIVEAUX = Object.keys(NIVEAU_LABELS) as NiveauDepart[];

function StepDots({ step }: { step: number }) {
  return (
    <div className="mb-6 flex items-center gap-2">
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className={`h-1.5 flex-1 rounded-full ${
            n <= step ? "bg-brand-600" : "bg-brand-100"
          }`}
        />
      ))}
    </div>
  );
}

function ChoiceCard({
  label,
  description,
  selected,
  onClick,
}: {
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${
        selected
          ? "border-brand-600 bg-brand-50 ring-1 ring-brand-600"
          : "border-sand-300 bg-white hover:border-brand-300"
      }`}
    >
      <span className="block font-semibold text-brand-950">{label}</span>
      {description ? (
        <span className="mt-0.5 block text-sm text-brand-700">{description}</span>
      ) : null}
    </button>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [track, setTrack] = useState<Track | null>(null);
  const [metier, setMetier] = useState<Metier | null>(null);
  const [niveau, setNiveau] = useState<NiveauDepart | null>(null);
  const [objectif, setObjectif] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const step1Valid = track === "particulier" || (track === "pro" && metier !== null);

  async function finish() {
    if (!track || !niveau || !objectif) return;
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Session expirée, reconnecte-toi.");
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({
        profil: track,
        metier: track === "pro" ? metier : null,
        niveau_depart: niveau,
        objectif_principal: objectif,
        onboarding_complete: true,
      })
      .eq("id", user.id);

    setLoading(false);

    if (updateError) {
      setError("Impossible d'enregistrer tes réponses, réessaie.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12">
      <StepDots step={step} />
      <Card>
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <h1 className="text-xl font-bold text-brand-950">Tu es plutôt...</h1>
            <div className="flex flex-col gap-3">
              <ChoiceCard
                label="Salarié·e / cadre"
                description="Je veux progresser dans mon métier au quotidien."
                selected={track === "pro"}
                onClick={() => setTrack("pro")}
              />
              <ChoiceCard
                label="Particulier"
                description="Je veux gagner du temps dans ma vie de tous les jours."
                selected={track === "particulier"}
                onClick={() => {
                  setTrack("particulier");
                  setMetier(null);
                }}
              />
            </div>
            {track === "pro" && (
              <div>
                <p className="mb-2 text-sm font-medium text-brand-900">Ton métier :</p>
                <div className="flex flex-wrap gap-2">
                  {METIERS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMetier(m)}
                      className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                        metier === m
                          ? "border-brand-600 bg-brand-600 text-white"
                          : "border-sand-300 bg-white text-brand-800 hover:border-brand-300"
                      }`}
                    >
                      {METIER_LABELS[m]}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <Button
              className="mt-2 w-full"
              disabled={!step1Valid}
              onClick={() => setStep(2)}
            >
              Continuer
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <h1 className="text-xl font-bold text-brand-950">
              Ton niveau avec l&apos;IA aujourd&apos;hui ?
            </h1>
            <div className="flex flex-col gap-3">
              {NIVEAUX.map((n) => (
                <ChoiceCard
                  key={n}
                  label={NIVEAU_LABELS[n]}
                  selected={niveau === n}
                  onClick={() => setNiveau(n)}
                />
              ))}
            </div>
            <div className="mt-2 flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>
                Retour
              </Button>
              <Button className="flex-1" disabled={!niveau} onClick={() => setStep(3)}>
                Continuer
              </Button>
            </div>
          </div>
        )}

        {step === 3 && track && (
          <div className="flex flex-col gap-4">
            <h1 className="text-xl font-bold text-brand-950">Ton objectif principal ?</h1>
            <div className="flex flex-col gap-3">
              {OBJECTIF_OPTIONS[track].map((o) => (
                <ChoiceCard
                  key={o}
                  label={o}
                  selected={objectif === o}
                  onClick={() => setObjectif(o)}
                />
              ))}
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <div className="mt-2 flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)}>
                Retour
              </Button>
              <Button
                className="flex-1"
                disabled={!objectif || loading}
                onClick={finish}
              >
                {loading ? "Un instant..." : "Découvrir ma leçon"}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </main>
  );
}
