# Contexto M07–M15 · Life-RPG frontend

Archivo de revisión para retomar el trabajo sin rehacer el análisis previo.

## Objetivo

Ajustar las pantallas M07–M15 del PWA para coincidir estrictamente con `D:\Decimo\Proyecto\Life-RPG Modulos M07-M15.html` (mockup/estilo/flujo), sin reestructurar la arquitectura compartida (header, dock, estilos base).

## Estado del repositorio

| Dato | Valor |
|------|--------|
| Proyecto | `D:\Decimo\Proyecto\liferpg-frontend` |
| Rama | `main` |
| Commit base | `7055fdf` (Merge PR #13 unificar estilos PWA) |
| Builds | `pnpm build` debe pasar |
| Auditoría | `node tests/visual-audit.mjs` (requiere `pnpm preview` en :4173) |

## Qué está hecho

- Ajustes M07–M15 sobre 56+ archivos (lista en `git status`).
- M07: 6 amigos, filtros, orden, eliminar, perfil espejo, códigos DRG.
- M08: cofre/solicitudes/historial, estados agotados, tabla móvil.
- M09: listado, detalle y gráficas.
- M10: página nueva `AnimoAvisosPage`, 18 stickers (3×6), historial individual/global.
- M11: 7 días, retomar, umbrales de racha (activa/en riesgo/rota).
- M12: creación de retos, métricas semana/mes, ranking por área.
- M13: N/LAN, clientes, consola REST, revocación.
- M14: curvas v7/v8, catálogo, push.
- M15: monitor SQL, respaldos, purga con vista previa + `PURGAR`.
- Auditoría Playwright de 27 rutas × 2 viewports (54 vistas).
- Assets de mascotas copiados desde `Life-RPG-mobile/assets/images` a `public/icons/`.

## Assets de mascotas

Archivos en `public/icons/`: `dragon.png`, `gato.png`, `perro.png`, `hamster.png`, `leon.png` (+ `dragon.svg` solo para favicon/manifest).

Asignación por persona (mock):

| Persona | Mascota |
|---------|---------|
| Valeria (yo) | dragon |
| Diego | dragon (Chispa) |
| Ana | gato |
| Lucía | leon |
| Bruno | leon |
| Mateo | hamster |
| Camila | perro |

Usos actualizados: M07 `AmigoCard`/`PerfilEspejo`, M08 `Avatar`, M10 `PixelAvatar`+avisos/stickers, M11 pendientes/racha, M12 `Avatar`, `AppLayout` chip de perfil.

## Correcciones M15 aplicadas

1. **Purga demo**: al ejecutar, `purgeDemo.categories[*].counts[days]` queda en `0` (antes solo se reducían tablas del monitor y el historial).
2. **Cifras de perfiles**: respaldo reciente `Todos (1 248 perfiles)` alineado con `Usuarios = 1248`; respaldo histórico conserva `1 241`/`1 241` como fecha anterior (id `4` usa `1 241`).
3. **`notifications` en purga**: no tiene tabla en el monitor (`LogsPeticiones`/`Auditoria`); solo descuenta del total de purga y del historial. Documentado a propósito.

### Nota de cifras M15

- Monitor `Auditoria = 41 270` = total de la tabla.
- Purga 90d `Auditoría = 24 800` = subconjunto “más de 90 días”.
- No deben ser iguales; el mockup no fija estos números de forma textual verificable (HTML empaquetado).

## Archivos clave

| Ruta | Rol |
|------|-----|
| `src/modules/m07…m15…/` | Implementación por módulo |
| `src/shared/styles/index.css` | Estilos admin compartidos (tablas cards, purge, backup) |
| `src/app/router/AppRouter.jsx` | Montaje de rutas M10 Avisos, M15 |
| `src/app/router/modules.js` | Metadatos de navegación |
| `tests/visual-audit.mjs` | Auditoría visual (portable) |
| `tests/interactions.mjs` | Smoke de interacciones críticas |
| `docs/contexto-m07-m15.md` | Este archivo |

## Comandos de verificación

```bash
pnpm build
pnpm preview   # terminal 1, sirve en http://127.0.0.1:4173
node tests/visual-audit.mjs          # terminal 2 → tests/__screenshots__/
node tests/interactions.mjs          # smoke de flujos críticos
```

Variables opcionales de la auditoría:

- `AUDIT_OUT` → directorio de capturas (default `tests/__screenshots__`).
- `AUDIT_BASE_URL` → base (default `http://127.0.0.1:4173`).

## Pendientes conocidos

- [x] Portabilizar ruta absoluta de `visual-audit.mjs`.
- [x] Copiar y usar assets de mascotas.
- [x] Corregir contadores de purga demo y cifras de perfiles.
- [x] Smoke de interacciones (`tests/interactions.mjs`) — 8/8 OK.
- [x] Auditoría visual final — 54 vistas, 0 fallos.
- [x] `.gitignore` incluye `tests/__screenshots__/`.
- [ ] `TODO: API` en M10/M11 `useLite.js` (stickers/historial mock) — fuera de alcance M07–M15 visual.
- [ ] Decidir commit (no se commitea sin petición explícita).

## Resultados de verificación (última corrida)

| Check | Resultado |
|-------|-----------|
| `pnpm build` | OK · 111 módulos |
| Assets PNG en :4173 | 200 (dragon, gato, perro, hamster, leon) |
| `node tests/interactions.mjs` | 8/8 passed |
| `node tests/visual-audit.mjs` | `{ checked: 54, failures: [] }` |
| `git diff --check` | sin conflictos (solo avisos LF/CRLF) |

Interacciones cubiertas: M07 filtros/eliminar · M08 responder · M10 avisos+stickers · M11 retomar+racha · M12 crear reto · M13 revocar · M14 push · M15 purga 180d.

## Decisiones abiertas

1. ¿Versionar capturas de auditoría o solo el script? (hoy ignoradas)
2. ¿Mantener `dragon.svg` en favicon/manifest o migrar a PNG? (svg intacto en `index.html`/`manifest`)
3. ¿Al backend le faltan endpoints admin M13/M15 (`adminApiEnabled`); el frontend funciona en demo.
