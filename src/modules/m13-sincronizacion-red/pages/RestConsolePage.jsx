import React, { useState } from 'react';
import { ActionButton, StateBadge } from '../../../shared/components/AdminUI';
import { useHostResource } from '../hooks/useHostResource';

const PAGE_SIZE = 15;

export function RestConsolePage() {
  const [paused, setPaused] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const { data, error, loading, refresh } = useHostResource('logs', paused ? 0 : 5000);
  const rows = data.filter((event) => event.path.toLowerCase().includes(search.toLowerCase().trim()));
  const lastPage = Math.max(0, Math.ceil(rows.length / PAGE_SIZE) - 1);
  const current = Math.min(page, lastPage);
  const start = current * PAGE_SIZE;
  const visibleRows = rows.slice(start, start + PAGE_SIZE);
  return <>
    <p>Últimas 200 peticiones de este proceso. Los eventos se pierden al reiniciar y no incluyen parámetros ni identificadores.</p>
    {error && <p role="alert">{error}</p>}
    {loading && <p role="status">Cargando eventos…</p>}
    <div className="console-controls">
      <label className="console-search">Buscar por ruta<input className="admin-input" type="search" placeholder="Ej. /api/v1/estado" value={search} onChange={(event) => { setSearch(event.target.value); setPage(0); }} /></label>
      <ActionButton variant="secondary" onClick={() => setPaused(!paused)}>{paused ? 'Reanudar actualización automática' : 'Pausar actualización automática'}</ActionButton>
      <ActionButton variant="secondary" onClick={refresh}>Actualizar</ActionButton>
    </div>
    <div className="admin-table-wrap" tabIndex={0} role="region" aria-label="Peticiones registradas"><table className="admin-table admin-table--console admin-table--cards">
      <thead><tr><th>HORA</th><th>MÉTODO</th><th>CÓDIGO</th><th>RUTA</th><th>DURACIÓN</th></tr></thead>
      <tbody>{visibleRows.map((row, index) => <tr key={`${row.time}-${index}`}>
        <td data-label="Hora">{new Date(row.time).toLocaleTimeString('es-MX')}</td><td data-label="Método"><StateBadge>{row.method}</StateBadge></td>
        <td data-label="Código">{row.statusCode}</td><td className="mono" data-label="Ruta">{row.path}</td><td data-label="Duración">{row.durationMs} ms</td>
      </tr>)}{!loading && !error && !rows.length && <tr><td className="admin-table__empty" colSpan={5}>{search.trim() ? 'No hay peticiones que coincidan con la búsqueda.' : 'Todavía no hay peticiones registradas.'}</td></tr>}</tbody>
    </table></div>
    {lastPage > 0 && <nav className="console-pagination" aria-label="Páginas de la consola">
      <ActionButton variant="secondary" disabled={current === 0} onClick={() => setPage(current - 1)}>Anterior</ActionButton>
      <span role="status">{start + 1}–{Math.min(start + PAGE_SIZE, rows.length)} de {rows.length}</span>
      <ActionButton variant="secondary" disabled={current === lastPage} onClick={() => setPage(current + 1)}>Siguiente</ActionButton>
    </nav>}
  </>;
}
