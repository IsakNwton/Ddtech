import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Toaster } from "@/components/feedback/toaster";
import { Providers } from "@/components/providers";
import { MobileSearch } from "@/components/search/mobile-search";
import { DISCLAIMER, SITE_URL } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "DDTech — Componentes, PCs Gaming y hardware (concepto de rediseño)",
    template: "%s · DDTech (concepto)",
  },
  description:
    "Concepto de rediseño de la experiencia de compra de DDTech: componentes, PCs gaming, periféricos y un configurador de PC con verificación de compatibilidad. " +
    DISCLAIMER,
  applicationName: "DDTech Concept",
  // Concepto no oficial: se evita que los buscadores lo indexen como si fuera la tienda real.
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "DDTech · Concepto de rediseño",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "DDTech — concepto de rediseño" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#08090b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-MX" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-dvh">
        <a
          href="#contenido"
          className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition-transform focus:translate-y-0"
        >
          Saltar al contenido
        </a>
        <Providers>
          {children}
          <CartDrawer />
          <MobileSearch />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
