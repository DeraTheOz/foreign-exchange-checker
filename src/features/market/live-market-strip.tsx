import { MarketRateGroup } from "./market-rate-group";

export function LiveMarketStrip() {
  return (
    <section className="relative flex min-h-10 overflow-hidden bg-neutral-700">
      <div className="relative z-10 flex shrink-0 items-center gap-2 bg-primary px-4 py-3 text-neutral-900">
        <span className="relative flex h-3 w-3 items-center justify-center">
          <span className="live-market-pulse absolute h-3 w-3 rounded-full bg-neutral-900/35" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-neutral-900" />
        </span>
        <p className="m-0 text-xs font-medium leading-tight tracking-widest whitespace-nowrap">
          Live markets
        </p>
      </div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="live-market-marquee flex w-max">
          <MarketRateGroup />
          <MarketRateGroup ariaHidden />
        </div>
      </div>
    </section>
  );
}
