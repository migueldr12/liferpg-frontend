import Avatar from '../components/Avatar';
import { METRIC_OPTIONS } from '../api/retosApi';
import { AREAS, areaMeta, useRetos } from '../hooks/useRetos';
import '../components/retos.css';

const deadlineIn = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

// 12.1 Tablero de retos grupales (RF037)
export default function RetosPage() {
  const vm = useRetos();
  const c = vm.selected;

  return (
    <div className="m12">

      {/* Invitaciones pendientes (RDF118) */}
      {vm.invitations.map((inv) => (
        <div key={inv.id} className="m12-invitacion">
          <Avatar person={inv.fromPerson} size={32} />
          <p>
            <strong>{inv.fromPerson.name}</strong> te invita a <strong>{inv.challenge.title}</strong> · {inv.challenge.goal}{' '}
            {inv.challenge.unit} de {areaMeta(inv.challenge.type).label}
          </p>
          <button className="m12-btn-secundario" onClick={() => vm.respond(inv, false)}>Rechazar</button>
          <button className="m12-btn-chico" onClick={() => vm.respond(inv, true)}>Unirme</button>
        </div>
      ))}

      {vm.error && <p className="m12-error">{vm.error}</p>}
      {vm.notice && <p className="m12-notice">{vm.notice}</p>}

      {vm.loading ? (
        <p className="texto-suave">Cargando retos…</p>
      ) : (
        <div className="m12-grid-retos">
          {/* Lista de retos activos */}
          <div className="m12-lista">
            {vm.challenges.map((r) => {
              const meta = areaMeta(r.type);
              return (
                <button key={r.id} className={r.id === vm.selected?.id ? 'm12-reto activo' : 'm12-reto'}
                  onClick={() => vm.setSelectedId(r.id)}>
                  <span className="m12-reto-top">
                    <span className="m12-area-icon" style={{ background: meta.color }}>{meta.icon}</span>
                    <strong>{r.title}</strong>
                    <b className="titulo-pixel">{r.percent}%</b>
                  </span>
                  <span className="m12-barra"><span style={{ width: `${r.percent}%`, background: meta.color }} /></span>
                  <small>{r.participants.length} participantes · {r.closeText}</small>
                </button>
              );
            })}

            <button className={vm.form ? 'm12-crear activo' : 'm12-crear'} onClick={vm.openForm}>+ Crear reto</button>
          </div>

          {/* Detalle del reto con la aportación de cada participante (RDF120) */}
          {vm.form ? (
            <form className="m12-panel m12-form m12-form-derecha" onSubmit={(e) => { e.preventDefault(); vm.saveForm(); }}>
              <div className="m12-detalle-head"><h2 className="titulo-pixel">Nuevo reto</h2><button type="button" className="m12-btn-texto" onClick={vm.closeForm}>Cancelar</button></div>
              <label className="m12-label">Nombre<input value={vm.form.title} autoFocus onChange={(e) => vm.setForm({ ...vm.form, title: e.target.value })} /></label>
              <div className="m12-fila">
                <label className="m12-label">Tipo<select value={vm.form.type} onChange={(e) => vm.setForm({ ...vm.form, type: e.target.value })}>{AREAS.map((a) => <option key={a.key} value={a.key}>{a.label}</option>)}</select></label>
                <label className="m12-label">Qué se suma<select value={vm.form.metric} onChange={(e) => vm.setForm({ ...vm.form, metric: e.target.value })}>{METRIC_OPTIONS.map((m) => <option key={m.key} value={m.key}>{m.label}</option>)}</select></label>
              </div>
              <span className="m12-label">Meta acumulada</span>
              <div className="m12-opciones">{[20, 50, 100, 200].map((goal) => <button key={goal} type="button" className={Number(vm.form.goal) === goal ? 'activo' : ''} onClick={() => vm.setForm({ ...vm.form, goal })}>{goal}</button>)}</div>
              <span className="m12-label">Plazo</span>
              <div className="m12-opciones">{[['1 semana', 7], ['2 semanas', 14], ['1 mes', 30]].map(([label, days]) => <button key={label} type="button" className={vm.form.deadline === deadlineIn(days) ? 'activo' : ''} onClick={() => vm.setForm({ ...vm.form, deadline: deadlineIn(days) })}>{label}</button>)}</div>
              <span className="m12-label">Invitar amigos</span>
              <div className="m12-invitados">{vm.friends.map((f) => <label key={f.id} className={vm.form.invited.includes(f.id) ? 'm12-chip activo' : 'm12-chip'}><input type="checkbox" checked={vm.form.invited.includes(f.id)} onChange={() => vm.toggleInvited(f.id)} /><Avatar person={f} size={28} />{f.name}</label>)}</div>
              <button type="submit" className="m12-btn-primario">Crear y enviar {vm.form.invited.length} invitaciones</button>
            </form>
          ) : c && (
            <section className="m12-panel">
              <div className="m12-detalle-head">
                <div>
                  <h2 className="titulo-pixel">{c.title}</h2>
                  <p className="texto-suave">{areaMeta(c.type).label} · {c.participants.length} participantes · {c.closeText}</p>
                </div>
                {c.reward && <span className="m12-premio" title="Recompensa para todos al llegar a la meta (RDF121)">{c.reward}</span>}
              </div>

              <div className="m12-total">
                <span className="titulo-pixel"><b>{c.total}</b> / {c.goal} {c.unit}</span>
                <span className="texto-suave">{c.missing > 0 ? `Faltan ${c.missing}` : '¡Meta cumplida!'}</span>
              </div>
              <div className="m12-barra-grupal">
                {c.participants.map((p) => (
                  <span key={p.id} title={`${p.name}: ${p.amount}`}
                    style={{ width: `${Math.min(100, (p.amount / c.goal) * 100)}%`, background: p.color }} />
                ))}
              </div>

              <span className="m12-label">Aportación por participante</span>
              <ul className="m12-aportes">
                {c.participants.map((p) => (
                  <li key={p.id}>
                    <Avatar person={p} />
                    <strong>{p.name}</strong>
                    <span className="m12-barra"><span style={{ width: `${(p.amount / c.max) * 100}%`, background: p.color }} /></span>
                    <b>{p.amount}</b>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
