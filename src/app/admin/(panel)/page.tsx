import { BookUser, Images, LayoutGrid, Mail, PlusCircle } from "lucide-react";
import Link from "next/link";
import { requireAdminPage } from "@/lib/auth";
import { listArtworksAdmin, listInquiries } from "@/lib/data/admin";

export default async function AdminHome() {
  const ctx = await requireAdminPage();
  const [works, inquiries] = await Promise.all([listArtworksAdmin(ctx), listInquiries(ctx)]);
  const published = works.filter((w) => w.status === "publicada").length;
  const drafts = works.length - published;
  const pending = inquiries.filter((i) => i.status === "nueva").length;

  const cards = [
    { href: "/admin/obras/nueva", icon: PlusCircle, title: "Agregar una pintura", text: "Suba la foto y complete la ficha paso a paso.", primary: true },
    { href: "/admin/obras", icon: Images, title: "Mis pinturas", text: `${published} publicadas · ${drafts} en borrador. Editar, ordenar, cambiar disponibilidad.` },
    { href: "/admin/colecciones", icon: LayoutGrid, title: "Colecciones", text: "Crear y editar las series de obras." },
    { href: "/admin/biografia", icon: BookUser, title: "Biografía", text: "Actualizar la historia, exposiciones y reconocimientos." },
    { href: "/admin/mensajes", icon: Mail, title: "Mensajes", text: pending ? `${pending} consultas nuevas sin atender.` : "Consultas recibidas desde el formulario." },
  ];

  return (
    <div>
      <h1 className="font-display text-5xl leading-tight">Bienvenido</h1>
      <p className="mt-2 max-w-2xl text-xl text-muted-text">¿Qué desea hacer hoy? Toque una de las opciones.</p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {cards.map(({ href, icon: Icon, title, text, primary }) => (
          <Link
            key={href}
            href={href}
            className={`press group flex min-h-40 flex-col justify-between rounded-3xl border-2 p-7 transition-colors ${
              primary ? "border-ink bg-ink text-paper sm:col-span-2" : "border-line bg-paper hover:border-ink/40"
            }`}
          >
            <Icon className="size-9" strokeWidth={1.5} />
            <div className="mt-6">
              <p className="font-display text-3xl">{title}</p>
              <p className={`mt-1 text-lg ${primary ? "text-paper/75" : "text-muted-text"}`}>{text}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
