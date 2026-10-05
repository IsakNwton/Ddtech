import * as THREE from "three";

/**
 * Texturas PBR generadas en el navegador (sin descargas): aluminio cepillado,
 * microtextura de plástico, PCB con pistas, contactos dorados y mallas perforadas.
 * Se crean una sola vez y se reutilizan entre escenas.
 */

const cache = new Map<string, THREE.Texture>();

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")!] as const;
}

function rand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function finalize(c: HTMLCanvasElement, key: string, opts: { srgb?: boolean; repeat?: [number, number] } = {}) {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  if (opts.srgb) t.colorSpace = THREE.SRGBColorSpace;
  if (opts.repeat) t.repeat.set(...opts.repeat);
  cache.set(key, t);
  return t;
}

/** Rugosidad de metal cepillado (líneas horizontales finas) */
export function brushedRoughness(): THREE.Texture {
  const k = "brushed";
  if (cache.has(k)) return cache.get(k)!;
  const [c, g] = canvas(1024, 256);
  const r = rand(7);
  g.fillStyle = "rgb(110,110,110)";
  g.fillRect(0, 0, 1024, 256);
  for (let i = 0; i < 2400; i++) {
    const y = r() * 256;
    const v = 70 + r() * 90;
    g.strokeStyle = `rgba(${v},${v},${v},${0.25 + r() * 0.35})`;
    g.lineWidth = 0.6 + r() * 1.2;
    g.beginPath();
    const x = r() * 1024;
    g.moveTo(x, y);
    g.lineTo(x + 200 + r() * 600, y + (r() - 0.5) * 0.8);
    g.stroke();
  }
  return finalize(c, k);
}

/** Normal map con grano fino (plástico texturizado / pintura en polvo) */
export function grainNormal(): THREE.Texture {
  const k = "grain";
  if (cache.has(k)) return cache.get(k)!;
  const S = 256;
  const [c, g] = canvas(S, S);
  const r = rand(11);
  const h = new Float32Array(S * S);
  for (let i = 0; i < h.length; i++) h[i] = r();
  // Suavizado ligero para que el grano no "parpadee"
  const sm = new Float32Array(S * S);
  for (let y = 0; y < S; y++)
    for (let x = 0; x < S; x++) {
      let a = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) a += h[((y + dy + S) % S) * S + ((x + dx + S) % S)];
      sm[y * S + x] = a / 9;
    }
  const img = g.createImageData(S, S);
  for (let y = 0; y < S; y++)
    for (let x = 0; x < S; x++) {
      const dx = sm[y * S + ((x + 1) % S)] - sm[y * S + ((x - 1 + S) % S)];
      const dy = sm[((y + 1) % S) * S + x] - sm[((y - 1 + S) % S) * S + x];
      const i = (y * S + x) * 4;
      img.data[i] = 128 + dx * 255;
      img.data[i + 1] = 128 + dy * 255;
      img.data[i + 2] = 255;
      img.data[i + 3] = 255;
    }
  g.putImageData(img, 0, 0);
  return finalize(c, k, { repeat: [6, 6] });
}

