import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { homeCategoryTiles } from "@/data/categories";
import { countByCategory } from "@/data/catalog";
import { SectionHeader } from "@/components/ui/section-header";

export function CategoryTiles() {
  return (
    <section aria-labelledby="cat-title" className="container-page">
      <SectionHeader id="cat-title" eyebrow="Categorías" title="¿Qué estás buscando?" href="/componentes" hrefLabel="Todas las categorías" />
      <ul className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-4">
        {homeCategoryTiles.map((c, i) => (
          <li key={c.href}>
            <Link
              href={c.href}
              className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-line bg-surface transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-card"
            >
              <span className="stage relative block aspect-[4/3] overflow-hidden">
                <Image
                  src={`/art/${c.art}.svg`}
                  alt=""
                  fill
                  unoptimized
                  priority={i < 4}
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-contain p-4 transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.07] sm:p-6"
                />
              </span>
              <span className="flex items-center justify-between gap-2 border-t border-line px-3.5 py-3 sm:px-4">
                <span className="min-w-0">
                  <span className="block text-[0.9375rem] font-semibold tracking-[-0.01em] text-fg">{c.label}</span>
                  <span className="block truncate text-xs text-fg-subtle">
                    {c.caption}
                    {c.id && <span className="hidden sm:inline"> · {countByCategory(c.id)}</span>}
                  </span>
                </span>
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line text-fg-subtle transition-colors duration-200 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                  <ArrowUpRight className="size-4" aria-hidden />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
