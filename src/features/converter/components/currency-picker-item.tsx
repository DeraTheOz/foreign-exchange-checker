import { Check } from "lucide-react";
import type { Currency } from "../../../types/currency";
import { CurrencyFlag } from "./currency-flag";

interface CurrencyPickerItemProps {
  currency: Currency;
  selected: boolean;
  onSelect: (code: string) => void;
}

export function CurrencyPickerItem({
  currency,
  selected,
  onSelect,
}: CurrencyPickerItemProps) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={() => onSelect(currency.code)}
      className="flex min-h-11.75 w-full items-center gap-3 rounded border border-neutral-600 bg-neutral-600 px-2.25 py-3.25 text-left hover:border-neutral-500 hover:bg-neutral-500 focus-visible:relative">
      <CurrencyFlag currency={currency} />
      <span className="shrink-0 text-sm leading-tight tracking-[1px] text-neutral-50">
        {currency.code}
      </span>
      <span className="min-w-0 flex-1 truncate pt-0.5 text-xs leading-tight tracking-[0.5px] text-neutral-200">
        {currency.name}
      </span>
      {selected ? (
        <Check className="h-3 w-3 shrink-0 text-neutral-50" aria-hidden />
      ) : null}
    </button>
  );
}
