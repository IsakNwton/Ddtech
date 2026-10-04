"use client";

import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { Kbd } from "@/components/ui/kbd";
import { ClearButton, SearchResults } from "./search-results";
import { useSearchCombobox } from "./use-search-combobox";

/** Buscador principal de escritorio: el elemento más importante del header. */
export function SearchBox({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const s = useSearchCombobox({
    onClose: () => {
      setOpen(false);
      inputRef.current?.blur();
    },
  });

  // Atajo "/" para enfocar la búsqueda
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (e.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName) && !el.isContentEditable) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          s.submit(s.query);
        }}
        className={cn(
          "flex h-11 items-center gap-2 rounded-lg border bg-surface-2 pl-3.5 pr-1.5 transition-[border-color,background-color,box-shadow] duration-150",
          open ? "border-brand-line bg-surface shadow-[0_0_0_4px_rgb(47_95_240/0.12)]" : "border-line-strong hover:border-[#3a404a]",
        )}
      >
        <Search className="size-[18px] shrink-0 text-fg-subtle" aria-hidden />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={open}
          aria-controls={s.listId}
          aria-autocomplete="list"
          aria-activedescendant={s.activeId ?? undefined}
          aria-label="Buscar productos"
          placeholder="¿Qué estás buscando?"
          autoComplete="off"
          spellCheck={false}
          value={s.query}
          onChange={(e) => {
            s.setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            s.prefetch();
            setOpen(true);
          }}
          onKeyDown={s.onKeyDown}
          className="h-full min-w-0 flex-1 bg-transparent text-sm text-fg placeholder:text-fg-subtle focus:outline-none"
        />
        {s.query ? <ClearButton onClick={() => s.setQuery("")} /> : <Kbd className="mr-1 hidden xl:inline-flex">/</Kbd>}
        <button
          type="submit"
          className="hidden h-8 items-center rounded-md bg-brand px-3.5 text-xs font-semibold text-white transition-colors hover:bg-brand-hover sm:inline-flex"
        >
          Buscar
        </button>
      </form>
      {open && (
        <div className="absolute inset-x-0 top-[calc(100%+8px)] z-50 max-h-[min(70vh,560px)] animate-scale-in overflow-y-auto rounded-lg border border-line-strong bg-surface shadow-pop">
          <SearchResults
            query={s.query}
            result={s.result}
            ready={s.ready}
            recent={s.recent}
            activeId={s.activeId}
            listId={s.listId}
            onPick={() => {
              s.onPick();
              setOpen(false);
            }}
            onClearRecent={s.clearRecent}
            onHover={s.setActiveId}
          />
        </div>
      )}
    </div>
  );
}
