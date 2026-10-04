"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cpu, Heart, House, Search, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/cn";
import { useHydrated } from "@/hooks/use-hydrated";
import { cartCount, useCart } from "@/store/cart";
import { useFavorites } from "@/store/favorites";
import { useUI } from "@/store/ui";

/**
 * Navegación inferior móvil: las 5 tareas más frecuentes al alcance del pulgar.
 * "Armar PC" ocupa el centro como acción diferenciadora de la tienda.
 */
export function BottomNav() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const count = useCart((s) => cartCount(s.lines));
  const favs = useFavorites((s) => s.items.length);
  const openCart = useUI((s) => s.openCart);
  const setSearchOpen = useUI((s) => s.setSearchOpen);

  const item = "relative flex flex-1 flex-col items-center justify-center gap-1 pt-1.5 text-[10.5px] font-medium transition-colors";
  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const badge = (n: number) =>
    hydrated && n > 0 ? (
      <span className="tabular absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[9px] font-bold text-white ring-2 ring-bg">
        {n}
      </span>
    ) : null;

  return (
    <nav aria-label="Navegación inferior" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/92 backdrop-blur-xl safe-bottom lg:hidden">
      <div className="mx-auto flex h-16 max-w-lg items-stretch px-2">
        <Link href="/" className={cn(item, active("/") ? "text-fg" : "text-fg-subtle")} aria-current={active("/") ? "page" : undefined}>
          <House className="size-5" aria-hidden />
          Inicio
        </Link>
        <button type="button" onClick={() => setSearchOpen(true)} className={cn(item, "text-fg-subtle")}>
          <Search className="size-5" aria-hidden />
          Buscar
        </button>
        <Link href="/arma-tu-pc" className={cn(item, active("/arma-tu-pc") ? "text-fg" : "text-fg-muted")} aria-current={active("/arma-tu-pc") ? "page" : undefined}>
          <span
            className={cn(
              "-mt-5 grid size-11 place-items-center rounded-full bg-brand text-white shadow-[0_8px_20px_-6px_rgb(47_95_240/0.9)] ring-4 ring-bg transition-transform active:scale-95",
            )}
          >
            <Cpu className="size-5" aria-hidden />
          </span>
          Armar PC
        </Link>
        <Link href="/favoritos" className={cn(item, active("/favoritos") ? "text-fg" : "text-fg-subtle")} aria-current={active("/favoritos") ? "page" : undefined}>
          <span className="relative">
            <Heart className="size-5" aria-hidden />
            {badge(favs)}
          </span>
          Favoritos
        </Link>
        <button type="button" onClick={openCart} className={cn(item, "text-fg-subtle")} aria-label={`Carrito${hydrated ? `, ${count} productos` : ""}`}>
          <span className="relative">
            <ShoppingCart className="size-5" aria-hidden />
            {badge(count)}
          </span>
          Carrito
        </button>
      </div>
    </nav>
  );
}
