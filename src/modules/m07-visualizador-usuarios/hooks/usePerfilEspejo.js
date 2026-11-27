import { useState, useEffect } from 'react';
import { getParty, getPerfilEspejo } from '../api/amigos.api';

export function usePerfilEspejo(friendId) {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    async function load() {
      try {
        let targetId = friendId;
        // Si entró directo desde la pestaña "Perfil espejo" sin :friendId en la URL, carga el primer amigo
        if (!targetId) {
          const party = await getParty();
          targetId = party.amigos?.[0]?.id;
        }
        if (!targetId) {
          if (!cancelled) setPerfil(null);
          return;
        }
        const data = await getPerfilEspejo(targetId);
        if (!cancelled) setPerfil(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [friendId]);

  return { perfil, loading, error };
}