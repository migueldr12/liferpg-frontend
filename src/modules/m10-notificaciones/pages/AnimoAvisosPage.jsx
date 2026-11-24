import LiteLayout, { PixelAvatar } from '../components/LiteShell';
import { useAvisosAnimo, useLiteSession } from '../hooks/useLite';

function OwnAlert({ alert }) {
  return (
    <article className={`notice-card${alert.active ? ' is-active' : ''}`}>
      <PixelAvatar size={48} tone={alert.tone} variant={alert.variant} src={`/icons/${alert.pet || 'dragon'}.png`} />
      <div>
        <div className="notice-card__head"><strong>{alert.title}</strong><span>{alert.when}</span></div>
        <p>{alert.body}</p>
      </div>
    </article>
  );
}

function SupportCard({ person, quickResponses, response, onRespond }) {
  return (
    <article className="support-card">
      <PixelAvatar size={72} tone={person.tone} variant={person.variant} src={`/icons/${person.pet || 'dragon'}.png`} />
      <div className="support-card__person">
        <strong>{person.name}</strong>
        <span className="support-card__reason">{person.reason}</span>
        <span className="support-card__week" aria-label="Actividad de los últimos siete días">
          {person.week.map((active, index) => <i key={index} className={active ? 'is-on' : ''} />)}
        </span>
      </div>
      <div className="support-card__actions">
        <span>{response ? `Enviaste “${response}”` : person.hint}</span>
        <div>
          {quickResponses.map((message) => (
            <button key={message} type="button" className={response === message ? 'is-sent' : ''} disabled={Boolean(response)} onClick={() => onRespond(person.id, message)}>{message}</button>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function AnimoAvisosPage() {
  const { user } = useLiteSession();
  const { ownAlerts, people, quickResponses, responses, pendingCount, sentCount, respond } = useAvisosAnimo();
  return (
    <LiteLayout user={user}>
      <div className="notices-grid">
        <section className="own-notices">
          <h2>Tus avisos</h2>
          {ownAlerts.map((alert) => <OwnAlert key={alert.id} alert={alert} />)}
          <p className="notice-rule">Se avisa tras <strong>2 días</strong> sin registros o con menos de <strong>40 %</strong> de cumplimiento.</p>
        </section>
        <section className="support-list">
          <div className="support-list__head">
            <h2>Necesitan ánimo</h2><span className="badge">{pendingCount}</span><span>{sentCount} enviados</span>
          </div>
          {people.map((person) => <SupportCard key={person.id} person={person} quickResponses={quickResponses} response={responses[person.id]} onRespond={respond} />)}
        </section>
      </div>
    </LiteLayout>
  );
}
