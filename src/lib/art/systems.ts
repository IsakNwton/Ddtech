import type { ArtSpec } from "../types";
import { type Art, FONT, MONO, blurFilter, esc, fan, floorShadow, ids, linear, radial, tones } from "./core";

/* ------------------------------------------------------------------ */
/* Gabinete / PC armada (vista lateral con cristal)                    */
/* ------------------------------------------------------------------ */
export function caseArt(a: ArtSpec, opts: { built?: boolean } = {}): Art {
  const u = ids();
  const t = tones[a.tone];
  const built = opts.built ?? false;
  const x = 128;
  const y = 22;
  const Wd = 224;
  const Hh = 300;
  const white = a.tone === "white";
  let defs =
    linear(u("frame"), [["0", t.b1], ["1", t.b2]], 1, 1) +
    linear(u("glass"), [["0", "#0d1015", 0.92], ["1", "#06070a", 0.96]], 0.3, 1) +
    linear(u("refl"), [["0", "#fff", 0.0], ["0.45", "#fff", 0.0], ["0.5", "#fff", 0.09], ["0.62", "#fff", 0.0]], 1, 1) +
    radial(u("inner"), [["0", a.accent, built ? 0.38 : 0.18], ["1", a.accent, 0]], 0.55, 0.45, 0.65) +
    linear(u("gpu"), [["0", "#2b3038"], ["1", "#111317"]]) +
    linear(u("mesh"), [["0", t.b2], ["1", t.deep]]) +
    blurFilter(u("glow"), 5);
  const shadow = floorShadow(u, 240, y + Hh + 18, 140, 9);
  defs += shadow.defs;
  let b = shadow.body;
  // Patas
  b += `<rect x="${x + 16}" y="${y + Hh - 2}" width="34" height="8" rx="3" fill="${t.deep}"/>`;
  b += `<rect x="${x + Wd - 50}" y="${y + Hh - 2}" width="34" height="8" rx="3" fill="${t.deep}"/>`;
  // Chasis
  b += `<rect x="${x}" y="${y}" width="${Wd}" height="${Hh}" rx="12" fill="url(#${u("frame")})" stroke="${t.edge}" stroke-opacity="0.55"/>`;
  // Panel frontal con malla
  b += `<rect x="${x + 6}" y="${y + 10}" width="30" height="${Hh - 20}" rx="6" fill="url(#${u("mesh")})"/>`;
  for (let r = 0; r < 30; r++) {
    for (let c = 0; c < 3; c++) {
      b += `<circle cx="${x + 13 + c * 8 + (r % 2) * 4}" cy="${y + 20 + r * 9.4}" r="1.6" fill="${t.deep}" opacity="${white ? 0.35 : 0.8}"/>`;
    }
  }
  // Ventana de cristal
  const gx = x + 44;
  const gy = y + 14;
  const gw = Wd - 56;
  const gh = Hh - 28;
  b += `<rect x="${gx}" y="${gy}" width="${gw}" height="${gh}" rx="6" fill="url(#${u("glass")})"/>`;
  b += `<rect x="${gx}" y="${gy}" width="${gw}" height="${gh}" rx="6" fill="url(#${u("inner")})"/>`;
  // Interior: tarjeta madre
  b += `<rect x="${gx + 46}" y="${gy + 14}" width="${gw - 56}" height="${gh * 0.62}" rx="3" fill="#15181d" stroke="#262b33"/>`;
  // Disipador
  b += `<rect x="${gx + 70}" y="${gy + 40}" width="52" height="56" rx="4" fill="#2a2f36" stroke="#3b414a"/>`;
  b += `<circle cx="${gx + 96}" cy="${gy + 68}" r="18" fill="#0f1114" stroke="${built ? a.accent : "#3b414a"}" stroke-width="${built ? 2 : 1}"/>`;
  // RAM
  for (let i = 0; i < 2; i++) {
    b += `<rect x="${gx + 134 + i * 9}" y="${gy + 30}" width="6" height="64" rx="1.5" fill="#2a2f36"/>`;
    if (built || a.rgb) b += `<rect x="${gx + 134 + i * 9}" y="${gy + 30}" width="6" height="6" rx="1.5" fill="${a.accent}"/>`;
  }
  // GPU
  if (built || a.rgb) {
    b += `<rect x="${gx + 40}" y="${gy + gh * 0.45}" width="${gw - 50}" height="30" rx="4" fill="url(#${u("gpu")})" stroke="#3b414a"/>`;
    b += `<rect x="${gx + 46}" y="${gy + gh * 0.45 + 24}" width="${gw - 70}" height="2.5" rx="1" fill="${a.accent}" filter="url(#${u("glow")})"/>`;
    b += `<rect x="${gx + 46}" y="${gy + gh * 0.45 + 24}" width="${gw - 70}" height="2" rx="1" fill="${a.accent}"/>`;
  }
  // Cubierta de la fuente
  b += `<rect x="${gx + 4}" y="${gy + gh - 54}" width="${gw - 8}" height="50" rx="4" fill="${t.b2}" opacity="0.92"/>`;
  b += `<text x="${gx + gw / 2}" y="${gy + gh - 24}" text-anchor="middle" font-family="${MONO}" font-size="8" letter-spacing="2.4" fill="${t.text}" opacity="0.6">${esc((a.label ?? "DDTECH CONCEPT").toUpperCase())}</text>`;
  // Ventiladores frontales vistos de canto
  for (let i = 0; i < 3; i++) {
    const fy = gy + 30 + i * 62;
    b += `<rect x="${gx + 6}" y="${fy}" width="14" height="54" rx="3" fill="#1b1f25" stroke="#2f343c"/>`;
    if (built || a.rgb) {
      b += `<rect x="${gx + 18}" y="${fy + 4}" width="3" height="46" rx="1.5" fill="${a.accent}" filter="url(#${u("glow")})" opacity="0.9"/>`;
      b += `<rect x="${gx + 18}" y="${fy + 4}" width="2" height="46" rx="1" fill="${a.accent}"/>`;
    }
  }
  // Reflejo
  b += `<rect x="${gx}" y="${gy}" width="${gw}" height="${gh}" rx="6" fill="url(#${u("refl")})"/>`;
  b += `<rect x="${gx}" y="${gy}" width="${gw}" height="${gh}" rx="6" fill="none" stroke="${t.edge}" stroke-opacity="0.25"/>`;
  // Botón superior
  b += `<rect x="${x + 70}" y="${y - 3}" width="22" height="4" rx="2" fill="${a.accent}" opacity="0.9"/>`;
  return { defs, body: b, focus: [x + 30, y + 40, 200, 150] };
}

