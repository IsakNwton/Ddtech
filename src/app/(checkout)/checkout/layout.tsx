import Link from "next/link";
import { Lock } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { DISCLAIMER } from "@/lib/seo";

/** Checkout sin distracciones: sin navegación ni promociones, solo lo necesario para pagar */
export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-line bg-bg">
        <div className="container-page flex h-16 items-center justify-between">
          <Logo />
          <span className="inline-flex items-center gap-2 text-sm text-fg-muted">
            <Lock className="size-4 text-success" aria-hidden /> Pago seguro
          </span>
          <Link href="/carrito" className="hidden text-sm text-fg-muted hover:text-fg sm:block">
            Volver al carrito
          </Link>
        </div>
      </header>
      <main id="contenido" className="container-page max-w-[1180px] py-8 sm:py-10">
        {children}
      </main>
      <footer className="container-page max-w-[1180px] pb-10 text-xs text-fg-subtle">{DISCLAIMER} Checkout demostrativo: no se procesan pagos.</footer>
    </>
  );
}
