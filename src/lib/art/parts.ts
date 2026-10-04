import type { ArtSpec, BoardTech, StorageTech } from "../types";
import { type Art, FONT, MONO, esc, fan, floorShadow, ids, linear, blurFilter, tones } from "./core";

/* ------------------------------------------------------------------ */
/* GPU                                                                 */
/* ------------------------------------------------------------------ */
export function gpuArt(a: ArtSpec): Art {
  const u = ids();
  const t = tones[a.tone];
  const n = a.fans ?? 2;
  const Wd = n === 3 ? 404 : 336;
  const Ht = 150;
  const x0 = (480 - Wd) / 2 + 10;
  const y0 = 92;
  const v = a.variant ?? 0;

  let defs =
    linear(u("body"), [["0", t.b1], ["0.55", t.b2], ["1", t.deep]]) +
    linear(u("top"), [["0", t.edge], ["1", t.b2]]) +
    linear(u("brk"), [["0", "#e9ecf0"], ["0.5", "#9aa1ab"], ["1", "#cfd4da"]], 1, 0) +
    linear(u("gold"), [["0", "#f3d27a"], ["1", "#a77d2a"]]) +
    linear(u("sheen"), [["0", "#fff", 0.1], ["0.4", "#fff", 0], ["1", "#fff", 0]], 0.3, 1) +
    blurFilter(u("glow"), 6);

  const shadow = floorShadow(u, 240, y0 + Ht + 34, Wd / 2, 9);
  defs += shadow.defs;

  let b = shadow.body;
  // Grosor superior (backplate) con tira RGB opcional
  b += `<path d="M ${x0 + 16} ${y0 - 10} L ${x0 + Wd - 34} ${y0 - 10} L ${x0 + Wd - 6} ${y0 + 12} L ${x0 + Wd} ${y0 + 20} L ${x0} ${y0 + 20} L ${x0} ${y0 + 4} Z" fill="url(#${u("top")})" opacity="0.55"/>`;
  if (a.rgb) {
    b += `<rect x="${x0 + 40}" y="${y0 - 8}" width="${Wd - 110}" height="4" rx="2" fill="${a.accent}" filter="url(#${u("glow")})" opacity="0.9"/>`;
    b += `<rect x="${x0 + 40}" y="${y0 - 8}" width="${Wd - 110}" height="3" rx="1.5" fill="${a.accent}"/>`;
  }
  // Conector de energía
  b += `<rect x="${x0 + Wd * 0.62}" y="${y0 - 17}" width="30" height="9" rx="2" fill="#0b0c0f" stroke="#2c3138"/>`;
  // Bracket
  b += `<rect x="${x0 - 22}" y="${y0 - 8}" width="16" height="${Ht + 24}" rx="2" fill="url(#${u("brk")})"/>`;
  for (let i = 0; i < 6; i++) {
    b += `<rect x="${x0 - 18}" y="${y0 + 8 + i * 22}" width="8" height="14" rx="2" fill="#3c424b" opacity="0.65"/>`;
  }
  // PCIe
  b += `<rect x="${x0 + 46}" y="${y0 + Ht - 2}" width="182" height="13" rx="1.5" fill="url(#${u("gold")})"/>`;
  b += `<rect x="${x0 + 92}" y="${y0 + Ht - 2}" width="5" height="13" fill="#0b0c0f"/>`;
  for (let i = 0; i < 34; i++) {
    b += `<rect x="${x0 + 50 + i * 5.2}" y="${y0 + Ht + 3}" width="0.9" height="7" fill="#7a5a17" opacity="0.6"/>`;
  }
  // Cubierta con esquinas biseladas
  const c = 22;
  b += `<path d="M ${x0 + c} ${y0} L ${x0 + Wd - 40} ${y0} L ${x0 + Wd} ${y0 + 34} L ${x0 + Wd} ${y0 + Ht - 14} L ${x0 + Wd - 14} ${y0 + Ht} L ${x0 + 14} ${y0 + Ht} L ${x0} ${y0 + Ht - 14} L ${x0} ${y0 + c} Z" fill="url(#${u("body")})" stroke="${t.edge}" stroke-opacity="0.55" stroke-width="1.4"/>`;
  b += `<path d="M ${x0 + c} ${y0} L ${x0 + Wd - 40} ${y0} L ${x0 + Wd} ${y0 + 34} L ${x0 + Wd} ${y0 + Ht - 14} L ${x0 + Wd - 14} ${y0 + Ht} L ${x0 + 14} ${y0 + Ht} L ${x0} ${y0 + Ht - 14} L ${x0} ${y0 + c} Z" fill="url(#${u("sheen")})"/>`;

  // Detalles de diseño según variante
  const accentLine = (x1: number, y1: number, x2: number, y2: number, w = 2) =>
    `<path d="M ${x1} ${y1} L ${x2} ${y2}" stroke="${a.accent}" stroke-width="${w}" stroke-linecap="round"/>`;
  if (v % 3 === 0) {
    b += accentLine(x0 + 30, y0 + 9, x0 + Wd * 0.45, y0 + 9);
    b += accentLine(x0 + Wd - 30, y0 + Ht - 9, x0 + Wd * 0.62, y0 + Ht - 9);
  } else if (v % 3 === 1) {
    b += accentLine(x0 + Wd - 52, y0 + 6, x0 + Wd - 8, y0 + 40, 2.4);
    b += accentLine(x0 + 8, y0 + Ht - 40, x0 + 46, y0 + Ht - 6, 2.4);
  } else {
    b += `<rect x="${x0 + 18}" y="${y0 + 6}" width="${Wd - 70}" height="2" rx="1" fill="${a.accent}" opacity="0.85"/>`;
    b += `<rect x="${x0 + 18}" y="${y0 + Ht - 8}" width="${Wd - 36}" height="2" rx="1" fill="${t.edge}" opacity="0.4"/>`;
  }

  // Ventiladores
  const r = n === 3 ? 56 : 60;
  const gap = Wd / n;
  for (let i = 0; i < n; i++) {
    const cx = x0 + gap * i + gap / 2;
    const cy = y0 + Ht / 2 - 6;
    b += `<circle cx="${cx}" cy="${cy}" r="${r + 5}" fill="${t.deep}" opacity="0.55"/>`;
    const f = fan(u, `${i}`, cx, cy, r, t, { accent: a.accent, rgb: a.rgb && i === n - 1 });
    defs += f.defs;
    b += f.body;
  }

  // Serigrafía
  if (a.label) {
    b += `<text x="${x0 + Wd - 22}" y="${y0 + Ht - 13}" text-anchor="end" font-family="${MONO}" font-size="10" letter-spacing="1.6" fill="${t.text}" opacity="0.72">${esc(a.label)}</text>`;
  }
  return { defs, body: b, focus: [x0 + 10, y0 - 20, 240, 180] };
}

