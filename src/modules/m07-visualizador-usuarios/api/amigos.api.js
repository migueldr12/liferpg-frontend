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

  return {
    id: friendId || 'diego.r',
    soloLectura: true,
    nombre: 'Diego Ramírez',
    alias: '@diego.r',
    mascota: {
      nombre: 'Chispa',
      especie: DEMO_PARTY?.diego?.pet || 'dragon',
      color: DEMO_PARTY?.diego?.color || 'rojo',
      equipped: DEMO_PARTY?.diego?.equipped || [],
    },
    amigosDesde: 'ago 2026',
    nivel: 12,
    siguienteNivel: 13,
    xp: 860,
    nextLevelXp: 1400,
    xpPorcentaje: 61,
    estadisticas: { cultura: 640, fisico: 820, enfoque: 410 },
    racha: { actual: 12, mejor: 21 },
    ropaEquipada: ['Lentes de lector', 'Bufanda roja'],
  };
}