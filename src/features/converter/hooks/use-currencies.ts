import { useQuery } from "@tanstack/react-query";
import { fetchCurrencies } from "../../../lib/frankfurter-api";
import { resolveFlag } from "../../../lib/constants";
import type { Currency } from "../../../types/currency";

const ONE_DAY = 24 * 60 * 60 * 1000;

export function useCurrencies() {
  return useQuery<Currency[]>({
    queryKey: ["currencies"],
    queryFn: async () => {
      const apiCurrencies = await fetchCurrencies();
      return apiCurrencies.map((currency) => ({
        code: currency.iso_code,
        name: currency.name,
        flag: resolveFlag(currency.iso_code),
      }));
    },
    staleTime: ONE_DAY,
    gcTime: ONE_DAY,
  });
}