import { GoogleGenAI } from "@google/genai";

export interface AiAnalysisRequest {
  base: string;
  quote: string;
  currentRate: number;
  openRate: number;
  changePct: number;
  rangeLabel: string;
  rates: Array<{ date: string; rate: number }>;
}

export interface AiAnalysis {
  trendSummary: string;
  keyInsight: string;
}

export interface AiEndpointOptions {
  apiKey: string;
  model: string;
}

export class AiAnalysisError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "AiAnalysisError";
    this.status = status;
  }
}

const SYSTEM_INSTRUCTION = [
  "You are a currency market analyst.",
  "Explain historical exchange-rate trends only.",
  "Base every statement strictly on the supplied data.",
  "Do not give investment recommendations.",
  "Do not forecast future rates.",
  "Do not claim certainty.",
  "Remain concise and easy to understand.",
  "Use at most 200 words in total.",
].join(" ");

export function buildPrompt(request: AiAnalysisRequest): string {
  const points = request.rates
    .map((point) => `${point.date},${point.rate}`)
    .join("\n");
  const direction = request.changePct >= 0 ? "appreciation" : "depreciation";

  return [
    `Analyze the ${request.base}/${request.quote} exchange rate over the last ${request.rangeLabel}.`,
    "",
    `Opening rate: ${request.openRate}`,
    `Current rate: ${request.currentRate}`,
    `Change over the period: ${request.changePct >= 0 ? "+" : ""}${request.changePct.toFixed(2)}% (${direction} of ${request.base} relative to ${request.quote}).`,
    "",
    "Selected daily observations (date, rate):",
    points,
    "",
    "Return a JSON object with exactly two fields:",
    "- trendSummary: a short summary of how the rate moved during the period.",
    "- keyInsight: one meaningful implication of this move, based only on historical context.",
  ].join("\n");
}

function parseResponse(text: string): AiAnalysis {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new AiAnalysisError("The AI returned unparseable output.", 502);
  }

  if (!parsed || typeof parsed !== "object") {
    throw new AiAnalysisError("The AI returned an unexpected response.", 502);
  }

  const record = parsed as Record<string, unknown>;
  const trendSummary = typeof record.trendSummary === "string" ? record.trendSummary.trim() : "";
  const keyInsight = typeof record.keyInsight === "string" ? record.keyInsight.trim() : "";

  if (!trendSummary || !keyInsight) {
    throw new AiAnalysisError("The AI response is missing required fields.", 502);
  }

  return { trendSummary, keyInsight };
}

function isRateLimitError(error: unknown): boolean {
  const err = error as { status?: number; message?: string };
  if (err.status === 429) return true;
  return /RESOURCE_EXHAUSTED/i.test(err.message ?? "");
}

export async function generateAnalysis(
  request: AiAnalysisRequest,
  options: AiEndpointOptions,
): Promise<AiAnalysis> {
  if (!options.apiKey) {
    throw new AiAnalysisError("The AI analyst is not configured.", 500);
  }

  const ai = new GoogleGenAI({ apiKey: options.apiKey });

  try {
    const response = await ai.models.generateContent({
      model: options.model,
      contents: buildPrompt(request),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            trendSummary: {
              type: "STRING",
              description: "Short summary of how the rate moved during the period.",
            },
            keyInsight: {
              type: "STRING",
              description: "One meaningful implication of the move.",
            },
          },
          required: ["trendSummary", "keyInsight"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new AiAnalysisError("The AI returned an empty response.", 502);
    }

    return parseResponse(text);
  } catch (error) {
    if (error instanceof AiAnalysisError) {
      throw error;
    }
    console.error("[ai-analyst]", error instanceof Error ? error.message : error);
    if (isRateLimitError(error)) {
      throw new AiAnalysisError(
        "The AI service hit its rate limit. Please wait a few minutes and try again.",
        429,
      );
    }
    throw new AiAnalysisError("The AI service could not complete the analysis.", 502);
  }
}