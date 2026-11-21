import React, { useState } from 'react';
import { adminApiEnabled, useAdminResource } from '../../../api/adminClient';
import { ActionButton, DemoNotice, Segmented, StateBadge, StatCard, Surface } from '../../../shared/components/AdminUI';
import { hostDemo } from '../api/demoData';

export function HostMonitorPage() {
  const [period, setPeriod] = useState(10);
  const { data, error, loading, refresh } = useAdminResource('host/monitor', hostDemo, period * 1000);
  const host = data ?? {};
  const samples = host.latency ?? [];
  const max = Math.max(1, ...samples);

  return <>
    <DemoNotice error={error} loading={loading} onRetry={refresh} />
    <div className="admin-stats">
      <StatCard label="ESTADO API" value={host.status ?? 'Sin datos'} detail="GET /api/health" tone={host.status === 'En línea' ? 'green' : 'red'} />
      <StatCard label="VERSIÓN" value={host.version ?? '—'} detail="Versión del backend" />
      <StatCard label="ENTORNO" value={host.environment ?? '—'} detail={host.platform ?? '—'} />
      <StatCard label="UPTIME" value={host.uptime ?? '—'} detail="Desde el último arranque" />
    </div>
    <div className="admin-columns admin-columns--host">
      <Surface title="Despliegue" action={<StateBadge tone="cyan">{host.deployment ?? '—'}</StateBadge>}>
        <div className="admin-detail"><span>Dirección</span><strong>{host.address || 'No informada'}</strong></div>
        <div className="admin-detail"><span>Entorno</span><strong>{host.platform ?? '—'}</strong></div>
        <p className="admin-label">PUERTOS EN USO</p>
        <div className="admin-chips"><span>{host.httpsPort ?? '—'} HTTPS</span><span>{host.realtimePort ?? '—'} SignalR</span></div>
        <p className="admin-hint">El modo de despliegue refleja la configuración enviada por la API.</p>
      </Surface>
      <Surface title="Latencia del health check" subtitle="Últimas consultas a /api/health" action={<div className="admin-chart-action"><span>{adminApiEnabled ? `Actualiza cada ${period} s` : 'Vista de muestra'}</span><Segmented label="Intervalo de actualización" options={[5, 10, 30].map((value) => ({ value, label: `${value} s` }))} value={period} onChange={setPeriod} /></div>}>
        <div className="admin-bars" role="img" aria-label="Historial de latencia en milisegundos">{samples.map((sample, index) => <span key={index} className={sample > 100 ? 'admin-bars__outlier' : ''} style={{ height: `${Math.max(8, sample / max * 100)}%` }} title={`${sample} ms`} />)}</div>
        <div className="admin-bars__legend"><span>Actual <strong>{samples.at(-1) ?? '—'} ms</strong></span><span>Promedio <strong>{samples.length ? Math.round(samples.reduce((sum, value) => sum + value, 0) / samples.length) : '—'} ms</strong></span><span>Máx. <strong>{samples.length ? max : '—'} ms</strong></span></div>
      </Surface>
    </div>
    {adminApiEnabled && <ActionButton variant="secondary" onClick={() => refresh()} disabled={loading}>Actualizar ahora</ActionButton>}
  </>;
}
