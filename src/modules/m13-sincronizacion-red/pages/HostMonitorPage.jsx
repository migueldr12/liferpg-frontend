import React, { useEffect, useState } from 'react';
import { adminApiEnabled, useAdminResource } from '../../../api/adminClient';
import { ActionButton, DemoNotice, Segmented, StateBadge, StatCard, Surface } from '../../../shared/components/AdminUI';
import { hostDemo, lanHostDemo } from '../api/demoData';

export function HostMonitorPage() {
  const [period, setPeriod] = useState(10);
  const [deployment, setDeployment] = useState('Nube');
  const [countdown, setCountdown] = useState(period);
  const [demoSamples, setDemoSamples] = useState(hostDemo.latency);
  const { data, error, loading, refresh } = useAdminResource('host/monitor', hostDemo, period * 1000);
  const host = adminApiEnabled ? (data ?? {}) : deployment === 'Nube' ? hostDemo : lanHostDemo;
  const samples = adminApiEnabled ? (host.latency ?? []) : demoSamples;
  const max = Math.max(1, ...samples);

  useEffect(() => {
    if (adminApiEnabled) return undefined;
    setCountdown(period);
    const timer = window.setInterval(() => setCountdown((value) => {
      if (value > 1) return value - 1;
      setDemoSamples((current) => [...current.slice(-29), Math.max(5, Math.round(current.at(-1) + (Math.random() - 0.5) * 18))]);
      return period;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [period, deployment]);

  function changeDeployment(next) {
    setDeployment(next);
    setDemoSamples((next === 'Nube' ? hostDemo : lanHostDemo).latency);
  }

  return <>
    <DemoNotice error={error} loading={loading} onRetry={refresh} />
    <div className="admin-stats">
      <StatCard label="ESTADO API" value={host.status ?? 'Sin datos'} detail="GET /api/health" tone={host.status === 'En línea' ? 'green' : 'red'} />
      <StatCard label="VERSIÓN" value={host.version ?? '—'} detail="Versión del backend" />
      <StatCard label="ENTORNO" value={host.environment ?? '—'} detail={host.platform ?? '—'} />
      <StatCard label="UPTIME" value={host.uptime ?? '—'} detail="Desde el último arranque" />
    </div>
    <div className="admin-columns admin-columns--host">
      <Surface title="Despliegue" action={adminApiEnabled ? <StateBadge tone="cyan">{host.deployment ?? '—'}</StateBadge> : <Segmented label="Despliegue" options={['Nube', 'LAN']} value={deployment} onChange={changeDeployment} />}>
        <div className="admin-detail"><span>Dirección</span><strong>{host.address || 'No informada'}</strong></div>
        <div className="admin-detail"><span>Entorno</span><strong>{host.platform ?? '—'}</strong></div>
        <div className="admin-detail"><span>Región / red</span><strong>{host.region ?? '—'}</strong></div>
        <p className="admin-label">PUERTOS EN USO</p>
        <div className="admin-chips"><span>{host.httpsPort ?? '—'} HTTPS</span><span>{host.realtimePort ?? '—'} SignalR</span></div>
        <p className="admin-hint">El modo de despliegue refleja la configuración enviada por la API.</p>
      </Surface>
      <Surface title="Latencia del health check" subtitle="Últimas 30 consultas a /api/health" action={<div className="admin-chart-action"><span>{adminApiEnabled ? `Actualiza cada ${period} s` : `Siguiente muestra en ${countdown} s`}</span><Segmented label="Intervalo de actualización" options={[5, 10, 30].map((value) => ({ value, label: `${value} s` }))} value={period} onChange={setPeriod} /></div>}>
        <div className="admin-bars" role="img" aria-label="Historial de latencia en milisegundos">{samples.map((sample, index) => <span key={index} className={sample > 100 ? 'admin-bars__outlier' : ''} style={{ height: `${Math.max(8, sample / max * 100)}%` }} title={`${sample} ms`} />)}</div>
        <div className="admin-bars__legend"><span>Actual <strong>{samples.at(-1) ?? '—'} ms</strong></span><span>Promedio <strong>{samples.length ? Math.round(samples.reduce((sum, value) => sum + value, 0) / samples.length) : '—'} ms</strong></span><span>Máx. <strong>{samples.length ? max : '—'} ms</strong></span></div>
      </Surface>
    </div>
    {adminApiEnabled && <ActionButton variant="secondary" onClick={() => refresh()} disabled={loading}>Actualizar ahora</ActionButton>}
  </>;
}