/* ------------------------------------------------------------------ */
/* Disipador por aire                                                  */
/* ------------------------------------------------------------------ */
export function airCoolerArt(a: ArtSpec): Art {
  const u = ids();
  const t = tones[a.tone];
  const v = a.variant ?? 0;
  let defs =
    linear(u("fin"), [["0", t.m1], ["1", t.m2]], 1, 0) +
    linear(u("cu"), [["0", a.tone === "black" ? "#3a3f47" : "#e7b08a"], ["1", a.tone === "black" ? "#1a1d22" : "#9a5a35"]], 1, 0) +
    linear(u("cap"), [["0", t.b1], ["1", t.b2]]) +
    linear(u("base"), [["0", "#e9b38d"], ["1", "#9a5a35"]]);

  if (v === 3) {
    // Perfil bajo
    const shadow = floorShadow(u, 240, 268, 160, 8);
    defs += shadow.defs;
    let b = shadow.body;
    b += `<rect x="100" y="196" width="280" height="54" rx="6" fill="url(#${u("fin")})"/>`;
    for (let i = 0; i < 34; i++) b += `<rect x="${106 + i * 8}" y="198" width="3" height="50" fill="${t.deep}" opacity="0.35"/>`;
    b += `<rect x="130" y="250" width="220" height="8" rx="2" fill="url(#${u("base")})"/>`;
    b += `<rect x="128" y="150" width="224" height="48" rx="10" fill="${a.tone === "silver" ? "#5a4636" : t.b2}"/>`;
    const f = fan(u, "lp", 240, 174, 22, t, { accent: a.accent, blades: 9 });
    defs += f.defs;
    b += `<rect x="150" y="156" width="180" height="36" rx="8" fill="#6b5240" opacity="0.6"/>`;
    b += f.body;
    b += `<text x="240" y="300" text-anchor="middle" font-family="${MONO}" font-size="10" letter-spacing="2" fill="${t.muted}">LOW PROFILE · 37 mm</text>`;
    return { defs, body: b, focus: [130, 140, 220, 165] };
  }

  const dual = v === 2;
  const shadow = floorShadow(u, 240, 318, dual ? 170 : 130, 9);
  defs += shadow.defs;
  let b = shadow.body;
  const towers = dual ? [150, 262] : [178];
  const tw = dual ? 92 : 124;
  // Heatpipes
  for (const tx of towers) {
    for (let i = 0; i < 4; i++) {
      const px = tx + 14 + i * ((tw - 28) / 3);
      b += `<rect x="${px - 4}" y="40" width="8" height="250" rx="4" fill="url(#${u("cu")})"/>`;
      b += `<circle cx="${px}" cy="40" r="5" fill="url(#${u("cu")})"/>`;
    }
  }
  // Torres de aletas
  for (const tx of towers) {
    b += `<rect x="${tx}" y="56" width="${tw}" height="214" rx="4" fill="url(#${u("fin")})" stroke="${t.edge}" stroke-opacity="0.4"/>`;
    for (let i = 0; i < 40; i++) b += `<rect x="${tx}" y="${60 + i * 5.2}" width="${tw}" height="1.4" fill="${t.deep}" opacity="0.28"/>`;
    b += `<rect x="${tx - 2}" y="50" width="${tw + 4}" height="12" rx="4" fill="url(#${u("cap")})" stroke="${t.edge}" stroke-opacity="0.6"/>`;
    b += `<rect x="${tx + tw / 2 - 16}" y="54" width="32" height="4" rx="2" fill="${a.accent}"/>`;
  }
  // Base de cobre
  b += `<rect x="${dual ? 214 : 196}" y="286" width="${dual ? 52 : 88}" height="16" rx="3" fill="url(#${u("base")})"/>`;
  // Ventilador
  const fx = dual ? 240 : 214;
  const fw = dual ? 128 : 150;
  b += `<rect x="${fx - fw / 2}" y="${163 - fw / 2}" width="${fw}" height="${fw}" rx="14" fill="${a.tone === "silver" && v === 2 ? "#5a4636" : t.deep}" stroke="${t.edge}" stroke-opacity="0.35"/>`;
  const f = fan(u, "a", fx, 163, fw / 2 - 8, t, { accent: a.accent, blades: dual ? 11 : 9 });
  defs += f.defs;
  b += f.body;
  for (const [cx, cy] of [
    [fx - fw / 2 + 10, 163 - fw / 2 + 10],
    [fx + fw / 2 - 10, 163 - fw / 2 + 10],
    [fx - fw / 2 + 10, 163 + fw / 2 - 10],
    [fx + fw / 2 - 10, 163 + fw / 2 - 10],
  ]) {
    b += `<circle cx="${cx}" cy="${cy}" r="3" fill="${t.b2}"/>`;
  }
  return { defs, body: b, focus: [130, 60, 220, 165] };
}

