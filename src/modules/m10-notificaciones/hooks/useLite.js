import { useEffect, useRef, useState } from 'react';

/**
 * Hooks del perfil lite (módulo 10). Todo es MOCK por ahora:
 * cuando exista la API, solo cambia el interior de cada hook.
 */

// ───────────── Sesión ─────────────
export function useLiteSession() {
  return { user: { name: 'Valeria', level: 14, tone: '#8e24aa', avatar: null }, navBadges: { animo: 3 } };
}

// ───────────── Ánimo · Avisos ─────────────
const OWN_ALERTS = [
  { id: 'o1', title: 'Tu dragón te extraña', body: 'Ayer no registraste hábitos. Hoy aún puedes salvar la racha.', when: 'hoy 08:00', tone: '#9c27b0', variant: 0, pet: 'dragon', active: true },
  { id: 'o2', title: 'Ana te mandó ánimo', body: '“¡Tú puedes!” tras tu aviso de inactividad.', when: 'hoy 09:12', tone: '#2b8fd6', variant: 1, pet: 'gato' },
  { id: 'o3', title: 'De vuelta en ruta', body: 'Volviste a cumplir 3 de 4 hábitos. Aviso cerrado.', when: 'lun 5', tone: '#2ea86b', variant: 2, pet: 'dragon' },
];
const QUICK_RESPONSES = ['¡Tú puedes!', 'Te espero mañana', 'Un paso más'];
const NEEDS_SUPPORT = [
  { id: 'camila', name: 'Camila', reason: '4 días sin registros', hint: 'Prioridad alta', tone: '#c2185b', variant: 3, pet: 'perro', week: [1, 1, 0, 0, 0, 0, 0] },
  { id: 'mateo', name: 'Mateo', reason: '22 % de cumplimiento', hint: 'Baja actividad', tone: '#f28c28', variant: 4, pet: 'hamster', week: [1, 0, 1, 0, 0, 1, 0] },
  { id: 'bruno', name: 'Bruno', reason: '2 días sin registros', hint: 'Sin registros recientes', tone: '#7e57c2', variant: 5, pet: 'leon', week: [1, 1, 1, 1, 1, 0, 0] },
];

export function useAvisosAnimo() {
  const [responses, setResponses] = useState({});
  const respond = (personId, message) => setResponses((current) => ({ ...current, [personId]: message }));
  return {
    ownAlerts: OWN_ALERTS,
    people: NEEDS_SUPPORT,
    quickResponses: QUICK_RESPONSES,
    responses,
    pendingCount: NEEDS_SUPPORT.length - Object.keys(responses).length,
    sentCount: Object.keys(responses).length,
    respond,
  };
}

// ───────────── Ánimo · Stickers ─────────────
const CATEGORIES = [
  { value: 'animo', label: 'Ánimo' },
  { value: 'celebrar', label: 'Celebrar' },
  { value: 'descanso', label: 'Descanso' },
];
const mk = (prefix, labels, tone) => labels.map((label, i) => ({ id: `${prefix}${i}`, label, tone, variant: i }));
const STICKERS = {
  animo: mk('a', ['¡Tú puedes!', 'Un paso más', 'Te espero mañana', 'Respira hondo', 'Vamos juntos', 'No te rindas'], '#9c27b0'),
  celebrar: mk('c', ['¡Nivel arriba!', 'Racha de fuego', 'Qué crack', 'Misión cumplida', 'Récord nuevo', 'Así se hace'], '#f28c28'),
  descanso: mk('d', ['Hoy toca descansar', 'Mañana vuelves', 'Estoy contigo', 'Sin presión', 'Duerme bien', 'Un día a la vez'], '#2b8fd6'),
};
const FRIENDS = [
  { id: 'f1', name: 'Camila', status: 'inactiva 4 días', tone: '#c2185b', variant: 3, pet: 'perro' },
  { id: 'f2', name: 'Mateo', status: 'baja actividad', tone: '#f28c28', variant: 4, pet: 'hamster' },
  { id: 'f3', name: 'Ana', status: 'en línea', tone: '#2196f3', variant: 1, pet: 'gato' },
  { id: 'f4', name: 'Diego', status: 'hace 2 h', tone: '#f4511e', variant: 2, pet: 'dragon' },
  { id: 'f5', name: 'Lucía', status: 'en línea', tone: '#2e9e5b', variant: 5, pet: 'leon' },
];

export function useStickersAnimo() {
  const [category, setCategory] = useState('animo');
  const [stickerId, setStickerId] = useState(STICKERS.animo[0].id);
  const [selectedFriends, setSelectedFriends] = useState(() => new Set(['f1']));
  const [sent, setSent] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const stickers = STICKERS[category];
  const selectedSticker = stickers.find((s) => s.id === stickerId);

  const changeCategory = (value) => { setCategory(value); setStickerId(STICKERS[value][0].id); setSent(false); };
  const toggleFriend = (id) =>
    setSelectedFriends((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      setSent(false);
      return next;
    });
  const sendSticker = () => {
    setSent(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setSent(false), 1800);
  };

  return {
    categories: CATEGORIES, category, changeCategory, stickers, selectedSticker, selectSticker: setStickerId,
    friends: FRIENDS, selectedFriends, toggleFriend, canSend: selectedFriends.size > 0, sent, sendSticker,
  };
}

// ───────────── Ánimo · Historial ─────────────
const r = (id, title, person, when, tone, isNew = false) => ({ id, title, person, when, tone, isNew, direction: 'received' });
const s = (id, title, person, when, tone) => ({ id, title, person, when, tone, direction: 'sent' });

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
  s('s1', '¡Tú puedes!', 'Camila', 'hoy 08:30', '#6b7280'),
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
  const markSeen = (id) => setReceived((list) => list.map((i) => (i.id === id ? { ...i, isNew: false } : i)));

  return { view, setView, items: view === 'received' ? received : SENT, newCount, sentCount: SENT.length, markAllSeen, markSeen };
}
