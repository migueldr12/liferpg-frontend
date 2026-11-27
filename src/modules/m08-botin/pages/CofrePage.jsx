import { Icon } from '../../../shared/components/Icon';
import { Link } from 'react-router-dom';
import { DispatchReceipt } from '../../../shared/components/DispatchReceipt';
import { CatalogIcon } from '../../../shared/components/CatalogIcon';
import Avatar from '../components/Avatar';
import RarityTag from '../components/RarityTag';
import { qtyText } from '../hooks/botinFormat';
import { giftNote, useCofre } from '../hooks/useCofre';
import '../components/botin.css';

// 8.1 Cofre del botín (RF027) y envío de regalos (RF025)
export default function CofrePage() {
  const vm = useCofre();

  return (
    <div className="m08">

      {vm.error && <p className="m08-error" role="alert">{vm.error}</p>}

      {vm.loading ? (
        <p className="texto-suave" role="status">Cargando tu cofre…</p>
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
                    className={`m08-item${active ? ' activo' : ''}${!i.giftable ? ' bloqueado' : ''}`}
                    onClick={() => vm.pickItem(i)}>
                    <CatalogIcon icon={i.icon} tile tileSize={38} />
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
          <form className="m08-panel m08-parcel" aria-busy={vm.sending} onSubmit={(e) => { e.preventDefault(); vm.send(); }}>
            <h2 className="titulo-pixel" style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span className="catalog-tile" style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--pu)', color: '#fff' }}><Icon name="gift" size={17} /></span>Enviar regalo</h2>

            {vm.notice && <DispatchReceipt title="Regalo enviado" art={<CatalogIcon icon={vm.notice.item.icon} size={28} />} action={<Link to="/lite/botin/historial">Ver historial de botín</Link>}>
              <b>{vm.notice.item.name}</b> ya está en el inventario de <b>{vm.notice.recipient}</b>. {vm.notice.notified && 'También recibió una notificación.'}
            </DispatchReceipt>}
            <span className="m08-label" id="m08-para">Para</span>
            <div className="m08-amigos" role="group" aria-labelledby="m08-para">
              {vm.friends.map((f) => (
                <button key={f.id} type="button" aria-pressed={vm.friend?.id === f.id}
                  className={vm.friend?.id === f.id ? 'm08-amigo activo' : 'm08-amigo'}
                  disabled={vm.sending} onClick={() => vm.pickFriend(f.id)}>
                  <Avatar person={f} size={40} />
                  <span>{f.fullName || f.name}{f.fullName && f.fullName !== f.name && <small>@{f.name.replace(/^@/, '')}</small>}</span>
                  {vm.friend?.id === f.id && <Icon name="check" size={17} />}
                </button>
              ))}
            </div>
            {!vm.friends.length && <p className="texto-suave">Añade amigos para poder enviarles regalos.</p>}

            <span className="m08-label">Objeto</span>
            {vm.selected ? (
              <div className="m08-objeto">
                <CatalogIcon icon={vm.selected.icon} tile tileSize={38} />
                <span>
                  <strong>{vm.selected.name}</strong>
                  <small className="texto-suave">{giftNote(vm.selected)}</small>
                </span>
              </div>
            ) : (
              <p className="texto-suave">{vm.chest.some((item) => item.giftable) ? 'Elige un objeto de tu cofre.' : 'No te quedan objetos para regalar.'}</p>
            )}

            <label className="m08-label" htmlFor="m08-mensaje">Nota para tu amigo (opcional)</label>
            <textarea id="m08-mensaje" rows={3} maxLength={140} value={vm.message} disabled={vm.sending}
              placeholder="Escribe unas palabras para acompañar el regalo"
              onChange={(e) => vm.setMessage(e.target.value)} />

            <button type="submit" className="m08-btn-primario" disabled={!vm.canSend}>
              {vm.sending ? 'Enviando…' : 'Enviar regalo'}
            </button>
            {!vm.canSend && !vm.sending && vm.selected && <small className="texto-suave m08-centro">Elige un amigo para enviar el regalo.</small>}
            <small className="texto-suave m08-centro">El objeto pasa de tu cofre al inventario de tu amigo.</small>
          </form>
        </div>
      )}
    </div>
  );
}
