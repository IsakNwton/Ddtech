"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import type { ActionState } from "@/lib/admin-validation";
import { SITE_URL } from "@/lib/site";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSessionClient } from "@/lib/supabase/server";

const emailSchema = z.string().trim().email("Escriba un correo electrónico válido.");

export async function signInWithPassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!isSupabaseConfigured()) return { status: "error", message: "El acceso todavía no está configurado (falta conectar Supabase)." };
  const email = emailSchema.safeParse(formData.get("email"));
  const password = String(formData.get("password") ?? "");
  if (!email.success) return { status: "error", errors: { email: email.error.issues[0].message } };
  if (!password) return { status: "error", errors: { password: "Escriba su contraseña." } };

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({ email: email.data, password });
  if (error) return { status: "error", message: "El correo o la contraseña no son correctos. Revíselos con calma e inténtelo de nuevo." };
  redirect("/admin");
}

export async function sendMagicLink(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!isSupabaseConfigured()) return { status: "error", message: "El acceso todavía no está configurado (falta conectar Supabase)." };
  const email = emailSchema.safeParse(formData.get("email"));
  if (!email.success) return { status: "error", errors: { email: email.error.issues[0].message } };
  const supabase = await createSessionClient();
  // shouldCreateUser: false → solo pueden entrar cuentas creadas previamente
  const { error } = await supabase.auth.signInWithOtp({
    email: email.data,
    options: { shouldCreateUser: false, emailRedirectTo: `${SITE_URL}/admin/auth/callback` },
  });
  if (error) console.error("[acceso] enlace mágico:", error.message);
  // Mismo mensaje exista o no la cuenta (no revela qué correos están registrados)
  return { status: "success", message: "Si el correo está autorizado, en unos minutos recibirá un mensaje con un enlace para entrar. Ábralo desde este mismo dispositivo." };
}
