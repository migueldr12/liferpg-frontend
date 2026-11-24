// Generador del sprite "Mochi" (dragón pixel-art 22×21).
//
// Portado línea por línea del componente "Mascota dragón" de `Life-RPG Modulos M07-M15.html`.
// Módulo puro (sin DOM ni React): lo usan <PixelMascot> en el navegador y
// `scripts/generate-assets.mjs` en Node para emitir los SVG estáticos de `public/catalog`.
//
// Accesorios del mockup: beret, glasses, book · escena: forest.
// Accesorios marcados NUEVO no existen en el mockup: se dibujaron con las mismas primitivas.

export const MOODS = ['happy', 'focus', 'joy', 'weak'];
export const MOOD_LABELS = { happy: 'contenta', focus: 'concentrada', joy: 'celebrando', weak: 'debilitada' };

export const MOCKUP_ACCESSORIES = ['beret', 'glasses', 'book'];
export const NEW_ACCESSORIES = ['crown', 'scarf', 'scholar-cape', 'winged-sneakers', 'zen-helmet', 'wind-cape'];
export const ACCESSORIES = [...MOCKUP_ACCESSORIES, ...NEW_ACCESSORIES];
export const SCENES = ['none', 'forest', 'gold-frame'];

const DEFAULT_PU = '#9C27B0';
const DEFAULT_GD = '#FFC107';

// Mitad izquierda del sprite (11 columnas); la derecha es su espejo.
const L = [
  '....o......',
  '...oho.....',
  '...ohho....',
  '...oohhoooo',
  '..obbbbbbbb',
  '.obbbbbbbbb',
  '.obbbbbbbbb',
  '.obbbwkbbbb',
  '.obbbkkbbbb',
  '.obbbkkbbbb',
  '.obppbbbbob',
  '.obbbbbbbbo',
  '..obbbbbbbb',
  '.o.oobbbbbb',
  'ogo.obbllll',
  'oggoobbllll',
  'ogggobbllll',
  'oggoobbllll',
  '.oo.obbbbll',
  '....obbbbo.',
  '....oooooo.',
];
const M = {
  focus: ['.obbbbbbbbb', '.obbbkkbbbb', '.obbbbbbbbb', '.obppbbbbbb', '.obbbbbbbbo'],
  joy: ['.obbbbkbbbb', '.obbbkbkbbb', '.obbbbbbbbb', '.obppbbbbkk', '.obbbbbbbbk'],
  weak: ['.obbbkbkbbb', '.obbbbkbbbb', '.obbbkbkbbb', '.obppbbbbbo', '.obbbbbbbob'],
};

const FOREST = [
  [0, 0, 64, 36, '#24493F'], [0, 0, 64, 9, '#1C3B33'],
  [12, 0, 7, 27, 'rgba(255,230,160,.10)'], [41, 0, 9, 27, 'rgba(255,230,160,.08)'],
  [4, 6, 3, 22, '#3A2A24'], [15, 4, 2, 24, '#33251F'], [49, 5, 3, 23, '#3A2A24'], [58, 7, 2, 21, '#33251F'],
  [0, 0, 13, 8, '#2F6B3F'], [1, 8, 10, 3, '#2A5E38'], [11, 0, 9, 5, '#3A7E46'], [26, 0, 13, 3, '#2A5E38'],
  [44, 0, 13, 7, '#2F6B3F'], [54, 0, 10, 10, '#3A7E46'], [46, 7, 8, 2, '#2A5E38'],
  [0, 21, 10, 6, '#3E8C4A'], [1, 20, 7, 1, '#4FA257'], [53, 21, 11, 6, '#3E8C4A'], [55, 20, 7, 1, '#4FA257'],
  [0, 27, 64, 9, '#5DAE45'], [0, 27, 64, 1, '#79C55A'],
  [5, 31, 8, 1, '#4A9438'], [45, 33, 10, 1, '#4A9438'], [26, 35, 14, 1, '#4A9438'],
  [16, 33, 4, 2, '#C9B79C'], [44, 30, 4, 2, '#C9B79C'], [9, 34, 3, 1, '#B3A186'], [51, 35, 4, 1, '#B3A186'],
  [9, 26, 3, 1, '#D9534F'], [10, 27, 1, 1, '#F4EEDC'],
  [8, 29, 1, 1, '#FFC107'], [12, 30, 1, 1, '#FF8FB1'], [48, 28, 1, 1, '#FFFFFF'], [57, 31, 1, 1, '#FFC107'], [3, 32, 1, 1, '#FF8FB1'], [60, 29, 1, 1, '#FF8FB1'],
  [14, 26, 1, 1, '#79C55A'], [38, 26, 1, 1, '#79C55A'], [47, 26, 1, 1, '#79C55A'],
  [23, 33, 18, 2, 'rgba(0,0,0,.25)'],
];

