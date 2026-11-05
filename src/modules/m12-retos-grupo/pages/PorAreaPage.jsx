import Avatar from '../components/Avatar';
import LiteHeader from '../components/LiteHeader';
import { ME } from '../api/retosApi';
import { AREAS, areaMeta } from '../hooks/useRetos';
import { useActividadArea } from '../hooks/useActividadArea';
import '../components/retos.css';

// 12.3 Filtros de actividad grupal (RF039)
export default function PorAreaPage() {
  const vm = useActividadArea();
  const meta = areaMeta(vm.area);

  return (
    <main className="page m12">
      <LiteHeader title="Quién destaca esta semana" subtitle="Ordena a tu party por el avance semanal en un área" />

      {vm.error && <p className="m12-error">{vm.error}</p>}

      <div className="m12-grid-area">
        <section>
          {/* Filtro por área (RDF125) */}
          <div className="m12-tabs chicas m12-filtro" role="tablist">
            {AREAS.map((a) => (
              <button key={a.key} role="tab" aria-selected={vm.area === a.key}
                className={vm.area === a.key ? 'm12-tab activo' : 'm12-tab'} onClick={() => vm.setArea(a.key)}>
                {a.label}
              </button>
            ))}
          </div>

          {/* Ranking semanal (RDF124) */}
          <ol className="m12-ranking" aria-busy={vm.loading}>
            {vm.ranking.map((p) => (
              <li key={p.id} className={p.position === 1 ? 'primero' : p.isMe ? 'yo' : ''}>
                <span className="m12-pos titulo-pixel">{p.position}</span>
                <Avatar person={p} />
                <strong>{p.isMe ? `Tú (${ME.fullName})` : p.name}</strong>
                <span className="m12-barra pixel"><span style={{ width: `${(p.points / vm.max) * 100}%`, background: meta.color }} /></span>
                <b className="titulo-pixel">+{p.points}</b>
              </li>
            ))}
          </ol>
        </section>

        {/* Referente del área */}
        {vm.leader && (
          <aside className="m12-referente">
            <span className="m12-insignia">Referente en {meta.label}</span>
            <div className="m12-escena" style={{ background: `linear-gradient(${vm.leader.color}55, var(--panel))` }}>
              <span>{vm.leader.avatar}</span>
            </div>
            <div className="m12-referente-pie">
              <div className="m12-detalle-head">
                <strong className="titulo-pixel">{vm.leader.name}</strong>
                <b className="m12-oro">+{vm.leader.points} pts</b>
              </div>
              {vm.notice && <p className="m12-notice">{vm.notice}</p>}
              <button className="m12-btn-primario" onClick={vm.congratulate}>Felicitar con sticker</button>
            </div>
          </aside>
        )}
      </div>
    </main>
  );
}
