import type { ArtSpec } from "../types";
import { type Art, blurFilter, floorShadow, ids, linear, radial, tones } from "./core";

export function monitorArt(a: ArtSpec): Art {
  const u = ids();
  const t = tones[a.tone];
  const v = a.variant ?? 0;
  const x = 46;
  const y = 30;
  const Wd = 388;
  const Hh = 226;
  const curved = v === 2;
  let defs =
    linear(u("sky"), [["0", "#0b1022"], ["0.6", "#121a33"], ["1", "#1b1430"]]) +
    radial(u("sun"), [["0", a.accent, 0.95], ["0.35", a.accent, 0.35], ["1", a.accent, 0]]) +
    linear(u("m1"), [["0", "#1c2236"], ["1", "#0b0e18"]]) +
    linear(u("m2"), [["0", "#0f1322"], ["1", "#05060b"]]) +
    linear(u("stand"), [["0", t.b1], ["1", t.b2]], 1, 0) +
    linear(u("refl"), [["0", "#fff", 0.07], ["0.5", "#fff", 0], ["1", "#fff", 0]], 1, 1) +
    blurFilter(u("glow"), 8);
  const shadow = floorShadow(u, 240, 336, 120, 8);
  defs += shadow.defs;
  let b = shadow.body;
  // Base
  b += `<path d="M 170 330 L 310 330 L 296 316 L 184 316 Z" fill="url(#${u("stand")})"/>`;
  b += `<rect x="226" y="${y + Hh - 10}" width="28" height="${316 - (y + Hh - 10)}" rx="4" fill="url(#${u("stand")})"/>`;
  // Marco
  const frame = curved
    ? `M ${x} ${y + 8} Q 240 ${y - 10} ${x + Wd} ${y + 8} L ${x + Wd} ${y + Hh - 8} Q 240 ${y + Hh - 26} ${x} ${y + Hh - 8} Z`
    : `M ${x + 8} ${y} H ${x + Wd - 8} Q ${x + Wd} ${y} ${x + Wd} ${y + 8} V ${y + Hh - 8} Q ${x + Wd} ${y + Hh} ${x + Wd - 8} ${y + Hh} H ${x + 8} Q ${x} ${y + Hh} ${x} ${y + Hh - 8} V ${y + 8} Q ${x} ${y} ${x + 8} ${y} Z`;
  b += `<path d="${frame}" fill="#0a0b0e" stroke="${t.edge}" stroke-opacity="0.45"/>`;
  // Pantalla
  const sx = x + 6;
  const sy = y + 6;
  const sw = Wd - 12;
  const sh = Hh - 20;
  b += `<clipPath id="${u("clip")}"><rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" rx="3"/></clipPath>`;
  b += `<g clip-path="url(#${u("clip")})">`;
  b += `<rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" fill="url(#${u("sky")})"/>`;
  b += `<circle cx="${sx + sw * 0.66}" cy="${sy + sh * 0.56}" r="90" fill="url(#${u("sun")})"/>`;
  b += `<circle cx="${sx + sw * 0.66}" cy="${sy + sh * 0.56}" r="26" fill="${a.accent}" opacity="0.9"/>`;
  b += `<path d="M ${sx} ${sy + sh * 0.7} L ${sx + 60} ${sy + sh * 0.48} L ${sx + 120} ${sy + sh * 0.62} L ${sx + 190} ${sy + sh * 0.4} L ${sx + 260} ${sy + sh * 0.6} L ${sx + 330} ${sy + sh * 0.5} L ${sx + sw} ${sy + sh * 0.64} V ${sy + sh} H ${sx} Z" fill="url(#${u("m1")})"/>`;
  b += `<path d="M ${sx + 190} ${sy + sh * 0.4} L ${sx + 214} ${sy + sh * 0.47}" stroke="${a.accent}" stroke-opacity="0.7" stroke-width="1.5"/>`;
  b += `<path d="M ${sx} ${sy + sh * 0.84} L ${sx + 90} ${sy + sh * 0.7} L ${sx + 170} ${sy + sh * 0.8} L ${sx + 250} ${sy + sh * 0.68} L ${sx + sw} ${sy + sh * 0.82} V ${sy + sh} H ${sx} Z" fill="url(#${u("m2")})"/>`;
  for (let i = 0; i < 5; i++) {
    b += `<path d="M ${sx} ${sy + sh - 6 - i * 7} H ${sx + sw}" stroke="${a.accent}" stroke-opacity="${0.06 + i * 0.02}"/>`;
  }
  // HUD mínimo
  b += `<rect x="${sx + 14}" y="${sy + 14}" width="60" height="4" rx="2" fill="#fff" opacity="0.5"/>`;
  b += `<rect x="${sx + 14}" y="${sy + 22}" width="38" height="4" rx="2" fill="${a.accent}" opacity="0.9"/>`;
  b += `<rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" fill="url(#${u("refl")})"/>`;
  b += `</g>`;
  b += `<rect x="232" y="${y + Hh - 10}" width="16" height="2" rx="1" fill="${t.muted}" opacity="0.6"/>`;
  return { defs, body: b, focus: [130, 60, 220, 165] };
}

