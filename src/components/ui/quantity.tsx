"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 10,
  size = "md",
  label = "Cantidad",
  className,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  label?: string;
  className?: string;
}) {
  const h = size === "sm" ? "h-8" : "h-11";
  const w = size === "sm" ? "w-8" : "w-10";
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("inline-flex items-center rounded-md border border-line-strong bg-surface-2", h, className)}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Disminuir cantidad"
        className={cn("flex h-full items-center justify-center text-fg-muted transition-colors hover:text-fg disabled:opacity-35", w)}
      >
        <Minus className="size-3.5" />
      </button>
      <output aria-live="polite" className={cn("tabular min-w-6 text-center text-sm font-semibold", size === "md" && "min-w-8")}>
        {value}
      </output>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Aumentar cantidad"
        className={cn("flex h-full items-center justify-center text-fg-muted transition-colors hover:text-fg disabled:opacity-35", w)}
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}
