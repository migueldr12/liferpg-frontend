import { PixelMascot } from '../../../shared/components/PixelMascot';
import { MESSAGE_MAX, TITLE_MAX, usePush } from '../hooks/usePush';
import '../components/economia.css';

// 14.3 Disparador push (RF045)
export default function PushPage() {
  const vm = usePush();
  const now = new Date();
  const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

  return (
    <div className="m14">

      <div className="m14-grid-push">
        {/* Formulario de envío (RDF141) */}
        <form className="m14-panel m14-form" onSubmit={(e) => { e.preventDefault(); vm.send(); }}>
          <span className="m14-label">Destinatarios</span>
          <div className="m14-tabs chicas" role="group" aria-label="Destinatarios">
            <button type="button" aria-pressed={vm.targetKind === 'todos'}
              className={vm.targetKind === 'todos' ? 'm14-tab activo' : 'm14-tab'} onClick={() => vm.setTargetKind('todos')}>
              Todos los usuarios
            </button>
            <button type="button" aria-pressed={vm.targetKind === 'usuario'}
              className={vm.targetKind === 'usuario' ? 'm14-tab activo' : 'm14-tab'} onClick={() => vm.setTargetKind('usuario')}>
              Un usuario
            </button>
          </div>
          {vm.targetKind === 'usuario' && (
            <label className="m14-field"><span className="m14-label">Usuario destinatario</span><input placeholder="@usuario (p. ej. @camila)" value={vm.username} onChange={(e) => vm.setUsername(e.target.value)} /></label>
          )}

          <label className="m14-field">
            <span className="m14-label">Título <b>{vm.title.length}/{TITLE_MAX}</b></span>
            <input value={vm.title} maxLength={TITLE_MAX} placeholder="¡Semana de rachas!"
              onChange={(e) => vm.setTitle(e.target.value)} />
          </label>

          <label className="m14-field">
            <span className={`m14-label ${vm.message.length > MESSAGE_MAX ? 'm14-counter-error' : ''}`}>Mensaje <b>{vm.message.length}/{MESSAGE_MAX}</b></span>
            <textarea rows={5} value={vm.message}
              placeholder="Esta semana cada check-in da +10 % de XP. Tu dragón te espera."
              onChange={(e) => vm.setMessage(e.target.value)} />
          </label>

          {vm.error && <p className="m14-error" role="alert">{vm.error}</p>}
          {vm.notice && <p className="m14-notice" role="status">{vm.notice}</p>}
          {!vm.canSend && !vm.sending && <p className="texto-suave">{vm.message.length > MESSAGE_MAX ? `Reduce el mensaje a ${MESSAGE_MAX} caracteres.` : 'Completa el título, el mensaje y el destinatario para enviar el aviso.'}</p>}

          <button type="submit" className="m14-btn-primario" disabled={!vm.canSend}>
            {vm.sending ? 'Enviando…' : vm.recipientsText}
          </button>
        </form>

        {/* Vista previa en el celular */}
        <section className="m14-phone" aria-label="Vista previa en la app móvil">
          <div className="m14-phone-time titulo-pixel">{time}</div>
          <div className="m14-phone-date">{now.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
          <div className="m14-notif">
            <span className="m14-notif-icon"><PixelMascot mood="joy" acc="beret" width={28} height={27} label="Life-RPG" /></span>
            <div>
              <small>LIFE-RPG · ahora</small>
              <strong>{vm.title || 'Título del aviso'}</strong>
              <p>{vm.message || 'Aquí se verá el mensaje.'}</p>
            </div>
          </div>
          <small className="texto-suave m14-phone-foot">Vista previa en la app móvil</small>
        </section>

        {/* Historial (RDF142) */}
        <section className="m14-panel">
          <h2 className="titulo-pixel">Historial de envíos</h2>
          {vm.loading ? (
            <p className="texto-suave" role="status">Cargando historial…</p>
          ) : !vm.rows.length ? (!vm.error && <p className="texto-suave">Todavía no hay avisos enviados.</p>) : (
            <ul className="m14-historial">
              {vm.rows.map((r) => (
                <li key={r.id}>
                  <div>
                    <strong>{r.title}</strong>
                    <small>{r.targetText} · {r.whenText}</small>
                  </div>
                   <span className={`m14-estado ${r.status === 'fallido' ? 'fallido' : r.status === 'en_cola' ? 'en-cola' : r.status === 'enviando' ? 'enviando' : ''}`}>{r.statusText}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
