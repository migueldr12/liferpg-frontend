import { useEffect, useState } from 'react';
import { getGroupMetrics } from '../api/retosApi';
import { AREAS } from './useRetos';

// Hook de 12.2 Métricas de grupo (RF038): tu cumplimiento vs. el promedio del grupo.

// Mensaje de cada tarjeta según la diferencia contra el grupo
const adviceFor = (key, diff, isBest, row, period) => {
  if (row.me === null && row.group === null) return 'Aún no hay actividad en esta área.';
  if (row.group === null) return 'Tus amigos aún no tienen actividad en esta área.';
  if (row.me === null) return 'Aún no tienes actividad aquí. Únete a un reto de esta área.';
  if (period === 'mes') {
    if (key === 'cultura') return 'Constante todo el mes.';
    if (key === 'fisico') return 'Casi al nivel del grupo: una salida más por semana lo iguala.';
    return 'Le sacas ventaja al grupo de forma sostenida.';
  }
  if (isBest && diff > 0) return key === 'enfoque' ? 'Tu área más fuerte frente al grupo.' : 'Tu mejor ventaja frente al grupo en este periodo.';
  if (diff > 0) return key === 'cultura'
    ? 'Vas arriba del grupo: buen momento para crear un reto de lectura.'
    : 'Vas arriba del promedio del grupo.';
  if (diff < 0) return key === 'fisico'
    ? 'Estás debajo del promedio. Únete al reto de 100 km.'
    : 'Estás debajo del promedio. Únete a un reto de esta área.';
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
        // null = sin datos en esa área: la barra queda en 0 y el texto en "—"
        const { me, group } = data.byType[a.key];
        return {
          ...a,
          me: me ?? 0,
          group: group ?? 0,
          meText: me === null ? '—' : `${me}%`,
          groupText: group === null ? '—' : `${group}%`,
          diff: me !== null && group !== null ? me - group : 0,
          hasData: me !== null && group !== null,
          raw: { me, group },
        };
      })
    : [];
  const best = rows.filter((r) => r.hasData).reduce((top, r) => (!top || r.diff > top.diff ? r : top), null);
  const cards = rows.map((r) => ({ ...r, advice: adviceFor(r.key, r.diff, r === best, r.raw, period) }));

  return {
    period,
    setPeriod,
    friendsCount: data?.friendsCount ?? 0,
    rows: cards,
    loading,
    error,
  };
}
