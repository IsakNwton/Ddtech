/**
 * Configuración general del sitio.
 * Los canales de contacto se leen de variables de entorno: si no están definidos,
 * el sitio los muestra como «pendientes de configurar» en lugar de inventar enlaces.
 */

const clean = (v: string | undefined) => (v && v.trim() ? v.trim() : null);

export const SITE_URL = (clean(process.env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3000").replace(/\/$/, "");

/** Indexación desactivada por defecto mientras el sitio tenga contenido de demostración */
export const SITE_INDEXING = process.env.SITE_INDEXING === "true";

export const LOCALE = "es-MX";

export const contactChannels = {
  email: clean(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  whatsapp: clean(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER)?.replace(/\D/g, "") || null,
  instagram: clean(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
  facebook: clean(process.env.NEXT_PUBLIC_FACEBOOK_URL),
};

export function whatsappLink(text?: string) {
  if (!contactChannels.whatsapp) return null;
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${contactChannels.whatsapp}${q}`;
}

export const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/obras", label: "Obras" },
  { href: "/colecciones", label: "Colecciones" },
  { href: "/artista", label: "El artista" },
  { href: "/contacto", label: "Contacto" },
] as const;
