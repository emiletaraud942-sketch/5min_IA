import Anthropic from "@anthropic-ai/sdk";
import type { Lesson } from "@/lib/types";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";

let client: Anthropic | null = null;

function getClient() {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY manquante côté serveur.");
    }
    client = new Anthropic({ apiKey });
  }
  return client;
}

export interface EvaluationResult {
  score: number;
  feedback: string;
  points_forts: string[];
  points_a_ameliorer: string[];
}

const EVALUATION_TOOL: Anthropic.Tool = {
  name: "soumettre_evaluation",
  description:
    "Enregistre l'évaluation pédagogique du prompt écrit par l'apprenant.",
  input_schema: {
    type: "object",
    properties: {
      score: {
        type: "integer",
        minimum: 1,
        maximum: 5,
        description: "Note globale sur 5, en fonction des critères d'évaluation de la leçon.",
      },
      feedback: {
        type: "string",
        description:
          "2 à 4 phrases de retour direct, chaleureux et concret, tutoyant l'apprenant, sans jargon technique.",
      },
      points_forts: {
        type: "array",
        items: { type: "string" },
        description: "1 à 3 points forts courts et concrets du prompt soumis.",
      },
      points_a_ameliorer: {
        type: "array",
        items: { type: "string" },
        description:
          "0 à 3 pistes d'amélioration courtes et concrètes (vide si le prompt est déjà excellent).",
      },
    },
    required: ["score", "feedback", "points_forts", "points_a_ameliorer"],
  },
};

const SYSTEM_PROMPT = `Tu es le coach pédagogique d'une application qui apprend à des gens non-experts (salariés, particuliers) à écrire de meilleurs prompts pour des IA comme Claude ou ChatGPT.

Ton public n'est PAS technique et n'a pas de temps à perdre : reste toujours rassurant, concret, jamais condescendant, jamais "geek". Tutoie l'apprenant.

Pour chaque exercice, tu reçois : la mise en situation, la consigne, les critères d'évaluation propres à la leçon, et le prompt que l'apprenant a réellement écrit.

Ta tâche : évaluer UNIQUEMENT le prompt de l'apprenant au regard des critères fournis, puis appeler l'outil "soumettre_evaluation" avec une note sur 5 et un feedback constructif. Valorise les progrès et la précision plutôt que la longueur. Si le prompt est faible, reste encourageant et donne des pistes très concrètes et actionnables plutôt que des critiques vagues.`;

export async function evaluatePrompt(params: {
  lesson: Pick<Lesson, "mise_en_situation" | "consigne" | "criteres_evaluation">;
  promptSoumis: string;
}): Promise<EvaluationResult> {
  const { lesson, promptSoumis } = params;

  const userMessage = `Mise en situation de la leçon :
${lesson.mise_en_situation}

Consigne donnée à l'apprenant :
${lesson.consigne}

Critères d'évaluation de cette leçon (guide interne, ne pas les recopier tels quels dans le feedback) :
${lesson.criteres_evaluation}

Prompt écrit par l'apprenant :
"""
${promptSoumis}
"""

Évalue ce prompt et appelle l'outil "soumettre_evaluation".`;

  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    tools: [EVALUATION_TOOL],
    tool_choice: { type: "tool", name: "soumettre_evaluation" },
    messages: [{ role: "user", content: userMessage }],
  });

  const toolUse = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use",
  );

  if (!toolUse) {
    throw new Error("Claude n'a pas renvoyé d'évaluation exploitable.");
  }

  const input = toolUse.input as Partial<EvaluationResult>;

  const score = Math.min(5, Math.max(1, Math.round(Number(input.score) || 3)));

  return {
    score,
    feedback: typeof input.feedback === "string" ? input.feedback : "",
    points_forts: Array.isArray(input.points_forts) ? input.points_forts.map(String) : [],
    points_a_ameliorer: Array.isArray(input.points_a_ameliorer)
      ? input.points_a_ameliorer.map(String)
      : [],
  };
}