/** PCB negra con pistas, vías y serigrafía */
export function pcbMap(): THREE.Texture {
  const k = "pcb";
  if (cache.has(k)) return cache.get(k)!;
  const [c, g] = canvas(1024, 1024);
  const r = rand(23);
  g.fillStyle = "#0b0e0c";
  g.fillRect(0, 0, 1024, 1024);
  // Pistas
  for (let i = 0; i < 420; i++) {
    let x = r() * 1024;
    let y = r() * 1024;
    g.strokeStyle = `rgba(${40 + r() * 20},${58 + r() * 20},${46 + r() * 15},0.9)`;
    g.lineWidth = 1 + r() * 2.5;
    g.beginPath();
    g.moveTo(x, y);
    for (let s = 0; s < 4; s++) {
      const len = 20 + r() * 140;
      const dir = Math.floor(r() * 8) * (Math.PI / 4);
      x += Math.cos(dir) * len;
      y += Math.sin(dir) * len;
      g.lineTo(x, y);
    }
    g.stroke();
  }
  // Vías
  for (let i = 0; i < 900; i++) {
    g.fillStyle = "rgba(150,135,90,0.8)";
    g.beginPath();
    g.arc(r() * 1024, r() * 1024, 1.2 + r() * 1.5, 0, Math.PI * 2);
    g.fill();
  }
  // Serigrafía y componentes SMD
  for (let i = 0; i < 160; i++) {
    const x = r() * 1000;
    const y = r() * 1000;
    const w = 6 + r() * 26;
    const h = 4 + r() * 14;
    g.strokeStyle = "rgba(220,225,220,0.35)";
    g.lineWidth = 1;
    g.strokeRect(x, y, w, h);
    g.fillStyle = r() > 0.5 ? "rgba(30,30,32,1)" : "rgba(170,140,90,0.9)";
    g.fillRect(x + 2, y + 2, w - 4, h - 4);
  }
  return finalize(c, k, { srgb: true });
}

/** Contactos dorados del conector PCIe */
export function goldFingers(): THREE.Texture {
  const k = "fingers";
  if (cache.has(k)) return cache.get(k)!;
  const [c, g] = canvas(1024, 64);
  g.fillStyle = "#0b0e0c";
  g.fillRect(0, 0, 1024, 64);
  for (let i = 0; i < 82; i++) {
    if (i === 11) continue;
    const grd = g.createLinearGradient(0, 0, 0, 64);
    grd.addColorStop(0, "#f4d58a");
    grd.addColorStop(1, "#b88a2e");
    g.fillStyle = grd;
    g.fillRect(6 + i * 12.4, 6, 8, 58);
  }
  return finalize(c, k, { srgb: true });
}

/** Máscara alfa de perforaciones hexagonales (rejillas, mallas frontales) */
export function perforatedAlpha(density = 14): THREE.Texture {
  const k = `perf-${density}`;
  if (cache.has(k)) return cache.get(k)!;
  const S = 512;
  const [c, g] = canvas(S, S);
  g.fillStyle = "#fff";
  g.fillRect(0, 0, S, S);
  g.fillStyle = "#000";
  const step = S / density;
  for (let row = 0; row <= density + 1; row++) {
    for (let col = 0; col <= density + 1; col++) {
      const cx = col * step + (row % 2 ? step / 2 : 0);
      const cy = row * step * 0.866;
      g.beginPath();
      for (let a = 0; a < 6; a++) {
        const ang = (Math.PI / 3) * a + Math.PI / 6;
        const px = cx + Math.cos(ang) * step * 0.4;
        const py = cy + Math.sin(ang) * step * 0.4;
        if (a === 0) g.moveTo(px, py);
        else g.lineTo(px, py);
      }
      g.closePath();
      g.fill();
    }
  }
  return finalize(c, k);
}

/** Etiqueta del rotor: anillos concéntricos sutiles */
export function hubDecal(): THREE.Texture {
  const k = "hub";
  if (cache.has(k)) return cache.get(k)!;
  const [c, g] = canvas(256, 256);
  g.fillStyle = "#101114";
  g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 40; i++) {
    g.strokeStyle = `rgba(255,255,255,${0.02 + (i % 3) * 0.012})`;
    g.beginPath();
    g.arc(128, 128, 20 + i * 2.6, 0, Math.PI * 2);
    g.stroke();
  }
  g.strokeStyle = "rgba(200,210,230,0.55)";
  g.lineWidth = 3;
  g.beginPath();
  g.arc(128, 128, 64, -0.6, 0.6);
  g.stroke();
  g.beginPath();
  g.arc(128, 128, 64, Math.PI - 0.6, Math.PI + 0.6);
  g.stroke();
  return finalize(c, k, { srgb: true });
}
