// Party de demostración tal como la dibuja el mockup (color, accesorios y estado por amigo).
// Solo para las pantallas que aún usan datos simulados: con API, color y equipo llegan del
// backend (PlayerProfile.mascotColor + objetos equipados) y esto no se usa.
export const DEMO_PARTY = {
  valeria: { color: '#9C27B0', acc: 'beret', mood: 'happy' },
  ana: { color: '#2B8FD6', acc: 'beret', mood: 'joy' },
  diego: { color: '#E0533D', acc: 'glasses', mood: 'happy' },
  lucia: { color: '#2EA86B', acc: 'book', mood: 'happy' },
  bruno: { color: '#7E57C2', acc: 'beret', mood: 'happy' },
  mateo: { color: '#F28C28', acc: '', mood: 'focus' },
  camila: { color: '#C2185B', acc: '', mood: 'weak' },
};

const normalize = (name = '') => String(name).trim().split(/[\s.@(]/).filter(Boolean)[0]?.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase() ?? '';

/** Mascota de un integrante por nombre o alias ("Lucía Gómez", "@lu.gomez", "Tú (Valeria)"). */
export function demoMascot(nameOrAlias) {
  const raw = String(nameOrAlias ?? '');
  if (/^t[uú]\b/i.test(raw) || /valeria/i.test(raw)) return DEMO_PARTY.valeria;
  const key = normalize(raw.replace(/^@/, ''));
  const alias = { lu: 'lucia', cami: 'camila' }[key] ?? key;
  return DEMO_PARTY[alias] ?? NEUTRAL;
}

// Sin datos: dragón sin accesorios que hereda `--pu` del tema (no se hace pasar por Valeria).
const NEUTRAL = { acc: '', mood: 'happy' };

/**
 * Mascota de una persona, en este orden: lo que mande el backend (`mascot` o `mascotColor`),
 * la party demo del mockup (solo nombres conocidos) o un dragón neutro.
 */
export function mascotFor(person = {}) {
  if (person.mascot) return person.mascot;
  if (person.mascotColor) return { color: person.mascotColor, acc: '', mood: 'happy' };
  return demoMascot(person.fullName ?? person.name ?? person.nombre);
}
