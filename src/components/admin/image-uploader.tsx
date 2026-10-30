"use client";

/* eslint-disable @next/next/no-img-element -- vistas previas locales y de Supabase en el panel */
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { useId, useRef, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { STORAGE_BUCKET } from "@/lib/supabase/config";
import type { ArtImage, ImageKind } from "@/lib/types";
import { adminInput } from "./ui";

const MAX_SIDE = 4000; // px: suficiente para el zoom en alta resolución
const MAX_MB = 30;
const KIND_LABELS: Record<ImageKind, string> = {
  principal: "Principal",
  detalle: "Detalle",
  sala: "Obra en una sala",
  proceso: "Proceso en el taller",
  reverso: "Reverso / firma",
  otra: "Otra",
};

/** Lee la imagen, la reduce si es enorme y calcula color dominante y miniatura */
async function prepare(file: File) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, width, height);
  const blob: Blob = await new Promise((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error("No se pudo procesar la imagen"))), "image/jpeg", 0.92));

  const tiny = document.createElement("canvas");
  const ts = 16 / Math.max(width, height);
  tiny.width = Math.max(1, Math.round(width * ts));
  tiny.height = Math.max(1, Math.round(height * ts));
  const tctx = tiny.getContext("2d")!;
  tctx.drawImage(bitmap, 0, 0, tiny.width, tiny.height);
  const blurDataURL = tiny.toDataURL("image/jpeg", 0.5);
  const px = tctx.getImageData(0, 0, tiny.width, tiny.height).data;
  let r = 0, g = 0, b = 0;
  for (let i = 0; i < px.length; i += 4) {
    r += px[i];
    g += px[i + 1];
    b += px[i + 2];
  }
  const n = px.length / 4;
  const color = "#" + [r, g, b].map((v) => Math.round(v / n).toString(16).padStart(2, "0")).join("");
  bitmap.close();
  return { blob, width, height, color, blurDataURL };
}

async function upload(file: File): Promise<ArtImage> {
  if (!file.type.startsWith("image/")) throw new Error("El archivo elegido no es una fotografía.");
  if (file.size > MAX_MB * 1024 * 1024) throw new Error(`La fotografía pesa más de ${MAX_MB} MB.`);
  const { blob, width, height, color, blurDataURL } = await prepare(file);
  const supabase = createBrowserSupabase();
  const path = `obras/${new Date().getFullYear()}/${crypto.randomUUID()}.jpg`;
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, blob, { contentType: "image/jpeg", cacheControl: "31536000", upsert: false });
  if (error) throw new Error(`No se pudo subir: ${error.message}`);
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return { src: data.publicUrl, width, height, color, blurDataURL, alt: "", storagePath: path };
}

