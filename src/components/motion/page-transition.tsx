import { ViewTransition, type ReactNode } from "react";

/**
 * Transición de página (View Transitions API vía React).
 * - Navegación normal: fundido con leve ascenso.
 * - Anterior / siguiente obra: deslizamiento direccional.
 * Debe usarse en cada page.tsx (los layouts persisten y no disparan enter/exit).
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "page-fade" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "page-fade" }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
