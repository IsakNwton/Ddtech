const currency = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

const currency2 = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const integer = new Intl.NumberFormat("es-MX");

/** $12,999 */
export function formatPrice(value: number): string {
  return currency.format(value);
}

/** $1,083.25 — para mensualidades */
export function formatPriceCents(value: number): string {
  return currency2.format(value);
}

export function formatNumber(value: number): string {
  return integer.format(value);
}

export function discountPercent(price: number, compareAt?: number): number {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Normaliza para búsqueda: minúsculas, sin acentos, sin signos */
export function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, " ")
    .trim();
}

export function pluralize(n: number, one: string, many: string): string {
  return `${formatNumber(n)} ${n === 1 ? one : many}`;
}

export function stockLabel(stock: number): { label: string; tone: "ok" | "low" | "out" } {
  if (stock <= 0) return { label: "Agotado", tone: "out" };
  if (stock <= 5) return { label: `Últimas ${stock} piezas`, tone: "low" };
  return { label: "En existencia", tone: "ok" };
}
