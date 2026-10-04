import type { Metadata } from "next";
import { Suspense } from "react";
import { peripheralsListing } from "@/data/listings";
import { pageMetadata } from "@/lib/seo";
import { CatalogSkeleton } from "@/components/catalog/catalog-skeleton";
import { CatalogView } from "@/components/catalog/catalog-view";
import { PageHero } from "@/components/catalog/page-hero";

export const metadata: Metadata = pageMetadata({
  title: "Periféricos",
  description: "Monitores, teclados, mouse y audífonos gaming.",
  path: "/perifericos",
});

export default function PeripheralsPage() {
  const { items, facets } = peripheralsListing();
  return (
    <>
      <PageHero crumbs={[{ label: "Periféricos" }]} eyebrow="Completa tu setup" title="Periféricos" description="Monitores, teclados, mouse y audífonos para jugar y trabajar." />
      <div className="container-page mt-8">
        <Suspense fallback={<CatalogSkeleton />}>
          <CatalogView items={items} facets={facets} />
        </Suspense>
      </div>
    </>
  );
}