/* ------------------------------------------------------------------ */
/* CPU                                                                 */
/* ------------------------------------------------------------------ */
export function cpuArt(a: ArtSpec): Art {
  const u = ids();
  const intel = (a.variant ?? 0) >= 10;
  const S = 236;
  const x = 240 - S / 2;
  const y = 52;
  let defs =
    linear(u("sub"), intel ? [["0", "#1e3a2c"], ["1", "#0f2219"]] : [["0", "#1d4a33"], ["1", "#113221"]]) +
    linear(u("ihs"), [["0", "#f5f6f8"], ["0.35", "#c9ced6"], ["0.65", "#e6e9ed"], ["1", "#a2a9b3"]], 1, 1) +
    linear(u("brush"), [["0", "#fff", 0.0], ["0.5", "#fff", 0.35], ["1", "#fff", 0]], 1, 0.2);
  const shadow = floorShadow(u, 240, y + S + 26, S / 2 + 10, 9);
  defs += shadow.defs;
  let b = shadow.body;
  // Sustrato
  b += `<rect x="${x}" y="${y}" width="${S}" height="${S}" rx="10" fill="url(#${u("sub")})" stroke="#2f6b4a" stroke-opacity="0.6"/>`;
  // Componentes SMD en los bordes
  for (let i = 0; i < 14; i++) {
    b += `<rect x="${x + 22 + i * 14}" y="${y + 8}" width="6" height="3" rx="0.6" fill="#c9a54a" opacity="0.85"/>`;
    b += `<rect x="${x + 22 + i * 14}" y="${y + S - 11}" width="6" height="3" rx="0.6" fill="#c9a54a" opacity="0.85"/>`;
  }
  // Triángulo indicador
  b += `<path d="M ${x + 8} ${y + S - 8} l 16 0 l -16 -16 Z" fill="#d4af37"/>`;

  // IHS
  if (intel) {
    const ix = x + 26;
    const iy = y + 18;
    const iw = S - 52;
    const ih = S - 36;
    b += `<rect x="${ix - 12}" y="${iy + 30}" width="${iw + 24}" height="${ih - 60}" rx="6" fill="url(#${u("ihs")})" stroke="#7f8792" stroke-opacity="0.6"/>`;
    b += `<rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" rx="10" fill="url(#${u("ihs")})" stroke="#7f8792" stroke-opacity="0.6"/>`;
    b += `<rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" rx="10" fill="url(#${u("brush")})"/>`;
  } else {
    const ix = x + 20;
    const iy = y + 20;
    const iw = S - 40;
    const notch = 22;
    const path = `M ${ix + 10} ${iy} H ${ix + iw - 10} Q ${ix + iw} ${iy} ${ix + iw} ${iy + 10}
      V ${iy + 46} H ${ix + iw - notch} V ${iy + 76} H ${ix + iw} V ${iy + iw - 76} H ${ix + iw - notch} V ${iy + iw - 46} H ${ix + iw}
      V ${iy + iw - 10} Q ${ix + iw} ${iy + iw} ${ix + iw - 10} ${iy + iw} H ${ix + 10} Q ${ix} ${iy + iw} ${ix} ${iy + iw - 10}
      V ${iy + iw - 46} H ${ix + notch} V ${iy + iw - 76} H ${ix} V ${iy + 76} H ${ix + notch} V ${iy + 46} H ${ix} V ${iy + 10} Q ${ix} ${iy} ${ix + 10} ${iy} Z`;
    b += `<path d="${path}" fill="url(#${u("ihs")})" stroke="#7f8792" stroke-opacity="0.6"/>`;
    b += `<path d="${path}" fill="url(#${u("brush")})"/>`;
  }
  // Marca y modelo
  b += `<rect x="${x + 56}" y="${y + 64}" width="14" height="14" rx="3" fill="${a.accent}"/>`;
  if (a.label) {
    b += `<text x="${x + 78}" y="${y + 76}" font-family="${FONT}" font-weight="700" font-size="14" letter-spacing="2" fill="#2a2e35">${esc(a.label)}</text>`;
  }
  if (a.sublabel) {
    b += `<text x="240" y="${y + 140}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${Math.min(40, 250 / a.sublabel.length).toFixed(1)}" letter-spacing="-0.5" fill="#1f2329">${esc(a.sublabel)}</text>`;
  }
  b += `<text x="240" y="${y + 172}" text-anchor="middle" font-family="${MONO}" font-size="9" letter-spacing="2.4" fill="#4b525c">DEMO · ${intel ? "LGA" : "AM"} PLATFORM</text>`;
  return { defs, body: b, focus: [x + 30, y + 40, 200, 150] };
}

