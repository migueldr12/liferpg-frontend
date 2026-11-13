import { Link, useParams } from 'react-router-dom';
import DiarioHeader from '../components/DiarioHeader';
import { OriginTag, StatusTag, TypeTag } from '../components/Tags';
import { pointsText } from '../hooks/diarioFormat';
import { useDetalleActividad } from '../hooks/useDetalleActividad';
import '../components/diario.css';

// 9.2 Estado de actividad (RF029): detalle y notas de seguimiento
export default function DetalleActividadPage() {
  const { activityId } = useParams();
  const vm = useDetalleActividad(activityId);
  const a = vm.activity;

  if (vm.notFound) {
    return (
      <main className="page m09">
        <DiarioHeader title="Actividad no encontrada" subtitle="Puede que ya no exista" detailId={activityId} />
        <div className="m09-vacio">
          <p>No encontramos esa actividad.</p>
          <Link to="/lite/diario" className="m09-btn-secundario">Volver al diario</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page m09">
      <DiarioHeader title={a?.title ?? 'Cargando…'} subtitle={a?.subtitle ?? ''} detailId={activityId} />

      {vm.error && <p className="m09-error" role="alert">{vm.error}</p>}

      {vm.loading || !a ? (
        <p className="texto-suave">Cargando actividad…</p>
      ) : (
        <div className="m09-grid-detalle">
          {/* Detalle y puntos (RDF093) */}
          <section className="m09-panel">
            <div className="m09-ficha">
              <span className="m09-icono grande" style={{ background: a.meta.color }} aria-hidden="true">{a.meta.icon}</span>
              <div>
                <h2 className="titulo-pixel">{a.title}</h2>
                <div className="m09-tags">
                  <TypeTag type={a.type} />
                  <OriginTag origin={a.origin} />
                  <StatusTag status={a.status} />
                </div>
              </div>
            </div>

            <dl className="m09-datos">
              <div>
                <dt className="m09-label">Puntos</dt>
                <dd className="titulo-pixel" style={{ color: a.points ? a.meta.color : 'var(--texto-suave)' }}>{pointsText(a)}</dd>
              </div>
              <div>
                <dt className="m09-label">Experiencia</dt>
                <dd className="titulo-pixel" style={{ color: a.xp ? 'var(--oro)' : 'var(--texto-suave)' }}>{a.xp ? `+${a.xp} XP` : '—'}</dd>
              </div>
              <div>
                <dt className="m09-label">Duración</dt>
                <dd className="titulo-pixel">{a.durationMin} min</dd>
              </div>
              <div>
                <dt className="m09-label">{a.fourth.label}</dt>
                <dd className="titulo-pixel">{a.fourth.value}</dd>
              </div>
            </dl>

            <span className="m09-label">Recorrido</span>
            <ol className="m09-recorrido">
              {a.timeline.map((t, i) => (
                <li key={i} className={t.tone}>
                  <i aria-hidden="true" />
                  <strong>{t.label}</strong>
                  <span className="titulo-pixel texto-suave">{t.when}</span>
                </li>
              ))}
            </ol>

            <p className={`m09-aviso ${a.banner.tone}`}><span aria-hidden="true">{a.banner.icon}</span> {a.banner.text}</p>
          </section>

          {/* Notas de seguimiento (RDF094 · RDF095) */}
          <section className="m09-panel">
            <div className="m09-detalle-head">
              <h2 className="titulo-pixel">Notas de seguimiento</h2>
              <span className="texto-suave">{a.notes.length} {a.notes.length === 1 ? 'nota' : 'notas'}</span>
            </div>

            <form className="m09-nueva-nota" onSubmit={(e) => { e.preventDefault(); vm.add(); }}>
              <label htmlFor="m09-nota" className="m09-sr">Nueva nota</label>
              <textarea id="m09-nota" rows={2} maxLength={280} placeholder="¿Qué avanzaste o qué te frenó?"
                value={vm.draft} onChange={(e) => vm.setDraft(e.target.value)} />
              <button type="submit" className="m09-btn-chico" disabled={!vm.draft.trim()}>+ Agregar</button>
            </form>

            {a.notes.length === 0 ? (
              <p className="m09-vacio">Aún no hay notas. Escribe qué avanzaste o qué te frenó.</p>
            ) : (
              <ol className="m09-notas">
                {a.notes.map((n) => (
                  <li key={n.id}>
                    <i aria-hidden="true" />
                    <div className="m09-nota">
                      <div className="m09-detalle-head">
                        <span className="titulo-pixel m09-oro">{n.when}</span>
                        {vm.editing?.id !== n.id && (
                          <span className="m09-fila">
                            <button type="button" className="m09-btn-icono" aria-label="Editar nota" onClick={() => vm.startEdit(n)}>✏️</button>
                            <button type="button" className="m09-btn-icono peligro" aria-label="Eliminar nota" onClick={() => vm.remove(n.id)}>🗑️</button>
                          </span>
                        )}
                      </div>
                      {vm.editing?.id === n.id ? (
                        <form onSubmit={(e) => { e.preventDefault(); vm.save(); }} className="m09-editar">
                          <label htmlFor={`m09-editar-${n.id}`} className="m09-sr">Editar nota</label>
                          <textarea id={`m09-editar-${n.id}`} rows={2} maxLength={280} autoFocus
                            value={vm.editing.text} onChange={(e) => vm.setEditText(e.target.value)} />
                          <span className="m09-fila m09-derecha">
                            <button type="button" className="m09-btn-secundario" onClick={vm.cancelEdit}>Cancelar</button>
                            <button type="submit" className="m09-btn-chico">Guardar</button>
                          </span>
                        </form>
                      ) : (
                        <p>{n.text}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
