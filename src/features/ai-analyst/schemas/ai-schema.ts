import { z } from "zod";

export const aiAnalysisSchema = z.object({
  trendSummary: z.string().min(1),
  keyInsight: z.string().min(1),
});

export type AiAnalysisResponse = z.infer<typeof aiAnalysisSchema>;