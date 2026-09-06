import type { LiveMarketRate } from "./hooks/use-market-rates";

export function MarketRateGroup({
  rates,
  ariaHidden = false,
}: {
  rates: LiveMarketRate[];
  ariaHidden?: boolean;
}) {
  return (
    <div className="flex" aria-hidden={ariaHidden}>
      {rates.map((rate) => (
        <div
          key={rate.pair}
          className="flex flex-[0_0_clamp(9.5rem,34vw,13rem)] items-center justify-center gap-2.5 border-r border-neutral-500 px-3 py-3 min-[640px]:px-5">
          <span className="m-0 text-xs leading-tight tracking-widest whitespace-nowrap text-neutral-200">
            {rate.pair}
          </span>
          <strong className="m-0 text-xs font-medium leading-tight tracking-widest whitespace-nowrap text-neutral-50">
            {rate.value}
          </strong>
          <em
            className={`m-0 text-xs leading-tight tracking-widest whitespace-nowrap not-italic ${
              rate.direction === "up" ? "text-success" : "text-error"
            }`}>
            {rate.change}
          </em>
        </div>
      ))}
    </div>
  );
}
