import { Send } from 'lucide-react';
import LiteLayout, { PixelAvatar, SegmentedTabs } from '../../../components/lite/LiteShell';
import { useLiteSession, useStickersAnimo } from '../../../hooks/useLite';

const TABS = [
  { to: '/lite/animo/avisos', label: 'Avisos' },
  { to: '/lite/animo/stickers', label: 'Stickers' },
  { to: '/lite/animo/historial', label: 'Historial' },
];

function StickerCard({ sticker, selected, onSelect }) {
  return (
    <button type="button" className={`sticker-card${selected ? ' is-selected' : ''}`} aria-pressed={selected} onClick={() => onSelect(sticker.id)}>
      <PixelAvatar src={sticker.src} size={124} tone={sticker.tone} />
      {sticker.label}
    </button>
  );
}

function FriendRecipientList({ friends, selectedIds, onToggle }) {
  return (
    <div className="friend-list" role="group" aria-label="Destinatarios">
      {friends.map((f) => {
        const selected = selectedIds.has(f.id);
        return (
          <label key={f.id} className={`friend${selected ? ' is-selected' : ''}`}>
            <input type="checkbox" checked={selected} onChange={() => onToggle(f.id)} />
            <PixelAvatar src={f.avatar} size={38} tone={f.tone} />
            <span className="friend__info">
              <span className="friend__name">{f.name}</span>
              <span className="friend__status">{f.status}</span>
            </span>
            <span className="friend__check" aria-hidden="true" />
          </label>
        );
      })}
    </div>
  );
}

export default function AnimoStickersPage() {
  const { user, navBadges } = useLiteSession();
  const {
    categories, category, changeCategory, stickers, selectedSticker, selectSticker,
    friends, selectedFriends, toggleFriend, canSend, sendSticker,
  } = useStickersAnimo();

  return (
    <LiteLayout user={user} title="Stickers de ánimo" subtitle="Elige uno y mándalo a uno o varios amigos" tabs={TABS} navBadges={navBadges}>
      <div className="stickers-grid">
        <section aria-label="Stickers">
          <SegmentedTabs items={categories} value={category} onChange={changeCategory} ariaLabel="Categorías de stickers" size="sm" />
          <div className="sticker-grid">
            {stickers.map((s) => <StickerCard key={s.id} sticker={s} selected={s.id === selectedSticker.id} onSelect={selectSticker} />)}
          </div>
        </section>

        <aside className="panel send-panel" aria-label="Enviar sticker">
          <h2 className="send-panel__title">Enviar a</h2>
          <FriendRecipientList friends={friends} selectedIds={selectedFriends} onToggle={toggleFriend} />
          <button type="button" className="btn" disabled={!canSend} onClick={sendSticker}>
            <Send size={16} aria-hidden="true" />
            Enviar “{selectedSticker.label}” a {selectedFriends.size}
          </button>
          <p className="send-panel__note">Les llega como notificación push.</p>
        </aside>
      </div>
    </LiteLayout>
  );
}
