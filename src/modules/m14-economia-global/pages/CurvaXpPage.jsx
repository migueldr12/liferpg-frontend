import AdminHeader from '../components/AdminHeader';
import XpChart from '../components/XpChart';
import { MAX_LEVEL, MILESTONES, useCurvaXp } from '../hooks/useCurvaXp';
import '../components/economia.css';

const DIFFICULTIES = [
  { key: 'facil', label: 'Fácil' },
  { key: 'media', label: 'Media' },
  { key: 'dificil', label: 'Difícil' },
  { key: 'epica', label: 'Épica' },
];

// 14.1 Curva de experiencia (RF043)
export default function CurvaXpPage() {
  const vm = useCurvaXp();

  return (
    <main className="page m14">
      <AdminHeader title="Economía del juego" subtitle="Ni muy fácil ni frustrante · los cambios no son retroactivos" />

      {vm.loading || !vm.draft ? (
        <p className="texto-suave">Cargando economía…</p>
      ) : (
        <div className="m14-grid-curva">
          {/* Parámetros del borrador (RDF135, RDF136) */}
          <section className="m14-panel m14-form">
            <div className="m14-formula titulo-pixel">
              XP(n) = {vm.draft.base} × n^{vm.draft.exponent.toFixed(2)}
            </div>

            <label className="m14-slider">
              <span className="m14-label">Base <b>{vm.draft.base}</b></span>
              <input type="range" min="20" max="300" step="5" value={vm.draft.base}
                onChange={(e) => vm.update('base', Number(e.target.value))} />
            </label>

            <label className="m14-slider">
              <span className="m14-label">Exponente <b>{vm.draft.exponent.toFixed(2)}</b></span>
              <input type="range" min="1" max="2.5" step="0.05" value={vm.draft.exponent}
                onChange={(e) => vm.update('exponent', Number(e.target.value))} />
            </label>

            <span className="m14-label">Puntos por dificultad</span>
            <div className="m14-points">
              {DIFFICULTIES.map((d) => (
                <label key={d.key} className="m14-input-box">
                  <small>{d.label}</small>
                  <input type="number" min="1" value={vm.draft.difficultyPoints[d.key]}
                    onChange={(e) => vm.updatePoints(d.key, Number(e.target.value))} />
                </label>
              ))}
            </div>

            <span className="m14-label">Precio de recompensas personalizadas</span>
            <div className="m14-prices">
              <label className="m14-input-box m14-inline">
                <small>Mín</small>
                <input type="number" min="1" value={vm.draft.rewardPrice.min}
                  onChange={(e) => vm.updatePrice('min', Number(e.target.value))} />
              </label>
              <label className="m14-input-box m14-inline">
                <small>Máx</small>
                <input type="number" min="1" value={vm.draft.rewardPrice.max}
                  onChange={(e) => vm.updatePrice('max', Number(e.target.value))} />
              </label>
            </div>

            {vm.error && <p className="m14-error">{vm.error}</p>}
            {vm.notice && <p className="m14-notice">{vm.notice}</p>}

            <button className="m14-btn-primario" onClick={vm.publish} disabled={!vm.hasChanges || vm.saving}>
              {vm.saving ? 'Publicando…' : `Publicar como v${vm.nextVersion}`}
            </button>
          </section>

          {/* Vista previa de la curva (RDF134) */}
          <section className="m14-panel">
            <div className="m14-chart-head">
              <div>
                <h2 className="titulo-pixel">XP requerida por nivel · 1 a {MAX_LEVEL}</h2>
                <p className="texto-suave">Borrador v{vm.nextVersion} comparado con la versión activa v{vm.active.version}</p>
              </div>
              <div className="m14-legend">
                <span><i className="m14-dot verde" /> Borrador</span>
                <span><i className="m14-dot oro" /> Versión activa</span>
              </div>
            </div>
            <XpChart draft={vm.draftCurve} active={vm.activeCurve} highlights={MILESTONES} />
            <div className="m14-milestones">
              {vm.milestones.map((m) => (
                <div key={m.level} className="m14-milestone">
                  <small className="titulo-pixel">LV {m.level}</small>
                  <strong>{m.xp.toLocaleString('es-MX')} XP</strong>
                  <span className={m.change > 0 ? 'sube' : m.change < 0 ? 'baja' : ''}>
                    {m.change > 0 ? '+' : ''}{m.change} % vs v{vm.active.version}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
