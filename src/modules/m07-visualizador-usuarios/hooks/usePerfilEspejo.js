import { useState, useEffect } from 'react';
import { getMiPerfilEspejo, getPerfilEspejo } from '../api/amigos.api';

export function usePerfilEspejo(friendId) {
  const [state, setState] = useState(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const request = friendId ? getPerfilEspejo(friendId) : getMiPerfilEspejo();
    request.then((perfil) => { if (!cancelled) setState({ friendId, version, perfil }); })
      .catch((error) => { if (!cancelled) setState({ friendId, version, error }); });
    return () => {
      cancelled = true;
    };
  }, [friendId, version]);

  const ready = state?.friendId === friendId && state?.version === version;
  return { perfil: ready ? state.perfil : null, error: ready ? state.error : null, loading: !ready, retry: () => setVersion((current) => current + 1) };
}
