import { SITE_URL } from "./site";
import type { ArtistProfile, Artwork, CollectionWithWorks } from "./types";

export const absolute = (path: string) => (path.startsWith("http") ? path : `${SITE_URL}${path}`);

export function personLd(artist: ArtistProfile) {
  return {
    "@type": "Person",
    "@id": `${SITE_URL}/artista#persona`,
    name: artist.name,
    jobTitle: "Pintor",
    url: absolute("/artista"),
  };
}

export function artworkLd(work: Artwork, artist: ArtistProfile) {
  return {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: work.title,
    url: absolute(`/obras/${work.slug}`),
    image: absolute(work.image.src),
    creator: personLd(artist),
    dateCreated: String(work.year),
    artform: "Pintura",
    artMedium: work.technique,
    artworkSurface: work.support,
    height: { "@type": "Distance", name: `${work.dimensions.height} cm` },
    width: { "@type": "Distance", name: `${work.dimensions.width} cm` },
    ...(work.dimensions.depth ? { depth: { "@type": "Distance", name: `${work.dimensions.depth} cm` } } : {}),
    description: work.concept.split(/\n\s*\n/)[0],
    genre: work.style,
    identifier: work.inventoryNumber,
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absolute(it.path) })),
  };
}

export function collectionLd(c: CollectionWithWorks) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: c.title,
    description: c.description.split(/\n\s*\n/)[0],
    url: absolute(`/colecciones/${c.slug}`),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: c.works.length,
      itemListElement: c.works.map((w, i) => ({ "@type": "ListItem", position: i + 1, url: absolute(`/obras/${w.slug}`), name: w.title })),
    },
  };
}
