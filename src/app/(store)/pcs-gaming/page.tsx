import type { Metadata } from "next";
import { Suspense } from "react";
import { Cpu } from "lucide-react";
import { categoryListing } from "@/data/listings";
import { pageMetadata } from "@/lib/seo";
import { CatalogSkeleton } from "@/components/catalog/catalog-skeleton";
import { CatalogView } from "@/components/catalog/catalog-view";
import { PageHero } from "@/components/catalog/page-hero";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = pageMetadata({
  title: "PCs Gaming",
  description: "Computadoras gaming armadas y probadas. Configuraciones de ejemplo para 1080p, 1440p y 4K.",
  path: "/pcs-gaming",
});

export default function PcsPage() {
  const { items, facets } = categoryListing("pc");
  return (
    <>
      <PageHero
        crumbs={[{ label: "PCs Gaming" }]}
        eyebrow="Listas para jugar"
        title="PCs Gaming"
        description="Equipos armados con componentes compatibles. Configuraciones demostrativas para ilustrar la propuesta."
        aside={
          <ButtonLink href="/arma-tu-pc" variant="secondary">
            <Cpu className="size-4" aria-hidden /> Prefiero armar la mía
          </ButtonLink>
        }
      />
      <div className="container-page mt-8">
        <Suspense fallback={<CatalogSkeleton />}>
          <CatalogView items={items} facets={facets} />
        </Suspense>
      </div>
    </>
  );
}
