import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductSummary } from "@/lib/types";
import { persistOptions } from "./persist";

interface FavoritesState {
  items: ProductSummary[];
  toggle: (product: ProductSummary) => boolean;
  remove: (id: string) => void;
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (product) => {
        const exists = get().items.some((p) => p.id === product.id);
        set((s) => ({ items: exists ? s.items.filter((p) => p.id !== product.id) : [product, ...s.items] }));
        return !exists;
      },
      remove: (id) => set((s) => ({ items: s.items.filter((p) => p.id !== id) })),
    }),
    persistOptions<FavoritesState>("favorites", (s) => ({ items: s.items })),
  ),
);