/* ------------------------------------------------------------------ */
/* Tarjeta madre                                                       */
/* ------------------------------------------------------------------ */
export function boardArt(a: ArtSpec, tech?: BoardTech): Art {
  const u = ids();
  const t = tones[a.tone];
  const ff = tech?.formFactor ?? "ATX";
  const Bw = ff === "Mini-ITX" ? 220 : 250;
  const Bh = ff === "ATX" ? 300 : ff === "Micro-ATX" ? 260 : 220;
  const x = 240 - Bw / 2;
  const y = (360 - Bh) / 2 - 6;
  const white = a.tone === "white";
  const pcb = white ? ["#e9ecf0", "#c9ced6"] : ["#1b1f25", "#0e1013"];
  let defs =
    linear(u("pcb"), [["0", pcb[0]], ["1", pcb[1]]], 1, 1) +
    linear(u("hs"), [["0", t.m1], ["1", t.m2]], 1, 1) +
    linear(u("metal"), [["0", "#e7eaee"], ["1", "#8f97a2"]], 1, 0) +
    linear(u("dark"), [["0", "#2a2f36"], ["1", "#121418"]]);
  const shadow = floorShadow(u, 240, y + Bh + 22, Bw / 2 + 10, 8);
  defs += shadow.defs;
  let b = shadow.body;
  b += `<rect x="${x}" y="${y}" width="${Bw}" height="${Bh}" rx="6" fill="url(#${u("pcb")})" stroke="${white ? "#b5bcc6" : "#2b3038"}"/>`;
  // Pistas
  for (let i = 0; i < 7; i++) {
    b += `<path d="M ${x + 12} ${y + 40 + i * 30} h ${40 + (i % 3) * 24} l 14 14 h ${60}" fill="none" stroke="${white ? "#aab2bd" : "#262b33"}" stroke-width="1"/>`;
  }
  // Escudo de I/O
  b += `<rect x="${x + 8}" y="${y + 10}" width="38" height="${Math.min(110, Bh * 0.4)}" rx="4" fill="url(#${u("hs")})" stroke="${t.edge}" stroke-opacity="0.4"/>`;
  b += `<path d="M ${x + 14} ${y + 24} l 26 26" stroke="${a.accent}" stroke-width="2.2"/>`;
  // VRM
  b += `<rect x="${x + 54}" y="${y + 10}" width="${Bw * 0.46}" height="30" rx="4" fill="url(#${u("hs")})" stroke="${t.edge}" stroke-opacity="0.4"/>`;
  for (let i = 0; i < 9; i++) {
    b += `<rect x="${x + 60 + i * ((Bw * 0.46 - 14) / 9)}" y="${y + 14}" width="2" height="22" fill="${t.deep}" opacity="0.5"/>`;
  }
  // Socket
  const sx = x + 64;
  const sy = y + 52;
  b += `<rect x="${sx}" y="${sy}" width="72" height="72" rx="4" fill="url(#${u("metal")})"/>`;
  b += `<rect x="${sx + 8}" y="${sy + 8}" width="56" height="56" rx="2" fill="#2a2f36"/>`;
  b += `<rect x="${sx + 14}" y="${sy + 14}" width="44" height="44" rx="2" fill="#c9a54a" opacity="0.55"/>`;
  b += `<path d="M ${sx - 6} ${sy + 4} v 64" stroke="#c8ced6" stroke-width="3" stroke-linecap="round"/>`;
  // DIMM
  const slots = tech?.memorySlots ?? 4;
  for (let i = 0; i < slots; i++) {
    const dx = x + Bw - 70 + i * 11;
    b += `<rect x="${dx}" y="${y + 46}" width="7" height="${Math.min(150, Bh * 0.5)}" rx="1.5" fill="url(#${u("dark")})" stroke="${white ? "#9aa2ad" : "#353a43"}"/>`;
    b += `<rect x="${dx}" y="${y + 42}" width="7" height="6" rx="1" fill="${i % 2 ? t.m1 : a.accent}"/>`;
  }
  // ATX 24 pines
  b += `<rect x="${x + Bw - 14}" y="${y + 70}" width="9" height="50" rx="1.5" fill="#0d0f12"/>`;
  // PCIe x16 reforzado
  const py = y + Math.min(156, Bh * 0.56);
  b += `<rect x="${x + 22}" y="${py}" width="${Bw * 0.72}" height="10" rx="2" fill="url(#${u("metal")})"/>`;
  b += `<rect x="${x + 26}" y="${py + 3}" width="${Bw * 0.72 - 8}" height="4" rx="1" fill="#1a1d22"/>`;
  // M.2 con disipador
  b += `<rect x="${x + 40}" y="${py + 22}" width="${Bw * 0.5}" height="24" rx="3" fill="url(#${u("hs")})" stroke="${t.edge}" stroke-opacity="0.4"/>`;
  b += `<path d="M ${x + 48} ${py + 34} h ${Bw * 0.3}" stroke="${a.accent}" stroke-width="1.6" opacity="0.9"/>`;
  if (ff !== "Mini-ITX") {
    b += `<rect x="${x + 22}" y="${py + 58}" width="${Bw * 0.5}" height="7" rx="1.5" fill="url(#${u("dark")})" stroke="${white ? "#9aa2ad" : "#353a43"}"/>`;
  }
  // Disipador del chipset
  const cx = x + Bw - 84;
  const cy = y + Bh - 78;
  b += `<path d="M ${cx} ${cy} h 70 v 58 h -54 l -16 -16 Z" fill="url(#${u("hs")})" stroke="${t.edge}" stroke-opacity="0.5"/>`;
  b += `<path d="M ${cx + 8} ${cy + 46} l 12 0" stroke="${a.accent}" stroke-width="2"/>`;
  if (a.label) {
    b += `<text x="${cx + 62}" y="${cy + 24}" text-anchor="end" font-family="${MONO}" font-weight="700" font-size="11" letter-spacing="1.2" fill="${t.text}" opacity="0.85">${esc(a.label)}</text>`;
  }
  // Puertos SATA
  for (let i = 0; i < 2; i++) {
    b += `<rect x="${x + Bw - 12}" y="${cy - 34 + i * 12}" width="8" height="9" rx="1" fill="#0d0f12"/>`;
  }
  return { defs, body: b, focus: [x + 40, y + 20, 200, 150] };
}

