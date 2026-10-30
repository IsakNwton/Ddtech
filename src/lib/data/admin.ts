import "server-only";
import { demoArtworks } from "@/content/demo/artworks";
import { placeholderArtist } from "@/content/demo/artist";
import { demoCollections } from "@/content/demo/collections";
import type { AdminContext } from "@/lib/auth";
import type { ArtistProfile, Artwork, Collection, Inquiry } from "@/lib/types";
import { ARTWORK_SELECT, COLLECTION_SELECT, toArtist, toArtwork, toCollection, toInquiry, type ArtworkRow, type CollectionRow, type InquiryRow } from "./mappers";

/** Lecturas del panel: incluyen borradores. En modo demo devuelven el contenido de ejemplo. */

export async function listArtworksAdmin(ctx: AdminContext): Promise<Artwork[]> {
  if (ctx.mode === "demo") return [...demoArtworks].sort((a, b) => a.order - b.order);
  const { data, error } = await ctx.supabase.from("artworks").select(ARTWORK_SELECT).order("sort_order");
  if (error) throw new Error(error.message);
  return (data as ArtworkRow[]).map(toArtwork);
}

export async function getArtworkAdmin(ctx: AdminContext, id: string): Promise<(Artwork & { collectionId: string | null }) | null> {
  if (ctx.mode === "demo") {
    const w = demoArtworks.find((a) => a.id === id);
    return w ? { ...w, collectionId: demoCollections.find((c) => c.slug === w.collectionSlug)?.id ?? null } : null;
  }
  const { data, error } = await ctx.supabase.from("artworks").select(ARTWORK_SELECT).eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? { ...toArtwork(data as ArtworkRow), collectionId: (data as ArtworkRow).collection_id } : null;
}

export async function listCollectionsAdmin(ctx: AdminContext): Promise<(Collection & { workCount: number })[]> {
  const works = await listArtworksAdmin(ctx);
  const count = (slug: string) => works.filter((w) => w.collectionSlug === slug).length;
  if (ctx.mode === "demo") return demoCollections.map((c) => ({ ...c, workCount: count(c.slug) }));
  const { data, error } = await ctx.supabase.from("collections").select(COLLECTION_SELECT).order("sort_order");
  if (error) throw new Error(error.message);
  return (data as CollectionRow[]).map(toCollection).map((c) => ({ ...c, workCount: count(c.slug) }));
}

export async function getArtistAdmin(ctx: AdminContext): Promise<ArtistProfile> {
  if (ctx.mode === "demo") return placeholderArtist;
  const { data } = await ctx.supabase.from("artist_profile").select("data").eq("id", 1).maybeSingle();
  return toArtist(data?.data);
}

export async function listInquiries(ctx: AdminContext): Promise<Inquiry[]> {
  if (ctx.mode === "demo") return [];
  const { data, error } = await ctx.supabase.from("inquiries").select("*").order("created_at", { ascending: false }).limit(200);
  if (error) throw new Error(error.message);
  return (data as InquiryRow[]).map(toInquiry);
}
