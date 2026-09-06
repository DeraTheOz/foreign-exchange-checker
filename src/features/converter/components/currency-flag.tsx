import type { Currency } from "../../../types/currency";

export function CurrencyFlag({ currency }: { currency: Currency }) {
  if (!currency.flag) {
    return (
      <span
        aria-hidden
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-500 text-[10px] leading-none font-bold text-neutral-200">
        {currency.code.slice(0, 2)}
      </span>
    );
  }

  return (
    <img
      src={currency.flag}
      alt=""
      className="h-5 w-5 shrink-0 overflow-hidden rounded-full object-cover"
    />
  );
}