import React from 'react';
import { Icon } from '../../../shared/components/Icon';
import LiteLayout, { PixelAvatar, SegmentedTabs } from '../components/LiteShell';
import { useLiteSession, useHistorialAnimo } from '../hooks/useLite';

const TABS = [
  { to: '/lite/animo/avisos', label: 'Avisos' },
  { to: '/lite/animo/stickers', label: 'Stickers' },
  { to: '/lite/animo/historial', label: 'Historial' },
];

/** Recibidos -> "Nuevo" / "Visto" · Enviados -> "Visto" / "Sin ver" */
function MoodHistoryItem({ item, onSeen }) {
  const received = item.direction === 'received';
  const isNew = received && item.isNew;
  const statusLabel = received ? (isNew ? 'Nuevo' : 'Visto') : 'Entregado';
  return (
    <li className={`mood-item${isNew ? ' is-new' : ''}`} onClick={() => isNew && onSeen(item.id)}>
      <PixelAvatar size={64} tone={item.tone} variant={Number(item.id.slice(1))} />
      <div className="mood-item__body">
        <h3 className="mood-item__title">{item.title}</h3>
        <p className="mood-item__meta">{received ? 'de' : 'para'} {item.person} · {item.when}</p>
      </div>
      <span className={`status${isNew ? ' status--new' : ''}`}>{statusLabel}</span>
    </li>
  );
}

export default function AnimoHistorialPage() {
  const { user } = useLiteSession();
  const { view, setView, items, newCount, sentCount, markAllSeen, markSeen } = useHistorialAnimo();

  const viewTabs = [
    { value: 'received', label: 'Recibidos', badge: newCount > 0 ? `${newCount} nuevos` : '0' },
    { value: 'sent', label: 'Enviados', badge: sentCount },
  ];

  return (
    <LiteLayout user={user} title="Historial de ánimo" subtitle="El apoyo que diste y el que te llegó" tabs={TABS} navBadges={{ animo: newCount }}>
      <div className="history-bar">
        <SegmentedTabs items={viewTabs} value={view} onChange={setView} ariaLabel="Recibidos o enviados" size="sm" />
        {view === 'received' && (
          <button type="button" className="btn btn--ghost" onClick={markAllSeen} disabled={newCount === 0}>
            <Icon name="checkcheck" size={16} />
            Marcar todo como visto
          </button>
        )}
      </div>

      {items.length > 0 ? (
        <ul className="history-grid" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {items.map((item) => <MoodHistoryItem key={item.id} item={item} onSeen={markSeen} />)}
        </ul>
      ) : (
        <p className="empty">Todavía no hay stickers aquí. Envía uno desde la pestaña Stickers.</p>
      )}
    </LiteLayout>
  );
}
