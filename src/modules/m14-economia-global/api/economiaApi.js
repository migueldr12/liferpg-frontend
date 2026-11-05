// API del Módulo 14 (Balanceo de economía global · PWA Admin).
// Mientras no esté el backend, los datos viven en memoria y cada función
// simula su endpoint. Al conectar la API, sustituir el cuerpo de cada
// función por la petición indicada en su comentario usando http() de src/api/httpClient.js.

const MOCK_LATENCY_MS = 250;
const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), MOCK_LATENCY_MS));
const copy = (value) => JSON.parse(JSON.stringify(value));

let nextId = 100;
const newId = (prefix) => `${prefix}-${nextId++}`;

// ───────────── 14.1 Curva de experiencia (RF043) ─────────────

let economyVersions = [
  {
    version: 7,
    base: 95,
    exponent: 1.55,
    difficultyPoints: { facil: 10, media: 25, dificil: 50, epica: 100 },
    rewardPrice: { min: 50, max: 800 },
    publishedAt: '2026-09-28T18:00:00.000Z',
  },
];

// RDF134 · consultarCurvaXP — GET /api/v1/economia/curva
export function getActiveEconomy() {
  return delay(copy(economyVersions[economyVersions.length - 1]));
}

// RDF135 y RDF136 · actualizarFormulaXP / actualizarParametrosEconomia — POST /api/v1/economia/versiones
// Cada publicación crea una versión nueva; no se modifica la anterior (no retroactivo).
export function publishEconomy(draft) {
  const { base, exponent, difficultyPoints, rewardPrice } = draft;
  if (!(base > 0)) return Promise.reject(new Error('La base debe ser mayor a 0.'));
  if (!(exponent >= 1 && exponent <= 2.5)) {
    return Promise.reject(new Error('El exponente debe estar entre 1.0 y 2.5.'));
  }
  if (!(rewardPrice.min > 0 && rewardPrice.min < rewardPrice.max)) {
    return Promise.reject(new Error('El precio mínimo debe ser mayor a 0 y menor que el máximo.'));
  }
  const values = Object.values(difficultyPoints);
  if (values.some((v) => !(v > 0))) {
    return Promise.reject(new Error('Los puntos por dificultad deben ser mayores a 0.'));
  }
  const last = economyVersions[economyVersions.length - 1];
  const published = {
    version: last.version + 1,
    base,
    exponent,
    difficultyPoints: { ...difficultyPoints },
    rewardPrice: { ...rewardPrice },
    publishedAt: new Date().toISOString(),
  };
  economyVersions = [...economyVersions, published];
  return delay(copy(published));
}

// ───────────── 14.2 Gestión de catálogo (RF044) ─────────────

let categories = [
  { id: 'cat-1', name: 'Lectura', type: 'habitos', icon: '📖', inUse: 214 },
  { id: 'cat-2', name: 'Ejercicio', type: 'habitos', icon: '🏋️', inUse: 388 },
  { id: 'cat-3', name: 'Estudio', type: 'misiones', icon: '🎯', inUse: 156 },
  { id: 'cat-4', name: 'Ropa', type: 'tienda', icon: '👕', inUse: 42 },
  { id: 'cat-5', name: 'Consumibles', type: 'tienda', icon: '🧪', inUse: 18 },
  { id: 'cat-6', name: 'Celebrar', type: 'stickers', icon: '⭐', inUse: 6 },
  { id: 'cat-7', name: 'Temporada otoño', type: 'tienda', icon: '🍂', inUse: 0 },
];