// NUEVO · marco dorado (no está en el mockup): anillo de 2 px alrededor del sprite.
const GOLD_FRAME = [
  [0, 0, 26, 25, '#2A3548'],
  [0, 0, 26, 2, '#FFC107'], [0, 23, 26, 2, '#FFC107'], [0, 0, 2, 25, '#FFC107'], [24, 0, 2, 25, '#FFC107'],
  [0, 0, 26, 1, '#9A6B00'], [0, 24, 26, 1, '#9A6B00'], [0, 0, 1, 25, '#9A6B00'], [25, 0, 1, 25, '#9A6B00'],
  [0, 0, 3, 3, '#FFE082'], [23, 0, 3, 3, '#FFE082'], [0, 22, 3, 3, '#FFE082'], [23, 22, 3, 3, '#FFE082'],
  [1, 1, 1, 1, '#E0533D'], [24, 1, 1, 1, '#E0533D'], [1, 23, 1, 1, '#E0533D'], [24, 23, 1, 1, '#E0533D'],
];

const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const toHex = (rgb) => '#' + rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
// Igual que `color-mix(in srgb, a p%, b)`: interpolación por canal en sRGB.
export const mix = (a, b, p) => { const x = hex(a), y = hex(b); return toHex(x.map((v, i) => v * p + y[i] * (1 - p))); };

/**
 * @param {object} o
 * @param {'happy'|'focus'|'joy'|'weak'} [o.mood]
 * @param {string|string[]} [o.acc]  accesorios separados por espacio (como en el mockup) o arreglo
 * @param {'none'|'forest'|'gold-frame'} [o.scene]
 * @param {string} [o.color]  hex del cuerpo. Sin él se emite `var(--pu, #9C27B0)` como el mockup.
 * @param {string} [o.gold]   hex de cuernos/dorado. Sin él se emite `var(--gd, #FFC107)`.
 * @param {boolean} [o.bare]  solo la escena, sin la mascota.
 * @returns {{ viewBox: string, preserveAspectRatio: string, label: string, rects: {x:number,y:number,w:number,h:number,fill:string}[] }}
 */
