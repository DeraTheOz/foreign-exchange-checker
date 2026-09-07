import { Star } from "lucide-react";
import { CurrencyFlag } from "../../converter/components/currency-flag";
import { useConverterStore } from "../../converter/store/converter-store";
import { useCompareRates } from "../hooks/use-compare-rates";
import { useCompareQuotes } from "../hooks/use-compare-quotes";
import { useComparePinned } from "../hooks/use-compare-pinned";
import { useCurrencyMap } from "../../converter/hooks/use-currency-map";
import { isPositiveAmount } from "../utils/is-positive-amount";
import { formatNumber } from "../../../lib/format-number";
import { EmptyState } from "../../../components/common/empty-state";

export function ComparePanel() {
  const from = useConverterStore((s) => s.from);
  const amount = useConverterStore((s) => s.amount);
  const quotes = useCompareQuotes();
  const { isPinned, toggle } = useComparePinned(from);
  const { name: currencyName, get: getCurrency } = useCurrencyMap();

  const { rows, isLoading } = useCompareRates(from, quotes, amount);

  const hasAmount = isPositiveAmount(amount);

  if (!hasAmount) {
    return (
      <EmptyState
        title="No comparison available"
        description="Enter an amount in SEND above to see what your money is worth in other currencies."
      />
    );
  }

  return (
    <section
      className="mt-5 rounded-2xl bg-neutral-700 p-4 min-[720px]:p-5"
      aria-labelledby="compare-title">
      <header className="mb-4 flex items-center justify-between gap-4">
        <h2
          id="compare-title"
          className="m-0 text-xs font-normal leading-tight tracking-widest text-neutral-200">
          Multi-currency{" "}
          <span className="text-neutral-50">
            {hasAmount
              ? `${formatNumber(amount)} from ${from}`
              : `from ${from}`}
          </span>
        </h2>
        <p className="m-0 shrink-0 text-xs leading-tight tracking-widest text-neutral-200">
          {quotes.length} pairs
        </p>
      </header>

      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {rows.map((row) => {
          const pinned = isPinned(row.quote);
          const flag = getCurrency(row.quote);
          return (
            <li
              key={row.quote}
              className="rounded-[10px] border border-neutral-500 bg-neutral-600">
              <div className="flex min-h-15.25 items-center gap-3 px-4 py-3 min-[640px]:gap-5">
                {flag ? <CurrencyFlag currency={flag} /> : null}

                <div className="min-w-0 flex-1">
                  <p className="m-0 truncate text-sm leading-tight tracking-widest text-neutral-50">
                    {row.quote}
                  </p>
                  <p className="mt-1.5 mb-0 truncate text-xs leading-tight tracking-wider text-neutral-200">
                    {currencyName(row.quote)}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="m-0 text-base leading-tight tracking-widest text-neutral-50">
                    {isLoading ? "—" : formatNumber(row.converted)}
                  </p>
                  <p className="mt-1.5 mb-0 text-[10px] leading-none text-neutral-200">
                    @ {isLoading ? "—" : formatNumber(row.rate)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => toggle(row.quote)}
                  aria-pressed={pinned}
                  aria-label={`${pinned ? "Remove" : "Add"} ${row.quote} from favorites`}
                  className={`flex size-8 shrink-0 items-center justify-center rounded-lg border bg-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    pinned ? "border-primary" : "border-neutral-500"
                  }`}>
                  <Star
                    className={`size-4 ${
                      pinned
                        ? "fill-primary text-primary"
                        : "fill-transparent text-neutral-50"
                    }`}
                    aria-hidden
                  />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}