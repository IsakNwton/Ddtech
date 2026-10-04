"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, GitCompareArrows, Heart, ShoppingCart, Truck } from "lucide-react";
import { cn } from "@/lib/cn";
import type { ProductSummary } from "@/lib/types";
import { useHydrated } from "@/hooks/use-hydrated";
import { useProductActions } from "@/hooks/use-product-actions";
import { useCompare } from "@/store/compare";
import { useFavorites } from "@/store/favorites";
import { ProductTags } from "@/components/ui/badge";
import { Button, IconButton } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { ProductImage } from "@/components/ui/product-image";
import { Rating } from "@/components/ui/rating";
import { StockStatus } from "@/components/ui/stock";

interface ProductCardProps {
  product: ProductSummary;
  priority?: boolean;
  layout?: "grid" | "list";
  className?: string;
}

/**
 * Tarjeta de producto: la información que decide la compra (precio, descuento,
 * disponibilidad, envío y valoración) se lee en segundos; las acciones secundarias
 * (favoritos, comparar) están siempre accesibles sin saturar la tarjeta.
 */
export function ProductCard({ product, priority, layout = "grid", className }: ProductCardProps) {
  const hydrated = useHydrated();
  const isFav = useFavorites((s) => s.items.some((p) => p.id === product.id));
  const inCompare = useCompare((s) => s.items.some((p) => p.id === product.id));
  const { addToCart, toggleFavorite, toggleCompare } = useProductActions();
  const [added, setAdded] = useState(false);
  const href = `/producto/${product.slug}`;
  const out = product.stock <= 0;
  const freeShipping = product.tags.includes("envio-gratis");

  const onAdd = () => {
    if (addToCart(product)) {
      setAdded(true);
      window.setTimeout(() => setAdded(false), 1400);
    }
  };

  const list = layout === "list";

  return (
    <article
      className={cn(
        "group/card relative flex overflow-hidden rounded-lg border border-line bg-surface transition-[border-color,box-shadow,transform] duration-200",
        "hover:border-line-strong hover:shadow-card",
        list ? "flex-row" : "flex-col",
        className,
      )}
    >
      {/* Imagen */}
      <div className={cn("stage relative shrink-0", list ? "w-36 sm:w-56" : "aspect-[4/3] w-full")}>
        <Link href={href} tabIndex={-1} aria-hidden className="absolute inset-0 block p-4">
          <ProductImage
            src={product.image}
            alt=""
            priority={priority}
            className={cn("transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover/card:scale-[1.04]", out && "opacity-50 grayscale")}
          />
        </Link>
        <ProductTags tags={product.tags} className="pointer-events-none absolute left-3 top-3" />
        <div className="absolute right-2.5 top-2.5 z-10 flex flex-col gap-1.5">
          <IconButton
            label={isFav && hydrated ? "Quitar de favoritos" : "Agregar a favoritos"}
            pressed={hydrated ? isFav : false}
            variant="overlay"
            size="sm"
            onClick={() => toggleFavorite(product)}
            className={cn(hydrated && isFav && "text-deal hover:text-deal")}
          >
            <Heart className={cn("size-4 transition-transform duration-200", hydrated && isFav && "scale-110 fill-current")} />
          </IconButton>
          <IconButton
            label={inCompare && hydrated ? "Quitar del comparador" : "Agregar al comparador"}
            pressed={hydrated ? inCompare : false}
            variant="overlay"
            size="sm"
            onClick={() => toggleCompare(product)}
            className={cn(
              "transition-opacity md:opacity-0 md:focus-visible:opacity-100 md:group-hover/card:opacity-100",
              hydrated && inCompare && "text-brand-text md:opacity-100",
            )}
          >
            <GitCompareArrows className="size-4" />
          </IconButton>
        </div>
      </div>

      {/* Contenido */}
      <div className={cn("flex min-w-0 flex-1 flex-col", list ? "p-4 sm:p-5" : "p-4")}>
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-2xs font-semibold uppercase tracking-[0.1em] text-fg-subtle">{product.brand}</p>
          <Rating value={product.rating} count={product.reviews} compact />
        </div>
        <h3 className="mt-1.5 line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-5 text-fg">
          <Link href={href} className="outline-none after:absolute after:inset-0 after:content-[''] hover:text-white focus-visible:underline">
            {product.name}
          </Link>
        </h3>
        <ul className="mt-2.5 flex flex-wrap gap-1" aria-label="Especificaciones clave">
          {product.highlights.slice(0, 3).map((h) => (
            <li key={h} className="rounded-xs bg-surface-3 px-1.5 py-0.5 font-mono text-[10.5px] text-fg-muted">
              {h}
            </li>
          ))}
        </ul>

        <div className={cn("mt-auto pt-4", list && "sm:flex sm:items-end sm:justify-between sm:gap-6")}>
          <div>
            <Price price={product.price} compareAt={product.compareAt} />
            <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
              <StockStatus stock={product.stock} />
              {freeShipping && !out && (
                <span className="inline-flex items-center gap-1 text-xs text-fg-muted">
                  <Truck className="size-3.5" aria-hidden /> Envío gratis
                </span>
              )}
            </div>
          </div>
          <Button
            variant={out ? "secondary" : "primary"}
            size="sm"
            block={!list}
            onClick={onAdd}
            disabled={out}
            aria-label={out ? `${product.name} agotado` : `Agregar ${product.name} al carrito`}
            className={cn("relative z-10 mt-4", list && "sm:mt-0 sm:w-44", added && "bg-success text-[#04130c] hover:bg-success")}
          >
            {added ? (
              <>
                <Check className="size-4 animate-check" strokeWidth={3} /> Agregado
              </>
            ) : out ? (
              "Agotado"
            ) : (
              <>
                <ShoppingCart className="size-4" /> Agregar al carrito
              </>
            )}
          </Button>
        </div>
      </div>
    </article>
  );
}
