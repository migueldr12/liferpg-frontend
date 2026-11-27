import { useCallback, useEffect, useState } from 'react';
import { http } from '../../../api/httpClient';

export function useNotificationsResource(path) {
  const [state, setState] = useState({ data: null, loading: true, error: '' });
  const [version, setVersion] = useState(0);
  const refresh = useCallback(() => setVersion((current) => current + 1), []);
  useEffect(() => {
    let active = true;
    setState({ data: null, loading: true, error: '' });
    http(path).then((data) => { if (active) setState({ data, loading: false, error: '' }); })
      .catch((error) => { if (active) setState({ data: null, loading: false, error: error.message }); });
    return () => { active = false; };
  }, [path, version]);
  return { ...state, refresh };
}
