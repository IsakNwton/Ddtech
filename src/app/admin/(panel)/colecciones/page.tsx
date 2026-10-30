import { ArrowDown, ArrowUp, ChevronDown, Trash2 } from "lucide-react";
import { CollectionForm } from "@/components/admin/collection-form";
import { Flash } from "@/components/admin/flash";
import { ConfirmSubmit } from "@/components/admin/ui";
import { deleteCollection, moveCollection } from "@/lib/actions/admin";
import { requireAdminPage } from "@/lib/auth";
import { listArtworksAdmin, listCollectionsAdmin } from "@/lib/data/admin";

export default async function AdminColecciones({ searchParams }: PageProps<"/admin/colecciones">) {
  const ctx = await requireAdminPage();
  const [collections, works, sp] = await Promise.all([listCollectionsAdmin(ctx), listArtworksAdmin(ctx), searchParams]);
  const readOnly = ctx.mode === "demo";

  return (
    <div>
      <h1 className="font-display text-5xl">Colecciones</h1>
      <p className="mb-8 mt-2 max-w-2xl text-lg text-muted-text">Agrupe las pinturas en series. Para asignar una pintura a una colección, edite la pintura y elija la colección.</p>
      <Flash code={sp.aviso} />

      <ol className="space-y-4">
        {collections.map((c, i) => {
          const own = works.filter((w) => w.collectionSlug === c.slug);
          const coverId = works.find((w) => w.slug === c.coverArtworkSlug)?.id ?? null;
          return (
            <li key={c.id} className="rounded-3xl border border-line bg-paper">
              <details className="group">
                <summary className="flex cursor-pointer list-none flex-wrap items-center gap-4 p-5 sm:p-6 [&::-webkit-details-marker]:hidden">
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-3xl">{c.title}</p>
                    <p className="text-base text-muted-text">
                      {c.workCount} {c.workCount === 1 ? "pintura" : "pinturas"} · {c.status === "publicada" ? "Visible en el sitio" : "Oculta"}
                    </p>
                  </div>
                  <span className="inline-flex min-h-12 items-center gap-2 rounded-xl border-2 border-line-strong px-4 text-base">
                    Editar <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
                  </span>
                </summary>
                <div className="border-t border-line p-5 sm:p-6">
                  <CollectionForm collection={c} coverId={coverId} works={own.map((w) => ({ id: w.id, title: w.title }))} readOnly={readOnly} />
                  <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-line pt-6">
                    <form action={moveCollection} className="flex gap-2">
                      <input type="hidden" name="id" value={c.id} />
                      <button type="submit" name="dir" value="up" disabled={i === 0} className="press inline-flex min-h-12 items-center gap-2 rounded-xl border-2 border-line-strong px-4 text-base disabled:opacity-30">
                        <ArrowUp className="size-4" /> Subir
                      </button>
                      <button
                        type="submit"
                        name="dir"
                        value="down"
                        disabled={i === collections.length - 1}
                        className="press inline-flex min-h-12 items-center gap-2 rounded-xl border-2 border-line-strong px-4 text-base disabled:opacity-30"
                      >
                        <ArrowDown className="size-4" /> Bajar
                      </button>
                    </form>
                    <form action={deleteCollection} className="ml-auto">
                      <input type="hidden" name="id" value={c.id} />
                      <ConfirmSubmit
                        label={
                          <>
                            <Trash2 className="size-4" /> Eliminar colección
                          </>
                        }
                        question="¿Eliminarla? Las pinturas no se borran; quedarán sin colección."
                        confirmLabel="Sí, eliminar"
                      />
                    </form>
                  </div>
                </div>
              </details>
            </li>
          );
        })}
      </ol>

      <section className="mt-10 rounded-3xl border-2 border-dashed border-line-strong bg-paper p-5 sm:p-8">
        <h2 className="mb-6 font-display text-3xl">Nueva colección</h2>
        <CollectionForm works={works.map((w) => ({ id: w.id, title: w.title }))} readOnly={readOnly} />
      </section>
    </div>
  );
}
