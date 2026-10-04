import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { categories, getCategoryBySlug } from "@/data/categories";
import { categoryListing } from "@/data/listings";
import { pageMetadata } from "@/lib/seo";
import { CatalogSkeleton } from "@/components/catalog/catalog-skeleton";
import { CatalogView } from "@/components/catalog/catalog-view";
import { PageHero } from "@/components/catalog/page-hero";

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.filter((c) => c.id !== "pc").map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/componentes/[categoria]">): Promise<Metadata> {
  const { categoria } = await params;
  const c = getCategoryBySlug(categoria);
  if (!c) return {};
  return pageMetadata({ title: c.name, description: c.description, path: `/componentes/${c.slug}`, image: `/art/${c.art}.svg` });
}

/** Accesos rápidos por categoría: los atajos más usados, a un toque */
const QUICK: Record<string, { label: string; qs: string }[]> = {
  gpu: [
    { label: "NVIDIA", qs: "marca=NVIDIA" },
    { label: "AMD Radeon", qs: "marca=AMD" },
    { label: "16 GB VRAM", qs: "vram=16%20GB" },
    { label: "Hasta $10,000", qs: "precio=5500-10000" },
  ],
  cpu: [
    { label: "AMD AM5", qs: "socket=AM5" },
    { label: "Intel LGA1851", qs: "socket=LGA1851" },
    { label: "Con gráficos integrados", qs: "graficos=S%C3%AD" },
  ],
  motherboard: [
    { label: "AM5", qs: "socket=AM5" },
    { label: "Micro-ATX", qs: "formato=Micro-ATX" },
    { label: "DDR4", qs: "memoria=DDR4" },
  ],
};

export default async function CategoryPage({ params }: PageProps<"/componentes/[categoria]">) {
  const { categoria } = await params;
  const category = getCategoryBySlug(categoria);
  if (!category || category.id === "pc") notFound();
  const { items, facets } = categoryListing(category.id);
  const quick = QUICK[category.id];
  const group = category.group === "perifericos" ? { label: "Periféricos", href: "/perifericos" } : { label: "Componentes", href: "/componentes" };

  return (
    <>
      <PageHero crumbs={[group, { label: category.name }]} eyebrow={category.hint} title={category.name} description={category.description}>
        {quick && (
          <ul className="mt-5 flex gap-2 overflow-x-auto pb-1 scrollbar-none" aria-label="Accesos rápidos">
            {quick.map((q) => (
              <li key={q.label} className="shrink-0">
                <Link href={`/componentes/${category.slug}?${q.qs}`} scroll={false} className="inline-flex h-9 items-center rounded-full border border-line bg-surface px-3.5 text-sm text-fg-muted transition-colors hover:border-line-strong hover:text-fg">
                  {q.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </PageHero>
      <div className="container-page mt-8">
        <Suspense fallback={<CatalogSkeleton />}>
          <CatalogView items={items} facets={facets} />
        </Suspense>
      </div>
    </>
  );
}
