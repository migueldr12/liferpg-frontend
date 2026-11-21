import { useEffect, useState } from 'react';
import { getGroupMetrics } from '../api/retosApi';
import { AREAS } from './useRetos';

// Hook de 12.2 Métricas de grupo (RF038): tu cumplimiento vs. el promedio del grupo.

// Mensaje de cada tarjeta según la diferencia contra el grupo
const adviceFor = (key, diff, isBest) => {
  if (isBest && diff > 0) return 'Tu área más fuerte frente al grupo.';
  if (diff > 0) return key === 'cultura'
    ? 'Vas arriba del grupo: buen momento para crear un reto de lectura.'
    : 'Vas arriba del promedio del grupo.';
  if (diff < 0) return 'Estás debajo del promedio. Únete a un reto de esta área.';
  return 'Vas igual que el promedio del grupo.';
};

export function useMetricasGrupo() {
  const [period, setPeriod] = useState('semana');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getGroupMetrics(period)
      .then(setData)
      .catch(() => setError('No se pudieron cargar las métricas.'))
      .finally(() => setLoading(false));
  }, [period]);

  const rows = data
    ? AREAS.map((a) => {
        const { me, group } = data.byType[a.key];
        return { ...a, me, group, diff: me - group };
      })
    : [];
  const best = rows.reduce((top, r) => (!top || r.diff > top.diff ? r : top), null);
  const cards = rows.map((r) => ({ ...r, advice: adviceFor(r.key, r.diff, r === best) }));

  return {
    period,
    setPeriod,
    friendsCount: data?.friendsCount ?? 0,
    rows: cards,
    loading,
    error,
  };
}
