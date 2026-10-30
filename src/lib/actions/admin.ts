"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { artistFormSchema, artworkFormSchema, collectionFormSchema, firstErrors, type ActionState } from "@/lib/admin-validation";
import { requireAdminAction } from "@/lib/auth";
import { slugify } from "@/lib/format";
import { STORAGE_BUCKET, isSupabaseConfigured, supabaseUrl } from "@/lib/supabase/config";
import { createSessionClient } from "@/lib/supabase/server";
import type { ArtImage } from "@/lib/types";

/**
 * Acciones del panel. TODAS verifican en el servidor que el usuario es
 * administrador (requireAdminAction) y, además, la base de datos aplica RLS.
 */

const refreshSite = () => revalidatePath("/", "layout");

/** Solo se aceptan imágenes del propio bucket (o rutas locales del proyecto) */
function trustedImage(img: ArtImage | null) {
  if (!img) return true;
  return img.src.startsWith("/") || img.src.startsWith(`${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/`);
}

async function uniqueSlug(supabase: Awaited<ReturnType<typeof createSessionClient>>, table: "artworks" | "collections", base: string, id?: string) {
  const root = slugify(base) || "obra";
  for (let i = 0; i < 50; i++) {
    const candidate = i === 0 ? root : `${root}-${i + 1}`;
    let q = supabase.from(table).select("id").eq("slug", candidate);
    if (id) q = q.neq("id", id);
    const { data } = await q.maybeSingle();
    if (!data) return candidate;
  }
  return `${root}-${Date.now()}`;
}

/** Redirección con aviso legible para la persona que administra */
function back(path: string, aviso: string): never {
  redirect(`${path}${path.includes("?") ? "&" : "?"}aviso=${aviso}`);
}

// ───────────────────────────── Obras ─────────────────────────────

