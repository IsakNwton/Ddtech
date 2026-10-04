import Link from "next/link";
import { GitCompareArrows, LifeBuoy, MessageCircle } from "lucide-react";
import { Placeholder } from "@/components/ui/placeholder";

export function HelpCta() {
  const cards = [
    {
      icon: MessageCircle,
      title: "Asesoría para elegir",
      body: "Un especialista revisa tu build antes de comprar.",
      foot: <Placeholder>Canal de contacto oficial</Placeholder>,
      href: "/soporte",
    },
    {
      icon: GitCompareArrows,
      title: "Compara antes de decidir",
      body: "Hasta 4 productos lado a lado con diferencias resaltadas.",
      foot: <span className="text-xs font-semibold text-brand-text">Abrir comparador →</span>,
      href: "/comparar",
    },
    {
      icon: LifeBuoy,
      title: "Soporte y garantías",
      body: "Encuentra respuestas sobre envíos, garantías y devoluciones.",
      foot: <Placeholder>Políticas por confirmar</Placeholder>,
      href: "/soporte",
    },
  ];
  return (
    <section aria-label="Ayuda" className="container-page">
      <ul className="grid gap-4 md:grid-cols-3">
        {cards.map(({ icon: Icon, title, body, foot, href }) => (
          <li key={title}>
            <Link href={href} className="group flex h-full flex-col rounded-lg border border-line bg-surface p-6 transition-colors hover:border-line-strong">
              <Icon className="size-6 text-brand-text" aria-hidden />
              <p className="mt-4 font-semibold text-fg">{title}</p>
              <p className="mt-1 text-sm text-fg-muted">{body}</p>
              <div className="mt-4">{foot}</div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
