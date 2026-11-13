// Constantes y formatos que comparten los hooks del M08.

export const RARITIES = {
  comun: { label: 'Común', color: 'var(--borde)' },
  raro: { label: 'Raro', color: 'var(--azul)' },
  epico: { label: 'Épico', color: 'var(--morado)' },
  legendario: { label: 'Legendario', color: 'var(--oro)' },
  carta: { label: 'Carta', color: 'var(--borde)' },
};
export const rarityMeta = (key) => RARITIES[key] ?? RARITIES.comun;

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

const pad = (n) => String(n).padStart(2, '0');
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
const daysBetween = (iso) => Math.round((startOfDay(new Date()) - startOfDay(new Date(iso))) / 86_400_000);

// Fecha para tablas: "Hoy 09:40", "Ayer 21:12", "Lun 5", "28 sep"
export function formatWhen(iso) {
  const d = new Date(iso);
  const days = daysBetween(iso);
  if (days === 0) return `Hoy ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  if (days === 1) return `Ayer ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  if (days < 7) return `${DAYS[d.getDay()]} ${d.getDate()}`;
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

// Tiempo relativo para la bandeja: "hace 20 min", "hace 3 h", "ayer", "lun 5"
export function formatAgo(iso) {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return 'ahora';
  if (minutes < 60) return `hace ${minutes} min`;
  if (daysBetween(iso) === 0) return `hace ${Math.round(minutes / 60)} h`;
  if (daysBetween(iso) === 1) return 'ayer';
  return formatWhen(iso).toLowerCase();
}

// "×3", "∞" o "Agotado" según las existencias
export const qtyText = (qty) => (qty < 0 ? '∞' : qty === 0 ? 'Agotado' : `×${qty}`);
