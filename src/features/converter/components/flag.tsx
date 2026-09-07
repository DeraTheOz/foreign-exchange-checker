import { useCurrencyMap } from "../hooks/use-currency-map";
import { CurrencyFlag } from "./currency-flag";

export function Flag({ code }: { code: string }) {
  const { get } = useCurrencyMap();
  const currency = get(code);
  if (!currency) return null;
  return <CurrencyFlag currency={currency} />;
}
