import type { Currency } from "../../../types/currency";
import { CurrencyPickerItem } from "./currency-picker-item";

interface CurrencySectionProps {
  title: string;
  currencies: Currency[];
  selectedCode: string;
  onSelect: (code: string) => void;
}

export function CurrencySection({
  title,
  currencies,
  selectedCode,
  onSelect,
}: CurrencySectionProps) {
  if (currencies.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2.5 border-b border-neutral-500 p-2 text-xs leading-tight tracking-[0.5px] text-neutral-200">
        <p className="min-w-0 flex-1">{title}</p>
        <p className="shrink-0 text-right">{currencies.length}</p>
      </div>
      <div className="flex flex-col">
        {currencies.map((currency) => (
          <CurrencyPickerItem
            key={currency.code}
            currency={currency}
            selected={selectedCode === currency.code}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
