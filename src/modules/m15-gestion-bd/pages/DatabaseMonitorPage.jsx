import React, { useEffect, useState } from 'react';
import { adminApiEnabled, adminRequest, useAdminResource } from '../../../api/adminClient';
import { ActionButton, DemoNotice, Meter, StateBadge, StatCard, Surface } from '../../../shared/components/AdminUI';
import { applyDemoMigrations, databaseDemo, subscribeDatabaseDemo } from '../api/demoData';

const numberFormat = new Intl.NumberFormat('es-MX');

export function DatabaseMonitorPage() {
  const { data, error, loading, refresh } = useAdminResource('data/status', databaseDemo, 10000);
  const [actionError, setActionError] = useState('');
  const [busy, setBusy] = useState(false);
  const [, setDemoRevision] = useState(0);
  const [terminal, setTerminal] = useState(['$ dotnet ef migrations list', '✓ 20261003_DiarioActividades', '○ 20261012_RetosGrupales · pendiente', '○ 20261015_IndicesLogs · pendiente']);
  const db = data ?? {};
  const tables = db.tables ?? [];
  const migrations = db.migrations ?? [];
  const pending = migrations.filter((migration) => migration.pending).length;
  const maxCount = Math.max(1, ...tables.map((table) => table.count));

  useEffect(() => adminApiEnabled ? undefined : subscribeDatabaseDemo(() => setDemoRevision((value) => value + 1)), []);

  async function applyMigrations() {
    if (!window.confirm(`¿Aplicar ${pending} migraciones pendientes?`)) return;
    setBusy(true);
    setActionError('');
    try {
      setTerminal((lines) => [...lines, '$ dotnet ef database update', 'Aplicando migraciones…']);
      if (adminApiEnabled) {
        await adminRequest('data/migrations', { method: 'POST' });
        await refresh();
      } else {
        await new Promise((resolve) => window.setTimeout(resolve, 900));
        applyDemoMigrations();
        setTerminal((lines) => [...lines.slice(0, -1), '✓ 20261012_RetosGrupales', '✓ 20261015_IndicesLogs', 'Base de datos actualizada correctamente.']);
      }
    } catch (cause) {
      setActionError(cause.message);
    } finally {
      setBusy(false);
    }
  }

  return <>
    <DemoNotice error={error || actionError} loading={loading} onRetry={refresh} />
    <div className="admin-stats">
      <StatCard label="CONEXIÓN" value={db.connected ? 'Conectada' : 'Sin datos'} detail={`Pool ${db.pool ?? '—'} · SSL`} tone={db.connected ? 'green' : 'red'} />
      <StatCard label="LATENCIA" value={db.latencyMs == null ? '—' : `${db.latencyMs} ms`} detail="SELECT 1 · consulta de estado" />
      <StatCard label="MOTOR" value={db.engine ?? '—'} detail={db.host ?? '—'} />
      <StatCard label="TAMAÑO" value={db.sizeGb == null ? '—' : `${db.sizeGb} GB`} detail={`de ${db.capacityGb ?? '—'} GB asignados`} />
    </div>
    <div className="admin-columns admin-columns--database">
      <Surface title="Tablas principales" action={<span className="admin-muted">REGISTROS</span>}>
        <div className="table-meters">{tables.map((table) => <div className="table-meters__row" key={table.name}><span>{table.name}</span><Meter value={Math.sqrt(table.count / maxCount) * 100} tone={table.name === 'LogsPeticiones' ? 'yellow' : 'cyan'} /><strong>{numberFormat.format(table.count)}</strong></div>)}</div>
      </Surface>
      <Surface title="Migraciones EF" action={<StateBadge tone={pending ? 'yellow' : 'green'}>{pending} pendientes</StateBadge>}>
        <div className="migration-list">{migrations.map((migration) => <div className={`migration-item ${migration.pending ? 'migration-item--pending' : ''}`} key={migration.name}><span className="connection-dot" /><span className="mono">{migration.name}</span><small>{migration.pending ? 'pendiente' : migration.date}</small></div>)}</div>
        <pre className="migration-terminal" aria-live="polite">{terminal.join('\n')}</pre>
        <ActionButton disabled={!pending || busy} onClick={applyMigrations}>{busy ? 'Aplicando…' : `Aplicar ${pending} migraciones`}</ActionButton>
      </Surface>
    </div>
  </>;
}
