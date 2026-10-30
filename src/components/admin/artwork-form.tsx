"use client";

import { useActionState, useEffect, useRef } from "react";
import { saveArtwork } from "@/lib/actions/admin";
import type { ActionState } from "@/lib/admin-validation";
import { availabilityLabel, availabilityOrder } from "@/lib/format";
import type { Artwork } from "@/lib/types";
import { ImageUploader } from "./image-uploader";
import { AdminField, AdminSection, FormMessage, SubmitButton, Toggle, adminInput } from "./ui";

type Props = {
  artwork?: (Artwork & { collectionId: string | null }) | null;
  collections: { id: string; title: string }[];
  readOnly: boolean;
};

const AVAILABILITY_HELP: Record<string, string> = {
  disponible: "Se puede adquirir.",
  reservada: "Alguien está interesado; aún no se ha vendido.",
  vendida: "Ya tiene nuevo dueño.",
  "coleccion-privada": "Pertenece a una colección y no está a la venta.",
  "no-disponible": "No está a la venta por ahora.",
};

/** Formulario de obra en pasos numerados, con textos de ayuda en cada campo */
export function ArtworkForm({ artwork: a, collections, readOnly }: Props) {
  const [state, action] = useActionState<ActionState, FormData>(saveArtwork, { status: "idle" });
  const e = state.errors ?? {};
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status !== "idle") topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [state]);

  return (
    <form action={action} className="space-y-8">
      <div ref={topRef} className="scroll-mt-28">
        <FormMessage status={state.status} message={state.message} />
      </div>
      {a && <input type="hidden" name="id" value={a.id} />}

      <fieldset disabled={readOnly} className="space-y-8 disabled:opacity-[0.98]">
        <AdminSection step={1} title="Fotografías" description="Primero, la foto de la pintura completa. Después, si quiere, detalles o fotos de la obra en una sala.">
          <AdminField label="Fotografía principal" hint="La pintura de frente, completa, con buena luz y sin reflejos." error={e.image}>
            <ImageUploader name="image" initial={a?.image?.src ? [a.image] : []} disabled={readOnly} />
          </AdminField>
          <AdminField label="Fotografías adicionales" optional hint="Detalles de la pincelada, la firma, el reverso o la obra colgada.">
            <ImageUploader name="gallery" multiple initial={a?.gallery ?? []} disabled={readOnly} />
          </AdminField>
        </AdminSection>

        <AdminSection step={2} title="Datos principales">
          <AdminField label="Título de la obra" htmlFor="title" error={e.title}>
            <input id="title" name="title" defaultValue={a?.title} className={adminInput} aria-invalid={!!e.title} placeholder="Ej.: El silencio del jardín" required />
          </AdminField>
          <div className="grid gap-7 sm:grid-cols-2">
            <AdminField label="Año en que la pintó" htmlFor="year" error={e.year}>
              <input id="year" name="year" inputMode="numeric" defaultValue={a?.year ?? new Date().getFullYear()} className={adminInput} aria-invalid={!!e.year} />
            </AdminField>
            <AdminField label="Colección" htmlFor="collectionId" optional hint="Puede crear colecciones en «Colecciones».">
              <select id="collectionId" name="collectionId" defaultValue={a?.collectionId ?? ""} className={adminInput}>
                <option value="">Sin colección</option>
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </AdminField>
          </div>
          <div className="grid gap-7 sm:grid-cols-2">
            <AdminField label="Técnica" htmlFor="technique" error={e.technique}>
              <input id="technique" name="technique" list="tecnicas" defaultValue={a?.technique} className={adminInput} aria-invalid={!!e.technique} placeholder="Ej.: Óleo sobre lienzo" />
              <datalist id="tecnicas">
                {["Óleo sobre lienzo", "Óleo sobre tabla", "Acrílico sobre lienzo", "Acuarela sobre papel", "Técnica mixta", "Pastel sobre papel"].map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
            </AdminField>
            <AdminField label="Estilo" htmlFor="style" optional>
              <input id="style" name="style" defaultValue={a?.style} className={adminInput} placeholder="Ej.: Paisaje, retrato, abstracción…" />
            </AdminField>
          </div>
        </AdminSection>

        <AdminSection step={3} title="Ficha técnica" description="Las medidas, en centímetros. Primero el alto y después el ancho.">
          <div className="grid gap-7 sm:grid-cols-3">
            <AdminField label="Alto (cm)" htmlFor="height" error={e.height}>
              <input id="height" name="height" inputMode="decimal" defaultValue={a?.dimensions.height} className={adminInput} aria-invalid={!!e.height} />
            </AdminField>
            <AdminField label="Ancho (cm)" htmlFor="width" error={e.width}>
              <input id="width" name="width" inputMode="decimal" defaultValue={a?.dimensions.width} className={adminInput} aria-invalid={!!e.width} />
            </AdminField>
            <AdminField label="Fondo (cm)" htmlFor="depth" optional error={e.depth}>
              <input id="depth" name="depth" inputMode="decimal" defaultValue={a?.dimensions.depth ?? ""} className={adminInput} />
            </AdminField>
          </div>
          <div className="grid gap-7 sm:grid-cols-2">
            <AdminField label="Materiales" htmlFor="materials" optional>
              <input id="materials" name="materials" defaultValue={a?.materials} className={adminInput} placeholder="Ej.: Óleo, médium de linaza" />
            </AdminField>
            <AdminField label="Soporte" htmlFor="support" optional>
              <input id="support" name="support" defaultValue={a?.support} className={adminInput} placeholder="Ej.: Lienzo sobre bastidor" />
            </AdminField>
          </div>
          <AdminField label="Número de inventario" htmlFor="inventoryNumber" optional hint="Si lo deja vacío, se crea uno automáticamente.">
            <input id="inventoryNumber" name="inventoryNumber" defaultValue={a?.inventoryNumber} className={adminInput} />
          </AdminField>
          <Toggle name="certificateIncluded" defaultChecked={a?.certificate.included ?? true} label="Incluye certificado de autenticidad" />
          <AdminField label="Nota sobre el certificado" htmlFor="certificateNote" optional>
            <input id="certificateNote" name="certificateNote" defaultValue={a?.certificate.note ?? ""} className={adminInput} placeholder="Ej.: Firmado por el artista" />
          </AdminField>
        </AdminSection>

        <AdminSection step={4} title="Textos" description="Escriba con calma. Para separar párrafos, deje una línea en blanco.">
          <AdminField label="Descripción de la obra" htmlFor="concept" optional hint="Qué se ve y qué transmite.">
            <textarea id="concept" name="concept" rows={6} defaultValue={a?.concept} className={`${adminInput} leading-relaxed`} />
          </AdminField>
          <AdminField label="Historia o inspiración" htmlFor="story" optional hint="Cómo nació la obra: un lugar, un recuerdo, una persona…">
            <textarea id="story" name="story" rows={6} defaultValue={a?.isDemo ? "" : a?.story} className={`${adminInput} leading-relaxed`} />
          </AdminField>
        </AdminSection>

        <AdminSection step={5} title="Disponibilidad y precio">
          <fieldset>
            <legend className="mb-3 text-lg font-medium">¿Está disponible?</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {availabilityOrder.map((v) => (
                <label
                  key={v}
                  className="flex cursor-pointer items-start gap-3 rounded-2xl border-2 border-line p-4 transition-colors has-[:checked]:border-ink has-[:checked]:bg-ink/[0.04]"
                >
                  <input type="radio" name="availability" value={v} defaultChecked={(a?.availability ?? "disponible") === v} className="mt-1.5 size-5 accent-[var(--ink)]" />
                  <span>
                    <span className="block text-lg font-medium">{availabilityLabel[v]}</span>
                    <span className="text-base text-muted-text">{AVAILABILITY_HELP[v]}</span>
                  </span>
                </label>
              ))}
            </div>
            {e.availability && <p className="mt-2 text-base text-[#a2574a]">{e.availability}</p>}
          </fieldset>
          <div className="grid gap-7 sm:grid-cols-[1fr_10rem]">
            <AdminField label="Precio" htmlFor="priceAmount" optional hint="Solo números, sin puntos ni símbolos. Ej.: 45000" error={e.priceAmount}>
              <input id="priceAmount" name="priceAmount" inputMode="numeric" defaultValue={a?.price?.amount ?? ""} className={adminInput} />
            </AdminField>
            <AdminField label="Moneda" htmlFor="priceCurrency">
              <select id="priceCurrency" name="priceCurrency" defaultValue={a?.price?.currency ?? "MXN"} className={adminInput}>
                {["MXN", "USD", "EUR"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </AdminField>
          </div>
          <Toggle name="priceVisible" defaultChecked={a?.price?.visible ?? false} label="Mostrar el precio en la página" hint="Si no se marca, los visitantes verán «Precio a consultar»." />
          <Toggle name="featured" defaultChecked={a?.featured ?? false} label="Destacar en la portada" hint="Aparece en el recorrido de obras destacadas del inicio." />
        </AdminSection>
      </fieldset>

      {/* Guardar */}
      <div className="sticky bottom-3 z-10 rounded-3xl border border-line bg-paper/95 p-4 shadow-[0_10px_40px_-12px_rgb(0_0_0/0.25)] backdrop-blur sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          {readOnly && <p className="mr-auto text-base text-muted-text">Modo demostración: guardar está desactivado.</p>}
          <SubmitButton name="intent" value="draft" variant="secondary" disabled={readOnly}>
            Guardar como borrador
          </SubmitButton>
          <SubmitButton name="intent" value="publish" pendingLabel="Publicando…" disabled={readOnly}>
            Guardar y publicar
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}
