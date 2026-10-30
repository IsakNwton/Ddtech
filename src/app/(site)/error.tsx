"use client";

import { buttonClass } from "@/components/ui/button";

export default function SiteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="grid min-h-[80svh] place-items-center px-6 text-center">
      <div>
        <p className="eyebrow">Algo no salió bien</p>
        <h1 className="mt-6 font-display text-5xl tracking-[-0.02em] sm:text-6xl">No pudimos mostrar esta página</h1>
        <p className="mx-auto mt-5 max-w-md text-muted-text">Puede intentarlo de nuevo. Si el problema continúa, vuelva más tarde.</p>
        <button type="button" onClick={reset} className={buttonClass("primary", "lg", "mt-10")}>
          Reintentar
        </button>
      </div>
    </div>
  );
}
