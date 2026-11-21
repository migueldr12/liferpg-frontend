import React, { useState } from 'react';
import { adminApiEnabled, adminRequest, useAdminResource } from '../../../api/adminClient';
import { ActionButton, DemoNotice, StateBadge } from '../../../shared/components/AdminUI';
import { clientsDemo } from '../api/demoData';

export function ClientsPage() {
  const { data, error, loading, refresh } = useAdminResource('host/clients', clientsDemo, 5000);
  const [actionError, setActionError] = useState('');
  const [revoking, setRevoking] = useState('');
  const clients = Array.isArray(data) ? data : [];
  const count = (kind) => clients.filter((client) => client.client === kind).length;

  async function revoke(id) {
    if (!window.confirm('¿Revocar esta sesión? El dispositivo deberá iniciar sesión de nuevo.')) return;
    setRevoking(id);
    setActionError('');
    try {
      await adminRequest(`host/clients/${encodeURIComponent(id)}`, { method: 'DELETE' });
      await refresh();
    } catch (cause) {
      setActionError(cause.message);
    } finally {
      setRevoking('');
    }
  }

  return <>
    <DemoNotice error={error || actionError} loading={loading} onRetry={refresh} />
    <div className="admin-chips admin-chips--summary"><span>{clients.length} conectados</span><span>{count('App')} App móvil</span><span>{count('PWA')} PWA</span></div>
    <div className="admin-table-wrap"><table className="admin-table admin-table--cards"><thead><tr><th>USUARIO · DISPOSITIVO</th><th>ORIGEN</th><th>CLIENTE</th><th>SESIÓN</th><th>ÚLTIMO ACCESO</th><th><span className="sr-only">Acciones</span></th></tr></thead><tbody>
      {clients.map((client) => <tr key={client.id} className={client.anomalous ? 'admin-table__warning' : ''}><td data-label="USUARIO"><span className="admin-user"><span className="connection-dot" /><span><strong>{client.user}</strong> {client.anomalous && <StateBadge tone="yellow">Acceso anómalo</StateBadge>}<small>{client.device}</small></span></span></td><td data-label="ORIGEN">{client.ip}</td><td data-label="CLIENTE"><StateBadge tone={client.client === 'PWA' ? 'cyan' : 'purple'}>{client.client}</StateBadge></td><td data-label="SESIÓN" className="mono">{client.id}</td><td data-label="ÚLTIMO ACCESO">{client.lastSeen}</td><td data-label="ACCIÓN"><ActionButton variant="danger" disabled={!adminApiEnabled || !!revoking} title={!adminApiEnabled ? 'Disponible al conectar la API' : undefined} onClick={() => revoke(client.id)}>{revoking === client.id ? 'Revocando…' : 'Revocar'}</ActionButton></td></tr>)}
      {!clients.length && <tr><td colSpan={6} className="admin-table__empty">{loading ? 'Cargando sesiones…' : 'No hay clientes conectados.'}</td></tr>}
    </tbody></table></div>
  </>;
}
