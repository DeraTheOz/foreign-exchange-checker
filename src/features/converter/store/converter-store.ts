import { create } from "zustand";

interface ConverterState {
  from: string;
  to: string;
  amount: string;
  setFrom: (currency: string) => void;
  setTo: (currency: string) => void;
  setPair: (from: string, to: string) => void;
  setAmount: (amount: string) => void;
  swap: () => void;
}

export const useConverterStore = create<ConverterState>((set) => ({
  from: "USD",
  to: "EUR",
  amount: "",
  setFrom: (currency) => set({ from: currency }),
  setTo: (currency) => set({ to: currency }),
  setPair: (from, to) => set({ from, to }),
  setAmount: (amount) => set({ amount }),
  swap: () =>
    set((state) => ({ from: state.to, to: state.from })),
}));
