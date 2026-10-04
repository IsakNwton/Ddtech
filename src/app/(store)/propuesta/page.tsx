import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, CircleAlert } from "lucide-react";
import { DISCLAIMER, pageMetadata } from "@/lib/seo";
import { Badge, ProductTags } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CompatBadge } from "@/components/ui/compat";
import { Placeholder } from "@/components/ui/placeholder";
import { Price } from "@/components/ui/price";
import { Rating } from "@/components/ui/rating";
import { StockStatus } from "@/components/ui/stock";

export const metadata: Metadata = pageMetadata({
  title: "Propuesta de rediseño",
  description: "Decisiones de UX, sistema de diseño y recorrido del concepto de rediseño para DDTech. " + DISCLAIMER,
  path: "/propuesta",
});

type Impact = "UX" | "Conversión" | "Descubrimiento" | "Fricción" | "Confianza" | "Retención" | "Móvil" | "Rendimiento";

const DECISIONS: { area: string; before: string; after: string; impact: Impact[]; kpi: string; href: string }[] = [
  {
    area: "Búsqueda",
    before: "Caja de búsqueda secundaria; resultados solo al enviar.",
    after: "Barra protagonista con sugerencias instantáneas (modelos, categorías, PCs con ese componente), imágenes, precios, atajo “/” y búsquedas recientes.",
    impact: ["Descubrimiento", "Conversión"],
    kpi: "% de búsquedas con clic · salidas desde resultados",
    href: "/buscar?q=5070",
  },
  {
    area: "Navegación",
    before: "Listas de categorías de texto, profundas y difíciles de escanear.",
    after: "Mega menú con imagen, contexto y precio de entrada por categoría; menú móvil por pestañas y navegación inferior.",
    impact: ["Descubrimiento", "Móvil"],
    kpi: "Profundidad de navegación · rebote en categorías",
    href: "/componentes",
  },
  {
    area: "Tarjeta de producto",
    before: "Información dispersa; para saber stock o envío hay que entrar al producto.",
    after: "Marca, nombre, specs clave, precio anterior y actual, descuento, stock, envío y valoración en segundos; agregar, favoritos y comparar sin salir.",
    impact: ["Conversión", "Fricción"],
    kpi: "Add-to-cart desde listado · CTR a ficha",
    href: "/componentes/gpu",
  },
  {
    area: "Filtros",
    before: "Filtros genéricos (marca/precio) que no reflejan cómo se compra hardware.",
    after: "Facetas por especificación (chipset, VRAM, consumo, longitud…) con conteos, chips activos y estado en la URL para compartir.",
    impact: ["Descubrimiento", "UX"],
    kpi: "Uso de filtros · tiempo hasta ficha de producto",
    href: "/componentes/gpu?marca=NVIDIA",
  },
  {
    area: "Ficha de producto",
    before: "Especificaciones en un bloque de texto; sin respuesta a “¿es compatible?”.",
    after: "Galería con zoom, especificaciones agrupadas, compatibilidad calculada desde el catálogo, financiamiento de ejemplo y barra de compra fija en móvil.",
    impact: ["Confianza", "Conversión"],
    kpi: "Conversión de ficha · consultas a soporte por compatibilidad",
    href: "/producto/msi-geforce-rtx-5070-ti-16g-gaming-trio-oc",
  },
  {
    area: "Arma tu PC",
    before: "El cliente arma su lista a mano o pregunta por chat si todo es compatible.",
    after: "8 pasos guiados, solo opciones compatibles, avisos de potencia/espacio/conectores, consumo estimado, rendimiento orientativo y build completa al carrito en un clic.",
    impact: ["Conversión", "Confianza", "Retención"],
    kpi: "Ticket promedio · builds completadas · devoluciones por incompatibilidad",
    href: "/arma-tu-pc?preset=1440p",
  },
  {
    area: "Comparador",
    before: "Comparar implica abrir pestañas y recordar cifras.",
    after: "Hasta 4 productos lado a lado con diferencias resaltadas y el mejor valor marcado por fila.",
    impact: ["UX", "Conversión"],
    kpi: "Conversión tras comparar",
    href: "/comparar",
  },
  {
    area: "Carrito",
    before: "Al agregar, salto a otra página que interrumpe la exploración.",
    after: "Carrito lateral con animación de confirmación, cantidades, eliminar con deshacer y totales claros.",
    impact: ["Fricción", "Conversión"],
    kpi: "Productos por pedido · abandono de carrito",
    href: "/carrito",
  },
  {
    area: "Checkout",
    before: "Formulario largo con navegación y promociones que distraen.",
    after: "4 pasos con barra de progreso, validación en línea, autocompletado y layout sin distracciones.",
    impact: ["Fricción", "Conversión"],
    kpi: "Abandono por paso de checkout",
    href: "/checkout",
  },
  {
    area: "Confianza",
    before: "Garantías y políticas escondidas en el pie de página.",
    after: "Señales visibles en home, ficha, carrito y checkout (con el contenido oficial de DDTech).",
    impact: ["Confianza"],
    kpi: "Conversión · tickets de soporte pre-venta",
    href: "/soporte",
  },
  {
    area: "Experiencia móvil",
    before: "Desktop comprimido: menús diminutos y acciones lejos del pulgar.",
    after: "Navegación inferior, búsqueda a pantalla completa, filtros en hoja inferior y configurador con resumen siempre accesible.",
    impact: ["Móvil", "Conversión"],
    kpi: "Conversión móvil · tiempo a carrito",
    href: "/",
  },
  {
    area: "Rendimiento y accesibilidad",
    before: "Imágenes pesadas y efectos que retrasan la compra.",
    after: "Páginas estáticas, componentes de servidor, imágenes diferidas, animaciones de 150–300 ms, contraste AA, teclado y lectores de pantalla.",
    impact: ["Rendimiento", "UX"],
    kpi: "Core Web Vitals (LCP, INP, CLS)",
    href: "/",
  },
];