export async function saveArtwork(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const auth = await requireAdminAction();
  if (!auth.ok) return { status: "error", message: auth.error };

  const parsed = artworkFormSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Revise los campos marcados en rojo.", errors: firstErrors(parsed.error) };
  const d = parsed.data;

  if (d.intent === "publish" && !d.image) {
    return { status: "error", message: "Para publicar la obra, primero suba su fotografía principal.", errors: { image: "Falta la fotografía principal." } };
  }
  if (!trustedImage(d.image) || !(d.gallery ?? []).every(trustedImage)) {
    return { status: "error", message: "Alguna fotografía no proviene del almacenamiento de la galería. Vuelva a subirla." };
  }

  const { supabase } = auth;
  const isNew = !d.id;
  const slug = await uniqueSlug(supabase, "artworks", d.title, d.id);
  const image = d.image ? { ...d.image, kind: "principal" as const, alt: d.image.alt || `${d.title}, ${d.year}. ${d.technique}.` } : null;

  const row = {
    slug,
    title: d.title,
    year: d.year,
    technique: d.technique,
    materials: d.materials,
    support: d.support,
    height_cm: d.height,
    width_cm: d.width,
    depth_cm: d.depth,
    collection_id: d.collectionId || null,
    style: d.style,
    concept: d.concept,
    story: d.story,
    availability: d.availability,
    inventory_number: d.inventoryNumber || `INV-${d.year}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    certificate_included: d.certificateIncluded,
    certificate_note: d.certificateNote || null,
    price_amount: d.priceAmount,
    price_currency: d.priceCurrency.toUpperCase(),
    price_visible: d.priceVisible,
    featured: d.featured,
    image,
    gallery: (d.gallery ?? []).map((g) => ({ ...g, alt: g.alt || `${g.caption ?? "Fotografía adicional"} de «${d.title}»` })),
    status: d.intent === "publish" ? "publicada" : "borrador",
  };

  let id = d.id;
  if (isNew) {
    const { data: last } = await supabase.from("artworks").select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle();
    const { data, error } = await supabase
      .from("artworks")
      .insert({ ...row, author: await artistName(supabase), sort_order: (last?.sort_order ?? 0) + 1 })
      .select("id")
      .single();
    if (error) return { status: "error", message: `No se pudo guardar: ${error.message}` };
    id = data.id;
  } else {
    const { error } = await supabase.from("artworks").update(row).eq("id", d.id!);
    if (error) return { status: "error", message: `No se pudo guardar: ${error.message}` };
  }

  refreshSite();
  if (isNew) redirect(`/admin/obras/${id}?aviso=${d.intent === "publish" ? "publicada" : "borrador"}`);
  return {
    status: "success",
    message: d.intent === "publish" ? "Cambios guardados. La obra está publicada en la galería." : "Cambios guardados como borrador. La obra no se ve en la galería.",
  };
}

async function artistName(supabase: Awaited<ReturnType<typeof createSessionClient>>) {
  const { data } = await supabase.from("artist_profile").select("data").eq("id", 1).maybeSingle();
  return (data?.data as { name?: string } | null)?.name ?? "";
}

export async function deleteArtwork(formData: FormData) {
  const auth = await requireAdminAction();
  if (!auth.ok) back("/admin/obras", auth.demo ? "demo" : "error");
  const id = String(formData.get("id"));
  const { data } = await auth.supabase.from("artworks").select("image, gallery").eq("id", id).maybeSingle();
  const { error } = await auth.supabase.from("artworks").delete().eq("id", id);
  if (error) back("/admin/obras", "error");
  // Borrar también las fotografías del almacenamiento
  const paths = [data?.image, ...(data?.gallery ?? [])].map((i: ArtImage | null) => i?.storagePath).filter(Boolean) as string[];
  if (paths.length) await auth.supabase.storage.from(STORAGE_BUCKET).remove(paths);
  refreshSite();
  back("/admin/obras", "eliminada");
}

export async function setArtworkStatus(formData: FormData) {
  const auth = await requireAdminAction();
  if (!auth.ok) back("/admin/obras", auth.demo ? "demo" : "error");
  const id = String(formData.get("id"));
  const status = formData.get("status") === "publicada" ? "publicada" : "borrador";
  if (status === "publicada") {
    const { data } = await auth.supabase.from("artworks").select("image").eq("id", id).maybeSingle();
    if (!data?.image) back("/admin/obras", "sin-foto");
  }
  const { error } = await auth.supabase.from("artworks").update({ status }).eq("id", id);
  if (error) back("/admin/obras", "error");
  refreshSite();
  back("/admin/obras", status === "publicada" ? "publicada" : "despublicada");
}

export async function setArtworkAvailability(formData: FormData) {
  const auth = await requireAdminAction();
  if (!auth.ok) back("/admin/obras", auth.demo ? "demo" : "error");
  const parsed = artworkFormSchema.shape.availability.safeParse(formData.get("availability"));
  if (!parsed.success) back("/admin/obras", "error");
  const { error } = await auth.supabase.from("artworks").update({ availability: parsed.data }).eq("id", String(formData.get("id")));
  if (error) back("/admin/obras", "error");
  refreshSite();
  back("/admin/obras", "disponibilidad");
}

/** Sube o baja una posición en el orden de la galería */
export async function moveArtwork(formData: FormData) {
  const auth = await requireAdminAction();
  if (!auth.ok) back("/admin/obras", auth.demo ? "demo" : "error");
  await swapOrder(auth.supabase, "artworks", String(formData.get("id")), formData.get("dir") === "up" ? "up" : "down");
  refreshSite();
  back("/admin/obras", "orden");
}

async function swapOrder(supabase: Awaited<ReturnType<typeof createSessionClient>>, table: "artworks" | "collections", id: string, dir: "up" | "down") {
  const { data: rows } = await supabase.from(table).select("id, sort_order").order("sort_order").order("created_at");
  if (!rows) return;
  // Normaliza el orden (1, 2, 3…) y luego intercambia
  const list = rows.map((r, i) => ({ id: r.id as string, sort_order: i + 1 }));
  const i = list.findIndex((r) => r.id === id);
  const j = dir === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= list.length) return;
  [list[i].sort_order, list[j].sort_order] = [list[j].sort_order, list[i].sort_order];
  await Promise.all(list.map((r) => supabase.from(table).update({ sort_order: r.sort_order }).eq("id", r.id)));
}

// ─────────────────────────── Colecciones ───────────────────────────

export async function saveCollection(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const auth = await requireAdminAction();
  if (!auth.ok) return { status: "error", message: auth.error };
  const parsed = collectionFormSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Revise los campos marcados.", errors: firstErrors(parsed.error) };
  const d = parsed.data;
  const { supabase } = auth;
  const row = {
    slug: await uniqueSlug(supabase, "collections", d.title, d.id),
    title: d.title,
    subtitle: d.subtitle || null,
    description: d.description,
    period: d.period,
    cover_artwork_id: d.coverArtworkId || null,
    status: d.published ? "publicada" : "borrador",
  };
  if (d.id) {
    const { error } = await supabase.from("collections").update(row).eq("id", d.id);
    if (error) return { status: "error", message: `No se pudo guardar: ${error.message}` };
  } else {
    const { data: last } = await supabase.from("collections").select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle();
    const { error } = await supabase.from("collections").insert({ ...row, sort_order: (last?.sort_order ?? 0) + 1 });
    if (error) return { status: "error", message: `No se pudo crear: ${error.message}` };
  }
  refreshSite();
  return { status: "success", message: d.id ? "Colección guardada." : "Colección creada." };
}

export async function deleteCollection(formData: FormData) {
  const auth = await requireAdminAction();
  if (!auth.ok) back("/admin/colecciones", auth.demo ? "demo" : "error");
  const { error } = await auth.supabase.from("collections").delete().eq("id", String(formData.get("id")));
  if (error) back("/admin/colecciones", "error");
  refreshSite();
  back("/admin/colecciones", "eliminada");
}

export async function moveCollection(formData: FormData) {
  const auth = await requireAdminAction();
  if (!auth.ok) back("/admin/colecciones", auth.demo ? "demo" : "error");
  await swapOrder(auth.supabase, "collections", String(formData.get("id")), formData.get("dir") === "up" ? "up" : "down");
  refreshSite();
  back("/admin/colecciones", "orden");
}

// ─────────────────────────── Biografía ───────────────────────────

export async function saveArtist(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const auth = await requireAdminAction();
  if (!auth.ok) return { status: "error", message: auth.error };
  const parsed = artistFormSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Revise los campos marcados.", errors: firstErrors(parsed.error) };
  const d = parsed.data;
  if (!trustedImage(d.portrait)) return { status: "error", message: "El retrato no proviene del almacenamiento de la galería." };
  const data = {
    name: d.name,
    fullName: d.fullName,
    tagline: d.tagline,
    shortBio: d.shortBio,
    biography: d.biography,
    philosophy: d.philosophy,
    quote: { text: d.quoteText, context: d.quoteContext },
    techniques: d.techniques,
    influences: d.influences,
    timeline: d.timeline ?? [],
    exhibitions: d.exhibitions ?? [],
    awards: d.awards ?? [],
    portrait: d.portrait ? { ...d.portrait, alt: d.portrait.alt || `Retrato de ${d.name}` } : null,
    isPlaceholder: false,
  };
  const { error } = await auth.supabase.from("artist_profile").upsert({ id: 1, data });
  if (error) return { status: "error", message: `No se pudo guardar: ${error.message}` };
  refreshSite();
  return { status: "success", message: "Biografía guardada. Los cambios ya se ven en el sitio." };
}

// ─────────────────────────── Mensajes ───────────────────────────

export async function setInquiryStatus(formData: FormData) {
  const auth = await requireAdminAction();
  if (!auth.ok) back("/admin/mensajes", auth.demo ? "demo" : "error");
  const status = formData.get("status") === "atendida" ? "atendida" : "nueva";
  const { error } = await auth.supabase.from("inquiries").update({ status }).eq("id", String(formData.get("id")));
  if (error) back("/admin/mensajes", "error");
  back("/admin/mensajes", "guardado");
}

// ─────────────────────────── Sesión ───────────────────────────

export async function signOut() {
  if (!isSupabaseConfigured()) redirect("/admin");
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/acceso?aviso=salida");
}
