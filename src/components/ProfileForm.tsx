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
  type UserProfile,
} from "@/lib/types";

const METIERS = Object.keys(METIER_LABELS) as Metier[];
const NIVEAUX = Object.keys(NIVEAU_LABELS) as NiveauDepart[];

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

export function ProfileForm({ profile }: { profile: UserProfile }) {
  const router = useRouter();
  const [track, setTrack] = useState<Track | null>(profile.profil);
  const [metier, setMetier] = useState<Metier | null>(profile.metier);
  const [niveau, setNiveau] = useState<NiveauDepart | null>(profile.niveau_depart);
  const [objectif, setObjectif] = useState<string | null>(profile.objectif_principal);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSave = track !== null && niveau !== null && objectif !== null && (track !== "pro" || metier !== null);

  async function handleSave() {
    if (!canSave || !track || !niveau || !objectif) return;
    setSaving(true);
    setSaved(false);
    setError(null);

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("users")
      .update({
        profil: track,
        metier: track === "pro" ? metier : null,
        niveau_depart: niveau,
        objectif_principal: objectif,
        onboarding_complete: true,
      })
      .eq("id", profile.id);

    setSaving(false);

    if (updateError) {
      setError("Impossible d'enregistrer, réessaie.");
      return;
    }

    setSaved(true);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-4">
        <div>
          <p className="mb-2 text-sm font-semibold text-brand-900">Tu es plutôt...</p>
          <div className="flex flex-col gap-2">
            <ChoiceCard
              label="Salarié·e / cadre"
              selected={track === "pro"}
              onClick={() => {
                setTrack("pro");
                setObjectif(null);
              }}
            />
            <ChoiceCard
              label="Particulier"
              selected={track === "particulier"}
              onClick={() => {
                setTrack("particulier");
                setMetier(null);
                setObjectif(null);
              }}
            />
          </div>
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
      </Card>

      <Card>
        <p className="mb-2 text-sm font-semibold text-brand-900">Ton niveau avec l&apos;IA</p>
        <div className="flex flex-col gap-2">
          {NIVEAUX.map((n) => (
            <ChoiceCard key={n} label={NIVEAU_LABELS[n]} selected={niveau === n} onClick={() => setNiveau(n)} />
          ))}
        </div>
      </Card>

      {track && (
        <Card>
          <p className="mb-2 text-sm font-semibold text-brand-900">Ton objectif principal</p>
          <div className="flex flex-col gap-2">
            {OBJECTIF_OPTIONS[track].map((o) => (
              <ChoiceCard key={o} label={o} selected={objectif === o} onClick={() => setObjectif(o)} />
            ))}
          </div>
        </Card>
      )}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {saved ? <p className="text-sm font-medium text-brand-700">✅ Enregistré</p> : null}

      <Button onClick={handleSave} disabled={!canSave || saving} className="self-start">
        {saving ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </div>
  );
}
