// Registro único de assets de Life-RPG.
//
// - La PWA lo usa para dibujar mascotas, stickers e iconos por su clave.
// - `scripts/generate-assets.mjs` emite con él los archivos de `public/catalog/**` y el
//   `manifest.json` que siembra MongoDB (`icon_assets`, `catalog_categories`, `catalog_items`).
// - Las CLAVES (`key`) son permanentes: una vez sembradas en Mongo no se renombran.
//
// Qué tiene cada usuario lo decide el backend (inventario, vestidor, cofres). Aquí solo se
// describe cómo se ve cada cosa.
//
// Origen de cada entrada: `source: 'mockup'` → definida en `Life-RPG Modulos M07-M15.html`;
// `source: 'nuevo'` → diseño o nombre propio, no está en el mockup.

// ── Tonos de recuadro (del tema del mockup). Se guardan como token, nunca como hex fijo,
// porque `c1`/`pt` cambian con la paleta y el modo claro/oscuro.
export const TONES = {
  c1: { css: 'var(--c1)', dark: '#D58BE3' },
  c2: { css: 'var(--c2)', dark: '#FF8A65' },
  c3: { css: 'var(--c3)', dark: '#4FC3F7' },
  pt: { css: 'var(--pt)', dark: '#D58BE3' },
  gd: { css: 'var(--gd)', dark: '#FFC107' },
  ac: { css: 'var(--ac)', dark: '#4CAF50' },
  bd: { css: 'var(--bd)', dark: '#36435A' },
};

// ── Colores de mascota (PlayerProfile.mascotColor guarda el hex).
export const MASCOT_COLORS = [
  { key: 'color.morado', name: 'Morado dragón', hex: '#9C27B0', source: 'mockup' },
  { key: 'color.rubi', name: 'Rubí', hex: '#C2185B', source: 'mockup' },
  { key: 'color.escarcha', name: 'Escarcha', hex: '#2B8FD6', source: 'mockup' },
  { key: 'color.esmeralda', name: 'Esmeralda', hex: '#2EA86B', source: 'mockup', note: 'color de Lucía; nombre nuevo' },
  { key: 'color.lavanda', name: 'Lavanda', hex: '#7E57C2', source: 'mockup', note: 'color de Bruno; nombre nuevo' },
  { key: 'color.brasa', name: 'Brasa', hex: '#E0533D', source: 'mockup', note: 'color de Diego; nombre nuevo' },
  { key: 'color.ambar', name: 'Ámbar', hex: '#F28C28', source: 'mockup', note: 'color de Mateo; nombre nuevo' },
];
export const DEFAULT_MASCOT_COLOR = '#9C27B0';
export const GOLD = '#FFC107';

// ── Iconos de línea 24×24 (stroke). Paths copiados del mockup (diccionarios `I`).
export const ICON_PATHS = {
  potion: 'M9 3h6M10 3v5l-5 9a3 3 0 0 0 3 4h8a3 3 0 0 0 3-4l-5-9V3M7 14h10',
  zap: 'M13 2 4 14h7l-1 8 9-12h-7z',
  shirt: 'M8 3 4 6l2 4 2-1v12h8V9l2 1 2-4-4-3a4 4 0 0 1-8 0z',
  shield: 'M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z',
  scroll: 'M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8M6 4a2 2 0 0 0-2 2v2h4V6a2 2 0 0 0-2-2zM9 9h7M9 13h7',
  crown: 'M3 8l4 4 5-7 5 7 4-4-2 11H5z',
  leaf: 'M5 19c0-8 6-14 15-14 0 9-6 15-14 15M5 19l7-7',
  mail: 'M3 5h18v14H3zM3 6l9 7 9-7',
  book: 'M4 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4zM20 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6z',
  dumb: 'M6 7v10M3 9v6M18 7v10M21 9v6M6 12h12',
  target: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
  heart: 'M12 20s-8-5-8-11a4 4 0 0 1 8-1 4 4 0 0 1 8 1c0 6-8 11-8 11z',
  star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',
  flame: 'M12 3c1 4 5 6 5 11a5 5 0 0 1-10 0c0-3 2-4 2-7 1 1 2 2 2 4 1-2 1-5 1-8z',
  // NUEVO · iconos de objetos que el mockup dibuja con `shirt`
  glasses: 'M3 12h4M17 12h4M7 12a3 3 0 1 0 6 0 3 3 0 1 0-6 0zM11 12a3 3 0 1 0 6 0 3 3 0 1 0-6 0z',
  frame: 'M4 4h16v16H4zM8 8h8v8H8z',
  tree: 'M12 3 6 11h3l-4 6h14l-4-6h3zM12 17v4',
};

