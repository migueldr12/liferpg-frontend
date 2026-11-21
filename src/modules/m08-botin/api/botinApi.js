// API del Módulo 8 (Botín · regalos entre amigos · PWA Perfil lite).
// Mientras no esté el backend, los datos viven en memoria y cada función
// simula su endpoint. Al conectar la API, sustituir el cuerpo de cada
// función por la petición indicada en su comentario usando http() de src/api/httpClient.js.

const MOCK_LATENCY_MS = 250;
const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), MOCK_LATENCY_MS));
const copy = (value) => JSON.parse(JSON.stringify(value));

let nextId = 100;
const newId = (prefix) => `${prefix}-${nextId++}`;

// Fecha ISO de hace `days` días a la hora indicada (para los datos simulados)
const ago = (days, hours = 12, minutes = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
};
const minutesAgo = (minutes) => new Date(Date.now() - minutes * 60_000).toISOString();

// Usuario actual y su party (los mismos amigos que usa el M12)
export const ME = { id: 'u-me', name: 'Tú', fullName: 'Valeria', level: 14, avatar: '🐲', color: '#9c27b0' };

const FRIENDS = [
  { id: 'u-ana', name: 'Ana', avatar: '🐳', color: '#29b6f6' },
  { id: 'u-diego', name: 'Diego', avatar: '🦊', color: '#ff7043' },
  { id: 'u-lucia', name: 'Lucía', avatar: '🐸', color: '#4caf50' },
  { id: 'u-bruno', name: 'Bruno', avatar: '🦄', color: '#7e57c2' },
  { id: 'u-mateo', name: 'Mateo', avatar: '🐺', color: '#90a4ae' },
];
const person = (id) => FRIENDS.find((f) => f.id === id);

// Catálogo de objetos regalables. En producción viene del catálogo del M14.
const ITEMS = {
  pocion: { name: 'Poción de HP', icon: '🧪', rarity: 'comun' },
  doblexp: { name: 'Doble XP · 24 h', icon: '⚡', rarity: 'epico' },
  boina: { name: 'Boina de pintor', icon: '🎨', rarity: 'raro' },
  escudo: { name: 'Escudo de racha', icon: '🛡️', rarity: 'raro' },
  pergamino: { name: 'Pergamino de enfoque', icon: '📜', rarity: 'comun' },
  bufanda: { name: 'Bufanda roja', icon: '🧣', rarity: 'comun' },
  corona: { name: 'Corona de 100 días', icon: '👑', rarity: 'legendario' },
  semilla: { name: 'Semilla de energía', icon: '🌱', rarity: 'comun' },
  carta: { name: 'Carta sellada', icon: '✉️', rarity: 'carta' },
};
const item = (id) => ({ id, ...ITEMS[id] });

// Cofre del usuario. qty -1 = ilimitado.
let myChest = [
  { itemId: 'pocion', qty: 3 },
  { itemId: 'doblexp', qty: 1 },
  { itemId: 'boina', qty: 1, equipped: true },
  { itemId: 'escudo', qty: 2 },
  { itemId: 'pergamino', qty: 4 },
  { itemId: 'bufanda', qty: 1 },
  { itemId: 'corona', qty: 1, exclusive: true },
  { itemId: 'semilla', qty: 5 },
  { itemId: 'carta', qty: -1 },
];

// Cofres de los amigos: solo se exponen sus objetos regalables
const FRIEND_CHESTS = {
  'u-ana': [['escudo', 2], ['doblexp', 1], ['pocion', 4], ['semilla', 2]],
  'u-diego': [['doblexp', 2], ['pergamino', 3], ['pocion', 1], ['carta', -1]],
  'u-lucia': [['pergamino', 5], ['escudo', 1], ['semilla', 3], ['carta', -1]],
  'u-bruno': [['pocion', 2], ['semilla', 6], ['bufanda', 1], ['carta', -1]],
  'u-mateo': [['semilla', 1], ['pocion', 1], ['carta', -1], ['pergamino', 1]],
};

