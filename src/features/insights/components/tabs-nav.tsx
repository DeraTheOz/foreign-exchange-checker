import { useInsightsStore, type InsightTab } from "../store/insights-store";
import { useFavoritesStore } from "../store/favorites-store";
import { useConversionHistory } from "../store/conversion-history-store";

interface TabItem {
  id: InsightTab;
  label: string;
  showCount: boolean;
}

const TABS: TabItem[] = [
  { id: "history", label: "HISTORY", showCount: false },
  { id: "compare", label: "COMPARE", showCount: false },
  { id: "favorites", label: "FAVORITES", showCount: true },
  { id: "log", label: "LOG", showCount: true },
];

export function TabsNav() {
  const activeTab = useInsightsStore((state) => state.activeTab);
  const setActiveTab = useInsightsStore((state) => state.setActiveTab);
  const favoritesCount = useFavoritesStore((s) => s.favorites.length);
  const logCount = useConversionHistory((s) => s.entries.length);

  const counts: Record<InsightTab, number> = {
    history: 0,
    compare: 0,
    favorites: favoritesCount,
    log: logCount,
  };

  return (
    <nav className="flex items-start gap-2 overflow-x-auto border-b border-neutral-600 no-scrollbar">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => setActiveTab(tab.id)}
          aria-current={activeTab === tab.id ? "page" : undefined}
          className={`flex h-10.5 cursor-pointer items-center justify-center gap-2 border-b-2 bg-transparent px-4 text-base leading-tight tracking-widest text-neutral-50 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary focus-visible:rounded-lg focus-visible:border-b-0 ${
            activeTab === tab.id ? "border-b-primary" : "border-b-transparent"
          }`}>
          {tab.label}
          {tab.showCount && counts[tab.id] > 0 ? (
            <span className="flex size-5 items-center justify-center rounded-full bg-lime-800 text-[10px] leading-none text-primary">
              {counts[tab.id]}
            </span>
          ) : null}
        </button>
      ))}
    </nav>
  );
}
