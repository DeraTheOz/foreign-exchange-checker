import { useEffect } from "react";
import { useQueries } from "@tanstack/react-query";
import { fetchLatestRate } from "../../../lib/frankfurter-api";
import { readCachedRate, writeCachedRate } from "../../../lib/rate-cache";

const FIVE_MINUTES = 5 * 60 * 1000;

interface MarketPair {
  base: string;
  quote: string;
  label: string;
}

const MARKET_PAIRS: MarketPair[] = [
  { base: "EUR", quote: "USD", label: "EUR/USD" },
  { base: "USD", quote: "JPY", label: "USD/JPY" },
  { base: "GBP", quote: "USD", label: "GBP/USD" },
  { base: "USD", quote: "CHF", label: "USD/CHF" },
  { base: "EUR", quote: "GBP", label: "EUR/GBP" },
  { base: "AUD", quote: "USD", label: "AUD/USD" },
  { base: "USD", quote: "CAD", label: "USD/CAD" },
];

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export interface LiveMarketRate {
  pair: string;
  value: string;
  change: string;
  direction: "up" | "down";
}

export function useMarketRates() {
  const y = yesterday();

  const results = useQueries({
    queries: MARKET_PAIRS.flatMap((pair) => [
      {
        queryKey: ["exchange-rate", pair.base, pair.quote],
        queryFn: () => fetchLatestRate(pair.base, pair.quote),
        staleTime: FIVE_MINUTES,
        gcTime: 30 * 60 * 1000,
        retry: 2,
      },
      {
        queryKey: ["exchange-rate", pair.base, pair.quote, y],
        queryFn: () => fetchLatestRate(pair.base, pair.quote, y),
        staleTime: FIVE_MINUTES,
        gcTime: 30 * 60 * 1000,
        retry: 2,
      },
    ]),
  });

  useEffect(() => {
    results.forEach((result, i) => {
      const rate = result.data?.rate;
      if (rate == null || i % 2 !== 0) return;
      const pair = MARKET_PAIRS[Math.floor(i / 2)];
      if (pair) writeCachedRate(pair.base, pair.quote, rate);
    });
  }, [results]);

  const isLoading = results.some((r) => r.isLoading);

  const rates: LiveMarketRate[] = MARKET_PAIRS.map((pair, i) => {
    const todayResult = results[i * 2];
    const todayRate =
      todayResult?.data?.rate ??
      (todayResult?.isError
        ? readCachedRate(pair.base, pair.quote)?.rate
        : undefined);
    const yesterdayRate = results[i * 2 + 1]?.data?.rate;

    if (todayRate == null || yesterdayRate == null || yesterdayRate === 0) {
      return { pair: pair.label, value: todayRate != null ? String(todayRate) : "—", change: "0.00%", direction: "up" };
    }

    const pct = ((todayRate - yesterdayRate) / yesterdayRate) * 100;
    const direction: "up" | "down" = pct >= 0 ? "up" : "down";
    const sign = pct >= 0 ? "+" : "";

    return {
      pair: pair.label,
      value: String(todayRate),
      change: `${sign}${pct.toFixed(2)}%`,
      direction,
    };
  });

  return { rates, isLoading };
}
