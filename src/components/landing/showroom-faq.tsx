import Link from "next/link";
import { ArrowUpRight, Clock, MapPin, Phone, Plus } from "lucide-react";
import { Placeholder } from "@/components/ui/placeholder";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

const FAQ = [
  {
    q: "¿Cómo sé que todas las piezas son compatibles?",
    a: "El configurador revisa socket del procesador, tipo y cantidad de memoria, formato de la tarjeta madre, largo de la tarjeta gráfica, altura del disipador y potencia de la fuente. Cada pieza se marca como compatible, a revisar o no compatible antes de que la agregues.",
  },
  {
    q: "¿Pueden armar la PC por mí?",
    a: "Sí. Elige una build recomendada o arma la tuya y solicita el ensamble: la recibes lista para conectar, con cableado ordenado y probada.",
    note: "Costo y tiempo de ensamble",
  },
  {
    q: "¿Hacen envíos a todo México?",
    a: "Enviamos a todo el país desde Guadalajara, con empaque reforzado y número de guía para rastrear tu pedido.",
    note: "Paqueterías, tiempos y costos",
  },
  {
    q: "¿Puedo pagar a meses sin intereses?",
    a: "Puedes financiar tu compra con tarjetas participantes. Los plazos disponibles se muestran al pagar.",
    note: "Plazos, bancos y monto mínimo",
  },
  {
    q: "¿Los productos tienen garantía?",
    a: "Todos los productos son nuevos y originales, con garantía respaldada por el fabricante. Te acompañamos en el proceso si algo falla.",
    note: "Política de garantía",
  },
];

export function ShowroomFaq() {
  return (
    <section aria-labelledby="faq-title" className="container-page grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
      {/* Tienda física */}
      <Reveal className="h-full">
        <div className="relative isolate flex h-full flex-col justify-end overflow-hidden rounded-[32px] border border-white/[0.08] bg-[#080a10] p-7 pt-[250px] sm:p-9 sm:pt-[270px]">
          <div className="absolute inset-0 -z-10" aria-hidden>
            <div className="grid-backdrop absolute inset-0 opacity-80 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_35%,black,transparent_80%)]" />
            {/* Calles estilizadas */}
            <svg viewBox="0 0 400 300" className="absolute inset-x-0 top-0 h-[300px] w-full" preserveAspectRatio="xMidYMid slice">
              <g fill="none" stroke="rgb(122 162 255 / 0.18)" strokeWidth="1.5">
                <path d="M-20 210 C 80 190, 160 120, 420 140" />
                <path d="M60 -10 C 90 90, 150 180, 170 320" />
                <path d="M-20 90 L 420 60" />
                <path d="M260 -10 L 300 320" />
              </g>
              <path d="M-20 160 C 120 150, 220 170, 420 110" fill="none" stroke="rgb(103 232 249 / 0.35)" strokeWidth="2.5" />
            </svg>
            <div className="absolute left-1/2 top-[120px] -translate-x-1/2 -translate-y-1/2">
              <span className="absolute left-1/2 top-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3b6bff]/25 blur-2xl" />
              <span className="relative grid size-14 place-items-center rounded-full bg-white text-[#07080a] shadow-[0_0_0_8px_rgba(122,162,255,0.2),0_0_0_18px_rgba(122,162,255,0.08)]">
                <MapPin className="size-6" aria-hidden />
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 top-[150px] bg-gradient-to-t from-[#080a10] from-60% to-transparent" />
          </div>

          <p className="eyebrow">Tienda física</p>
          <h3 className="mt-4 text-4xl font-semibold leading-[0.98] tracking-[-0.05em] text-white">
            Visítanos en
            <br />
            <span className="text-gradient">Guadalajara.</span>
          </h3>
          <p className="mt-3 max-w-sm text-white/55">Ve el hardware en persona, resuelve dudas con nuestro equipo y recoge tu pedido.</p>
          <ul className="mt-6 space-y-2.5 text-sm text-white/70">
            <li className="flex items-center gap-3">
              <MapPin className="size-4 shrink-0 text-white/40" aria-hidden /> Guadalajara, Jalisco <Placeholder>Dirección</Placeholder>
            </li>
            <li className="flex items-center gap-3">
              <Clock className="size-4 shrink-0 text-white/40" aria-hidden /> <Placeholder>Horario de atención</Placeholder>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="size-4 shrink-0 text-white/40" aria-hidden /> <Placeholder>Teléfono y WhatsApp</Placeholder>
            </li>
          </ul>
          <Link href="/soporte" className="group mt-7 inline-flex items-center gap-2 self-start rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:border-white hover:bg-white hover:text-[#07080a]">
            Centro de ayuda
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
      </Reveal>

      {/* Preguntas frecuentes */}
      <div>
        <SectionHeading id="faq-title" eyebrow="Preguntas frecuentes" title="¿Tienes dudas?" accent="Te ayudamos." />
        <div className="mt-10 divide-y divide-white/[0.07] border-y border-white/[0.07]">
          {FAQ.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.05}>
              <details className="group py-1" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-lg py-5 text-left text-lg font-medium tracking-[-0.02em] text-white transition-colors hover:text-[#cfe0ff] [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/12 text-white/70 transition-all duration-300 group-open:rotate-45 group-open:border-white group-open:bg-white group-open:text-[#07080a]">
                    <Plus className="size-4" aria-hidden />
                  </span>
                </summary>
                <div className="pb-6 pr-14 text-[0.95rem] leading-relaxed text-white/55">
                  <p>{f.a}</p>
                  {f.note && <Placeholder className="mt-3">{f.note}</Placeholder>}
                </div>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