let inbox = [
  { id: 's-1', from: 'u-ana', itemId: 'escudo', reason: 'Mañana viajo y no quiero perder mis 21 días.', at: minutesAgo(20), status: 'pendiente' },
  { id: 's-2', from: 'u-mateo', itemId: 'pocion', reason: 'Mi dragón está débil, llevo días sin entrenar.', at: minutesAgo(180), status: 'pendiente' },
  { id: 's-3', from: 'u-lucia', itemId: 'pergamino', reason: 'Semana de exámenes, cualquier ayuda cuenta.', at: ago(1, 19, 30), status: 'pendiente' },
  { id: 's-4', from: 'u-bruno', itemId: 'corona', reason: 'Porfa, quiero verla en mi dragón.', at: ago(3, 17, 10), status: 'pendiente' },
];

let myRequests = [
  { id: 'p-1', to: 'u-bruno', itemId: 'bufanda', at: ago(4, 10), status: 'rechazada' },
  { id: 'p-2', to: 'u-lucia', itemId: 'escudo', at: ago(2, 9), status: 'aceptada' },
  { id: 'p-3', to: 'u-diego', itemId: 'doblexp', at: ago(1, 20), status: 'pendiente' },
];

let history = [
  { id: 'h-1', direction: 'enviado', friendId: 'u-ana', itemId: 'pocion', message: '¡Para que no pierdas la racha!', at: ago(0, 9, 40) },
  { id: 'h-2', direction: 'recibido', friendId: 'u-lucia', itemId: 'escudo', message: 'Te lo debía, gracias por lo del lunes', at: ago(1, 21, 12) },
  { id: 'h-3', direction: 'enviado', friendId: 'u-diego', itemId: 'carta', message: 'Qué buena racha llevas, crack', at: ago(3, 18) },
  { id: 'h-4', direction: 'recibido', friendId: 'u-bruno', itemId: 'doblexp', message: 'Para tu semana de exámenes', at: ago(5, 11) },
  { id: 'h-5', direction: 'enviado', friendId: 'u-mateo', itemId: 'semilla', message: 'Vuelve pronto, te extrañamos', at: ago(7, 20) },
  { id: 'h-6', direction: 'recibido', friendId: 'u-ana', itemId: 'bufanda', message: 'Combina con tu dragón', at: ago(10, 16) },
  { id: 'h-7', direction: 'enviado', friendId: 'u-lucia', itemId: 'pergamino', message: '', at: ago(14, 13) },
  { id: 'h-8', direction: 'recibido', friendId: 'u-mateo', itemId: 'pocion', message: 'Ánimo con el examen', at: ago(19, 8) },
  { id: 'h-9', direction: 'enviado', friendId: 'u-bruno', itemId: 'escudo', message: 'No la rompas', at: ago(26, 22) },
  { id: 'h-10', direction: 'recibido', friendId: 'u-lucia', itemId: 'carta', message: 'Feliz cumple, Vale', at: ago(34, 10) },
];

export function getFriends() {
  return delay(copy(FRIENDS));
}

// ───────────── 8.1 Cofre del botín (RF027) y envío de regalos (RF025) ─────────────

// Une el objeto del catálogo con lo que tiene el usuario y si se puede regalar
const chestView = (entry) => ({
  ...item(entry.itemId),
  qty: entry.qty,
  equipped: !!entry.equipped,
  exclusive: !!entry.exclusive,
  giftable: !entry.equipped && !entry.exclusive && entry.qty !== 0,
});

// RDF088 · consultarCofre — GET /api/v1/botin/cofre
export function getMyChest() {
  return delay(copy(myChest.map(chestView)));
}

// RDF089 · validarItemRegalable — lo hace el servidor antes de enviar o aceptar
function validateGiftable(itemId) {
  const entry = myChest.find((c) => c.itemId === itemId);
  if (!entry) return 'Ese objeto no está en tu cofre.';
  if (entry.equipped) return 'No puedes regalar un objeto que tienes equipado.';
  if (entry.exclusive) return 'Los objetos exclusivos no se pueden regalar.';
  if (entry.qty === 0) return 'Ya no te quedan existencias de ese objeto.';
  return null;
}

