import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { contactChannels, navItems, whatsappLink } from "@/lib/site";

export function SiteFooter({ artistName, tagline, isDemo }: { artistName: string; tagline: string; isDemo: boolean }) {
  const channels = [
    contactChannels.email && { label: "Correo", href: `mailto:${contactChannels.email}` },
    contactChannels.whatsapp && { label: "WhatsApp", href: whatsappLink()! },
    contactChannels.instagram && { label: "Instagram", href: contactChannels.instagram },
    contactChannels.facebook && { label: "Facebook", href: contactChannels.facebook },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <footer id="pie" className="relative mt-32 border-t border-line bg-ivory/60">
      <div className="mx-auto grid max-w-[1600px] gap-14 px-5 pb-10 pt-16 sm:px-8 lg:grid-cols-12 lg:px-14 lg:pt-24">
        <div className="lg:col-span-5">
          <p className="font-display text-[2.6rem] leading-[1] tracking-[-0.02em] sm:text-6xl">{artistName}</p>
          <p className="mt-4 font-display text-xl italic text-muted-text">{tagline}</p>
          <Link href="/contacto" className="group mt-10 inline-flex items-center gap-2 border-b border-ink/30 pb-1 text-sm transition-colors hover:border-ink">
            Consultas y adquisiciones
            <ArrowUpRight className="size-4 transition-transform duration-500 ease-gallery group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
          </Link>
        </div>

        <nav aria-label="Pie de página" className="lg:col-span-3 lg:col-start-7">
          <p className="eyebrow mb-5">Recorrido</p>
          <ul className="space-y-3 text-[0.9375rem]">
            {navItems.map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="text-ink-soft transition-colors hover:text-ink">
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <p className="eyebrow mb-5">Contacto</p>
          {channels.length > 0 ? (
            <ul className="space-y-3 text-[0.9375rem]">
              {channels.map((c) => (
                <li key={c.label}>
                  <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="text-ink-soft transition-colors hover:text-ink">
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm leading-relaxed text-muted-text">
              Canales de contacto pendientes de configurar. Mientras tanto, utilice el{" "}
              <Link href="/contacto" className="underline underline-offset-4 hover:text-ink">
                formulario de contacto
              </Link>
              .
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 border-t border-line px-5 py-7 text-xs text-muted-text sm:px-8 md:flex-row md:items-center md:justify-between lg:px-14">
        <p>
          © {new Date().getFullYear()} {artistName}. Todas las obras e imágenes están protegidas por derechos de autor.
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {isDemo && <p>Las imágenes y fichas actuales son de demostración y no corresponden a obras del artista.</p>}
          <Link href="/admin" className="transition-colors hover:text-ink" prefetch={false}>
            Acceso privado
          </Link>
        </div>
      </div>
    </footer>
  );
}
