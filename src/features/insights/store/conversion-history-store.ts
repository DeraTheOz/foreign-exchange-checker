import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ConversionEntry {
  id: string;
  timestamp: number;
  from: string;
  to: string;
  amount: string;
  converted: string;
}

interface ConversionHistoryState {
  entries: ConversionEntry[];
  addEntry: (entry: Omit<ConversionEntry, "id" | "timestamp">) => void;
  removeEntry: (id: string) => void;
  clearAll: () => void;
  isLogged: (from: string, to: string, amount: string) => boolean;
}

export const useConversionHistory = create<ConversionHistoryState>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (entry) => {
        const newEntry: ConversionEntry = {
          ...entry,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        };
        set((state) => ({ entries: [newEntry, ...state.entries] }));
      },

      removeEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        })),

      clearAll: () => set({ entries: [] }),

      isLogged: (from, to, amount) =>
        get().entries.some(
          (e) => e.from === from && e.to === to && e.amount === amount,
        ),
    }),
    { name: "fx-conversion-history" },
  ),
);
