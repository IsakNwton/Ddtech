import { Logo } from "@/components/layout/logo";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main id="contenido" className="container-page flex min-h-dvh flex-col items-center justify-center text-center">
      <Logo />
      <p className="mt-10 font-mono text-sm text-brand-text">Error 404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em]">No encontramos esta página</h1>
      <p className="mt-2 max-w-md text-fg-muted">Puede que el producto ya no esté disponible o que el enlace haya cambiado.</p>
      <div className="mt-8 flex gap-3">
        <ButtonLink href="/">Ir al inicio</ButtonLink>
        <ButtonLink href="/arma-tu-pc" variant="secondary">
          Arma tu PC
        </ButtonLink>
      </div>
    </main>
  );
}