let items = [
  { id: 'it-1', name: 'Boina de pintor', group: 'tienda', icon: '🎨', price: 180, tags: ['Ropa'], active: true },
  { id: 'it-2', name: 'Poción de HP', group: 'tienda', icon: '🧪', price: 40, tags: ['Consumible'], active: true },
  { id: 'it-3', name: 'Escudo de racha', group: 'tienda', icon: '🛡️', price: 300, tags: ['Consumible'], active: true },
  { id: 'it-4', name: 'Lentes de lector', group: 'tienda', icon: '👓', price: 90, tags: ['Ropa'], active: true },
  { id: 'it-5', name: 'Bufanda roja', group: 'tienda', icon: '🧣', price: 60, tags: ['Ropa', 'Otoño'], active: true },
  { id: 'it-6', name: 'Doble XP · 24 h', group: 'tienda', icon: '⚡', price: 350, tags: ['Potenciador'], active: true },
  { id: 'it-7', name: 'Capucha de monje', group: 'exclusivos', icon: '🧘', price: 0, tags: ['Enfoque'], active: true },
  { id: 'it-8', name: 'Tenis de maratón', group: 'exclusivos', icon: '👟', price: 0, tags: ['Físico'], active: false },
  { id: 'it-9', name: 'Cofre raro', group: 'regalables', icon: '🎁', price: 120, tags: ['Botín'], active: true },
  { id: 'it-10', name: '¡Tú puedes!', group: 'stickers', icon: '💪', price: 0, tags: ['Ánimo'], active: true },
  { id: 'it-11', name: 'Choca esos cinco', group: 'stickers', icon: '🙌', price: 0, tags: ['Celebrar'], active: true },
];

// RDF137 · consultar categorías — GET /api/v1/catalogo/categorias
export function getCategories() {
  return delay(copy(categories));
}

// RDF137 · agregarCategoria — POST /api/v1/catalogo/categorias
export function createCategory({ name, type, icon }) {
  const clean = name.trim();
  if (!clean) return Promise.reject(new Error('Escribe el nombre de la categoría.'));
  if (categories.some((c) => c.name.toLowerCase() === clean.toLowerCase() && c.type === type)) {
    return Promise.reject(new Error('Ya existe una categoría con ese nombre.'));
  }
  const category = { id: newId('cat'), name: clean, type, icon, inUse: 0 };
  categories = [...categories, category];
  return delay(copy(category));
}

// RDF138 · actualizarCategoria — PUT /api/v1/catalogo/categorias/:id
export function updateCategory(id, { name, type, icon }) {
  const clean = name.trim();
  if (!clean) return Promise.reject(new Error('El nombre no puede quedar vacío.'));
  categories = categories.map((c) => (c.id === id ? { ...c, name: clean, type, icon } : c));
  return delay(copy(categories.find((c) => c.id === id)));
}

// RDF138 · eliminarCategoria — DELETE /api/v1/catalogo/categorias/:id
// Solo se puede borrar si ningún hábito, misión o artículo la usa.
export function deleteCategory(id) {
  const category = categories.find((c) => c.id === id);
  if (category && category.inUse > 0) {
    return Promise.reject(new Error(`"${category.name}" está en uso (${category.inUse}); no se puede eliminar.`));
  }
  categories = categories.filter((c) => c.id !== id);
  return delay(undefined);
}

// RDF140 · consultar artículos — GET /api/v1/catalogo/articulos
export function getItems() {
  return delay(copy(items));
}

// RDF140 · administrarArticulosCatalogo (alta) — POST /api/v1/catalogo/articulos
// RDF139 · el ícono se elige al dar de alta (en producción se sube como imagen)
export function createItem({ name, group, icon, price, tag }) {
  const clean = name.trim();
  if (!clean) return Promise.reject(new Error('Escribe el nombre del artículo.'));
  if (!(price >= 0)) return Promise.reject(new Error('El precio no puede ser negativo.'));
  const item = { id: newId('it'), name: clean, group, icon, price, tags: tag ? [tag] : [], active: true };
  items = [...items, item];
  return delay(copy(item));
}

