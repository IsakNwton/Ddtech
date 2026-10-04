"use client";

import { Heart } from "lucide-react";
import { useHydrated } from "@/hooks/use-hydrated";
import { useFavorites } from "@/store/favorites";
import { ProductGrid } from "@/components/product/product-grid";
import { ButtonLink } from "@/components/ui/button";
import { ProductCardSkeleton } from "@/components/ui/skeleton";

export function FavoritesView() {
  const hydrated = useHydrated();
  const items = useFavorites((s) => s.items);
  if (!hydrated) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-line bg-surface px-6 py-14 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-surface-3 text-deal">
          <Heart className="size-6" aria-hidden />
        </span>
        <h2 className="mt-5 text-lg font-semibold">Aún no tienes favoritos</h2>
        <p className="mt-1 text-sm text-fg-muted">Toca el corazón en cualquier producto para guardarlo y compararlo después.</p>
        <ButtonLink href="/componentes" className="mt-6">
          Explorar componentes
        </ButtonLink>
      </div>
    );
  }
  return <ProductGrid products={items} />;
}
