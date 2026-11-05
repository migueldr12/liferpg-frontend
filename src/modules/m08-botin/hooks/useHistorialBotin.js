import { useEffect, useState } from 'react';
import { getFriends, getHistory } from '../api/botinApi';
import { formatWhen } from './botinFormat';

// Hook de 8.3 Historial de botín (RF026): regalos enviados y recibidos con filtros.

export const DIRECTIONS = [
  { key: null, label: 'Todos' },
  { key: 'enviado', label: 'Enviados' },
  { key: 'recibido', label: 'Recibidos' },
];

export const RANGES = [
  { key: '7', label: '7 días', days: 7 },
  { key: '30', label: '30 días', days: 30 },
  { key: 'todo', label: 'Todo', days: null },
];

// Fecha desde la que se consulta, al inicio del día
const sinceFor = (days) => {
  if (days == null) return null;
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - days);
  return d.toISOString();
};

export function useHistorialBotin() {
  const [friends, setFriends] = useState([]);
  const [direction, setDirection] = useState(null);
  const [friendId, setFriendId] = useState(null);
  const [range, setRange] = useState('todo');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getFriends().then(setFriends).catch(() => {});
  }, []);

  // RDF087: amigo y rango se filtran en el servidor; la dirección en la vista,
  // para poder mostrar cuántos hay de cada tipo
  useEffect(() => {
    setLoading(true);
    setError(null);
    getHistory({ friendId, since: sinceFor(RANGES.find((r) => r.key === range).days) })
      .then(setRows)
      .catch(() => setError('No se pudo cargar el historial.'))
      .finally(() => setLoading(false));
  }, [friendId, range]);

  const counts = {
    todos: rows.length,
    enviado: rows.filter((r) => r.direction === 'enviado').length,
    recibido: rows.filter((r) => r.direction === 'recibido').length,
  };

  // RDF086: cada movimiento con fecha, objeto, amigo y mensaje
  const visible = rows
    .filter((r) => !direction || r.direction === direction)
    .map((r) => ({ ...r, when: formatWhen(r.at) }));

  return {
    friends,
    direction,
    setDirection,
    friendId,
    setFriendId,
    range,
    setRange,
    counts,
    rows: visible,
    loading,
    error,
  };
}