/* ------------------------------------------------------------------ */
/* RAM                                                                 */
/* ------------------------------------------------------------------ */
export function ramArt(a: ArtSpec): Art {
  const u = ids();
  const t = tones[a.tone];
  const Lw = 360;
  let defs =
    linear(u("spr"), [["0", t.b1], ["0.6", t.b2], ["1", t.deep]]) +
    linear(u("pcb"), [["0", "#173726"], ["1", "#0d2117"]]) +
    linear(u("gold"), [["0", "#f3d27a"], ["1", "#a77d2a"]]) +
    linear(u("rgb"), [["0", a.accent], ["0.5", "#ffffff"], ["1", a.accent]], 1, 0) +
    blurFilter(u("glow"), 6);
  const shadow = floorShadow(u, 240, 300, 200, 8);
  defs += shadow.defs;
  let b = shadow.body;
  const stick = (ox: number, oy: number, dim: boolean) => {
    const x = 60 + ox;
    const y = 110 + oy;
    let s = `<g opacity="${dim ? 0.78 : 1}">`;
    s += `<rect x="${x}" y="${y + 90}" width="${Lw}" height="34" rx="3" fill="url(#${u("pcb")})"/>`;
    for (let i = 0; i < 56; i++) {
      if (i === 27) continue;
      s += `<rect x="${x + 8 + i * 6.25}" y="${y + 108}" width="3.6" height="14" rx="0.6" fill="url(#${u("gold")})"/>`;
    }
    if (a.rgb) {
      s += `<rect x="${x + 6}" y="${y - 14}" width="${Lw - 12}" height="16" rx="5" fill="url(#${u("rgb")})" filter="url(#${u("glow")})" opacity="0.75"/>`;
      s += `<rect x="${x + 6}" y="${y - 14}" width="${Lw - 12}" height="16" rx="5" fill="url(#${u("rgb")})" opacity="0.95"/>`;
    }
    s += `<path d="M ${x} ${y + 4} L ${x + 26} ${y - 2} L ${x + Lw - 120} ${y - 2} L ${x + Lw - 96} ${y + 10} L ${x + Lw} ${y + 10} L ${x + Lw} ${y + 96} L ${x} ${y + 96} Z" fill="url(#${u("spr")})" stroke="${t.edge}" stroke-opacity="0.5"/>`;
    s += `<path d="M ${x + 20} ${y + 80} L ${x + 120} ${y + 80} L ${x + 136} ${y + 64}" fill="none" stroke="${a.accent}" stroke-width="2.2"/>`;
    s += `<path d="M ${x + Lw - 26} ${y + 26} l -40 40" stroke="${t.edge}" stroke-opacity="0.35" stroke-width="10"/>`;
    if (a.label) {
      s += `<text x="${x + 22}" y="${y + 50}" font-family="${FONT}" font-weight="800" font-size="20" letter-spacing="3" fill="${t.text}">${esc(a.label)}</text>`;
    }
    s += `<text x="${x + 22}" y="${y + 66}" font-family="${MONO}" font-size="8.5" letter-spacing="2" fill="${t.muted}">DDR · DEMO MODULE</text>`;
    s += `</g>`;
    return s;
  };
  b += stick(18, -26, true);
  b += stick(0, 0, false);
  return { defs, body: b, focus: [60, 90, 220, 165] };
}

