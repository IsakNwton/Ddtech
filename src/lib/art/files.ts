import { getProduct, products } from "@/data/catalog";
import { ART_VIEWS, type ArtView, heroArt, renderPeripheralsArt, renderProductArt } from "./index";

/** Producto representativo de cada categoría */
const CATEGORY_ART: Record<string, string> = {
  "cat-cpu": "amd-ryzen-7-9700x",
  "cat-gpu": "msi-geforce-rtx-5070-ti-16g-gaming-trio-oc",
  "cat-motherboard": "msi-mag-x870-tomahawk-wifi",
  "cat-ram": "corsair-vengeance-rgb-32gb-2x16gb-ddr5-6000-cl36",
  "cat-storage": "samsung-990-pro-1tb-nvme-m-2",
  "cat-psu": "corsair-rm850x-850w-80-plus-gold-atx-3-1",
  "cat-case": "lian-li-o11-dynamic-evo-blanco",
  "cat-cooling": "arctic-liquid-freezer-iii-pro-360",
  "cat-fans": "lian-li-uni-fan-sl-inf-120-argb-3-piezas",
  "cat-monitor": "lg-ultragear-oled-27-qhd-240-hz",
  "cat-keyboard": "hyperx-alloy-origins-core",
  "cat-mouse": "logitech-g-pro-x-superlight-2",
  "cat-headset": "hyperx-cloud-iii",
  "cat-pc": "serie-apex-pc-gaming-apex-ryzen-7-9800x3d-rtx-5070-ti",
};

/** Lista de todos los archivos de arte para generación estática */
export function allArtFiles(): string[] {
  const files: string[] = ["hero-pc.svg", "cat-peripherals.svg", ...Object.keys(CATEGORY_ART).map((k) => `${k}.svg`)];
  for (const p of products) {
    files.push(`${p.slug}.svg`);
    for (const v of ART_VIEWS) files.push(`${p.slug}--${v}.svg`);
  }
  return files;
}

export function renderArtFile(file: string): string | null {
  if (!file.endsWith(".svg")) return null;
  const name = file.slice(0, -4);
  if (name === "hero-pc") return heroArt();
  if (name === "cat-peripherals") return renderPeripheralsArt();
  if (CATEGORY_ART[name]) {
    const p = getProduct(CATEGORY_ART[name]);
    return p ? renderProductArt(p) : null;
  }
  const [slug, view] = name.split("--");
  const product = getProduct(slug);
  if (!product) return null;
  if (view && !(ART_VIEWS as readonly string[]).includes(view)) return null;
  return renderProductArt(product, (view as ArtView) ?? "main");
}
