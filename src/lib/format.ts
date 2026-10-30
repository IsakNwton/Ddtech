import { LOCALE } from "./site";
import type { Availability, Dimensions, Price } from "./types";

export const availabilityLabel: Record<Availability, string> = {
  disponible: "Disponible",
  reservada: "Reservada",
  vendida: "Vendida",
  "coleccion-privada": "Colección privada",
  "no-disponible": "No disponible",
};

export const availabilityOrder: Availability[] = ["disponible", "reservada", "vendida", "coleccion-privada", "no-disponible"];

const num = (n: number) => new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 1 }).format(n);

/** «80 × 120 cm» (alto × ancho), con profundidad si existe */
export function formatDimensions(d: Dimensions) {
  const base = `${num(d.height)} × ${num(d.width)}`;
  return d.depth ? `${base} × ${num(d.depth)} cm` : `${base} cm`;
}

export function formatPrice(price: Price | null, availability: Availability) {
  if (availability === "vendida" || availability === "coleccion-privada") return null;
  if (!price || !price.visible) return "Precio a consultar";
  return new Intl.NumberFormat(LOCALE, { style: "currency", currency: price.currency, maximumFractionDigits: 0 }).format(price.amount);
}

/** Divide un texto en párrafos (separados por una línea en blanco) */
export function paragraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat(LOCALE, { dateStyle: "long", timeStyle: "short" }).format(new Date(iso));
}
