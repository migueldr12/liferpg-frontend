import DiarioHeader from '../components/DiarioHeader';
import Donut from '../components/Donut';
import StackedBars from '../components/StackedBars';
import { TYPES } from '../hooks/diarioFormat';
import { CHART_RANGES, useGraficas } from '../hooks/useGraficas';
import '../components/diario.css';

// 9.3 Gráficas de actividades (RF030): por día o mes y por tipo
export default function GraficasPage() {
  const vm = useGraficas();

  return (
    <main className="page m09">
      <DiarioHeader title="Tus patrones" subtitle="Actividades cumplidas · cambia el rango para comparar" />

      {vm.error && <p className="m09-error" role="alert">{vm.error}</p>}

      <div className="m09-grid-graficas">
        {/* Cumplidas por periodo (RDF096 · RDF098) */}
        <section className="m09-panel" aria-busy={vm.loading}>
          <div className="m09-detalle-head">
            <div>
              <h2 className="titulo-pixel">{vm.rangeMeta.title}</h2>
              <p className="texto-suave">{vm.rangeMeta.sub}</p>
            </div>
            <div className="m09-leyenda">
              {TYPES.map((t) => (
                <span key={t.key}><i style={{ background: t.color }} /> {t.label}</span>
              ))}
            </div>
            <div className="m09-tabs chicas" role="group" aria-label="Rango">
              {CHART_RANGES.map((r) => (
                <button key={r.key} type="button" aria-pressed={vm.range === r.key}
                  className={vm.range === r.key ? 'm09-tab activo' : 'm09-tab'} onClick={() => vm.setRange(r.key)}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          <StackedBars columns={vm.columns} yMax={vm.yMax} dense={vm.range === 'mes'} />
        </section>

        {/* Distribución por tipo (RDF097) */}
        <aside className="m09-panel">
          <h2 className="titulo-pixel">Por tipo</h2>
          <Donut dist={vm.dist} total={vm.total} />
          <ul className="m09-distribucion">
            {vm.dist.map((d) => (
              <li key={d.key}>
                <span className="m09-icono" style={{ background: d.color }} aria-hidden="true">{d.icon}</span>
                <strong>{d.label}</strong>
                <b className="titulo-pixel">{d.value}</b>
                <span className="titulo-pixel texto-suave">{d.pct}%</span>
              </li>
            ))}
          </ul>
          {vm.total > 0 && (
            <p className="m09-consejo">
              Tu área más fuerte es <b>{vm.best.label}</b>. <b>{vm.worst.label}</b> va rezagada: prueba una misión corta esta semana.
            </p>
          )}
        </aside>
      </div>
    </main>
  );
}
