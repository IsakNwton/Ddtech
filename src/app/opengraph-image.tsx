import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getArtist, getHeroArtwork } from "@/lib/data";

export const alt = "Galería de obra original";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function imageSrc(src: string) {
  if (/^https?:\/\//.test(src)) return src;
  const buf = await readFile(join(process.cwd(), "public", src));
  return `data:image/jpeg;base64,${buf.toString("base64")}`;
}

export default async function OpengraphImage() {
  const [artist, work] = await Promise.all([getArtist(), getHeroArtwork()]);
  const src = work ? await imageSrc(work.image.src) : null;
  const ratio = work ? work.image.width / work.image.height : 1;
  const h = 470;
  const w = Math.min(560, h * ratio);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#F8F7F4", color: "#202020", padding: 80, alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 480 }}>
          <div style={{ display: "flex", fontSize: 18, letterSpacing: 5, textTransform: "uppercase", color: "#85817C" }}>Pintura original</div>
          <div style={{ display: "flex", fontSize: 74, lineHeight: 1, marginTop: 28, letterSpacing: -2 }}>{artist.name}</div>
          <div style={{ display: "flex", fontSize: 30, marginTop: 26, color: "#85817C", fontStyle: "italic" }}>{artist.tagline}</div>
          <div style={{ display: "flex", width: 60, height: 2, background: "#B5A17A", marginTop: 40 }} />
        </div>
        {src && (
          <img src={src} width={w} height={w / ratio} alt="" style={{ boxShadow: "0 30px 60px -20px rgba(30,22,12,0.45)" }} />
        )}
      </div>
    ),
    size,
  );
}
