import { useState } from 'react';

/**
 * Hooks del perfil lite (módulo 10). Todo es MOCK por ahora:
 * cuando exista la API, solo cambia el interior de cada hook.
 */

// ───────────── Sesión ─────────────
export function useLiteSession() {
  return { user: { name: 'Valeria', level: 14, tone: '#8e24aa', avatar: null }, navBadges: { animo: 3 } };
}

// ───────────── Progreso · Pendientes ─────────────
const DAYS = [
  { id: 1, label: 'Jue', number: 1, pending: 2 },
  { id: 2, label: 'Vie', number: 2, pending: 1 },
  { id: 3, label: 'Sáb', number: 3, pending: 2 },
  { id: 4, label: 'Dom', number: 4, pending: 3 },
  { id: 5, label: 'Lun', number: 5, pending: 0 },
  { id: 6, label: 'Mar', number: 6, pending: 2 },
  { id: 7, label: 'Mié · ayer', number: 7, pending: 3 },
];
const TASKS_BY_DAY = {
  7: [
    { id: 't1', title: 'Leer 20 páginas', kind: 'Hábito', area: 'cultura', weeklyRepeats: 4 },
    { id: 't2', title: 'Estudiar inglés 30 min', kind: 'Hábito', area: 'cultura', weeklyRepeats: 3 },
    { id: 't3', title: 'Ordenar escritorio', kind: 'Misión', area: 'enfoque' },
  ],
};
const SUMMARY_BY_DAY = { 7: { dateLabel: 'Mié 7 oct', done: 3, total: 5 } };
const WEEKLY_REPEATS = [
  { id: 'r1', title: 'Leer 20 páginas', week: [true, false, true, true, false, false, true] },
  { id: 'r2', title: 'Estudiar inglés 30 min', week: [true, false, false, false, false, true, true] },
  { id: 'r3', title: 'Preparar exposición', week: [false, false, true, true, false, false, false] },
];

export function useProgresoPendientes() {
  const [selectedId, setSelectedId] = useState(DAYS[DAYS.length - 1].id);
  const selectedDay = DAYS.find((d) => d.id === selectedId);
  const tasks = TASKS_BY_DAY[selectedId] ?? [];
  const summary = SUMMARY_BY_DAY[selectedId] ?? { dateLabel: `${selectedDay.label} ${selectedDay.number}`, done: 0, total: 0 };

  const resumeTask = (task) => console.log('Retomar hoy:', task.id); // TODO: API

  return { days: DAYS, selectedDay, selectDay: setSelectedId, tasks, summary, weeklyRepeats: WEEKLY_REPEATS, resumeTask };
}

// ───────────── Ánimo · Stickers ─────────────
const CATEGORIES = [
  { value: 'animo', label: 'Ánimo' },
  { value: 'celebrar', label: 'Celebrar' },
  { value: 'descanso', label: 'Descanso' },
];
const mk = (prefix, labels) => labels.map((label, i) => ({ id: `${prefix}${i}`, label, tone: '#8e24aa' }));
const STICKERS = {
  animo: mk('a', ['¡TÚ puedes!', 'Un paso más', 'Te espero mañana', 'Respira hondo', 'Vamos juntos', 'No te rindas']),
  celebrar: mk('c', ['Racha de fuego', 'Qué crack', 'Así se hace', 'Récord nuevo']),
  descanso: mk('d', ['Mañana vuelves', 'Estoy contigo']),
};
const FRIENDS = [
  { id: 'f1', name: 'Camila', status: 'inactiva 4 días', tone: '#6b7280' },
  { id: 'f2', name: 'Mateo', status: 'baja actividad', tone: '#6b7280' },
  { id: 'f3', name: 'Ana', status: 'en línea', tone: '#2196f3' },
  { id: 'f4', name: 'Diego', status: 'hace 2 h', tone: '#f4511e' },
  { id: 'f5', name: 'Lucía', status: 'en línea', tone: '#2e9e5b' },
];

