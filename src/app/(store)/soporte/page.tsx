import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown, Cpu, FileText, Headset, Package, RefreshCw, ShieldCheck, Truck } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/catalog/page-hero";
import { Placeholder } from "@/components/ui/placeholder";

export const metadata: Metadata = pageMetadata({ title: "Soporte", description: "Ayuda con pedidos, envíos, garantías y armado de PC.", path: "/soporte" });

const TOPICS = [
  { icon: Package, title: "Pedidos", body: "Estado, cambios y facturación." },
  { icon: Truck, title: "Envíos", body: "Cobertura, tiempos y rastreo." },
  { icon: ShieldCheck, title: "Garantías", body: "Cómo hacer válida tu garantía." },
  { icon: RefreshCw, title: "Devoluciones", body: "Condiciones y proceso." },
  { icon: Cpu, title: "Armado de PC", body: "Asesoría y compatibilidad." },
  { icon: FileText, title: "Facturación", body: "Solicitud de CFDI." },
];

const FAQ = [
  { q: "¿Cómo sé si mis componentes son compatibles?", a: "Usa Arma tu PC: verificamos socket, memoria, formato, largo de GPU, altura del disipador, potencia y conectores de la fuente.", real: true },
  { q: "¿Puedo comparar productos antes de comprar?", a: "Sí. Agrega hasta 4 productos de la misma categoría al comparador y verás las diferencias resaltadas.", real: true },
  { q: "¿Cuánto tarda mi envío?", a: null },
  { q: "¿Cuál es la política de garantía?", a: null },
  { q: "¿Qué métodos de pago aceptan?", a: null },
  { q: "¿Ofrecen servicio de armado?", a: null },
];

export default function SoportePage() {
  return (
    <>
      <PageHero crumbs={[{ label: "Soporte" }]} eyebrow="Centro de ayuda" title="¿En qué te ayudamos?" description="Estructura propuesta del centro de ayuda. El contenido de políticas debe proporcionarlo DDTech." />
      <div className="container-page mt-8">
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {TOPICS.map(({ icon: Icon, title, body }) => (
            <li key={title} className="rounded-lg border border-line bg-surface p-5">
              <Icon className="size-5 text-brand-text" aria-hidden />
              <p className="mt-3 font-semibold">{title}</p>
              <p className="mt-0.5 text-sm text-fg-muted">{body}</p>
              <Placeholder className="mt-3">Contenido oficial</Placeholder>
            </li>
          ))}
        </ul>
        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_360px]">
          <section aria-labelledby="faq">
            <h2 id="faq" className="text-xl font-semibold tracking-[-0.02em]">Preguntas frecuentes</h2>
            <ul className="mt-5 divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface">
              {FAQ.map((f) => (
                <li key={f.q}>
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-medium hover:bg-surface-2 [&::-webkit-details-marker]:hidden">
                      {f.q}
                      <ChevronDown className="size-4 shrink-0 text-fg-subtle transition-transform group-open:rotate-180" aria-hidden />
                    </summary>
                    <div className="px-5 pb-4 text-sm text-fg-muted">
                      {f.a ?? <Placeholder>Respuesta pendiente de DDTech</Placeholder>}
                      {f.real && (
                        <Link href="/arma-tu-pc" className="ml-1 text-brand-text hover:underline">
                          Ir al configurador →
                        </Link>
                      )}
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          </section>
          <aside className="rounded-lg border border-line bg-surface p-6">
            <Headset className="size-6 text-brand-text" aria-hidden />
            <h2 className="mt-3 text-lg font-semibold">Habla con un especialista</h2>
            <p className="mt-1 text-sm text-fg-muted">Canales de atención propuestos:</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li className="flex items-center justify-between gap-3">Chat <Placeholder>Horario</Placeholder></li>
              <li className="flex items-center justify-between gap-3">WhatsApp <Placeholder>Número oficial</Placeholder></li>
              <li className="flex items-center justify-between gap-3">Teléfono <Placeholder>Número oficial</Placeholder></li>
              <li className="flex items-center justify-between gap-3">Correo <Placeholder>Dirección oficial</Placeholder></li>
              <li className="flex items-center justify-between gap-3">Tienda física <Placeholder>Dirección y horario</Placeholder></li>
            </ul>
          </aside>
        </div>
      </div>
    </>
  );
}
