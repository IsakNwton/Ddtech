"use client";

import { BookUser, Home, Images, LayoutGrid, Mail, PlusCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const items = [
  { href: "/admin", label: "Inicio", icon: Home, exact: true },
  { href: "/admin/obras/nueva", label: "Agregar pintura", icon: PlusCircle },
  { href: "/admin/obras", label: "Mis pinturas", icon: Images },
  { href: "/admin/colecciones", label: "Colecciones", icon: LayoutGrid },
  { href: "/admin/biografia", label: "Biografía", icon: BookUser },
  { href: "/admin/mensajes", label: "Mensajes", icon: Mail },
];

export function AdminNav() {
  const pathname = usePathname();
  const active = (href: string, exact?: boolean) =>
    exact ? pathname === href : href === "/admin/obras" ? pathname.startsWith(href) && !pathname.startsWith("/admin/obras/nueva") : pathname.startsWith(href);
  return (
    <nav aria-label="Panel" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:px-0">
      {items.map(({ href, label, icon: Icon, exact }) => (
        <Link
          key={href}
          href={href}
          aria-current={active(href, exact) ? "page" : undefined}
          className={cn(
            "press flex min-h-14 shrink-0 items-center gap-3 rounded-2xl px-5 text-lg transition-colors",
            active(href, exact) ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-stone/60 lg:bg-transparent",
          )}
        >
          <Icon className="size-5" strokeWidth={1.75} /> {label}
        </Link>
      ))}
    </nav>
  );
}
