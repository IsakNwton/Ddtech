"use server";

import { headers } from "next/headers";
import { getArtwork } from "@/lib/data";
import { createServiceClient } from "@/lib/supabase/server";
import { REASONS, fieldErrors, inquirySchema, type InquiryState } from "@/lib/validation";

// Límite básico por IP (en memoria; en despliegues serverless es orientativo)
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

async function sendEmail(subject: string, text: string, replyTo: string) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!key || !to || !from) return null; // no configurado
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], reply_to: replyTo, subject, text }),
  });
  if (!res.ok) console.error("[contacto] Resend respondió", res.status, await res.text().catch(() => ""));
  return res.ok;
}

export async function sendInquiry(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
  const raw = Object.fromEntries(["name", "email", "phone", "reason", "artwork", "message", "consent", "website"].map((k) => [k, String(formData.get(k) ?? "")]));
  const values = { ...raw, consent: undefined, website: undefined };

  const parsed = inquirySchema.safeParse({ ...raw, consent: raw.consent || undefined });
  if (!parsed.success) {
    return { status: "error", message: "Revise los campos marcados.", errors: fieldErrors(parsed.error), values };
  }
  const data = parsed.data;

  // Bot: se responde como si todo fuera bien, sin guardar nada
  if (data.website) return { status: "success", name: data.name };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (rateLimited(ip)) {
    return { status: "error", message: "Ha enviado varias consultas en poco tiempo. Por favor, inténtelo de nuevo en unos minutos.", values };
  }

  const work = data.artwork ? await getArtwork(data.artwork) : null;
  const record = {
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    reason: REASONS[data.reason],
    artwork_slug: work?.slug ?? null,
    artwork_title: work ? `${work.title} (${work.inventoryNumber})` : null,
    message: data.message,
  };

  const results: boolean[] = [];

  // 1) Guardar en Supabase (requiere la clave de servicio, solo en el servidor)
  const db = createServiceClient();
  if (db) {
    const { error } = await db.from("inquiries").insert(record);
    if (error) console.error("[contacto] Error al guardar:", error.message);
    results.push(!error);
  }

  // 2) Aviso por correo (Resend)
  const text = [
    `Nueva consulta desde la galería`,
    ``,
    `Nombre: ${record.name}`,
    `Correo: ${record.email}`,
    record.phone ? `Teléfono: ${record.phone}` : null,
    `Motivo: ${record.reason}`,
    record.artwork_title ? `Obra: ${record.artwork_title}` : null,
    ``,
    record.message,
  ]
    .filter((l) => l !== null)
    .join("\n");
  try {
    const sent = await sendEmail(`Consulta: ${record.reason}${work ? ` — ${work.title}` : ""}`, text, record.email);
    if (sent !== null) results.push(sent);
  } catch (e) {
    console.error("[contacto] Error de correo:", e);
    results.push(false);
  }

  if (results.length === 0) {
    return {
      status: "not_configured",
      message: "El envío automático de mensajes aún no está configurado en este sitio, por lo que su consulta no se ha enviado.",
      values,
    };
  }
  if (!results.some(Boolean)) {
    return { status: "error", message: "No pudimos enviar su consulta por un problema técnico. Por favor, inténtelo de nuevo más tarde.", values };
  }
  return { status: "success", name: data.name };
}