// ── Categorías (catalog_categories). `type` = CategoryType del esquema Prisma.
export const CATEGORIES = [
  { key: 'cat.lectura', name: 'Lectura', type: 'HABIT', icon: 'book', tone: 'c1', source: 'mockup' },
  { key: 'cat.ejercicio', name: 'Ejercicio', type: 'HABIT', icon: 'dumb', tone: 'c2', source: 'mockup' },
  { key: 'cat.estudio', name: 'Estudio', type: 'MISSION', icon: 'target', tone: 'c3', source: 'mockup' },
  { key: 'cat.ropa', name: 'Ropa', type: 'STORE', icon: 'shirt', tone: 'pt', source: 'mockup' },
  { key: 'cat.consumibles', name: 'Consumibles', type: 'STORE', icon: 'potion', tone: 'c2', source: 'mockup' },
  { key: 'cat.temporada-otono', name: 'Temporada otoño', type: 'STORE', icon: 'leaf', tone: 'bd', source: 'mockup' },
  { key: 'cat.exclusivos', name: 'Exclusivos', type: 'STORE', icon: 'crown', tone: 'gd', source: 'mockup' },
  { key: 'cat.sticker-animo', name: 'Ánimo', type: 'STICKER', icon: 'heart', tone: 'pt', source: 'mockup' },
  { key: 'cat.sticker-celebrar', name: 'Celebrar', type: 'STICKER', icon: 'star', tone: 'gd', source: 'mockup' },
  { key: 'cat.sticker-descanso', name: 'Descanso', type: 'STICKER', icon: 'leaf', tone: 'ac', source: 'mockup' },
];

// ── Áreas (AreaType / PointType).
export const AREAS = [
  { key: 'area.cultura', name: 'Cultura', enum: 'CULTURE', icon: 'book', tone: 'c1' },
  { key: 'area.fisico', name: 'Físico', enum: 'PHYSICAL', icon: 'dumb', tone: 'c2' },
  { key: 'area.enfoque', name: 'Enfoque', enum: 'FOCUS', icon: 'target', tone: 'c3' },
];

