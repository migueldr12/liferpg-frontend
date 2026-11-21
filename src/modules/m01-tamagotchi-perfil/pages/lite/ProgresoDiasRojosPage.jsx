import LiteLayout, { SegmentedTabs } from '../../components/lite/LiteShell';
import { useLiteSession, useDiasRojos } from '../../hooks/useLite';

const TABS = [
  { to: '/lite/progreso', label: 'Pendientes' },
  { to: '/lite/progreso/inactividad', label: 'Días rojos' },
  { to: '/lite/progreso/racha', label: 'Racha' },
];

function CalendarCell({ cell }) {
  if (!cell) return <div className="cal-cell cal-cell--empty" aria-hidden="true" />;
  const style = cell.red ? undefined : { background: `color-mix(in srgb, var(--green) ${Math.round(35 + cell.percent * 0.5)}%, var(--panel-2))` };
  return (
    <div className={`cal-cell${cell.red ? ' cal-cell--red' : ''}`} style={style} aria-label={`Día ${cell.day}: ${cell.percent}%${cell.red ? ', día rojo' : ''}`}>
      <span>{cell.day}</span>
      <span className="cal-cell__pct">{cell.percent}%</span>
    </div>
  );
}

export default function ProgresoDiasRojosPage() {
  const { user, navBadges } = useLiteSession();
  const { monthLabel, thresholds, threshold, setThreshold, cells, redDays, concentration } = useDiasRojos();

  const thresholdTabs = thresholds.map((t) => ({ value: t, label: `${t} %` }));
  const hint = redDays.length === 0
    ? 'Ningún día quedó bajo el umbral este mes.'
    : concentration
      ? `Se concentran en ${concentration.label} (${concentration.count} de ${redDays.length}). Revisa qué cambia esos días.`
      : 'Revisa qué cambia esos días.';

  return (
    <LiteLayout user={user} title="Días rojos" subtitle="Porcentaje de hábitos cumplidos por día · septiembre" tabs={TABS} navBadges={navBadges}>
      <div className="dias-grid">
        <section className="panel" aria-label="Calendario del mes">
          <div className="cal-head">
            <h2 className="cal-title">{monthLabel}</h2>
            <div className="cal-threshold">
              UMBRAL
              <SegmentedTabs items={thresholdTabs} value={threshold} onChange={setThreshold} ariaLabel="Umbral de día rojo" size="sm" />
            </div>
          </div>
          <div className="cal-weekdays" aria-hidden="true">
            {['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'].map((d) => <span key={d}>{d}</span>)}
          </div>
          <div className="cal-grid">
            {cells.map((cell, i) => <CalendarCell key={cell ? cell.day : `blank-${i}`} cell={cell} />)}
          </div>
        </section>

        <aside className="panel" aria-label="Detalle de días rojos">
          <div className="red-summary">
            <span className="red-summary__count">{redDays.length}</span>
            <span className="red-summary__label">{redDays.length === 1 ? 'día bajo' : 'días bajo'} {threshold} %</span>
          </div>
          <p className="red-summary__hint">{hint}</p>
          <ul className="red-list">
            {redDays.map((d) => (
              <li key={d.day} className="red-item">
                <span className="red-item__day">{d.weekdayLabel} {d.day}</span>
                <div>
                  <div className="red-item__bar" aria-hidden="true"><span style={{ width: `${d.percent}%` }} /></div>
                  <span className="red-item__note">{d.note ?? 'Sin nota'}</span>
                </div>
                <span className="red-item__pct">{d.percent}%</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </LiteLayout>
  );
}
