import { useMutation } from "@tanstack/react-query";
import { aiAnalysisSchema } from "../schemas/ai-schema";
import type { AiAnalysisRequest, AiAnalysisResult } from "../types";

async function requestAnalysis(payload: AiAnalysisRequest): Promise<AiAnalysisResult> {
  const response = await fetch("/api/ai/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    const message = body?.message?.trim();
    const safeMessage =
      message && message.length <= 200 && !/^\{.*\}$/s.test(message)
        ? message
        : "The AI analyst could not complete the analysis.";
    throw new Error(safeMessage);
  }

  const parsed = aiAnalysisSchema.safeParse(await response.json());
  if (!parsed.success) {
    throw new Error("The AI analyst returned an unexpected response.");
  }

  return parsed.data;
}

export function useAiAnalysis() {
  return useMutation({
    mutationFn: requestAnalysis,
  });
}