"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { METIER_LABELS, type Metier, type Track } from "@/lib/types";

const METIERS = Object.keys(METIER_LABELS) as Metier[];

export function AdminTrackSwitcher({
  currentProfil,
  currentMetier,
}: {
  currentProfil: Track | null;
  currentMetier: Metier | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [metierPickerOpen, setMetierPickerOpen] = useState(false);

  async function setTrack(profil: Track, metier: Metier | null) {
    setLoading(`${profil}-${metier ?? ""}`);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase
        .from("users")
        .update({ profil, metier, onboarding_complete: true })
        .eq("id", user.id);
    }

    setLoading(null);
    setMetierPickerOpen(false);
    router.refresh();
  }

  return (
    <div className="rounded-xl2 border border-amber-300 bg-amber-50 px-4 py-3 text-sm">
      <p className="mb-2 font-semibold text-amber-900">
        Mode admin — aperçu de l&apos;interface utilisateur normale
      </p>
      <p className="mb-3 text-amber-800">
        Tu vois actuellement le parcours{" "}
        <strong>
          {currentProfil === "pro"
            ? `Pro${currentMetier ? ` — ${METIER_LABELS[currentMetier]}` : ""}`
            : currentProfil === "particulier"
              ? "Particulier"
              : "aucun (choisis-en un ci-dessous)"}
        </strong>
        . Change à tout moment, ça se répercute directement dans la base.
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={loading !== null}
          onClick={() => setTrack("particulier", null)}
          className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 ${
            currentProfil === "particulier"
              ? "border-brand-600 bg-brand-600 text-white"
              : "border-amber-300 bg-white text-amber-900 hover:border-brand-300"
          }`}
        >
          {loading === "particulier-" ? "..." : "Voir en tant que Particulier"}
        </button>

        <div className="relative">
          <button
            type="button"
            disabled={loading !== null}
            onClick={() => setMetierPickerOpen((v) => !v)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 ${
              currentProfil === "pro"
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-amber-300 bg-white text-amber-900 hover:border-brand-300"
            }`}
          >
            Voir en tant que Pro ▾
          </button>
          {metierPickerOpen && (
            <div className="absolute left-0 top-full z-10 mt-1 flex flex-col gap-1 rounded-lg border border-sand-200 bg-white p-2 shadow-card">
              {METIERS.map((m) => (
                <button
                  key={m}
                  type="button"
                  disabled={loading !== null}
                  onClick={() => setTrack("pro", m)}
                  className="whitespace-nowrap rounded-md px-3 py-1.5 text-left text-sm text-brand-900 hover:bg-brand-50 disabled:opacity-50"
                >
                  {METIER_LABELS[m]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
