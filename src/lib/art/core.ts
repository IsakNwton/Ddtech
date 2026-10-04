import type { ArtTone } from "../types";

/**
 * Primitivas del sistema de ilustración de producto.
 * Cada ilustración es un SVG autocontenido (480×360) servido como imagen estática,
 * lo que permite lazy loading, caché inmutable y sustitución directa por fotografía real.
 */

export const W = 480;
export const H = 360;

export interface Tone {
  b1: string;
  b2: string;
  edge: string;
  deep: string;
  text: string;
  muted: string;
  m1: string;
  m2: string;
}

export const tones: Record<ArtTone, Tone> = {
  black: { b1: "#2a2f37", b2: "#121418", edge: "#454b55", deep: "#0a0b0e", text: "#d5dae1", muted: "#7d8591", m1: "#6b727d", m2: "#2b3038" },
  gunmetal: { b1: "#434a55", b2: "#1d2128", edge: "#636b77", deep: "#121519", text: "#e6e9ee", muted: "#8b939e", m1: "#8a919c", m2: "#363c45" },
  silver: { b1: "#eef0f3", b2: "#a3aab4", edge: "#ffffff", deep: "#2a2e35", text: "#1f2329", muted: "#5d646e", m1: "#f4f5f7", m2: "#9ba2ac" },
  white: { b1: "#ffffff", b2: "#d9dde3", edge: "#ffffff", deep: "#b9c0ca", text: "#2a2f36", muted: "#7a828d", m1: "#ffffff", m2: "#c6ccd4" },
};

export const FONT = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
export const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

export function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

let uid = 0;
/** Prefijo único por documento para ids de gradientes */
export function ids() {
  uid = (uid + 1) % 100000;
  const p = `a${uid}`;
  return (name: string) => `${p}${name}`;
}

export function linear(id: string, stops: [string, string, number?][], x2 = 0, y2 = 1): string {
  return `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops
    .map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a !== undefined ? ` stop-opacity="${a}"` : ""}/>`)
    .join("")}</linearGradient>`;
}

export function radial(id: string, stops: [string, string, number?][], cx = 0.5, cy = 0.5, r = 0.5): string {
  return `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops
    .map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a !== undefined ? ` stop-opacity="${a}"` : ""}/>`)
    .join("")}</radialGradient>`;
}

export function blurFilter(id: string, std: number): string {
  return `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${std}"/></filter>`;
}

/** Sombra de contacto sobre el "piso" */
export function floorShadow(u: (n: string) => string, cx: number, cy: number, rx: number, ry = 10): { defs: string; body: string } {
  return {
    defs: blurFilter(u("fs"), 9) + radial(u("fsg"), [["0", "#000", 0.75], ["1", "#000", 0]]),
    body: `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${u("fsg")})" filter="url(#${u("fs")})"/>`,
  };
}

/** Ventilador visto de frente */
export function fan(
  u: (n: string) => string,
  key: string,
  cx: number,
  cy: number,
  r: number,
  t: Tone,
  opts: { accent?: string; rgb?: boolean; blades?: number; hubAccent?: boolean } = {},
): { defs: string; body: string } {
  const blades = opts.blades ?? 9;
  const hub = r * 0.3;
  const g = u(`fan${key}`);
  const bg = u(`fanb${key}`);
  const hg = u(`fanh${key}`);
  const glow = u(`fanglow${key}`);
  const dark = t === tones.white || t === tones.silver;
  const bladeFill = dark ? ["#3a4048", "#1e2228"] : ["#353b44", "#16191e"];
  const defs =
    radial(g, [["0", "#000", 0.0], ["0.75", "#000", 0.35], ["1", "#000", 0.65]]) +
    linear(bg, [["0", bladeFill[0]], ["1", bladeFill[1]]], 1, 1) +
    linear(hg, [["0", t.m1], ["1", t.m2]], 0.6, 1) +
    (opts.rgb ? blurFilter(glow, 4) : "");
  const bladePath = `M ${hub * 0.9} ${-hub * 0.25} C ${r * 0.42} ${-r * 0.42}, ${r * 0.72} ${-r * 0.5}, ${r * 0.93} ${-r * 0.2} C ${r * 0.8} ${r * 0.02}, ${r * 0.52} ${r * 0.1}, ${hub * 0.95} ${hub * 0.35} Z`;
  let b = `<g transform="translate(${cx} ${cy})">`;
  b += `<circle r="${r}" fill="${t.deep}"/>`;
  if (opts.rgb && opts.accent) {
    b += `<circle r="${r * 0.97}" fill="none" stroke="${opts.accent}" stroke-width="5" opacity="0.85" filter="url(#${glow})"/>`;
    b += `<circle r="${r * 0.97}" fill="none" stroke="${opts.accent}" stroke-width="1.6"/>`;
  }
  b += `<circle r="${r * 0.94}" fill="#0c0e11"/>`;
  for (let i = 0; i < blades; i++) {
    b += `<path d="${bladePath}" fill="url(#${bg})" stroke="#4a515b" stroke-opacity="0.35" stroke-width="0.8" transform="rotate(${(360 / blades) * i})"/>`;
  }
  b += `<circle r="${r * 0.94}" fill="url(#${g})"/>`;
  b += `<circle r="${hub}" fill="url(#${hg})" stroke="${t.edge}" stroke-opacity="0.5"/>`;
  if (opts.hubAccent !== false && opts.accent) {
    b += `<circle r="${hub * 0.42}" fill="none" stroke="${opts.accent}" stroke-width="1.6" opacity="0.9"/>`;
  }
  b += `<circle r="${r}" fill="none" stroke="${t.edge}" stroke-opacity="0.35" stroke-width="1.2"/>`;
  b += `</g>`;
  return { defs, body: b };
}

export function doc(inner: string, defs: string, viewBox = `0 0 ${W} ${H}`, title?: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${W}" height="${H}" role="img"${title ? ` aria-label="${esc(title)}"` : ""}>${title ? `<title>${esc(title)}</title>` : ""}<defs>${defs}</defs>${inner}</svg>`;
}

export interface Art {
  defs: string;
  body: string;
  /** Recorte para la vista de detalle */
  focus?: [number, number, number, number];
}
