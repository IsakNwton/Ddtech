import { normalize } from "@/lib/format";
import { extractGpuModel, type SearchDoc } from "@/lib/search";
import type { Product } from "@/lib/types";
import { getCategory } from "./categories";
import { productImage, products } from "./catalog";

function modelOf(p: Product): string | undefined {
  switch (p.tech.kind) {
    case "gpu":
      return p.tech.chipset;
    case "cpu":
      return p.name;
    case "pc":
      return extractGpuModel(p.tech.gpu);
    default:
      return undefined;
  }
}

export function buildSearchIndex(): SearchDoc[] {
  return products.map((p) => {
    const cat = getCategory(p.category);
    const extra =
      p.tech.kind === "gpu"
        ? `${p.tech.chipBrand} geforce radeon ${p.tech.vramGb}gb ${p.tech.memoryType} grafica video`
        : p.tech.kind === "pc"
          ? `${p.tech.cpu} ${p.tech.gpu} ${p.tech.ram} pc computadora gamer armada`
          : p.tech.kind === "generic"
            ? Object.values(p.tech.facets).join(" ")
            : "";
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      brand: p.brand,
      category: p.category,
      categoryName: cat.name,
      price: p.price,
      compareAt: p.compareAt,
      image: productImage(p.slug),
      stock: p.stock,
      sold: p.sold,
      model: modelOf(p),
      chipBrand: p.tech.kind === "gpu" ? p.tech.chipBrand : undefined,
      haystack: normalize(`${p.brand} ${p.name} ${cat.name} ${cat.shortName} ${cat.singular} ${p.highlights.join(" ")} ${extra}`),
    };
  });
}