export function keyboardArt(a: ArtSpec): Art {
  const u = ids();
  const t = tones[a.tone];
  const v = a.variant ?? 0;
  const cols = v === 2 ? 15 : 17;
  const rows = 6;
  const k = 21;
  const g = 3.4;
  const Wd = cols * (k + g) + 26;
  const Hh = rows * (k + g) + 30;
  const x = 240 - Wd / 2;
  const y = 180 - Hh / 2;
  let defs =
    linear(u("case"), [["0", t.b1], ["1", t.b2]], 1, 1) +
    linear(u("key"), [["0", "#30353d"], ["1", "#181b20"]]) +
    linear(u("keyw"), [["0", "#ffffff"], ["1", "#d9dde3"]]) +
    blurFilter(u("glow"), 7);
  const shadow = floorShadow(u, 240, y + Hh + 22, Wd / 2, 9);
  defs += shadow.defs;
  let b = shadow.body;
  b += `<rect x="${x + 10}" y="${y + Hh - 6}" width="${Wd - 20}" height="8" rx="4" fill="${a.accent}" opacity="0.6" filter="url(#${u("glow")})"/>`;
  b += `<rect x="${x}" y="${y}" width="${Wd}" height="${Hh}" rx="14" fill="url(#${u("case")})" stroke="${t.edge}" stroke-opacity="0.5"/>`;
  const keyFill = a.tone === "white" ? `url(#${u("keyw")})` : `url(#${u("key")})`;
  for (let r = 0; r < rows; r++) {
    let cx = x + 13;
    const cy = y + 15 + r * (k + g);
    for (let c = 0; c < cols; ) {
      let w = 1;
      if (r === 5 && c === 3) w = 6;
      if (r === 0 && c === 0) w = 1;
      if (r === 2 && c === 0) w = 1.5;
      if (r === 3 && c === 0) w = 1.75;
      if (r === 4 && c === 0) w = 2.25;
      const kw = w * k + (w - 1) * g;
      const isAccent = (r === 0 && c === 0) || (r === 3 && (c === 2 || c === 3 || c === 4)) || (r === 2 && c === 3);
      b += `<rect x="${cx}" y="${cy}" width="${kw}" height="${k}" rx="4" fill="${isAccent ? a.accent : keyFill}" opacity="${isAccent ? 0.95 : 1}"/>`;
      b += `<rect x="${cx + 3}" y="${cy + 2.5}" width="${kw - 6}" height="${k - 7}" rx="3" fill="#fff" opacity="${a.tone === "white" ? 0.25 : 0.04}"/>`;
      cx += kw + g;
      c += Math.ceil(w);
      if (cx > x + Wd - 20) break;
    }
  }
  return { defs, body: b, focus: [x + 10, y, 220, 165] };
}

