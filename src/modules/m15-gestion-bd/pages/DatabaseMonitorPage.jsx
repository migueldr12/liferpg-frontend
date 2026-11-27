import React, { useCallback, useEffect, useState } from 'react';
import { API_URL } from '../../../config/env';
import { ActionButton, StatCard, Surface } from '../../../shared/components/AdminUI';

export function DatabaseMonitorPage() {
  const [state, setState] = useState({ data: null, loading: true, error: '' });
  const check = useCallback(async () => {
    setState((current) => ({ ...current, loading: true }));
    try {
      const response = await fetch(`${API_URL}/estado`);
      const data = await response.json();
      setState({ data, loading: false, error: response.ok ? '' : 'La API no puede conectar con MongoDB.' });
    } catch {
      setState({ data: null, loading: false, error: 'No se pudo conectar con el servidor.' });
    }
  }, []);
  useEffect(() => { check(); }, [check]);
  return <>
    {state.loading && <p role="status">Consultando la conexión…</p>}
    {state.error && <p role="alert">{state.error}</p>}
    <div className="admin-stats"><StatCard label="MONGODB" value={state.data?.database ?? 'Sin datos'} detail="Conectividad desde la API" /></div>
    <Surface title="Diagnóstico"><p>El estado indica si la API puede conectarse a la base de datos. El diagnóstico de colecciones e índices se ejecuta con <code>pnpm db:check</code> en el servidor.</p></Surface>
    <ActionButton variant="secondary" onClick={check} disabled={state.loading}>Actualizar</ActionButton>
  </>;
}
