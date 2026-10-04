import { discountPercent, formatNumber } from "./format";
import type { Product, ProductSummary } from "./types";
import { extractGpuModel } from "./search";

/* ------------------------------------------------------------------ */
/* Definición de facetas (servidor) → metadatos serializables (cliente) */
/* ------------------------------------------------------------------ */

export interface MultiFacet {
  type: "multi";
  key: string;
  label: string;
  options: string[];
  /** Facetas largas se muestran colapsadas con "Ver más" */
  collapsed?: boolean;
}

export interface RangeFacet {
  type: "range";
  key: string;
  label: string;
  unit: "MXN" | "mm" | "W";
  min: number;
  max: number;
  step: number;
}

export type FacetMeta = MultiFacet | RangeFacet;

export interface ListingItem extends ProductSummary {
  f: Record<string, string[]>;
  n: Record<string, number>;
}

type MultiGetter = (p: Product) => string | string[] | undefined;

interface MultiDef {
  type: "multi";
  key: string;
  label: string;
  get: MultiGetter;
  sort?: "num" | "alpha" | string[];
}
interface RangeDef {
  type: "range";
  key: string;
  label: string;
  unit: RangeFacet["unit"];
  get: (p: Product) => number | undefined;
  step: number;
}
type FacetDef = MultiDef | RangeDef;

const t = <K extends Product["tech"]["kind"]>(p: Product, kind: K) =>
  p.tech.kind === kind ? (p.tech as Extract<Product["tech"], { kind: K }>) : undefined;

const brand: MultiDef = { type: "multi", key: "marca", label: "Marca", get: (p) => p.brand, sort: "alpha" };
const price: RangeDef = { type: "range", key: "precio", label: "Precio", unit: "MXN", get: (p) => p.price, step: 500 };
const generic = (key: string, label: string, facet: string): MultiDef => ({
  type: "multi",
  key,
  label,
  get: (p) => t(p, "generic")?.facets[facet],
  sort: "num",
});