// ── Objetos (catalog_items). `acc`/`scene` = cómo se dibujan sobre la mascota.
// `rarity` y `unlock` son metadatos de UI; `giftable`, `slot`, `price`, `minLevel` van a Mongo.
export const ITEMS = [
  // Ropa / vestidor
  { key: 'item.boina-pintor', name: 'Boina de pintor', category: 'cat.ropa', slot: 'HEAD', acc: 'beret', icon: 'shirt', tone: 'pt', price: 120, rarity: 'Raro', giftable: false, tags: ['Ropa'], source: 'mockup' },
  { key: 'item.lentes-lector', name: 'Lentes de lector', category: 'cat.ropa', slot: 'FACE', acc: 'glasses', icon: 'glasses', tone: 'c1', price: 90, rarity: 'Común', giftable: false, tags: ['Ropa'], source: 'mockup' },
  { key: 'item.bufanda-roja', name: 'Bufanda roja', category: 'cat.temporada-otono', slot: 'BODY', acc: 'scarf', icon: 'shirt', tone: 'c2', price: 60, rarity: 'Común', giftable: true, tags: ['Ropa', 'Otoño'], source: 'mockup', note: 'píxeles nuevos' },
  { key: 'item.libro-aventuras', name: 'Libro de aventuras', category: 'cat.ropa', slot: 'BODY', acc: 'book', icon: 'book', tone: 'c1', price: 80, rarity: 'Común', giftable: false, tags: ['Ropa'], source: 'nuevo', note: 'accesorio del mockup; nombre y precio nuevos' },
  // Exclusivos (no se compran: se desbloquean)
  { key: 'item.corona-100-dias', name: 'Corona de 100 días', category: 'cat.exclusivos', slot: 'HEAD', acc: 'crown', icon: 'crown', tone: 'gd', price: 0, rarity: 'Legendario', giftable: false, unlock: 'Racha 100', tags: ['Exclusivo', 'No regalable'], source: 'mockup', note: 'píxeles nuevos' },
  { key: 'item.capa-erudito', name: 'Capa de erudito', category: 'cat.exclusivos', slot: 'BODY', acc: 'scholar-cape', icon: 'shirt', tone: 'c1', price: 0, minLevel: 20, pointType: 'CULTURE', rarity: 'Épico', giftable: false, unlock: 'Cultura LV 20', tags: ['Exclusivo'], source: 'mockup', note: 'píxeles nuevos' },
  { key: 'item.tenis-alados', name: 'Tenis alados', category: 'cat.exclusivos', slot: 'BODY', acc: 'winged-sneakers', icon: 'shirt', tone: 'c2', price: 0, minLevel: 20, pointType: 'PHYSICAL', rarity: 'Épico', giftable: false, unlock: 'Físico LV 20', tags: ['Exclusivo'], source: 'mockup', note: 'píxeles nuevos' },
  { key: 'item.casco-zen', name: 'Casco zen', category: 'cat.exclusivos', slot: 'HEAD', acc: 'zen-helmet', icon: 'shirt', tone: 'c3', price: 0, minLevel: 20, pointType: 'FOCUS', rarity: 'Épico', giftable: false, unlock: 'Enfoque LV 20', tags: ['Exclusivo'], source: 'mockup', note: 'píxeles nuevos' },
  { key: 'item.capa-viento', name: 'Capa de viento', category: 'cat.exclusivos', slot: 'BODY', acc: 'wind-cape', icon: 'shirt', tone: 'pt', price: 0, rarity: 'Épico', giftable: false, unlock: 'Reto grupal', tags: ['Recompensa reto'], source: 'mockup', note: 'píxeles nuevos' },
  { key: 'item.marco-dorado', name: 'Marco dorado', category: 'cat.exclusivos', slot: 'BACKGROUND', scene: 'gold-frame', icon: 'star', tone: 'gd', price: 0, rarity: 'Legendario', giftable: false, unlock: 'Top 1 semanal', tags: ['Exclusivo'], source: 'mockup', note: 'píxeles nuevos' },
  { key: 'item.fondo-bosque', name: 'Bosque', category: 'cat.ropa', slot: 'BACKGROUND', scene: 'forest', icon: 'tree', tone: 'ac', price: 0, rarity: 'Común', giftable: false, tags: ['Predeterminado'], source: 'mockup', note: 'escena del mockup; como objeto es nuevo' },
  // Consumibles y regalables del cofre
  { key: 'item.pocion-hp', name: 'Poción de HP', category: 'cat.consumibles', icon: 'potion', tone: 'c2', price: 40, rarity: 'Común', giftable: true, tags: ['Consumible', 'Cofre'], source: 'mockup' },
  { key: 'item.doble-xp-24h', name: 'Doble XP · 24 h', category: 'cat.consumibles', icon: 'zap', tone: 'gd', price: 350, rarity: 'Épico', giftable: true, tags: ['Potenciador', 'Cofre'], source: 'mockup' },
  { key: 'item.escudo-racha', name: 'Escudo de racha', category: 'cat.consumibles', icon: 'shield', tone: 'c3', price: 200, rarity: 'Raro', giftable: true, tags: ['Consumible', 'Cofre'], source: 'mockup' },
  { key: 'item.pergamino-enfoque', name: 'Pergamino de enfoque', category: 'cat.consumibles', icon: 'scroll', tone: 'c3', price: 0, rarity: 'Común', giftable: true, tags: ['Cofre'], source: 'mockup' },
  { key: 'item.semilla-energia', name: 'Semilla de energía', category: 'cat.consumibles', icon: 'leaf', tone: 'ac', price: 0, rarity: 'Común', giftable: true, tags: ['Cofre'], source: 'mockup' },
  { key: 'item.carta-sellada', name: 'Carta sellada', category: null, icon: 'mail', tone: 'bd', price: 0, rarity: 'Carta', giftable: true, unlimited: true, tags: ['Ilimitado'], source: 'mockup' },
];

