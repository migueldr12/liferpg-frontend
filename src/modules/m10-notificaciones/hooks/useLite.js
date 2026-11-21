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