const takeFromChest = (itemId) => {
  myChest = myChest.map((c) => (c.itemId === itemId && c.qty > 0 ? { ...c, qty: c.qty - 1 } : c));
};

const addHistory = (friendId, itemId, message) => {
  const entry = { id: newId('h'), direction: 'enviado', friendId, itemId, message, at: new Date().toISOString() };
  history = [entry, ...history];
  return entry;
};

// RDF082 · enviarRegalo — POST /api/v1/botin/regalos
// RDF090 · entregarRegalo (servidor): agrega el objeto al inventario del amigo
// en la app móvil y le manda una notificación push.
export function sendGift({ friendId, itemId, message }) {
  if (!person(friendId)) return Promise.reject(new Error('Elige a qué amigo enviarle el regalo.'));
  const invalid = validateGiftable(itemId);
  if (invalid) return Promise.reject(new Error(invalid));
  takeFromChest(itemId);
  addHistory(friendId, itemId, message.trim());
  return delay({ to: person(friendId).name, item: ITEMS[itemId].name, chest: copy(myChest.map(chestView)) });
}

// ───────────── 8.2 Solicitudes de regalo (RF025) ─────────────

const withPerson = (key) => (r) => ({ ...r, person: person(r[key]), item: item(r.itemId) });

// RDF084 · consultarSolicitudesRegalo — GET /api/v1/botin/solicitudes
export function getRequests() {
  return delay(copy({
    inbox: inbox.map(withPerson('from')),
    mine: [...myRequests].sort((a, b) => b.at.localeCompare(a.at)).map(withPerson('to')),
    chest: myChest.map(chestView),
  }));
}

// RDF085 · responderSolicitudRegalo — POST /api/v1/botin/solicitudes/:id (aceptar | rechazar)
// Aceptar envía el regalo (RDF082) con las mismas validaciones (RDF089).
export function respondRequest(id, accept) {
  const request = inbox.find((r) => r.id === id);
  if (!request || request.status !== 'pendiente') return Promise.reject(new Error('La solicitud ya fue respondida.'));
  if (accept) {
    const invalid = validateGiftable(request.itemId);
    if (invalid) return Promise.reject(new Error(invalid));
    takeFromChest(request.itemId);
    addHistory(request.from, request.itemId, 'Respondiste su solicitud');
  }
  inbox = inbox.map((r) => (r.id === id ? { ...r, status: accept ? 'aceptada' : 'rechazada' } : r));
  return delay(copy({ request: withPerson('from')(inbox.find((r) => r.id === id)), chest: myChest.map(chestView) }));
}

// Parte de RDF083: el cofre de un amigo para elegir qué pedirle
// GET /api/v1/botin/cofre/:amigoId
export function getFriendChest(friendId) {
  const chest = FRIEND_CHESTS[friendId] ?? [];
  return delay(copy(chest.map(([itemId, qty]) => ({ ...item(itemId), qty }))));
}

// RDF083 · solicitarRegalo — POST /api/v1/botin/solicitudes
export function requestGift({ friendId, itemId }) {
  if (!person(friendId)) return Promise.reject(new Error('Elige a qué amigo pedirle.'));
  const repeated = myRequests.some((r) => r.to === friendId && r.itemId === itemId && r.status === 'pendiente');
  if (repeated) return Promise.reject(new Error('Ya le pediste ese objeto; espera su respuesta.'));
  const request = { id: newId('p'), to: friendId, itemId, at: new Date().toISOString(), status: 'pendiente' };
  myRequests = [request, ...myRequests];
  return delay(copy(withPerson('to')(request)));
}

// ───────────── 8.3 Historial de botín (RF026) ─────────────

// RDF086 · consultarHistorialBotin + RDF087 · filtrarHistorialBotin
// GET /api/v1/botin/historial?tipo=enviado|recibido&amigo=:id&desde=:fecha
export function getHistory({ direction = null, friendId = null, since = null } = {}) {
  const rows = history
    .filter((h) => (!direction || h.direction === direction) && (!friendId || h.friendId === friendId) && (!since || h.at >= since))
    .map(withPerson('friendId'));
  return delay(copy(rows));
}
