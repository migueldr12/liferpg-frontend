# Estado visual M07–M15 vs mockup

Fecha de verificación: 2026-11-23 · Referencia: `D:\Decimo\Proyecto\Life-RPG Modulos M07-M15.html`

## Método

- El mockup es un bundle que se desempaqueta con JS; se renderizó en Chromium headless (Playwright) y se
  recortó el área de contenido de cada uno de los 27 artboards (ventana 1180×760 → contenido **1176×714**).
- Se capturó cada ruta del PWA (`pnpm build` + `pnpm preview`) con viewport 1176×714, modo oscuro, reloj
  congelado en **2026-10-08 14:32** (fecha implícita del mockup: "Mié 7 · ayer", "1 sep – 8 oct").
- Se compararon las imágenes lado a lado y se hizo un diff de texto por pantalla (innerText del artboard vs. la página).
- Aviso: la auditoría previa (`tests/visual-audit.mjs`, "54 vistas, 0 fallos") **solo verifica HTTP, errores
  de consola y overflow horizontal**. No mide fidelidad visual.

## Veredicto

**Ninguna de las 27 pantallas es estrictamente igual al mockup.** El contenido y la estructura general
están implementados en todas; las diferencias van de menores (tipografía/espaciado/textos) a mayores
(layout distinto, elementos faltantes o sobrantes, contenido bajo el dock).

`docH` = alto real de la página a 1176 px de ancho. El mockup cabe en **714 px**; si `docH > 714`, hay
contenido escondido detrás del dock o que requiere scroll.

## Diferencias transversales (afectan a todas o casi todas)

1. ~~**Avatar de cabecera**~~ — **resuelto** (ver `docs/assets.md`): sprite "Morado dragón" con boina.
2. ~~**Avatares de amigos/mascotas**~~ — **resuelto**: dragón pixel-art del mockup con el color,
   accesorio y estado de cada amigo (M07, M08, M10, M11, M12).
3. **Botón de tema (sol)** extra a la derecha de las pestañas; no existe en el mockup.
4. **Dock inferior** — *ambiguo*: el componente del mockup sí define el ítem activo como recuadro
   verde elevado, pero las pantallas del mockup lo muestran plano. En admin el dock está desplazado
   a la derecha (mockup: centrado bajo el contenido).
5. ~~**Iconografía**~~ — **resuelto en M08, M09 y M14**: iconos de línea del mockup en recuadro de color
   (`CatalogIcon`). Quedan letras "C/F/E" en M12.
6. ~~**Escenas de mascota**~~ — **resuelto**: bosque pixel-art en 02, 15 y 18.
7. **Densidad vertical**: cabecera ~10 px más alta, más padding en tarjetas → 22 de 27 pantallas exceden 714 px.
8. **Admin (M13/M15)**: banner extra "Vista de demostración…" (~40 px) y las cifras/IP/tablas no usan la fuente
   monoespaciada del mockup.

## Estado por pantalla

