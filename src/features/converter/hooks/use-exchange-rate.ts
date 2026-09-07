import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchLatestRate } from "../../../lib/frankfurter-api";
import { readCachedRate, writeCachedRate } from "../../../lib/rate-cache";

const FIVE_MINUTES = 5 * 60 * 1000;

export function useExchangeRate(base: string, quote: string) {
  const query = useQuery({
    queryKey: ["exchange-rate", base, quote],
    queryFn: () => fetchLatestRate(base, quote),
    staleTime: FIVE_MINUTES,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 2,
    enabled: base === quote ? false : undefined,
  });

  const rate = query.data?.rate;

  useEffect(() => {
    if (rate != null && base !== quote) {
      writeCachedRate(base, quote, rate);
    }
  }, [base, quote, rate]);

  const staleRate = query.isError && base !== quote
    ? readCachedRate(base, quote)
    : null;

  return { ...query, staleRate };
}