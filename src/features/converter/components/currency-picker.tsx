import { Search } from "lucide-react";
import { useCurrencyPicker } from "../hooks/use-currency-picker";
import { CurrencySection } from "./currency-section";

interface CurrencyPickerProps {
  selectedCode: string;
  onSelect: (code: string) => void;
  listId?: string;
}

export function CurrencyPicker({
  selectedCode,
  onSelect,
  listId,
}: CurrencyPickerProps) {
  const {
    search,
    setSearch,
    isLoading,
    filteredCurrencies,
    popularCurrencies,
    otherCurrencies,
  } = useCurrencyPicker();

  return (
    <div className="w-[clamp(14rem,70vw,19.4375rem)] overflow-hidden rounded-lg border border-neutral-400 bg-neutral-600 p-2 normal-case shadow-[0_20px_60px_rgb(10_10_10/0.5)]">
      <label className="flex h-11.75 items-center gap-2.5 rounded-md border border-neutral-200 px-3.25 text-neutral-200">
        <Search className="h-5 w-3.5 shrink-0 text-neutral-50" aria-hidden />
        <span className="sr-only">Search currencies</span>
        <input
          type="search"
          autoFocus
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search currencies..."
          className="min-w-0 flex-1 bg-transparent text-xs leading-tight tracking-[0.5px] text-neutral-50 placeholder:text-neutral-200 focus:outline-none!"
        />
      </label>

      <div
        id={listId}
        role="listbox"
        aria-label="Currencies"
        className="mt-2 flex max-h-98.5 flex-col gap-1 overflow-y-auto overflow-x-hidden no-scrollbar">
        {isLoading ? (
          <p className="px-2 py-5 text-center text-xs leading-tight tracking-[0.5px] text-neutral-200">
            Loading currencies…
          </p>
        ) : (
          <>
            <CurrencySection
              title="POPULAR"
              currencies={popularCurrencies}
              selectedCode={selectedCode}
              onSelect={onSelect}
            />
            <CurrencySection
              title="OTHER CURRENCIES"
              currencies={otherCurrencies}
              selectedCode={selectedCode}
              onSelect={onSelect}
            />
            {filteredCurrencies.length === 0 ? (
              <p className="px-2 py-5 text-center text-xs leading-tight tracking-[0.5px] text-neutral-200">
                No currencies found
              </p>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}