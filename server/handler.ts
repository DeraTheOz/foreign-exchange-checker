import type { IncomingMessage, ServerResponse } from "node:http";
import { AiAnalysisError, generateAnalysis } from "./ai.js";
import type { AiAnalysisRequest, AiEndpointOptions } from "./ai.js";

const MAX_BODY_BYTES = 256 * 1024;

const CURRENCY_CODE = /^[A-Z]{3}$/;

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.setEncoding("utf8");
    req.on("data", (chunk: string) => {
      body += chunk;
      if (body.length > MAX_BODY_BYTES) {
        const error = new AiAnalysisError("Request body too large.", 413);
        reject(error);
        req.destroy();
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function parseRequest(raw: string): AiAnalysisRequest {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new AiAnalysisError("Invalid JSON body.", 400);
  }

  if (!parsed || typeof parsed !== "object") {
    throw new AiAnalysisError("Invalid request body.", 400);
  }

  const record = parsed as Record<string, unknown>;
  const base = typeof record.base === "string" ? record.base : "";
  const quote = typeof record.quote === "string" ? record.quote : "";
  const rangeLabel = typeof record.rangeLabel === "string" ? record.rangeLabel : "";
  const currentRate = Number(record.currentRate);
  const openRate = Number(record.openRate);
  const changePct = Number(record.changePct);
  const rates = Array.isArray(record.rates) ? record.rates : [];

  if (!CURRENCY_CODE.test(base) || !CURRENCY_CODE.test(quote) || base === quote) {
    throw new AiAnalysisError("Invalid currency pair.", 400);
  }
  if (!rangeLabel) {
    throw new AiAnalysisError("Missing range label.", 400);
  }
  if (!Number.isFinite(currentRate) || !Number.isFinite(openRate) || !Number.isFinite(changePct)) {
    throw new AiAnalysisError("Invalid rate values.", 400);
  }
  if (rates.length === 0) {
    throw new AiAnalysisError("No historical data supplied.", 400);
  }
  if (rates.some((point) => !point || typeof point.date !== "string" || typeof point.rate !== "number")) {
    throw new AiAnalysisError("Invalid historical data points.", 400);
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

function sendJson(res: ServerResponse, status: number, payload: unknown): void {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

export async function handleAiRequest(
  req: IncomingMessage,
  res: ServerResponse,
  options: AiEndpointOptions,
): Promise<void> {
  if (req.method !== "POST") {
    sendJson(res, 405, { message: "Method not allowed." });
    return;
  }

  try {
    const raw = await readBody(req);
    const request = parseRequest(raw);
    const analysis = await generateAnalysis(request, options);
    sendJson(res, 200, analysis);
  } catch (error) {
    if (error instanceof AiAnalysisError) {
      sendJson(res, error.status, { message: error.message });
      return;
    }
    sendJson(res, 500, { message: "AI analysis failed." });
  }
}