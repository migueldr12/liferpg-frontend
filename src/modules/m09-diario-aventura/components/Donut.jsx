// Dona con la distribución por tipo (RDF097) y el total al centro.
export default function Donut({ dist, total }) {
  let acc = 0;
  const stops = dist
    .map((d) => {
      const from = acc;
      acc += total ? (d.value / total) * 100 : 0;
      return `${d.color} ${from}% ${acc}%`;
    })
    .join(', ');

  return (
    <div className="m09-dona" style={{ background: total ? `conic-gradient(${stops})` : 'var(--panel-alt)' }}
      role="img" aria-label={dist.map((d) => `${d.label} ${d.pct}%`).join(', ')}>
      <span>
        <b className="titulo-pixel">{total}</b>
        <small className="texto-suave">cumplidas</small>
      </span>
    </div>
  );
}
