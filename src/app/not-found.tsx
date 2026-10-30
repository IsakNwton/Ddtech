import Link from "next/link";
import { buttonClass } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main id="contenido" className="grid min-h-[100svh] place-items-center px-6 text-center">
      <div>
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-6 font-display text-6xl tracking-[-0.025em] sm:text-7xl">
          Esta sala está <span className="italic">vacía</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-muted-text">La página que busca no existe o la obra ya no está publicada.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/obras" className={buttonClass("primary", "lg")}>
            Ver las obras
          </Link>
          <Link href="/" className={buttonClass("outline", "lg")}>
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
