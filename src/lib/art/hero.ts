import { FONT, MONO, blurFilter, ids, linear, radial } from "./core";

/**
 * Ilustración principal del hero: PC armada vista a través del cristal lateral.
 * Coordenadas conocidas → los "hotspots" del hero se posicionan con precisión.
 */
export const HERO_SIZE = { w: 600, h: 640 };

export const HERO_HOTSPOTS = [
  { id: "cpu", label: "Procesador", x: 332, y: 176, href: "/componentes/cpu" },
  { id: "ram", label: "Memoria RAM", x: 412, y: 200, href: "/componentes/memoria-ram" },
  { id: "gpu", label: "Tarjeta gráfica", x: 300, y: 331, href: "/componentes/gpu" },
  { id: "cooling", label: "Refrigeración", x: 300, y: 70, href: "/componentes/enfriamiento" },
  { id: "psu", label: "Fuente de poder", x: 214, y: 520, href: "/componentes/fuentes-de-poder" },
  { id: "case", label: "Gabinete", x: 124, y: 330, href: "/componentes/gabinetes" },
] as const;

export function heroArt(accent = "#4d7cff"): string {
  const u = ids();
  const x = 90;
  const y = 40;
  const w = 420;
  const h = 540;
  const gx = 162;
  const gy = 56;
  const gw = 332;
  const gh = 508;

  const defs =
    linear(u("frame"), [["0", "#2b3039"], ["0.5", "#171a1f"], ["1", "#0c0e11"]], 1, 1) +
    linear(u("glass"), [["0", "#0b0e13", 0.94], ["1", "#050608", 0.97]], 0.4, 1) +
    radial(u("ambient"), [["0", accent, 0.42], ["0.55", accent, 0.08], ["1", accent, 0]], 0.5, 0.42, 0.6) +
    radial(u("floor"), [["0", accent, 0.35], ["1", accent, 0]]) +
    linear(u("refl"), [["0", "#fff", 0], ["0.42", "#fff", 0], ["0.47", "#fff", 0.08], ["0.6", "#fff", 0]], 1, 1) +
    linear(u("mb"), [["0", "#16191e"], ["1", "#0d0f12"]]) +
    linear(u("hs"), [["0", "#4b525d"], ["1", "#1d2127"]], 1, 1) +
    linear(u("gpu"), [["0", "#333943"], ["0.5", "#1a1d22"], ["1", "#0c0d10"]]) +
    linear(u("ram"), [["0", "#2f343c"], ["1", "#14161a"]]) +
    linear(u("rgb"), [["0", accent], ["0.5", "#ffffff"], ["1", accent]]) +
    linear(u("mesh"), [["0", "#1d2127"], ["1", "#0b0c0f"]]) +
    linear(u("shroud"), [["0", "#1f2329"], ["1", "#111317"]]) +
    linear(u("tube"), [["0", "#2a2e35"], ["1", "#0d0f12"]], 1, 0) +
    blurFilter(u("glow"), 7) +
    blurFilter(u("soft"), 22);

  let b = "";
  // Luz ambiental y piso
  b += `<ellipse cx="300" cy="600" rx="250" ry="26" fill="url(#${u("floor")})" filter="url(#${u("soft")})"/>`;
  b += `<ellipse cx="300" cy="592" rx="200" ry="10" fill="#000" opacity="0.6" filter="url(#${u("glow")})"/>`;
  // Patas
  b += `<rect x="${x + 26}" y="${y + h - 4}" width="54" height="12" rx="4" fill="#0b0c0f"/>`;
  b += `<rect x="${x + w - 80}" y="${y + h - 4}" width="54" height="12" rx="4" fill="#0b0c0f"/>`;
  // Chasis
  b += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="url(#${u("frame")})" stroke="#3c424c" stroke-opacity="0.8"/>`;
  b += `<rect x="${x + 1}" y="${y + 1}" width="${w - 2}" height="6" rx="3" fill="#fff" opacity="0.05"/>`;
  // Frente con malla
  b += `<rect x="${x + 8}" y="${y + 16}" width="54" height="${h - 32}" rx="9" fill="url(#${u("mesh")})"/>`;
  for (let r = 0; r < 52; r++) {
    for (let c = 0; c < 5; c++) {
      b += `<circle cx="${x + 17 + c * 9 + (r % 2) * 4.5}" cy="${y + 28 + r * 9.6}" r="2" fill="#050607" opacity="0.9"/>`;
    }
  }
  b += `<rect x="${x + 60}" y="${y + 60}" width="2" height="${h - 120}" rx="1" fill="${accent}" opacity="0.6" filter="url(#${u("glow")})"/>`;
  b += `<rect x="${x + 60}" y="${y + 60}" width="1.5" height="${h - 120}" rx="1" fill="${accent}" opacity="0.85"/>`;
  // Cristal
  b += `<rect x="${gx}" y="${gy}" width="${gw}" height="${gh}" rx="8" fill="url(#${u("glass")})"/>`;
  b += `<rect x="${gx}" y="${gy}" width="${gw}" height="${gh}" rx="8" fill="url(#${u("ambient")})"/>`;
  // Tarjeta madre
  const mx = gx + 70;
  const my = gy + 24;
  b += `<rect x="${mx}" y="${my}" width="240" height="306" rx="4" fill="url(#${u("mb")})" stroke="#252a31"/>`;
  for (let i = 0; i < 9; i++) {
    b += `<path d="M ${mx + 10} ${my + 30 + i * 30} h ${30 + (i % 4) * 16} l 12 12 h 50" fill="none" stroke="#20252c" stroke-width="1.2"/>`;
  }
  b += `<rect x="${mx + 8}" y="${my + 10}" width="44" height="120" rx="5" fill="url(#${u("hs")})"/>`;
  b += `<path d="M ${mx + 16} ${my + 26} l 28 28" stroke="${accent}" stroke-width="2"/>`;
  b += `<rect x="${mx + 60}" y="${my + 10}" width="130" height="30" rx="5" fill="url(#${u("hs")})"/>`;
  // M.2
  b += `<rect x="${mx + 30}" y="${my + 226}" width="150" height="22" rx="4" fill="url(#${u("hs")})"/>`;
  b += `<path d="M ${mx + 40} ${my + 237} h 90" stroke="${accent}" stroke-width="1.6" opacity="0.8"/>`;
  // Chipset
  b += `<path d="M ${mx + 170} ${my + 250} h 62 v 48 h -46 l -16 -16 Z" fill="url(#${u("hs")})"/>`;
  // RAM
  for (let i = 0; i < 4; i++) {
    const rx = gx + 232 + i * 12;
    b += `<rect x="${rx}" y="${gy + 72}" width="8" height="128" rx="2" fill="url(#${u("ram")})" stroke="#353b44"/>`;
    b += `<rect x="${rx}" y="${gy + 66}" width="8" height="12" rx="2" fill="url(#${u("rgb")})" filter="url(#${u("glow")})" opacity="0.9"/>`;
    b += `<rect x="${rx}" y="${gy + 66}" width="8" height="12" rx="2" fill="url(#${u("rgb")})"/>`;
  }
  // Radiador superior
  b += `<rect x="${gx + 54}" y="${gy + 6}" width="250" height="26" rx="5" fill="#1b1f25" stroke="#2f343c"/>`;
  for (let i = 0; i < 3; i++) {
    b += `<rect x="${gx + 64 + i * 80}" y="${gy + 28}" width="70" height="3" rx="1.5" fill="${accent}" filter="url(#${u("glow")})" opacity="0.8"/>`;
    b += `<rect x="${gx + 64 + i * 80}" y="${gy + 28}" width="70" height="2" rx="1" fill="${accent}"/>`;
  }
  // Mangueras
  b += `<path d="M ${gx + 270} ${gy + 32} C ${gx + 270} ${gy + 80}, ${gx + 205} ${gy + 70}, ${gx + 190} ${gy + 100}" fill="none" stroke="url(#${u("tube")})" stroke-width="11" stroke-linecap="round"/>`;
  b += `<path d="M ${gx + 288} ${gy + 32} C ${gx + 290} ${gy + 96}, ${gx + 220} ${gy + 92}, ${gx + 200} ${gy + 112}" fill="none" stroke="url(#${u("tube")})" stroke-width="11" stroke-linecap="round"/>`;
  // Bomba sobre CPU
  b += `<circle cx="332" cy="176" r="40" fill="#14171b" stroke="#353b44"/>`;
  b += `<circle cx="332" cy="176" r="31" fill="#050608"/>`;
  b += `<circle cx="332" cy="176" r="30" fill="none" stroke="${accent}" stroke-width="3" filter="url(#${u("glow")})"/>`;
  b += `<circle cx="332" cy="176" r="30" fill="none" stroke="${accent}" stroke-width="1.6"/>`;
  b += `<text x="332" y="181" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="13" fill="#e9edf3">DD</text>`;
  // GPU
  const gpx = gx + 40;
  const gpy = gy + 250;
  b += `<rect x="${gpx - 8}" y="${gpy - 6}" width="12" height="64" rx="2" fill="#9aa1ab"/>`;
  b += `<path d="M ${gpx} ${gpy} H ${gpx + 248} L ${gpx + 268} ${gpy + 16} V ${gpy + 50} H ${gpx + 10} L ${gpx} ${gpy + 40} Z" fill="url(#${u("gpu")})" stroke="#3c424c"/>`;
  b += `<rect x="${gpx + 20}" y="${gpy + 42}" width="220" height="3" rx="1.5" fill="${accent}" filter="url(#${u("glow")})"/>`;
  b += `<rect x="${gpx + 20}" y="${gpy + 42}" width="220" height="2" rx="1" fill="${accent}"/>`;
  b += `<text x="${gpx + 236}" y="${gpy + 30}" text-anchor="end" font-family="${MONO}" font-size="11" letter-spacing="3" fill="#c4cad3">RTX 5070</text>`;
  b += `<path d="M ${gpx + 22} ${gpy + 12} h 60" stroke="#596170" stroke-width="2"/>`;
  // Ventiladores frontales (de canto)
  for (let i = 0; i < 3; i++) {
    const fy = gy + 40 + i * 132;
    b += `<rect x="${gx + 8}" y="${fy}" width="22" height="120" rx="4" fill="#15181d" stroke="#2c3138"/>`;
    b += `<rect x="${gx + 28}" y="${fy + 8}" width="3" height="104" rx="1.5" fill="${accent}" filter="url(#${u("glow")})"/>`;
    b += `<rect x="${gx + 28}" y="${fy + 8}" width="2" height="104" rx="1" fill="${accent}"/>`;
  }
  // Ventilador trasero
  b += `<rect x="${gx + gw - 24}" y="${gy + 60}" width="16" height="110" rx="4" fill="#15181d" stroke="#2c3138"/>`;
  b += `<rect x="${gx + gw - 26}" y="${gy + 66}" width="2.5" height="98" rx="1" fill="${accent}" opacity="0.8"/>`;
  // Cables
  b += `<path d="M ${mx + 236} ${my + 90} C ${mx + 262} ${my + 100}, ${mx + 262} ${my + 300}, ${mx + 220} ${my + 380}" fill="none" stroke="#0e1013" stroke-width="10" stroke-linecap="round"/>`;
  // Cubierta de la fuente
  const sy = gy + gh - 112;
  b += `<rect x="${gx + 6}" y="${sy}" width="${gw - 12}" height="104" rx="6" fill="url(#${u("shroud")})" stroke="#2a2f36"/>`;
  b += `<rect x="${gx + 6}" y="${sy}" width="${gw - 12}" height="1.5" fill="#fff" opacity="0.06"/>`;
  for (let i = 0; i < 9; i++) {
    b += `<rect x="${gx + 30 + i * 9}" y="${sy + 30}" width="4" height="44" rx="2" fill="#0a0b0d"/>`;
  }
  b += `<text x="${gx + gw - 30}" y="${sy + 58}" text-anchor="end" font-family="${FONT}" font-weight="800" font-size="20" letter-spacing="-0.4" fill="#eef1f5" opacity="0.9">DDTech</text>`;
  b += `<text x="${gx + gw - 30}" y="${sy + 74}" text-anchor="end" font-family="${MONO}" font-size="8" letter-spacing="2.6" fill="#7d8591">CONCEPT BUILD</text>`;
  // Reflejo del cristal
  b += `<rect x="${gx}" y="${gy}" width="${gw}" height="${gh}" rx="8" fill="url(#${u("refl")})"/>`;
  b += `<rect x="${gx}" y="${gy}" width="${gw}" height="${gh}" rx="8" fill="none" stroke="#fff" stroke-opacity="0.08"/>`;
  // Botón de encendido
  b += `<rect x="${x + 140}" y="${y - 3}" width="34" height="5" rx="2.5" fill="${accent}"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${HERO_SIZE.w} ${HERO_SIZE.h}" width="${HERO_SIZE.w}" height="${HERO_SIZE.h}" role="img" aria-label="PC gaming armada vista a través del cristal lateral"><defs>${defs}</defs>${b}</svg>`;
}
