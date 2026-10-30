import type { MetadataRoute } from "next";
import { getArtist } from "@/lib/data";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const artist = await getArtist();
  return {
    name: `${artist.name} · Galería`,
    short_name: artist.name,
    start_url: "/",
    display: "standalone",
    background_color: "#f8f7f4",
    theme_color: "#f8f7f4",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