const DEFS: Record<string, FacetDef[]> = {
  gpu: [
    { type: "multi", key: "marca", label: "Marca", get: (p) => t(p, "gpu")?.chipBrand, sort: ["NVIDIA", "AMD", "Intel"] },
    { type: "multi", key: "chipset", label: "Chipset", get: (p) => t(p, "gpu")?.chipset, sort: "alpha" },
    { type: "multi", key: "vram", label: "VRAM", get: (p) => (t(p, "gpu") ? `${t(p, "gpu")!.vramGb} GB` : undefined), sort: "num" },
    price,
    { type: "multi", key: "fabricante", label: "Fabricante", get: (p) => p.brand, sort: "alpha" },
    {
      type: "multi",
      key: "consumo",
      label: "Consumo",
      get: (p) => {
        const w = t(p, "gpu")?.tgp;
        if (w === undefined) return undefined;
        return w <= 200 ? "Hasta 200 W" : w <= 300 ? "201 – 300 W" : "Más de 300 W";
      },
      sort: ["Hasta 200 W", "201 – 300 W", "Más de 300 W"],
    },
    { type: "range", key: "longitud", label: "Longitud", unit: "mm", get: (p) => t(p, "gpu")?.lengthMm, step: 5 },
  ],
  cpu: [
    brand,
    { type: "multi", key: "socket", label: "Socket", get: (p) => t(p, "cpu")?.socket, sort: "alpha" },
    { type: "multi", key: "nucleos", label: "Núcleos", get: (p) => (t(p, "cpu") ? `${t(p, "cpu")!.cores} núcleos` : undefined), sort: "num" },
    price,
    { type: "multi", key: "graficos", label: "Gráficos integrados", get: (p) => (t(p, "cpu") ? (t(p, "cpu")!.igpu ? "Sí" : "No") : undefined), sort: ["Sí", "No"] },
  ],
  motherboard: [
    brand,
    { type: "multi", key: "socket", label: "Socket", get: (p) => t(p, "motherboard")?.socket, sort: "alpha" },
    { type: "multi", key: "formato", label: "Formato", get: (p) => t(p, "motherboard")?.formFactor, sort: ["ATX", "Micro-ATX", "Mini-ITX"] },
    { type: "multi", key: "memoria", label: "Memoria", get: (p) => t(p, "motherboard")?.memory, sort: "alpha" },
    { type: "multi", key: "chipset", label: "Chipset", get: (p) => t(p, "motherboard")?.chipset, sort: "alpha" },
    price,
  ],
  ram: [
    brand,
    { type: "multi", key: "tipo", label: "Tipo", get: (p) => t(p, "ram")?.memory, sort: "alpha" },
    { type: "multi", key: "capacidad", label: "Capacidad", get: (p) => (t(p, "ram") ? `${t(p, "ram")!.capacityGb} GB` : undefined), sort: "num" },
    { type: "multi", key: "velocidad", label: "Velocidad", get: (p) => (t(p, "ram") ? `${t(p, "ram")!.speed} MT/s` : undefined), sort: "num" },
    price,
  ],
  storage: [
    brand,
    { type: "multi", key: "interfaz", label: "Interfaz", get: (p) => t(p, "storage")?.interface, sort: ["NVMe Gen5", "NVMe Gen4", "SATA"] },
    {
      type: "multi",
      key: "capacidad",
      label: "Capacidad",
      get: (p) => {
        const gb = t(p, "storage")?.capacityGb;
        return gb === undefined ? undefined : gb >= 1000 ? `${gb / 1000} TB` : `${gb} GB`;
      },
      sort: "num",
    },
    price,
  ],
  psu: [
    brand,
    { type: "multi", key: "potencia", label: "Potencia", get: (p) => (t(p, "psu") ? `${t(p, "psu")!.watts} W` : undefined), sort: "num" },
    { type: "multi", key: "certificacion", label: "Certificación", get: (p) => t(p, "psu")?.efficiency, sort: "alpha" },
    { type: "multi", key: "modular", label: "Cableado", get: (p) => t(p, "psu")?.modular, sort: "alpha" },
    price,
  ],
  case: [
    brand,
    { type: "multi", key: "formato", label: "Formato soportado", get: (p) => t(p, "case")?.supports.filter((f) => f !== "E-ATX"), sort: ["ATX", "Micro-ATX", "Mini-ITX"] },
    { type: "multi", key: "color", label: "Color", get: (p) => t(p, "case")?.tone, sort: "alpha" },
    { type: "range", key: "gpu", label: "Largo máximo de GPU", unit: "mm", get: (p) => t(p, "case")?.maxGpuMm, step: 5 },
    price,
  ],
  cooling: [
    brand,
    { type: "multi", key: "tipo", label: "Tipo", get: (p) => t(p, "cooling")?.type, sort: "alpha" },
    { type: "multi", key: "socket", label: "Socket", get: (p) => t(p, "cooling")?.sockets, sort: "alpha" },
    price,
  ],
  fans: [brand, generic("tamano", "Tamaño", "Tamaño"), generic("iluminacion", "Iluminación", "Iluminación"), generic("paquete", "Paquete", "Paquete"), price],
  monitor: [brand, generic("resolucion", "Resolución", "Resolución"), generic("frecuencia", "Frecuencia", "Frecuencia"), generic("panel", "Panel", "Panel"), generic("tamano", "Tamaño", "Tamaño"), price],
  keyboard: [brand, generic("formato", "Formato", "Formato"), generic("conexion", "Conexión", "Conexión"), price],
  mouse: [brand, generic("conexion", "Conexión", "Conexión"), generic("peso", "Peso", "Peso"), price],
  headset: [brand, generic("conexion", "Conexión", "Conexión"), price],
  pc: [
    { type: "multi", key: "gpu", label: "Tarjeta gráfica", get: (p) => (t(p, "pc") ? extractGpuModel(t(p, "pc")!.gpu) : undefined), sort: "alpha" },
    { type: "multi", key: "cpu", label: "Procesador", get: (p) => t(p, "pc")?.cpu.split(" ")[0], sort: "alpha" },
    { type: "multi", key: "ram", label: "Memoria", get: (p) => t(p, "pc")?.ram, sort: "num" },
    price,
  ],
};

