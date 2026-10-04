"use client";

import { useEffect, useState } from "react";
import { formatRangeValue, type RangeFacet } from "@/lib/filters";

/** Rango con dos controles deslizantes y campos numéricos (teclado y táctil) */
export function RangeFilter({
  facet,
  value,
  onCommit,
}: {
  facet: RangeFacet;
  value?: [number, number];
  onCommit: (v: [number, number] | null) => void;
}) {
  const [lo, setLo] = useState(value?.[0] ?? facet.min);
  const [hi, setHi] = useState(value?.[1] ?? facet.max);

  useEffect(() => {
    // Sincroniza con la URL cuando el filtro cambia desde fuera (chips, limpiar)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLo(value?.[0] ?? facet.min);
    setHi(value?.[1] ?? facet.max);
  }, [value, facet.min, facet.max]);

  const commit = (a: number, b: number) => {
    const x = Math.max(facet.min, Math.min(a, b));
    const y = Math.min(facet.max, Math.max(a, b));
    onCommit(x === facet.min && y === facet.max ? null : [x, y]);
  };

  const pct = (v: number) => ((v - facet.min) / (facet.max - facet.min)) * 100;
  const thumb =
    "pointer-events-none absolute inset-0 h-full w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-[18px] [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-brand [&::-moz-range-thumb]:bg-white";

  return (
    <div className="pt-1">
      <div className="relative h-5">
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-surface-4" />
        <div className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-brand" style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }} />
        <input
          type="range"
          aria-label={`${facet.label} mínimo`}
          min={facet.min}
          max={facet.max}
          step={facet.step}
          value={lo}
          onChange={(e) => setLo(Math.min(Number(e.target.value), hi - facet.step))}
          onPointerUp={() => commit(lo, hi)}
          onKeyUp={() => commit(lo, hi)}
          className={thumb}
        />
        <input
          type="range"
          aria-label={`${facet.label} máximo`}
          min={facet.min}
          max={facet.max}
          step={facet.step}
          value={hi}
          onChange={(e) => setHi(Math.max(Number(e.target.value), lo + facet.step))}
          onPointerUp={() => commit(lo, hi)}
          onKeyUp={() => commit(lo, hi)}
          className={thumb}
        />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {(["min", "max"] as const).map((k) => (
          <label key={k} className="block">
            <span className="text-2xs text-fg-subtle">{k === "min" ? "Mínimo" : "Máximo"}</span>
            <input
              type="number"
              inputMode="numeric"
              min={facet.min}
              max={facet.max}
              step={facet.step}
              value={k === "min" ? lo : hi}
              onChange={(e) => (k === "min" ? setLo(Number(e.target.value)) : setHi(Number(e.target.value)))}
              onBlur={() => commit(lo, hi)}
              onKeyDown={(e) => e.key === "Enter" && commit(lo, hi)}
              className="tabular mt-1 h-9 w-full rounded-md border border-line-strong bg-surface-2 px-2.5 text-sm focus:border-brand-line focus:outline-none"
            />
          </label>
        ))}
      </div>
      <p className="mt-2 text-2xs text-fg-subtle">
        {formatRangeValue(lo, facet.unit)} – {formatRangeValue(hi, facet.unit)}
      </p>
    </div>
  );
}
