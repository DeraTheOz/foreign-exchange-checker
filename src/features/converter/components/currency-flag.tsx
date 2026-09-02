import type { Currency } from "../../../types/currency";

export function CurrencyFlag({ currency }: { currency: Currency }) {
  return (
    <img
      src={currency.flag}
      alt=""
      className="h-5 w-5 shrink-0 overflow-hidden rounded-full object-cover"
    />
  );
}
