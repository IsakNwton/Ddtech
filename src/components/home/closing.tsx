import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { buttonClass } from "@/components/ui/button";

export function Closing() {
  return (
    <section className="mx-auto max-w-[1600px] px-5 pt-24 sm:px-8 lg:px-14 lg:pt-36">
      <Reveal>
        <div className="glass relative overflow-hidden rounded-[2.5rem] px-6 py-16 text-center sm:px-12 lg:py-24">
          <p className="eyebrow">Adquisiciones y consultas</p>
          <h2 className="mx-auto mt-6 max-w-3xl font-display text-[2.6rem] leading-[1.02] tracking-[-0.025em] sm:text-6xl">
            ¿Una obra le ha <span className="italic">hablado</span>?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-muted-text">
            Coleccionistas, galerías e instituciones pueden solicitar información sobre disponibilidad, visitas al taller o exposiciones. Cada consulta
            recibe una respuesta personal.
          </p>
          <div className="mt-10 flex justify-center">
            <Magnetic>
              <Link href="/contacto" className={buttonClass("primary", "lg")}>
                Escribir una consulta <ArrowRight className="size-4 transition-transform duration-500 group-hover/btn:translate-x-1" strokeWidth={1.5} />
              </Link>
            </Magnetic>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