/* ------------------------------------------------------------------ */
/* Enfriamiento líquido AIO                                            */
/* ------------------------------------------------------------------ */
export function aioArt(a: ArtSpec): Art {
  const u = ids();
  const t = tones[a.tone];
  const n = a.fans ?? 3;
  const rw = n === 3 ? 396 : 270;
  const rx = 240 - rw / 2;
  const ry = 40;
  const rh = 124;
  let defs =
    linear(u("rad"), [["0", t.b1], ["1", t.deep]]) +
    linear(u("tube"), [["0", "#2a2e35"], ["1", "#0d0f12"]], 1, 0) +
    linear(u("pump"), [["0", t.b1], ["1", t.b2]], 1, 1) +
    radial(u("screen"), [["0", a.accent, 0.9], ["0.6", a.accent, 0.25], ["1", "#000", 0]]) +
    blurFilter(u("glow"), 5);
  const shadow = floorShadow(u, 240, 336, 200, 8);
  defs += shadow.defs;
  let b = shadow.body;
  // Mangueras
  b += `<path d="M ${rx + rw - 24} ${ry + rh} C ${rx + rw - 24} ${ry + rh + 70}, 300 ${ry + rh + 40}, 262 262" fill="none" stroke="url(#${u("tube")})" stroke-width="14" stroke-linecap="round"/>`;
  b += `<path d="M ${rx + rw - 54} ${ry + rh} C ${rx + rw - 54} ${ry + rh + 50}, 280 ${ry + rh + 30}, 250 250" fill="none" stroke="url(#${u("tube")})" stroke-width="14" stroke-linecap="round"/>`;
  // Radiador
  b += `<rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" rx="8" fill="url(#${u("rad")})" stroke="${t.edge}" stroke-opacity="0.4"/>`;
  const fr = 52;
  const gap = rw / n;
  for (let i = 0; i < n; i++) {
    const cx = rx + gap * i + gap / 2;
    b += `<rect x="${cx - gap / 2 + 6}" y="${ry + 4}" width="${gap - 12}" height="${rh - 8}" rx="10" fill="${t.deep}"/>`;
    const f = fan(u, `${i}`, cx, ry + rh / 2, fr, t, { accent: a.accent, rgb: a.rgb });
    defs += f.defs;
    b += f.body;
  }
  // Bomba
  b += `<circle cx="240" cy="266" r="56" fill="url(#${u("pump")})" stroke="${t.edge}" stroke-opacity="0.5"/>`;
  b += `<circle cx="240" cy="266" r="44" fill="#07080a"/>`;
  b += `<circle cx="240" cy="266" r="40" fill="url(#${u("screen")})" opacity="0.7"/>`;
  b += `<circle cx="240" cy="266" r="40" fill="none" stroke="${a.accent}" stroke-width="2.4" filter="url(#${u("glow")})"/>`;
  b += `<circle cx="240" cy="266" r="40" fill="none" stroke="${a.accent}" stroke-width="1.6"/>`;
  b += `<text x="240" y="271" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="14" fill="#f3f5f8">${n === 3 ? "360" : "240"}</text>`;
  return { defs, body: b, focus: [150, 150, 200, 150] };
}

