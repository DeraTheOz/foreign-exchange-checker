export interface AiAnalysisRequest {
  base: string;
  quote: string;
  currentRate: number;
  openRate: number;
  changePct: number;
  rangeLabel: string;
  rates: Array<{ date: string; rate: number }>;
}

export interface AiAnalysisResult {
  trendSummary: string;
  keyInsight: string;
}