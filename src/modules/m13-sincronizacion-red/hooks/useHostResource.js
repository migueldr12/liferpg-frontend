import { useCallback, useEffect, useState } from 'react';
import { http } from '../../../api/httpClient';

export function useHostResource(resource, interval = 0) {
  const [state, setState] = useState({ data: [], loading: true, error: '' });
  const [version, setVersion] = useState(0);
  const refresh = useCallback(() => setVersion((value) => value + 1), []);
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const data = await http(`/admin/host/${resource}`);
        if (active) setState({ data, loading: false, error: '' });
      } catch (error) {
        if (active) setState((current) => ({ ...current, loading: false, error: error.message }));
      }
    }
    load();
    const timer = interval ? window.setInterval(load, interval) : null;
    return () => { active = false; if (timer) window.clearInterval(timer); };
  }, [resource, interval, version]);
  return { ...state, refresh };
}
