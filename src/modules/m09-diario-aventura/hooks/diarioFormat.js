// Constantes y formatos que comparten los hooks del M09.

export const TYPES = [
  { key: 'cultura', label: 'Cultura', short: 'CUL', icon: '📖', color: 'var(--cultura)' },
  { key: 'fisico', label: 'Físico', short: 'FÍS', icon: '🏋️', color: 'var(--fisico)' },
  { key: 'enfoque', label: 'Enfoque', short: 'ENF', icon: '🎯', color: 'var(--enfoque)' },
];
export const typeMeta = (key) => TYPES.find((t) => t.key === key) ?? TYPES[0];

export const ORIGINS = [
  { key: 'habito', label: 'Hábito' },
  { key: 'mision', label: 'Misión' },
  { key: 'sesion', label: 'Sesión' },
];
export const originLabel = (key) => ORIGINS.find((o) => o.key === key)?.label ?? key;

export const STATUSES = [
  { key: 'hecha', label: 'Hecha' },
  { key: 'pendiente', label: 'Pendiente' },
  { key: 'fallida', label: 'Fallida' },
];
export const statusLabel = (key) => STATUSES.find((s) => s.key === key)?.label ?? key;

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

const pad = (n) => String(n).padStart(2, '0');
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
export const daysAgo = (iso) => Math.round((startOfDay(new Date()) - startOfDay(new Date(iso))) / 86_400_000);

// "Hoy", "Ayer", "Lun 2" o "28 oct"
export function formatDay(iso) {
  const d = new Date(iso);
  const days = daysAgo(iso);
  if (days === 0) return 'Hoy';
  if (days === 1) return 'Ayer';
  if (days < 7) return `${DAYS[d.getDay()]} ${d.getDate()}`;
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export const formatTime = (iso) => {
  const d = new Date(iso);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// "Hoy · 18:05" o "Lun 2 · 20:40"
export const formatStamp = (iso) => `${formatDay(iso)} · ${formatTime(iso)}`;

// Puntos de una actividad: "+50 ENF" o "—"
export const pointsText = (a) => (a.points ? `+${a.points} ${typeMeta(a.type).short}` : '—');
