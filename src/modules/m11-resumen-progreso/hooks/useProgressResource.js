import { useEffect, useState } from 'react';
import { http } from '../../../api/httpClient';

// Las fechas de M11 se interpretan con el desfase horario del navegador.
export function useProgressResource(path) {
  const [state, setState] = useState({ data: null, loading: true, error: '' });

  useEffect(() => {
    let active = true;
    setState({ data: null, loading: true, error: '' });
    const separator = path.includes('?') ? '&' : '?';
    http(`/resumen-progreso/${path}${separator}utcOffset=${new Date().getTimezoneOffset()}`)
      .then((data) => { if (active) setState({ data, loading: false, error: '' }); })
      .catch((error) => { if (active) setState({ data: null, loading: false, error: error.message }); });
    return () => { active = false; };
  }, [path]);

  return state;
}