/* ------------------------------------------------------------------ */
/* SSD M.2 y SATA                                                      */
/* ------------------------------------------------------------------ */
export function ssdArt(a: ArtSpec, tech?: StorageTech): Art {
  const u = ids();
  const t = tones[a.tone];
  const gen5 = tech?.interface === "NVMe Gen5";
  const x = 44;
  const y = 136;
  const L = 392;
  const Hh = 84;
  let defs =
    linear(u("pcb"), [["0", "#16191e"], ["1", "#0b0d10"]]) +
    linear(u("gold"), [["0", "#f3d27a"], ["1", "#a77d2a"]], 1, 0) +
    linear(u("lbl"), [["0", t.b1], ["1", t.b2]]) +
    linear(u("fin"), [["0", "#5b626d"], ["1", "#1d2127"]]);
  const shadow = floorShadow(u, 240, y + Hh + 40, 210, 9);
  defs += shadow.defs;
  let b = shadow.body;
  b += `<path d="M ${x + 14} ${y} H ${x + L} V ${y + Hh} H ${x + 14} A 14 14 0 0 1 ${x} ${y + Hh - 14} V ${y + Hh / 2 + 9} A 9 9 0 0 0 ${x} ${y + Hh / 2 - 9} V ${y + 14} A 14 14 0 0 1 ${x + 14} ${y} Z" fill="url(#${u("pcb")})" stroke="#2b3038"/>`;
  // Conector
  b += `<rect x="${x + L - 2}" y="${y + 6}" width="18" height="${Hh - 12}" rx="2" fill="url(#${u("gold")})"/>`;
  b += `<rect x="${x + L - 2}" y="${y + Hh * 0.68}" width="18" height="6" fill="#0b0d10"/>`;
  for (let i = 0; i < 12; i++) {
    b += `<rect x="${x + L + 1}" y="${y + 9 + i * 6}" width="14" height="1" fill="#7a5a17" opacity="0.6"/>`;
  }
  if (gen5) {
    b += `<rect x="${x + 22}" y="${y - 22}" width="${L - 40}" height="${Hh + 30}" rx="8" fill="url(#${u("fin")})" stroke="#6b737e" stroke-opacity="0.6"/>`;
    for (let i = 0; i < 26; i++) {
      b += `<rect x="${x + 34 + i * 13.4}" y="${y - 16}" width="5" height="${Hh + 18}" rx="2" fill="#0f1114" opacity="0.6"/>`;
    }
    b += `<rect x="${x + 110}" y="${y + 18}" width="150" height="40" rx="6" fill="#0e1014" stroke="${a.accent}" stroke-opacity="0.7"/>`;
    if (a.label) b += `<text x="${x + 185}" y="${y + 44}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="18" letter-spacing="2" fill="#f1f3f6">${esc(a.label)}</text>`;
  } else {
    b += `<rect x="${x + 30}" y="${y + 8}" width="${L - 80}" height="${Hh - 16}" rx="5" fill="url(#${u("lbl")})" stroke="${t.edge}" stroke-opacity="0.4"/>`;
    b += `<rect x="${x + 30}" y="${y + 8}" width="8" height="${Hh - 16}" rx="2" fill="${a.accent}"/>`;
    if (a.label) b += `<text x="${x + 52}" y="${y + 42}" font-family="${FONT}" font-weight="800" font-size="22" letter-spacing="1" fill="${t.text}">${esc(a.label)}</text>`;
    if (a.sublabel) b += `<text x="${x + 52}" y="${y + 62}" font-family="${MONO}" font-size="10" letter-spacing="2" fill="${t.muted}">${esc(a.sublabel)} · NVMe M.2</text>`;
    b += `<rect x="${x + L - 120}" y="${y + 22}" width="60" height="40" rx="3" fill="${t.deep}" opacity="0.18"/>`;
  }
  return { defs, body: b, focus: [x + 20, y - 30, 220, 165] };
}

