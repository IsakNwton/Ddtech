import type { ArtSpec, BoardTech, Product, StorageTech } from "../types";
import { type Art, FONT, H, MONO, W, doc, esc, ids, linear, radial } from "./core";
import { boardArt, cpuArt, gpuArt, psuArt, ramArt, sataArt, ssdArt } from "./parts";
import { headsetArt, keyboardArt, monitorArt, mouseArt } from "./peripherals";
import { aioArt, airCoolerArt, caseArt, fanArt } from "./systems";

export { HERO_HOTSPOTS, HERO_SIZE, heroArt } from "./hero";

export const ART_VIEWS = ["angle", "detail", "box"] as const;
export type ArtView = "main" | (typeof ART_VIEWS)[number];

export const VIEW_LABELS: Record<ArtView, string> = {
  main: "Vista frontal",
  angle: "Vista en ángulo",
  detail: "Detalle",
  box: "Empaque",
};

function build(spec: ArtSpec, product?: Product): Art {
  switch (spec.type) {
    case "gpu":
      return gpuArt(spec);
    case "cpu":
      return cpuArt(spec);
    case "motherboard":
      return boardArt(spec, product?.tech.kind === "motherboard" ? (product.tech as BoardTech) : undefined);
    case "ram":
      return ramArt(spec);
    case "ssd":
      return ssdArt(spec, product?.tech.kind === "storage" ? (product.tech as StorageTech) : undefined);
    case "ssd-sata":
      return sataArt(spec);
    case "psu":
      return psuArt(spec);
    case "case":
      return caseArt(spec);
    case "pc":
      return caseArt(spec, { built: true });
    case "cooler-air":
      return airCoolerArt(spec);
    case "cooler-aio":
      return aioArt(spec);
    case "fan":
      return fanArt(spec);
    case "monitor":
      return monitorArt(spec);
    case "keyboard":
      return keyboardArt(spec);
    case "mouse":
      return mouseArt(spec);
    case "headset":
      return headsetArt(spec);
  }
}

function boxView(product: Product, art: Art): string {
  const u = ids();
  const accent = product.art.accent;
  const defs =
    art.defs +
    linear(u("box"), [["0", "#1a1e24"], ["1", "#0b0c0f"]], 1, 1) +
    linear(u("side"), [["0", "#0e1013"], ["1", "#050607"]]) +
    radial(u("halo"), [["0", accent, 0.35], ["1", accent, 0]]);
  let b = "";
  b += `<path d="M 380 52 L 412 70 L 412 324 L 380 310 Z" fill="url(#${u("side")})"/>`;
  b += `<rect x="70" y="52" width="310" height="258" rx="6" fill="url(#${u("box")})" stroke="#2c3138"/>`;
  b += `<rect x="70" y="52" width="6" height="258" fill="${accent}"/>`;
  b += `<circle cx="225" cy="180" r="120" fill="url(#${u("halo")})"/>`;
  b += `<g transform="translate(225 182) scale(0.52) translate(-240 -180)">${art.body}</g>`;
  b += `<text x="92" y="84" font-family="${FONT}" font-weight="800" font-size="15" letter-spacing="1" fill="#f3f5f8">${esc(product.brand.toUpperCase())}</text>`;
  b += `<text x="92" y="286" font-family="${FONT}" font-weight="700" font-size="13" fill="#f3f5f8">${esc(product.name.length > 38 ? product.name.slice(0, 37) + "…" : product.name)}</text>`;
  b += `<text x="92" y="300" font-family="${MONO}" font-size="8" letter-spacing="2" fill="#7d8591">EMPAQUE ILUSTRATIVO · DEMO</text>`;
  return doc(b, defs, `0 0 ${W} ${H}`, `${product.name} — empaque`);
}

export function renderProductArt(product: Product, view: ArtView = "main"): string {
  const art = build(product.art, product);
  const title = `${product.brand} ${product.name}`;
  if (view === "box") return boxView(product, art);
  if (view === "detail") {
    const [x, y, w, h] = art.focus ?? [120, 90, 240, 180];
    return doc(art.body, art.defs, `${x} ${y} ${w} ${h}`, `${title} — detalle`);
  }
  if (view === "angle") {
    const g = `<g transform="translate(240 170) rotate(-7) scale(0.86) translate(-240 -180)">${art.body}</g>`;
    return doc(g, art.defs, `0 0 ${W} ${H}`, `${title} — vista en ángulo`);
  }
  return doc(art.body, art.defs, `0 0 ${W} ${H}`, title);
}

/** Arte compuesto para "Periféricos" */
export function renderPeripheralsArt(): string {
  const kb = keyboardArt({ type: "keyboard", tone: "black", accent: "#7aa7ff" });
  const ms = mouseArt({ type: "mouse", tone: "white", accent: "#7aa7ff" });
  const hs = headsetArt({ type: "headset", tone: "black", accent: "#7aa7ff", variant: 1 });
  const body =
    `<g transform="translate(150 230) scale(0.62) translate(-240 -180)">${kb.body}</g>` +
    `<g transform="translate(372 236) scale(0.4) translate(-240 -180)">${ms.body}</g>` +
    `<g transform="translate(300 128) scale(0.5) translate(-240 -180)">${hs.body}</g>`;
  return doc(body, kb.defs + ms.defs + hs.defs, `0 0 ${W} ${H}`, "Periféricos");
}

export function renderSpecArt(spec: ArtSpec, title: string): string {
  const art = build(spec);
  return doc(art.body, art.defs, `0 0 ${W} ${H}`, title);
}
