import { useMemo } from "react";
import { useExchangeRate } from "./use-exchange-rate";
import { formatNumber } from "../../../lib/format-number";
import { MAX_DECIMALS, roundConverted } from "../utils/amount";

export function useConversion(from: string, to: string, amount: string) {
  const { data: rateData, isLoading, error } = useExchangeRate(from, to);

  const rate = rateData?.rate ?? 1;

  const convertedAmount = useMemo(() => {
    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount) || amount === "") return "";
    return roundConverted(numericAmount * rate, MAX_DECIMALS);
  }, [amount, rate]);

  const rateString = useMemo(() => {
    if (from === to) return `1 ${from} = 1 ${to}`;
    return `1 ${from} = ${formatNumber(rate)} ${to}`;
  }, [from, to, rate]);

  return { rate, convertedAmount, rateString, isLoading, error };
}