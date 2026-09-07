import { lazy, Suspense } from "react";
import { useInsightsStore } from "./store/insights-store";
import { TabsNav } from "./components/tabs-nav";
import { ComparePanel } from "./components/compare-panel";
import { FavoritesPanel } from "./components/favorites-panel";
import { LogPanel } from "./components/log-panel";

const HistoryPanel = lazy(() =>
  import("./components/history-panel").then((module) => ({
    default: module.HistoryPanel,
  })),
);

function HistoryPanelLoader() {
  return (
    <section
      className="mt-5 flex min-h-90 flex-col items-center justify-center gap-4 rounded-2xl bg-neutral-700 p-4 text-center normal-case min-[720px]:p-5"
      aria-busy="true">
      <p className="m-0 text-xl leading-tight text-neutral-100">Loading chart…</p>
    </section>
  );
}

export function DetailsPanel() {
  const activeTab = useInsightsStore((state) => state.activeTab);

  return (
    <div className="mt-8">
      <TabsNav />
      <div key={activeTab}>
        {activeTab === "history" && (
          <Suspense fallback={<HistoryPanelLoader />}>
            <HistoryPanel />
          </Suspense>
        )}
        {activeTab === "compare" && <ComparePanel />}
        {activeTab === "favorites" && <FavoritesPanel />}
        {activeTab === "log" && <LogPanel />}
      </div>
    </div>
  );
}