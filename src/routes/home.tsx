import { Header } from "../components/layout/header";
import { LiveMarketStrip } from "../features/market/live-market-strip";
import { ConversionForm } from "../features/converter/components/conversion-form";
import { useUrlState } from "../features/converter/hooks/use-url-state";
import { useKeyboardShortcuts } from "../features/converter/hooks/use-keyboard-shortcuts";
import { DetailsPanel } from "../features/insights/details-panel";

export function HomeLayout() {
  useUrlState();
  useKeyboardShortcuts();

  return (
    <main className="min-h-screen bg-neutral-900 text-neutral-50">
      <Header />
      <LiveMarketStrip />

      <section className="mx-auto w-full max-w-275 px-4 py-8 min-[860px]:px-8 min-[860px]:py-12">
        <h1 className="mb-4 text-xl font-normal leading-tight">
          CHECK THE RATE
        </h1>
        <ConversionForm />

        <DetailsPanel />
      </section>
    </main>
  );
}