const NEEDS = [
  "Logotipo y color corporativo oficiales (el acento actual es provisional y se cambia en un solo token)",
  "Catálogo, fichas técnicas y fotografía de producto (API o feed)",
  "Precios, inventario por sucursal y disponibilidad en tiempo real",
  "Políticas de envío, garantía, devoluciones y facturación",
  "Métodos de pago, bancos y condiciones de MSI",
  "Sucursales, horarios y canales de contacto",
  "Plataforma de reseñas verificadas y preguntas",
  "Reglas de compatibilidad validadas por el equipo técnico",
];

const TOUR = [
  { label: "Home", href: "/" },
  { label: "Búsqueda “5070”", href: "/buscar?q=5070" },
  { label: "GPUs con filtros", href: "/componentes/gpu" },
  { label: "Ficha de producto", href: "/producto/msi-geforce-rtx-5070-ti-16g-gaming-trio-oc" },
  { label: "Arma tu PC", href: "/arma-tu-pc" },
  { label: "Comparador", href: "/comparar" },
  { label: "Ofertas", href: "/ofertas" },
  { label: "Carrito y checkout", href: "/carrito" },
  { label: "Cuenta", href: "/cuenta" },
];

const SWATCHES = [
  { name: "bg", v: "var(--color-bg)" },
  { name: "surface", v: "var(--color-surface)" },
  { name: "surface-2", v: "var(--color-surface-2)" },
  { name: "surface-3", v: "var(--color-surface-3)" },
  { name: "line", v: "var(--color-line-strong)" },
  { name: "fg", v: "var(--color-fg)" },
  { name: "fg-muted", v: "var(--color-fg-muted)" },
  { name: "brand (provisional)", v: "var(--color-brand)" },
  { name: "success", v: "var(--color-success)" },
  { name: "warning", v: "var(--color-warning)" },
  { name: "danger", v: "var(--color-danger)" },
  { name: "deal", v: "var(--color-deal)" },
];

