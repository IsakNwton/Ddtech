import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { MotionProvider } from "@/components/motion/motion-provider";
import { getArtist } from "@/lib/data";
import { SITE_INDEXING, SITE_URL } from "@/lib/site";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const artist = await getArtist();
  const title = `${artist.name} — Pintor · Galería de obra original`;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s · ${artist.name}` },
    description: `Galería oficial de ${artist.name}. ${artist.tagline}. Obras originales, colecciones, trayectoria y consultas de adquisición.`,
    applicationName: `${artist.name} · Galería`,
    authors: [{ name: artist.name }],
    creator: artist.name,
    // Mientras haya contenido de demostración no se indexa (SITE_INDEXING=true para activarlo)
    robots: SITE_INDEXING ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: { type: "website", locale: "es_MX", siteName: `${artist.name} · Galería`, title, url: "/" },
    twitter: { card: "summary_large_image", title },
    formatDetection: { telephone: false, email: false, address: false },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f7f4" },
    { media: "(prefers-color-scheme: dark)", color: "#131211" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** Aplica el tema guardado antes de pintar para evitar destellos */
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="light"}})()`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${GeistSans.variable} ${GeistMono.variable} ${display.variable}`} data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh">
        <a
          href="#contenido"
          className="glass glass-strong fixed left-4 top-4 z-[200] -translate-y-24 rounded-full px-5 py-3 text-sm font-medium text-ink transition-transform duration-300 focus:translate-y-0"
        >
          Saltar al contenido
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
