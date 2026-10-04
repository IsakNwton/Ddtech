import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const SITE_NAME = "DDTech · Concepto de rediseño";
/** Imagen social (PNG): las redes no admiten SVG */
export const OG_IMAGE = "/og.png";
export const DISCLAIMER = "Concepto de rediseño independiente. No afiliado oficialmente con DDTech.";

export function pageMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  /** Solo imágenes rasterizadas (PNG/JPG) */
  image?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "es_MX",
      type: "website",
      images: [{ url: image ?? OG_IMAGE, width: 1200, height: 630, alt: "DDTech — concepto de rediseño" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image ?? OG_IMAGE] },
  };
}
