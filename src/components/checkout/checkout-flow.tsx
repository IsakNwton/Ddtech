"use client";

import Link from "next/link";
import { Check, ChevronDown, CreditCard, Lock, Package, ShoppingCart, Store, Truck } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { useHydrated } from "@/hooks/use-hydrated";
import { useAccount } from "@/store/account";
import { cartCount, cartSavings, cartSubtotal, useCart, type CartLine } from "@/store/cart";
import { Button, ButtonLink } from "@/components/ui/button";
import { Placeholder } from "@/components/ui/placeholder";
import { ProductImage } from "@/components/ui/product-image";
import { Skeleton } from "@/components/ui/skeleton";
import { CartTotals } from "@/components/cart/cart-summary";
import { Field } from "./field";

const STEPS = ["Información", "Envío", "Pago", "Confirmación"] as const;

const ESTADOS = [
  "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas", "Chihuahua", "Ciudad de México", "Coahuila",
  "Colima", "Durango", "Estado de México", "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "Michoacán", "Morelos", "Nayarit",
  "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas",
  "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas",
];

const SHIPPING = [
  { id: "domicilio", label: "Envío a domicilio", icon: Truck, note: "Costo y tiempo de entrega" },
  { id: "express", label: "Envío express", icon: Package, note: "Disponibilidad y costo" },
  { id: "tienda", label: "Recoger en tienda", icon: Store, note: "Sucursales y horarios" },
] as const;

type Info = { email: string; nombre: string; telefono: string };
type Addr = { cp: string; estado: string; ciudad: string; colonia: string; calle: string; numero: string; envio: string };
type Pay = { tarjeta: string; nombre: string; exp: string; cvv: string };

const emailOk = (v: string) => /^\S+@\S+\.\S+$/.test(v);

