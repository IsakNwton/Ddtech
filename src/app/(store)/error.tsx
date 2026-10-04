"use client";

import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-page py-24 text-center">
      <h1 className="text-2xl font-semibold">Algo salió mal</h1>
      <p className="mt-2 text-fg-muted">Intenta de nuevo. Si el problema continúa, recarga la página.</p>
      <Button className="mt-6" onClick={reset}>
        Reintentar
      </Button>
    </div>
  );
}
