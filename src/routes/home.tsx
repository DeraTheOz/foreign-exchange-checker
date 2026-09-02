import { Header } from "../components/layout/header";
import { LiveMarketStrip } from "../features/market/live-market-strip";
import { ConversionForm } from "../features/converter/components/conversion-form";
import { DetailsPanel } from "../features/insights/details-panel";

export function HomeLayout() {
  return (
    <main className="min-h-screen bg-neutral-900 text-neutral-50">
      <Header />
      <LiveMarketStrip />
      <section className="mx-auto w-full max-w-[1100px] px-4 py-8 min-[860px]:px-8 min-[860px]:py-12">
        <h1 className="mb-4 text-xl font-normal leading-tight">CHECK THE RATE</h1>
        <ConversionForm />
        <DetailsPanel />
      </section>
    </main>
  );
}
