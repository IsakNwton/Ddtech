import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SearchX } from "lucide-react";
import { getProduct } from "@/data/catalog";
import { searchListing } from "@/data/listings";
import { buildSearchIndex } from "@/data/search-index";
import { POPULAR_SEARCHES, searchDocs } from "@/lib/search";
import type { Product } from "@/lib/types";
import { CatalogSkeleton } from "@/components/catalog/catalog-skeleton";
import { CatalogView } from "@/components/catalog/catalog-view";
import { PageHero } from "@/components/catalog/page-hero";

export async function generateMetadata({ searchParams }: PageProps<"/buscar">): Promise<Metadata> {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q : "";
  return { title: query ? `Resultados para "${query}"` : "Buscar", robots: { index: false } };
}

export default async function SearchPage({ searchParams }: PageProps<"/buscar">) {
  const { q } = await searchParams;
  const query = (typeof q === "string" ? q : "").trim();
  const result = query ? searchDocs(buildSearchIndex(), query, 200) : null;
  const list = (result?.products ?? []).map((d) => getProduct(d.slug)).filter((p): p is Product => !!p);
  const { items, facets } = searchListing(list);

  return (
    <>
      <PageHero
        crumbs={[{ label: "Búsqueda" }]}
        eyebrow="Búsqueda"
        title={query ? <>Resultados para &ldquo;{query}&rdquo;</> : "¿Qué estás buscando?"}
        description={query ? `${list.length} ${list.length === 1 ? "producto encontrado" : "productos encontrados"}` : "Usa el buscador para encontrar productos por modelo, marca o categoría."}
      >
        {result && result.suggestions.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Búsquedas relacionadas">
            {result.suggestions.map((s) => (
              <li key={s.label}>
                <Link href={s.href} className="inline-flex h-9 items-center rounded-full border border-line bg-surface px-3.5 text-sm text-fg-muted transition-colors hover:border-line-strong hover:text-fg">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </PageHero>
      <div className="container-page mt-8">
        {list.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-xl border border-line bg-surface px-6 py-14 text-center">
            <SearchX className="mx-auto size-10 text-fg-subtle" aria-hidden />
            <p className="mt-4 text-lg font-semibold">{query ? "No encontramos coincidencias" : "Empieza a buscar"}</p>
            <p className="mt-1 text-sm text-fg-muted">Prueba con un modelo como “5070”, una marca o una categoría.</p>
            <ul className="mt-6 flex flex-wrap justify-center gap-2">
              {POPULAR_SEARCHES.map((s) => (
                <li key={s}>
                  <Link href={`/buscar?q=${encodeURIComponent(s)}`} className="inline-flex h-9 items-center rounded-full border border-line-strong px-3.5 text-sm text-fg-muted hover:text-fg">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <Suspense fallback={<CatalogSkeleton />}>
            <CatalogView key={query} items={items} facets={facets} />
          </Suspense>
        )}
      </div>
    </>
  );
}
