"use client";

import { useEffect, type ReactNode } from "react";
import { useAccount } from "@/store/account";
import { useBuilder } from "@/store/builder";
import { useCart } from "@/store/cart";
import { useCompare } from "@/store/compare";
import { useFavorites } from "@/store/favorites";
import { useUI } from "@/store/ui";

/** Rehidrata los stores persistidos tras el primer render (evita desajustes SSR) */
export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    Promise.all([
      useCart.persist.rehydrate(),
      useFavorites.persist.rehydrate(),
      useCompare.persist.rehydrate(),
      useBuilder.persist.rehydrate(),
      useAccount.persist.rehydrate(),
    ]).finally(() => useUI.getState().setHydrated());
  }, []);
  return children;
}
