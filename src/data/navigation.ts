import type { CategoryId } from "@/lib/types";
import { categories, categoryHref } from "./categories";
import { countByCategory, minPrice } from "./catalog";

export interface NavCategory {
  id: CategoryId;
  name: string;
  hint: string;
  href: string;
  art: string;
  count: number;
  from: number;
  group: "componentes" | "perifericos" | "pcs";
}

/** Datos de navegación precalculados en el servidor (ligeros para el cliente) */
export function getNavData(): NavCategory[] {
  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    hint: c.hint,
    href: categoryHref(c.id),
    art: `/art/${c.art}.svg`,
    count: countByCategory(c.id),
    from: minPrice(c.id),
    group: c.group,
  }));
}

export const PRIMARY_NAV = [
  { label: "Arma tu PC", href: "/arma-tu-pc", highlight: true },
  { label: "PCs Gaming", href: "/pcs-gaming" },
  { label: "Ofertas", href: "/ofertas" },
  { label: "Componentes", href: "/componentes", menu: "componentes" as const },
  { label: "Periféricos", href: "/perifericos", menu: "perifericos" as const },
  { label: "Soporte", href: "/soporte" },
];
