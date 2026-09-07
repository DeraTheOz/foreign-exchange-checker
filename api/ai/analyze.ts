import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

const CURRENCY_CODE = /^[A-Z]{3}$/;

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

interface AiAnalysisRequest {
  base: string;
  quote: string;
  currentRate: number;
  openRate: number;
  changePct: number;
  rangeLabel: string;
  rates: Array<{ date: string; rate: number }>;
}

interface AiAnalysis {
  trendSummary: string;
  keyInsight: string;
}

function sendJson(res: VercelResponse, status: number, payload: unknown): void {
  res.status(status).json(payload);
}

function parseRequest(body: unknown): AiAnalysisRequest {
  if (!body || typeof body !== "object") {
    throw { status: 400, message: "Invalid request body." };
  }

  const record = body as Record<string, unknown>;
  const base = typeof record.base === "string" ? record.base : "";
  const quote = typeof record.quote === "string" ? record.quote : "";
  const rangeLabel = typeof record.rangeLabel === "string" ? record.rangeLabel : "";
  const currentRate = Number(record.currentRate);
  const openRate = Number(record.openRate);
  const changePct = Number(record.changePct);
  const rates = Array.isArray(record.rates) ? record.rates : [];

  if (!CURRENCY_CODE.test(base) || !CURRENCY_CODE.test(quote) || base === quote) {
    throw { status: 400, message: "Invalid currency pair." };
  }
  if (!rangeLabel) {
    throw { status: 400, message: "Missing range label." };
  }
  if (!Number.isFinite(currentRate) || !Number.isFinite(openRate) || !Number.isFinite(changePct)) {
    throw { status: 400, message: "Invalid rate values." };
  }
  if (rates.length === 0) {
    throw { status: 400, message: "No historical data supplied." };
  }
  if (rates.some((point: unknown) => !point || typeof point !== "object" || !("date" in point) || !("rate" in point))) {
    throw { status: 400, message: "Invalid historical data points." };
  }

  return {
    base,
    quote,
    currentRate,
    openRate,
    changePct,
    rangeLabel,
    rates: rates as Array<{ date: string; rate: number }>,
  };
}

function buildPrompt(request: AiAnalysisRequest): string {
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
    throw { status: 502, message: "The AI returned unparseable output." };
  }

  if (!parsed || typeof parsed !== "object") {
    throw { status: 502, message: "The AI returned an unexpected response." };
  }

  const record = parsed as Record<string, unknown>;
  const trendSummary = typeof record.trendSummary === "string" ? record.trendSummary.trim() : "";
  const keyInsight = typeof record.keyInsight === "string" ? record.keyInsight.trim() : "";

  if (!trendSummary || !keyInsight) {
    throw { status: 502, message: "The AI response is missing required fields." };
  }

  return { trendSummary, keyInsight };
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  if (req.method !== "POST") {
    sendJson(res, 405, { message: "Method not allowed." });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-3.6-flash";

  if (!apiKey) {
    sendJson(res, 500, { message: "The AI analyst is not configured." });
    return;
  }

  try {
    const request = parseRequest(req.body);

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model,
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
      sendJson(res, 502, { message: "The AI returned an empty response." });
      return;
    }

    const analysis = parseResponse(text);
    sendJson(res, 200, analysis);
  } catch (error) {
    const err = error as { status?: number; message?: string };
    const status = err.status ?? 500;
    const message = err.message ?? "AI analysis failed.";
    sendJson(res, status, { message });
  }
}
