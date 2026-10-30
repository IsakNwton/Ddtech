"use client";

import { useActionState } from "react";
import { saveCollection } from "@/lib/actions/admin";
import type { ActionState } from "@/lib/admin-validation";
import type { Collection } from "@/lib/types";
import { AdminField, FormMessage, SubmitButton, Toggle, adminInput } from "./ui";

export function CollectionForm({
  collection: c,
  coverId,
  works,
  readOnly,
}: {
  collection?: Collection;
  coverId?: string | null;
  works: { id: string; title: string }[];
  readOnly: boolean;
}) {
  const [state, action] = useActionState<ActionState, FormData>(saveCollection, { status: "idle" });
  const e = state.errors ?? {};
  const p = c?.id ?? "nueva";
  return (
    <form action={action} className="space-y-6">
      <FormMessage status={state.status} message={state.message} />
      {c && <input type="hidden" name="id" value={c.id} />}
      <fieldset disabled={readOnly} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <AdminField label="Nombre de la colección" htmlFor={`${p}-title`} error={e.title}>
            <input id={`${p}-title`} name="title" defaultValue={c?.title} className={adminInput} aria-invalid={!!e.title} />
          </AdminField>
          <AdminField label="Período" htmlFor={`${p}-period`} optional hint="Ej.: 2018 — 2022">
            <input id={`${p}-period`} name="period" defaultValue={c?.period} className={adminInput} />
          </AdminField>
        </div>
        <AdminField label="Subtítulo" htmlFor={`${p}-subtitle`} optional>
          <input id={`${p}-subtitle`} name="subtitle" defaultValue={c?.subtitle} className={adminInput} />
        </AdminField>
        <AdminField label="Descripción" htmlFor={`${p}-description`} optional hint="Deje una línea en blanco para separar párrafos.">
          <textarea id={`${p}-description`} name="description" rows={4} defaultValue={c?.description} className={`${adminInput} leading-relaxed`} />
        </AdminField>
        <AdminField label="Obra de portada" htmlFor={`${p}-cover`} optional hint="Si no elige ninguna, se usa la primera obra de la colección.">
          <select id={`${p}-cover`} name="coverArtworkId" defaultValue={coverId ?? ""} className={adminInput}>
            <option value="">Automática</option>
            {works.map((w) => (
              <option key={w.id} value={w.id}>
                {w.title}
              </option>
            ))}
          </select>
        </AdminField>
        <Toggle name="published" defaultChecked={c ? c.status === "publicada" : true} label="Mostrar esta colección en el sitio" />
      </fieldset>
      <SubmitButton disabled={readOnly}>{c ? "Guardar colección" : "Crear colección"}</SubmitButton>
    </form>
  );
}
