import { formatPrice } from "@/lib/format";
import { DemoTag } from "@/components/ui/placeholder";

export function CartTotals({
  subtotal,
  savings,
  shipping,
  shippingNote = "Se calcula en el checkout",
}: {
  subtotal: number;
  savings: number;
  shipping?: number | null;
  shippingNote?: string;
}) {
  const total = subtotal + (shipping ?? 0);
  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between text-fg-muted">
        <dt>Subtotal</dt>
        <dd className="tabular text-fg">{formatPrice(subtotal)}</dd>
      </div>
      {savings > 0 && (
        <div className="flex justify-between text-fg-muted">
          <dt>Ahorro</dt>
          <dd className="tabular text-success">−{formatPrice(savings)}</dd>
        </div>
      )}
      <div className="flex justify-between text-fg-muted">
        <dt>Envío</dt>
        <dd className="text-right">{shipping === undefined || shipping === null ? <span className="text-fg-subtle">{shippingNote}</span> : shipping === 0 ? <span className="text-success">Gratis</span> : <span className="tabular text-fg">{formatPrice(shipping)}</span>}</dd>
      </div>
      <div className="flex items-baseline justify-between border-t border-line pt-3">
        <dt className="font-semibold text-fg">Total</dt>
        <dd className="text-right">
          <span className="tabular text-xl font-bold tracking-[-0.02em] text-fg">{formatPrice(total)}</span>
          <span className="ml-1 text-2xs font-semibold text-fg-subtle">MXN</span>
          <DemoTag className="block">Montos demostrativos</DemoTag>
        </dd>
      </div>
    </dl>
  );
}
