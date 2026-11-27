import React, { useCallback, useEffect, useState } from 'react';
import { API_URL } from '../../../config/env';
import { ActionButton, StatCard } from '../../../shared/components/AdminUI';
import { InactivityReview } from '../components/InactivityReview';

export function HostMonitorPage() {
  const [state, setState] = useState({ data: null, error: '', loading: true });
  const check = useCallback(async () => {
    setState((current) => ({ ...current, loading: true }));
    try {
      const response = await fetch(`${API_URL}/estado`);
      const data = await response.json();
      setState({ data, error: response.ok ? '' : 'La API responde, pero la base de datos no está disponible.', loading: false });
    } catch {
      setState({ data: null, error: 'No se pudo conectar con el servidor.', loading: false });
    }
  }, []);
  useEffect(() => {
    check();
    const timer = window.setInterval(check, 30000);
    return () => window.clearInterval(timer);
  }, [check]);
  const { data, error, loading } = state;
  return <>
    {error && <p role="alert">{error}</p>}
    {loading && <p role="status">Consultando el servidor…</p>}
    <div className="admin-stats">
      <StatCard label="ESTADO API" value={data ? 'En línea' : 'Sin conexión'} detail="GET /estado" />
      <StatCard label="MONGODB" value={data?.database ?? 'Sin datos'} detail="Conexión a la base de datos" />
      <StatCard label="VERSIÓN" value={data?.version ?? '—'} detail={data?.environment ?? '—'} />
      <StatCard label="UPTIME" value={data ? `${data.uptimeSeconds} s` : '—'} detail="Desde el último arranque" />
    </div>
    <ActionButton variant="secondary" onClick={check} disabled={loading}>Actualizar ahora</ActionButton>
    <InactivityReview />
  </>;
}
