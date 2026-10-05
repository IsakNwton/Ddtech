import { ArrowRight, Cpu } from "lucide-react";
import { MagneticLink } from "./magnetic";
import { Reveal, SplitHeading } from "./reveal";

export function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="container-page">
      <div className="ring-gradient relative isolate overflow-hidden rounded-[40px] bg-[#070910] px-6 py-24 text-center sm:px-12 sm:py-36">
        <div className="absolute inset-0 -z-10" aria-hidden>
          <div className="aurora-blob left-[10%] top-[-20%] size-[520px] bg-[#3b6bff]/35" />
          <div className="aurora-blob right-[5%] top-[10%] size-[440px] bg-[#8b5cf6]/30 [animation-delay:-7s]" />
          <div className="aurora-blob bottom-[-30%] left-[40%] size-[420px] bg-[#22d3ee]/20 [animation-delay:-12s]" />
          <div className="absolute inset-x-[-30%] bottom-[-10%] h-[55%] opacity-60">
            <div className="perspective-grid absolute inset-0" />
          </div>
          <div className="noise absolute inset-0 opacity-[0.04]" />
        </div>
        <p className="eyebrow justify-center">Tu próxima PC</p>
        <SplitHeading
          className="mx-auto mt-6 max-w-4xl text-5xl font-semibold leading-[0.92] tracking-[-0.06em] text-white sm:text-7xl lg:text-8xl"
          lines={[{ text: "Empieza aquí." }, { text: "Juega increíble.", className: "text-gradient" }]}
        />
        <span id="cta-title" className="sr-only">
          Empieza aquí. Juega increíble.
        </span>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-7 max-w-lg text-lg text-white/60">Ocho pasos guiados, compatibilidad verificada y tu build completa al carrito en un clic.</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <MagneticLink href="/arma-tu-pc">
              <Cpu className="size-[18px]" aria-hidden /> Armar mi PC
            </MagneticLink>
            <MagneticLink href="/componentes" variant="ghost">
              Explorar componentes <ArrowRight className="size-4" aria-hidden />
            </MagneticLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
