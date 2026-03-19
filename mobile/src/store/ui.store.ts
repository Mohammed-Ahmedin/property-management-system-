// store/filterDrawerStore.ts
import { create } from "zustand";

type FilterDrawerState = {
  visible: boolean;
  open: () => void;
  close: () => void;
};

export const useFilterDrawerStore = create<FilterDrawerState>((set) => ({
  visible: false,
  open: () => set({ visible: true }),
  close: () => set({ visible: false }),
}));
