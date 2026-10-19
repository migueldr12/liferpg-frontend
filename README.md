# Life-RPG · Frontend

Cliente en React con Vite, organizado **por módulos** igual que `liferpg-backend`.
El frontend es **solo UI**: no tiene reglas de negocio ni datos propios; todo lo obtiene y lo
guarda mediante peticiones a la API REST del backend.
Por ahora solo hay estructura (carpetas con `.gitkeep`), sin lógica.

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
- `src/app`: `router` (rutas de todos los módulos), `providers` (sesión, tema), `layouts`
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
npm install -g pnpm
cp .env.example .env
pnpm install
pnpm dev
```
