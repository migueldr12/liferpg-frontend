import Avatar from '../components/Avatar';
import LiteHeader from '../components/LiteHeader';
import { AREAS, areaMeta, useRetos } from '../hooks/useRetos';
import '../components/retos.css';

// 12.1 Tablero de retos grupales (RF037)
export default function RetosPage() {
  const vm = useRetos();
  const c = vm.selected;

  return (
    <main className="page m12">
      <LiteHeader title="Retos de grupo" subtitle="Metas que se llenan con el esfuerzo de toda la party" />

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

            {/* Crear reto (RDF117) */}
            {vm.form ? (
              <form className="m12-panel m12-form" onSubmit={(e) => { e.preventDefault(); vm.saveForm(); }}>
                <input placeholder="Nombre del reto" value={vm.form.title} autoFocus
                  onChange={(e) => vm.setForm({ ...vm.form, title: e.target.value })} />
                <div className="m12-fila">
                  <select value={vm.form.type} onChange={(e) => vm.setForm({ ...vm.form, type: e.target.value })}>
                    {AREAS.map((a) => <option key={a.key} value={a.key}>{a.label}</option>)}
                  </select>
                  <input type="date" value={vm.form.deadline} aria-label="Fecha límite"
                    onChange={(e) => vm.setForm({ ...vm.form, deadline: e.target.value })} />
                </div>
                <div className="m12-fila">
                  <input type="number" min="1" value={vm.form.goal} aria-label="Meta"
                    onChange={(e) => vm.setForm({ ...vm.form, goal: e.target.value })} />
                  <input placeholder="Unidad (sesiones, km…)" value={vm.form.unit}
                    onChange={(e) => vm.setForm({ ...vm.form, unit: e.target.value })} />
                </div>
                <span className="m12-label">Invitar amigos</span>
                <div className="m12-invitados">
                  {vm.friends.map((f) => (
                    <label key={f.id} className={vm.form.invited.includes(f.id) ? 'm12-chip activo' : 'm12-chip'}>
                      <input type="checkbox" checked={vm.form.invited.includes(f.id)} onChange={() => vm.toggleInvited(f.id)} />
                      {f.avatar} {f.name}
                    </label>
                  ))}
                </div>
                <div className="m12-fila">
                  <button type="submit" className="m12-btn-chico">Crear reto</button>
                  <button type="button" className="m12-btn-texto" onClick={vm.closeForm}>Cancelar</button>
                </div>
              </form>
            ) : (
              <button className="m12-crear" onClick={vm.openForm}>+ Crear reto</button>
            )}
          </div>

          {/* Detalle del reto con la aportación de cada participante (RDF120) */}
          {c && (
            <section className="m12-panel">
              <div className="m12-detalle-head">
                <div>
                  <h2 className="titulo-pixel">{c.title}</h2>
                  <p className="texto-suave">{areaMeta(c.type).label} · {c.participants.length} participantes · {c.closeText}</p>
                </div>
                <span className="m12-premio" title="Recompensa para todos al llegar a la meta (RDF121)">🎁 {c.reward}</span>
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
    </main>
  );
}
