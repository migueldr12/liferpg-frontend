// Gráfica de 14.1: barras verdes del borrador y marca amarilla de la versión activa.
// Usa SVG con viewBox, así se adapta sola al ancho de la tarjeta.

const WIDTH = 1000;
const HEIGHT = 340;

export default function XpChart({ draft, active, highlights = [] }) {
  const max = Math.max(...draft, ...active, 1);
  const slot = WIDTH / draft.length;
  const barWidth = slot * 0.72;
  const y = (value) => HEIGHT - (value / max) * (HEIGHT - 10);

  return (
    <svg className="m14-chart" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" role="img"
      aria-label="XP requerida por nivel: borrador comparado con la versión activa">
      {draft.map((xp, i) => {
        const level = i + 1;
        const x = i * slot + (slot - barWidth) / 2;
        return (
          <g key={level}>
            <rect
              x={x}
              y={y(xp)}
              width={barWidth}
              height={HEIGHT - y(xp)}
              rx={2}
              fill={highlights.includes(level) ? 'var(--verde)' : 'var(--verde-oscuro)'}
            >
              <title>{`Nivel ${level}: ${xp.toLocaleString('es-MX')} XP`}</title>
            </rect>
            <rect x={x} y={y(active[i]) - 2} width={barWidth} height={4} fill="var(--oro)" />
          </g>
        );
      })}
    </svg>
  );
}
