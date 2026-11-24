import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWeeklyActivity } from '../api/retosApi';

// Hook de 12.3 Filtros de actividad grupal (RF039): ranking semanal por área.

export function useActividadArea() {
  const navigate = useNavigate();
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

  const max = 100;
  // El referente es el primer lugar que no eres tú
  const leader = ranking.find((r) => !r.isMe) ?? null;

  const congratulate = () => {
    if (!leader) return;
    navigate('/lite/animo/stickers', { state: { recipientId: leader.id, recipient: leader.name } });
  };

  return { area, setArea, ranking, max, leader, congratulate, loading, error, notice };
}
