import { useEffect, useState } from 'react';
import { getActivities } from '../api/diarioApi';
import { formatDay, formatTime } from './diarioFormat';

// Hook de 9.1 Listado de actividades (RF028).

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

const emptyFilters = { type: null, origin: null, status: null, range: '7' };

export function useActividades() {
  const [filters, setFilters] = useState(emptyFilters);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // RDF092: cada cambio de filtro vuelve a consultar al servidor
  useEffect(() => {
    setLoading(true);
    setError(null);
    const { type, origin, status, range } = filters;
    getActivities({ type, origin, status, since: sinceFor(RANGES.find((r) => r.key === range).days) })
      .then(setRows)
      .catch(() => setError('No se pudieron cargar tus actividades.'))
      .finally(() => setLoading(false));
  }, [filters]);

  const setFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value }));

  // RDF091: fecha, tipo, origen, estado y puntos de cada actividad
  const view = rows.map((a) => ({
    ...a,
    day: formatDay(a.at),
    time: a.status === 'pendiente' ? 'antes 23:59' : formatTime(a.at),
  }));

  return {
    filters,
    setFilter,
    clearFilters: () => setFilters(emptyFilters),
    rows: view,
    loading,
    error,
  };
}
