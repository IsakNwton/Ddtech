import { ArtistTeaser } from "@/components/home/artist-teaser";
import { Closing } from "@/components/home/closing";
import { CollectionsPreview } from "@/components/home/collections-preview";
import { FeaturedJourney } from "@/components/home/featured-journey";
import { Hero } from "@/components/home/hero";
import { Statement } from "@/components/home/statement";
import { PageTransition } from "@/components/motion/page-transition";
import { JsonLd } from "@/components/seo/json-ld";
import { getArtist, getArtworks, getCollections, getHeroArtwork } from "@/lib/data";
import { personLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const revalidate = 300;

export default async function HomePage() {
  const [artist, hero, works, collections] = await Promise.all([getArtist(), getHeroArtwork(), getArtworks(), getCollections()]);
  // La obra de portada no se repite en el recorrido (cada nombre de transición debe ser único)
  const featured = works.filter((w) => w.featured && w.slug !== hero?.slug).slice(0, 5);
  const pick = (w: (typeof works)[number]) => ({ slug: w.slug, title: w.title, year: w.year, technique: w.technique, image: w.image, isDemo: w.isDemo });

  return (
    <PageTransition>
      <div>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: `${artist.name} · Galería`,
            url: SITE_URL,
            inLanguage: "es",
            about: personLd(artist),
          }}
        />
        <Hero name={artist.name} tagline={artist.tagline} work={hero ? pick(hero) : null} />
        <Statement text={artist.shortBio} isPlaceholder={artist.isPlaceholder} />
        <FeaturedJourney works={featured.map(pick)} />
        <CollectionsPreview collections={collections.filter((c) => c.works.length > 0)} />
        <ArtistTeaser artist={artist} />
        <Closing />
      </div>
    </PageTransition>
  );
}
