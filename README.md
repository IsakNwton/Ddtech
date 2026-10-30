# Galería de arte digital

Sitio web y panel de administración para un pintor: galería de obras con fichas
curatoriales, colecciones, biografía y consultas de adquisición.

> **Estado actual: contenido de demostración.**
> Las 10 pinturas, sus fotografías y la biografía son **provisionales**. Las imágenes se
> generaron por computadora (`scripts/demo-art`) y **no son obras del artista**; los textos
> biográficos están entre corchetes y no contienen datos inventados. Todo se identifica
> como demostración en el propio sitio.

---

## Puesta en marcha

Requiere **Node.js 20.9 o superior**.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # compilación de producción
npm run start      # servir la compilación
npm run lint
```

Sin variables de entorno, el sitio funciona completo con el contenido de demostración y el
panel (`/admin`) se abre en **modo demostración de solo lectura**.

---

## Qué funciona ya y qué necesita configuración

| Función | Estado sin configurar | Qué hace falta |
| --- | --- | --- |
| Portada, obras, filtros, fichas, colecciones, artista | ✅ Operativo (demo) | — |
| Zoom de alta resolución, modo «Contemplar obra», compartir | ✅ Operativo | — |
| Transiciones compartidas entre galería y obra | ✅ Navegadores con View Transitions (Chrome/Edge 125+, Safari 18+); en el resto, cambio instantáneo | — |
| Modo claro / oscuro, accesibilidad, movimiento reducido | ✅ Operativo | — |
| SEO: metadatos, Open Graph, sitemap, datos estructurados | ✅ Operativo · indexación **desactivada** | `SITE_INDEXING=true` y `NEXT_PUBLIC_SITE_URL` cuando haya contenido real |
| Formulario de contacto | ✅ Valida y responde, pero **avisa de que no puede enviar** | Supabase (clave de servicio) y/o Resend |
| Correo, WhatsApp, redes | Se muestran como «Pendiente de configurar» | Variables `NEXT_PUBLIC_*` |
| Panel de administración | Solo lectura (no guarda) | Supabase |
| Subida de fotografías | Desactivada | Supabase Storage |
| Pagos | ❌ No implementados (decisión deliberada: la compra empieza como consulta) | — |

---

## Configurar Supabase (base de datos, fotos y acceso al panel)

1. Cree un proyecto en [supabase.com](https://supabase.com).
2. En **SQL Editor**, pegue y ejecute `supabase/migrations/0001_galeria.sql`. Crea las
   tablas, las políticas de seguridad (RLS) y el bucket público `obras` para las fotografías.
3. En **Authentication → Users → Add user**, cree el usuario del artista (correo y contraseña).
   Conviene desactivar el registro público en **Authentication → Providers → Email → Allow new users to sign up**.
4. Conviértalo en administrador (SQL Editor):
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'correo-del-artista@ejemplo.com';
   ```
5. Copie `.env.example` a `.env.local` y complete:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...   # solo servidor: guarda los mensajes del formulario
   NEXT_PUBLIC_SITE_URL=https://su-dominio.com
   ```
6. Para el acceso con enlace por correo, añada `https://su-dominio.com/admin/auth/callback`
   en **Authentication → URL Configuration → Redirect URLs**.
7. Vuelva a compilar (`npm run build`). Las variables `NEXT_PUBLIC_*` se incorporan al compilar.

Con Supabase activo, **el contenido de demostración deja de usarse** (no se mezcla con el real):
la galería mostrará solo lo que se publique desde el panel.

### Seguridad

- Las rutas `/admin/*` pasan por `src/proxy.ts`, que refresca la sesión y redirige al acceso.
- Cada página del panel y **cada acción de servidor** verifica de nuevo, en el servidor, que el
  usuario esté en la tabla `admins` (`src/lib/auth.ts`). No hay contraseñas en el frontend.
- La base de datos aplica RLS: el público solo puede leer obras y colecciones publicadas; solo
  los administradores escriben. Los mensajes del formulario se insertan con la clave de servicio
  desde el servidor, de modo que nadie puede escribir en esa tabla con la clave pública.
- Las acciones solo aceptan imágenes alojadas en el bucket `obras` del propio proyecto.

## Envío de correos del formulario (opcional)

