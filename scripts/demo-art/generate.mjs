/**
 * Genera las IMÁGENES DE DEMOSTRACIÓN de la galería.
 *
 *   node scripts/demo-art/generate.mjs
 *
 * Dibuja composiciones abstractas originales con un motor de pinceladas
 * (paint.js) dentro de Chromium y las guarda en public/demo/obras/<slug>/.
 * También escribe src/content/demo/images.generated.json con medidas,
 * color dominante y un placeholder difuminado de cada imagen.
 *
 * Estas imágenes NO son obras del artista. Se reemplazan por las fotografías
 * reales desde el panel de administración (o editando src/content/demo).
 */
import { createRequire } from "node:module";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  ({ chromium } = require("/opt/node-tools/node_modules/playwright"));
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const outDir = path.join(root, "public/demo/obras");

/** [x, y] en fracciones del lienzo, [w, h] en píxeles reales (recorte 1:1) */
const specs = [
  { slug: "el-silencio-del-jardin", kind: "jardin", w: 2400, h: 1600, heightCm: 80, widthCm: 120, seed: 11, details: [[0.18, 0.2, 1100, 820], [0.55, 0.5, 900, 900]] },
  { slug: "marea-de-septiembre", kind: "marea", w: 2400, h: 1600, heightCm: 70, widthCm: 105, seed: 23, details: [[0.45, 0.38, 1100, 820], [0.1, 0.62, 900, 560]] },
  { slug: "llanura-en-ocre", kind: "llanura", w: 2400, h: 1000, heightCm: 60, widthCm: 144, seed: 37, details: [[0.6, 0.18, 900, 640], [0.2, 0.5, 1000, 500]] },
  { slug: "niebla-sobre-el-valle", kind: "niebla", w: 1600, h: 2200, heightCm: 110, widthCm: 80, seed: 41, details: [[0.1, 0.3, 900, 1100], [0.35, 0.62, 900, 700]] },
  { slug: "bosque-en-invierno", kind: "bosque", w: 2000, h: 2000, heightCm: 100, widthCm: 100, seed: 53, details: [[0.3, 0.45, 900, 900], [0.05, 0.1, 800, 1000]] },
  { slug: "nocturno-de-puerto", kind: "nocturno", w: 1700, h: 2300, heightCm: 92, widthCm: 68, seed: 67, details: [[0.4, 0.1, 900, 800], [0.3, 0.6, 1000, 800]], darkRoom: true },
  { slug: "ventana-al-norte", kind: "ventana", w: 1800, h: 2300, heightCm: 115, widthCm: 90, seed: 71, details: [[0.22, 0.12, 1000, 900], [0.18, 0.4, 800, 900]] },
  { slug: "naturaleza-muerta-con-limones", kind: "limones", w: 2400, h: 1800, heightCm: 60, widthCm: 80, seed: 83, details: [[0.18, 0.45, 1000, 700], [0.48, 0.4, 900, 700]] },
  { slug: "rojo-de-memoria", kind: "rojo", w: 1800, h: 2400, heightCm: 120, widthCm: 90, seed: 97, details: [[0.1, 0.3, 900, 900], [0.3, 0.45, 800, 700]], darkRoom: true },
  { slug: "estudio-en-azul", kind: "azul", w: 2200, h: 2200, heightCm: 90, widthCm: 90, seed: 101, details: [[0.25, 0.25, 1000, 800], [0.5, 0.55, 800, 800]] },
];

const toBuf = (dataUrl) => Buffer.from(dataUrl.split(",")[1], "base64");

async function describe(file) {
  const img = sharp(file);
  const meta = await img.metadata();
  const { dominant } = await img.stats();
  const tiny = await sharp(file).resize(16, 16, { fit: "inside" }).jpeg({ quality: 50 }).toBuffer();
  const hex = "#" + [dominant.r, dominant.g, dominant.b].map((v) => v.toString(16).padStart(2, "0")).join("");
  return { width: meta.width, height: meta.height, color: hex, blurDataURL: `data:image/jpeg;base64,${tiny.toString("base64")}` };
}

async function main() {
  const only = process.argv.slice(2);
  const script = await readFile(path.join(path.dirname(fileURLToPath(import.meta.url)), "paint.js"), "utf8");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent("<!doctype html><html><body></body></html>");
  await page.addScriptTag({ content: script });

  const manifestPath = path.join(root, "src/content/demo/images.generated.json");
  let manifest = {};
  try {
    manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  } catch {}

  for (const spec of specs) {
    if (only.length && !only.includes(spec.slug)) continue;
    const t = Date.now();
    const res = await page.evaluate((s) => window.__paint(s), spec);
    const dir = path.join(outDir, spec.slug);
    await mkdir(dir, { recursive: true });
    const files = { principal: path.join(dir, "principal.jpg") };
    await sharp(toBuf(res.main)).jpeg({ quality: 84, mozjpeg: true }).toFile(files.principal);
    for (const [i, d] of res.details.entries()) {
      files[`detalle-${i + 1}`] = path.join(dir, `detalle-${i + 1}.jpg`);
      await sharp(toBuf(d)).jpeg({ quality: 82, mozjpeg: true }).toFile(files[`detalle-${i + 1}`]);
    }
    files.sala = path.join(dir, "sala.jpg");
    await sharp(toBuf(res.room)).jpeg({ quality: 80, mozjpeg: true }).toFile(files.sala);

    const entry = {};
    for (const [key, file] of Object.entries(files)) {
      entry[key] = { src: `/demo/obras/${spec.slug}/${path.basename(file)}`, ...(await describe(file)) };
    }
    manifest[spec.slug] = entry;
    console.log(`✓ ${spec.slug} (${Date.now() - t} ms)`);
  }

  await browser.close();
  await mkdir(path.dirname(manifestPath), { recursive: true });
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
