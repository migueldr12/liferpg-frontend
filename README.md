# Life-RPG · Frontend

Cliente PWA en React con Vite, organizado **por módulos** igual que `liferpg-backend`.
La base compartida incluye navegación y estilos para Perfil Lite y Administración.
M13 (Host) y M15 (Datos) tienen sus tres pantallas y controles de interfaz. Mientras el
backend no implemente los endpoints, muestran datos de demostración identificados como tales;
las acciones que cambiarían datos del servidor permanecen deshabilitadas.

Inicio rápido: `pnpm install --frozen-lockfile` y `pnpm dev`. Abre `/admin/host` o `/admin/datos`.
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

## Configuración

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
pnpm build
```

Para conectar el backend, crea tu archivo `.env` a partir de `.env.example` y ajusta
`VITE_API_URL` para tu entorno. No subas `.env` al repositorio.

### Conectar un módulo al backend real

Cada módulo decide si usa la API o sus datos simulados con `VITE_API_MODULES` (separados por
coma). Ya conectados: `economia` (M14) y `retos` (M12). Ejemplo:

```bash
VITE_API_URL=http://localhost:3000/api/v1
VITE_API_MODULES=economia,retos
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
