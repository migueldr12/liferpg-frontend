// API del Módulo 9 (Diario de aventura · PWA Perfil lite).
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
const shift = (iso, minutes) => new Date(new Date(iso).getTime() + minutes * 60_000).toISOString();

// Usuario actual (el mismo que usan M08 y M12)
export const ME = { id: 'u-me', name: 'Tú', fullName: 'Valeria', level: 14, avatar: '🐲', color: '#9c27b0' };

// Actividades registradas desde la app móvil: hábitos (M02), misiones (M03) y sesiones de enfoque.
// Las misiones guardan cómo se validaron (bloqueo, smartwatch o manual) y los hábitos su dificultad.
let activities = [
  { id: 'a-1', title: 'Correr 5 km', type: 'fisico', origin: 'mision', status: 'hecha', at: ago(0, 7, 12), durationMin: 40, points: 80, xp: 120, validation: 'smartwatch' },
  { id: 'a-2', title: 'Meditar 10 min', type: 'enfoque', origin: 'habito', status: 'hecha', at: ago(0, 8, 30), durationMin: 10, points: 10, xp: 15, difficulty: 'Fácil' },
  { id: 'a-3', title: 'Sesión de enfoque · 25 min', type: 'enfoque', origin: 'sesion', status: 'hecha', at: ago(0, 16, 0), durationMin: 25, points: 15, xp: 23 },
  { id: 'a-4', title: 'Leer 20 páginas', type: 'cultura', origin: 'habito', status: 'pendiente', at: ago(0, 23, 59), durationMin: 30, points: 0, xp: 0, difficulty: 'Media' },
  { id: 'a-5', title: 'Repasar álgebra', type: 'enfoque', origin: 'mision', status: 'hecha', at: ago(1, 17, 40), durationMin: 45, points: 50, xp: 75, validation: 'bloqueo' },
  { id: 'a-6', title: 'Caminar 8 000 pasos', type: 'fisico', origin: 'habito', status: 'hecha', at: ago(1, 20, 15), durationMin: 60, points: 10, xp: 15, difficulty: 'Fácil' },
  { id: 'a-7', title: 'Terminar novela', type: 'cultura', origin: 'mision', status: 'hecha', at: ago(3, 19, 22), durationMin: 60, points: 70, xp: 105, validation: 'manual' },
  { id: 'a-8', title: 'Preparar exposición', type: 'cultura', origin: 'mision', status: 'fallida', at: ago(4, 22, 10), durationMin: 50, points: 0, xp: 0, failReason: 'rendicion' },
  { id: 'a-9', title: 'Sesión de enfoque · 50 min', type: 'enfoque', origin: 'sesion', status: 'hecha', at: ago(4, 18, 0), durationMin: 50, points: 30, xp: 45 },
  { id: 'a-10', title: 'Bici 12 km', type: 'fisico', origin: 'mision', status: 'hecha', at: ago(5, 9, 0), durationMin: 45, points: 60, xp: 90, validation: 'smartwatch' },
  { id: 'a-11', title: 'Caminar 8 000 pasos', type: 'fisico', origin: 'habito', status: 'hecha', at: ago(10, 7, 30), durationMin: 60, points: 10, xp: 15, difficulty: 'Fácil' },
  { id: 'a-12', title: 'Leer 20 páginas', type: 'cultura', origin: 'habito', status: 'fallida', at: ago(16, 23, 59), durationMin: 30, points: 0, xp: 0, difficulty: 'Media' },
];

// Notas de seguimiento por actividad
let notes = {
  'a-5': [
    { id: 'n-1', text: 'Terminé los ejercicios 1 a 20. Me trabé con factorización por agrupación.', at: ago(1, 18, 5) },
    { id: 'n-2', text: 'Vi el video de productos notables; ya entiendo binomio al cuadrado.', at: ago(2, 20, 40) },
    { id: 'n-3', text: 'Armé la guía con los 3 temas que entran en el examen del viernes.', at: ago(3, 21, 30) },
  ],
  'a-8': [
    { id: 'n-4', text: 'Me rendí a la mitad: el celular me distrajo. Mañana lo intento con una sesión más corta.', at: ago(4, 22, 30) },
  ],
};

// ───────────── 9.1 Listado de actividades (RF028) ─────────────

// RDF091 · consultarActividades + RDF092 · filtrarActividades
// GET /api/v1/diario/actividades?tipo=&origen=&estado=&desde=
export function getActivities({ type = null, origin = null, status = null, since = null } = {}) {
  const rows = activities
    .filter((a) => (!type || a.type === type) && (!origin || a.origin === origin) && (!status || a.status === status) && (!since || a.at >= since))
    .sort((a, b) => b.at.localeCompare(a.at));
  return delay(copy(rows));
}

// ───────────── 9.2 Estado de actividad (RF029) ─────────────

