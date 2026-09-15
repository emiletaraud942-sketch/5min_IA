import type {
  ContenuChoisisLaFiable,
  ContenuDevineLaDifference,
  ContenuQuAuraisTuFait,
  ContenuQuestionGuidee,
  ContenuRelanceEnDeuxTemps,
  ContenuTrouveErreur,
} from "@/lib/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * `lessons.contenu` is untyped jsonb — these guards make sure it actually
 * has the shape a given lesson type's component expects before we render
 * it, so a malformed row (typo in a migration, hand-edited row in the
 * Supabase dashboard...) shows a clean fallback instead of crashing the
 * page.
 */

export function isContenuQuAuraisTuFait(v: unknown): v is ContenuQuAuraisTuFait {
  return (
    isRecord(v) &&
    isNonEmptyString(v.situation) &&
    Array.isArray(v.choix) &&
    v.choix.length > 0 &&
    v.choix.every(
      (c) =>
        isRecord(c) &&
        isNonEmptyString(c.id) &&
        isNonEmptyString(c.label) &&
        typeof c.bonne === "boolean" &&
        isNonEmptyString(c.explication),
    )
  );
}

export function isContenuDevineLaDifference(v: unknown): v is ContenuDevineLaDifference {
  return (
    isRecord(v) &&
    isNonEmptyString(v.situation) &&
    isNonEmptyString(v.prompt_faible) &&
    isNonEmptyString(v.reponse_faible) &&
    isNonEmptyString(v.prompt_fort) &&
    isNonEmptyString(v.reponse_fort) &&
    isNonEmptyString(v.explication)
  );
}

export function isContenuChoisisLaFiable(v: unknown): v is ContenuChoisisLaFiable {
  return (
    isRecord(v) &&
    isNonEmptyString(v.question) &&
    Array.isArray(v.reponses) &&
    v.reponses.length > 0 &&
    v.reponses.every(
      (r) =>
        isRecord(r) &&
        isNonEmptyString(r.id) &&
        isNonEmptyString(r.label) &&
        isNonEmptyString(r.texte) &&
        typeof r.fiable === "boolean",
    ) &&
    isNonEmptyString(v.explication)
  );
}

export function isContenuTrouveErreur(v: unknown): v is ContenuTrouveErreur {
  return (
    isRecord(v) &&
    isNonEmptyString(v.reponse_texte) &&
    isNonEmptyString(v.consigne_choix) &&
    Array.isArray(v.passages) &&
    v.passages.length > 0 &&
    v.passages.every(
      (p) => isRecord(p) && isNonEmptyString(p.id) && isNonEmptyString(p.texte) && typeof p.correct === "boolean",
    ) &&
    isNonEmptyString(v.explication)
  );
}

export function isContenuRelanceEnDeuxTemps(v: unknown): v is ContenuRelanceEnDeuxTemps {
  return isRecord(v) && isNonEmptyString(v.situation) && isNonEmptyString(v.premiere_reponse);
}

export function isContenuQuestionGuidee(v: unknown): v is ContenuQuestionGuidee {
  return isRecord(v) && isNonEmptyString(v.question_reflexive);
}
