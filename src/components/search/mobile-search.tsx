"use client";

import { ArrowLeft, Search } from "lucide-react";
import { useEffect, useRef } from "react";
import { useLockBody } from "@/hooks/use-lock-body";
import { useUI } from "@/store/ui";
import { ClearButton, SearchResults } from "./search-results";
import { useSearchCombobox } from "./use-search-combobox";

/** Búsqueda a pantalla completa en móvil: foco inmediato, resultados grandes y táctiles */
export function MobileSearch() {
  const open = useUI((s) => s.searchOpen);
  const setOpen = useUI((s) => s.setSearchOpen);
  const ref = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const s = useSearchCombobox({ onClose: () => setOpen(false) });
  const { prefetch } = s;
  useLockBody(open);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      prefetch();
      requestAnimationFrame(() => inputRef.current?.focus());
    }
    if (!open && d.open) d.close();
  }, [open, prefetch]);

  return (
    <dialog
      ref={ref}
      aria-label="Buscar"
      onCancel={(e) => {
        e.preventDefault();
        setOpen(false);
      }}
      className="m-0 h-dvh max-h-none w-full max-w-none bg-bg p-0 text-fg backdrop:bg-black/60"
    >
      {open && (
        <div className="flex h-full animate-fade-in flex-col">
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              s.submit(s.query);
            }}
            className="flex shrink-0 items-center gap-2 border-b border-line px-2 py-2"
          >
            <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar búsqueda" className="inline-flex size-10 items-center justify-center rounded-md text-fg-muted">
              <ArrowLeft className="size-5" />
            </button>
            <div className="flex h-11 flex-1 items-center gap-2 rounded-lg border border-brand-line bg-surface-2 px-3">
              <Search className="size-4 text-fg-subtle" aria-hidden />
              <input
                ref={inputRef}
                type="search"
                role="combobox"
                aria-expanded
                aria-controls={s.listId}
                aria-activedescendant={s.activeId ?? undefined}
                aria-label="Buscar productos"
                enterKeyHint="search"
                placeholder="¿Qué estás buscando?"
                autoComplete="off"
                value={s.query}
                onChange={(e) => s.setQuery(e.target.value)}
                onKeyDown={s.onKeyDown}
                className="h-full min-w-0 flex-1 bg-transparent text-base text-fg placeholder:text-fg-subtle focus:outline-none"
              />
              {s.query && <ClearButton onClick={() => s.setQuery("")} />}
            </div>
          </form>
          <div className="flex-1 overflow-y-auto overscroll-contain pb-8">
            <SearchResults
              query={s.query}
              result={s.result}
              ready={s.ready}
              recent={s.recent}
              activeId={s.activeId}
              listId={s.listId}
              onPick={s.onPick}
              onClearRecent={s.clearRecent}
              onHover={s.setActiveId}
            />
          </div>
        </div>
      )}
    </dialog>
  );
}
