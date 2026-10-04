"use client";

import { useState } from "react";
import { toast } from "@/store/ui";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  return (
    <form
      className="mt-3 flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!/^\S+@\S+\.\S+$/.test(email)) {
          toast({ title: "Escribe un correo válido", tone: "warning" });
          return;
        }
        setEmail("");
        toast({ title: "¡Listo! (demo)", description: "En producción aquí se registraría tu correo.", tone: "success" });
      }}
    >
      <label htmlFor="newsletter" className="sr-only">
        Correo electrónico
      </label>
      <input
        id="newsletter"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@correo.com"
        className="h-10 min-w-0 flex-1 rounded-md border border-line-strong bg-surface-2 px-3 text-sm placeholder:text-fg-subtle focus:border-brand-line focus:outline-none"
      />
      <button type="submit" className="h-10 rounded-md bg-surface-4 px-4 text-sm font-semibold text-fg transition-colors hover:bg-[#2a303a]">
        Suscribirme
      </button>
    </form>
  );
}