// ── Stickers (catalog_items con categoría STICKER). Tal cual el mockup (M10 · 10.2).
// `bg` es el fondo del recuadro según su posición en la cuadrícula.
const STICKER_BG = ['#9C27B040', '#FF8A652E', '#4FC3F72E', '#4CAF502E', '#FFC1072E', '#2A3548'];
const STICKER_SETS = [
  ['cat.sticker-animo', 'animo', [['tu-puedes', '¡Tú puedes!', 'joy', ''], ['un-paso-mas', 'Un paso más', 'focus', 'beret'], ['te-espero-manana', 'Te espero mañana', 'happy', ''], ['respira-hondo', 'Respira hondo', 'focus', 'glasses'], ['vamos-juntos', 'Vamos juntos', 'happy', 'beret'], ['no-te-rindas', 'No te rindas', 'joy', 'book']]],
  ['cat.sticker-celebrar', 'celebrar', [['nivel-arriba', '¡Nivel arriba!', 'joy', 'beret'], ['racha-de-fuego', 'Racha de fuego', 'joy', ''], ['que-crack', 'Qué crack', 'happy', 'glasses'], ['mision-cumplida', 'Misión cumplida', 'happy', 'book'], ['record-nuevo', 'Récord nuevo', 'joy', 'beret glasses'], ['asi-se-hace', 'Así se hace', 'happy', '']]],
  ['cat.sticker-descanso', 'descanso', [['hoy-toca-descansar', 'Hoy toca descansar', 'weak', ''], ['manana-vuelves', 'Mañana vuelves', 'happy', 'beret'], ['estoy-contigo', 'Estoy contigo', 'happy', ''], ['sin-presion', 'Sin presión', 'focus', 'book'], ['duerme-bien', 'Duerme bien', 'weak', 'beret'], ['un-dia-a-la-vez', 'Un día a la vez', 'focus', '']]],
];
export const STICKERS = STICKER_SETS.flatMap(([category, set, list]) => list.map(([slug, name, mood, acc], i) => ({
  key: `sticker.${set}.${slug}`, name, category, mood, acc, bg: STICKER_BG[i], source: 'mockup',
})));

// ── Escenas sueltas (fondo sin mascota) y mascotas base.
export const SCENES = [
  { key: 'scene.forest', name: 'Bosque', scene: 'forest', source: 'mockup' },
  { key: 'scene.gold-frame', name: 'Marco dorado', scene: 'gold-frame', source: 'nuevo' },
];

// Mascotas de especie anteriores (PNG de la app móvil). Se conservan como legado.
export const LEGACY_PETS = ['dragon', 'gato', 'perro', 'hamster', 'leon'].map((pet) => ({
  key: `legacy.pet.${pet}`, name: pet, url: `/icons/${pet}.png`, mimeType: 'image/png', source: 'app móvil',
}));

// ── Rutas de los archivos generados (relativas a la raíz pública de cada cliente).
export const CATALOG_BASE = '/catalog';
const slugOf = (key) => key.split('.').slice(1).join('-');
export const fileFor = (key) => {
  const [kind] = key.split('.');
  const folder = { mascot: 'mascots', item: 'items', outfit: 'outfits', sticker: 'stickers', cat: 'categories', area: 'areas', scene: 'scenes' }[kind];
  return `${CATALOG_BASE}/${folder}/${slugOf(key)}.svg`;
};

const byKey = new Map(
  [...MASCOT_COLORS, ...CATEGORIES, ...AREAS, ...ITEMS, ...STICKERS, ...SCENES, ...LEGACY_PETS].map((entry) => [entry.key, entry]),
);
export const getAsset = (key) => byKey.get(key) ?? null;

// Compatibilidad: los datos sembrados antes usaban emoji o nombres en `icon`.
const LEGACY_ICON_ALIASES = {
  '💪': 'sticker.animo.tu-puedes', '🚀': 'sticker.animo.un-paso-mas', '🎉': 'sticker.celebrar.nivel-arriba',
  '🏆': 'sticker.celebrar.record-nuevo', '🤗': 'sticker.descanso.estoy-contigo', '💛': 'sticker.animo.vamos-juntos',
};
/** Resuelve `catalogItem.icon` (clave nueva, emoji viejo o nombre) a una entrada del registro. */
export const resolveIcon = (icon) => getAsset(icon) ?? getAsset(LEGACY_ICON_ALIASES[icon]) ?? null;
