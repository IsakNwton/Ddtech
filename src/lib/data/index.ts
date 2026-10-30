import "server-only";
import { cache } from "react";
import { demoArtworks } from "@/content/demo/artworks";
import { placeholderArtist } from "@/content/demo/artist";
import { demoCollections } from "@/content/demo/collections";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPublicClient } from "@/lib/supabase/server";
import type { ArtistProfile, Artwork, Collection, CollectionWithWorks } from "@/lib/types";
import { ARTWORK_SELECT, COLLECTION_SELECT, toArtist, toArtwork, toCollection, type ArtworkRow, type CollectionRow } from "./mappers";

/**
 * Repositorio de contenido público.
 * - Sin Supabase: contenido de demostración (src/content/demo).
 * - Con Supabase: solo obras y colecciones publicadas (garantizado además por RLS).
 *   El contenido de demostración NO se mezcla con el real.
 */

export const dataSource = (): "demo" | "supabase" => (isSupabaseConfigured() ? "supabase" : "demo");

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

export const getArtworks = cache(async (): Promise<Artwork[]> => {
  if (!isSupabaseConfigured()) return [...demoArtworks].filter((a) => a.status === "publicada").sort(byOrder);
  const { data, error } = await createPublicClient()
    .from("artworks")
    .select(ARTWORK_SELECT)
    .eq("status", "publicada")
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("[galería] Error al leer obras:", error.message);
    return [];
  }
  return (data as ArtworkRow[]).map(toArtwork).filter((a) => a.image.src);
});

export const getArtwork = cache(async (slug: string) => {
  const all = await getArtworks();
  return all.find((a) => a.slug === slug) ?? null;
});

export const getCollectionsRaw = cache(async (): Promise<Collection[]> => {
  if (!isSupabaseConfigured()) return [...demoCollections].sort(byOrder);
  const { data, error } = await createPublicClient()
    .from("collections")
    .select(COLLECTION_SELECT)
    .eq("status", "publicada")
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("[galería] Error al leer colecciones:", error.message);
    return [];
  }
  return (data as CollectionRow[]).map(toCollection);
});

function attach(c: Collection, works: Artwork[]): CollectionWithWorks {
  const own = works.filter((w) => w.collectionSlug === c.slug);
  const coverWork = own.find((w) => w.slug === c.coverArtworkSlug) ?? own[0] ?? null;
  return { ...c, works: own, cover: coverWork?.image ?? null };
}

export const getCollections = cache(async (): Promise<CollectionWithWorks[]> => {
  const [cols, works] = await Promise.all([getCollectionsRaw(), getArtworks()]);
  return cols.map((c) => attach(c, works));
});

export const getCollection = cache(async (slug: string) => {
  const cols = await getCollections();
  return cols.find((c) => c.slug === slug) ?? null;
});

export const getArtist = cache(async (): Promise<ArtistProfile> => {
  if (!isSupabaseConfigured()) return placeholderArtist;
  const { data, error } = await createPublicClient().from("artist_profile").select("data").eq("id", 1).maybeSingle();
  if (error) console.error("[galería] Error al leer el perfil del artista:", error.message);
  return toArtist(data?.data);
});

/** Obra para la portada: la primera destacada, o la primera publicada */
export async function getHeroArtwork() {
  const works = await getArtworks();
  return works.find((w) => w.featured) ?? works[0] ?? null;
}

/** Anterior / siguiente en el orden curatorial (circular) */
export async function getNeighbours(slug: string) {
  const works = await getArtworks();
  const i = works.findIndex((w) => w.slug === slug);
  if (i === -1 || works.length < 2) return { prev: null, next: null };
  return { prev: works[(i - 1 + works.length) % works.length], next: works[(i + 1) % works.length] };
}

export async function getRelated(work: Artwork, limit = 3) {
  const works = await getArtworks();
  const others = works.filter((w) => w.slug !== work.slug);
  const same = others.filter((w) => w.collectionSlug && w.collectionSlug === work.collectionSlug);
  const rest = others.filter((w) => !same.includes(w)).sort((a, b) => Math.abs(a.year - work.year) - Math.abs(b.year - work.year));
  return [...same, ...rest].slice(0, limit);
}
