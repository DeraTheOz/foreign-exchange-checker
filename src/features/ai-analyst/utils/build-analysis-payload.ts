import type { FrankfurterRate } from "../../../types/frankfurter";
import type { AiAnalysisRequest } from "../types";

const MAX_POINTS = 40;

export function buildAnalysisPayload(
  base: string,
  quote: string,
  rangeLabel: string,
  rates: FrankfurterRate[],
  open: number,
  last: number,
  pct: number,
): AiAnalysisRequest {
  const step = Math.max(1, Math.ceil(rates.length / MAX_POINTS));
  const sampled = rates.filter((_, index) => index % step === 0);

  return {
    base,
    quote,
    currentRate: last,
    openRate: open,
    changePct: pct,
    rangeLabel,
    rates: sampled.slice(-MAX_POINTS).map((rate) => ({
      date: rate.date,
      rate: rate.rate,
    })),
  };
}