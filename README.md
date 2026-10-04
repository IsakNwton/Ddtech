# DDTech — Concepto de rediseño

> **Concepto de rediseño independiente. No afiliado oficialmente con DDTech.**
> Precios, existencias, opiniones, contadores, políticas y configuraciones son **demostrativos**.
> Todo dato corporativo que DDTech debe confirmar aparece marcado como _placeholder_.

Propuesta de experiencia de compra para una tienda mexicana de hardware: búsqueda predictiva,
catálogo con filtros por especificación, fichas de producto completas, comparador, carrito
lateral, checkout sin distracciones y un configurador **Arma tu PC** con verificación de
compatibilidad, consumo estimado y rendimiento orientativo.

La página [`/propuesta`](src/app/(store)/propuesta/page.tsx) resume las decisiones de UX
(antes → después, impacto y KPI a medir), el sistema de diseño y lo que se necesita de DDTech
para llevarlo a producción.

## Cómo correrlo

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de producción (≈600 rutas y recursos estáticos)
npm run start
npm run lint
```

Requiere Node 20+.

## Páginas

| Ruta | Descripción |
| --- | --- |
| `/` | Home: hero con PC navegable, categorías, ofertas, promo del configurador, builds recomendadas, descubrimiento |
| `/componentes` | Índice de categorías |
| `/componentes/[categoria]` | Listado con filtros (p. ej. `/componentes/gpu`) |
| `/producto/[slug]` | Ficha de producto |
| `/arma-tu-pc` | Configurador (`?preset=1440p`, `?agregar=<slug>`, `?b=<build compartida>`) |
| `/comparar` | Comparador (hasta 4 productos de la misma categoría) |
| `/ofertas` | Ofertas de la semana (contador demostrativo) |
| `/pcs-gaming`, `/perifericos` | Listados con filtros |
| `/buscar?q=` | Resultados de búsqueda |
| `/carrito`, `/checkout` | Carrito y checkout en 4 pasos |
| `/cuenta`, `/favoritos` | Área de cliente demo (pedidos, builds guardadas) |
| `/soporte` | Centro de ayuda propuesto |
| `/propuesta` | Presentación del concepto |

## Stack

- **Next.js 16** (App Router, componentes de servidor, generación estática) + **React 19**
- **TypeScript** estricto
- **Tailwind CSS v4** con tokens de diseño en `src/app/globals.css`
- **Zustand** para estado de cliente persistido (carrito, favoritos, comparador, builds, cuenta demo)
- **lucide-react** (iconos) y **Geist** (tipografía, servida localmente)

## Estructura

```
src/
  app/
    (store)/            páginas con header, footer y navegación inferior
    (checkout)/         checkout sin distracciones (layout propio)
    api/                índice de búsqueda y datos de comparación (JSON estático)
    art/[file]/         ilustraciones de producto servidas como SVG estáticos
  components/
    ui/                 primitivas del sistema de diseño (Button, Badge, Price, Sheet, Skeleton…)
    layout/             header, mega menús, menú móvil, navegación inferior, footer
    search/             búsqueda predictiva (combobox accesible) de escritorio y móvil
    product/            tarjeta, galería, caja de compra, secciones de ficha, carruseles
    catalog/            vista de catálogo, panel de filtros, rango de precio
    builder/            configurador Arma tu PC
    compare/ cart/ checkout/ account/ home/ feedback/
  data/                 catálogo demo, categorías, builds recomendadas, opiniones de ejemplo
  hooks/                hooks reutilizables (búsqueda, acciones de producto, media queries…)
  lib/                  lógica pura: compatibilidad, rendimiento, filtros, búsqueda, arte, SEO
  store/                stores de Zustand
```

## Sistema de diseño

- Interfaz oscura con **un solo color de acento**. El acento es **provisional**: no se pudo
  verificar el color corporativo oficial. Para cambiarlo, edita `--color-brand`,
  `--color-brand-hover`, `--color-brand-text`, `--color-brand-soft` y `--color-brand-line`
  en `src/app/globals.css`; todo el sitio se actualiza.
- El logotipo es un wordmark conceptual (`src/components/layout/logo.tsx`), no el logotipo
  oficial; debe sustituirse por el activo de marca real.
- Escala tipográfica Geist Sans / Geist Mono, grid de 4 px, contenedor de 1440 px,
  radios 6/10/14/20 px, animaciones de 150–300 ms que respetan `prefers-reduced-motion`.

## Arma tu PC: compatibilidad

`src/lib/compatibility.ts` contiene reglas deterministas y fáciles de extender:

- Socket CPU ↔ tarjeta madre y tipo de memoria soportado
- RAM: tipo (DDR4/DDR5), módulos vs. ranuras, capacidad máxima
- Gabinete: formato de tarjeta madre, largo de GPU (con aviso de espacio justo), altura de
  disipador y soporte de radiadores
- Refrigeración: socket y TDP de referencia; aviso si el CPU no incluye disipador
- Fuente: consumo estimado, potencia recomendada (margen y recomendación de la GPU),
  conector 12V-2x6 nativo o adaptador con suficientes cables PCIe de 8 pines

Cada opción se evalúa como `✓ Compatible`, `⚠ Revisar` o `✕ No compatible` y se atribuyen al
candidato los problemas que introduce. `src/lib/performance.ts` produce una estimación
**orientativa** (1080p/1440p/4K y uso) a partir de índices relativos de demostración.

## Datos

- `src/data/products/*`: ~90 productos inspirados en hardware real. Las especificaciones son
  aproximadas; precios, existencias, valoraciones y ventas son ficticios y deterministas.
- Las imágenes son ilustraciones vectoriales propias (`src/lib/art`) servidas como archivos
  estáticos con caché inmutable y carga diferida. Con fotografía real basta con cambiar
  `productImage()` y quitar `unoptimized` en `ProductImage` para usar el optimizador de Next.
- Opiniones y preguntas son ejemplos marcados como tales.

## Accesibilidad, rendimiento y SEO

- Navegación completa por teclado, `focus-visible`, enlace "Saltar al contenido", diálogos
  nativos (`<dialog>`) con trampa de foco, combobox ARIA en la búsqueda, `aria-live` en
  toasts y estados de compatibilidad. Las páginas principales pasan axe-core (WCAG 2.1 AA).
- Páginas estáticas, componentes de servidor por defecto, índice de búsqueda y datos de
  comparación descargados solo cuando se necesitan, skeletons en estados de carga.
- Metadatos por página, Open Graph (`public/og.png`), Schema.org (`Product`,
  `BreadcrumbList`, `WebSite` con `SearchAction`). Como es un concepto no oficial,
  `robots` bloquea la indexación.

## Para producción se necesita de DDTech

Logotipo y color oficiales · catálogo, fichas y fotografía · precios e inventario en tiempo
real · políticas de envío, garantía, devoluciones y facturación · métodos de pago y MSI ·
sucursales y canales de contacto · plataforma de reseñas · validación de reglas de
compatibilidad por su equipo técnico.
