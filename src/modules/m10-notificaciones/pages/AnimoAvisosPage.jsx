import React from 'react';
import LiteLayout from '../components/LiteShell';
import { useNotificationsResource } from '../hooks/useNotificationsResource';
import { Link } from 'react-router-dom';
import { PixelMascot } from '../../../shared/components/PixelMascot';

export default function AnimoAvisosPage() {
  const { data, loading, error } = useNotificationsResource('/notificaciones/avisos-inactividad');
  return <LiteLayout><section className="panel support-page">
    <h2>Acompaña a tus amigos</h2><p>Un mensaje puede ayudar a alguien a retomar sus hábitos.</p>
    {loading && <p role="status">Cargando avisos…</p>}
    {error && <p role="alert">{error}</p>}
    {data && (data.length ? <ul className="support-feed">{data.map((alert) => <li key={alert.id}>
      <PixelMascot pet="dragon" mood="happy" width={54} height={54} label="" /><div><strong>{alert.isOwn ? 'Tu actividad' : alert.user.displayName}</strong><p>{alert.message}</p></div>{!alert.isOwn && <Link to="/lite/animo/stickers">Enviar ánimo</Link>}
    </li>)}</ul> : <div className="empty"><p>No hay avisos activos por ahora.</p><Link to="/lite/animo/stickers">Enviar ánimo a un amigo</Link></div>)}
  </section></LiteLayout>;
}
