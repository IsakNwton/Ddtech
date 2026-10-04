import type { BuilderPart, CategoryId, Product, ProductSummary } from "@/lib/types";
import { discountPercent } from "@/lib/format";
import { boards } from "./products/boards";
import { cpus } from "./products/cpus";
import { gpus } from "./products/gpus";
import { drives, memory } from "./products/memory-storage";
import { fans, headsets, keyboards, mice, monitors, pcs } from "./products/peripherals";
import { cases, coolers, psus } from "./products/power-case-cooling";

export const products: Product[] = [
  ...gpus,
  ...cpus,
  ...boards,
  ...memory,
  ...drives,
  ...psus,
  ...cases,
  ...coolers,
  ...fans,
  ...monitors,
  ...keyboards,
  ...mice,
  ...headsets,
  ...pcs,
];

const bySlug = new Map(products.map((p) => [p.slug, p]));

export function getProduct(slug: string): Product | undefined {
  return bySlug.get(slug);
}

export function getProductsByCategory(category: CategoryId): Product[] {
  return products.filter((p) => p.category === category);
}

export function productImage(slug: string, view?: string): string {
  return `/art/${slug}${view ? `--${view}` : ""}.svg`;
}

export function toSummary(p: Product): ProductSummary {
  return {
    id: p.id,
    slug: p.slug,
    category: p.category,
    brand: p.brand,
    name: p.name,
    price: p.price,
    compareAt: p.compareAt,
    rating: p.rating,
    reviews: p.reviews,
    stock: p.stock,
    sold: p.sold,
    tags: p.tags,
    highlights: p.highlights,
    image: productImage(p.slug),
  };
}

export function toBuilderPart(p: Product): BuilderPart {
  return { ...toSummary(p), tech: p.tech };
}

export function summaries(list: Product[]): ProductSummary[] {
  return list.map(toSummary);
}

export function countByCategory(category: CategoryId): number {
  return products.reduce((n, p) => (p.category === category ? n + 1 : n), 0);
}

/** Ofertas: productos con precio anterior, ordenados por mayor descuento */
export function getDeals(limit?: number): Product[] {
  const list = products
    .filter((p) => p.compareAt && p.compareAt > p.price && p.stock > 0)
    .sort((a, b) => discountPercent(b.price, b.compareAt) - discountPercent(a.price, a.compareAt));
  return limit ? list.slice(0, limit) : list;
}

export function getBestSellers(limit = 10): Product[] {
  return [...products].filter((p) => p.stock > 0).sort((a, b) => b.sold - a.sold).slice(0, limit);
}

export function getNewArrivals(limit = 10): Product[] {
  return products.filter((p) => p.tags.includes("nuevo")).slice(0, limit);
}

export function getTopRated(limit = 10): Product[] {
  return [...products]
    .filter((p) => p.reviews > 40)
    .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
    .slice(0, limit);
}

export function getRelated(product: Product, limit = 8): Product[] {
  const same = products.filter((p) => p.category === product.category && p.id !== product.id);
  const sorted = same.sort((a, b) => Math.abs(a.price - product.price) - Math.abs(b.price - product.price));
  return sorted.slice(0, limit);
}

export function minPrice(category: CategoryId): number {
  return Math.min(...getProductsByCategory(category).map((p) => p.price));
}

export const builderCategories: CategoryId[] = ["cpu", "motherboard", "ram", "gpu", "storage", "psu", "case", "cooling"];
