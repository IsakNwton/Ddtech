import { create } from "zustand";

export type ToastTone = "default" | "success" | "warning" | "error";

export interface Toast {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
  action?: { label: string; onClick: () => void };
  href?: { label: string; to: string };
}

interface UIState {
  hydrated: boolean;
  cartOpen: boolean;
  searchOpen: boolean;
  menuOpen: boolean;
  cartPulse: number;
  toasts: Toast[];
  setHydrated: () => void;
  openCart: () => void;
  closeCart: () => void;
  setSearchOpen: (open: boolean) => void;
  setMenuOpen: (open: boolean) => void;
  pulseCart: () => void;
  toast: (t: Omit<Toast, "id" | "tone"> & { tone?: ToastTone; duration?: number }) => void;
  dismiss: (id: number) => void;
}

let toastId = 0;

export const useUI = create<UIState>()((set, get) => ({
  hydrated: false,
  cartOpen: false,
  searchOpen: false,
  menuOpen: false,
  cartPulse: 0,
  toasts: [],
  setHydrated: () => set({ hydrated: true }),
  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  pulseCart: () => set((s) => ({ cartPulse: s.cartPulse + 1 })),
  toast: ({ duration = 3600, tone = "default", ...t }) => {
    const id = ++toastId;
    set((s) => ({ toasts: [...s.toasts.slice(-2), { id, tone, ...t }] }));
    window.setTimeout(() => get().dismiss(id), duration);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export const toast = (t: Parameters<UIState["toast"]>[0]) => useUI.getState().toast(t);