const CATEGORY_FACET: MultiDef = {
  type: "multi",
  key: "categoria",
  label: "Categoría",
  get: (p) => CATEGORY_NAMES[p.category],
  sort: "alpha",
};

const CATEGORY_NAMES: Record<string, string> = {
  cpu: "Procesadores",
  gpu: "Tarjetas gráficas",
  motherboard: "Tarjetas madre",
  ram: "Memoria RAM",
  storage: "Almacenamiento",
  psu: "Fuentes de poder",
  case: "Gabinetes",
  cooling: "Refrigeración",
  fans: "Ventiladores",
  monitor: "Monitores",
  keyboard: "Teclados",
  mouse: "Mouse",
  headset: "Audífonos",
  pc: "PCs Gaming",
};

const leadingNumber = (s: string) => {
  const m = s.replace(/,/g, "").match(/[\d.]+/);
  if (!m) return Number.POSITIVE_INFINITY;
  const n = parseFloat(m[0]);
  return /TB/.test(s) ? n * 1000 : n;
};

function sortOptions(values: string[], sort: MultiDef["sort"]): string[] {
  if (Array.isArray(sort)) return [...sort.filter((s) => values.includes(s)), ...values.filter((v) => !sort.includes(v))];
  if (sort === "num") return [...values].sort((a, b) => leadingNumber(a) - leadingNumber(b) || a.localeCompare(b));
  return [...values].sort((a, b) => a.localeCompare(b, "es"));
}

/** Construye items y facetas para una vista de catálogo */
export function buildListing(
  list: Product[],
  toSummary: (p: Product) => ProductSummary,
  opts: { facetsFor?: string; withCategory?: boolean } = {},
): { items: ListingItem[]; facets: FacetMeta[] } {
  const defs: FacetDef[] = [];
  if (opts.withCategory) defs.push(CATEGORY_FACET);
  if (opts.facetsFor && DEFS[opts.facetsFor]) defs.push(...DEFS[opts.facetsFor]);
  else defs.push({ ...brand }, price);

  const items: ListingItem[] = list.map((p) => {
    const f: Record<string, string[]> = {};
    const n: Record<string, number> = {};
    for (const d of defs) {
      if (d.type === "multi") {
        const v = d.get(p);
        if (v !== undefined) f[d.key] = Array.isArray(v) ? v : [v];
      } else {
        const v = d.get(p);
        if (v !== undefined) n[d.key] = v;
      }
    }
    return { ...toSummary(p), f, n };
  });

  const facets: FacetMeta[] = defs
    .map((d): FacetMeta | null => {
      if (d.type === "multi") {
        const values = [...new Set(items.flatMap((i) => i.f[d.key] ?? []))];
        if (values.length < 2) return null;
        return { type: "multi", key: d.key, label: d.label, options: sortOptions(values, d.sort), collapsed: values.length > 6 };
      }
      const nums = items.map((i) => i.n[d.key]).filter((v): v is number => v !== undefined);
      if (nums.length < 2) return null;
      const min = Math.floor(Math.min(...nums) / d.step) * d.step;
      const max = Math.ceil(Math.max(...nums) / d.step) * d.step;
      if (min === max) return null;
      return { type: "range", key: d.key, label: d.label, unit: d.unit, min, max, step: d.step };
    })
    .filter((x): x is FacetMeta => x !== null);

  return { items, facets };
}

/* ------------------------------------------------------------------ */
/* Estado de filtros ↔ URL (cliente)                                   */
/* ------------------------------------------------------------------ */

export type SortKey = "relevancia" | "precio-asc" | "precio-desc" | "mas-vendidos" | "mejor-valorados" | "descuento";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "relevancia", label: "Más relevantes" },
  { value: "precio-asc", label: "Menor precio" },
  { value: "precio-desc", label: "Mayor precio" },
  { value: "mas-vendidos", label: "Más vendidos" },
  { value: "mejor-valorados", label: "Mejor valorados" },
];

export interface FilterState {
  multi: Record<string, string[]>;
  range: Record<string, [number, number]>;
  inStock: boolean;
  sort: SortKey;
}

