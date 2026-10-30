import type { MetadataRoute } from "next";
import { getArtworks, getCollections } from "@/lib/data";
import { absolute } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [works, collections] = await Promise.all([getArtworks(), getCollections()]);
  const now = new Date();
  const page = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({ url: `${SITE_URL}${path}`, lastModified: now, changeFrequency: "monthly", priority });
  return [
    page("/", 1),
    page("/obras", 0.9),
    page("/colecciones", 0.8),
    page("/artista", 0.8),
    page("/contacto", 0.6),
    ...collections.map((c) => page(`/colecciones/${c.slug}`, 0.7)),
    ...works.map((w) => ({ ...page(`/obras/${w.slug}`, 0.8), images: [absolute(w.image.src)] })),
  ];
}
