import { useEffect, useState } from 'react';
import { getWeeklyActivity, sendCongrats } from '../api/retosApi';

// Hook de 12.3 Filtros de actividad grupal (RF039): ranking semanal por área.

export function useActividadArea() {
  const [area, setArea] = useState('cultura');
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setNotice(null);
    getWeeklyActivity(area)
      .then(setRanking)
      .catch(() => setError('No se pudo cargar la actividad del grupo.'))
      .finally(() => setLoading(false));
  }, [area]);

  const max = Math.max(...ranking.map((r) => r.points), 1);
  // El referente es el primer lugar que no eres tú
  const leader = ranking.find((r) => !r.isMe) ?? null;

  const congratulate = async () => {
    if (!leader) return;
    const { to } = await sendCongrats(leader.id);
    setNotice(`Le enviaste un sticker de felicitación a ${to}.`);
  };

  return { area, setArea, ranking, max, leader, congratulate, loading, error, notice };
}
