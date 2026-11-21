import { BookOpen, Dumbbell, Target, RefreshCw } from 'lucide-react';
import LiteLayout from '../../components/lite/LiteShell';
import { useLiteSession, useProgresoPendientes } from '../../hooks/useLite';

const TABS = [
  { to: '/lite/progreso', label: 'Pendientes' },
  { to: '/lite/progreso/dias-rojos', label: 'Días rojos' },
  { to: '/lite/progreso/racha', label: 'Racha' },
];
const AREAS = {
  cultura: { label: 'Cultura', icon: BookOpen },
  fisico: { label: 'Físico', icon: Dumbbell },
  enfoque: { label: 'Enfoque', icon: Target },
};
const RADIUS = 42;
const CIRC = 2 * Math.PI * RADIUS;

function DayCard({ day, selected, onSelect }) {
  const pillClass = day.pending === 0 ? 'pill--ok' : day.pending >= 3 ? 'pill--danger' : '';
  return (
    <button type="button" className={`day-card${selected ? ' is-selected' : ''}`} aria-pressed={selected} onClick={() => onSelect(day.id)}>
      <span>{day.label}</span>
      <span className="day-card__number">{day.number}</span>
      <span className={`pill ${pillClass}`}>{day.pending === 0 ? 'Limpio' : `${day.pending} pend.`}</span>
    </button>
  );
}

function PendingTaskRow({ task, onResume }) {
  const area = AREAS[task.area];
  const Icon = area.icon;
  return (
    <li className="task-row">
      <span className={`task-row__icon task-row__icon--${task.area}`}><Icon size={20} aria-hidden="true" /></span>
      <div className="task-row__body">
        <h3 className="task-row__title">{task.title}</h3>
        <div className="task-row__tags">
          <span className={`tag${task.kind === 'Misión' ? ' tag--mission' : ''}`}>{task.kind}</span>
          <span className={`tag tag--${task.area}`}>{area.label}</span>
        </div>
      </div>
      {task.weeklyRepeats > 1 && (
        <span className="repeat-chip"><RefreshCw size={13} aria-hidden="true" />{task.weeklyRepeats}.ª vez esta semana</span>
      )}
      <button type="button" className="btn" onClick={() => onResume(task)}>Retomar hoy</button>
    </li>
  );
}

function DayProgressCard({ dateLabel, done, total }) {
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <section className="panel day-progress" aria-label="Resumen del día">
      <div className="ring" role="img" aria-label={`${percent}% cumplido`}>
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <circle className="ring__track" cx="50" cy="50" r={RADIUS} />
          <circle className="ring__value" cx="50" cy="50" r={RADIUS} strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - percent / 100)} />
        </svg>
        <span className="ring__label">{percent}%</span>
      </div>
      <div>
        <p className="day-progress__date">{dateLabel}</p>
        <p className="day-progress__detail">{done} de {total} hábitos cumplidos</p>
      </div>
    </section>
  );
}

function WeeklyRepeatsCard({ items }) {
  return (
    <section className="panel" aria-labelledby="repeats-title">
      <h2 id="repeats-title" className="panel__title">Se repiten esta semana</h2>
      <div className="repeat-list">
        {items.map((item) => (
          <div key={item.id}>
            <div className="repeat-item__head">
              <span>{item.title}</span>
              <span className="repeat-item__count">{item.week.filter(Boolean).length}/7 días</span>
            </div>
            <div className="week-bar" aria-hidden="true">
              {item.week.map((on, i) => <span key={i} className={on ? 'is-on' : ''} />)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ProgresoPendientesPage() {
  const { user, navBadges } = useLiteSession();
  const { days, selectedDay, selectDay, tasks, summary, weeklyRepeats, resumeTask } = useProgresoPendientes();

  return (
    <LiteLayout user={user} title="Lo que quedó pendiente" subtitle="Generado por el cierre diario de las 23:59" tabs={TABS} navBadges={navBadges}>
      <div className="days-row" role="group" aria-label="Días de la semana">
        {days.map((d) => <DayCard key={d.id} day={d} selected={d.id === selectedDay.id} onSelect={selectDay} />)}
      </div>

      <div className="progreso-grid">
        {tasks.length > 0 ? (
          <ul className="task-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {tasks.map((t) => <PendingTaskRow key={t.id} task={t} onResume={resumeTask} />)}
          </ul>
        ) : (
          <p className="empty">{selectedDay.pending === 0 ? 'Día limpio: no quedó nada pendiente.' : 'No hay detalle de pendientes para este día.'}</p>
        )}
        <div className="side-stack">
          <DayProgressCard {...summary} />
          <WeeklyRepeatsCard items={weeklyRepeats} />
        </div>
      </div>
    </LiteLayout>
  );
}
