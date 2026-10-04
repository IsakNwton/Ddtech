import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductSummary } from "@/lib/types";
import { persistOptions } from "./persist";

export interface CartLine {
  product: ProductSummary;
  qty: number;
}

interface CartState {
  lines: CartLine[];
  add: (product: ProductSummary, qty?: number) => void;
  addMany: (products: ProductSummary[]) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => CartLine | undefined;
  restore: (line: CartLine, index: number) => void;
  clear: () => void;
}

export const MAX_QTY = 10;

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: (product, qty = 1) =>
        set((s) => {
          const existing = s.lines.find((l) => l.product.id === product.id);
          if (existing) {
            return {
              lines: s.lines.map((l) =>
                l.product.id === product.id ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l,
              ),
            };
          }
          return { lines: [...s.lines, { product, qty: Math.min(MAX_QTY, qty) }] };
        }),
      addMany: (products) => products.forEach((p) => get().add(p, 1)),
      setQty: (id, qty) =>
        set((s) => ({
          lines: s.lines.map((l) => (l.product.id === id ? { ...l, qty: Math.max(1, Math.min(MAX_QTY, qty)) } : l)),
        })),
      remove: (id) => {
        const line = get().lines.find((l) => l.product.id === id);
        set((s) => ({ lines: s.lines.filter((l) => l.product.id !== id) }));
        return line;
      },
      restore: (line, index) =>
        set((s) => {
          if (s.lines.some((l) => l.product.id === line.product.id)) return s;
          const lines = [...s.lines];
          lines.splice(Math.min(index, lines.length), 0, line);
          return { lines };
        }),
      clear: () => set({ lines: [] }),
    }),
    persistOptions<CartState>("cart", (s) => ({ lines: s.lines })),
  ),
);

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((n, l) => n + l.qty, 0);
}

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((n, l) => n + l.qty * l.product.price, 0);
}

export function cartSavings(lines: CartLine[]): number {
  return lines.reduce((n, l) => n + (l.product.compareAt ? (l.product.compareAt - l.product.price) * l.qty : 0), 0);
}
