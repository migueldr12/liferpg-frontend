# Life-RPG · Frontend

Cliente PWA en React con Vite, organizado **por módulos** igual que `liferpg-backend`.
La base compartida incluye navegación y estilos para Perfil Lite y Administración.
Los monitores de M13 (Host) y M15 (Datos) consultan el estado real de la API y MongoDB.
M13 lista dispositivos registrados y los últimos eventos del proceso; los dispositivos no
representan conexiones en vivo y el registro no sobrevive a reinicios. La purga sigue siendo demo.
M15 permite descargar una exportación JSON de hasta 20 perfiles; el respaldo restaurable
de la base completa todavía requiere configurar las herramientas y el almacenamiento del servidor.

Inicio rápido: `pnpm install --frozen-lockfile` y `pnpm dev`. Abre `/admin/host` o `/admin/datos`.
Para usar la base de demostración local, sigue `../liferpg-backend/docs/demo.md` y ejecuta `npm run dev:demo`.

Para verificar el diseño en Chrome instalado, ejecuta `node tests/visual-audit.mjs` con `AUDIT_BASE_URL` apuntando al servidor local. Usa `AUDIT_AREA=lite` con la demo del jugador y `AUDIT_AREA=admin` tras iniciar `npm run dev:demo -- --admin`. `AUDIT_AREA=auth` revisa las pantallas públicas de acceso cuando Firebase está configurado y no hay sesión. Las capturas se guardan en `tests/__screenshots__/`.
Consulta [la guía de layouts](docs/layout-pwa.md) antes de implementar un módulo.

## Carpetas de cada módulo

Flujo: `pages → hooks → api → backend`.

| Carpeta | Contenido |
|---|---|
| `api` | Funciones que hacen las peticiones a los endpoints del módulo (`/api/v1/<modulo>`) |
| `hooks` | Hooks que llaman a `api` y manejan estados de carga, error y datos |
| `pages` | Pantallas del módulo (una por RF) |
| `components` | Componentes visuales propios del módulo |

## Carpetas compartidas

- `public/icons`: íconos del manifest de la PWA
- `src/api`: cliente HTTP base (URL del backend, token JWT, manejo de errores) que usan todos los módulos
- `src/config`: variables de entorno y URL del servidor (nube o LAN)
- `src/app`: `router` (rutas y menú de los módulos), `providers` (futura sesión), `layouts`
- `src/assets`: `images`, `sprites` (animaciones del Tamagotchi), `icons`, `fonts`
- `src/shared`: `components`, `hooks`, `utils`, `styles` reutilizables entre módulos

## Módulos

| Carpeta | Módulo | Responsable | Sprint |
|---|---|---|---|
| `m00-usuarios-autenticacion` | Usuarios, autenticación y dispositivo | Equipo | 1 |
| `m01-tamagotchi-perfil` | Tamagotchi y perfil de usuario | Dev 1 | 1 |
| `m02-habitos` | Hábitos diarios (quests) | Dev 1 | 2 |
| `m03-misiones-enfoque` | Misiones únicas y enfoque | Dev 1 | 3 |
| `m04-tienda` | Tienda de la mascota | Dev 2 | 1 |
| `m05-logros-progresion` | Logros y progresión | Dev 2 | 2 |
| `m06-vitalidad` | Vitalidad y estado de la mascota | Dev 2 | 3 |
| `m07-visualizador-usuarios` | Visualizador de usuarios | Dev 3 | 1 |
| `m08-botin` | Botín (regalos entre amigos) | Dev 3 | 2 |
| `m09-diario-aventura` | Diario de aventura | Dev 3 | 3 |
| `m10-notificaciones` | Notificaciones de acompañamiento | Dev 4 | 1 |
| `m11-resumen-progreso` | Resumen de progreso y pendientes | Dev 4 | 2 |
| `m12-retos-grupo` | Retos y métricas de grupo | Dev 4 | 3 |
| `m13-sincronizacion-red` | Sincronización local y red | Dev 5 | 1 |
| `m14-economia-global` | Balanceo de economía global | Dev 5 | 2 |
| `m15-gestion-bd` | Gestión de base de datos | Dev 5 | 3 |
| `m16-landing` | Landing y tutorial de la app (móvil y web), ruta `/` | Equipo | 3 |

## Configuración

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
pnpm build
```

Para conectar el backend, crea tu archivo `.env` a partir de `.env.example` y ajusta
`VITE_API_URL` para tu entorno. No subas `.env` al repositorio.

## Assets de cada usuario

- Los dibujos se definen en `src/shared/assets/registry.js`. `pnpm assets` genera los SVG en `public/catalog/**` y su `manifest.json`; `pnpm build` también los genera en `prebuild`. El backend usa ese manifiesto para poblar el catálogo común, pero **el seed no asigna artículos a los usuarios**.
- Cada usuario obtiene sus propios artículos por compra, regalo o desbloqueo: el backend los relaciona con su `userId` en `inventory_entries` y guarda los looks equipados en `outfits`. El frontend debe usar el inventario/vestidor del usuario autenticado (o `VITE_DEV_USER_ID` en desarrollo), no asumir que todos los artículos del catálogo le pertenecen.
- La API devuelve la clave `icon` de cada artículo (por ejemplo, `item.boina-pintor`). `CatalogIcon` la resuelve con el registro para mostrar objetos y stickers; `PixelMascot` recibe `color={profile.mascotColor}` y `equipped` con las **claves** de los artículos equipados para dibujar accesorios y fondo. Si el vestidor devuelve `catalogItemId`, hay que relacionarlo con los artículos del inventario para obtener esas claves.
- Las URLs de `icon_assets` como `/catalog/items/pocion-hp.svg` apuntan a la raíz pública de la PWA, no a `VITE_API_URL`.

Más detalles sobre claves, archivos y generación en [docs/assets.md](docs/assets.md).

### Conectar un módulo al backend real

Cada módulo decide si usa la API o sus datos simulados con `VITE_API_MODULES` (separados por
coma). Los módulos `visualizador`, `botin`, `diario`, `retos` y `economia` usan la API por defecto; para una demostración se puede seleccionar un subconjunto. M10 y M11 consultan siempre la API. Ejemplo:

```bash
VITE_API_URL=http://localhost:3000/api/v1
VITE_API_MODULES=todos
VITE_DEV_USER_ID=<_id de MongoDB>   # mientras no exista el login (M00)
```

- `src/config/env.js` expone `usaApi('modulo')`; el `api/*.js` del módulo llama a `http()` si está
  activo y si no usa sus datos simulados, con la misma forma de respuesta.
- `src/api/httpClient.js` manda `x-user-id` con `VITE_DEV_USER_ID` cuando no hay token y muestra el
  mensaje `error` que responde el backend.
- Economía (M14) es solo para administradores: en el backend, `pnpm db:admin-prueba` imprime un `_id`
  de ADMIN. Retos (M12) funciona con cualquier jugador que tenga amigos.

**Alcance acordado para esta PWA:** M10 (notificaciones de acompañamiento), M11 (resumen
de progreso) y M12 (retos de grupo) siguen los mockups PWA y esta tabla. El documento
«Tareas Life prg» presenta otro alcance para esos números y requiere alineación aparte.
