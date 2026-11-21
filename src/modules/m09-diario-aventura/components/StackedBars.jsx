// Barras apiladas de actividades cumplidas por día o por mes (RDF096).
// Cada barra suma Cultura, Físico y Enfoque; el alto es relativo a yMax.
export default function StackedBars({ columns, yMax, dense }) {
  return (
    <div className="m09-barras">
      <div className="m09-eje" aria-hidden="true">
        <span>{yMax}</span>
        <span>{yMax / 2}</span>
        <span>0</span>
      </div>
      <div className="m09-area">
        <div className="m09-columnas">
          {columns.map((c, i) => (
            <div key={i} className={dense ? 'm09-columna densa' : 'm09-columna'}
              title={`${c.label || 'Día'}: ${c.parts.map((p) => `${p.label} ${p.value}`).join(', ')}`}>
              <div className="m09-pila" style={{ height: `${c.height}%` }}>
                {[...c.parts].reverse().map((p) => (
                  <i key={p.key} style={{ flexGrow: p.value, background: p.color }} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="m09-etiquetas" aria-hidden="true">
          {columns.map((c, i) => <span key={i}>{c.label}</span>)}
        </div>
      </div>
    </div>
  );
}