export function mouseArt(a: ArtSpec): Art {
  const u = ids();
  const t = tones[a.tone];
  let defs =
    linear(u("shell"), [["0", t.b1], ["1", t.b2]], 1, 1) +
    radial(u("logo"), [["0", a.accent, 0.95], ["1", a.accent, 0]]) +
    linear(u("hl"), [["0", "#fff", 0.18], ["1", "#fff", 0]], 1, 1);
  const shadow = floorShadow(u, 240, 334, 90, 9);
  defs += shadow.defs;
  let b = shadow.body;
  const body = "M 240 34 C 304 34 326 96 326 170 C 326 262 290 320 240 320 C 190 320 154 262 154 170 C 154 96 176 34 240 34 Z";
  b += `<path d="${body}" fill="url(#${u("shell")})" stroke="${t.edge}" stroke-opacity="0.55"/>`;
  b += `<path d="M 240 34 V 140" stroke="${t.deep}" stroke-width="2" opacity="0.55"/>`;
  b += `<path d="M 160 140 C 200 150 280 150 320 140" fill="none" stroke="${t.deep}" stroke-width="1.6" opacity="0.4"/>`;
  b += `<rect x="232" y="66" width="16" height="40" rx="8" fill="#0d0f12" stroke="${t.edge}" stroke-opacity="0.4"/>`;
  b += `<rect x="236" y="74" width="8" height="24" rx="4" fill="${a.accent}" opacity="0.9"/>`;
  b += `<circle cx="240" cy="248" r="30" fill="url(#${u("logo")})" opacity="0.6"/>`;
  b += `<path d="M 228 248 l 12 -14 l 12 14 l -12 14 Z" fill="${a.accent}"/>`;
  b += `<path d="M 186 70 C 170 110 166 160 172 200" stroke="url(#${u("hl")})" stroke-width="14" fill="none" stroke-linecap="round"/>`;
  b += `<rect x="146" y="170" width="10" height="26" rx="4" fill="${t.deep}" opacity="0.8"/>`;
  b += `<rect x="146" y="200" width="10" height="26" rx="4" fill="${t.deep}" opacity="0.8"/>`;
  return { defs, body: b, focus: [140, 40, 200, 150] };
}

export function headsetArt(a: ArtSpec): Art {
  const u = ids();
  const t = tones[a.tone];
  const v = a.variant ?? 0;
  let defs =
    linear(u("band"), [["0", t.b1], ["1", t.b2]]) +
    linear(u("cup"), [["0", t.b1], ["1", t.deep]], 1, 1) +
    linear(u("pad"), [["0", "#2a2e35"], ["1", "#101215"]]) +
    blurFilter(u("glow"), 5);
  const shadow = floorShadow(u, 240, 334, 150, 9);
  defs += shadow.defs;
  let b = shadow.body;
  b += `<path d="M 128 214 C 120 70 360 70 352 214" fill="none" stroke="url(#${u("band")})" stroke-width="26" stroke-linecap="round"/>`;
  b += `<path d="M 150 190 C 150 104 330 104 330 190" fill="none" stroke="${t.deep}" stroke-width="10" stroke-linecap="round" opacity="0.6"/>`;
  for (const cx of [140, 340]) {
    b += `<rect x="${cx - 44}" y="186" width="88" height="128" rx="40" fill="url(#${u("pad")})"/>`;
    b += `<rect x="${cx - 38}" y="192" width="76" height="116" rx="36" fill="url(#${u("cup")})" stroke="${t.edge}" stroke-opacity="0.45"/>`;
    b += `<ellipse cx="${cx}" cy="250" rx="22" ry="34" fill="none" stroke="${a.accent}" stroke-width="3" filter="url(#${u("glow")})" opacity="0.8"/>`;
    b += `<ellipse cx="${cx}" cy="250" rx="22" ry="34" fill="none" stroke="${a.accent}" stroke-width="1.6"/>`;
  }
  if (v !== 1) {
    b += `<path d="M 116 280 C 100 316 140 334 196 326" fill="none" stroke="${t.b2}" stroke-width="6" stroke-linecap="round"/>`;
    b += `<circle cx="198" cy="326" r="9" fill="${t.deep}" stroke="${a.accent}" stroke-width="1.5"/>`;
  }
  return { defs, body: b, focus: [80, 150, 200, 150] };
}
