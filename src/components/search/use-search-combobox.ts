"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useState, type KeyboardEvent } from "react";
import { clearRecent, pushRecent, readRecent, useSearch } from "@/hooks/use-search";
import { buildOptions } from "./search-results";

/** Estado y teclado compartidos por el buscador de escritorio y el de móvil */
export function useSearchCombobox({ onClose }: { onClose?: () => void } = {}) {
  const router = useRouter();
  const listId = useId();
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [recent, setRecent] = useState<string[]>([]);
  const { result, ready, prefetch } = useSearch(query);

  useEffect(() => {
    // Lectura de localStorage tras el montaje (no disponible en SSR)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecent(readRecent());
  }, []);

  const options = useMemo(() => buildOptions(query, result, recent), [query, result, recent]);

  const submit = (q: string) => {
    const v = q.trim();
    if (!v) return;
    pushRecent(v);
    setRecent(readRecent());
    router.push(`/buscar?q=${encodeURIComponent(v)}`);
    onClose?.();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!options.length) return;
      const idx = options.findIndex((o) => o.id === activeId);
      const next = e.key === "ArrowDown" ? (idx + 1) % options.length : (idx - 1 + options.length) % options.length;
      setActiveId(options[next].id);
      document.getElementById(options[next].id)?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter") {
      e.preventDefault();
      const opt = options.find((o) => o.id === activeId);
      if (opt) {
        if (query.trim()) pushRecent(query);
        router.push(opt.href);
        onClose?.();
      } else submit(query);
    } else if (e.key === "Escape") {
      if (query) setQuery("");
      else onClose?.();
    }
  };

  const onPick = () => {
    if (query.trim()) pushRecent(query);
    onClose?.();
  };

  return {
    query,
    setQuery: (v: string) => {
      setQuery(v);
      setActiveId(null);
    },
    activeId,
    setActiveId,
    listId,
    recent,
    clearRecent: () => {
      clearRecent();
      setRecent([]);
    },
    result,
    ready,
    prefetch,
    onKeyDown,
    onPick,
    submit,
  };
}
