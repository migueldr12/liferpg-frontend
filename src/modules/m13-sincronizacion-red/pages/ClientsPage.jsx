import React from 'react';
import { ActionButton } from '../../../shared/components/AdminUI';
import { useHostResource } from '../hooks/useHostResource';

export function ClientsPage() {
  const { data, error, loading, refresh } = useHostResource('clients', 30000);
  return <>
    <p>Dispositivos registrados y activos para notificaciones. Su última actividad registrada no indica una conexión en tiempo real.</p>
    {error && <p role="alert">{error}</p>}
    {loading && <p role="status">Cargando dispositivos…</p>}
    <ActionButton variant="secondary" onClick={refresh}>Actualizar</ActionButton>
    <div className="admin-table-wrap"><table className="admin-table admin-table--cards">
      <thead><tr><th>USUARIO</th><th>PLATAFORMA</th><th>ÚLTIMO ACCESO REGISTRADO</th></tr></thead>
      <tbody>{data.map((device) => <tr key={device.id}>
        <td data-label="USUARIO">{device.user?.displayName ?? 'Usuario'}</td>
        <td data-label="PLATAFORMA">{device.platform}</td>
        <td data-label="ÚLTIMO ACCESO">{new Date(device.lastSeenAt).toLocaleString('es-MX')}</td>
      </tr>)}{!loading && !error && !data.length && <tr><td className="admin-table__empty" colSpan={3}>No hay dispositivos registrados.</td></tr>}</tbody>
    </table></div>
  </>;
}
