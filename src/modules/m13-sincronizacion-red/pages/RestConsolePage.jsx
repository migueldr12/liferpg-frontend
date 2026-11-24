import React, { useEffect, useMemo, useState } from 'react';
import { adminApiEnabled, useAdminResource } from '../../../api/adminClient';
import { ActionButton, DemoNotice, Segmented, StateBadge } from '../../../shared/components/AdminUI';
import { logsDemo } from '../api/demoData';

const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
const statuses = ['Todos', '2xx', '4xx', '5xx'];

export function RestConsolePage() {
  const [selectedMethods, setSelectedMethods] = useState(methods);
  const [status, setStatus] = useState('Todos');
  const [search, setSearch] = useState('');
  const [paused, setPaused] = useState(false);
  const { data, error, loading, refresh } = useAdminResource('host/logs', logsDemo, paused ? 0 : 5000);
  const [demoEntries, setDemoEntries] = useState(logsDemo);
  const entries = adminApiEnabled ? (Array.isArray(data) ? data : []) : demoEntries;

  useEffect(() => {
    if (adminApiEnabled || paused || demoEntries.length >= 60) return undefined;
    const timer = window.setInterval(() => setDemoEntries((current) => {
      if (current.length >= 60) return current;
      const source = logsDemo[current.length % logsDemo.length];
      const now = new Date();
      return [{ ...source, id: `live-${current.length + 1}`, time: now.toLocaleTimeString('es-MX', { hour12: false }) }, ...current];
    }), 1000);
    return () => window.clearInterval(timer);
  }, [demoEntries.length, paused]);

  const rows = useMemo(() => entries.filter((entry) =>
    selectedMethods.includes(entry.method) && (status === 'Todos' || Math.floor(entry.code / 100) === Number(status[0])) && entry.endpoint.toLowerCase().includes(search.toLowerCase().trim()),
  ), [entries, selectedMethods, status, search]);

  function toggleMethod(next) {
    setSelectedMethods((current) => current.includes(next) ? current.filter((item) => item !== next) : [...current, next]);
  }

  return <>
    <DemoNotice error={error} loading={loading} onRetry={refresh} />
    <div className="console-controls"><span className="console-live"><span className={paused ? 'connection-dot connection-dot--paused' : 'connection-dot'} /> {paused ? 'En pausa' : adminApiEnabled ? 'Actualiza cada 5 s' : `${entries.length}/60 eventos · +1 por segundo`}</span>
      <div className="console-methods" aria-label="Métodos HTTP">{methods.map((item) => <button type="button" key={item} className={selectedMethods.includes(item) ? 'is-active' : ''} aria-pressed={selectedMethods.includes(item)} onClick={() => toggleMethod(item)}>{item}</button>)}</div>
      <Segmented label="Código de estado" options={statuses} value={status} onChange={setStatus} />
      <input className="admin-input console-search" type="search" placeholder="Buscar /api/…" aria-label="Buscar endpoint" value={search} onChange={(event) => setSearch(event.target.value)} />
      <ActionButton variant="secondary" onClick={() => setPaused(!paused)}>{paused ? 'Reanudar' : 'Pausar'}</ActionButton>
    </div>
    <p className="console-count">Mostrando {Math.min(11, rows.length)} de {rows.length} eventos filtrados</p>
    <div className="admin-table-wrap admin-table-wrap--console"><table className="admin-table admin-table--console"><thead><tr><th>HORA</th><th>MÉTODO</th><th>CÓDIGO</th><th>ENDPOINT</th><th>DURACIÓN</th><th>USUARIO</th></tr></thead><tbody>
      {rows.slice(0, 11).map((row) => <tr key={row.id} className={row.code >= 500 ? 'admin-table__error' : row.code >= 400 ? 'admin-table__warning' : ''}><td className="mono">{row.time}</td><td><StateBadge tone={{ GET: 'cyan', POST: 'green', PUT: 'yellow', PATCH: 'purple', DELETE: 'red' }[row.method]}>{row.method}</StateBadge></td><td className={row.code >= 500 ? 'text-red' : row.code >= 400 ? 'text-yellow' : 'text-green'}>{row.code}</td><td className="mono">{row.endpoint}</td><td>{row.ms} ms</td><td>{row.user}</td></tr>)}
      {!rows.length && <tr><td colSpan={6} className="admin-table__empty">No hay peticiones con esos filtros.</td></tr>}
    </tbody></table></div>
  </>;
}
