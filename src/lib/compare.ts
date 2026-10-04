import { toSummary } from "@/data/catalog";
import type { Product, ProductSummary } from "./types";

/**
 * Datos de comparación por producto. Las filas se alinean por `key` entre productos
 * de la misma categoría; las numéricas indican qué dirección es "mejor".
 */
export interface CompareRow {
  key: string;
  label: string;
  group: string;
  display: string;
  num?: number;
  better?: "higher" | "lower";
  /** Mostrar barra relativa (p. ej. rendimiento) */
  bar?: boolean;
}

export interface ComparePayload {
  summary: ProductSummary;
  rows: CompareRow[];
  features: string[];
}

const row = (key: string, label: string, group: string, display: string, extra: Partial<CompareRow> = {}): CompareRow => ({
  key,
  label,
  group,
  display,
  ...extra,
});

export function comparePayload(p: Product): ComparePayload {
  const t = p.tech;
  const rows: CompareRow[] = [
    row("precio", "Precio (demo)", "General", `$${p.price.toLocaleString("es-MX")}`, { num: p.price, better: "lower" }),
    row("valoracion", "Valoración", "General", `${p.rating.toFixed(1)} / 5`, { num: p.rating, better: "higher" }),
    row("stock", "Disponibilidad", "General", p.stock > 0 ? (p.stock <= 5 ? `Últimas ${p.stock}` : "En existencia") : "Agotado"),
  ];
  switch (t.kind) {
    case "gpu":
      rows.push(
        row("chipset", "GPU", "Procesador gráfico", `${t.chipBrand} ${t.chipset}`),
        row("arq", "Arquitectura", "Procesador gráfico", t.architecture),
        row("boost", "Frecuencia boost", "Procesador gráfico", `${t.boostMhz.toLocaleString("es-MX")} MHz`, { num: t.boostMhz, better: "higher" }),
        row("vram", "VRAM", "Memoria", `${t.vramGb} GB`, { num: t.vramGb, better: "higher" }),
        row("memtype", "Tipo de memoria", "Memoria", t.memoryType),
        row("bus", "Bus de memoria", "Memoria", `${t.busBits} bits`, { num: t.busBits, better: "higher" }),
        row("tgp", "Consumo (TGP)", "Energía", `${t.tgp} W`, { num: t.tgp, better: "lower" }),
        row("psu", "PSU recomendada", "Energía", `${t.recommendedPsu} W`, { num: t.recommendedPsu, better: "lower" }),
        row("power", "Conector", "Energía", t.power === "12V-2x6" ? "12V-2x6 (16 pines)" : t.power),
        row("len", "Largo", "Dimensiones", `${t.lengthMm} mm`, { num: t.lengthMm, better: "lower" }),
        row("slots", "Ranuras", "Dimensiones", `${t.slots}`, { num: t.slots, better: "lower" }),
        row("perf", "Rendimiento relativo", "Rendimiento", `${t.perf}`, { num: t.perf, better: "higher", bar: true }),
        row("outputs", "Puertos", "Conectividad", t.outputs),
      );
      break;
    case "cpu":
      rows.push(
        row("socket", "Socket", "Plataforma", t.socket),
        row("cores", "Núcleos", "Rendimiento", `${t.cores}`, { num: t.cores, better: "higher" }),
        row("threads", "Hilos", "Rendimiento", `${t.threads}`, { num: t.threads, better: "higher" }),
        row("boost", "Frecuencia máx.", "Rendimiento", `${t.boostGhz} GHz`, { num: t.boostGhz, better: "higher" }),
        row("cache", "Caché", "Rendimiento", `${t.cacheMb} MB`, { num: t.cacheMb, better: "higher" }),
        row("gaming", "Índice gaming", "Rendimiento", `${t.gaming}`, { num: t.gaming, better: "higher", bar: true }),
        row("prod", "Índice productividad", "Rendimiento", `${t.productivity}`, { num: t.productivity, better: "higher", bar: true }),
        row("tdp", "TDP", "Energía", `${t.tdp} W`, { num: t.tdp, better: "lower" }),
        row("mem", "Memoria", "Plataforma", t.memory.join(" / ")),
        row("igpu", "Gráficos integrados", "Plataforma", t.igpu ? "Sí" : "No"),
        row("cooler", "Disipador incluido", "Plataforma", t.boxCooler ? "Sí" : "No"),
      );
      break;
    default:
      for (const g of p.specs) {
        for (const [label, value] of g.rows) rows.push(row(`s:${label}`, label, g.title, value));
      }
  }
  return { summary: toSummary(p), rows, features: p.features };
}
