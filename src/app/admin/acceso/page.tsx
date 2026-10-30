import Link from "next/link";
import { redirect } from "next/navigation";
import { Flash } from "@/components/admin/flash";
import { LoginForm } from "@/components/admin/login-form";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  "sin-permiso": "Esta cuenta existe, pero no tiene permiso para administrar la galería.",
  enlace: "El enlace de acceso no es válido o ha caducado. Pida uno nuevo.",
};

export default async function Acceso({ searchParams }: PageProps<"/admin/acceso">) {
  // Sin Supabase no hay acceso real: se muestra directamente el panel en modo demostración
  if (!isSupabaseConfigured()) redirect("/admin");
  const sp = await searchParams;
  const error = typeof sp.error === "string" ? ERRORS[sp.error] : undefined;

  return (
    <main id="contenido" className="grid min-h-dvh place-items-center px-4 py-12">
      <div className="w-full max-w-lg">
        <p className="text-center font-display text-4xl">Panel de la galería</p>
        <p className="mt-2 text-center text-lg text-muted-text">Acceso privado</p>
        <div className="mt-10 rounded-3xl border border-line bg-paper p-6 shadow-[0_20px_60px_-30px_rgb(0_0_0/0.3)] sm:p-9">
          <Flash code={sp.aviso} />
          {error && <p className="mb-6 rounded-2xl border-2 border-[#a2574a]/50 bg-[#a2574a]/[0.08] px-5 py-4 text-lg">{error}</p>}
          <LoginForm />
        </div>
        <p className="mt-8 text-center text-base">
          <Link href="/" className="underline underline-offset-4">
            ← Volver al sitio
          </Link>
        </p>
      </div>
    </main>
  );
}
