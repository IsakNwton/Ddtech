import { AtSign, Mail, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { PageHeader } from "@/components/layout/page-header";
import { PageTransition } from "@/components/motion/page-transition";
import { Reveal } from "@/components/motion/reveal";
import { getArtist, getArtworks } from "@/lib/data";
import { contactChannels, whatsappLink } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const artist = await getArtist();
  return {
    title: "Contacto y adquisiciones",
    description: `Consultas sobre obras de ${artist.name}: disponibilidad, adquisiciones, exposiciones y prensa.`,
    alternates: { canonical: "/contacto" },
  };
}

const steps = [
  ["Consulta", "Escríbanos indicando la obra que le interesa o el motivo de su mensaje."],
  ["Respuesta personal", "Recibirá información sobre disponibilidad, condiciones y, si lo desea, más fotografías."],
  ["Visita o videollamada", "Puede ver la obra en persona o por videollamada antes de decidir."],
  ["Acuerdo y entrega", "Se acuerdan la forma de pago, el embalaje y el envío. La obra se entrega con su documentación."],
];

export default async function ContactoPage() {
  const [works] = await Promise.all([getArtworks()]);
  const wa = whatsappLink("Hola, escribo desde la galería en línea.");
  const channels = [
    { icon: Mail, label: "Correo electrónico", value: contactChannels.email, href: contactChannels.email ? `mailto:${contactChannels.email}` : null },
    { icon: MessageCircle, label: "WhatsApp", value: contactChannels.whatsapp ? `+${contactChannels.whatsapp}` : null, href: wa },
    { icon: AtSign, label: "Instagram", value: contactChannels.instagram?.replace(/^https?:\/\/(www\.)?/, ""), href: contactChannels.instagram },
    { icon: AtSign, label: "Facebook", value: contactChannels.facebook?.replace(/^https?:\/\/(www\.)?/, ""), href: contactChannels.facebook },
  ];

  return (
    <PageTransition>
      <div>
        <PageHeader
          eyebrow="Contacto"
          title="Conversemos"
          intro="Para coleccionistas, galerías, instituciones y amantes del arte. Cada mensaje se responde de forma personal."
        />
        <div className="mx-auto grid max-w-[1600px] gap-16 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-14">
          <aside className="space-y-14 lg:col-span-4">
            <Reveal>
              <h2 className="eyebrow mb-6">Canales directos</h2>
              <ul className="divide-y divide-line border-y border-line">
                {channels.map(({ icon: Icon, label, value, href }) => (
                  <li key={label} className="flex items-center gap-4 py-4">
                    <Icon className="size-4 shrink-0 text-gold-ink" strokeWidth={1.5} aria-hidden />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-text">{label}</p>
                      {href && value ? (
                        <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="block truncate text-[0.9375rem] underline-offset-4 hover:underline">
                          {value}
                        </a>
                      ) : (
                        <p className="text-[0.9375rem] text-muted-text">Pendiente de configurar</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="eyebrow mb-6">Cómo adquirir una obra</h2>
              <ol className="space-y-6">
                {steps.map(([t, d], i) => (
                  <li key={t} className="grid grid-cols-[2.25rem_1fr] gap-3">
                    <span className="font-display text-2xl italic text-gold-ink">{i + 1}</span>
                    <div>
                      <p className="font-display text-xl">{t}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-text">{d}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-6 text-xs leading-relaxed text-muted-text">Proceso orientativo; los detalles se acuerdan con el artista en cada caso.</p>
            </Reveal>
          </aside>

          <section id="formulario" className="scroll-mt-28 lg:col-span-7 lg:col-start-6" aria-labelledby="form-title">
            <Reveal>
              <h2 id="form-title" className="mb-8 font-display text-4xl tracking-[-0.02em] sm:text-5xl">
                Enviar una consulta
              </h2>
              <ContactForm
                works={works.map((w) => ({ slug: w.slug, title: w.title, year: w.year, available: w.availability === "disponible" || w.availability === "reservada" }))}
                email={contactChannels.email}
                whatsapp={wa}
              />
            </Reveal>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}
