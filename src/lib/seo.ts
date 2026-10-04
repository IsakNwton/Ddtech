import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const SITE_NAME = "DDTech · Concepto de rediseño";
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
      ...(image ? { images: [{ url: image, width: 480, height: 360 }] } : {}),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
