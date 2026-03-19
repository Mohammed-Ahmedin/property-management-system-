// src/store/filterStore.ts
import { create } from "zustand";

export interface FilterValues {
  minPrice: number;
  maxPrice: number;
  city: string;
  subcity: string;
  type: "private" | "shared" | "";
}

interface FilterStore {
  filters: FilterValues;
  setFilters: (filters: Partial<FilterValues>) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  filters: {
    minPrice: 0,
    maxPrice: 10000,
    city: "",
    subcity: "",
    type: "",
  },
  setFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),
  resetFilters: () =>
    set({
      filters: {
        minPrice: 0,
        maxPrice: 10000,
        city: "",
        subcity: "",
        type: "",
      },
    }),
}));
