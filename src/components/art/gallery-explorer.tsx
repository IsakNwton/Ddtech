"use client";

import { ChevronDown, X } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useMemo } from "react";
import { useQueryParams } from "@/hooks/use-query-state";
import { cn } from "@/lib/cn";
import { availabilityLabel, availabilityOrder } from "@/lib/format";
import { EASE_GALLERY, SPRING_GLASS } from "@/lib/motion";
import type { Availability } from "@/lib/types";
import { ArtworkCard, type CardArtwork } from "./artwork-card";

export type ExplorerArtwork = CardArtwork & { collectionSlug: string | null; order: number };

const SORTS = {
  curatorial: "Orden curatorial",
  recientes: "Más recientes",
  antiguas: "Más antiguas",
} as const;
type Sort = keyof typeof SORTS;

export function GalleryExplorer({ works, collections }: { works: ExplorerArtwork[]; collections: { slug: string; title: string }[] }) {
  const [params, setParams] = useQueryParams();
  const coleccion = params.get("coleccion");
  const tecnica = params.get("tecnica");
  const anio = params.get("anio");
  const disponibilidad = params.get("disponibilidad") as Availability | null;
  const orden = (params.get("orden") as Sort | null) ?? "curatorial";

  const techniques = useMemo(() => [...new Set(works.map((w) => w.technique))].sort((a, b) => a.localeCompare(b, "es")), [works]);
  const years = useMemo(() => [...new Set(works.map((w) => w.year))].sort((a, b) => b - a), [works]);
  const availabilities = useMemo(() => availabilityOrder.filter((a) => works.some((w) => w.availability === a)), [works]);

  const filtered = useMemo(() => {
    const list = works.filter(
      (w) =>
        (!coleccion || w.collectionSlug === coleccion) &&
        (!tecnica || w.technique === tecnica) &&
        (!anio || String(w.year) === anio) &&
        (!disponibilidad || w.availability === disponibilidad),
    );
    if (orden === "recientes") list.sort((a, b) => b.year - a.year || a.order - b.order);
    else if (orden === "antiguas") list.sort((a, b) => a.year - b.year || a.order - b.order);
    else list.sort((a, b) => a.order - b.order);
    return list;
  }, [works, coleccion, tecnica, anio, disponibilidad, orden]);

  const activeCount = [coleccion, tecnica, anio, disponibilidad].filter(Boolean).length;
  const key = [coleccion, tecnica, anio, disponibilidad, orden].join("|");

  return (
    <div>
      {/* Barra de filtros */}
      <div className="relative z-30 -mx-1 mb-12 md:sticky md:top-24">
        <div className="glass glass-strong rounded-[1.75rem] p-2">
          <LayoutGroup id="coleccion">
            <div className="no-scrollbar flex gap-1 overflow-x-auto" role="group" aria-label="Filtrar por colección">
              <Chip active={!coleccion} onClick={() => setParams({ coleccion: null })}>
                Todas
              </Chip>
              {collections.map((c) => (
                <Chip key={c.slug} active={coleccion === c.slug} onClick={() => setParams({ coleccion: c.slug })}>
                  {c.title}
                </Chip>
              ))}
            </div>
          </LayoutGroup>
          <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-line px-1 pt-2">
            <Select label="Técnica" value={tecnica} onChange={(v) => setParams({ tecnica: v })} options={techniques.map((t) => [t, t])} />
            <Select label="Año" value={anio} onChange={(v) => setParams({ anio: v })} options={years.map((y) => [String(y), String(y)])} />
            <Select
              label="Disponibilidad"
              value={disponibilidad}
              onChange={(v) => setParams({ disponibilidad: v })}
              options={availabilities.map((a) => [a, availabilityLabel[a]])}
            />
            <Select
              label="Ordenar"
              value={orden === "curatorial" ? null : orden}
              onChange={(v) => setParams({ orden: v })}
              placeholder={SORTS.curatorial}
              options={(Object.keys(SORTS) as Sort[]).filter((s) => s !== "curatorial").map((s) => [s, SORTS[s]])}
            />
            <AnimatePresence>
              {activeCount > 0 && (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => setParams({ coleccion: null, tecnica: null, anio: null, disponibilidad: null })}
                  className="press inline-flex h-10 items-center gap-1.5 rounded-full px-3.5 text-[0.8125rem] text-muted-text hover:bg-ink/5 hover:text-ink"
                >
                  <X className="size-3.5" strokeWidth={1.75} /> Limpiar filtros
                </motion.button>
              )}
            </AnimatePresence>
            <p className="ml-auto pr-3 text-[0.8125rem] tabular-nums text-muted-text" aria-live="polite">
              {filtered.length} {filtered.length === 1 ? "obra" : "obras"}
            </p>
          </div>
        </div>
      </div>

      {/* Obras */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={key}
          initial={{ opacity: 0, filter: "blur(6px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(4px)", transition: { duration: 0.28, ease: EASE_GALLERY } }}
          transition={{ duration: 0.6, ease: EASE_GALLERY }}
        >
          {filtered.length > 0 ? (
            <div className="masonry columns-1 md:columns-2 xl:columns-3">
              {filtered.map((w, i) => (
                <ArtworkCard key={w.slug} work={w} index={i} priority={i < 2} className="mb-16 md:mb-20" />
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-md py-24 text-center">
              <p className="font-display text-3xl">Ninguna obra coincide</p>
              <p className="mt-3 text-muted-text">Pruebe con otra combinación de filtros.</p>
              <button
                type="button"
                onClick={() => setParams({ coleccion: null, tecnica: null, anio: null, disponibilidad: null })}
                className="press mt-8 inline-flex h-12 items-center rounded-full border border-line-strong px-6 text-sm hover:bg-ink/5"
              >
                Ver todas las obras
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "press relative h-11 shrink-0 rounded-full px-5 text-[0.875rem] transition-colors duration-300",
        active ? "text-paper" : "text-ink-soft hover:text-ink",
      )}
    >
      {active && <motion.span layoutId="chip-active" className="absolute inset-0 rounded-full bg-ink" transition={SPRING_GLASS} aria-hidden />}
      <span className="relative">{children}</span>
    </button>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  placeholder = "Todas",
}: {
  label: string;
  value: string | null;
  onChange: (v: string | null) => void;
  options: [string, string][];
  placeholder?: string;
}) {
  return (
    <label
      className={cn(
        "press relative inline-flex h-10 items-center gap-2 rounded-full border pl-4 pr-9 text-[0.8125rem] transition-colors",
        value ? "border-ink/25 bg-ink/[0.04] text-ink" : "border-line text-ink-soft hover:border-line-strong",
      )}
    >
      <span className="text-muted-text">{label}:</span>
      <span className="max-w-[9rem] truncate">{value ? (options.find(([v]) => v === value)?.[1] ?? value) : placeholder}</span>
      <ChevronDown className="pointer-events-none absolute right-3 size-3.5 text-muted-text" strokeWidth={1.75} aria-hidden />
      <select
        className="absolute inset-0 cursor-pointer appearance-none opacity-0"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        aria-label={label}
      >
        <option value="">{placeholder}</option>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}
