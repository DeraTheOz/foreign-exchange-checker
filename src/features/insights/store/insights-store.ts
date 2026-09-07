import { create } from "zustand";

export type InsightTab = "history" | "compare" | "favorites" | "log" | "ai";

interface InsightsState {
  activeTab: InsightTab;
  setActiveTab: (tab: InsightTab) => void;
}

export const useInsightsStore = create<InsightsState>((set) => ({
  activeTab: "history",
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
