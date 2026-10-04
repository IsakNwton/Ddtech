"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Cpu, Heart, LogOut, MapPin, Package, Trash2, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { BUILD_STEPS } from "@/lib/compatibility";
import { useHydrated } from "@/hooks/use-hydrated";
import { useAccount } from "@/store/account";
import { useBuilder } from "@/store/builder";
import { useFavorites } from "@/store/favorites";
import { toast } from "@/store/ui";
import { Button, ButtonLink } from "@/components/ui/button";
import { Placeholder } from "@/components/ui/placeholder";
import { ProductImage } from "@/components/ui/product-image";
import { Skeleton } from "@/components/ui/skeleton";

type Tab = "resumen" | "pedidos" | "builds" | "direcciones";

export function AccountView({ parts }: { parts: Record<string, { name: string; image: string }> }) {
  const hydrated = useHydrated();
  const user = useAccount((s) => s.user);
  const signIn = useAccount((s) => s.signIn);
  const signOut = useAccount((s) => s.signOut);
  const orders = useAccount((s) => s.orders);
  const saved = useBuilder((s) => s.saved);
  const removeSaved = useBuilder((s) => s.removeSaved);
  const load = useBuilder((s) => s.load);
  const favCount = useFavorites((s) => s.items.length);
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("resumen");
  const [email, setEmail] = useState("");

  if (!hydrated) return <Skeleton className="h-96 w-full rounded-xl" />;

  if (!user) {
    return (
      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
        <form
          className="rounded-xl border border-line bg-surface p-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (!/^\S+@\S+\.\S+$/.test(email)) {
              toast({ title: "Escribe un correo válido", tone: "warning" });
              return;
            }
            signIn({ name: email.split("@")[0], email });
            toast({ title: "Sesión demo iniciada", tone: "success" });
          }}
        >
          <h2 className="text-lg font-semibold">Iniciar sesión</h2>
          <p className="mt-1 text-sm text-fg-muted">Acceso demostrativo: no se valida ni se envía ninguna contraseña.</p>
          <label className="mt-5 block text-sm">
            <span className="text-fg-muted">Correo electrónico</span>
            <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 h-11 w-full rounded-md border border-line-strong bg-surface-2 px-3 text-sm focus:border-brand-line focus:outline-none" />
          </label>
          <label className="mt-3 block text-sm">
            <span className="text-fg-muted">Contraseña</span>
            <input type="password" autoComplete="current-password" className="mt-1.5 h-11 w-full rounded-md border border-line-strong bg-surface-2 px-3 text-sm focus:border-brand-line focus:outline-none" />
          </label>
          <Button type="submit" block className="mt-5">
            Entrar
          </Button>
          <button type="button" onClick={() => signIn({ name: "Invitado", email: "invitado@demo.mx" })} className="mt-3 w-full text-center text-sm font-medium text-brand-text hover:underline">
            Continuar como invitado (demo)
          </button>
        </form>
        <div className="rounded-xl border border-line bg-surface-2/50 p-6">
          <h2 className="text-lg font-semibold">¿Nuevo en DDTech?</h2>
          <ul className="mt-4 space-y-3 text-sm text-fg-muted">
            {[
              { icon: Package, t: "Sigue tus pedidos en un solo lugar" },
              { icon: Cpu, t: "Guarda tus builds y retómalas cuando quieras" },
              { icon: Heart, t: "Sincroniza tus favoritos" },
              { icon: MapPin, t: "Compra más rápido con tus direcciones guardadas" },
            ].map(({ icon: Icon, t }) => (
              <li key={t} className="flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-md bg-surface-3 text-brand-text">
                  <Icon className="size-4" aria-hidden />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <Button variant="secondary" block className="mt-6" onClick={() => toast({ title: "Registro: función demostrativa" })}>
            Crear cuenta
          </Button>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof User; count?: number }[] = [
    { id: "resumen", label: "Resumen", icon: User },
    { id: "pedidos", label: "Pedidos", icon: Package, count: orders.length },
    { id: "builds", label: "Builds guardadas", icon: Cpu, count: saved.length },
    { id: "direcciones", label: "Direcciones", icon: MapPin },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
      <nav aria-label="Mi cuenta" className="lg:sticky lg:top-[88px] lg:self-start">
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-line bg-surface p-3">
          <span className="grid size-10 place-items-center rounded-full bg-brand text-sm font-bold uppercase text-white">{user.name.slice(0, 2)}</span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-fg-subtle">{user.email}</p>
          </div>
        </div>
        <ul className="flex gap-1 overflow-x-auto scrollbar-none lg:flex-col">
          {tabs.map(({ id, label, icon: Icon, count }) => (
            <li key={id} className="shrink-0">
              <button
                type="button"
                onClick={() => setTab(id)}
                aria-current={tab === id ? "page" : undefined}
                className={cn("flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors", tab === id ? "bg-surface-3 text-fg" : "text-fg-muted hover:text-fg")}
              >
                <Icon className="size-4" aria-hidden /> {label}
                {count ? <span className="tabular ml-auto rounded-full bg-surface-4 px-1.5 text-2xs">{count}</span> : null}
              </button>
            </li>
          ))}
          <li className="shrink-0">
            <button type="button" onClick={signOut} className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-fg-subtle hover:text-fg">
              <LogOut className="size-4" aria-hidden /> Cerrar sesión
            </button>
          </li>
        </ul>
      </nav>

      <div className="min-w-0">
        {tab === "resumen" && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-semibold">Hola, {user.name}</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Pedidos", value: orders.length, onClick: () => setTab("pedidos") },
                { label: "Builds guardadas", value: saved.length, onClick: () => setTab("builds") },
                { label: "Favoritos", value: favCount, onClick: () => router.push("/favoritos") },
              ].map((s) => (
                <button key={s.label} type="button" onClick={s.onClick} className="rounded-lg border border-line bg-surface p-5 text-left transition-colors hover:border-line-strong">
                  <p className="text-xs text-fg-subtle">{s.label}</p>
                  <p className="tabular mt-1 text-3xl font-semibold">{s.value}</p>
                </button>
              ))}
            </div>
            <div className="mt-6 rounded-lg border border-brand-line bg-brand-soft p-5">
              <p className="font-semibold">¿Armando una PC?</p>
              <p className="mt-1 text-sm text-fg-muted">Tus builds guardadas te esperan aquí para continuar cuando quieras.</p>
              <ButtonLink href="/arma-tu-pc" size="sm" className="mt-4">
                Ir al configurador
              </ButtonLink>
            </div>
          </div>
        )}

        {tab === "pedidos" && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-semibold">Pedidos</h2>
            {orders.length === 0 ? (
              <p className="mt-4 rounded-lg border border-line bg-surface p-6 text-sm text-fg-muted">Aún no tienes pedidos. Los pedidos demo del checkout aparecerán aquí.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {orders.map((o) => (
                  <li key={o.id} className="rounded-lg border border-line bg-surface p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-mono text-sm font-semibold">{o.id}</p>
                        <p className="text-xs text-fg-subtle">{new Date(o.createdAt).toLocaleString("es-MX")} · {o.shipping}</p>
                      </div>
                      <span className="rounded-sm bg-warning-soft px-2 py-1 text-xs font-medium text-warning">Pedido demo · sin cargo</span>
                    </div>
                    <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-none">
                      {o.lines.map((l) => (
                        <span key={l.product.id} className="stage size-14 shrink-0 overflow-hidden rounded-md border border-line p-1">
                          <ProductImage src={l.product.image} alt={l.product.name} sizes="56px" />
                        </span>
                      ))}
                    </div>
                    <p className="mt-3 text-sm">
                      Total: <span className="tabular font-semibold">{formatPrice(o.total)}</span>
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {tab === "builds" && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-semibold">Builds guardadas</h2>
            {saved.length === 0 ? (
              <p className="mt-4 rounded-lg border border-line bg-surface p-6 text-sm text-fg-muted">
                Guarda una build desde <Link href="/arma-tu-pc" className="text-brand-text hover:underline">Arma tu PC</Link> para verla aquí.
              </p>
            ) : (
              <ul className="mt-4 grid gap-3 md:grid-cols-2">
                {saved.map((b) => (
                  <li key={b.id} className="flex flex-col rounded-lg border border-line bg-surface p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{b.name}</p>
                        <p className="text-xs text-fg-subtle">{Object.keys(b.selection).length} piezas · {formatPrice(b.total)} (demo)</p>
                      </div>
                      <button type="button" onClick={() => removeSaved(b.id)} aria-label={`Eliminar ${b.name}`} className="grid size-8 place-items-center rounded-md text-fg-subtle hover:bg-danger-soft hover:text-danger">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <ul className="mt-3 space-y-1 text-xs text-fg-muted">
                      {BUILD_STEPS.filter((s) => b.selection[s.slot]).map((s) => (
                        <li key={s.slot} className="truncate">
                          <span className="text-fg-subtle">{s.short}:</span> {parts[b.selection[s.slot]!]?.name ?? "—"}
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="mt-4 self-start"
                      onClick={() => {
                        load(b.selection);
                        router.push("/arma-tu-pc");
                      }}
                    >
                      Abrir en el configurador
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {tab === "direcciones" && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-semibold">Direcciones</h2>
            <div className="mt-4 rounded-lg border border-dashed border-line-strong bg-surface p-6 text-sm text-fg-muted">
              Gestión de direcciones <Placeholder>integración con la plataforma de DDTech</Placeholder>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
