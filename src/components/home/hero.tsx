import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Cpu, Sparkles } from "lucide-react";
import { HERO_HOTSPOTS, HERO_SIZE } from "@/lib/art";
import { formatPrice } from "@/lib/format";
import type { PresetSummary } from "@/data/builds";
import { ButtonLink } from "@/components/ui/button";
import { POPULAR_SEARCHES } from "@/lib/search";

/**
 * Hero con personalidad pero orientado a vender:
 * - Mensaje + 2 CTAs claros (armar / explorar).
 * - La PC es navegable: cada pieza lleva a su categoría.
 * - Una tarjeta "en vivo" anticipa el configurador con datos reales del motor de compatibilidad.
 */
export function Hero({ featured, fromPrices }: { featured: PresetSummary; fromPrices: Record<string, number> }) {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden border-b border-line">
      <div className="grid-backdrop pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute -right-40 top-10 size-[620px] rounded-full bg-[radial-gradient(circle,rgb(47_95_240/0.20),transparent_62%)] blur-2xl"
        aria-hidden
      />
      <div className="container-page relative grid items-center gap-10 py-10 sm:py-14 lg:grid-cols-[1.02fr_1fr] lg:gap-6 lg:py-16 xl:py-20">
        <div className="max-w-xl animate-fade-up">
          <Link
            href="/arma-tu-pc"
            className="group inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface/80 py-1 pl-1 pr-3 text-xs font-medium text-fg-muted backdrop-blur transition-colors hover:border-brand-line hover:text-fg"
          >
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2 py-0.5 font-semibold text-brand-text">
              <Sparkles className="size-3" aria-hidden /> Nuevo
            </span>
            Configurador con compatibilidad verificada
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
          <h1
            id="hero-title"
            className="mt-6 text-balance text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.045em] text-fg sm:text-[3.25rem] xl:text-[4rem]"
          >
            Construye algo <span className="text-brand-text">increíble.</span>
          </h1>
          <p className="mt-5 max-w-md text-pretty text-base leading-relaxed text-fg-muted sm:text-lg">
            Componentes, PCs y hardware para llevar tu setup al siguiente nivel.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/arma-tu-pc" size="lg" className="uppercase tracking-[0.04em]">
              <Cpu className="size-[18px]" aria-hidden /> Armar mi PC
            </ButtonLink>
            <ButtonLink href="/componentes" size="lg" variant="secondary" className="uppercase tracking-[0.04em]">
              Explorar componentes
            </ButtonLink>
          </div>
          <ul className="mt-8 grid gap-2 text-sm text-fg-muted sm:grid-cols-3 sm:gap-4">
            {["Compatibilidad verificada", "Compara hasta 4 productos", "Total y consumo siempre visibles"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Check className="size-4 shrink-0 text-success" strokeWidth={2.6} aria-hidden />
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-line pt-6">
            <span className="mr-1 text-xs text-fg-subtle">Lo más buscado:</span>
            {POPULAR_SEARCHES.slice(0, 4).map((q) => (
              <Link
                key={q}
                href={`/buscar?q=${encodeURIComponent(q)}`}
                className="rounded-full border border-line px-2.5 py-1 text-xs text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
              >
                {q}
              </Link>
            ))}
          </div>
        </div>

        <HeroVisual featured={featured} fromPrices={fromPrices} />
      </div>
    </section>
  );
}

function HeroVisual({ featured, fromPrices }: { featured: PresetSummary; fromPrices: Record<string, number> }) {
  return (
    <div className="relative mx-auto w-full max-w-[540px] lg:mr-0">
      <div className="relative mx-auto aspect-[600/640] w-[86%] sm:w-[78%] lg:w-[84%]">
        <Image
          src="/art/hero-pc.svg"
          alt="PC gaming armada vista a través del cristal lateral"
          fill
          priority
          unoptimized
          sizes="(min-width: 1024px) 460px, 80vw"
          className="object-contain drop-shadow-[0_40px_60px_rgb(0_0_0/0.6)]"
        />
        {HERO_HOTSPOTS.map((h) => {
          const left = (h.x / HERO_SIZE.w) * 100;
          const top = (h.y / HERO_SIZE.h) * 100;
          const from = fromPrices[h.id];
          const labelLeft = left > 50;
          return (
            <Link
              key={h.id}
              href={h.href}
              style={{ left: `${left}%`, top: `${top}%` }}
              className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full p-2 focus-visible:outline-offset-0"
              aria-label={`${h.label}${from ? `, desde ${formatPrice(from)}` : ""}`}
            >
              <span className="relative grid size-5 place-items-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-brand/40 [animation-duration:2.4s]" aria-hidden />
                <span className="relative size-3 rounded-full border-2 border-white bg-brand shadow-[0_0_0_4px_rgb(47_95_240/0.3)] transition-transform group-hover:scale-125" />
              </span>
              <span
                className={`pointer-events-none absolute top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-md border border-line-strong bg-surface-3/95 px-2.5 py-1.5 text-left opacity-0 shadow-pop backdrop-blur transition-[opacity,transform] duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 sm:block ${labelLeft ? "left-full ml-1 translate-x-1 group-hover:translate-x-0" : "right-full mr-1 -translate-x-1 group-hover:translate-x-0"}`}
              >
                <span className="block text-xs font-semibold text-fg">{h.label}</span>
                {from && <span className="block text-2xs text-fg-muted">desde {formatPrice(from)}</span>}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Tarjeta de estado del build (datos reales del motor) */}
      <div className="relative mt-4 animate-fade-up rounded-lg border border-line-strong bg-surface/90 p-3.5 shadow-pop backdrop-blur-xl [animation-delay:200ms] sm:absolute sm:-left-2 sm:bottom-6 sm:mt-0 sm:w-[250px]">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-subtle">Tu PC · {featured.preset.target}</p>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-success">
          <span className="grid size-4 place-items-center rounded-full bg-success-soft">
            <Check className="size-2.5" strokeWidth={3.5} aria-hidden />
          </span>
          Todo compatible
        </p>
        <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-line pt-3 text-xs sm:grid-cols-2">
          <div>
            <dt className="text-fg-subtle">Consumo est.</dt>
            <dd className="tabular font-semibold text-fg">{featured.watts} W</dd>
          </div>
          <div>
            <dt className="text-fg-subtle">Fuente rec.</dt>
            <dd className="tabular font-semibold text-fg">{featured.psu} W+</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-fg-subtle">Total (demo)</dt>
            <dd className="tabular text-base font-bold text-fg">{formatPrice(featured.total)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
