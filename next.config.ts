import type { NextConfig } from "next";

/** Si Supabase está configurado, se autorizan sus imágenes públicas en next/image */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];
if (supabaseUrl) {
  try {
    const { protocol, hostname } = new URL(supabaseUrl);
    remotePatterns.push({
      protocol: protocol.replace(":", "") as "http" | "https",
      hostname,
      pathname: "/storage/v1/object/public/**",
    });
  } catch {
    // URL inválida: se ignora y la galería usa solo imágenes locales
  }
}

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 90],
    remotePatterns,
  },
  experimental: {
    // Las fotografías de las obras se suben directamente a Supabase Storage desde el navegador;
    // las acciones de servidor solo reciben texto, pero se deja margen para fichas extensas.
    serverActions: { bodySizeLimit: "2mb" },
  },
};

export default nextConfig;
