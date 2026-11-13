import Avatar from '../components/Avatar';
import BotinHeader from '../components/BotinHeader';
import { DIRECTIONS, RANGES, useHistorialBotin } from '../hooks/useHistorialBotin';
import '../components/botin.css';

// 8.3 Historial de botín (RF026): qué regalaste, a quién y cuándo
export default function HistorialPage() {
  const vm = useHistorialBotin();
  const countOf = (key) => (key ? vm.counts[key] : vm.counts.todos);

  return (
    <main className="page m08">
      <BotinHeader title="Historial de botín" subtitle="Qué regalaste, a quién y cuándo" />

      {vm.error && <p className="m08-error" role="alert">{vm.error}</p>}

      {/* Filtros: dirección, amigo y rango de fechas (RDF087) */}
      <div className="m08-filtros">
        <div className="m08-tabs" role="group" aria-label="Movimiento">
          {DIRECTIONS.map((d) => (
            <button key={d.label} type="button" aria-pressed={vm.direction === d.key}
              className={vm.direction === d.key ? 'm08-tab activo' : 'm08-tab'} onClick={() => vm.setDirection(d.key)}>
              {d.label} <span className="m08-contador">{countOf(d.key)}</span>
            </button>
          ))}
        </div>
        <div className="m08-tabs chicas" role="group" aria-label="Amigo">
          <button type="button" aria-pressed={vm.friendId === null}
            className={vm.friendId === null ? 'm08-tab activo' : 'm08-tab'} onClick={() => vm.setFriendId(null)}>
            Todos
          </button>
          {vm.friends.map((f) => (
            <button key={f.id} type="button" aria-pressed={vm.friendId === f.id}
              className={vm.friendId === f.id ? 'm08-tab activo' : 'm08-tab'} onClick={() => vm.setFriendId(f.id)}>
              {f.name}
            </button>
          ))}
        </div>
        <div className="m08-tabs chicas m08-derecha" role="group" aria-label="Rango de fechas">
          <span aria-hidden="true" className="m08-icono-filtro">📅</span>
          {RANGES.map((r) => (
            <button key={r.key} type="button" aria-pressed={vm.range === r.key}
              className={vm.range === r.key ? 'm08-tab activo' : 'm08-tab'} onClick={() => vm.setRange(r.key)}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Movimientos (RDF086) */}
      <div className="m08-tabla" role="table" aria-label="Historial de regalos" aria-busy={vm.loading}>
        <div className="m08-tabla-fila encabezado" role="row">
          <span role="columnheader">Fecha</span>
          <span role="columnheader">Movimiento</span>
          <span role="columnheader">Objeto</span>
          <span role="columnheader">Amigo</span>
          <span role="columnheader">Mensaje</span>
        </div>
        {vm.rows.map((h) => (
          <div key={h.id} className="m08-tabla-fila" role="row">
            <span role="cell" className="titulo-pixel texto-suave">{h.when}</span>
            <span role="cell"><span className={`m08-direccion ${h.direction}`}>{h.direction === 'enviado' ? '→ Enviado' : '← Recibido'}</span></span>
            <span role="cell" className="m08-celda-item"><span className="m08-item-icon chico" aria-hidden="true">{h.item.icon}</span><strong>{h.item.name}</strong></span>
            <span role="cell" className="m08-celda-item"><Avatar person={h.person} size={28} />{h.person.name}</span>
            <span role="cell" className="texto-suave m08-mensaje">{h.message || '—'}</span>
          </div>
        ))}
        {!vm.loading && vm.rows.length === 0 && <p className="m08-vacio">Sin movimientos con estos filtros</p>}
      </div>
    </main>
  );
}
