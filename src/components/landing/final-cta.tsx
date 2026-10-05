import { ArrowRight, Cpu } from "lucide-react";
import { MagneticLink } from "./magnetic";
import { Reveal, SplitHeading } from "./reveal";

export function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="container-page">
      <div className="relative isolate overflow-hidden rounded-[40px] border border-white/[0.08] bg-[#090a0e] px-6 py-24 text-center sm:px-12 sm:py-32">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[900px] -translate-x-1/2 -translate-y-1/2 animate-spin-slow rounded-full [transform:translate(-50%,-50%)] bg-[conic-gradient(from_0deg,#4d7cff33,#7c5cff22,#c084fc33,#4d7cff33)] blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_50%_100%,rgba(77,124,255,0.25),transparent)]" aria-hidden />
        <div className="grid-backdrop pointer-events-none absolute inset-0 -z-10 opacity-60" aria-hidden />
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-[#8aa6ff]">Tu próxima PC</p>
        <SplitHeading
          className="mx-auto mt-5 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.055em] text-white sm:text-7xl"
          lines={[{ text: "Empieza aquí." }, { text: "Termina increíble.", className: "text-gradient" }]}
        />
        <span id="cta-title" className="sr-only">
          Empieza aquí. Termina increíble.
        </span>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-lg text-lg text-white/55">Ocho pasos guiados, compatibilidad verificada y tu build completa al carrito en un clic.</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <MagneticLink href="/arma-tu-pc">
              <Cpu className="size-[18px]" aria-hidden /> ARMAR MI PC
            </MagneticLink>
            <MagneticLink href="/pcs-gaming" variant="ghost">
              Ver PCs armadas <ArrowRight className="size-4" aria-hidden />
            </MagneticLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
