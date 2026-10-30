import { ExternalLink, LogOut } from "lucide-react";
import Link from "next/link";
import { AdminNav } from "@/components/admin/admin-nav";
import { signOut } from "@/lib/actions/admin";
import { requireAdminPage } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const ctx = await requireAdminPage();
  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-20 sm:px-6 lg:px-10">
      <header className="flex flex-wrap items-center justify-between gap-4 py-6">
        <div>
          <p className="font-display text-3xl leading-none">Panel de la galería</p>
          <p className="mt-1 text-base text-muted-text">{ctx.mode === "live" ? `Sesión: ${ctx.user.email}` : "Modo demostración"}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/" target="_blank" className="press inline-flex min-h-12 items-center gap-2 rounded-xl border-2 border-line-strong bg-paper px-4 text-base">
            <ExternalLink className="size-4" /> Ver el sitio
          </Link>
          {ctx.mode === "live" && (
            <form action={signOut}>
              <button type="submit" className="press inline-flex min-h-12 items-center gap-2 rounded-xl border-2 border-line-strong bg-paper px-4 text-base">
                <LogOut className="size-4" /> Cerrar sesión
              </button>
            </form>
          )}
        </div>
      </header>

      {ctx.mode === "demo" && (
        <div className="mb-8 rounded-2xl border-2 border-gold/60 bg-gold/10 px-5 py-4 text-lg leading-relaxed" role="note">
          <p className="font-medium">Modo demostración — los cambios no se guardan</p>
          <p className="mt-1 text-base text-muted-text">
            Así se verá el panel. Para que funcione de verdad hay que conectar la base de datos y el almacenamiento de fotografías (Supabase). Las instrucciones
            están en el archivo README del proyecto.
          </p>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <AdminNav />
        </aside>
        <main id="contenido">{children}</main>
      </div>
    </div>
  );
}
