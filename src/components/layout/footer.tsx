import Link from "next/link";
import { DISCLAIMER } from "@/lib/seo";
import { Placeholder } from "@/components/ui/placeholder";
import { Logo } from "./logo";
import { NewsletterForm } from "./newsletter-form";

const columns = [
  {
    title: "Tienda",
    links: [
      { label: "Arma tu PC", href: "/arma-tu-pc" },
      { label: "PCs Gaming", href: "/pcs-gaming" },
      { label: "Componentes", href: "/componentes" },
      { label: "Periféricos", href: "/perifericos" },
      { label: "Ofertas", href: "/ofertas" },
      { label: "Comparador", href: "/comparar" },
    ],
  },
  {
    title: "Ayuda",
    links: [
      { label: "Soporte", href: "/soporte" },
      { label: "Mi cuenta", href: "/cuenta" },
      { label: "Carrito", href: "/carrito" },
      { label: "Favoritos", href: "/favoritos" },
    ],
  },
  {
    title: "Este concepto",
    links: [
      { label: "Propuesta de rediseño", href: "/propuesta" },
      { label: "Decisiones de UX", href: "/propuesta#decisiones" },
      { label: "Sistema de diseño", href: "/propuesta#sistema" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-surface pb-24 lg:pb-0">
      <div className="container-page grid gap-10 py-14 lg:grid-cols-[1.3fr_2fr]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-fg-muted">
            Hardware, componentes y PCs gaming. Una propuesta de experiencia de compra para la próxima generación de
            DDTech.
          </p>
          <div className="mt-6">
            <p className="text-sm font-semibold text-fg">Novedades y ofertas</p>
            <p className="mt-1 text-xs text-fg-subtle">Formulario demostrativo: no se envían datos.</p>
            <NewsletterForm />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {columns.map((c) => (
            <div key={c.title}>
              <p className="text-sm font-semibold text-fg">{c.title}</p>
              <ul className="mt-3 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-fg-muted transition-colors hover:text-fg">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="text-sm font-semibold text-fg">Contacto</p>
            <ul className="mt-3 space-y-2.5 text-sm text-fg-muted">
              <li><Placeholder>Teléfono oficial</Placeholder></li>
              <li><Placeholder>Correo de ventas</Placeholder></li>
              <li><Placeholder>Dirección de tienda</Placeholder></li>
              <li><Placeholder>Horarios</Placeholder></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-fg-subtle md:flex-row md:items-center md:justify-between">
          <p>
            <strong className="font-semibold text-fg-muted">{DISCLAIMER}</strong> Marcas y nombres de producto pertenecen a
            sus respectivos dueños. Precios, existencias y opiniones son demostrativos.
          </p>
          <div className="flex shrink-0 gap-4">
            <span>Aviso de privacidad <Placeholder className="ml-1">Pendiente</Placeholder></span>
            <span>Términos <Placeholder className="ml-1">Pendiente</Placeholder></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
