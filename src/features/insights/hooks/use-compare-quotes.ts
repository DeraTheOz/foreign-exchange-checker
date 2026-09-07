import { useMemo } from "react";
import { useConverterStore } from "../../converter/store/converter-store";
import { useConversionHistory } from "../store/conversion-history-store";
import { useFavoritesStore } from "../store/favorites-store";

const POPULAR_COMPARE_CODES = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "NGN",
  "CAD",
  "AUD",
  "CHF",
];

const MAX_COMPARE_ROWS = 8;

export function useCompareQuotes(): string[] {
  const from = useConverterStore((s) => s.from);
  const favorites = useFavoritesStore((s) => s.favorites);
  const entries = useConversionHistory((s) => s.entries);

  return useMemo(() => {
    const selected = new Set<string>();
    const quotes: string[] = [];

    const push = (code: string) => {
      if (code === from || selected.has(code)) return;
      if (quotes.length >= MAX_COMPARE_ROWS) return;
      selected.add(code);
      quotes.push(code);
    };

    for (const favorite of favorites) push(favorite.to);
    for (const entry of entries) push(entry.to);
    for (const code of POPULAR_COMPARE_CODES) push(code);

    return quotes;
  }, [from, favorites, entries]);
}