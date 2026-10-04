import { BadgeCheck, Headset, ShieldCheck, Truck, Wrench } from "lucide-react";
import { Placeholder } from "@/components/ui/placeholder";

/**
 * Señales de confianza. El texto de cada política es PLACEHOLDER:
 * DDTech debe proporcionar sus condiciones reales antes de publicarse.
 */
const items = [
  { icon: ShieldCheck, title: "Compra segura", body: "Pago protegido", note: "Proveedor de pagos" },
  { icon: BadgeCheck, title: "Productos originales", body: "Nuevos y sellados", note: "Política oficial" },
  { icon: Wrench, title: "Garantía", body: "Respaldo del fabricante", note: "Condiciones" },
  { icon: Truck, title: "Envíos", body: "A todo México", note: "Cobertura y tiempos" },
  { icon: Headset, title: "Soporte", body: "Asesoría experta", note: "Canales y horarios" },
];

export function TrustBar({ className }: { className?: string }) {
  return (
    <section aria-label="Confianza" className={`container-page ${className ?? ""}`}>
      <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3 lg:grid-cols-5">
        {items.map(({ icon: Icon, title, body, note }) => (
          <li key={title} className="flex items-start gap-3 bg-surface p-4 last:col-span-2 sm:last:col-span-1">
            <span className="grid size-9 shrink-0 place-items-center rounded-md bg-surface-3 text-brand-text">
              <Icon className="size-[18px]" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-fg">{title}</p>
              <p className="text-xs text-fg-muted">{body}</p>
              <Placeholder className="mt-1.5">{note}</Placeholder>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
