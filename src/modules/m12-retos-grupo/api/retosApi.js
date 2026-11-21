// API del Módulo 12 (Retos y métricas de grupo · PWA Perfil lite).
// Mientras no esté el backend, los datos viven en memoria y cada función
// simula su endpoint. Al conectar la API, sustituir el cuerpo de cada
// función por la petición indicada en su comentario usando http() de src/api/httpClient.js.

const MOCK_LATENCY_MS = 250;
const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), MOCK_LATENCY_MS));
const copy = (value) => JSON.parse(JSON.stringify(value));

let nextId = 100;
const newId = (prefix) => `${prefix}-${nextId++}`;

const daysFromNow = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

// Usuario actual y su party (amigos)
export const ME = { id: 'u-me', name: 'Tú', fullName: 'Valeria', level: 14, avatar: '🐲', color: '#9c27b0' };

const FRIENDS = [
  { id: 'u-ana', name: 'Ana', avatar: '🐳', color: '#29b6f6' },
  { id: 'u-lucia', name: 'Lucía', avatar: '🐸', color: '#4caf50' },
  { id: 'u-diego', name: 'Diego', avatar: '🦊', color: '#ff7043' },
  { id: 'u-bruno', name: 'Bruno', avatar: '🦄', color: '#7e57c2' },
  { id: 'u-mateo', name: 'Mateo', avatar: '🐺', color: '#90a4ae' },
  { id: 'u-camila', name: 'Camila', avatar: '🐱', color: '#bdbdbd' },
];

const PEOPLE = [ME, ...FRIENDS];
const person = (id) => PEOPLE.find((p) => p.id === id);

// ───────────── 12.1 Tablero de retos grupales (RF037) ─────────────

let challenges = [
  {
    id: 'r-1', title: '50 sesiones de enfoque', type: 'enfoque', goal: 50, unit: 'sesiones', deadline: daysFromNow(6),
    reward: 'Cofre raro',
    contributions: { 'u-me': 14, 'u-ana': 11, 'u-lucia': 9, 'u-diego': 4 },
  },
  {
    id: 'r-2', title: '100 km entre todos', type: 'fisico', goal: 100, unit: 'km', deadline: daysFromNow(12),
    reward: 'Tenis de maratón',
    contributions: { 'u-me': 21, 'u-diego': 19, 'u-bruno': 15 },
  },
  {
    id: 'r-3', title: 'Club de lectura · 30 libros', type: 'cultura', goal: 30, unit: 'libros', deadline: daysFromNow(26),
    reward: 'Lentes de lector',
    contributions: { 'u-me': 4, 'u-ana': 3, 'u-lucia': 6, 'u-camila': 2 },
  },
];

let invitations = [
  {
    id: 'inv-1', from: 'u-bruno', challenge: {
      title: 'Maratón de lectura', type: 'cultura', goal: 40, unit: 'sesiones', deadline: daysFromNow(9), reward: 'Cofre raro',
      contributions: { 'u-bruno': 6, 'u-mateo': 3 },
    },
  },
];

export function getFriends() {
  return delay(copy(FRIENDS));
}

// Une los datos del reto con los de cada participante para la vista
const withPeople = (c) => ({
  ...c,
  participants: Object.entries(c.contributions)
    .map(([id, amount]) => ({ ...person(id), amount }))
    .sort((a, b) => b.amount - a.amount),
});

// RDF120 · consultarProgresoReto — GET /api/v1/retos
export function getChallenges() {
  return delay(copy(challenges.map(withPeople)));
}

// RDF118 · invitaciones pendientes — GET /api/v1/retos/invitaciones
export function getInvitations() {
  return delay(copy(invitations.map((i) => ({ ...i, fromPerson: person(i.from) }))));
}

// RDF117 · agregarRetoGrupal — POST /api/v1/retos
export function createChallenge({ title, type, goal, unit, deadline, invited }) {
  const clean = title.trim();
  if (!clean) return Promise.reject(new Error('Escribe el nombre del reto.'));
  if (!(goal > 0)) return Promise.reject(new Error('La meta debe ser mayor a 0.'));
  if (!deadline || deadline <= daysFromNow(0)) {
    return Promise.reject(new Error('La fecha límite debe ser posterior a hoy.'));
  }
  if (!invited.length) return Promise.reject(new Error('Invita al menos a un amigo.'));
  // Los invitados aparecen cuando acepten; por ahora solo participa quien lo crea
  const challenge = {
    id: newId('r'), title: clean, type, goal, unit: unit.trim() || 'actividades', deadline,
    reward: 'Cofre raro', contributions: { [ME.id]: 0 }, invitedCount: invited.length,
  };
  challenges = [...challenges, challenge];
  return delay(copy(withPeople(challenge)));
}

// RDF118 · unirseARetoGrupal — POST /api/v1/retos/invitaciones/:id (aceptar | rechazar)
export function respondInvitation(id, accept) {
  const invitation = invitations.find((i) => i.id === id);
  if (!invitation) return Promise.reject(new Error('La invitación ya no existe.'));
  invitations = invitations.filter((i) => i.id !== id);
  if (!accept) return delay(null);
  const challenge = {
    id: newId('r'), ...invitation.challenge,
    contributions: { ...invitation.challenge.contributions, [ME.id]: 0 },
  };
  challenges = [...challenges, challenge];
  return delay(copy(withPeople(challenge)));
}

// ───────────── 12.2 Métricas de grupo (RF038) ─────────────

// RDF122 · calcularPromedioGrupo — lo calcula el servidor; aquí se simulan los resultados
const METRICS = {
  semana: { cultura: { me: 72, group: 58 }, fisico: { me: 41, group: 55 }, enfoque: { me: 80, group: 64 } },
  mes: { cultura: { me: 66, group: 60 }, fisico: { me: 52, group: 57 }, enfoque: { me: 74, group: 61 } },
};

// RDF123 · mostrarMetricasGrupo — GET /api/v1/retos/metricas?periodo=semana|mes
export function getGroupMetrics(period) {
  return delay({ period, friendsCount: FRIENDS.length, byType: copy(METRICS[period]) });
}

// ───────────── 12.3 Filtros de actividad grupal (RF039) ─────────────

// RDF124 · calcularAvanceSemanalPorArea — puntos ganados esta semana por área
const WEEKLY = {
  'u-me': { cultura: 64, fisico: 30, enfoque: 88 },
  'u-ana': { cultura: 70, fisico: 45, enfoque: 52 },
  'u-lucia': { cultura: 92, fisico: 20, enfoque: 61 },
  'u-diego': { cultura: 30, fisico: 85, enfoque: 40 },
  'u-bruno': { cultura: 48, fisico: 62, enfoque: 35 },
  'u-mateo': { cultura: 22, fisico: 58, enfoque: 74 },
  'u-camila': { cultura: 8, fisico: 12, enfoque: 19 },
};

// RDF125 · filtrarAmigosPorArea — GET /api/v1/retos/actividad?area=cultura|fisico|enfoque
export function getWeeklyActivity(area) {
  const ranking = PEOPLE.map((p) => ({ ...p, points: WEEKLY[p.id][area], isMe: p.id === ME.id }))
    .sort((a, b) => b.points - a.points)
    .map((p, i) => ({ ...p, position: i + 1 }));
  return delay(copy(ranking));
}

// La felicitación con sticker la envía el M10; aquí solo se simula la llamada
// POST /api/v1/stickers
export function sendCongrats(friendId) {
  return delay({ to: person(friendId)?.name });
}