export default function PropuestaPage() {
  return (
    <div className="container-page pt-10">
      <header className="max-w-3xl">
        <p className="font-mono text-2xs font-semibold uppercase tracking-[0.16em] text-brand-text">Propuesta de rediseño</p>
        <h1 className="mt-3 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl">
          Así podría verse y sentirse la próxima generación de DDTech.
        </h1>
        <p className="mt-5 text-pretty text-lg text-fg-muted">
          Una experiencia de compra de hardware diseñada para encontrar rápido, entender lo que se compra, verificar compatibilidad y pagar sin fricción, en cualquier pantalla.
        </p>
        <div className="mt-6 flex gap-3 rounded-lg border border-warning/30 bg-warning-soft p-4 text-sm">
          <CircleAlert className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden />
          <p className="text-fg-muted">
            <strong className="text-fg">{DISCLAIMER}</strong> Precios, existencias, opiniones, contadores y políticas son demostrativos. Los textos marcados como <Placeholder>placeholder</Placeholder> requieren información oficial.
          </p>
        </div>
      </header>

      <section aria-labelledby="principios" className="mt-16">
        <h2 id="principios" className="text-2xl font-semibold tracking-[-0.025em]">Principios</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Usabilidad antes que efecto", "Cada decisión visual debe ayudar a vender. Nada se interpone entre el cliente y el carrito."],
            ["Información en segundos", "Precio, stock, envío y specs clave visibles donde se toma la decisión."],
            ["Confianza técnica", "Compatibilidad, consumo y rendimiento explicados, no adivinados."],
            ["Móvil primero de verdad", "Navegación al alcance del pulgar, no un desktop comprimido."],
          ].map(([t, d]) => (
            <li key={t} className="rounded-lg border border-line bg-surface p-5">
              <p className="font-semibold">{t}</p>
              <p className="mt-1.5 text-sm text-fg-muted">{d}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="decisiones-t" id="decisiones" className="mt-16 scroll-mt-36">
        <h2 id="decisiones-t" className="text-2xl font-semibold tracking-[-0.025em]">Antes → Después</h2>
        <p className="mt-2 max-w-2xl text-sm text-fg-muted">
          “Antes” describe patrones habituales del e-commerce tradicional de hardware, no una auditoría del sitio actual. Cada mejora indica qué se espera mover y cómo medirlo.
        </p>
        <div className="mt-6 overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[880px] border-collapse text-sm">
            <thead className="bg-surface-2 text-left">
              <tr>
                {["Área", "Antes", "Después (concepto)", "Impacto", "KPI a medir"].map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 font-mono text-2xs font-semibold uppercase tracking-[0.12em] text-fg-subtle">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DECISIONS.map((d) => (
                <tr key={d.area} className="border-t border-line align-top">
                  <th scope="row" className="px-4 py-4 text-left font-semibold">
                    <Link href={d.href} className="hover:text-brand-text">
                      {d.area} <ArrowRight className="inline size-3.5" aria-hidden />
                    </Link>
                  </th>
                  <td className="px-4 py-4 text-fg-subtle">{d.before}</td>
                  <td className="px-4 py-4 text-fg-muted">{d.after}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {d.impact.map((i) => (
                        <Badge key={i} tone="brand">
                          {i}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-xs text-fg-muted">{d.kpi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="sistema-t" id="sistema" className="mt-16 scroll-mt-36">
        <h2 id="sistema-t" className="text-2xl font-semibold tracking-[-0.025em]">Sistema de diseño</h2>
        <p className="mt-2 max-w-2xl text-sm text-fg-muted">
          Interfaz oscura con un único color de acento (provisional) para jerarquía y acciones. Tokens centralizados en <code className="rounded-xs bg-surface-3 px-1 font-mono text-xs">globals.css</code>: cambiar el acento por el color corporativo actualiza todo el sitio.
        </p>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-line bg-surface p-5">
            <h3 className="text-sm font-semibold">Color</h3>
            <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {SWATCHES.map((s) => (
                <li key={s.name}>
                  <span className="block h-12 rounded-md border border-line" style={{ background: s.v }} />
                  <span className="mt-1.5 block font-mono text-[10.5px] text-fg-subtle">{s.name}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-line bg-surface p-5">
            <h3 className="text-sm font-semibold">Tipografía</h3>
            <div className="mt-4 space-y-3">
              <p className="text-4xl font-semibold tracking-[-0.04em]">Construye algo increíble.</p>
              <p className="text-xl font-semibold tracking-[-0.02em]">Títulos de sección · Geist Sans 600</p>
              <p className="text-sm text-fg-muted">Texto de interfaz · Geist Sans 400, 14–16 px, interlineado amplio.</p>
              <p className="font-mono text-xs text-fg-muted">ESPECIFICACIONES · GEIST MONO · 16 GB GDDR7 · 300 W</p>
            </div>
          </div>
          <div className="rounded-xl border border-line bg-surface p-5 lg:col-span-2">
            <h3 className="text-sm font-semibold">Componentes</h3>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button>Agregar al carrito</Button>
              <Button variant="secondary">Comprar ahora</Button>
              <Button variant="outline">Comparar</Button>
              <Button variant="ghost">Cancelar</Button>
              <ProductTags tags={["oferta", "nuevo", "top", "envio-gratis"]} max={4} />
              <CompatBadge level="ok" />
              <CompatBadge level="warn" label="Revisa la potencia" />
              <CompatBadge level="error" />
              <StockStatus stock={12} />
              <StockStatus stock={3} />
              <Rating value={4.6} count={312} />
              <Price price={12999} compareAt={13999} />
            </div>
            <ul className="mt-6 grid gap-2 text-xs text-fg-muted sm:grid-cols-3">
              <li className="flex gap-2"><Check className="size-4 text-success" aria-hidden /> Grid de 4 px, contenedor de 1440 px</li>
              <li className="flex gap-2"><Check className="size-4 text-success" aria-hidden /> Radios 6 / 10 / 14 / 20 px</li>
              <li className="flex gap-2"><Check className="size-4 text-success" aria-hidden /> Movimiento 150–300 ms, respeta “reducir movimiento”</li>
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="tour" className="mt-16">
        <h2 id="tour" className="text-2xl font-semibold tracking-[-0.025em]">Recorrido sugerido para la presentación</h2>
        <ol className="mt-6 grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {TOUR.map((t, i) => (
            <li key={t.href}>
              <Link href={t.href} className="group flex items-center gap-3 rounded-lg border border-line bg-surface p-4 transition-colors hover:border-brand-line">
                <span className="tabular grid size-7 shrink-0 place-items-center rounded-full bg-surface-3 font-mono text-xs font-semibold text-fg-muted group-hover:bg-brand group-hover:text-white">{i + 1}</span>
                <span className="text-sm font-medium">{t.label}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="needs" className="mt-16 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-line bg-surface p-6">
          <h2 id="needs" className="text-xl font-semibold tracking-[-0.02em]">Para llevarlo a producción necesitamos de DDTech</h2>
          <ul className="mt-5 space-y-2.5 text-sm text-fg-muted">
            {NEEDS.map((n) => (
              <li key={n} className="flex gap-2.5">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-warning" aria-hidden />
                {n}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-line bg-surface p-6">
          <h2 className="text-xl font-semibold tracking-[-0.02em]">Arquitectura</h2>
          <ul className="mt-5 space-y-2.5 text-sm text-fg-muted">
            {[
              "Next.js (App Router) con componentes de servidor y generación estática",
              "TypeScript estricto y componentes reutilizables por dominio",
              "Tailwind CSS con tokens de diseño centralizados",
              "Estado de cliente ligero (Zustand) persistido en el navegador",
              "Motor de compatibilidad y estimador de rendimiento desacoplados de la UI",
              "Metadatos, Open Graph y Schema.org (Product, BreadcrumbList, WebSite)",
              "Listo para conectar a un backend de e-commerce o headless commerce",
            ].map((n) => (
              <li key={n} className="flex gap-2.5">
                <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                {n}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
