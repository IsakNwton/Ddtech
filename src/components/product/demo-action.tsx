"use client";

import type { ReactNode } from "react";
import { toast } from "@/store/ui";
import { Button, type ButtonVariant } from "@/components/ui/button";

/** Botón para funciones fuera del alcance del concepto: comunica claramente que es demo */
export function DemoAction({ children, message, variant = "secondary" }: { children: ReactNode; message: string; variant?: ButtonVariant }) {
  return (
    <Button variant={variant} size="sm" onClick={() => toast({ title: "Función demostrativa", description: message })}>
      {children}
    </Button>
  );
}
