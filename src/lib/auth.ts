import "server-only";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSessionClient } from "@/lib/supabase/server";

/**
 * Contexto del panel:
 *  - "demo": Supabase no está configurado. El panel se muestra con el contenido
 *    de demostración en modo SOLO LECTURA; ninguna acción guarda datos.
 *  - "live": usuario autenticado y registrado en la tabla `admins`.
 */
export type AdminContext = { mode: "demo" } | { mode: "live"; supabase: SupabaseClient; user: User };

type Check =
  | AdminContext
  | { mode: "anonymous" }
  | { mode: "forbidden"; email: string | undefined };

async function check(): Promise<Check> {
  if (!isSupabaseConfigured()) return { mode: "demo" };
  const supabase = await createSessionClient();
  // getUser() valida el token con Supabase (no confía solo en la cookie)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { mode: "anonymous" };
  const { data, error } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  if (error || !data) return { mode: "forbidden", email: user.email };
  return { mode: "live", supabase, user };
}

/** Para páginas del panel: redirige al acceso si no hay sesión válida de administrador */
export async function requireAdminPage(): Promise<AdminContext> {
  const ctx = await check();
  if (ctx.mode === "anonymous") redirect("/admin/acceso");
  if (ctx.mode === "forbidden") redirect("/admin/acceso?error=sin-permiso");
  return ctx;
}

export const DEMO_MESSAGE =
  "Modo demostración: los cambios no se guardan porque la base de datos (Supabase) todavía no está configurada.";

/** Para acciones de servidor: nunca confía en el cliente */
export async function requireAdminAction(): Promise<{ ok: true; supabase: SupabaseClient; user: User } | { ok: false; error: string; demo?: boolean }> {
  const ctx = await check();
  if (ctx.mode === "demo") return { ok: false, error: DEMO_MESSAGE, demo: true };
  if (ctx.mode === "anonymous") return { ok: false, error: "Su sesión ha caducado. Vuelva a entrar al panel." };
  if (ctx.mode === "forbidden") return { ok: false, error: "Esta cuenta no tiene permiso para administrar la galería." };
  return { ok: true, supabase: ctx.supabase, user: ctx.user };
}
