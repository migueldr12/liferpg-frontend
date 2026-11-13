import Avatar from '../components/Avatar';
import BotinHeader from '../components/BotinHeader';
import RarityTag from '../components/RarityTag';
import { qtyText } from '../hooks/botinFormat';
import { REQUEST_STATUS, useSolicitudes } from '../hooks/useSolicitudes';
import '../components/botin.css';

// 8.2 Solicitudes de regalo (RF025): bandeja de lo que te piden y pedir un objeto
export default function SolicitudesPage() {
  const vm = useSolicitudes();

  return (
    <main className="page m08">
      <BotinHeader title="Solicitudes de regalo" subtitle="Tus amigos te piden ayuda · tú decides qué sale de tu cofre" />

      {vm.error && <p className="m08-error" role="alert">{vm.error}</p>}
      {vm.notice && <p className="m08-notice" role="status">{vm.notice}</p>}

      {vm.loading ? (
        <p className="texto-suave">Cargando solicitudes…</p>
      ) : (
        <div className="m08-grid-solicitudes">
          {/* Bandeja (RDF084) */}
          <section>
            <div className="m08-seccion-head">
              <h2 className="titulo-pixel">Bandeja</h2>
              {vm.pendingCount > 0 && <span className="m08-badge">{vm.pendingCount} pendientes</span>}
            </div>
            <ul className="m08-bandeja">
              {vm.requests.map((r) => (
                <li key={r.id} className={r.status === 'pendiente' ? 'm08-solicitud' : 'm08-solicitud cerrada'}>
                  <Avatar person={r.person} size={48} />
                  <div className="m08-solicitud-texto">
                    <p>
                      <strong>{r.person.name}</strong> te pide{' '}
                      <span className="m08-chip-item">{r.item.icon} {r.item.name}</span>{' '}
                      <small className="texto-suave">{r.when}</small>
                    </p>
                    <p className="texto-suave m08-cita">“{r.reason}”</p>
                    {r.status === 'pendiente' && (
                      <small className={r.blocked ? 'm08-rojo' : 'texto-suave'}>{r.note}</small>
                    )}
                  </div>
                  {/* Responder (RDF085) */}
                  {r.status === 'pendiente' ? (
                    <div className="m08-fila">
                      <button type="button" className="m08-btn-secundario" onClick={() => vm.respond(r, false)}>Rechazar</button>
                      <button type="button" className="m08-btn-chico" disabled={r.blocked} onClick={() => vm.respond(r, true)}>
                        Aceptar y enviar
                      </button>
                    </div>
                  ) : (
                    <span className={`m08-estado ${r.status}`}>{r.status === 'aceptada' ? 'Enviado' : 'Rechazada'}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <aside className="m08-columna">
            {/* Pedir un objeto (RDF083) */}
            <form className="m08-panel" onSubmit={(e) => { e.preventDefault(); vm.ask(); }}>
              <h2 className="titulo-pixel">Pedir un objeto</h2>
              <div className="m08-tabs chicas" role="group" aria-label="Amigo">
                {vm.friends.map((f) => (
                  <button key={f.id} type="button" aria-pressed={vm.askFriend?.id === f.id}
                    className={vm.askFriend?.id === f.id ? 'm08-tab activo' : 'm08-tab'}
                    onClick={() => vm.setAskFriendId(f.id)}>
                    {f.name}
                  </button>
                ))}
              </div>
              <span className="m08-label">Cofre de {vm.askFriend?.name}</span>
              <div className="m08-opciones" role="radiogroup" aria-label={`Cofre de ${vm.askFriend?.name}`}>
                {vm.friendChest.map((i) => (
                  <label key={i.id} className={vm.askItem?.id === i.id ? 'm08-opcion activo' : 'm08-opcion'}>
                    <input type="radio" name="m08-pedir" checked={vm.askItem?.id === i.id} onChange={() => vm.setAskItemId(i.id)} />
                    <span className="m08-item-icon chico" aria-hidden="true">{i.icon}</span>
                    <strong>{i.name}</strong>
                    <RarityTag rarity={i.rarity} />
                    <span className="m08-qty">{qtyText(i.qty)}</span>
                  </label>
                ))}
              </div>
              <button type="submit" className="m08-btn-primario" disabled={!vm.askItem || vm.alreadyAsked}>
                {vm.alreadyAsked ? `Ya se lo pediste a ${vm.askFriend?.name}` : `Pedir ${vm.askItem?.name.toLowerCase() ?? ''}`}
              </button>
            </form>

            {/* Estado de mis pedidos (RDF084) */}
            <section className="m08-panel">
              <span className="m08-label">Mis pedidos</span>
              <ul className="m08-pedidos">
                {vm.mine.map((p) => (
                  <li key={p.id}>
                    <span>{p.item.name} · <span className="texto-suave">{p.person.name}</span></span>
                    <span className={`m08-estado ${p.status}`}>{REQUEST_STATUS[p.status]}</span>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      )}
    </main>
  );
}
