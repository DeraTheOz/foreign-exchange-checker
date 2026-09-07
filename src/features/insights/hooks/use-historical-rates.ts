import { useQuery } from "@tanstack/react-query";
import { fetchHistoricalRates } from "../../../lib/frankfurter-api";

const FIVE_MINUTES = 5 * 60 * 1000;

export type HistoryRange = "1D" | "1W" | "1M" | "3M" | "1Y" | "5Y";

export const RANGE_OPTIONS: HistoryRange[] = ["1D", "1W", "1M", "3M", "1Y", "5Y"];

const RANGE_DAYS: Record<HistoryRange, number> = {
  "1D": 2,
  "1W": 7,
  "1M": 30,
  "3M": 90,
  "1Y": 365,
  "5Y": 1825,
};

function addDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

export function useHistoricalRates(base: string, quote: string, range: HistoryRange) {
  const from = addDays(RANGE_DAYS[range]);
  const to = new Date().toISOString().slice(0, 10);

  return useQuery({
    queryKey: ["historical-rates", base, quote, range, to],
    queryFn: () => fetchHistoricalRates(base, quote, from, to),
    staleTime: FIVE_MINUTES,
    gcTime: 30 * 60 * 1000,
    retry: 2,
    enabled: base !== quote,
  });
}