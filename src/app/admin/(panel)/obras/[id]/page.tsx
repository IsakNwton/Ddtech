import { ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArtworkForm } from "@/components/admin/artwork-form";
import { Flash } from "@/components/admin/flash";
import { ConfirmSubmit } from "@/components/admin/ui";
import { deleteArtwork } from "@/lib/actions/admin";
import { requireAdminPage } from "@/lib/auth";
import { getArtworkAdmin, listCollectionsAdmin } from "@/lib/data/admin";

export default async function EditarObra({ params, searchParams }: PageProps<"/admin/obras/[id]">) {
  const ctx = await requireAdminPage();
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const [work, collections] = await Promise.all([getArtworkAdmin(ctx, id), listCollectionsAdmin(ctx)]);
  if (!work) notFound();

  return (
    <div>
      <Link href="/admin/obras" className="text-lg underline underline-offset-4">
        ← Volver a mis pinturas
      </Link>
      <div className="mb-8 mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-5xl">{work.title}</h1>
          <p className="mt-2 text-lg text-muted-text">{work.status === "publicada" ? "Publicada en la galería" : "Borrador: todavía no se ve en la galería"}</p>
        </div>
        {work.status === "publicada" && (
          <Link href={`/obras/${work.slug}`} target="_blank" className="press inline-flex min-h-12 items-center gap-2 rounded-xl border-2 border-line-strong bg-paper px-4 text-base">
            <ExternalLink className="size-4" /> Ver en la galería
          </Link>
        )}
      </div>
      <Flash code={sp.aviso} />
      <ArtworkForm artwork={work} collections={collections.map((c) => ({ id: c.id, title: c.title }))} readOnly={ctx.mode === "demo"} />

      <section className="mt-12 rounded-3xl border-2 border-[#a2574a]/30 bg-paper p-6">
        <h2 className="font-display text-2xl">Eliminar esta pintura</h2>
        <p className="mt-1 text-base text-muted-text">Se borrará de la galería junto con sus fotografías. Esta acción no se puede deshacer. Si solo quiere ocultarla, use «Retirar» en la lista.</p>
        <form action={deleteArtwork} className="mt-5">
          <input type="hidden" name="id" value={work.id} />
          <ConfirmSubmit
            label={
              <>
                <Trash2 className="size-4" /> Eliminar pintura
              </>
            }
            question="¿Seguro que desea eliminarla para siempre?"
            confirmLabel="Sí, eliminar"
          />
        </form>
      </section>
    </div>
  );
}
