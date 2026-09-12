import { PILIER_LABELS, type CompetencesUtilisateur, type Pilier } from "@/lib/types";

const PILIER_ORDER: Pilier[] = ["delegation", "description", "discernement", "diligence"];

const COLUMN_BY_PILIER: Record<Pilier, keyof CompetencesUtilisateur> = {
  delegation: "delegation_count",
  description: "description_count",
  discernement: "discernement_count",
  diligence: "diligence_count",
};

export function CompetenceGauge({ competences }: { competences: CompetencesUtilisateur }) {
  const counts = PILIER_ORDER.map((p) => competences[COLUMN_BY_PILIER[p]] as number);
  const max = Math.max(1, ...counts);
  const total = counts.reduce((a, b) => a + b, 0);

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <p className="text-sm font-semibold text-brand-900">Tes 4 compétences IA</p>
        <p className="text-xs text-brand-500">{total} leçon{total > 1 ? "s" : ""} comptée{total > 1 ? "s" : ""}</p>
      </div>
      <div className="flex flex-col gap-3">
        {PILIER_ORDER.map((pilier) => {
          const count = competences[COLUMN_BY_PILIER[pilier]] as number;
          const pct = Math.round((count / max) * 100);
          return (
            <div key={pilier}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-brand-800">{PILIER_LABELS[pilier]}</span>
                <span className="text-brand-600">{count}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-sand-100">
                <div
                  className="h-full rounded-full bg-brand-500 transition-all duration-500"
                  style={{ width: `${count > 0 ? Math.max(pct, 6) : 0}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      {total === 0 ? (
        <p className="mt-3 text-xs text-brand-500">
          Termine des leçons pour voir cette jauge se remplir.
        </p>
      ) : null}
    </div>
  );
}
