"use client";

import { useCountdown } from "@/hooks/use-countdown";

const pad = (n: number) => String(n).padStart(2, "0");

/** Contador DEMOSTRATIVO (contenido conceptual, no representa una promoción real) */
export function Countdown({ compact }: { compact?: boolean }) {
  const t = useCountdown();
  const cells = [
    { v: t?.days, l: "días" },
    { v: t?.hours, l: "hrs" },
    { v: t?.minutes, l: "min" },
    { v: t?.seconds, l: "seg" },
  ];
  return (
    <div className="flex items-center gap-3">
      <div role="timer" aria-label="Contador demostrativo" className="flex items-center gap-1">
        {cells.map((c, i) => (
          <div key={c.l} className="flex items-center gap-1">
            <span className={`tabular grid place-items-center rounded-md border border-line-strong bg-surface-3 font-mono font-semibold text-fg ${compact ? "h-8 min-w-8 px-1 text-sm" : "h-10 min-w-10 px-1.5 text-base"}`}>
              {t ? pad(c.v!) : "--"}
              <span className="sr-only"> {c.l}</span>
            </span>
            {i < cells.length - 1 && <span className="text-fg-subtle" aria-hidden>:</span>}
          </div>
        ))}
      </div>
      <span className="rounded-xs border border-dashed border-warning/40 px-1.5 py-0.5 text-[10px] font-medium leading-tight text-warning">
        Contador
        <br />
        demostrativo
      </span>
    </div>
  );
}
