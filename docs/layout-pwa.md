# Base de interfaz PWA

## Qué está disponible

- `src/app/layouts/AppLayout.jsx`: marco compartido inspirado en `Life-RPG Modulos
  M07-M15.html`: encabezado con avatar, título y pestañas, fondo punteado y dock flotante
  inferior tanto en escritorio como en móvil. `variant="lite"` ofrece Amigos, Botín,
  Diario, Ánimo, Progreso y Retos; `variant="admin"` ofrece Host, Economía y Datos.
- `src/app/router/modules.js`: nombres, iconos y rutas de cada sección. Las rutas se
  registran en `src/app/router/AppRouter.jsx` con React Router.
- `src/shared/styles/index.css`: tokens, tema oscuro predeterminado, variante clara y
  estilos de componentes. La preferencia de tema se conserva en `localStorage`. El área
  de trabajo crece hasta 2000 px en monitores grandes; a 1024 px se reorganizan los
  paneles, a 900 px las métricas pasan a dos columnas y bajo 600 px las tablas de
  clientes y respaldos se convierten en tarjetas. La consola conserva desplazamiento
  horizontal dentro de su propio panel.
- `src/shared/components/ModuleScreen.jsx`: pestañas y pantalla de espera para las
  secciones todavía no implementadas. El encabezado y las pestañas se dibujan una sola
  vez desde el layout, usando los títulos de `src/app/router/modules.js`.
- `src/shared/components/Icon.jsx`: iconos SVG reutilizables.
- `src/shared/components/AdminUI.jsx`: superficies, métricas, botones, indicadores y
  mensajes de estado compartidos por M13 y M15.
- `src/modules/m13-sincronizacion-red/pages/`: monitor del host, clientes y consola REST.
- `src/modules/m15-gestion-bd/pages/`: estado SQL, respaldos y purga con vista previa.
- `public/manifest.webmanifest`: metadatos iniciales de la aplicación web. El trabajo de
  instalación/offline (iconos PNG adecuados y estrategia de service worker) se puede
  completar en una entrega posterior.

## Cómo tomar una sección

1. Trabaja en tu rama `feature/mXX-nombre` y dentro de
   `src/modules/mXX-nombre/{pages,components,hooks,api}`. Mantén la lógica de negocio
   en el backend: `pages → hooks → api → backend`.
2. Sustituye la instancia de `ModuleScreen` en `src/app/router/AppRouter.jsx` por la página
   de tu módulo. Conserva la ruta de `src/app/router/modules.js`: el layout se encarga de
   la cabecera, las pestañas y el dock; no los dupliques dentro de cada página.
3. Usa variables CSS de `src/shared/styles/index.css` y componentes compartidos para
   que la página funcione en ambos temas y en pantallas pequeñas. Si un patrón nuevo se
   comparte entre varios módulos, proponlo en `src/shared` mediante PR.
4. M13 y M15 usan `src/api/adminClient.js` para las peticiones y sus propias muestras
   en `api/demoData.js`. Las muestras aparecen solo cuando
   `VITE_ADMIN_API_ENABLED=false`; los botones de revocar, aplicar migraciones, respaldar,
   descargar y purgar requieren API. Antes de activar el flag implementa y asegura los
   endpoints descritos en [contratos de administración](admin-api.md).
5. Ejecuta `pnpm build`, comprueba navegación y tamaños de escritorio/móvil y abre PR
   hacia `main`.

## Rutas iniciales

| Perfil Lite | Administración |
| --- | --- |
| `/lite/amigos` | `/admin/host` |
| `/lite/botin/cofre` | `/admin/host/clientes` |
| `/lite/diario/graficas` | `/admin/economia/curva` |
| `/lite/animo/stickers` | `/admin/economia/catalogo` |
| `/lite/progreso/racha` | `/admin/datos/respaldos` |
| `/lite/retos/metricas` | `/admin/datos/purga` |

El prefijo `/lite` o `/admin` define el layout. Antes de habilitar uso real, integrar
autenticación y control de roles en las rutas de administración. El modo claro/oscuro es
solo una preferencia de interfaz, no una configuración de perfil persistida en servidor.
