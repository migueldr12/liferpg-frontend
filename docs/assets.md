# Assets de Life-RPG (mascotas, objetos, stickers, iconos)

Todos los dibujos salen de **un solo registro** y del **generador del dragón del mockup**. Así,
la PWA, el build y MongoDB usan las mismas claves.

| Pieza | Ruta | Rol |
|---|---|---|
| Generador del sprite | `src/shared/pixel/dragon.js` | Port del componente "Mascota dragón" de `Life-RPG Modulos M07-M15.html`. Verificado contra los 82 sprites del mockup: **82/82 idénticos**. |
| Registro | `src/shared/assets/registry.js` | Claves permanentes, nombres, colores, tonos, slots, precios y origen (`mockup` / `nuevo`). |
| Componentes | `src/shared/components/PixelMascot.jsx`, `CatalogIcon.jsx` | Dibujan en línea (respetan tema y paleta). |
| Party demo | `src/shared/assets/demoParty.js` | Color/accesorio/estado de cada amigo del mockup. Solo para pantallas con datos simulados. |
| Generación | `scripts/generate-assets.mjs` (`pnpm assets`, corre en `prebuild`) | Emite `public/catalog/**` (SVG con colores horneados) y `public/catalog/manifest.json`. |
| Seed | `liferpg-backend/scripts/seed-assets.js` (`pnpm seed:assets`) | Lee el manifiesto y hace upsert en `icon_assets`, `catalog_categories`, `catalog_items`. |

## Contrato con el backend

- `catalog_items.icon` = **clave del asset** (p. ej. `item.pocion-hp`, `sticker.animo.tu-puedes`).
  `catalog_items.iconAssetId` → `icon_assets` (`key` único, `url` relativa, `mimeType`).
- Ids de `catalog_items`: `sha1('catalog:' + key)` (24 hex). Son iguales en todos los entornos.
- Las URLs (`/catalog/items/pocion-hp.svg`) son relativas a la raíz pública del cliente; la PWA
  las sirve desde `dist/catalog`. Sin hash de Vite: la URL no cambia entre builds.
- **Qué tiene cada usuario lo decide el backend** (inventario, vestidor, cofres, desbloqueos).
  La PWA solo traduce claves a dibujos: `<PixelMascot color={profile.mascotColor} equipped={[...claves]} />`.
- Datos viejos con emoji en `icon` siguen mostrándose (`resolveIcon` tiene alias y, si no
  encuentra la clave, muestra el texto tal cual).

## Inventario generado (74 claves, 69 archivos)

- **Mascotas (8):** `mascot.dragon.{morado,rubi,escarcha,esmeralda,lavanda,brasa,ambar}` + `mascot.dragon.debilitado`.
- **Objetos (17 iconos + 11 vistas previas `outfit.*`):** ropa (boina, lentes, bufanda, libro),
  exclusivos (corona, capa de erudito, tenis alados, casco zen, capa de viento, marco dorado),
  fondo bosque y consumibles/regalables (poción, doble XP, escudo, pergamino, semilla, carta).
- **Stickers (18):** Ánimo, Celebrar y Descanso, 6 cada uno, con el estado y el accesorio del mockup.
- **Categorías (10) y áreas (3):** iconos de línea del mockup.
- **Escenas (2):** bosque (mockup) y marco dorado.
- **Legado (5):** PNG de especies de la app móvil (`/icons/*.png`), sin archivo nuevo.

### Diseños nuevos (no están en el mockup)

Píxeles de **bufanda, corona, capa de erudito, tenis alados, casco zen, capa de viento y marco
dorado**. Los nombres de color Esmeralda/Lavanda/Brasa/Ámbar también son nuevos (los colores sí
vienen del mockup), igual que el objeto "Libro de aventuras" (el accesorio sí está en el mockup).
Están marcados con `source: 'nuevo'` o `note` en el registro para revisión de diseño.

## Agregar un asset

1. Añade la entrada al registro con una clave nueva (nunca renombres una existente).
2. Si es un accesorio, dibújalo en `dragon.js` con `put/span/sym` y agrégalo a `NEW_ACCESSORIES`.
3. `pnpm assets` → revisa `public/catalog`.
4. En el backend: `pnpm seed:assets --dry-run` y luego `pnpm seed:assets`.

## Convivencia con otros seeds

- `seed:m10` y `seed:assets` pueden correr en cualquier orden: ambos buscan las categorías por
  `(name, type)`. Los 6 stickers emoji de `seed-m10` y sus categorías "Celebración" y "Cariño"
  siguen existiendo junto a los 18 nuevos (Postman depende de sus ids; no se tocan).
- El seed lee el manifiesto desde `../liferpg-frontend/public/catalog/manifest.json`: hay que haber
  corrido `pnpm assets` en el frontend o pasar `--manifest <ruta>`. Como la salida es determinista,
  se puede versionar `public/catalog` o copiar el manifiesto al backend.

## Impacto en la app móvil (pendiente de decidir)

La app móvil dibuja `catalog_items.icon` con `PixelIcon` por nombre (`clothes`, `star`, …). Tras
el seed, `icon` vale una clave como `item.boina-pintor` y `PixelIcon` la mostraría vacía. Opciones:
que los mappers del backend (M01 vestidor, M10) devuelvan además `iconUrl` desde `iconAsset`, o que
la app móvil traduzca la clave (con `react-native-svg` o PNG generados del mismo registro).

## Limitaciones conocidas

- `SlotType` solo tiene HEAD/FACE/BODY/BACKGROUND: bufanda, libro, capas y tenis comparten BODY.
- Un objeto tiene un solo `group`: Poción, Escudo y Doble XP quedan en `tienda` aunque también son
  regalables (`giftable: true`).
- La app móvil (React Native) necesita PNG o `react-native-svg`; los SVG ya llevan colores horneados.
