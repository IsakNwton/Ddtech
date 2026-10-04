import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductSummary } from "@/lib/types";
import { persistOptions } from "./persist";

export const MAX_COMPARE = 4;

export type CompareResult = "added" | "removed" | "full" | "replaced-category";

interface CompareState {
  items: ProductSummary[];
  toggle: (product: ProductSummary) => CompareResult;
  remove: (id: string) => void;
  set: (items: ProductSummary[]) => void;
  clear: () => void;
}

export const useCompare = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (product) => {
        const { items } = get();
        if (items.some((p) => p.id === product.id)) {
          set({ items: items.filter((p) => p.id !== product.id) });
          return "removed";
        }
        if (items.length && items[0].category !== product.category) {
          set({ items: [product] });
          return "replaced-category";
        }
        if (items.length >= MAX_COMPARE) return "full";
        set({ items: [...items, product] });
        return "added";
      },
      remove: (id) => set((s) => ({ items: s.items.filter((p) => p.id !== id) })),
      set: (items) => set({ items: items.slice(0, MAX_COMPARE) }),
      clear: () => set({ items: [] }),
    }),
    persistOptions<CompareState>("compare", (s) => ({ items: s.items })),
  ),
);
