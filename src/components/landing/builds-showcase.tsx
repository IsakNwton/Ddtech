import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import type { PresetSummary } from "@/data/builds";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { CategoryIcon } from "@/components/layout/category-icon";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

const SHOWN = ["cpu", "gpu", "ram", "storage"] as const;

/** Color de acento por nivel: de frío (entrada) a intenso (tope de gama) */
const TONE: Record<string, { glow: string; bar: string }> = {
  economica: { glow: "#22d3ee", bar: "from-[#22d3ee] to-[#7aa2ff]" },
  "1080p": { glow: "#3b82f6", bar: "from-[#3b82f6] to-[#7aa2ff]" },
  "1440p": { glow: "#6366f1", bar: "from-[#7aa2ff] to-[#a78bfa]" },
  "4k": { glow: "#a855f7", bar: "from-[#a78bfa] to-[#f0abfc]" },
  streaming: { glow: "#ec4899", bar: "from-[#f472b6] to-[#a78bfa]" },
  workstation: { glow: "#f59e0b", bar: "from-[#fbbf24] to-[#fb7185]" },
};

function BuildCard({ summary, featured }: { summary: PresetSummary; featured: boolean }) {
  const { preset, total, perf } = summary;
  const tone = TONE[preset.id] ?? TONE["1440p"];
  const caseImg = summary.parts.find((p) => p.slot === "case")?.image;
  const gpuImg = summary.parts.find((p) => p.slot === "gpu")?.image;

  return (
    <article
      className={cn(
        "group relative isolate flex h-full flex-col overflow-hidden rounded-[28px] border bg-[#090b10] transition-[transform,border-color] duration-500 hover:-translate-y-1",
        featured ? "ring-gradient border-transparent" : "border-white/[0.07] hover:border-white/15",
      )}
    >
      <div className="relative flex h-52 items-end justify-center overflow-hidden px-6 pt-6">
        <span className="absolute inset-x-8 bottom-0 -z-10 h-40 rounded-full opacity-40 blur-3xl transition-opacity duration-700 group-hover:opacity-70" style={{ background: tone.glow }} aria-hidden />
        <div className="grid-backdrop absolute inset-0 -z-10 opacity-50" aria-hidden />
        {caseImg && (
          <Image src={caseImg} alt="" width={220} height={180} unoptimized className="h-44 w-auto object-contain drop-shadow-[0_24px_30px_rgba(0,0,0,0.7)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]" />
        )}
        {gpuImg && (
          <Image src={gpuImg} alt="" width={200} height={150} unoptimized className="-ml-10 mb-2 h-24 w-auto object-contain drop-shadow-[0_20px_24px_rgba(0,0,0,0.7)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2" />
        )}
        <span className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white/70 backdrop-blur">
          {preset.target}
        </span>
        {featured && (
          <span className="absolute right-5 top-5 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#07080a]">Recomendada</span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 pt-5">
        <h3 className="text-xl font-semibold tracking-[-0.03em] text-white">{preset.name}</h3>
        <p className="mt-1 text-sm text-white/50">{preset.tagline}</p>

        <ul className="mt-5 space-y-2">
          {SHOWN.map((slot) => {
            const part = summary.parts.find((p) => p.slot === slot);
            if (!part) return null;
            return (
              <li key={slot} className="flex items-center gap-2.5 text-[13px] text-white/65">
                <CategoryIcon id={slot} className="size-3.5 shrink-0 text-white/35" />
                <span className="truncate">
                  {part.brand} {part.name}
                </span>
              </li>
            );
          })}
        </ul>

        {perf && (
          <div className="mt-6 space-y-2.5">
            {perf.resolutions.map((r) => (
              <div key={r.id} className="grid grid-cols-[3rem_1fr_auto] items-center gap-3">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">{r.id}</span>
                <span className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]" aria-hidden>
                  <span className={cn("block h-full rounded-full bg-gradient-to-r", tone.bar)} style={{ width: `${Math.max(6, r.score)}%` }} />
                </span>
                <span className="text-[11px] font-medium text-white/60">{r.label}</span>
              </div>
            ))}
            <p className="text-[10.5px] text-white/30">Rendimiento orientativo</p>
          </div>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-white/[0.06] pt-5">
          <div>
            <p className="text-[11px] text-white/40">Precio aproximado (demo)</p>
            <p className="tabular text-2xl font-semibold tracking-[-0.04em] text-white">{formatPrice(total)}</p>
            <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-300">
              <Check className="size-3" strokeWidth={3} aria-hidden /> Compatibilidad verificada
            </p>
          </div>
          <Link
            href={`/arma-tu-pc?preset=${preset.id}`}
            aria-label={`Personalizar ${preset.name}`}
            className={cn(
              "inline-flex h-11 items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-colors",
              featured ? "bg-white text-[#07080a] hover:bg-white/85" : "border border-white/15 text-white hover:border-white hover:bg-white hover:text-[#07080a]",
            )}
          >
            Personalizar <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function BuildsShowcase({ presets, featuredId }: { presets: PresetSummary[]; featuredId: string }) {
  return (
    <section aria-labelledby="builds-title" className="container-page">
      <div className="flex flex-wrap items-end justify-between gap-8">
        <SectionHeading id="builds-title" eyebrow="PCs recomendadas" title="Elige tu nivel." accent="Nosotros el resto.">
          Configuraciones balanceadas por objetivo, listas para personalizar. Todas pasan el verificador de compatibilidad.
        </SectionHeading>
        <Reveal>
          <Link href="/pcs-gaming" className="group inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition-colors hover:text-white">
            Ver todas las PCs gaming <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </Reveal>
      </div>
      <ul className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {presets.map((s, i) => (
          <li key={s.preset.id} className="min-w-0">
            <Reveal delay={(i % 3) * 0.08} className="h-full">
              <BuildCard summary={s} featured={s.preset.id === featuredId} />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
