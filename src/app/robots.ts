import type { MetadataRoute } from "next";

/** Concepto no oficial: no se permite la indexación. */
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", disallow: "/" }] };
}