export function parseFilters(params: URLSearchParams, facets: FacetMeta[]): FilterState {
  const state: FilterState = { multi: {}, range: {}, inStock: params.get("disponible") === "1", sort: "relevancia" };
  const sort = params.get("orden") as SortKey | null;
  if (sort && (SORT_OPTIONS.some((o) => o.value === sort) || sort === "descuento")) state.sort = sort;
  for (const f of facets) {
    const raw = params.get(f.key);
    if (!raw) continue;
    if (f.type === "multi") {
      const vals = raw.split("|").filter((v) => f.options.includes(v));
      if (vals.length) state.multi[f.key] = vals;
    } else {
      const [a, b] = raw.split("-").map(Number);
      if (Number.isFinite(a) && Number.isFinite(b)) state.range[f.key] = [Math.max(f.min, a), Math.min(f.max, b)];
    }
  }
  return state;
}

export function serializeFilters(state: FilterState, base?: URLSearchParams): string {
  const p = new URLSearchParams();
  base?.forEach((v, k) => {
    if (k === "q") p.set(k, v);
  });
  for (const [k, vals] of Object.entries(state.multi)) if (vals.length) p.set(k, vals.join("|"));
  for (const [k, [a, b]] of Object.entries(state.range)) p.set(k, `${a}-${b}`);
  if (state.inStock) p.set("disponible", "1");
  if (state.sort !== "relevancia") p.set("orden", state.sort);
  const s = p.toString();
  return s ? `?${s}` : "";
}

function matches(item: ListingItem, state: FilterState, skipKey?: string): boolean {
  if (state.inStock && item.stock <= 0) return false;
  for (const [k, vals] of Object.entries(state.multi)) {
    if (k === skipKey || !vals.length) continue;
    const have = item.f[k];
    if (!have || !have.some((v) => vals.includes(v))) return false;
  }
  for (const [k, [a, b]] of Object.entries(state.range)) {
    if (k === skipKey) continue;
    const v = item.n[k];
    if (v === undefined || v < a || v > b) return false;
  }
  return true;
}

export function applyFilters(items: ListingItem[], state: FilterState): ListingItem[] {
  return sortItems(items.filter((i) => matches(i, state)), state.sort);
}

/** Conteos por opción considerando el resto de filtros activos (facetas "disyuntivas") */
export function facetCounts(items: ListingItem[], state: FilterState, facet: MultiFacet): Record<string, number> {
  const pool = items.filter((i) => matches(i, state, facet.key));
  const counts: Record<string, number> = {};
  for (const o of facet.options) counts[o] = 0;
  for (const i of pool) for (const v of i.f[facet.key] ?? []) if (v in counts) counts[v]++;
  return counts;
}

export function relevance(p: ProductSummary): number {
  let s = p.sold / 10 + p.rating * 10 + Math.log10(p.reviews + 1) * 8;
  if (p.tags.includes("top")) s += 20;
  if (p.tags.includes("oferta")) s += 8;
  if (p.stock <= 0) s -= 200;
  return s;
}

export function sortItems<T extends ProductSummary>(items: T[], sort: SortKey): T[] {
  const list = [...items];
  switch (sort) {
    case "precio-asc":
      return list.sort((a, b) => a.price - b.price);
    case "precio-desc":
      return list.sort((a, b) => b.price - a.price);
    case "mas-vendidos":
      return list.sort((a, b) => b.sold - a.sold);
    case "mejor-valorados":
      return list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    case "descuento":
      return list.sort((a, b) => discountPercent(b.price, b.compareAt) - discountPercent(a.price, a.compareAt));
    default:
      return list.sort((a, b) => relevance(b) - relevance(a));
  }
}

export function formatRangeValue(v: number, unit: RangeFacet["unit"]): string {
  return unit === "MXN" ? `$${formatNumber(v)}` : `${formatNumber(v)} ${unit}`;
}

export function activeFilterCount(state: FilterState): number {
  return (
    Object.values(state.multi).reduce((n, v) => n + v.length, 0) + Object.keys(state.range).length + (state.inStock ? 1 : 0)
  );
}
