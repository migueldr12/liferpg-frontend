import { usaApi } from '../../../config/env';
import { http } from '../../../api/httpClient';
import { DEMO_PARTY } from '../../../shared/assets/demoParty';

const real = usaApi('visualizador');

const MOCK_AMIGOS = [
  { id: 'diego.r', nombre: 'Diego Ramírez', alias: '@diego.r', nivel: 12, racha: 12, estado: 'hace 2 h', actividad: 2, pet: 'dragon', stats: { cultura: 64, fisico: 82, enfoque: 41 } },
  { id: 'ana.t', nombre: 'Ana Torres', alias: '@ana.t', nivel: 17, racha: 21, estado: 'en línea', actividad: 0, pet: 'gato', stats: { cultura: 88, fisico: 45, enfoque: 73 } },
  { id: 'mateo', nombre: 'Mateo Silva', alias: '@mateo', nivel: 9, racha: 3, estado: 'ayer', actividad: 4, pet: 'hamster', stats: { cultura: 30, fisico: 62, enfoque: 25 } },
  { id: 'lu.gomez', nombre: 'Lucía Gómez', alias: '@lu.gomez', nivel: 21, racha: 34, estado: 'en línea', actividad: 1, pet: 'leon', stats: { cultura: 76, fisico: 70, enfoque: 90 } },
  { id: 'cami', nombre: 'Camila Ortiz', alias: '@cami', nivel: 6, racha: 0, estado: 'hace 4 días', actividad: 5, pet: 'perro', stats: { cultura: 22, fisico: 10, enfoque: 18 } },
  { id: 'bruno.p', nombre: 'Bruno Paz', alias: '@bruno.p', nivel: 15, racha: 8, estado: 'hace 5 h', actividad: 3, pet: 'leon', stats: { cultura: 50, fisico: 77, enfoque: 60 } },
];

function mapAmigoToCard(item) {
  return {
    ...item,
    pet: item.pet || (item.species ? item.species.toLowerCase() : 'dragon'),
    mascot: item.mascot ?? { pet: item.species?.toLowerCase(), color: item.mascotColor },
  };
}

export async function getParty({ q = '', sort = 'nivel' } = {}) {
  if (real) {
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (sort) params.set('sort', sort);
    const data = await http(`/visualizador-usuarios/party?${params.toString()}`);
    return {
      total: data.total ?? 0,
      limite: data.limite ?? 30,
      amigos: (data.amigos || []).map(mapAmigoToCard),
    };
  }

  const query = q.trim().toLocaleLowerCase('es');
  const filtrados = MOCK_AMIGOS
    .filter((a) => `${a.nombre} ${a.alias}`.toLocaleLowerCase('es').includes(query))
    .sort((a, b) => (sort === 'actividad' ? a.actividad - b.actividad : b[sort] - a[sort]));

  return { total: MOCK_AMIGOS.length, limite: 30, amigos: filtrados };
}

export async function eliminarAmigo(friendId) {
  if (real) {
    return http(`/visualizador-usuarios/party/${friendId}`, { method: 'DELETE' });
  }
  return { removed: true, friendId };
}

export async function getPerfilEspejo(friendId) {
  if (real) {
    return http(`/visualizador-usuarios/perfil-espejo/${friendId}`);
  }

  const friend = MOCK_AMIGOS.find(({ id }) => id === friendId);
  if (!friend) throw new Error('No encontramos ese perfil de amigo.');
  const mascot = DEMO_PARTY[friendId.split('.')[0]];
  return {
    id: friend.id,
    soloLectura: true,
    nombre: friend.nombre,
    alias: friend.alias,
    mascota: {
      especie: mascot?.pet || friend.pet,
      color: mascot?.color,
    },
    amigosDesde: 'ago 2026',
    nivel: friend.nivel,
    estadisticas: friend.stats,
    racha: { actual: friend.racha },
  };
}

export async function getMiPerfilEspejo() {
  const [identity, pet, points, streak] = await Promise.allSettled([
    http('/usuarios/me'), http('/tamagotchi'), http('/usuarios/me/puntos'),
    http(`/resumen-progreso/racha?utcOffset=${new Date().getTimezoneOffset()}`),
  ]);
  if (identity.status === 'rejected') throw identity.reason;
  const mascot = pet.value;
  const equipment = Object.entries(mascot?.equipped ?? {})
    .filter(([slot, item]) => slot.toLowerCase() !== 'fondo' && typeof item === 'string' && !/^(ninguno|vacío|vacío\s*\/\s*ninguno)$/i.test(item.trim()));
  return {
    nombre: identity.value.displayName,
    nivel: mascot?.level,
    xp: mascot?.xp,
    nextLevelXp: mascot?.xpForNextLevel ?? mascot?.xpNextLevel,
    mascota: mascot ? { nombre: mascot.name, titulo: mascot.title, especie: mascot.species, color: mascot.color, equipped: Object.values(mascot.equipped ?? {}) } : null,
    estadisticas: points.value,
    racha: streak.value ? { actual: streak.value.rachaActual, mejor: streak.value.mejorRacha } : null,
    ropaEquipada: mascot ? equipment.map(([, item]) => item) : null,
    incompleto: [pet, points, streak].some((part) => part.status === 'rejected'),
  };
}
