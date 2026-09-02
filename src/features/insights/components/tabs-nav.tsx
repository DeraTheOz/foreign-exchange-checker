import { useInsightsStore, type InsightTab } from "../store/insights-store";

interface TabItem {
  id: InsightTab;
  label: string;
  count?: number;
}

const TABS: TabItem[] = [
  { id: "history", label: "HISTORY" },
  { id: "compare", label: "COMPARE" },
  { id: "favorites", label: "FAVORITES", count: 0 },
  { id: "log", label: "LOG", count: 0 },
];

export function TabsNav() {
  const activeTab = useInsightsStore((state) => state.activeTab);
  const setActiveTab = useInsightsStore((state) => state.setActiveTab);

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
          {tab.count !== undefined ? (
            <span className="flex size-5 items-center justify-center rounded-full bg-lime-800 text-[10px] leading-none text-primary">
              {tab.count}
            </span>
          ) : null}
        </button>
      ))}
    </nav>
  );
}
