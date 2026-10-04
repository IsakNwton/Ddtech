import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { componentCategories, categoryHref, peripheralCategories } from "@/data/categories";
import { countByCategory, minPrice } from "@/data/catalog";
import { formatPrice } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/catalog/page-hero";
import { CategoryIcon } from "@/components/layout/category-icon";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = pageMetadata({
  title: "Componentes para PC",
  description: "Procesadores, tarjetas gráficas, tarjetas madre, memoria RAM, almacenamiento, fuentes, gabinetes y enfriamiento.",
  path: "/componentes",
});

export default function ComponentsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Componentes" }]}
        eyebrow="Catálogo"
        title="Componentes"
        description="Todo lo que necesitas para armar o actualizar tu PC, organizado para encontrarlo rápido."
        aside={
          <ButtonLink href="/arma-tu-pc" variant="secondary">
            ¿Armando desde cero? Usa el configurador <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
        }
      />
      <div className="container-page mt-8">
        <ul className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 xl:grid-cols-3">
          {componentCategories.map((c, i) => (
            <li key={c.id}>
              <Link href={categoryHref(c.id)} className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-surface transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-card sm:flex-row">
                <span className="stage relative aspect-[4/3] shrink-0 sm:aspect-auto sm:w-44 md:w-40 lg:w-48">
                  <Image src={`/art/${c.art}.svg`} alt="" fill unoptimized priority={i < 6} sizes="200px" className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.06]" />
                </span>
                <span className="flex flex-1 flex-col p-4 sm:p-5">
                  <span className="flex items-center gap-2 text-base font-semibold tracking-[-0.01em] text-fg">
                    <CategoryIcon id={c.id} className="hidden size-4 text-brand-text sm:block" />
                    {c.name}
                  </span>
                  <span className="mt-1 line-clamp-2 text-xs text-fg-muted sm:text-sm">{c.description}</span>
                  <span className="mt-auto flex items-center justify-between pt-3 text-xs text-fg-subtle">
                    <span>
                      {countByCategory(c.id)} productos · desde <span className="tabular text-fg-muted">{formatPrice(minPrice(c.id))}</span>
                    </span>
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:text-fg" aria-hidden />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-12">
          <h2 className="text-lg font-semibold tracking-[-0.02em]">También buscan</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {peripheralCategories.map((c) => (
              <li key={c.id}>
                <Link href={categoryHref(c.id)} className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm text-fg-muted transition-colors hover:border-line-strong hover:text-fg">
                  <CategoryIcon id={c.id} className="size-4" /> {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/pcs-gaming" className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm text-fg-muted transition-colors hover:border-line-strong hover:text-fg">
                <CategoryIcon id="pc" className="size-4" /> PCs Gaming
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