| # | Pantalla | Ruta PWA | docH | Estado | Diferencias principales |
|---|----------|----------|------|--------|-------------------------|
| 01 | 7.1 Lista de amigos | `/lite/amigos` | 745 | Mayor | Tarjeta distinta: mockup muestra badge `LV21` amarillo, racha en recuadro naranja con 🔥, stats CUL/FÍS/ENF en una fila con barras; PWA usa "LV 21" plano, "34 días" en texto, 3 filas CULTURA/FISICO(sin tilde)/ENFOQUE y botón texto "Eliminar" en vez de icono. Buscador sin icono de lupa; "ORDENAR:" con dos puntos; contador "6 / 30 amigos" sin caja. |
| 02 | 7.2 Perfil espejo | `/lite/amigos/perfil` | 714 | Mayor | Layout completo distinto (mockup: mascota grande con escena a la izquierda + nombre/XP abajo; stats con iconos y barras segmentadas; racha con icono; 3 cajas de datos privados). Título "Perfil espejo" (debe ser "Diego · perfil espejo"), subtítulo distinto. **Bug: "Solo Miguel puede ver…"** (debe ser Diego). Botones sin iconos. |
| 03 | 7.3 Códigos | `/lite/amigos/codigos` | 806 | Mayor | Mis códigos: mockup es lista de tarjetas con código monoespaciado y pips de usos; PWA es tabla con columna ACCIÓN. Código nuevo sin fondo morado punteado. "Expira en" y "Usos máximos" en línea compacta en el mockup; PWA los apila en botones grandes. Subtítulo: "Invita sin compartir tu correo ni tu teléfono". Canjear queda bajo el dock. |
| 04 | 8.1 Cofre | `/lite/botin/cofre` | 750 | Menor | Grid 3×3 con alto distinto (tarjetas más bajas), iconos emoji, avatares PNG, botón enviar sin icono ✈. |
| 05 | 8.2 Solicitudes | `/lite/botin/solicitudes` | 850 | Menor/Mayor | Tarjetas más altas ("hace 20 min" partido en dos líneas); "Mis pedidos" tiene una fila extra (Bufanda roja · Bruno · Rechazada) que no está en el mockup y queda bajo el dock; pestaña extra "Mateo" en Pedir un objeto; checkboxes del cofre del amigo sustituidos por chips de rareza. |
| 06 | 8.3 Historial | `/lite/botin/historial` | 776 | Menor | Rango de fechas: mockup muestra botón "📅 1 sep – 8 oct"; PWA muestra segmentado 7 días/30 días/Todo. Filtro extra "Mateo". Última fila bajo el dock. |
| 07 | 9.1 Actividades | `/lite/diario` | 780 | Menor | Orden de filas distinto (PWA empieza por "Leer 20 páginas"); falta chip "Últimos 7 días · 10 resultados" (PWA: segmentado de fechas); falta chevron ›; iconos. Última fila bajo el dock. |
| 08 | 9.2 Detalle | `/lite/diario/a-5` | 783 | Mayor | Título de cabecera "Detalle"/"Notas de seguimiento…" (mockup: "Repasar álgebra"/"Misión de enfoque · completada ayer 17:40"). Bloque extra "← Actividades / Repasar álgebra / Ver gráficas" que empuja todo abajo. Botón "+ Agregar" punteado (mockup: verde sólido). Textos del recorrido: "Completada y verificada", fechas "Lun 5 · 18:50", "Mar 6", "Lun 5". Ruta `a-5` vs `repasar-algebra`. |
| 09 | 9.3 Gráficas | `/lite/diario/graficas` | 719 | Menor | Prácticamente igual; porcentaje Cultura 36% (mockup 35%); iconos; leyenda del gráfico más compacta. |
| 10 | 10.1 Avisos | `/lite/animo` | 724 | Menor | Etiqueta por amigo "PRIORIDAD ALTA/BAJA ACTIVIDAD/…" (mockup: "MÁNDALE UN STICKER"); "0 enviados" extra; nota de umbral sin icono ⓘ y en otra posición; avatares. |
| 11 | 10.2 Stickers | `/lite/animo/stickers` | 812 | Menor | Textos iguales. Stickers con dragones PNG de colores en lugar de sprites morados con accesorios; tarjetas más altas (Enviar queda casi bajo el dock). |
| 12 | 10.3 Historial ánimo | `/lite/animo/historial` | 740 | Menor | Textos iguales; avatares PNG; contador "Enviados 6" en rojo (mockup: chip gris). |
| 13 | 11.1 Pendientes | `/lite/progreso` | 753 | Menor | "4.ª vez" vs "4ª vez"; tarjetas de días y filas más altas; "Se repiten esta semana" en otra tipografía; panel derecho no estirado a toda la altura. |
| 14 | 11.2 Días rojos | `/lite/progreso/inactividad` | 846 | Mayor | **Datos del calendario distintos** (p. ej. día 8: 60% vs 80%, día 9 63% vs 89%…), día 26/27 y notas extra ("Gripa"). Subtítulo sin "· septiembre". Etiqueta "días bajo 50 %" vs "días bajo 50 %" en otra fuente; lista lateral desborda bajo el dock. |
| 15 | 11.3 Racha | `/lite/progreso/racha` | 753 | Menor | Mascota sin escena de bosque (recuadro plano); badge "Activa" y tipografía más pequeños. (El mockup renderiza vacío el panel "Últimos 21 días" — defecto del mockup, no del PWA.) |
| 16 | 12.1 Retos | `/lite/retos` | 728 | Menor | Invitación sin "antes del 31 oct"; "cierra el 3 nov" vs "30 nov"; iconos de reto con letra "E/F/C" en vez de icono; "38 / 50 sesiones" vs "38 / 50"; botón "Cofre raro" sin icono. |
| 17 | 12.2 Métricas | `/lite/retos/metricas` | 714 | Menor | Subtítulo sin "de 6 amigos"; ejes 50%/0% vs 50%; iconos "C/F/E"; gráfico más bajo (deja hueco inferior). |
| 18 | 12.3 Por área | `/lite/retos/por-area` | 772 | Menor | Valores "92/100" (mockup "+92"); "+92 pts" falta en el referente; escena de bosque falta; última fila bajo el dock. |
| 19 | 13.1 Monitor host | `/admin/host` | 817 | Mayor | Despliegue: mockup son cajas etiquetadas (DIRECCIÓN IP PÚBLICA 20.112.58.141, URL BASE https://api.liferpg.app/api, REGIÓN South Central US); PWA filas clave/valor con otros datos (api.life-rpg.app, Central US). Faltan "200 OK · /api/health", "build 2026.10.14", "desde 11 oct 00:00", "Actualiza en 5 s". Banner demo extra. Pie de latencia bajo el dock. |
| 20 | 13.2 Clientes | `/admin/host/clientes` | 899 | Menor/Mayor | Falta indicador "● En vivo · SignalR"; chips de conteo distintos; IPs sin monoespaciada; fila anómala sin borde amarillo; 2 filas bajo el dock. |
| 21 | 13.3 Consola REST | `/admin/host/consola` | 823 | Mayor | Filtros de método: mockup son botones grandes de color sólido (GET azul, POST verde, PUT amarillo, DELETE rojo) sin PATCH; PWA chips pequeños con PATCH extra. Contador "24/60 eventos" y "Mostrando 11 de 24…" extra. Buscador sin lupa; Pausar sin icono ⏸. Faltan filas 14:31:52/14:31:50 del mockup. |
| 22 | 14.1 Curva XP | `/admin/economia/curva` | 756 | Menor | Muy cercano. Fórmula con espacios ("XP(n) = 100 × n^1.60" vs "XP(n) =100× n^1.60"); tarjetas de nivel con números partidos en dos líneas ("23,088 / XP"). |
| 23 | 14.2 Catálogo | `/admin/economia/catalogo` | 780 | Menor | Título "Catálogo global" (debe ser "Catálogo"); subtítulo sin "(M04)… (M08)… (M10)"; botón extra "+ Artículo"; precios distintos (Lentes 90 vs 120, Doble XP 350 vs 200, Escudo 300); tarjetas más bajas; iconos emoji. |
| 24 | 14.3 Push | `/admin/economia/push` | 714 | Menor | Fechas del historial e indicadores calculados dinámicamente (mockup: "mar 6 · 22:00", "Fallido 12 %"; PWA: "7 oct · 08:32", "Fallido 18 %", "Entregado 100 %"); "1,248" vs "1 248"; contador "18/50" extra; reloj del teléfono dinámico. |
| 25 | 15.1 Monitor SQL | `/admin/datos` | 919 | Mayor | Falta botón amarillo "Aplicar 2 migraciones"; terminal extra "$ dotnet ef migrations list"; subtítulo sin "· PostgreSQL + Entity Framework"; "SELECT 1 · hace 3 s" distinto; banner demo; contenido bajo el dock. |
| 26 | 15.2 Respaldos | `/admin/datos/respaldos` | 1313 | Mayor | **Layout en una columna** (mockup: formulario izq. + historial der.). Causa: `src/shared/styles/index.css:158` colapsa `.admin-columns--backup` con `max-width: 1180px`; además `.admin-table` tiene `min-width: 650px`. Fila "Todos (1 230 perfiles)" del mockup no aparece. |
| 27 | 15.3 Purga | `/admin/datos/purga` | 1061 | Mayor | **Layout en una columna** (misma causa, `.admin-columns--purge`). Faltan "Fecha de corte: 19 jul 2026" y "≈ 335 MB"; botón extra "Vista previa" y texto de ayuda extra; historial incompleto ("1 ago · 02:00 … −512,770"). |

Resumen: **Mayor 10** (01, 02, 03, 08, 14, 19, 21, 25, 26, 27) · **Menor 17** · **Igual 0**.

## Desviaciones intencionales (decisión del equipo, no necesariamente bugs)

- Banner "Vista de demostración" en M13/M15 (`VITE_ADMIN_API_ENABLED=false`).
- Purga en dos pasos "Vista previa" → `PURGAR` (seguridad), botón "+ Artículo" en catálogo.
- Enlace "← Actividades" y "Ver gráficas" en Detalle.
- Botón de tema claro/oscuro y reloj en vivo de Push.
- Rutas `/lite/amigos/perfil` y `/lite/diario/a-5` en vez de `/lite/amigos/diego.r` y `/lite/diario/repasar-algebra`.

Si el criterio es "estrictamente igual", todas deben retirarse u ocultarse en la vista por defecto.

## No verificado

- Modo claro y variantes de color de mascota (el mockup tiene selector "Mascota · Morado dragón" / "Modo oscuro").
- Móvil: este mockup es solo de escritorio (el móvil está en `Life-RPG · Mockups Movil.pdf`).

## Prioridad sugerida de corrección

1. Estructurales: 26/27 (breakpoint 1180 → ≤1024), 02, 01, 03, 19, 21, 25, 08.
2. Transversales: avatares pixel-art (cabecera + amigos), dock plano, retirar botón de tema, iconos de línea, escena de bosque, densidad vertical para caber en 714 px.
3. Textos y datos: subtítulos, "Miguel"→"Diego", calendario de Días rojos, precios del catálogo, fechas fijas.
