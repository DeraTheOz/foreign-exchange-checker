import { useInsightsStore } from "./store/insights-store";
import { TabsNav } from "./components/tabs-nav";
import { HistoryPanel } from "./components/history-panel";
import { ComparePanel } from "./components/compare-panel";
import { FavoritesPanel } from "./components/favorites-panel";
import { LogPanel } from "./components/log-panel";

export function DetailsPanel() {
  const activeTab = useInsightsStore((state) => state.activeTab);

  return (
    <div className="mt-8">
      <TabsNav />
      <div key={activeTab}>
        {activeTab === "history" && <HistoryPanel />}
        {activeTab === "compare" && <ComparePanel />}
        {activeTab === "favorites" && <FavoritesPanel />}
        {activeTab === "log" && <LogPanel />}
      </div>
    </div>
  );
}
