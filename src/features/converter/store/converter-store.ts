import { create } from "zustand";

interface ConverterState {
  from: string;
  to: string;
  amount: string;
  pickerTarget: "from" | "to" | null;
  setFrom: (currency: string) => void;
  setTo: (currency: string) => void;
  setPair: (from: string, to: string) => void;
  setAmount: (amount: string) => void;
  swap: () => void;
  setPickerTarget: (field: "from" | "to") => void;
  closePicker: () => void;
}

export const useConverterStore = create<ConverterState>((set) => ({
  from: "USD",
  to: "EUR",
  amount: "",
  pickerTarget: null,
  setFrom: (currency) => set({ from: currency }),
  setTo: (currency) => set({ to: currency }),
  setPair: (from, to) => set({ from, to }),
  setAmount: (amount) => set({ amount }),
  swap: () =>
    set((state) => ({ from: state.to, to: state.from })),
  setPickerTarget: (field) => set({ pickerTarget: field }),
  closePicker: () => set({ pickerTarget: null }),
}));
