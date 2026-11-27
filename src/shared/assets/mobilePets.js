// Mascotas y vestidor de la app móvil (D:\LifeRPG), con los MISMOS archivos.
//
// Espejo de `src/constants/petTypes.ts` y `src/constants/itemAssets.ts` de la app móvil. Los PNG
// viven en `public/mobile/**` (copiados de `assets/images` y `assets/vestidor`). Si la app móvil
// agrega una especie o prenda, se copia el PNG y se añade su línea aquí (mismos nombres y medidas).
export const MOBILE_BASE = '/mobile';

// Especies que el jugador elige en "Bienvenido a Life-RPG" (PetSpecies).
export const PET_SPECIES = [
  { key: 'gato', label: 'Gato' },
  { key: 'perro', label: 'Perro' },
  { key: 'dragon', label: 'Dragón' },
  { key: 'hamster', label: 'Hámster' },
  { key: 'leon', label: 'León' },
];
// La app móvil usa gato; la PWA y su mockup arrancaban con el dragón, se conserva para datos sin especie.
export const DEFAULT_SPECIES = 'dragon';

const SPECIES_ALIASES = { 'dragón': 'dragon', 'hámster': 'hamster', 'león': 'leon', cat: 'gato', dog: 'perro', lion: 'leon' };
export const normalizeSpecies = (value) => {
  const key = String(value ?? '').trim().toLowerCase();
  const alias = SPECIES_ALIASES[key] ?? key;
  return PET_SPECIES.some((p) => p.key === alias) ? alias : DEFAULT_SPECIES;
};
export const speciesLabel = (value) => PET_SPECIES.find((p) => p.key === normalizeSpecies(value)).label;
export const petImageSrc = (species) => {
  const key = normalizeSpecies(species);
  const base = `${MOBILE_BASE}/mascotas/${key}`;
  return { src: `${base}.png`, srcSet: `${base}.png 1x, ${base}@2x.png 2x, ${base}@3x.png 3x` };
};

// Colores de la mascota (RDF026): aura y hábitat.
export const PET_COLORS = [
  { key: 'verde', label: 'Verde', value: '#4CAF50' },
  { key: 'morado', label: 'Morado', value: '#9C27B0' },
  { key: 'rojo', label: 'Rojo', value: '#E5533D' },
  { key: 'azul', label: 'Azul', value: '#2F80ED' },
  { key: 'naranja', label: 'Naranja', value: '#F2994A' },
];
/** Acepta la clave de la app móvil ("morado") o un hex ("#9C27B0"). */
export const petColorValue = (color) => {
  if (!color) return null;
  if (String(color).startsWith('#')) return color;
  return PET_COLORS.find((c) => c.key === String(color).toLowerCase())?.value ?? null;
};

// Prendas: ancho y distancia desde arriba como fracción del tamaño de la mascota; `aspect` = ancho/alto.
const A = (file, category, width, top, aspect) => ({ url: `${MOBILE_BASE}/vestidor/accesorios/${file}.png`, category, width, top, aspect });
export const ITEM_ASSETS = {
  'boina-lector': A('boina-lector', 'Cabeza', 0.56, 0.03, 32 / 16),
  'gorro-lana': A('gorro-lana', 'Cabeza', 0.56, -0.02, 32 / 22),
  'banda-deportiva': A('banda-deportiva', 'Cabeza', 0.56, 0.13, 32 / 10),
  'gorra-corredor': A('gorra-corredor', 'Cabeza', 0.6, 0, 32 / 18),
  'capucha-monje': A('capucha-monje', 'Cabeza', 0.78, -0.04, 36 / 30),
  'corona-sabio': A('corona-sabio', 'Cabeza', 0.5, -0.03, 32 / 18),
  'lentes-sol': A('lentes-sol', 'Cara', 0.46, 0.34, 32 / 12),
  'lentes-redondos': A('lentes-redondos', 'Cara', 0.46, 0.33, 32 / 14),
  'bufanda-roja': A('bufanda-roja', 'Cuerpo', 0.42, 0.58, 32 / 18),
  sudadera: A('sudadera', 'Cuerpo', 0.46, 0.6, 32 / 22),
  'fondo-casa': { url: `${MOBILE_BASE}/vestidor/fondos/fondo-casa.png`, category: 'Fondo' },
  'fondo-bosque-mistico': { url: `${MOBILE_BASE}/vestidor/fondos/fondo-bosque-mistico.png`, category: 'Fondo' },
};
export const DEFAULT_BACKGROUND = 'fondo-casa';
// Orden de apilado: cuerpo abajo, cabeza arriba.
export const LAYER_ORDER = { Fondo: -1, Cuerpo: 0, Cara: 1, Cabeza: 2 };

// Accesorios del mockup (`acc`) → prenda equivalente de la app móvil.
// `book` y los diseños sin equivalente móvil (capas, tenis) no se dibujan: aparecen solo en el nombre.
export const ACC_TO_ASSET = {
  beret: 'boina-lector',
  glasses: 'lentes-redondos',
  scarf: 'bufanda-roja',
  crown: 'corona-sabio',
  'zen-helmet': 'capucha-monje',
};
export const SCENE_TO_ASSET = { forest: 'fondo-bosque-mistico' };

// Claves/nombres que puede mandar el backend → nombre de asset. Ver `registry.js` (item.*) y
// los nombres de la app móvil ("Lentes de lector", "boina-lector", "item.boina-pintor").
const slug = (text) => String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const ITEM_ALIASES = {
  'boina-pintor': 'boina-lector',
  'lentes-lector': 'lentes-redondos',
  'lentes-de-lector': 'lentes-redondos',
  'corona-100-dias': 'corona-sabio',
  'casco-zen': 'capucha-monje',
  'fondo-bosque': 'fondo-bosque-mistico',
  bosque: 'fondo-bosque-mistico',
};
export function resolveAssetName(value) {
  if (!value) return null;
  const raw = typeof value === 'string' ? value : value.asset ?? value.key ?? value.id ?? value.name;
  if (!raw) return null;
  const s = slug(String(raw).replace(/^(item|outfit)\./, ''));
  const name = ITEM_ASSETS[s] ? s : ITEM_ALIASES[s];
  return name && ITEM_ASSETS[name] ? name : null;
}
