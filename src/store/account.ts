import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "./cart";
import { persistOptions } from "./persist";

export interface DemoOrder {
  id: string;
  createdAt: string;
  lines: CartLine[];
  total: number;
  shipping: string;
  email: string;
}

interface AccountState {
  user: { name: string; email: string } | null;
  orders: DemoOrder[];
  signIn: (user: { name: string; email: string }) => void;
  signOut: () => void;
  addOrder: (order: DemoOrder) => void;
}

export const useAccount = create<AccountState>()(
  persist(
    (set) => ({
      user: null,
      orders: [],
      signIn: (user) => set({ user }),
      signOut: () => set({ user: null }),
      addOrder: (order) => set((s) => ({ orders: [order, ...s.orders].slice(0, 20) })),
    }),
    persistOptions<AccountState>("account", (s) => ({ user: s.user, orders: s.orders })),
  ),
);