export function useStickersAnimo() {
  const [category, setCategory] = useState('animo');
  const [stickerId, setStickerId] = useState(STICKERS.animo[0].id);
  const [selectedFriends, setSelectedFriends] = useState(() => new Set(['f1']));

  const stickers = STICKERS[category];
  const selectedSticker = stickers.find((s) => s.id === stickerId);

  const changeCategory = (value) => { setCategory(value); setStickerId(STICKERS[value][0].id); };
  const toggleFriend = (id) =>
    setSelectedFriends((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  const sendSticker = () => {
    console.log('Enviar', selectedSticker.id, [...selectedFriends]); // TODO: API
    setSelectedFriends(new Set());
  };

  return {
    categories: CATEGORIES, category, changeCategory, stickers, selectedSticker, selectSticker: setStickerId,
    friends: FRIENDS, selectedFriends, toggleFriend, canSend: selectedFriends.size > 0, sendSticker,
  };
}

// ───────────── Ánimo · Historial ─────────────
const r = (id, title, person, when, tone, isNew = false) => ({ id, title, person, when, tone, isNew, direction: 'received' });
const s = (id, title, person, when, tone, seen = true) => ({ id, title, person, when, tone, seen, direction: 'sent' });

const INITIAL_RECEIVED = [
  r('r1', '¡TÚ puedes!', 'Ana', 'hoy 09:12', '#2196f3', true),
  r('r2', 'Racha de fuego', 'Lucía', 'ayer 22:40', '#2e9e5b', true),
  r('r3', 'Estoy contigo', 'Diego', 'ayer 19:05', '#f4511e', true),
  r('r4', 'Qué crack', 'Bruno', 'mar 6', '#7e57c2'),
  r('r5', 'Un paso más', 'Ana', 'lun 5', '#2196f3'),
  r('r6', 'Así se hace', 'Lucía', 'dom 4', '#2e9e5b'),
  r('r7', 'Mañana vuelves', 'Diego', 'sáb 3', '#f4511e'),
  r('r8', 'Récord nuevo', 'Bruno', 'vie 2', '#7e57c2'),
];
const SENT = [
  s('s1', '¡TÚ puedes!', 'Camila', 'hoy 08:30', '#6b7280', false),
  s('s2', 'Respira hondo', 'Mateo', 'ayer 20:10', '#6b7280'),
  s('s3', 'Vamos juntos', 'Ana', 'mar 6', '#2196f3'),
  s('s4', 'No te rindas', 'Camila', 'lun 5', '#6b7280'),
  s('s5', 'Te espero mañana', 'Mateo', 'dom 4', '#6b7280'),
  s('s6', 'Un paso más', 'Diego', 'sáb 3', '#f4511e'),
];

export function useHistorialAnimo() {
  const [view, setView] = useState('received');
  const [received, setReceived] = useState(INITIAL_RECEIVED);
  const newCount = received.filter((i) => i.isNew).length;

  const markAllSeen = () => setReceived((list) => list.map((i) => ({ ...i, isNew: false }))); // TODO: API

  return { view, setView, items: view === 'received' ? received : SENT, newCount, sentCount: SENT.length, markAllSeen };
}

// ───────────── Progreso · Días rojos (11.2) ─────────────
const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const WEEKDAYS_PLURAL = ['domingos', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábados'];
const YEAR = 2026;
const MONTH = 8; // septiembre (0-indexado)
const MONTH_LABEL = 'Septiembre 2026';
// % de hábitos cumplidos por día (día 1 = índice 0)
const PERCENTS = [78, 40, 70, 84, 88, 35, 45, 80, 63, 64, 88, 0, 35, 66, 88, 100, 89, 88, 0, 35, 57, 66, 78, 76, 94, 0, 35, 88, 88, 66];
const NOTES = { 6: 'Fiesta familiar', 12: 'Examen de física', 13: 'Me dormí tarde', 19: 'Viaje', 20: 'Viaje' };
const THRESHOLDS = [40, 50, 60];

export function useDiasRojos() {
  const [threshold, setThreshold] = useState(50);

  const days = PERCENTS.map((percent, i) => {
    const day = i + 1;
    const weekday = new Date(YEAR, MONTH, day).getDay();
    return { day, percent, weekday, weekdayLabel: WEEKDAYS[weekday], note: NOTES[day] ?? null, red: percent < threshold };
  });

  // Calendario con semana que inicia en lunes
  const lead = (new Date(YEAR, MONTH, 1).getDay() + 6) % 7;
  const cells = [...Array(lead).fill(null), ...days];

  const redDays = days.filter((d) => d.red);
  const counts = {};
  redDays.forEach((d) => { counts[d.weekday] = (counts[d.weekday] ?? 0) + 1; });
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  const concentration = top && top[1] >= 2 ? { label: WEEKDAYS_PLURAL[top[0]], count: top[1] } : null;

  return {
    monthLabel: MONTH_LABEL,
    thresholds: THRESHOLDS,
    threshold,
    setThreshold,
    cells,
    redDays,
    concentration,
  };
}

// ───────────── Progreso · Racha (11.3) ─────────────
const BEST_STREAK = 21;
const TODAY_HABITS = { done: 3, total: 5 };
const STREAK_STATES = {
  active: { current: 12, todayDone: true },
  atRisk: { current: 12, todayDone: false },
  broken: { current: 0, todayDone: false, previous: 12 },
};
const FILLER = [1, 1, 0, 1, 1, 1, 0, 1, 1, 0];

/** 21 casillas (la última es hoy): true = hubo check-in. */
function buildHistory(streak, todayDone) {
  const cells = Array(21).fill(false);
  const end = todayDone ? 20 : 19;
  for (let i = 0; i < streak; i++) cells[end - i] = true;
  const start = end - streak + 1;
  for (let i = 0; i < start - 1; i++) cells[i] = FILLER[i % FILLER.length] === 1;
  return cells;
}

export function useRacha() {
  // "status" es solo para previsualizar los 3 estados; con la API se deriva de los datos.
  const [status, setStatus] = useState('active');
  const state = STREAK_STATES[status];

  return {
    status,
    setStatus,
    current: state.current,
    previous: state.previous ?? null,
    todayDone: state.todayDone,
    checkinTime: '08:30',
    best: BEST_STREAK,
    today: TODAY_HABITS,
    history: buildHistory(state.current, state.todayDone),
    rangeLabel: '18 sep → hoy',
  };
}