export function sataArt(a: ArtSpec): Art {
  const u = ids();
  const t = tones[a.tone];
  const x = 110;
  const y = 70;
  const Wd = 260;
  const Hh = 196;
  let defs =
    linear(u("body"), [["0", t.b1], ["1", t.b2]], 1, 1) +
    linear(u("brush"), [["0", "#fff", 0.0], ["0.5", "#fff", 0.12], ["1", "#fff", 0]], 1, 0.3);
  const shadow = floorShadow(u, 240, y + Hh + 22, 150, 9);
  defs += shadow.defs;
  let b = shadow.body;
  b += `<rect x="${x}" y="${y}" width="${Wd}" height="${Hh}" rx="10" fill="url(#${u("body")})" stroke="${t.edge}" stroke-opacity="0.5"/>`;
  b += `<rect x="${x}" y="${y}" width="${Wd}" height="${Hh}" rx="10" fill="url(#${u("brush")})"/>`;
  b += `<rect x="${x + 20}" y="${y + 24}" width="${Wd - 40}" height="${Hh - 70}" rx="6" fill="#0f1114" stroke="#2b3038"/>`;
  b += `<rect x="${x + 20}" y="${y + 24}" width="${Wd - 40}" height="6" rx="2" fill="${a.accent}"/>`;
  if (a.label) b += `<text x="${x + 38}" y="${y + 86}" font-family="${FONT}" font-weight="800" font-size="30" letter-spacing="1" fill="#f1f3f6">${esc(a.label)}</text>`;
  if (a.sublabel) b += `<text x="${x + 38}" y="${y + 110}" font-family="${MONO}" font-size="11" letter-spacing="2.4" fill="#8b939e">${esc(a.sublabel)} · SATA SSD</text>`;
  b += `<rect x="${x + 70}" y="${y + Hh - 4}" width="60" height="10" rx="2" fill="#0b0c0f"/>`;
  b += `<rect x="${x + 140}" y="${y + Hh - 4}" width="34" height="10" rx="2" fill="#0b0c0f"/>`;
  return { defs, body: b, focus: [x, y, 200, 150] };
}

