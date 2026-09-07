import { useQueries } from "@tanstack/react-query";
import { fetchRates } from "../../../lib/frankfurter-api";
import { MAX_DECIMALS } from "../../converter/utils/amount";

const FIVE_MINUTES = 5 * 60 * 1000;
const ROUND_FACTOR = 10 ** MAX_DECIMALS;

function roundAmount(value: number): number {
  return Math.round(value * ROUND_FACTOR) / ROUND_FACTOR;
}

export interface CompareRow {
  quote: string;
  rate: number;
  converted: number;
}

export function useCompareRates(
  base: string,
  quotes: string[],
  amount: string,
): { rows: CompareRow[]; isLoading: boolean } {
  const numericAmount = Number(amount);
  const validAmount = !Number.isNaN(numericAmount) && amount !== "" && numericAmount > 0;

  const results = useQueries({
    queries: quotes.map((quote) => ({
      queryKey: ["compare-rate", base, quote],
      queryFn: () => fetchRates(base, [quote]),
      staleTime: FIVE_MINUTES,
      gcTime: 30 * 60 * 1000,
      retry: 2,
      enabled: base !== quote && validAmount,
    })),
  });

  const isLoading = validAmount && results.some((r) => r.isLoading);

  const rows: CompareRow[] = quotes.map((quote, i) => {
    if (base === quote) {
      return {
        quote,
        rate: 1,
        converted: validAmount ? roundAmount(numericAmount) : 0,
      };
    }

    const rateEntry = results[i]?.data?.[0]?.rate;

    if (rateEntry == null || !validAmount) {
      return { quote, rate: 0, converted: 0 };
    }

    return {
      quote,
      rate: rateEntry,
      converted: roundAmount(numericAmount * rateEntry),
    };
  });

  return { rows, isLoading };
}
