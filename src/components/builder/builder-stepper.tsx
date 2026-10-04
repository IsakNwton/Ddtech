"use client";

import { Check } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { BUILD_STEPS } from "@/lib/compatibility";
import type { BuildSlot } from "@/lib/types";
import type { ResolvedState } from "./use-build";

export function BuilderStepper({ active, onSelect, state }: { active: BuildSlot; onSelect: (s: BuildSlot) => void; state: ResolvedState }) {
  const listRef = useRef<HTMLOListElement>(null);
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-step="${active}"]`)?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [active]);

  return (
    <nav aria-label="Pasos del configurador">
      <ol ref={listRef} className="flex gap-1.5 overflow-x-auto scrollbar-none lg:grid lg:grid-cols-8 lg:gap-2">
        {BUILD_STEPS.map((s, i) => {
          const done = !!state.build[s.slot];
          const issues = state.issuesFor(s.slot);
          const err = done && issues.some((x) => x.level === "error");
          const warn = done && !err && issues.some((x) => x.level === "warn");
          const isActive = s.slot === active;
          return (
            <li key={s.slot} className="shrink-0">
              <button
                type="button"
                data-step={s.slot}
                onClick={() => onSelect(s.slot)}
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "group relative flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-left transition-[border-color,background-color] duration-150 lg:flex-col lg:items-start lg:gap-1.5 lg:px-3 lg:py-2.5",
                  isActive ? "border-brand bg-brand-soft" : "border-line bg-surface hover:border-line-strong",
                )}
              >
                <span
                  className={cn(
                    "tabular grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-bold transition-colors",
                    err ? "bg-danger text-white" : warn ? "bg-warning text-[#1a1203]" : done ? "bg-success text-[#04130c]" : isActive ? "bg-brand text-white" : "bg-surface-4 text-fg-muted",
                  )}
                >
                  {err ? "!" : warn ? "!" : done ? <Check className="size-3.5" strokeWidth={3.5} aria-hidden /> : i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-fg-subtle">Paso {i + 1}</span>
                  <span className={cn("block whitespace-nowrap text-sm font-medium lg:truncate", isActive ? "text-fg" : "text-fg-muted group-hover:text-fg")}>{s.label}</span>
                </span>
                <span className="sr-only">{err ? "con incompatibilidad" : warn ? "con advertencia" : done ? "completado" : "pendiente"}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
