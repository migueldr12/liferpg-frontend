import React, { useMemo, useState } from 'react';
import { adminApiEnabled, useAdminResource } from '../../../api/adminClient';
import { ActionButton, DemoNotice, Segmented, StateBadge } from '../../../shared/components/AdminUI';
import { logsDemo } from '../api/demoData';

const methods = ['Todos', 'GET', 'POST', 'PUT', 'DELETE'];
const statuses = ['Todos', '2xx', '4xx', '5xx'];

export function RestConsolePage() {
  const [method, setMethod] = useState('Todos');
  const [status, setStatus] = useState('Todos');
  const [search, setSearch] = useState('');
  const [paused, setPaused] = useState(false);
  const { data, error, loading, refresh } = useAdminResource('host/logs', logsDemo, paused ? 0 : 5000);
  const entries = Array.isArray(data) ? data : [];
  const rows = useMemo(() => entries.filter((entry) =>
    (method === 'Todos' || entry.method === method) && (status === 'Todos' || Math.floor(entry.code / 100) === Number(status[0])) && entry.endpoint.toLowerCase().includes(search.toLowerCase().trim()),
  ), [entries, method, status, search]);

  return <>
    <DemoNotice error={error} loading={loading} onRetry={refresh} />
    <div className="console-controls"><span className="console-live"><span className="connection-dot" /> {adminApiEnabled && !paused ? 'Actualiza cada 5 s' : 'Consola de ejemplo'}</span>
      <Segmented label="Método HTTP" options={methods} value={method} onChange={setMethod} />
      <Segmented label="Código de estado" options={statuses} value={status} onChange={setStatus} />
      <input className="admin-input console-search" type="search" placeholder="Buscar /api/…" aria-label="Buscar endpoint" value={search} onChange={(event) => setSearch(event.target.value)} />
      <ActionButton variant="secondary" disabled={!adminApiEnabled} onClick={() => setPaused(!paused)}>{paused ? 'Reanudar' : 'Pausar'}</ActionButton>
    </div>
    <div className="admin-table-wrap admin-table-wrap--console"><table className="admin-table admin-table--console"><thead><tr><th>HORA</th><th>MÉTODO</th><th>CÓDIGO</th><th>ENDPOINT</th><th>DURACIÓN</th><th>USUARIO</th></tr></thead><tbody>
      {rows.map((row) => <tr key={row.id} className={row.code >= 500 ? 'admin-table__error' : row.code >= 400 ? 'admin-table__warning' : ''}><td className="mono">{row.time}</td><td><StateBadge tone={{ GET: 'cyan', POST: 'green', PUT: 'yellow', DELETE: 'red' }[row.method]}>{row.method}</StateBadge></td><td className={row.code >= 500 ? 'text-red' : row.code >= 400 ? 'text-yellow' : 'text-green'}>{row.code}</td><td className="mono">{row.endpoint}</td><td>{row.ms} ms</td><td>{row.user}</td></tr>)}
      {!rows.length && <tr><td colSpan={6} className="admin-table__empty">No hay peticiones con esos filtros.</td></tr>}
    </tbody></table></div>
  </>;
}
