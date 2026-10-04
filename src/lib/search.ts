import { normalize } from "./format";
import type { CategoryId } from "./types";

export interface SearchDoc {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: CategoryId;
  categoryName: string;
  price: number;
  compareAt?: number;
  image: string;
  stock: number;
  sold: number;
  /** chipset / modelo clave (p. ej. "RTX 5070", "Ryzen 7 9700X") */
  model?: string;
  /** Para GPUs: NVIDIA / AMD / Intel */
  chipBrand?: string;
  haystack: string;
}

export interface SearchSuggestion {
  label: string;
  href: string;
  kind: "query" | "category" | "collection";
  hint?: string;
}

export interface SearchResult {
  suggestions: SearchSuggestion[];
  products: SearchDoc[];
  total: number;
}

const GPU_MODEL = /(RTX \d{4}(?: Ti)?|RX \d{4}(?: XT)?|Arc B\d{3})/i;

export function extractGpuModel(text: string): string | undefined {
  return text.match(GPU_MODEL)?.[1];
}

function tokens(q: string): string[] {
  return normalize(q).split(" ").filter(Boolean);
}

export function scoreDoc(doc: SearchDoc, q: string, toks: string[]): number {
  const words = doc.haystack.split(" ");
  let score = 0;
  for (const t of toks) {
    const exact = words.includes(t);
    const prefix = !exact && words.some((w) => w.startsWith(t));
    const inner = !exact && !prefix && doc.haystack.includes(t);
    if (!exact && !prefix && !inner) return 0;
    score += exact ? 12 : prefix ? 8 : 3;
  }
  const nq = normalize(q);
  const name = normalize(`${doc.brand} ${doc.name}`);
  if (name.includes(nq)) score += 20;
  if (doc.model && normalize(doc.model) === nq) score += 25;
  if (doc.model && normalize(doc.model).startsWith(nq)) score += 10;
  if (doc.category === "pc") score -= 6;
  if (doc.stock <= 0) score -= 4;
  return score + Math.min(6, doc.sold / 150);
}

export function searchDocs(docs: SearchDoc[], query: string, limit = 6): SearchResult {
  const q = query.trim();
  const toks = tokens(q);
  if (!toks.length) return { suggestions: [], products: [], total: 0 };

  const scored = docs
    .map((d) => ({ d, s: scoreDoc(d, q, toks) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s);

  const matches = scored.map((x) => x.d);
  const suggestions: SearchSuggestion[] = [];
  const seen = new Set<string>();

  // 1) Modelos (p. ej. "RTX 5070", "RTX 5070 Ti")
  const models = [...new Set(matches.filter((d) => d.model && d.category !== "pc").map((d) => d.model!))]
    .filter((m) => normalize(m).includes(normalize(q)) || toks.every((t) => normalize(m).includes(t)))
    .sort((a, b) => a.length - b.length)
    .slice(0, 3);
  for (const m of models) {
    seen.add(m);
    suggestions.push({ label: m, href: `/buscar?q=${encodeURIComponent(m)}`, kind: "query" });
  }

  // 2) Categoría filtrada (p. ej. "Tarjetas gráficas NVIDIA")
  const gpuHits = matches.filter((d) => d.category === "gpu");
  if (gpuHits.length) {
    const brands = [...new Set(gpuHits.map((d) => d.chipBrand).filter(Boolean))];
    if (brands.length === 1) {
      suggestions.push({
        label: `Tarjetas gráficas ${brands[0]}`,
        href: `/componentes/gpu?marca=${encodeURIComponent(brands[0]!)}`,
        kind: "category",
      });
    } else {
      suggestions.push({ label: "Tarjetas gráficas", href: "/componentes/gpu", kind: "category" });
    }
  } else {
    const cats = [...new Map(matches.filter((d) => d.category !== "pc").map((d) => [d.category, d.categoryName])).entries()].slice(0, 2);
    for (const [, name] of cats) {
      if (seen.has(name)) continue;
      suggestions.push({ label: name, href: `/buscar?q=${encodeURIComponent(q)}`, kind: "category" });
    }
  }

  // 3) PCs armadas con ese modelo (p. ej. "PCs con RTX 5070")
  const pcHits = matches.filter((d) => d.category === "pc" && d.model);
  const pcModels = [...new Set(pcHits.map((d) => d.model!))];
  if (pcModels.length) {
    const target = models[0] && pcModels.includes(models[0]) ? models[0] : pcModels[0];
    suggestions.push({
      label: `PCs con ${target}`,
      href: `/pcs-gaming?gpu=${encodeURIComponent(target)}`,
      kind: "collection",
    });
  }

  return { suggestions: suggestions.slice(0, 5), products: matches.slice(0, limit), total: matches.length };
}

export const POPULAR_SEARCHES = ["RTX 5070", "Ryzen 7 9800X3D", "RX 9070 XT", "SSD 2TB", "Monitor 1440p", "DDR5 32GB"];