/* ------------------------------------------------------------------ */
/* Ventilador suelto                                                   */
/* ------------------------------------------------------------------ */
export function fanArt(a: ArtSpec): Art {
  const u = ids();
  const t = tones[a.tone];
  let defs = linear(u("frame"), [["0", t.b1], ["1", t.b2]], 1, 1);
  const shadow = floorShadow(u, 240, 338, 150, 8);
  defs += shadow.defs;
  let b = shadow.body;
  const square = (cx: number, cy: number, s: number, key: string, dim = false) => {
    let out = `<g opacity="${dim ? 0.55 : 1}">`;
    out += `<rect x="${cx - s / 2}" y="${cy - s / 2}" width="${s}" height="${s}" rx="${s * 0.12}" fill="url(#${u("frame")})" stroke="${t.edge}" stroke-opacity="0.4"/>`;
    for (const [dx, dy] of [
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
    ]) {
      out += `<circle cx="${cx + dx * (s / 2 - s * 0.08)}" cy="${cy + dy * (s / 2 - s * 0.08)}" r="${s * 0.03}" fill="${t.deep}"/>`;
    }
    const f = fan(u, key, cx, cy, s * 0.45, t, { accent: a.accent, rgb: a.rgb });
    defs += f.defs;
    out += f.body + `</g>`;
    return out;
  };
  b += square(316, 132, 170, "back", true);
  b += square(214, 192, 236, "front");
  return { defs, body: b, focus: [120, 100, 200, 150] };
}