Con una cuenta de [Resend](https://resend.com) y un dominio verificado:

```
RESEND_API_KEY=...
CONTACT_TO_EMAIL=consultas@su-dominio.com
CONTACT_FROM_EMAIL="Galería <consultas@su-dominio.com>"
```

Si están configurados Supabase y Resend, cada consulta se guarda en el panel (**Mensajes**)
y además llega por correo.

---

## Reemplazar el contenido de demostración

- **Recomendado:** configure Supabase y cargue las obras desde `/admin` → «Agregar pintura».
  El panel sube la foto, calcula sus medidas, su color dominante y una miniatura difuminada para
  la carga progresiva.
- **Sin base de datos:** edite `src/content/demo/artworks.ts`, `collections.ts` y `artist.ts`,
  coloque las fotografías en `public/` y cambie `isDemo` a `false` / `isPlaceholder` a `false`.
- Para regenerar las imágenes de demostración: `node scripts/demo-art/generate.mjs`
  (usa Chromium vía Playwright).

---

## Arquitectura

```
src/
├─ app/
│  ├─ (site)/                 Sitio público (nav flotante, pie, scroll suave)
│  │  ├─ page.tsx             Portada cinematográfica
│  │  ├─ obras/               Galería con filtros + página de cada obra
│  │  ├─ colecciones/         Índice y página de colección
│  │  ├─ artista/             Biografía editorial
│  │  └─ contacto/            Consultas y adquisiciones
│  ├─ admin/                  Panel privado (acceso, obras, colecciones, biografía, mensajes)
│  ├─ sitemap.ts · robots.ts · opengraph-image.tsx · manifest.ts
│  └─ globals.css             Sistema de diseño (tokens, Liquid Glass, view transitions)
├─ components/
│  ├─ art/                    Imagen de obra (sin recortes), tarjeta, explorador con filtros
│  ├─ artwork/                Escenario, visor con zoom, modo contemplación, ficha técnica
│  ├─ home/ · artist/ · contact/ · admin/ · layout/ · motion/ · ui/
├─ content/demo/              Contenido de demostración (reemplazable)
├─ lib/
│  ├─ data/                   Repositorio: demo ⇄ Supabase con el mismo modelo
│  ├─ actions/                Acciones de servidor (contacto, panel, acceso)
│  ├─ supabase/               Clientes (servidor, navegador, servicio)
│  ├─ types.ts                Modelo de datos (Artwork, Collection, ArtistProfile…)
│  └─ auth.ts                 Verificación de administrador en el servidor
├─ proxy.ts                   Sesión y protección optimista de /admin
supabase/migrations/          Esquema SQL con RLS y almacenamiento
scripts/demo-art/             Generador de pinturas de demostración
```

### Sistema de diseño

- **Paleta:** blanco cálido `#F8F7F4`, marfil `#F1EFE9`, carbón `#202020`, gris cálido
  `#85817C`, dorado discreto `#B5A17A` (más variantes con contraste AA para texto pequeño).
  Modo oscuro con los mismos tokens.
- **Tipografía:** Cormorant Garamond (títulos editoriales) + Geist (texto y controles).
- **Liquid Glass** (`.glass`, `.glass-dark`): fondo translúcido con `backdrop-filter`, borde con
  refracción simulada, brillo especular que sigue al cursor (solo en la superficie bajo el puntero)
  y sombras en capas. Alternativas opacas si el navegador no soporta desenfoque o si el usuario
  prefiere transparencia reducida.
- **Las pinturas nunca se recortan:** todas las imágenes respetan su proporción original.

### Movimiento

- **Motion:** apariciones al desplazarse, máscaras de texto, nav con indicador animado, menú
  móvil, filtros, botones magnéticos, resortes ajustados.
- **View Transitions (React `<ViewTransition>`):** la pintura se expande de la galería a su página;
  deslizamiento direccional entre obra anterior/siguiente; fundido de página.
- **GSAP ScrollTrigger:** solo en el recorrido horizontal de obras destacadas de la portada
  (escritorio). Se carga bajo demanda.
- `prefers-reduced-motion` desactiva desplazamientos, parallax, scroll suave y transiciones.

### Rendimiento

Páginas estáticas con revalidación (ISR, 5 min) y revalidación inmediata al guardar desde el panel;
`next/image` con AVIF/WebP, placeholders difuminados y tamaños adaptados; visor y modo
contemplación cargados bajo demanda.
