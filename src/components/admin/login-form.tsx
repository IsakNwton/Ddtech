"use client";

import { useActionState, useState } from "react";
import { sendMagicLink, signInWithPassword } from "@/lib/actions/auth";
import type { ActionState } from "@/lib/admin-validation";
import { AdminField, FormMessage, SubmitButton, adminInput } from "./ui";

export function LoginForm() {
  const [mode, setMode] = useState<"password" | "link">("password");
  const [pwState, pwAction] = useActionState<ActionState, FormData>(signInWithPassword, { status: "idle" });
  const [linkState, linkAction] = useActionState<ActionState, FormData>(sendMagicLink, { status: "idle" });
  const state = mode === "password" ? pwState : linkState;
  const e = state.errors ?? {};

  return (
    <div>
      <div className="mb-8 grid grid-cols-2 gap-2 rounded-2xl bg-ivory p-1.5" role="tablist" aria-label="Forma de entrar">
        {(
          [
            ["password", "Con contraseña"],
            ["link", "Con enlace por correo"],
          ] as const
        ).map(([m, l]) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={`press min-h-12 rounded-xl px-3 text-base font-medium ${mode === m ? "bg-paper shadow-sm" : "text-muted-text"}`}
          >
            {l}
          </button>
        ))}
      </div>

      <form action={mode === "password" ? pwAction : linkAction} className="space-y-6" key={mode}>
        <FormMessage status={state.status} message={state.message} />
        <AdminField label="Correo electrónico" htmlFor="email" error={e.email}>
          <input id="email" name="email" type="email" autoComplete="email" inputMode="email" className={adminInput} aria-invalid={!!e.email} required />
        </AdminField>
        {mode === "password" ? (
          <AdminField label="Contraseña" htmlFor="password" error={e.password}>
            <input id="password" name="password" type="password" autoComplete="current-password" className={adminInput} aria-invalid={!!e.password} required />
          </AdminField>
        ) : (
          <p className="text-base leading-relaxed text-muted-text">Le enviaremos un correo con un botón para entrar, sin necesidad de recordar la contraseña.</p>
        )}
        <SubmitButton className="w-full" pendingLabel={mode === "password" ? "Entrando…" : "Enviando…"}>
          {mode === "password" ? "Entrar al panel" : "Enviarme el enlace"}
        </SubmitButton>
      </form>
    </div>
  );
}
