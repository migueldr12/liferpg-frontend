import React, { useState } from 'react';
import { adminApiEnabled, adminRequest, useAdminResource } from '../../../api/adminClient';
import { ActionButton, DemoNotice, StateBadge } from '../../../shared/components/AdminUI';
import { clientsDemo } from '../api/demoData';

export function ClientsPage() {
  const { data, error, loading, refresh } = useAdminResource('host/clients', clientsDemo, 5000);
  const [actionError, setActionError] = useState('');
  const [revoking, setRevoking] = useState('');
  const [confirming, setConfirming] = useState('');
  const [revoked, setRevoked] = useState([]);
  const clients = Array.isArray(data) ? data : [];
  const activeClients = clients.filter((client) => !revoked.includes(client.id));
  const count = (kind) => activeClients.filter((client) => client.client === kind).length;

  async function revoke(id) {
    setRevoking(id);
    setActionError('');
    try {
      if (adminApiEnabled) {
        await adminRequest(`host/clients/${encodeURIComponent(id)}`, { method: 'DELETE' });
        await refresh();
      }
      setRevoked((current) => [...current, id]);
      setConfirming('');
    } catch (cause) {
      setActionError(cause.message);
    } finally {
      setRevoking('');
    }
  }

  return <>
    <DemoNotice error={error || actionError} loading={loading} onRetry={refresh} />
    <div className="admin-chips admin-chips--summary"><span>{activeClients.length} conectados</span><span>{count('App')} App móvil</span><span>{count('PWA')} PWA</span>{revoked.length > 0 && <span>{revoked.length} revocada(s)</span>}</div>
    <div className="admin-table-wrap"><table className="admin-table admin-table--cards"><thead><tr><th>USUARIO · DISPOSITIVO</th><th>ORIGEN</th><th>CLIENTE</th><th>SESIÓN</th><th>ÚLTIMO ACCESO</th><th><span className="sr-only">Acciones</span></th></tr></thead><tbody>
      {clients.map((client) => { const isRevoked = revoked.includes(client.id); const asksConfirmation = confirming === client.id; return <tr key={client.id} className={client.anomalous ? 'admin-table__warning' : ''}><td data-label="USUARIO"><span className="admin-user"><span className={isRevoked ? 'connection-dot connection-dot--off' : 'connection-dot'} /><span><strong>{client.user}</strong> {client.anomalous && <StateBadge tone="yellow">Acceso anómalo</StateBadge>}<small>{client.device}</small></span></span></td><td data-label="ORIGEN">{client.ip}</td><td data-label="CLIENTE"><StateBadge tone={client.client === 'PWA' ? 'cyan' : 'purple'}>{client.client}</StateBadge></td><td data-label="SESIÓN" className="mono">{client.id}</td><td data-label="ÚLTIMO ACCESO">{isRevoked ? <StateBadge tone="red">Revocada</StateBadge> : client.lastSeen}</td><td data-label="ACCIÓN"><span className="inline-confirm">{asksConfirmation && <ActionButton variant="secondary" onClick={() => setConfirming('')}>Cancelar</ActionButton>}<ActionButton variant="danger" disabled={isRevoked || !!revoking} onClick={() => asksConfirmation ? revoke(client.id) : setConfirming(client.id)}>{isRevoked ? 'Revocada' : revoking === client.id ? 'Revocando…' : asksConfirmation ? 'Confirmar' : 'Revocar'}</ActionButton></span></td></tr>; })}
      {!clients.length && <tr><td colSpan={6} className="admin-table__empty">{loading ? 'Cargando sesiones…' : 'No hay clientes conectados.'}</td></tr>}
    </tbody></table></div>
  </>;
}
