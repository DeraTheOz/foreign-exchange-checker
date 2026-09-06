import { useQuery } from "@tanstack/react-query";
import { fetchLatestRate } from "../../../lib/frankfurter-api";

const FIVE_MINUTES = 5 * 60 * 1000;

export function useExchangeRate(base: string, quote: string) {
  return useQuery({
    queryKey: ["exchange-rate", base, quote],
    queryFn: () => fetchLatestRate(base, quote),
    staleTime: FIVE_MINUTES,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 2,
    enabled: base === quote ? false : undefined,
  });
}
