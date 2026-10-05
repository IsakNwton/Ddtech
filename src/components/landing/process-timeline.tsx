import { Gauge, MousePointerClick, PackageCheck, ShieldCheck } from "lucide-react";
import { Placeholder } from "@/components/ui/placeholder";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

const STEPS = [
  {
    icon: MousePointerClick,
    title: "Eliges",
    body: "Parte de una build recomendada o arma la tuya pieza por pieza en el configurador.",
  },
  {
    icon: ShieldCheck,
    title: "Validamos",
    body: "Compatibilidad automática y revisión de un técnico antes de confirmar tu pedido.",
  },
  {
    icon: Gauge,
    title: "Ensamblamos y probamos",
    body: "Armado con cableado limpio, BIOS al día y pruebas de temperatura y estabilidad.",
  },
  {
    icon: PackageCheck,
    title: "Llega a tu puerta",
    body: "Empaque reforzado, envío asegurado y seguimiento hasta que la conectes.",
  },
];

export function ProcessTimeline() {
  return (
    <section aria-labelledby="process-title" className="container-page">
      <SectionHeading id="process-title" eyebrow="Cómo funciona" title="De la idea" accent="a tu escritorio." align="center">
        Cuatro pasos y un equipo que cuida cada detalle por ti.
      </SectionHeading>

      <ol className="relative mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {/* Línea de conexión */}
        <span className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-[2.75rem] hidden h-px bg-gradient-to-r from-[#22d3ee]/0 via-[#7aa2ff]/60 to-[#a78bfa]/0 lg:block" aria-hidden />
        {STEPS.map(({ icon: Icon, title, body }, i) => (
          <li key={title}>
            <Reveal delay={i * 0.1} className="h-full">
              <div className="relative flex h-full flex-col items-center rounded-[28px] border border-white/[0.06] bg-white/[0.02] px-6 pb-8 pt-6 text-center">
                <span className="relative grid size-[3.5rem] place-items-center rounded-2xl border border-white/10 bg-[#0b0e16] text-white shadow-[0_0_0_6px_#05060a,0_0_40px_-6px_rgba(122,162,255,0.6)]">
                  <Icon className="size-6" aria-hidden />
                  <span className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-white font-mono text-[10px] font-bold text-[#07080a]">{i + 1}</span>
                </span>
                <h3 className="mt-6 text-xl font-semibold tracking-[-0.03em] text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{body}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
      <Reveal>
        <p className="mt-8 text-center">
          <Placeholder>Pasos de validación, ensamble y envío por confirmar con DDTech</Placeholder>
        </p>
      </Reveal>
    </section>
  );
}
