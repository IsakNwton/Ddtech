"use client";

import { useCallback, useDeferredValue, useMemo, useSyncExternalStore } from "react";
import { searchDocs, type SearchDoc } from "@/lib/search";

/* Carga perezosa compartida del índice de búsqueda */
let docs: SearchDoc[] | null = null;
let loading: Promise<void> | null = null;
const listeners = new Set<() => void>();

function load() {
  if (docs || loading) return;
  loading = fetch("/api/search-index")
    .then((r) => r.json())
    .then((d: SearchDoc[]) => {
      docs = d;
      listeners.forEach((l) => l());
    })
    .catch(() => {
      loading = null;
    });
}

export function useSearch(query: string) {
  const index = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => docs,
    () => null,
  );
  const deferred = useDeferredValue(query);
  const result = useMemo(() => (index ? searchDocs(index, deferred) : null), [index, deferred]);
  const prefetch = useCallback(() => load(), []);
  return { result, ready: index !== null, prefetch };
}

const RECENT_KEY = "ddtech-concept:recent-searches";

export function readRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function pushRecent(q: string) {
  const v = q.trim();
  if (!v) return;
  try {
    const list = [v, ...readRecent().filter((x) => x.toLowerCase() !== v.toLowerCase())].slice(0, 5);
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {
    /* almacenamiento no disponible */
  }
}

export function clearRecent() {
  try {
    localStorage.removeItem(RECENT_KEY);
  } catch {
    /* almacenamiento no disponible */
  }
}
