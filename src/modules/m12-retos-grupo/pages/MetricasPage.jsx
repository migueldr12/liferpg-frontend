import { CatalogIcon } from '../../../shared/components/CatalogIcon';
import { useMetricasGrupo } from '../hooks/useMetricasGrupo';
import '../components/retos.css';

const PERIODS = [
  { key: 'semana', label: 'Semana' },
  { key: 'mes', label: 'Mes' },
];

// 12.2 Métricas de grupo (RF038)
export default function MetricasPage() {
  const vm = useMetricasGrupo();

  return (
    <div className="m12">

      {vm.error && <p className="m12-error">{vm.error}</p>}

      <div className="m12-grid-metricas">
        {/* Gráfica: tú vs promedio del grupo (RDF123) */}
        <section className="m12-panel">
          <div className="m12-detalle-head">
            <h2 className="titulo-pixel">Cumplimiento por tipo</h2>
            <div className="m12-leyenda">
              <span><i className="m12-cuadro tu" /> Tú</span>
              <span><i className="m12-cuadro grupo" /> Promedio del grupo</span>
            </div>
            <div className="m12-tabs chicas" role="tablist">
              {PERIODS.map((p) => (
                <button key={p.key} role="tab" aria-selected={vm.period === p.key}
                  className={vm.period === p.key ? 'm12-tab activo' : 'm12-tab'} onClick={() => vm.setPeriod(p.key)}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="m12-barras" aria-busy={vm.loading}>
            <div className="m12-eje"><span>100%</span><span>50%</span><span>0%</span></div>
            {vm.rows.map((r) => (
              <div key={r.key} className="m12-grupo-barras">
                <div className="m12-par">
                  <div className="m12-col">
                    <b className="titulo-pixel">{r.meText}</b>
                    <span className="m12-col-tu" style={{ height: `${r.me}%` }} title={`Tú: ${r.meText}`} />
                  </div>
                  <div className="m12-col">
                    <b className="titulo-pixel texto-suave">{r.groupText}</b>
                    <span className="m12-col-grupo" style={{ height: `${r.group}%` }} title={`Grupo: ${r.groupText}`} />
                  </div>
                </div>
                <span className="m12-col-label"><span className="m12-area-icon" style={{ background: r.color }}><CatalogIcon icon={r.icon} size={14} /></span> {r.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Diferencia por tipo con una recomendación */}
        <div className="m12-tarjetas">
          {vm.rows.map((r) => (
            <section key={r.key} className="m12-panel m12-tarjeta">
              <div className="m12-detalle-head">
                <strong><span className="m12-area-icon" style={{ background: r.color }}><CatalogIcon icon={r.icon} size={14} /></span> {r.label}</strong>
                {r.hasData && (
                  <span className={r.diff >= 0 ? 'm12-pts sube' : 'm12-pts baja'}>{r.diff > 0 ? '+' : ''}{r.diff} pts</span>
                )}
              </div>
              <p className="texto-suave">{r.advice}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
