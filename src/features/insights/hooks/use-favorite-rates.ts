import { useQueries } from "@tanstack/react-query";
import { fetchLatestRate } from "../../../lib/frankfurter-api";
import { useFavoritesStore } from "../store/favorites-store";

const FIVE_MINUTES = 5 * 60 * 1000;

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export interface FavoriteRate {
  from: string;
  to: string;
  rate: number;
  change: string;
  direction: "up" | "down";
  isLoading: boolean;
}

export function useFavoriteRates(): FavoriteRate[] {
  const favorites = useFavoritesStore((s) => s.favorites);
  const y = yesterday();

  const results = useQueries({
    queries: favorites.flatMap((pair) => [
      {
        queryKey: ["exchange-rate", pair.from, pair.to],
        queryFn: () => fetchLatestRate(pair.from, pair.to),
        staleTime: FIVE_MINUTES,
        gcTime: 30 * 60 * 1000,
        retry: 2,
      },
      {
        queryKey: ["exchange-rate", pair.from, pair.to, y],
        queryFn: () => fetchLatestRate(pair.from, pair.to, y),
        staleTime: FIVE_MINUTES,
        gcTime: 30 * 60 * 1000,
        retry: 2,
        enabled: pair.from !== pair.to,
      },
    ]),
  });

  return favorites.map((pair, i) => {
    if (pair.from === pair.to) {
      const todayRate = results[i]?.data?.rate;
      return {
        from: pair.from,
        to: pair.to,
        rate: todayRate ?? 1,
        change: "0.00%",
        direction: "up" as const,
        isLoading: results[i]?.isLoading ?? true,
      };
    }

    const todayRate = results[i * 2]?.data?.rate;
    const yesterdayRate = results[i * 2 + 1]?.data?.rate;
    const isLoading = results[i * 2]?.isLoading || results[i * 2 + 1]?.isLoading;

    if (todayRate == null || yesterdayRate == null || yesterdayRate === 0) {
      return {
        from: pair.from,
        to: pair.to,
        rate: todayRate ?? 0,
        change: "0.00%",
        direction: "up" as const,
        isLoading,
      };
    }

    const pct = ((todayRate - yesterdayRate) / yesterdayRate) * 100;
    const direction: "up" | "down" = pct >= 0 ? "up" : "down";
    const sign = pct >= 0 ? "+" : "";

    return {
      from: pair.from,
      to: pair.to,
      rate: todayRate,
      change: `${sign}${pct.toFixed(2)}%`,
      direction,
      isLoading,
    };
  });
}
