import Avatar from '../components/Avatar';
import BotinHeader from '../components/BotinHeader';
import RarityTag from '../components/RarityTag';
import { qtyText } from '../hooks/botinFormat';
import { giftNote, useCofre } from '../hooks/useCofre';
import '../components/botin.css';

// 8.1 Cofre del botín (RF027) y envío de regalos (RF025)
export default function CofrePage() {
  const vm = useCofre();

  return (
    <main className="page m08">
      <BotinHeader title="Cofre del botín" subtitle="Objetos que puedes regalar · llegan a la app móvil de tu amigo" />

      {vm.error && <p className="m08-error" role="alert">{vm.error}</p>}
      {vm.notice && <p className="m08-notice" role="status">{vm.notice}</p>}

      {vm.loading ? (
        <p className="texto-suave">Cargando tu cofre…</p>
      ) : (
        <div className="m08-grid-cofre">
          {/* Objetos del cofre con existencias (RDF088) */}
          <section>
            <div className="m08-seccion-head">
              <h2 className="titulo-pixel">Tu cofre</h2>
              <span className="texto-suave">Lo equipado y lo exclusivo no se puede regalar</span>
            </div>
            <div className="m08-cofre">
              {vm.chest.map((i) => {
                const active = vm.selected?.id === i.id;
                const tag = i.equipped ? 'Equipado' : i.exclusive ? 'Exclusivo' : qtyText(i.qty);
                return (
                  <button key={i.id} type="button" disabled={!i.giftable} aria-pressed={active}
                    className={!i.giftable ? 'm08-item bloqueado' : active ? 'm08-item activo' : 'm08-item'}
                    onClick={() => vm.pickItem(i)}>
                    <span className="m08-item-icon" aria-hidden="true">{i.icon}</span>
                    <span className="m08-item-texto">
                      <strong>{i.name}</strong>
                      <span className="m08-item-tags">
                        <RarityTag rarity={i.rarity} />
                        <span className={i.giftable ? 'm08-qty' : 'm08-qty nula'}>{tag}</span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Enviar regalo (RDF082) */}
          <form className="m08-panel" onSubmit={(e) => { e.preventDefault(); vm.send(); }}>
            <h2 className="titulo-pixel">🎁 Enviar regalo</h2>

            <span className="m08-label" id="m08-para">Para</span>
            <div className="m08-amigos" role="group" aria-labelledby="m08-para">
              {vm.friends.map((f) => (
                <button key={f.id} type="button" aria-pressed={vm.friend?.id === f.id}
                  className={vm.friend?.id === f.id ? 'm08-amigo activo' : 'm08-amigo'}
                  onClick={() => vm.setFriendId(f.id)}>
                  <Avatar person={f} size={40} />
                  {f.name}
                </button>
              ))}
            </div>

            <span className="m08-label">Objeto</span>
            {vm.selected ? (
              <div className="m08-objeto">
                <span className="m08-item-icon" aria-hidden="true">{vm.selected.icon}</span>
                <span>
                  <strong>{vm.selected.name}</strong>
                  <small className="texto-suave">{giftNote(vm.selected)}</small>
                </span>
              </div>
            ) : (
              <p className="texto-suave">No te quedan objetos para regalar.</p>
            )}

            <label className="m08-label" htmlFor="m08-mensaje">Mensaje</label>
            <textarea id="m08-mensaje" rows={3} maxLength={140} value={vm.message}
              placeholder="Escribe algo para tu amigo (opcional)"
              onChange={(e) => vm.setMessage(e.target.value)} />

            <button type="submit" className="m08-btn-primario" disabled={!vm.canSend}>
              {vm.sending ? 'Enviando…' : `Enviar a ${vm.friend?.name ?? '…'}`}
            </button>
            <small className="texto-suave m08-centro">Sale de tu cofre y le llega una notificación push.</small>
          </form>
        </div>
      )}
    </main>
  );
}
