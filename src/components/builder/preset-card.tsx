import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import type { PresetSummary } from "@/data/builds";
import { formatPrice } from "@/lib/format";
import { CategoryIcon } from "@/components/layout/category-icon";
import { PerfResolutions } from "./perf-display";

const SHOWN = ["cpu", "gpu", "ram", "storage"] as const;

export function PresetCard({ summary }: { summary: PresetSummary }) {
  const { preset, total, perf } = summary;
  const caseImg = summary.parts.find((p) => p.slot === "case")?.image;
  const gpuImg = summary.parts.find((p) => p.slot === "gpu")?.image;
  return (
    <article className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-lg border border-line bg-surface transition-[border-color,box-shadow] duration-200 hover:border-line-strong hover:shadow-card">
      <div className="stage relative flex h-36 items-end justify-center gap-2 overflow-hidden border-b border-line px-5 pt-4">
        {caseImg && <Image src={caseImg} alt="" width={160} height={120} unoptimized className="h-32 w-auto object-contain transition-transform duration-500 group-hover:scale-105" />}
        {gpuImg && <Image src={gpuImg} alt="" width={160} height={120} unoptimized className="-ml-6 mb-1 h-20 w-auto object-contain transition-transform duration-500 group-hover:-translate-y-1" />}
        <span className="absolute left-3 top-3 rounded-full bg-bg/70 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-fg-muted ring-1 ring-white/5 backdrop-blur">
          {preset.target}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold tracking-[-0.02em] text-fg">{preset.name}</h3>
        <p className="mt-0.5 text-sm text-fg-muted">{preset.tagline}</p>
        <ul className="mt-4 space-y-1.5">
          {SHOWN.map((slot) => {
            const part = summary.parts.find((p) => p.slot === slot);
            if (!part) return null;
            return (
              <li key={slot} className="flex items-center gap-2 text-xs text-fg-muted">
                <CategoryIcon id={slot} className="size-3.5 shrink-0 text-fg-subtle" />
                <span className="truncate">{part.brand} {part.name}</span>
              </li>
            );
          })}
        </ul>
        {perf && (
          <div className="mt-4">
            <p className="mb-1.5 text-2xs font-medium text-fg-subtle">Rendimiento estimado</p>
            <PerfResolutions perf={perf} compact />
          </div>
        )}
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="text-2xs text-fg-subtle">Precio aproximado (demo)</p>
            <p className="tabular text-xl font-bold tracking-[-0.02em] text-fg">{formatPrice(total)}</p>
            <p className="mt-0.5 inline-flex items-center gap-1 text-2xs font-medium text-success">
              <Check className="size-3" strokeWidth={3} aria-hidden /> Compatibilidad verificada
            </p>
          </div>
          <Link
            href={`/arma-tu-pc?preset=${preset.id}`}
            className="relative z-10 inline-flex h-10 items-center gap-1.5 rounded-md border border-line-strong bg-surface-3 px-3.5 text-xs font-semibold uppercase tracking-[0.05em] text-fg transition-colors hover:border-brand hover:bg-brand hover:text-white"
            aria-label={`Personalizar ${preset.name}`}
          >
            Personalizar <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}
