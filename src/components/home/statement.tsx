import { Reveal } from "@/components/motion/reveal";

/** Declaración editorial breve tras la portada */
export function Statement({ text, isPlaceholder }: { text: string; isPlaceholder: boolean }) {
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-24 sm:px-8 lg:px-14 lg:py-40">
      <div className="grid gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-3">
          <p className="eyebrow flex items-center gap-3">
            <span className="h-px w-8 bg-gold" aria-hidden />
            Sobre la obra
          </p>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-8">
          <p className="font-display text-[2rem] font-light leading-[1.22] tracking-[-0.015em] text-ink text-pretty sm:text-5xl lg:text-[3.6rem]">
            Pintar es detener la luz un instante y ofrecerla, intacta, a quien sepa <span className="italic text-ink-soft">mirar despacio</span>.
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            <p className="text-[1.0625rem] leading-relaxed text-muted-text">{text}</p>
            {isPlaceholder && (
              <p className="text-sm leading-relaxed text-muted-text">
                <span className="text-gold-ink">Nota:</span> la frase destacada es un texto editorial de ejemplo, no una cita del artista. Se sustituirá por
                sus propias palabras.
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
