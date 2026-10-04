import type { Metadata } from "next";
import { Suspense } from "react";
import { Flame } from "lucide-react";
import { dealsListing } from "@/data/listings";
import { SORT_OPTIONS } from "@/lib/filters";
import { pageMetadata } from "@/lib/seo";
import { CatalogSkeleton } from "@/components/catalog/catalog-skeleton";
import { CatalogView } from "@/components/catalog/catalog-view";
import { PageHero } from "@/components/catalog/page-hero";
import { Countdown } from "@/components/home/countdown";

export const metadata: Metadata = pageMetadata({
  title: "Ofertas de la semana",
  description: "Componentes y periféricos con descuento. Precios y promociones demostrativas.",
  path: "/ofertas",
});

export default function DealsPage() {
  const { items, facets } = dealsListing();
  return (
    <>
      <PageHero
        crumbs={[{ label: "Ofertas" }]}
        eyebrow="Contenido conceptual"
        title={
          <span className="inline-flex items-center gap-3">
            <Flame className="size-8 text-deal" aria-hidden /> Ofertas de la semana
          </span>
        }
        description="Descuentos ordenados de mayor a menor. Promociones, precios y vigencia son demostrativos."
        aside={
          <div className="rounded-lg border border-line bg-surface p-4">
            <p className="mb-2 text-xs text-fg-subtle">Terminan en</p>
            <Countdown />
          </div>
        }
      />
      <div className="container-page mt-8">
        <Suspense fallback={<CatalogSkeleton />}>
          <CatalogView items={items} facets={facets} sortOptions={[{ value: "descuento", label: "Mayor descuento" }, ...SORT_OPTIONS]} />
        </Suspense>
      </div>
    </>
  );
}