export function ImageUploader({
  name,
  multiple = false,
  initial,
  disabled,
  error,
}: {
  name: string;
  multiple?: boolean;
  initial: ArtImage[];
  disabled?: boolean;
  error?: string;
}) {
  const [images, setImages] = useState<ArtImage[]>(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setProblem(null);
    const list = Array.from(files).slice(0, multiple ? 12 : 1);
    const added: ArtImage[] = [];
    try {
      for (const [i, f] of list.entries()) {
        setBusy(list.length > 1 ? `Subiendo fotografía ${i + 1} de ${list.length}…` : "Subiendo fotografía…");
        added.push({ ...(await upload(f)), kind: multiple ? "detalle" : "principal" });
      }
    } catch (e) {
      setProblem(e instanceof Error ? e.message : "No se pudo subir la fotografía.");
    } finally {
      setBusy(null);
      if (inputRef.current) inputRef.current.value = "";
    }
    if (added.length) setImages((prev) => (multiple ? [...prev, ...added] : added));
  };

  const update = (i: number, patch: Partial<ArtImage>) => setImages((prev) => prev.map((im, j) => (j === i ? { ...im, ...patch } : im)));
  const move = (i: number, d: -1 | 1) =>
    setImages((prev) => {
      const next = [...prev];
      const j = i + d;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const value = multiple ? JSON.stringify(images) : images[0] ? JSON.stringify(images[0]) : "";

  return (
    <div>
      <input type="hidden" name={name} value={value} />

      {images.length > 0 && (
        <ul className={multiple ? "mb-5 grid gap-4 sm:grid-cols-2" : "mb-5"}>
          {images.map((im, i) => (
            <li key={im.src} className="rounded-2xl border-2 border-line bg-ivory/50 p-3">
              <div className="flex justify-center rounded-xl bg-stone/50 p-3">
                <img src={im.src} alt="" className={multiple ? "max-h-48 w-auto object-contain" : "max-h-[26rem] w-auto object-contain"} style={{ backgroundColor: im.color }} />
              </div>
              <p className="mt-2 text-sm text-muted-text">
                {im.width} × {im.height} píxeles
              </p>
              {multiple ? (
                <div className="mt-3 space-y-3">
                  <input
                    className={adminInput}
                    placeholder="Pie de foto (p. ej. «Detalle de la firma»)"
                    value={im.caption ?? ""}
                    onChange={(e) => update(i, { caption: e.target.value })}
                    disabled={disabled}
                    aria-label="Pie de foto"
                  />
                  <select className={adminInput} value={im.kind ?? "detalle"} onChange={(e) => update(i, { kind: e.target.value as ImageKind })} disabled={disabled} aria-label="Tipo de fotografía">
                    {(Object.keys(KIND_LABELS) as ImageKind[])
                      .filter((k) => k !== "principal")
                      .map((k) => (
                        <option key={k} value={k}>
                          {KIND_LABELS[k]}
                        </option>
                      ))}
                  </select>
                  <div className="flex flex-wrap gap-2">
                    <IconBtn onClick={() => move(i, -1)} disabled={disabled || i === 0} label="Mover antes">
                      <ArrowUp className="size-5" />
                    </IconBtn>
                    <IconBtn onClick={() => move(i, 1)} disabled={disabled || i === images.length - 1} label="Mover después">
                      <ArrowDown className="size-5" />
                    </IconBtn>
                    <IconBtn onClick={() => setImages((p) => p.filter((_, j) => j !== i))} disabled={disabled} label="Quitar" danger>
                      <Trash2 className="size-5" />
                    </IconBtn>
                  </div>
                </div>
              ) : (
                <div className="mt-3">
                  <label htmlFor={`${id}-alt`} className="mb-1.5 block text-base font-medium">
                    Descripción de la imagen <span className="font-normal text-muted-text">(opcional, para personas con discapacidad visual)</span>
                  </label>
                  <input
                    id={`${id}-alt`}
                    className={adminInput}
                    placeholder="Ej.: Jardín en penumbra con flores blancas"
                    value={im.alt}
                    onChange={(e) => update(i, { alt: e.target.value })}
                    disabled={disabled}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple={multiple}
        className="sr-only"
        disabled={disabled || !!busy}
        onChange={(e) => onFiles(e.target.files)}
      />
      <label
        htmlFor={id}
        className={`press flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-6 text-center text-lg transition-colors ${
          disabled ? "cursor-not-allowed border-line text-muted-text" : "border-ink/30 hover:border-ink hover:bg-ink/[0.03]"
        }`}
      >
        {busy ? (
          <>
            <Loader2 className="size-7 animate-spin" />
            <span>{busy}</span>
          </>
        ) : (
          <>
            {images.length && !multiple ? <Upload className="size-7" strokeWidth={1.5} /> : <ImagePlus className="size-7" strokeWidth={1.5} />}
            <span className="font-medium">
              {multiple ? "Añadir fotografías" : images.length ? "Cambiar la fotografía" : "Elegir la fotografía de la obra"}
            </span>
            <span className="text-base text-muted-text">{disabled ? "Disponible cuando se configure Supabase" : "JPG, PNG o WEBP · desde la computadora o el teléfono"}</span>
          </>
        )}
      </label>
      {(problem || error) && (
        <p className="mt-2 text-base font-medium text-[#a2574a]" role="alert">
          {problem ?? error}
        </p>
      )}
    </div>
  );
}

function IconBtn({ children, label, onClick, disabled, danger }: { children: React.ReactNode; label: string; onClick: () => void; disabled?: boolean; danger?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`press inline-flex min-h-12 items-center gap-2 rounded-xl border-2 px-4 text-base disabled:opacity-40 ${danger ? "border-[#a2574a]/60 text-[#a2574a]" : "border-line-strong"}`}
    >
      {children} {label}
    </button>
  );
}