export function renderDragon({ mood = 'happy', acc = '', scene = 'none', color, gold, bare = false } = {}) {
  const accs = Array.isArray(acc) ? acc.join(' ') : String(acc || '');
  const has = (name) => accs.split(/\s+/).includes(name);
  const rows = L.slice();
  if (M[mood]) M[mood].forEach((r, i) => { rows[7 + i] = r; });
  const grid = rows.map((r) => (r + r.split('').reverse().join('')).split(''));
  const put = (y, x, c) => { if (grid[y] && x >= 0 && x < 22) grid[y][x] = c; };
  const sym = (y, x, c) => { put(y, x, c); put(y, 21 - x, c); };
  const span = (y, a, b, c) => { for (let x = a; x <= b; x++) put(y, x, c); };
  const swap = (from, to, y0, y1) => { for (let y = y0; y <= y1; y++) for (let x = 0; x < 22; x++) if (grid[y][x] === from) grid[y][x] = to; };

  // ── Capas traseras (NUEVO): capas sobre las alas ──
  if (has('scholar-cape')) {
    swap('g', 'v', 13, 18);
    span(13, 4, 17, 'v'); put(13, 10, 'h'); put(13, 11, 'h');
  }
  if (has('wind-cape')) {
    swap('g', 'a', 13, 18);
    span(13, 4, 17, 'a'); sym(15, 1, 'W'); sym(17, 2, 'W'); sym(19, 1, 'a'); sym(20, 0, 'a');
  }

  // ── Accesorios del mockup ──
  if (has('beret')) {
    span(0, 10, 11, 'o'); span(1, 7, 14, 'o');
    put(2, 5, 'o'); span(2, 6, 15, 'e'); put(2, 16, 'o'); put(2, 8, 'E'); put(2, 9, 'E');
    put(3, 4, 'o'); span(3, 5, 16, 'e'); put(3, 17, 'o');
    span(4, 4, 17, 'o');
  }
  if (has('glasses')) {
    sym(6, 5, 'h'); sym(6, 6, 'h');
    [7, 8, 9].forEach((y) => { sym(y, 4, 'h'); sym(y, 7, 'h'); });
    sym(10, 5, 'h'); sym(10, 6, 'h');
    span(8, 8, 13, 'h');
  }
  if (has('book')) {
    span(14, 5, 16, 'o'); span(18, 5, 16, 'o');
    [15, 16, 17].forEach((y) => { put(y, 5, 'o'); span(y, 6, 9, 'q'); span(y, 10, 11, 'o'); span(y, 12, 15, 'q'); put(y, 16, 'o'); });
    span(15, 7, 8, 'n'); span(15, 13, 14, 'n'); span(17, 7, 8, 'n'); span(17, 13, 14, 'n');
    sym(16, 4, 'b');
  }

  // ── NUEVO · cabeza ──
  if (has('crown')) {
    sym(0, 7, 'o'); span(0, 10, 11, 'o');
    sym(1, 6, 'o'); sym(1, 7, 'h'); sym(1, 8, 'o'); sym(1, 9, 'o'); span(1, 10, 11, 'h');
    put(2, 5, 'o'); span(2, 6, 15, 'h'); put(2, 16, 'o'); sym(2, 7, 'r'); span(2, 10, 11, 'c');
    put(3, 5, 'o'); span(3, 6, 15, 'h'); put(3, 16, 'o');
    span(4, 5, 16, 'o');
  }
  if (has('zen-helmet')) {
    span(1, 9, 12, 'o');
    put(2, 7, 'o'); span(2, 8, 13, 'z'); put(2, 14, 'o');
    span(3, 6, 15, 'z'); sym(3, 5, 'o');
    span(5, 2, 19, 'Z'); span(5, 10, 11, 'h');
  }

  // ── NUEVO · cuerpo ──
  if (has('scarf')) {
    span(12, 3, 18, 'r'); sym(12, 2, 'o');
    span(13, 4, 17, 'r'); [5, 8, 13, 16].forEach((x) => put(13, x, 'R'));
    [14, 15, 16].forEach((y) => { put(y, 14, 'r'); put(y, 15, 'R'); });
    put(17, 14, 'o'); put(17, 15, 'o');
  }
  if (has('winged-sneakers')) {
    span(19, 5, 8, 's'); span(19, 13, 16, 's'); sym(19, 6, 'r');
    sym(18, 3, 'W'); sym(19, 3, 'W'); sym(19, 2, 'W');
  }

  const weak = mood === 'weak';
  const pu = color || `var(--pu, ${DEFAULT_PU})`;
  const gd = gold || `var(--gd, ${DEFAULT_GD})`;
  const C = {
    o: '#1B1230', k: '#1B1230', w: '#FFFFFF', e: '#2B3550', E: '#3D4A6B', q: '#F4EEDC', n: '#A99C80',
    p: weak ? '#9AA0AE' : '#FF8FB1',
    b: weak ? '#7D8394' : pu,
    g: weak ? '#5C6170' : (color ? mix(color, '#12172B', 0.6) : 'color-mix(in srgb, ' + pu + ' 60%, #12172B)'),
    l: weak ? '#BCC1CC' : (color ? mix(color, '#FFFFFF', 0.3) : 'color-mix(in srgb, ' + pu + ' 30%, #FFFFFF)'),
    h: weak ? '#A8A089' : gd,
    // NUEVO
    r: '#E0533D', R: '#A8321F', c: '#4FC3F7', v: '#5E35B1', a: '#4FC3F7', W: '#FFFFFF', s: '#F4EEDC', z: '#4FC3F7', Z: '#2B8FD6',
  };

  const rects = [];
  let ox = 0, oy = 0, viewBox = '0 0 22 21';
  if (scene === 'forest') {
    ox = 21; oy = 13; viewBox = '0 0 64 36';
    FOREST.forEach((s) => rects.push({ x: s[0], y: s[1], w: s[2], h: s[3], fill: s[4] }));
  } else if (scene === 'gold-frame') {
    ox = 2; oy = 2; viewBox = '0 0 26 25';
    GOLD_FRAME.forEach((s) => rects.push({ x: s[0], y: s[1], w: s[2], h: s[3], fill: s[4] }));
  }
  if (!bare) grid.forEach((row, y) => {
    let x = 0;
    while (x < 22) {
      const ch = row[x];
      if (ch === '.') { x++; continue; }
      let e = x + 1;
      while (e < 22 && row[e] === ch) e++;
      rects.push({ x: x + ox, y: y + oy, w: e - x, h: 1, fill: C[ch] });
      x = e;
    }
  });
  return {
    viewBox,
    preserveAspectRatio: scene === 'forest' ? 'xMidYMax slice' : 'xMidYMid meet',
    label: 'Mochi, la mascota dragón, ' + (MOOD_LABELS[mood] || 'contenta'),
    rects,
  };
}

/** SVG autónomo (colores horneados si se pasan `color`/`gold`). */
export function dragonSvg(opts = {}, { title } = {}) {
  const d = renderDragon(opts);
  const body = d.rects.map((r) => `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="${r.fill}"/>`).join('');
  const label = title || d.label;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${d.viewBox}" preserveAspectRatio="${d.preserveAspectRatio}" shape-rendering="crispEdges" role="img" aria-label="${label}"><title>${label}</title>${body}</svg>\n`;
}