/* ------------------------------------------------------------------ */
/* Fuente de poder                                                     */
/* ------------------------------------------------------------------ */
export function psuArt(a: ArtSpec): Art {
  const u = ids();
  const t = tones[a.tone];
  const x = 108;
  const y = 54;
  const S = 236;
  const D = 46;
  let defs =
    linear(u("face"), [["0", t.b1], ["1", t.b2]], 1, 1) +
    linear(u("side"), [["0", t.b2], ["1", t.deep]]) +
    linear(u("grill"), [["0", "#1a1d22"], ["1", "#0a0b0d"]]);
  const shadow = floorShadow(u, 240 + D / 2, y + S + D + 16, 150, 9);
  defs += shadow.defs;
  let b = shadow.body;
  // Lado (profundidad)
  b += `<path d="M ${x} ${y + S} L ${x + D} ${y + S + D} L ${x + S + D} ${y + S + D} L ${x + S} ${y + S} Z" fill="url(#${u("side")})" stroke="${t.edge}" stroke-opacity="0.3"/>`;
  b += `<path d="M ${x + S} ${y} L ${x + S + D} ${y + D} L ${x + S + D} ${y + S + D} L ${x + S} ${y + S} Z" fill="${t.deep}" stroke="${t.edge}" stroke-opacity="0.3"/>`;
  // Etiqueta lateral
  if (a.label) {
    b += `<text x="${x + S / 2 + D / 2}" y="${y + S + D / 2 + 5}" text-anchor="middle" font-family="${MONO}" font-weight="700" font-size="12" letter-spacing="2" fill="${t.text}" opacity="0.85">${esc(a.label)}</text>`;
  }
  // Cara del ventilador
  b += `<rect x="${x}" y="${y}" width="${S}" height="${S}" rx="8" fill="url(#${u("face")})" stroke="${t.edge}" stroke-opacity="0.5"/>`;
  const cx = x + S / 2;
  const cy = y + S / 2;
  b += `<circle cx="${cx}" cy="${cy}" r="98" fill="url(#${u("grill")})"/>`;
  const f = fan(u, "p", cx, cy, 90, t, { accent: a.accent, blades: 7 });
  defs += f.defs;
  b += f.body;
  for (let i = 1; i <= 6; i++) {
    b += `<circle cx="${cx}" cy="${cy}" r="${i * 15}" fill="none" stroke="${t.m1}" stroke-opacity="0.55" stroke-width="1.6"/>`;
  }
  for (let i = 0; i < 4; i++) {
    b += `<path d="M ${cx} ${cy} L ${cx + Math.cos((i * Math.PI) / 2 + Math.PI / 4) * 96} ${cy + Math.sin((i * Math.PI) / 2 + Math.PI / 4) * 96}" stroke="${t.m1}" stroke-opacity="0.55" stroke-width="2"/>`;
  }
  b += `<circle cx="${cx}" cy="${cy}" r="20" fill="${t.b2}" stroke="${a.accent}" stroke-width="2"/>`;
  b += `<rect x="${x + 14}" y="${y + 14}" width="6" height="${S - 28}" rx="3" fill="${a.accent}" opacity="0.9"/>`;
  return { defs, body: b, focus: [x + 20, y + 20, 200, 150] };
}
