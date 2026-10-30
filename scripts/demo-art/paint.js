/* eslint-disable */
/**
 * Motor de pintura generativa para las IMÁGENES DE DEMOSTRACIÓN.
 *
 * Se ejecuta dentro de Chromium (Playwright) y dibuja, con pinceladas simuladas,
 * composiciones abstractas originales. No reproduce ni imita obras existentes:
 * sirven únicamente para mostrar cómo se verá la galería hasta tener las
 * fotografías reales de las pinturas.
 */
(function () {
  "use strict";

  // ───────────────────────── utilidades ─────────────────────────
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function makeNoise(r) {
    const size = 256;
    const perm = new Uint8Array(size * 2);
    const vals = new Float32Array(size);
    for (let i = 0; i < size; i++) {
      perm[i] = i;
      vals[i] = r();
    }
    for (let i = size - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [perm[i], perm[j]] = [perm[j], perm[i]];
    }
    for (let i = 0; i < size; i++) perm[i + size] = perm[i];
    const fade = (t) => t * t * (3 - 2 * t);
    const v = (x, y) => vals[perm[(perm[x & 255] + y) & 255]];
    function n2(x, y) {
      const xi = Math.floor(x), yi = Math.floor(y);
      const xf = x - xi, yf = y - yi;
      const u = fade(xf), w = fade(yf);
      const a = v(xi, yi), b = v(xi + 1, yi), c = v(xi, yi + 1), d = v(xi + 1, yi + 1);
      return a + (b - a) * u + (c - a) * w + (a - b - c + d) * u * w;
    }
    return function fbm(x, y, oct = 4) {
      let s = 0, amp = 0.5, f = 1, norm = 0;
      for (let i = 0; i < oct; i++) {
        s += n2(x * f, y * f) * amp;
        norm += amp;
        amp *= 0.5;
        f *= 2.03;
      }
      return s / norm;
    };
  }

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  // Mezcla en RGB (como pigmentos en la paleta), entrada y salida en HSL
  function hslToRgb([h, s, l]) {
    h = ((h % 360) + 360) % 360;
    s /= 100;
    l /= 100;
    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [f(0), f(8), f(4)];
  }
  function rgbToHsl([r, g, b]) {
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    if (max === min) return [0, 0, l * 100];
    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h;
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    return [h * 60, s * 100, l * 100];
  }
  const mix = (c1, c2, t) => {
    const a = hslToRgb(c1), b = hslToRgb(c2);
    return rgbToHsl([lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]);
  };
  const smooth = (e0, e1, x) => {
    const t = clamp((x - e0) / (e1 - e0), 0, 1);
    return t * t * (3 - 2 * t);
  };

  /** Pintor: encapsula contexto, azar y pinceles */
  function Painter(canvas, seed) {
    const ctx = canvas.getContext("2d");
    const r = mulberry32(seed);
    const noise = makeNoise(r);
    const W = canvas.width, H = canvas.height;
    const S = Math.min(W, H) / 1600; // escala de pincel

    const hsl = (c, a = 1) => `hsla(${c[0]},${clamp(c[1], 0, 100)}%,${clamp(c[2], 0, 100)}%,${a})`;
    const jitter = (c, amt) => [
      c[0] + (r() - 0.5) * 22 * amt,
      c[1] + (r() - 0.5) * 30 * amt,
      c[2] + (r() - 0.5) * 26 * amt,
    ];

    /** Pincelada con cerdas: varias líneas finas que siguen la misma curva */
    function brush(x, y, len, w, ang, col, o = {}) {
      len *= S;
      w *= S;
      const n = Math.max(3, Math.round(w / (o.gap || 2.4 * S)));
      const curve = o.curve ?? (r() - 0.5) * 0.35;
      const dx = Math.cos(ang), dy = Math.sin(ang);
      const px = -dy, py = dx;
      const alpha = o.alpha ?? 0.8;
      const cj = o.cj ?? 0.35;
      ctx.lineCap = "round";
      for (let i = 0; i < n; i++) {
        const t = (n === 1 ? 0 : i / (n - 1) - 0.5) * w;
        const l = len * (0.72 + r() * 0.38);
        const start = (r() - 0.5) * len * 0.12;
        const sx = x + px * t + dx * (start - l * 0.5);
        const sy = y + py * t + dy * (start - l * 0.5);
        const bend = curve * l * (1 - Math.abs(t / w) * 0.6);
        const ex = sx + dx * l, ey = sy + dy * l;
        const mx = (sx + ex) / 2 + px * bend, my = (sy + ey) / 2 + py * bend;
        ctx.strokeStyle = hsl(jitter(col, cj));
        ctx.globalAlpha = alpha * (0.45 + r() * 0.55);
        ctx.lineWidth = (w / n) * (0.9 + r() * 1.3);
        if (o.dry && r() < o.dry) ctx.setLineDash([(4 + r() * 26) * S, (2 + r() * 10) * S]);
        else ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.quadraticCurveTo(mx, my, ex, ey);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
    }

    /** Toque corto (flores, luces, empastes) */
    function dab(x, y, size, col, o = {}) {
      const ang = o.ang ?? r() * Math.PI;
      brush(x, y, size * (0.8 + r() * 0.8), size * (0.6 + r() * 0.5), ang, col, { alpha: o.alpha ?? 0.9, gap: 1.6 * S, cj: o.cj ?? 0.25, curve: (r() - 0.5) * 0.8 });
    }

    /** Fondo plano con veladura */
    function ground(col) {
      ctx.fillStyle = hsl(col);
      ctx.fillRect(0, 0, W, H);
    }

    /** Rellena el lienzo con pinceladas, color y ángulo en función de la posición */
    function field({ step = 26, len = 90, width = 26, color, angle, alpha = 0.75, mask, jitterPos = 0.9, dry = 0.25, curve, cj }) {
      const st = step * S;
      for (let y = -st; y < H + st; y += st) {
        for (let x = -st; x < W + st; x += st) {
          const xx = x + (r() - 0.5) * st * 2 * jitterPos;
          const yy = y + (r() - 0.5) * st * 2 * jitterPos;
          const u = xx / W, v = yy / H;
          if (mask && !mask(u, v)) continue;
          const c = color(u, v);
          if (!c) continue;
          const a = typeof angle === "function" ? angle(u, v) : angle;
          brush(xx, yy, len * (0.7 + r() * 0.6), width * (0.7 + r() * 0.6), a, c, { alpha, dry, curve, cj });
        }
      }
    }

    /** Textura de lienzo, grano, luz rasante y viñeta */
    function finish({ weave = 0.05, grain = 7, vignette = 0.22, warm = 0 } = {}) {
      const img = ctx.getImageData(0, 0, W, H);
      const d = img.data;
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const i = (y * W + x) * 4;
          const wv = (Math.sin(x * 1.9) * Math.sin(y * 1.9)) * 255 * weave * 0.5 + (Math.sin(x * 0.37 + y * 0.11) * 0.5) * 255 * weave * 0.25;
          const g = (r() - 0.5) * grain;
          const t = wv + g;
          d[i] = clamp(d[i] + t + warm, 0, 255);
          d[i + 1] = clamp(d[i + 1] + t, 0, 255);
          d[i + 2] = clamp(d[i + 2] + t - warm, 0, 255);
        }
      }
      ctx.putImageData(img, 0, 0);
      // viñeta muy suave
      const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.hypot(W, H) * 0.62);
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(1, `rgba(20,14,8,${vignette})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      // luz rasante desde arriba a la izquierda
      const l = ctx.createLinearGradient(0, 0, W, H);
      l.addColorStop(0, "rgba(255,248,235,0.06)");
      l.addColorStop(1, "rgba(0,0,0,0.05)");
      ctx.fillStyle = l;
      ctx.fillRect(0, 0, W, H);
    }

    function mark() {
      ctx.save();
      ctx.font = `${Math.round(13 * S)}px sans-serif`;
      ctx.fillStyle = "rgba(255,255,255,0.32)";
      ctx.shadowColor = "rgba(0,0,0,0.35)";
      ctx.shadowBlur = 2 * S;
      ctx.textAlign = "right";
      ctx.fillText("DEMO", W - 18 * S, H - 16 * S);
      ctx.restore();
    }

    return { ctx, r, noise, W, H, S, brush, dab, ground, field, finish, mark, hsl };
  }

  // ───────────────────────── composiciones ─────────────────────────
  const works = {};

  // 1 · Jardín en penumbra con floración clara
  works.jardin = (p) => {
    const { r, noise, W, H, field, dab, ground, brush } = p;
    ground([150, 30, 12]);
    field({
      step: 30, len: 140, width: 40, alpha: 0.7,
      angle: (u, v) => -Math.PI / 2 + (noise(u * 3, v * 3) - 0.5) * 1.6,
      color: (u, v) => {
        const light = smooth(0.9, 0.1, Math.hypot(u - 0.3, v - 0.15));
        return mix([158, 32, 10], [95, 30, 38], light * 0.8 + noise(u * 4, v * 4) * 0.25);
      },
    });
    // masas de follaje
    field({
      step: 22, len: 70, width: 26, alpha: 0.7, dry: 0.4,
      mask: (u, v) => noise(u * 2.4 + 10, v * 2.4) > 0.48,
      angle: (u, v) => noise(u * 5, v * 5) * Math.PI * 2,
      color: (u, v) => mix([140, 28, 18], [80, 38, 46], smooth(0.8, 0.0, Math.hypot(u - 0.3, v - 0.2))),
    });
    // tallos
    for (let i = 0; i < 160; i++) {
      const x = r() * W, y = H * (0.35 + r() * 0.7);
      brush(x, y, 260 + r() * 260, 5, -Math.PI / 2 + (r() - 0.5) * 0.4, [110, 30, 26], { alpha: 0.55, curve: (r() - 0.5) * 0.3 });
    }
    // floración
    for (let k = 0; k < 46; k++) {
      const cx = r() * W, cy = H * (0.18 + r() * 0.75);
      const n = 12 + Math.floor(r() * 40);
      const base = r() < 0.72 ? [42, 50, 93] : r() < 0.6 ? [350, 55, 84] : [38, 70, 66];
      const rad = (50 + r() * 140) * p.S;
      for (let i = 0; i < n; i++) {
        const a = r() * Math.PI * 2, d = Math.sqrt(r()) * rad;
        dab(cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.8, 10 + r() * 16, base, { alpha: 0.9 });
      }
    }
    // destellos de luz
    for (let i = 0; i < 220; i++) {
      const u = r() * 0.7, v = r() * 0.5;
      dab(u * W, v * H, 5 + r() * 9, [52, 60, 86], { alpha: 0.5 });
    }
  };

  // 2 · Marea, cielo bajo y horizonte luminoso
  works.marea = (p) => {
    const { r, noise, W, H, field, dab } = p;
    p.ground([205, 18, 62]);
    const hz = 0.46;
    field({
      step: 26, len: 220, width: 34, alpha: 0.75, curve: 0.04,
      angle: (u, v) => (noise(u * 2, v * 6) - 0.5) * 0.25,
      color: (u, v) => {
        if (v < hz) {
          const t = v / hz;
          const c = mix([210, 16, 70], [36, 48, 82], smooth(0.5, 1, t));
          return mix(c, [220, 12, 52], noise(u * 3, v * 5) * 0.45 * (1 - t));
        }
        const t = (v - hz) / (1 - hz);
        return mix(mix([190, 26, 52], [200, 34, 26], t), [170, 20, 40], noise(u * 4, v * 3) * 0.5);
      },
    });
    // brillo sobre el agua
    for (let i = 0; i < 600; i++) {
      const u = 0.55 + (r() - 0.5) * 0.35 * (1 + r());
      const v = hz + 0.01 + Math.pow(r(), 1.6) * 0.38;
      p.brush(u * W, v * H, 30 + r() * 60, 4 + r() * 5, (r() - 0.5) * 0.08, [42, 60, 88], { alpha: 0.6 });
    }
    // espuma
    for (let i = 0; i < 900; i++) {
      const v = hz + 0.25 + r() * 0.75;
      const u = r();
      if (noise(u * 6, v * 9) < 0.55) continue;
      dab(u * W, v * H, 12 + r() * 20, [195, 18, 90], { ang: (r() - 0.5) * 0.4, alpha: 0.8 });
    }
    // línea de horizonte
    p.brush(W / 2, hz * H, W / p.S * 1.1, 6, 0, [36, 46, 84], { alpha: 0.5, curve: 0 });
  };

  // 3 · Llanura panorámica en ocre
  works.llanura = (p) => {
    const { r, noise, W, H, field, brush } = p;
    p.ground([42, 40, 70]);
    const hz = 0.48;
    field({
      step: 24, len: 180, width: 30, alpha: 0.7, curve: 0.08,
      angle: (u, v) => (v < hz ? (noise(u * 2, v * 4) - 0.5) * 0.4 : -0.35 + (noise(u * 5, v * 5) - 0.5) * 0.9),
      color: (u, v) => {
        if (v < hz * 0.92) return mix([44, 44, 86], [210, 22, 78], smooth(0.2, 0.9, 1 - v / hz) * 0.6 + noise(u * 3, v * 3) * 0.2);
        if (v < hz * 1.05) return mix([255, 14, 58], [230, 16, 64], noise(u * 8, v));
        const t = (v - hz) / (1 - hz);
        return mix(mix([44, 62, 62], [30, 58, 42], t), [60, 40, 48], noise(u * 6, v * 6) * 0.6);
      },
    });
    // colinas lejanas
    for (let i = 0; i < 1400; i++) {
      const u = r();
      const top = hz - 0.05 - noise(u * 4, 3) * 0.1;
      const v = top + r() * (hz + 0.02 - top);
      brush(u * W, v * H, 60 + r() * 60, 12, (r() - 0.5) * 0.3, [250, 14, 60], { alpha: 0.35 });
    }
    // árbol solitario
    const tx = W * 0.71, ty = H * hz;
    for (let i = 0; i < 70; i++) {
      const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 80 * p.S;
      p.dab(tx + Math.cos(a) * d * 1.3, ty - 110 * p.S + Math.sin(a) * d * 0.7, 18, [120, 22, 22], { alpha: 0.85 });
    }
    brush(tx, ty - 30 * p.S, 90, 8, -Math.PI / 2, [30, 30, 18], { alpha: 0.9, curve: 0.05 });
    // espigas y luz
    for (let i = 0; i < 1500; i++) {
      const u = r(), v = hz + 0.08 + Math.pow(r(), 0.8) * 0.92;
      brush(u * W, v * H, 40 + r() * 70, 3 + r() * 3, -Math.PI / 2 + (r() - 0.5) * 0.5, [46, 70, 76 - v * 20], { alpha: 0.55 });
    }
  };

  // 4 · Niebla sobre el valle (vertical)
  works.niebla = (p) => {
    const { r, noise, W, H, field } = p;
    p.ground([210, 14, 84]);
    field({
      step: 26, len: 200, width: 40, alpha: 0.6, curve: 0.06,
      angle: (u, v) => (noise(u * 2, v * 3) - 0.5) * 0.35,
      color: (u, v) => mix([30, 30, 90], [210, 16, 80], smooth(0.1, 0.5, v) * 0.8 + noise(u * 3, v * 2) * 0.2),
    });
    const layers = 6;
    for (let k = 0; k < layers; k++) {
      const base = 0.36 + k * 0.11;
      const t = k / (layers - 1);
      const col = mix([215, 12, 76], [190, 22, 22], t);
      const amp = 0.06 + t * 0.06;
      field({
        step: 18, len: 110, width: 24, alpha: 0.75, dry: 0.3,
        mask: (u, v) => v > base - noise(u * (2 + k), k * 3.1) * amp * 2,
        angle: (u, v) => (noise(u * 4, v * 4 + k) - 0.5) * 0.9,
        color: (u, v) => mix(col, [210, 14, 80], smooth(base + 0.12, base - 0.08, v) * (1 - t) * 0.5),
      });
      // bruma entre capas
      for (let i = 0; i < 220; i++) {
        const u = r(), v = base - 0.02 + r() * 0.06;
        p.brush(u * W, v * H, 220 + r() * 200, 30, (r() - 0.5) * 0.1, [210, 10, 88], { alpha: 0.12 + (1 - t) * 0.12, curve: 0.02 });
      }
    }
  };

  // 5 · Bosque en invierno (cuadrado)
  works.bosque = (p) => {
    const { r, noise, W, H, field, brush } = p;
    p.ground([220, 16, 86]);
    field({
      step: 26, len: 160, width: 34, alpha: 0.6,
      angle: (u, v) => (v < 0.62 ? -Math.PI / 2 : 0) + (noise(u * 3, v * 3) - 0.5) * 0.6,
      color: (u, v) => (v < 0.62 ? mix([30, 22, 88], [215, 16, 80], noise(u * 3, v * 3)) : mix([210, 30, 90], [220, 34, 74], noise(u * 5, v * 7) * 0.9)),
    });
    // troncos
    for (let i = 0; i < 46; i++) {
      const u = r();
      const depth = r();
      const x = u * W;
      const w = (6 + depth * 30) ;
      const col = mix([215, 10, 62], [20, 18, 16], depth);
      const footV = 0.6 + depth * 0.3 + (r() - 0.5) * 0.05;
      for (let y = footV * H; y > -40; y -= 40 * p.S) {
        brush(x + Math.sin(y * 0.004 + i) * 6 * p.S, y, 60, w, -Math.PI / 2 + (r() - 0.5) * 0.06, col, { alpha: 0.7, dry: 0.3, curve: 0.02 });
      }
      // sombra azul sobre la nieve
      brush(x + 90 * p.S, footV * H + 6 * p.S, 260, 10 + depth * 10, 0.08, [220, 36, 70], { alpha: 0.35, curve: 0.02 });
    }
    // ramas finas
    for (let i = 0; i < 260; i++) {
      p.brush(r() * W, r() * H * 0.55, 60 + r() * 120, 2.5, -Math.PI / 2 + (r() - 0.5) * 2.2, [20, 14, 26], { alpha: 0.4 });
    }
    // nieve brillante
    for (let i = 0; i < 400; i++) p.dab(r() * W, H * (0.66 + r() * 0.34), 10 + r() * 14, [40, 40, 96], { ang: (r() - 0.5) * 0.3, alpha: 0.5 });
  };

  // 6 · Nocturno con luna y reflejo
  works.nocturno = (p) => {
    const { r, noise, W, H, field, dab, brush } = p;
    p.ground([225, 40, 12]);
    const hz = 0.66;
    const mx = 0.64, my = 0.24;
    field({
      step: 26, len: 170, width: 34, alpha: 0.75,
      angle: (u, v) => (v < hz ? Math.atan2(v - my, u - mx) + Math.PI / 2 : (noise(u * 2, v * 9) - 0.5) * 0.2),
      color: (u, v) => {
        const d = Math.hypot((u - mx) * (W / H), v - my);
        const halo = smooth(0.42, 0.03, d);
        if (v < hz) return mix(mix([228, 42, 14], [222, 34, 30], noise(u * 3, v * 3)), [45, 30, 62], halo * 0.6);
        return mix([225, 40, 10], [222, 30, 24], noise(u * 6, v * 12));
      },
    });
    // luna
    for (let i = 0; i < 260; i++) {
      const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 70 * p.S;
      dab(mx * W + Math.cos(a) * d, my * H + Math.sin(a) * d, 12, [48, 40, 90], { alpha: 0.85, cj: 0.12 });
    }
    // reflejo vertical
    for (let i = 0; i < 520; i++) {
      const v = hz + 0.01 + r() * (1 - hz);
      const spread = 0.02 + (v - hz) * 0.25;
      brush((mx + (r() - 0.5) * spread * 2) * W, v * H, 20 + r() * 70, 4, (r() - 0.5) * 0.06, [46, 42, 76], { alpha: 0.5 });
    }
    // costa y luces cálidas
    for (let i = 0; i < 900; i++) {
      const u = r(), v = hz - 0.03 - noise(u * 3, 1) * 0.06 + r() * 0.04;
      brush(u * W, v * H, 60, 14, (r() - 0.5) * 0.3, [230, 30, 7], { alpha: 0.85 });
    }
    for (let i = 0; i < 28; i++) {
      const u = r() * 0.55 + 0.02, v = hz - 0.02 - r() * 0.03;
      dab(u * W, v * H, 6, [38, 90, 68], { alpha: 0.95 });
      brush(u * W, (v + 0.05 + r() * 0.06) * H, 50, 3, Math.PI / 2, [38, 80, 52], { alpha: 0.35 });
    }
  };

  // 7 · Ventana al norte (interior)
  works.ventana = (p) => {
    const { r, noise, W, H, field, brush, dab } = p;
    p.ground([30, 30, 30]);
    const win = { x0: 0.3, x1: 0.72, y0: 0.12, y1: 0.56 };
    const inWin = (u, v) => u > win.x0 && u < win.x1 && v > win.y0 && v < win.y1;
    field({
      step: 26, len: 120, width: 34, alpha: 0.75,
      angle: (u, v) => (v > 0.7 ? 0.04 : -Math.PI / 2) + (noise(u * 4, v * 4) - 0.5) * 0.6,
      color: (u, v) => {
        if (v > 0.7) return mix([24, 36, 26], [20, 30, 16], noise(u * 4, v * 8));
        const glow = smooth(0.6, 0, Math.hypot(u - 0.5, v - 0.36));
        return mix([30, 26, 26], [38, 40, 58], glow * 0.8 + noise(u * 3, v * 3) * 0.15);
      },
    });
    field({
      step: 18, len: 90, width: 26, alpha: 0.85, mask: inWin,
      angle: (u, v) => (noise(u * 3, v * 3) - 0.5) * 0.6,
      color: (u, v) => mix([200, 20, 86], [45, 40, 92], smooth(win.y0, win.y1, v) * 0.7),
    });
    // marcos de la ventana
    const fr = [28, 22, 18];
    const cx = (win.x0 + win.x1) / 2, cy = (win.y0 + win.y1) / 2;
    brush(cx * W, cy * H, (win.y1 - win.y0) * H / p.S, 12, Math.PI / 2, fr, { alpha: 0.9, curve: 0 });
    brush(cx * W, cy * H, (win.x1 - win.x0) * W / p.S, 12, 0, fr, { alpha: 0.9, curve: 0 });
    // luz derramada sobre la mesa
    for (let i = 0; i < 600; i++) {
      const v = 0.7 + r() * 0.25, u = 0.25 + r() * 0.5 + (v - 0.7) * 0.4;
      brush(u * W, v * H, 70, 10, 0.05, [40, 50, 72], { alpha: 0.25 });
    }
    // jarrón
    const vx = 0.32 * W, vy = 0.64 * H;
    for (let i = 0; i < 260; i++) {
      const t = r();
      const half = (40 + Math.sin(t * Math.PI) * 50) * p.S;
      dab(vx + (r() - 0.5) * half * 2, vy - t * 220 * p.S, 14, mix([200, 20, 40], [200, 20, 70], r() * 0.6), { ang: Math.PI / 2, alpha: 0.85 });
    }
    // borde de la mesa
    brush(W / 2, 0.7 * H, W / p.S * 1.1, 8, 0, [28, 30, 12], { alpha: 0.8, curve: 0 });
  };

  // 8 · Naturaleza muerta con limones
  works.limones = (p) => {
    const { r, noise, W, H, field, brush, dab } = p;
    p.ground([28, 30, 10]);
    field({
      step: 28, len: 140, width: 40, alpha: 0.75,
      angle: (u, v) => (v > 0.6 ? 0.1 : -Math.PI / 2) + (noise(u * 3, v * 3) - 0.5) * 1.2,
      color: (u, v) => mix([28, 30, 9], [32, 34, 22], smooth(0.8, 0, Math.hypot(u - 0.25, v - 0.2)) * 0.8),
    });
    // mantel blanco
    field({
      step: 18, len: 120, width: 26, alpha: 0.85, dry: 0.3,
      mask: (u, v) => v > 0.6 + Math.sin(u * 7) * 0.02,
      angle: (u, v) => (noise(u * 5, v * 3) - 0.5) * 1.4,
      color: (u, v) => mix([40, 26, 92], [215, 14, 62], smooth(0.4, 1, noise(u * 6, v * 4)) * 0.8),
    });
    // cuenco cerámico
    const bx = 0.62 * W, by = 0.6 * H;
    for (let i = 0; i < 520; i++) {
      const a = Math.PI * (0.05 + r() * 0.9);
      const d = Math.sqrt(r());
      const x = bx + Math.cos(a) * 280 * p.S * d, y = by + Math.sin(a) * 140 * p.S * d;
      dab(x, y, 16, mix([200, 30, 30], [200, 20, 62], (Math.cos(a) + 1) / 2 * 0.8), { ang: a + Math.PI / 2, alpha: 0.85 });
    }
    // limones
    const lemons = [
      [0.3, 0.6, 1.0], [0.42, 0.66, 0.85], [0.58, 0.52, 0.9], [0.7, 0.54, 0.8], [0.22, 0.7, 0.7],
    ];
    for (const [lu, lv, sc] of lemons) {
      const cx = lu * W, cy = lv * H, rx = 120 * sc * p.S, ry = 82 * sc * p.S;
      // sombra
      brush(cx + rx * 0.4, cy + ry * 0.95, (rx * 2.2) / p.S, 26 * sc, 0.06, [30, 20, 26], { alpha: 0.45, curve: 0 });
      for (let i = 0; i < 380 * sc; i++) {
        const a = r() * Math.PI * 2, d = Math.sqrt(r());
        const x = cx + Math.cos(a) * rx * d, y = cy + Math.sin(a) * ry * d;
        const light = clamp(0.5 - (Math.cos(a) * d) * 0.5 + (Math.sin(a) * d) * -0.5, 0, 1);
        dab(x, y, 14 * sc + 4, mix([40, 80, 40], [52, 92, 66], light), { ang: a + Math.PI / 2, alpha: 0.9 });
      }
      for (let i = 0; i < 10; i++) dab(cx - rx * 0.35, cy - ry * 0.35, 7, [55, 80, 90], { alpha: 0.8 });
    }
  };

  // 9 · Campo de color: rojo de memoria
  works.rojo = (p) => {
    const { r, noise, W, H, field } = p;
    p.ground([355, 50, 18]);
    field({
      step: 26, len: 200, width: 40, alpha: 0.6,
      angle: (u, v) => (noise(u * 2, v * 2) - 0.5) * 0.8,
      color: (u, v) => mix([352, 52, 18], [8, 50, 26], noise(u * 3, v * 3)),
    });
    const rect = (x0, x1, y0, y1, c1, c2) =>
      field({
        step: 16, len: 160, width: 30, alpha: 0.55, dry: 0.45,
        mask: (u, v) => {
          const e = 0.02 + noise(u * 9, v * 9) * 0.03;
          return u > x0 + e && u < x1 - e && v > y0 + e && v < y1 - e;
        },
        angle: (u, v) => (noise(u * 4, v * 6) - 0.5) * 0.6,
        color: (u, v) => mix(c1, c2, noise(u * 4, v * 4)),
      });
    rect(0.1, 0.9, 0.08, 0.5, [12, 70, 46], [22, 78, 52]);
    rect(0.1, 0.9, 0.56, 0.9, [350, 60, 24], [345, 52, 30]);
    // velo luminoso
    for (let i = 0; i < 400; i++) p.brush(r() * W, (0.1 + r() * 0.38) * H, 260, 40, (r() - 0.5) * 0.2, [28, 80, 62], { alpha: 0.06 });
  };

  // 10 · Estudio en azul (gestual)
  works.azul = (p) => {
    const { r, noise, W, H, field, brush } = p;
    p.ground([40, 24, 90]);
    field({
      step: 28, len: 140, width: 36, alpha: 0.5,
      angle: (u, v) => (noise(u * 2, v * 2) - 0.5) * 2,
      color: (u, v) => mix([40, 26, 90], [36, 18, 80], noise(u * 4, v * 4)),
    });
    // grandes gestos
    const sweeps = 9;
    for (let s = 0; s < sweeps; s++) {
      const cx = W * (0.2 + r() * 0.6), cy = H * (0.2 + r() * 0.6);
      const rad = (300 + r() * 500) * p.S;
      const a0 = r() * Math.PI * 2, a1 = a0 + (0.8 + r() * 1.6) * (r() < 0.5 ? -1 : 1);
      const col = s % 4 === 3 ? [36, 70, 56] : mix([222, 70, 30], [210, 56, 56], r());
      const steps = 40;
      for (let i = 0; i < steps; i++) {
        const t = i / steps;
        const a = lerp(a0, a1, t);
        const x = cx + Math.cos(a) * rad, y = cy + Math.sin(a) * rad;
        brush(x, y, 90, (s % 4 === 3 ? 30 : 70) * (1 - Math.abs(t - 0.5)), a + Math.PI / 2, col, { alpha: 0.75, dry: 0.5, curve: 0.1 });
      }
    }
    // raspados
    for (let i = 0; i < 160; i++) brush(r() * W, r() * H, 200 + r() * 300, 6, (r() - 0.5) * 0.5 + Math.PI / 5, [40, 20, 92], { alpha: 0.35, dry: 0.8 });
    // salpicaduras
    for (let i = 0; i < 120; i++) p.dab(r() * W, r() * H, 4 + r() * 6, [222, 70, 24], { alpha: 0.7 });
  };

  // ───────────────────────── sala de exposición ─────────────────────────
  /** Simula la pintura colgada en una sala, a escala según sus dimensiones reales */
  function room(src, { heightCm, widthCm, seed = 7, dark = false }) {
    const W = 2000, H = 1400;
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const ctx = c.getContext("2d");
    const r = mulberry32(seed);
    const floorY = H * 0.8;
    // pared
    const wall = ctx.createLinearGradient(0, 0, 0, floorY);
    wall.addColorStop(0, dark ? "#2a2826" : "#ebe7df");
    wall.addColorStop(1, dark ? "#1f1d1b" : "#ddd8ce");
    ctx.fillStyle = wall;
    ctx.fillRect(0, 0, W, floorY);
    // cono de luz cenital
    const lg = ctx.createRadialGradient(W / 2, 0, 40, W / 2, H * 0.35, H * 0.75);
    lg.addColorStop(0, dark ? "rgba(255,236,200,0.16)" : "rgba(255,250,240,0.55)");
    lg.addColorStop(1, "rgba(255,250,240,0)");
    ctx.fillStyle = lg;
    ctx.fillRect(0, 0, W, floorY);
    // suelo de madera clara
    const fl = ctx.createLinearGradient(0, floorY, 0, H);
    fl.addColorStop(0, dark ? "#3a2f25" : "#b9a184");
    fl.addColorStop(1, dark ? "#241d17" : "#9c8468");
    ctx.fillStyle = fl;
    ctx.fillRect(0, floorY, W, H - floorY);
    for (let i = 0; i < 70; i++) {
      ctx.strokeStyle = `rgba(60,40,20,${0.04 + r() * 0.06})`;
      ctx.lineWidth = 1 + r() * 2;
      const y = floorY + r() * (H - floorY);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y + (r() - 0.5) * 6);
      ctx.stroke();
    }
    // zócalo
    ctx.fillStyle = dark ? "#1a1816" : "#d3cdc2";
    ctx.fillRect(0, floorY - 14, W, 14);
    // grano de pared
    const img = ctx.getImageData(0, 0, W, floorY);
    for (let i = 0; i < img.data.length; i += 4) {
      const g = (r() - 0.5) * 5;
      img.data[i] += g;
      img.data[i + 1] += g;
      img.data[i + 2] += g;
    }
    ctx.putImageData(img, 0, 0);
    // escala: la pared visible mide ~230 cm de alto hasta el suelo
    const pxPerCm = floorY / 230;
    const pw = widthCm * pxPerCm, ph = heightCm * pxPerCm;
    const centerY = Math.min(floorY - 140 * pxPerCm, floorY - ph / 2 - 30 * pxPerCm); // centro a ~140 cm del suelo (altura de museo)
    const x = (W - pw) / 2, y = centerY - ph / 2;
    ctx.save();
    ctx.shadowColor = "rgba(30,20,10,0.35)";
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 22;
    ctx.fillStyle = "#000";
    ctx.fillRect(x, y, pw, ph);
    ctx.restore();
    ctx.drawImage(src, x, y, pw, ph);
    // canto del bastidor
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.fillRect(x + pw, y + 4, 5, ph - 2);
    // banco
    const bw = 560, bh = 34;
    ctx.fillStyle = dark ? "#0f0e0d" : "#2a2522";
    ctx.fillRect((W - bw) / 2, H * 0.89, bw, bh);
    ctx.fillRect((W - bw) / 2 + 30, H * 0.89 + bh, 14, 70);
    ctx.fillRect((W + bw) / 2 - 44, H * 0.89 + bh, 14, 70);
    ctx.font = "15px sans-serif";
    ctx.fillStyle = dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.32)";
    ctx.textAlign = "right";
    ctx.fillText("DEMO · simulación de sala", W - 24, H - 22);
    return c;
  }

  function crop(src, { x, y, w, h }) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    c.getContext("2d").drawImage(src, x, y, w, h, 0, 0, w, h);
    return c;
  }

  window.__paint = function (spec) {
    const canvas = document.createElement("canvas");
    canvas.width = spec.w;
    canvas.height = spec.h;
    const p = Painter(canvas, spec.seed);
    works[spec.kind](p);
    p.finish(spec.finish || {});
    const clean = crop(canvas, { x: 0, y: 0, w: spec.w, h: spec.h });
    p.mark();
    const out = { main: canvas.toDataURL("image/png") };
    out.details = (spec.details || []).map((d) => {
      const c = crop(clean, { x: Math.round(d[0] * spec.w), y: Math.round(d[1] * spec.h), w: d[2], h: d[3] });
      const ctx = c.getContext("2d");
      ctx.font = "15px sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.shadowColor = "rgba(0,0,0,0.4)";
      ctx.shadowBlur = 2;
      ctx.textAlign = "right";
      ctx.fillText("DEMO · detalle", d[2] - 18, d[3] - 16);
      return c.toDataURL("image/png");
    });
    out.room = room(clean, { heightCm: spec.heightCm, widthCm: spec.widthCm, seed: spec.seed, dark: spec.darkRoom }).toDataURL("image/jpeg", 0.92);
    return out;
  };
})();
