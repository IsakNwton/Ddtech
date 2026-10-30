"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { saveArtist } from "@/lib/actions/admin";
import type { ActionState } from "@/lib/admin-validation";
import type { ArtistProfile } from "@/lib/types";
import { ImageUploader } from "./image-uploader";
import { AdminField, AdminSection, FormMessage, SubmitButton, adminInput } from "./ui";

/** Los textos provisionales (entre corchetes) no se precargan: el formulario empieza limpio */
const real = (s: string | undefined) => (s && !s.trim().startsWith("[") ? s : "");
const realList = (rows: object[]) =>
  (rows as Record<string, string>[]).filter((r) => !Object.values(r).every((v) => String(v).startsWith("[")));

export function ArtistForm({ artist, readOnly }: { artist: ArtistProfile; readOnly: boolean }) {
  const [state, action] = useActionState<ActionState, FormData>(saveArtist, { status: "idle" });
  const e = state.errors ?? {};
  const topRef = useRef<HTMLDivElement>(null);
  const ph = artist.isPlaceholder;

  useEffect(() => {
    if (state.status !== "idle") topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [state]);

  return (
    <form action={action} className="space-y-8">
      <div ref={topRef} className="scroll-mt-28">
        <FormMessage status={state.status} message={state.message} />
      </div>
      <fieldset disabled={readOnly} className="space-y-8">
        <AdminSection step={1} title="Nombre y retrato">
          <div className="grid gap-7 sm:grid-cols-2">
            <AdminField label="Nombre artístico" htmlFor="name" hint="Como firma sus obras. Aparece en la portada." error={e.name}>
              <input id="name" name="name" defaultValue={ph ? "" : artist.name} className={adminInput} aria-invalid={!!e.name} />
            </AdminField>
            <AdminField label="Nombre completo" htmlFor="fullName" optional>
              <input id="fullName" name="fullName" defaultValue={ph ? "" : real(artist.fullName)} className={adminInput} />
            </AdminField>
          </div>
          <AdminField label="Frase de la portada" htmlFor="tagline" optional>
            <input id="tagline" name="tagline" defaultValue={artist.tagline} className={adminInput} />
          </AdminField>
          <AdminField label="Retrato" optional hint="Una fotografía del artista, preferiblemente vertical.">
            <ImageUploader name="portrait" initial={artist.portrait ? [artist.portrait] : []} disabled={readOnly} />
          </AdminField>
        </AdminSection>

        <AdminSection step={2} title="Biografía" description="Para separar párrafos, deje una línea en blanco.">
          <AdminField label="Presentación breve" htmlFor="shortBio" hint="Dos o tres frases. Se muestra en la portada.">
            <textarea id="shortBio" name="shortBio" rows={3} defaultValue={ph ? "" : artist.shortBio} className={`${adminInput} leading-relaxed`} />
          </AdminField>
          <AdminField label="Trayectoria artística" htmlFor="biography">
            <textarea id="biography" name="biography" rows={10} defaultValue={ph ? "" : artist.biography} className={`${adminInput} leading-relaxed`} />
          </AdminField>
          <AdminField label="Filosofía creativa" htmlFor="philosophy" optional>
            <textarea id="philosophy" name="philosophy" rows={5} defaultValue={ph ? "" : artist.philosophy} className={`${adminInput} leading-relaxed`} />
          </AdminField>
          <div className="grid gap-7 sm:grid-cols-[1fr_16rem]">
            <AdminField label="Cita destacada" htmlFor="quoteText" optional hint="Una frase del artista sobre su pintura.">
              <textarea id="quoteText" name="quoteText" rows={3} defaultValue={ph ? "" : artist.quote.text} className={`${adminInput} leading-relaxed`} />
            </AdminField>
            <AdminField label="¿Cuándo o dónde la dijo?" htmlFor="quoteContext" optional>
              <input id="quoteContext" name="quoteContext" defaultValue={ph ? "" : artist.quote.context} className={adminInput} />
            </AdminField>
          </div>
          <div className="grid gap-7 sm:grid-cols-2">
            <AdminField label="Técnicas favoritas" htmlFor="techniques" optional hint="Una por línea.">
              <textarea id="techniques" name="techniques" rows={4} defaultValue={ph ? "" : artist.techniques.join("\n")} className={adminInput} />
            </AdminField>
            <AdminField label="Influencias" htmlFor="influences" optional hint="Una por línea.">
              <textarea id="influences" name="influences" rows={4} defaultValue={ph ? "" : artist.influences.join("\n")} className={adminInput} />
            </AdminField>
          </div>
        </AdminSection>

        <AdminSection step={3} title="Línea del tiempo" description="Momentos importantes de su carrera, en orden.">
          <RepeatableList
            name="timeline"
            addLabel="Añadir un momento"
            initial={realList(artist.timeline)}
            fields={[
              { key: "year", label: "Año", width: "sm:w-32" },
              { key: "title", label: "Título", width: "sm:flex-1" },
              { key: "text", label: "Descripción", width: "w-full", multiline: true },
            ]}
            disabled={readOnly}
          />
        </AdminSection>

        <AdminSection step={4} title="Exposiciones">
          <RepeatableList
            name="exhibitions"
            addLabel="Añadir una exposición"
            initial={realList(artist.exhibitions)}
            fields={[
              { key: "year", label: "Año", width: "sm:w-32" },
              { key: "title", label: "Título de la exposición", width: "sm:flex-1" },
              { key: "venue", label: "Galería o museo", width: "sm:flex-1" },
              { key: "city", label: "Ciudad", width: "sm:w-56" },
              { key: "kind", label: "Individual o colectiva", width: "sm:w-56" },
            ]}
            disabled={readOnly}
          />
        </AdminSection>

        <AdminSection step={5} title="Reconocimientos">
          <RepeatableList
            name="awards"
            addLabel="Añadir un reconocimiento"
            initial={realList(artist.awards)}
            fields={[
              { key: "year", label: "Año", width: "sm:w-32" },
              { key: "title", label: "Reconocimiento", width: "sm:flex-1" },
              { key: "organization", label: "Institución", width: "sm:flex-1" },
            ]}
            disabled={readOnly}
          />
        </AdminSection>
      </fieldset>

      <div className="sticky bottom-3 z-10 rounded-3xl border border-line bg-paper/95 p-4 shadow-[0_10px_40px_-12px_rgb(0_0_0/0.25)] backdrop-blur sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          {readOnly && <p className="mr-auto text-base text-muted-text">Modo demostración: guardar está desactivado.</p>}
          <SubmitButton disabled={readOnly}>Guardar biografía</SubmitButton>
        </div>
      </div>
    </form>
  );
}

type FieldDef = { key: string; label: string; width: string; multiline?: boolean };

function RepeatableList({ name, fields, initial, addLabel, disabled }: { name: string; fields: FieldDef[]; initial: Record<string, string>[]; addLabel: string; disabled?: boolean }) {
  const empty = () => Object.fromEntries(fields.map((f) => [f.key, ""]));
  const [rows, setRows] = useState<Record<string, string>[]>(initial);
  const move = (i: number, d: -1 | 1) =>
    setRows((prev) => {
      const j = i + d;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  return (
    <div className="space-y-4">
      <input type="hidden" name={name} value={JSON.stringify(rows.filter((r) => Object.values(r).some((v) => v.trim())))} />
      {rows.length === 0 && <p className="text-base text-muted-text">Todavía no hay elementos.</p>}
      {rows.map((row, i) => (
        <div key={i} className="rounded-2xl border-2 border-line p-4">
          <div className="flex flex-wrap gap-4">
            {fields.map((f) => (
              <label key={f.key} className={`block w-full ${f.width}`}>
                <span className="mb-1.5 block text-base font-medium">{f.label}</span>
                {f.multiline ? (
                  <textarea
                    rows={2}
                    className={adminInput}
                    value={row[f.key] ?? ""}
                    onChange={(e) => setRows((p) => p.map((r, j) => (j === i ? { ...r, [f.key]: e.target.value } : r)))}
                  />
                ) : (
                  <input
                    className={adminInput}
                    value={row[f.key] ?? ""}
                    onChange={(e) => setRows((p) => p.map((r, j) => (j === i ? { ...r, [f.key]: e.target.value } : r)))}
                  />
                )}
              </label>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => move(i, -1)} disabled={disabled || i === 0} className="press inline-flex min-h-11 items-center gap-1.5 rounded-xl border-2 border-line-strong px-3 text-base disabled:opacity-40">
              <ArrowUp className="size-4" /> Subir
            </button>
            <button type="button" onClick={() => move(i, 1)} disabled={disabled || i === rows.length - 1} className="press inline-flex min-h-11 items-center gap-1.5 rounded-xl border-2 border-line-strong px-3 text-base disabled:opacity-40">
              <ArrowDown className="size-4" /> Bajar
            </button>
            <button
              type="button"
              onClick={() => setRows((p) => p.filter((_, j) => j !== i))}
              disabled={disabled}
              className="press inline-flex min-h-11 items-center gap-1.5 rounded-xl border-2 border-[#a2574a]/60 px-3 text-base text-[#a2574a] disabled:opacity-40"
            >
              <Trash2 className="size-4" /> Quitar
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setRows((p) => [...p, empty()])}
        disabled={disabled}
        className="press inline-flex min-h-14 items-center gap-2 rounded-2xl border-2 border-dashed border-ink/30 px-6 text-lg hover:border-ink disabled:opacity-50"
      >
        <Plus className="size-5" /> {addLabel}
      </button>
    </div>
  );
}