// Recorrido de la actividad: lo arma el servidor con los eventos que registró la app
function timelineOf(a) {
  if (a.origin === 'mision') {
    const end = a.status === 'fallida'
      ? { label: 'Te rendiste · sin puntos', at: a.at, tone: 'mal' }
      : { label: { bloqueo: 'Completada con modo concentración', smartwatch: 'Validada con smartwatch', manual: 'Confirmada manualmente' }[a.validation], at: a.at, tone: 'bien' };
    return [
      { label: 'Creada', at: shift(a.at, -3 * 24 * 60 - 170), tone: 'bien' },
      { label: 'Sesión iniciada', at: shift(a.at, -a.durationMin), tone: 'bien' },
      end,
    ];
  }
  if (a.origin === 'habito') {
    const end = a.status === 'hecha'
      ? { label: 'Check-in registrado', at: a.at, tone: 'bien' }
      : a.status === 'pendiente'
        ? { label: 'Pendiente de check-in · cierra 23:59', at: null, tone: 'pendiente' }
        : { label: 'Sin check-in al cierre del día', at: a.at, tone: 'mal' };
    return [{ label: 'Programado · todos los días', at: null, tone: 'bien' }, end];
  }
  return [
    { label: 'Sesión iniciada', at: shift(a.at, -a.durationMin), tone: 'bien' },
    { label: 'Completada sin salir de la app', at: a.at, tone: 'bien' },
  ];
}

// RDF093 · consultarDetalleActividad — GET /api/v1/diario/actividades/:id
export function getActivity(id) {
  const a = activities.find((x) => x.id === id);
  if (!a) return Promise.reject(new Error('No encontramos esa actividad.'));
  const list = [...(notes[id] ?? [])].sort((x, y) => y.at.localeCompare(x.at));
  return delay(copy({ ...a, timeline: timelineOf(a), notes: list }));
}

// RDF094 · agregarNotaSeguimiento — POST /api/v1/diario/actividades/:id/notas
export function addNote(activityId, text) {
  const clean = text.trim();
  if (!clean) return Promise.reject(new Error('Escribe algo en la nota.'));
  const note = { id: newId('n'), text: clean, at: new Date().toISOString() };
  notes = { ...notes, [activityId]: [note, ...(notes[activityId] ?? [])] };
  return delay(copy(note));
}

// RDF095 · actualizarNotaSeguimiento — PUT /api/v1/diario/actividades/:id/notas/:notaId
export function updateNote(activityId, noteId, text) {
  const clean = text.trim();
  if (!clean) return Promise.reject(new Error('La nota no puede quedar vacía.'));
  let updated = null;
  notes = {
    ...notes,
    [activityId]: (notes[activityId] ?? []).map((n) => (n.id === noteId ? (updated = { ...n, text: clean, edited: true }) : n)),
  };
  if (!updated) return Promise.reject(new Error('La nota ya no existe.'));
  return delay(copy(updated));
}

// RDF095 · eliminar nota — DELETE /api/v1/diario/actividades/:id/notas/:notaId
export function deleteNote(activityId, noteId) {
  notes = { ...notes, [activityId]: (notes[activityId] ?? []).filter((n) => n.id !== noteId) };
  return delay(null);
}

// ───────────── 9.3 Gráficas de actividades (RF030) ─────────────

// Ruido determinista para simular el historial más allá de las actividades de arriba
const rn = (seed, k) => {
  const x = Math.sin(seed * 12.9898 + k * 78.233) * 43758.5453;
  return x - Math.floor(x);
};
const TYPES = ['cultura', 'fisico', 'enfoque'];
const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const dayKey = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

// Actividades cumplidas en un día: las registradas más una base simulada
function countsForDay(date) {
  const seed = Math.floor(date.getTime() / 86_400_000);
  const counts = Object.fromEntries(TYPES.map((t, k) => [t, Math.round(rn(seed, k) * [2.4, 1.8, 2.6][k])]));
  activities
    .filter((a) => a.status === 'hecha' && dayKey(new Date(a.at)) === dayKey(date))
    .forEach((a) => { counts[a.type] += 1; });
  return counts;
}

function buckets(range) {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  if (range === 'anio') {
    return Array.from({ length: today.getMonth() + 1 }, (_, m) => {
      const seed = today.getFullYear() * 12 + m;
      return { label: MONTHS[m], ...Object.fromEntries(TYPES.map((t, k) => [t, Math.round((0.5 + rn(seed, k)) * [24, 18, 26][k])])) };
    });
  }
  const days = range === 'mes' ? 30 : 7;
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (days - 1 - i));
    const label = i === days - 1 ? 'Hoy' : range === 'mes' ? (i % 5 === 0 ? String(d.getDate()) : '') : `${DAYS[d.getDay()]} ${d.getDate()}`;
    return { label, ...countsForDay(d) };
  });
}

// RDF096 · consultarCumplimientoPorPeriodo — GET /api/v1/diario/graficas/cumplimiento?rango=semana|mes|anio
export function getCompletionByPeriod(range) {
  return delay(copy(buckets(range)));
}

// RDF097 · consultarDistribucionPorTipo — GET /api/v1/diario/graficas/distribucion?rango=semana|mes|anio
export function getDistributionByType(range) {
  const totals = Object.fromEntries(TYPES.map((t) => [t, 0]));
  buckets(range).forEach((b) => TYPES.forEach((t) => { totals[t] += b[t]; }));
  return delay(totals);
}
