// Genera los assets estáticos del catálogo en `public/catalog/**` y su `manifest.json`.
//
//   pnpm assets          (también corre antes de `pnpm build`)
//
// Salida determinista (sin fechas ni hashes): mismas entradas → mismos archivos, para que las
// URLs guardadas en MongoDB (`icon_assets.url`) sigan siendo válidas entre builds.
// Los archivos llevan los colores horneados: `<img>` y react-native-svg no resuelven
// variables CSS. Los iconos de línea usan `currentColor` para heredar el color del recuadro.
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dragonSvg } from '../src/shared/pixel/dragon.js';
import {
  AREAS, CATEGORIES, GOLD, ICON_PATHS, ITEMS, LEGACY_PETS, MASCOT_COLORS, SCENES, STICKERS, TONES,
  DEFAULT_MASCOT_COLOR, fileFor,
} from '../src/shared/assets/registry.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'public');
const outDir = join(publicDir, 'catalog');

const files = new Map(); // url → contenido
const assets = []; // filas para icon_assets
const add = (entry) => {
  if (assets.some((a) => a.key === entry.key)) throw new Error(`Clave duplicada: ${entry.key}`);
  assets.push(entry);
};

const iconSvg = (name, label) => {
  const d = ICON_PATHS[name];
  if (!d) throw new Error(`Icono desconocido: ${name}`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="${label}"><title>${label}</title><path d="${d}"/></svg>\n`;
};

// Sticker: recuadro de 29×26 (proporción 116×104 del mockup) con la mascota apoyada abajo.
const stickerSvg = ({ name, mood, acc, bg }) => {
  const sprite = dragonSvg({ mood, acc, color: DEFAULT_MASCOT_COLOR, gold: GOLD })
    .replace('<svg xmlns="http://www.w3.org/2000/svg"', '<svg x="3.5" y="5" width="22" height="21"')
    .replace(/<title>.*?<\/title>/, '')
    .replace(/ role="img" aria-label="[^"]*"/, '')
    .trim();
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 26" shape-rendering="crispEdges" role="img" aria-label="${name}"><title>${name}</title><rect width="29" height="26" rx="4" fill="${bg}"/>${sprite}</svg>\n`;
};

// 1 · Mascotas base: una por color (contenta) + la versión debilitada (gris en todos los colores).
for (const color of MASCOT_COLORS) {
  const key = `mascot.dragon.${color.key.split('.')[1]}`;
  const url = fileFor(key);
  files.set(url, dragonSvg({ mood: 'happy', color: color.hex, gold: GOLD }, { title: `Mochi · ${color.name}` }));
  add({ key, kind: 'mascot', name: `Dragón ${color.name}`, url, mimeType: 'image/svg+xml', color: color.hex, source: color.source });
}
{
  const key = 'mascot.dragon.debilitado';
  const url = fileFor(key);
  files.set(url, dragonSvg({ mood: 'weak' }, { title: 'Mochi · debilitada' }));
  add({ key, kind: 'mascot', name: 'Dragón debilitado', url, mimeType: 'image/svg+xml', source: 'mockup' });
}

// 2 · Objetos: icono de línea (lo que muestran cofre, tienda y catálogo) + vista previa equipada.
for (const item of ITEMS) {
  const url = fileFor(item.key);
  files.set(url, iconSvg(item.icon, item.name));
  add({ key: item.key, kind: 'item-icon', name: item.name, url, mimeType: 'image/svg+xml', tone: item.tone, source: item.source });
  if (item.acc || item.scene) {
    const key = `outfit.${item.key.split('.')[1]}`;
    const previewUrl = fileFor(key);
    files.set(previewUrl, dragonSvg({ mood: 'happy', acc: item.acc, scene: item.scene, color: DEFAULT_MASCOT_COLOR, gold: GOLD }, { title: `Mochi con ${item.name}` }));
    add({ key, kind: 'outfit-preview', name: item.name, url: previewUrl, mimeType: 'image/svg+xml', item: item.key, source: item.source });
  }
}

// 3 · Stickers (18, tal cual el mockup).
for (const sticker of STICKERS) {
  const url = fileFor(sticker.key);
  files.set(url, stickerSvg(sticker));
  add({ key: sticker.key, kind: 'sticker', name: sticker.name, url, mimeType: 'image/svg+xml', source: sticker.source });
}

// 4 · Categorías y áreas (iconos de línea).
for (const entry of [...CATEGORIES, ...AREAS]) {
  const url = fileFor(entry.key);
  files.set(url, iconSvg(entry.icon, entry.name));
  add({ key: entry.key, kind: entry.key.startsWith('cat.') ? 'category-icon' : 'area-icon', name: entry.name, url, mimeType: 'image/svg+xml', tone: entry.tone, source: entry.source ?? 'mockup' });
}

// 5 · Escenas sin mascota.
for (const scene of SCENES) {
  const url = fileFor(scene.key);
  files.set(url, dragonSvg({ scene: scene.scene, bare: true }, { title: scene.name }));
  add({ key: scene.key, kind: 'scene', name: scene.name, url, mimeType: 'image/svg+xml', source: scene.source });
}

// 6 · Legado: PNG de especies de la app móvil (ya viven en public/icons).
for (const pet of LEGACY_PETS) add({ key: pet.key, kind: 'legacy-pet', name: pet.name, url: pet.url, mimeType: pet.mimeType, source: pet.source });

// Sección del catálogo de M14 (`catalog_items.group`): tienda · exclusivos · regalables · stickers.
const itemGroup = (item) => item.group ?? (item.unlock ? 'exclusivos' : item.price > 0 ? 'tienda' : item.giftable ? 'regalables' : 'tienda');

const manifest = {
  schema: 1,
  description: 'Assets de Life-RPG. Las claves son permanentes; las URLs son relativas a la raíz pública de cada cliente.',
  tones: Object.fromEntries(Object.entries(TONES).map(([k, v]) => [k, v.dark])),
  colors: MASCOT_COLORS,
  assets,
  categories: CATEGORIES.map(({ key, name, type }) => ({ key, name, type, iconKey: key })),
  items: ITEMS.map((item) => ({
    key: item.key, name: item.name, categoryKey: item.category, iconKey: item.key,
    previewKey: item.acc || item.scene ? `outfit.${item.key.split('.')[1]}` : null,
    slot: item.slot ?? null, pointType: item.pointType ?? null, minLevel: item.minLevel ?? null,
    price: item.price, giftable: item.giftable, rarity: item.rarity, unlock: item.unlock ?? null,
    unlimited: Boolean(item.unlimited), tags: item.tags, group: itemGroup(item),
  })),
  stickers: STICKERS.map((s) => ({ key: s.key, name: s.name, categoryKey: s.category, iconKey: s.key, mood: s.mood, acc: s.acc, group: 'stickers' })),
};

await rm(outDir, { recursive: true, force: true });
for (const [url, content] of files) {
  const path = join(publicDir, url);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content, 'utf8');
}
await writeFile(join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log(`Assets: ${files.size} archivos · ${assets.length} claves → ${outDir}`);
