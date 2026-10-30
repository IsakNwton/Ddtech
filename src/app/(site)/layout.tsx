import { GlassLight } from "@/components/layout/glass-light";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNav } from "@/components/layout/site-nav";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { dataSource, getArtist } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const artist = await getArtist();
  return (
    <>
      <SmoothScroll />
      <GlassLight />
      <SiteNav artistName={artist.name} />
      <main id="contenido" className="relative">
        {children}
      </main>
      <SiteFooter artistName={artist.name} tagline={artist.tagline} isDemo={dataSource() === "demo"} />
    </>
  );
}