function Summary({ lines, open, onToggle }: { lines: CartLine[]; open: boolean; onToggle: () => void }) {
  const subtotal = cartSubtotal(lines);
  return (
    <div className="rounded-xl border border-line bg-surface">
      <button type="button" onClick={onToggle} aria-expanded={open} className="flex w-full items-center justify-between gap-3 px-5 py-4 lg:pointer-events-none">
        <span className="flex items-center gap-2 text-sm font-semibold">
          <ShoppingCart className="size-4 text-fg-subtle" aria-hidden />
          Resumen ({cartCount(lines)})
          <ChevronDown className={cn("size-4 text-fg-subtle transition-transform lg:hidden", open && "rotate-180")} aria-hidden />
        </span>
        <span className="tabular text-sm font-semibold lg:hidden">{formatPrice(subtotal)}</span>
      </button>
      <div className={cn("border-t border-line px-5 pb-5", !open && "hidden lg:block")}>
        <ul className="divide-y divide-line">
          {lines.map((l) => (
            <li key={l.product.id} className="flex items-center gap-3 py-3">
              <span className="stage relative size-14 shrink-0 rounded-md border border-line p-1">
                <ProductImage src={l.product.image} alt="" sizes="56px" />
                <span className="tabular absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-surface-4 text-[10px] font-bold">{l.qty}</span>
              </span>
              <span className="line-clamp-2 flex-1 text-xs text-fg-muted">{l.product.name}</span>
              <span className="tabular text-sm font-medium">{formatPrice(l.product.price * l.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="border-t border-line pt-4">
          <CartTotals subtotal={subtotal} savings={cartSavings(lines)} shippingNote="Por confirmar (demo)" />
        </div>
      </div>
    </div>
  );
}

export function CheckoutFlow() {
  const hydrated = useHydrated();
  const lines = useCart((s) => s.lines);
  const clear = useCart((s) => s.clear);
  const user = useAccount((s) => s.user);
  const addOrder = useAccount((s) => s.addOrder);
  const [step, setStep] = useState(0);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [info, setInfo] = useState<Info>({ email: "", nombre: "", telefono: "" });
  const [addr, setAddr] = useState<Addr>({ cp: "", estado: "Jalisco", ciudad: "", colonia: "", calle: "", numero: "", envio: "domicilio" });
  const [pay, setPay] = useState<Pay>({ tarjeta: "", nombre: "", exp: "", cvv: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placed, setPlaced] = useState<{ id: string; lines: CartLine[]; total: number } | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Prellenar con la sesión demo
    if (user && !info.email) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInfo((i) => ({ ...i, email: user.email, nombre: user.name === "Invitado" ? "" : user.name }));
    }
  }, [user, info.email]);

  const firstRender = useRef(true);
  useEffect(() => {
    // Mueve el foco al título de cada paso (lectores de pantalla), excepto al cargar
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const shownLines = placed?.lines ?? lines;
  const total = useMemo(() => cartSubtotal(shownLines), [shownLines]);

  if (!hydrated) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <Skeleton className="h-[480px]" />
        <Skeleton className="h-80" />
      </div>
    );
  }

  if (!placed && lines.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-line bg-surface px-6 py-14 text-center">
        <h2 className="text-lg font-semibold">No hay productos para pagar</h2>
        <p className="mt-1 text-sm text-fg-muted">Agrega productos al carrito para continuar.</p>
        <ButtonLink href="/" className="mt-6">
          Ir a la tienda
        </ButtonLink>
      </div>
    );
  }

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!emailOk(info.email)) e.email = "Escribe un correo válido.";
      if (info.nombre.trim().length < 3) e.nombre = "Escribe tu nombre completo.";
      if (!/^\d{10}$/.test(info.telefono.replace(/\D/g, ""))) e.telefono = "El teléfono debe tener 10 dígitos.";
    }
    if (step === 1 && addr.envio !== "tienda") {
      if (!/^\d{5}$/.test(addr.cp)) e.cp = "El código postal tiene 5 dígitos.";
      if (!addr.ciudad.trim()) e.ciudad = "Escribe tu ciudad o municipio.";
      if (!addr.colonia.trim()) e.colonia = "Escribe tu colonia.";
      if (!addr.calle.trim()) e.calle = "Escribe la calle.";
      if (!addr.numero.trim()) e.numero = "Escribe el número.";
    }
    if (step === 2) {
      if (pay.tarjeta.replace(/\s/g, "").length < 15) e.tarjeta = "Número de tarjeta incompleto.";
      if (!pay.nombre.trim()) e.pnombre = "Escribe el nombre como aparece en la tarjeta.";
      if (!/^\d{2}\/\d{2}$/.test(pay.exp)) e.exp = "Usa el formato MM/AA.";
      if (!/^\d{3,4}$/.test(pay.cvv)) e.cvv = "CVV de 3 o 4 dígitos.";
    }
    setErrors(e);
    if (Object.keys(e).length) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
      return false;
    }
    return true;
  };

  const next = (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    if (step === 2) {
      const id = `DEMO-${Date.now().toString(36).toUpperCase().slice(-6)}`;
      const snapshot = [...lines];
      const t = cartSubtotal(snapshot);
      addOrder({ id, createdAt: new Date().toISOString(), lines: snapshot, total: t, shipping: SHIPPING.find((s) => s.id === addr.envio)!.label, email: info.email });
      setPlaced({ id, lines: snapshot, total: t });
      clear();
    }
    setStep((s) => Math.min(3, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const inputCls = "mt-1.5 h-11 w-full rounded-md border border-line-strong bg-surface-2 px-3 text-sm text-fg focus:border-brand-line focus:outline-none";

  return (
    <div>
      {/* Progreso */}
      <nav aria-label="Progreso del pago" className="mb-8">
        <div className="h-1 overflow-hidden rounded-full bg-surface-4" aria-hidden>
          <div className="h-full rounded-full bg-brand transition-[width] duration-500 ease-[var(--ease-out-soft)]" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
        <ol className="mt-3 grid grid-cols-4 gap-2">
          {STEPS.map((s, i) => (
            <li key={s} aria-current={i === step ? "step" : undefined} className={cn("flex items-center gap-2 text-xs sm:text-sm", i <= step ? "text-fg" : "text-fg-subtle")}>
              <span className={cn("tabular grid size-5 shrink-0 place-items-center rounded-full text-[10px] font-bold", i < step ? "bg-success text-[#04130c]" : i === step ? "bg-brand text-white" : "bg-surface-4")}>
                {i < step ? <Check className="size-3" strokeWidth={3.5} aria-hidden /> : i + 1}
              </span>
              <span className={cn(i !== step && "hidden sm:inline")}>{s}</span>
            </li>
          ))}
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-12">
        <div className="order-2 lg:order-1">
          {step < 3 ? (
            <form onSubmit={next} noValidate className="rounded-xl border border-line bg-surface p-5 sm:p-7">
              <h2 ref={headingRef} tabIndex={-1} className="text-xl font-semibold tracking-[-0.02em] focus:outline-none">
                {STEPS[step]}
              </h2>

              {step === 0 && (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Field id="email" label="Correo electrónico" type="email" autoComplete="email" required className="sm:col-span-2" value={info.email} error={errors.email} onChange={(e) => setInfo({ ...info, email: e.target.value })} hint="Te enviaremos la confirmación del pedido (demo)." />
                  <Field id="nombre" label="Nombre completo" autoComplete="name" required value={info.nombre} error={errors.nombre} onChange={(e) => setInfo({ ...info, nombre: e.target.value })} />
                  <Field id="telefono" label="Teléfono" type="tel" inputMode="tel" autoComplete="tel" required value={info.telefono} error={errors.telefono} onChange={(e) => setInfo({ ...info, telefono: e.target.value })} placeholder="10 dígitos" />
                </div>
              )}

              {step === 1 && (
                <>
                  <fieldset className="mt-6">
                    <legend className="text-sm font-semibold">Método de entrega</legend>
                    <div className="mt-3 grid gap-2">
                      {SHIPPING.map(({ id, label, icon: Icon, note }) => (
                        <label key={id} className={cn("flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors", addr.envio === id ? "border-brand bg-brand-soft/50" : "border-line hover:border-line-strong")}>
                          <input type="radio" name="envio" value={id} checked={addr.envio === id} onChange={() => setAddr({ ...addr, envio: id })} className="size-4 accent-[var(--color-brand)]" />
                          <Icon className="size-5 text-fg-muted" aria-hidden />
                          <span className="flex-1 text-sm font-medium">{label}</span>
                          <Placeholder>{note}</Placeholder>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  {addr.envio !== "tienda" ? (
                    <div className="mt-6 grid gap-4 sm:grid-cols-6">
                      <Field id="cp" label="Código postal" inputMode="numeric" autoComplete="postal-code" required className="sm:col-span-2" value={addr.cp} error={errors.cp} onChange={(e) => setAddr({ ...addr, cp: e.target.value.replace(/\D/g, "").slice(0, 5) })} />
                      <Field id="estado" label="Estado" required className="sm:col-span-4">
                        <select id="estado" value={addr.estado} onChange={(e) => setAddr({ ...addr, estado: e.target.value })} className={inputCls} autoComplete="address-level1">
                          {ESTADOS.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </Field>
                      <Field id="ciudad" label="Ciudad o municipio" autoComplete="address-level2" required className="sm:col-span-3" value={addr.ciudad} error={errors.ciudad} onChange={(e) => setAddr({ ...addr, ciudad: e.target.value })} />
                      <Field id="colonia" label="Colonia" required className="sm:col-span-3" value={addr.colonia} error={errors.colonia} onChange={(e) => setAddr({ ...addr, colonia: e.target.value })} />
                      <Field id="calle" label="Calle" autoComplete="address-line1" required className="sm:col-span-4" value={addr.calle} error={errors.calle} onChange={(e) => setAddr({ ...addr, calle: e.target.value })} />
                      <Field id="numero" label="Número" required className="sm:col-span-2" value={addr.numero} error={errors.numero} onChange={(e) => setAddr({ ...addr, numero: e.target.value })} />
                    </div>
                  ) : (
                    <p className="mt-6 rounded-lg border border-dashed border-line-strong p-4 text-sm text-fg-muted">
                      Selección de sucursal <Placeholder>ubicaciones oficiales de DDTech</Placeholder>
                    </p>
                  )}
                </>
              )}

              {step === 2 && (
                <>
                  <div className="mt-4 rounded-md border border-warning/30 bg-warning-soft px-4 py-3 text-xs text-warning">
                    Formulario demostrativo: no ingreses datos reales. No se procesa ningún cargo.
                  </div>
                  <fieldset className="mt-5">
                    <legend className="flex items-center gap-2 text-sm font-semibold">
                      <CreditCard className="size-4" aria-hidden /> Tarjeta de crédito o débito (demo)
                    </legend>
                    <div className="mt-3 grid gap-4 sm:grid-cols-6">
                      <Field
                        id="tarjeta"
                        label="Número de tarjeta"
                        inputMode="numeric"
                        autoComplete="off"
                        required
                        className="sm:col-span-6"
                        value={pay.tarjeta}
                        error={errors.tarjeta}
                        placeholder="0000 0000 0000 0000"
                        onChange={(e) => setPay({ ...pay, tarjeta: e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ") })}
                      />
                      <Field id="pnombre" label="Nombre en la tarjeta" autoComplete="off" required className="sm:col-span-6" value={pay.nombre} error={errors.pnombre} onChange={(e) => setPay({ ...pay, nombre: e.target.value })} />
                      <Field
                        id="exp"
                        label="Vencimiento"
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder="MM/AA"
                        required
                        className="sm:col-span-3"
                        value={pay.exp}
                        error={errors.exp}
                        onChange={(e) => {
                          const d = e.target.value.replace(/\D/g, "").slice(0, 4);
                          setPay({ ...pay, exp: d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d });
                        }}
                      />
                      <Field id="cvv" label="CVV" inputMode="numeric" autoComplete="off" required className="sm:col-span-3" value={pay.cvv} error={errors.cvv} onChange={(e) => setPay({ ...pay, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })} />
                    </div>
                  </fieldset>
                  <div className="mt-6 rounded-lg border border-dashed border-line-strong p-4 text-sm text-fg-muted">
                    <p className="font-medium text-fg">Otros métodos de pago</p>
                    <p className="mt-1">
                      Transferencia, pagos en efectivo, MSI y monederos <Placeholder>por definir con DDTech</Placeholder>
                    </p>
                  </div>
                </>
              )}

              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
                {step > 0 ? (
                  <Button type="button" variant="ghost" onClick={() => setStep((s) => s - 1)}>
                    ← Volver a {STEPS[step - 1].toLowerCase()}
                  </Button>
                ) : (
                  <Link href="/carrito" className="text-sm text-fg-muted hover:text-fg">
                    ← Volver al carrito
                  </Link>
                )}
                <Button type="submit" size="lg">
                  {step === 2 ? (
                    <>
                      <Lock className="size-4" aria-hidden /> Confirmar pedido · {formatPrice(total)}
                    </>
                  ) : (
                    `Continuar a ${STEPS[step + 1].toLowerCase()}`
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <div className="rounded-xl border border-line bg-surface p-6 text-center sm:p-10">
              <span className="mx-auto grid size-16 animate-check place-items-center rounded-full bg-success-soft text-success">
                <Check className="size-8" strokeWidth={3} aria-hidden />
              </span>
              <h2 ref={headingRef} tabIndex={-1} className="mt-5 text-2xl font-semibold tracking-[-0.02em] focus:outline-none">
                ¡Pedido confirmado!
              </h2>
              <p className="mt-2 text-sm text-fg-muted">
                Número de pedido <span className="font-mono font-semibold text-fg">{placed?.id}</span>
              </p>
              <p className="mx-auto mt-4 max-w-md rounded-md border border-warning/30 bg-warning-soft px-4 py-3 text-xs text-warning">
                Este es un pedido demostrativo del concepto de rediseño. No se realizó ningún cargo ni se enviará ningún producto.
              </p>
              <div className="mt-8 grid gap-2 sm:grid-cols-2">
                <ButtonLink href="/cuenta">Ver mis pedidos</ButtonLink>
                <ButtonLink href="/" variant="secondary">
                  Seguir comprando
                </ButtonLink>
              </div>
            </div>
          )}
        </div>
        <aside className="order-1 lg:order-2" aria-label="Resumen del pedido">
          <div className="lg:sticky lg:top-24">
            <Summary lines={shownLines} open={summaryOpen} onToggle={() => setSummaryOpen((v) => !v)} />
            <ul className="mt-4 hidden space-y-2 text-xs text-fg-subtle lg:block">
              <li className="flex items-center gap-2">
                <Lock className="size-3.5" aria-hidden /> Conexión cifrada (en producción) <Placeholder>proveedor de pagos</Placeholder>
              </li>
              <li className="flex items-center gap-2">
                <Package className="size-3.5" aria-hidden /> Garantía y devoluciones <Placeholder>política oficial</Placeholder>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
