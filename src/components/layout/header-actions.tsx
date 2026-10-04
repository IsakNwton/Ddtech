"use client";

import Link from "next/link";
import { Heart, ShoppingCart, User } from "lucide-react";
import { cn } from "@/lib/cn";
import { useHydrated } from "@/hooks/use-hydrated";
import { cartCount, useCart } from "@/store/cart";
import { useFavorites } from "@/store/favorites";
import { useUI } from "@/store/ui";

function CountBadge({ n, pulseKey }: { n: number; pulseKey?: number }) {
  if (n <= 0) return null;
  return (
    <span
      key={pulseKey}
      className="tabular absolute -right-1 -top-1 grid h-[18px] min-w-[18px] animate-bump place-items-center rounded-full bg-brand px-1 text-[10px] font-bold leading-none text-white ring-2 ring-bg"
    >
      {n > 99 ? "99+" : n}
    </span>
  );
}

const actionCls =
  "relative h-10 items-center gap-2 rounded-md px-2.5 text-sm font-medium text-fg-muted transition-colors duration-150 hover:bg-surface-3 hover:text-fg";

export function HeaderActions({ className }: { className?: string }) {
  const hydrated = useHydrated();
  const count = useCart((s) => cartCount(s.lines));
  const favs = useFavorites((s) => s.items.length);
  const openCart = useUI((s) => s.openCart);
  const pulse = useUI((s) => s.cartPulse);
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      <Link href="/cuenta" className={cn(actionCls, "hidden lg:inline-flex")}>
        <User className="size-5" aria-hidden />
        <span className="hidden 2xl:inline">Cuenta</span>
        <span className="sr-only 2xl:hidden">Cuenta</span>
      </Link>
      <Link href="/favoritos" className={cn(actionCls, "hidden lg:inline-flex")} aria-label={`Favoritos${hydrated && favs ? `, ${favs} productos` : ""}`}>
        <span className="relative">
          <Heart className="size-5" aria-hidden />
          {hydrated && <CountBadge n={favs} />}
        </span>
        <span className="hidden 2xl:inline">Favoritos</span>
      </Link>
      <button
        type="button"
        onClick={openCart}
        className={cn(actionCls, "inline-flex pr-3")}
        aria-label={`Abrir carrito${hydrated ? `, ${count} productos` : ""}`}
      >
        <span className="relative">
          <ShoppingCart className="size-5" aria-hidden />
          {hydrated && <CountBadge n={count} pulseKey={pulse} />}
        </span>
        <span className="hidden xl:inline">Carrito</span>
      </button>
    </div>
  );
}
