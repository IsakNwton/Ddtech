import type { ArtImage, ArtistProfile, Artwork, Availability, Collection, Inquiry, PublishStatus } from "@/lib/types";
import { placeholderArtist } from "@/content/demo/artist";

/** Filas tal como están en Supabase (snake_case). Ver supabase/migrations. */
export interface ArtworkRow {
  id: string;
  slug: string;
  title: string;
  author: string;
  year: number;
  technique: string;
  materials: string;
  support: string;
  height_cm: number;
  width_cm: number;
  depth_cm: number | null;
  collection_id: string | null;
  collections?: { slug: string } | null;
  style: string;
  concept: string;
  story: string;
  availability: Availability;
  inventory_number: string;
  certificate_included: boolean;
  certificate_note: string | null;
  price_amount: number | null;
  price_currency: string;
  price_visible: boolean;
  image: ArtImage | null;
  gallery: ArtImage[] | null;
  featured: boolean;
  status: PublishStatus;
  sort_order: number;
}

export interface CollectionRow {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string;
  period: string;
  cover_artwork_id: string | null;
  cover?: { slug: string } | null;
  sort_order: number;
  status: PublishStatus;
}

export interface InquiryRow {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  reason: string;
  artwork_slug: string | null;
  artwork_title: string | null;
  message: string;
  status: "nueva" | "atendida";
}

export const ARTWORK_SELECT = "*, collections:collection_id(slug)";
export const COLLECTION_SELECT = "*, cover:cover_artwork_id(slug)";

const EMPTY_IMAGE: ArtImage = { src: "", width: 4, height: 3, alt: "" };

export function toArtwork(r: ArtworkRow): Artwork {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    author: r.author,
    year: r.year,
    technique: r.technique,
    materials: r.materials,
    support: r.support,
    dimensions: { height: Number(r.height_cm), width: Number(r.width_cm), depth: r.depth_cm == null ? null : Number(r.depth_cm) },
    collectionSlug: r.collections?.slug ?? null,
    style: r.style,
    concept: r.concept,
    story: r.story,
    availability: r.availability,
    inventoryNumber: r.inventory_number,
    certificate: { included: r.certificate_included, note: r.certificate_note ?? undefined },
    price: r.price_amount == null ? null : { amount: Number(r.price_amount), currency: r.price_currency, visible: r.price_visible },
    image: r.image ? { ...r.image, alt: r.image.alt || r.title } : { ...EMPTY_IMAGE, alt: r.title },
    gallery: r.gallery ?? [],
    featured: r.featured,
    status: r.status,
    order: r.sort_order,
    isDemo: false,
  };
}

export function toCollection(r: CollectionRow): Collection {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    subtitle: r.subtitle ?? undefined,
    description: r.description,
    period: r.period,
    coverArtworkSlug: r.cover?.slug ?? null,
    order: r.sort_order,
    status: r.status,
    isDemo: false,
  };
}

export function toInquiry(r: InquiryRow): Inquiry {
  return {
    id: r.id,
    createdAt: r.created_at,
    name: r.name,
    email: r.email,
    phone: r.phone,
    reason: r.reason,
    artworkSlug: r.artwork_slug,
    artworkTitle: r.artwork_title,
    message: r.message,
    status: r.status,
  };
}

/** El perfil se guarda como JSON; los campos ausentes se completan con el contenido provisional. */
export function toArtist(data: Partial<ArtistProfile> | null | undefined): ArtistProfile {
  if (!data) return placeholderArtist;
  return { ...placeholderArtist, ...data, quote: { ...placeholderArtist.quote, ...(data.quote ?? {}) } };
}
