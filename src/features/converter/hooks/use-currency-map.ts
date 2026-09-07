import { useMemo } from "react";
import { useCurrencies } from "./use-currencies";
import type { Currency } from "../../../types/currency";

export function useCurrencyMap() {
  const { data: currencies } = useCurrencies();

  const map = useMemo(() => {
    const map = new Map<string, Currency>();
    for (const currency of currencies ?? []) {
      map.set(currency.code, currency);
    }
    return map;
  }, [currencies]);

  return {
    name: (code: string) => map.get(code)?.name ?? code,
    get: (code: string) => map.get(code),
  };
}