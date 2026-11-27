import React, { useState } from 'react';
import { http } from '../../../api/httpClient';
import LiteLayout from '../components/LiteShell';
import { useNotificationsResource } from '../hooks/useNotificationsResource';
import { CatalogIcon } from '../../../shared/components/CatalogIcon';
import { Link } from 'react-router-dom';

export default function AnimoHistorialPage() {
  const [direction, setDirection] = useState('recibidos');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { data, loading, error: loadError, refresh } = useNotificationsResource(`/notificaciones/stickers/historial?tipo=${direction}`);
  async function markSeen() {
    setBusy(true); setError('');
    try { await http('/notificaciones/stickers/visto', { method: 'PATCH', body: {} }); refresh(); }
    catch (cause) { setError(cause.message); } finally { setBusy(false); }
  }
  return <LiteLayout><section className="panel support-page">
    <h2>Historial de ánimo</h2>
    <p>Los mensajes que has compartido con tus amigos.</p>
    <label>Mostrar <select value={direction} onChange={(event) => setDirection(event.target.value)}><option value="recibidos">Recibidos</option><option value="enviados">Enviados</option></select></label>
    {direction === 'recibidos' && <button type="button" className="btn" disabled={busy || !data?.some((item) => !item.seenAt)} onClick={markSeen}>Marcar como vistos</button>}
    {loading && <p role="status">Cargando historial…</p>}
    {(loadError || error) && <p role="alert">{loadError || error}</p>}
    {data && (data.length ? <ul className="support-feed">{data.map((item) => <li key={item.id}>
      <CatalogIcon icon={item.sticker.icon} size={54} /><div><strong>{item.sticker.name}</strong><p>{direction === 'recibidos' ? 'De' : 'Para'} {direction === 'recibidos' ? item.sender.displayName : item.recipient.displayName}</p><small>{new Date(item.sentAt).toLocaleString('es-MX')}{direction === 'recibidos' && !item.seenAt ? ' · Nuevo' : ''}</small></div>
    </li>)}</ul> : <div className="empty"><p>Aún no hay stickers {direction}.</p><Link to="/lite/animo/stickers">Enviar ánimo</Link></div>)}
  </section></LiteLayout>;
}
