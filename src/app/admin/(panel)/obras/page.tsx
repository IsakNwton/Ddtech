import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Flash } from "@/components/admin/flash";
import { SubmitButton } from "@/components/admin/ui";
import { moveArtwork, setArtworkAvailability, setArtworkStatus } from "@/lib/actions/admin";
import { requireAdminPage } from "@/lib/auth";
import { listArtworksAdmin } from "@/lib/data/admin";
import { availabilityLabel, availabilityOrder, formatDimensions } from "@/lib/format";

export default async function AdminObras({ searchParams }: PageProps<"/admin/obras">) {
  const ctx = await requireAdminPage();
  const [works, sp] = await Promise.all([listArtworksAdmin(ctx), searchParams]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-5xl">Mis pinturas</h1>
          <p className="mt-2 text-lg text-muted-text">El orden de esta lista es el orden en que aparecen en la galería.</p>
        </div>
        <Link href="/admin/obras/nueva" className="press inline-flex min-h-14 items-center gap-2 rounded-2xl bg-ink px-6 text-lg text-paper">
          <PlusCircle className="size-5" /> Agregar pintura
        </Link>
      </div>
      <Flash code={sp.aviso} />

      {works.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-line-strong bg-paper p-12 text-center">
          <p className="font-display text-3xl">Todavía no hay pinturas</p>
          <p className="mt-2 text-lg text-muted-text">Empiece agregando la primera.</p>
        </div>
      ) : (
        <ol className="space-y-4">
          {works.map((w, i) => (
            <li key={w.id} className="rounded-3xl border border-line bg-paper p-4 sm:p-5">
              <div className="flex flex-col gap-5 md:flex-row md:items-center">
                <div className="flex items-center gap-4 md:w-[45%]">
                  <span className="w-8 shrink-0 text-center font-display text-2xl text-muted-text">{i + 1}</span>
                  <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-stone" style={{ backgroundColor: w.image.color }}>
                    {w.image.src && <Image src={w.image.src} alt="" fill sizes="96px" className="object-contain" />}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-display text-2xl">{w.title}</p>
                    <p className="text-base text-muted-text">
                      {w.year} · {formatDimensions(w.dimensions)}
                    </p>
                    <span
                      className={`mt-1.5 inline-flex rounded-full px-3 py-0.5 text-sm font-medium ${
                        w.status === "publicada" ? "bg-[#6f8f62]/15 text-[#3f5c36]" : "bg-stone text-muted-text"
                      }`}
                    >
                      {w.status === "publicada" ? "Publicada" : "Borrador (no visible)"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-wrap items-center gap-2 md:justify-end">
                  <form action={setArtworkAvailability} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={w.id} />
                    <label className="sr-only" htmlFor={`disp-${w.id}`}>
                      Disponibilidad de {w.title}
                    </label>
                    <select id={`disp-${w.id}`} name="availability" defaultValue={w.availability} className="min-h-12 rounded-xl border-2 border-line-strong bg-paper px-3 text-base">
                      {availabilityOrder.map((a) => (
                        <option key={a} value={a}>
                          {availabilityLabel[a]}
                        </option>
                      ))}
                    </select>
                    <SubmitButton variant="secondary" className="min-h-12 rounded-xl px-4 text-base">
                      Cambiar
                    </SubmitButton>
                  </form>

                  <Link href={`/admin/obras/${w.id}`} className="press inline-flex min-h-12 items-center gap-2 rounded-xl bg-ink px-5 text-base text-paper">
                    <Pencil className="size-4" /> Editar
                  </Link>

                  <form action={setArtworkStatus}>
                    <input type="hidden" name="id" value={w.id} />
                    <input type="hidden" name="status" value={w.status === "publicada" ? "borrador" : "publicada"} />
                    <SubmitButton variant="secondary" className="min-h-12 rounded-xl px-4 text-base" pendingLabel="…">
                      {w.status === "publicada" ? (
                        <>
                          <EyeOff className="size-4" /> Retirar
                        </>
                      ) : (
                        <>
                          <Eye className="size-4" /> Publicar
                        </>
                      )}
                    </SubmitButton>
                  </form>

                  <form action={moveArtwork} className="flex gap-1">
                    <input type="hidden" name="id" value={w.id} />
                    <button
                      type="submit"
                      name="dir"
                      value="up"
                      disabled={i === 0}
                      className="press grid size-12 place-items-center rounded-xl border-2 border-line-strong disabled:opacity-30"
                      aria-label={`Subir «${w.title}» una posición`}
                      title="Subir"
                    >
                      <ArrowUp className="size-5" />
                    </button>
                    <button
                      type="submit"
                      name="dir"
                      value="down"
                      disabled={i === works.length - 1}
                      className="press grid size-12 place-items-center rounded-xl border-2 border-line-strong disabled:opacity-30"
                      aria-label={`Bajar «${w.title}» una posición`}
                      title="Bajar"
                    >
                      <ArrowDown className="size-5" />
                    </button>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