// RDF140 · administrarArticulosCatalogo (activar/desactivar) — PATCH /api/v1/catalogo/articulos/:id
export function setItemActive(id, active) {
  items = items.map((i) => (i.id === id ? { ...i, active } : i));
  return delay(copy(items.find((i) => i.id === id)));
}

// ───────────── 14.3 Disparador push (RF045) ─────────────

const TOTAL_USERS = 1248;
const knownUsers = ['camila', 'valeria', 'bruno', 'lucia', 'diego', 'ana', 'mateo'];

const hoursAgo = (h) => new Date(Date.now() - h * 3_600_000).toISOString();

let pushHistory = [
  { id: 'p-1', title: 'Mantenimiento programado', message: 'El sábado a las 22:00 la app estará en mantenimiento 30 min.', target: { kind: 'todos' }, recipients: 1248, sentAt: hoursAgo(30), status: 'entregado', deliveredPct: 97 },
  { id: 'p-2', title: '¡Nuevo atuendo de otoño!', message: 'La bufanda roja ya está en la tienda.', target: { kind: 'todos' }, recipients: 1241, sentAt: hoursAgo(50), status: 'entregado', deliveredPct: 98 },
  { id: 'p-3', title: 'Te extrañamos, Camila', message: 'Tu dragón te espera.', target: { kind: 'usuario', username: 'camila' }, recipients: 1, sentAt: hoursAgo(100), status: 'entregado', deliveredPct: 100 },
  { id: 'p-4', title: 'Semana de exámenes', message: 'Activa el modo concentración para tus sesiones de estudio.', target: { kind: 'todos' }, recipients: 1230, sentAt: hoursAgo(150), status: 'fallido', deliveredPct: 18 },
  { id: 'p-5', title: 'Prueba de envío', message: 'Prueba interna.', target: { kind: 'usuario', username: 'valeria' }, recipients: 1, sentAt: hoursAgo(200), status: 'entregado', deliveredPct: 100 },
];

export function getAudienceSize() {
  return delay(TOTAL_USERS);
}

// RDF142 · consultarHistorialEnvios — GET /api/v1/push/historial
export function getPushHistory() {
  return delay(copy([...pushHistory].sort((a, b) => b.sentAt.localeCompare(a.sentAt))));
}

// RDF141 · enviarNotificacionPush — POST /api/v1/push
// En producción el servidor lo envía por Firebase Cloud Messaging.
export function sendPush({ title, message, target }) {
  const t = title.trim();
  const m = message.trim();
  if (!t || !m) return Promise.reject(new Error('El título y el mensaje son obligatorios.'));
  if (t.length > 50) return Promise.reject(new Error('El título no puede pasar de 50 caracteres.'));
  if (m.length > 160) return Promise.reject(new Error('El mensaje no puede pasar de 160 caracteres.'));

  let recipients = TOTAL_USERS;
  if (target.kind === 'usuario') {
    const username = target.username.trim().replace(/^@/, '').toLowerCase();
    if (!knownUsers.includes(username)) {
      return Promise.reject(new Error(`No existe el usuario @${username || '…'}.`));
    }
    target = { kind: 'usuario', username };
    recipients = 1;
  }

  // Evitar duplicados: mismo título al mismo destino en las últimas 24 h
  const dayAgo = hoursAgo(24);
  const duplicate = pushHistory.find(
    (p) =>
      p.title.toLowerCase() === t.toLowerCase() &&
      p.target.kind === target.kind &&
      p.target.username === target.username &&
      p.sentAt > dayAgo,
  );
  if (duplicate) {
    return Promise.reject(new Error('Ya se envió un aviso con ese título a ese destino en las últimas 24 h.'));
  }

  const sent = {
    id: newId('p'),
    title: t,
    message: m,
    target,
    recipients,
    sentAt: new Date().toISOString(),
    status: 'entregado',
    deliveredPct: target.kind === 'usuario' ? 100 : 96,
  };
  pushHistory = [sent, ...pushHistory];
  return delay(copy(sent));
}
