import React from 'react';
import { Icon } from '../../../../shared/components/Icon';
import LiteLayout, { PixelAvatar, SegmentedTabs } from '../../components/lite/LiteShell';
import { useLiteSession, useRacha } from '../../hooks/useLite';

const TABS = [
  { to: '/lite/progreso', label: 'Pendientes' },
  { to: '/lite/progreso/inactividad', label: 'Días rojos' },
  { to: '/lite/progreso/racha', label: 'Racha' },
];
// Vista previa de estado (solo para revisar el diseño; con la API el estado se deriva de los datos)
const STATE_TABS = [
  { value: 'active', label: 'Activa' },
  { value: 'atRisk', label: 'En riesgo' },
  { value: 'broken', label: 'Rota' },
];

function copyFor(status, { current, previous, best, checkinTime }) {
  if (status === 'active') {
    return {
      chip: `Activa · check-in hoy ${checkinTime}`,
      message: `¡Sigue así! Estás a ${best - current} días de igualar tu récord.`,
      bubble: `¡Vamos por el día ${current + 1}!`,
    };
  }
  if (status === 'atRisk') {
    return {
      chip: 'En riesgo · sin check-in hoy',
      message: `Haz tu check-in antes de las 23:59 para no perder tus ${current} días.`,
      bubble: '¡Aún estás a tiempo!',
    };
  }
  return {
    chip: 'Rota',
    message: `Tu racha anterior fue de ${previous} días. ¡Empieza una nueva hoy!`,
    bubble: '¡Empezamos de nuevo!',
  };
}

export default function ProgresoRachaPage() {
  const { user, navBadges } = useLiteSession();
  const racha = useRacha();
  const { status, setStatus, current, best, history, rangeLabel, secondaryLabel, secondaryValue } = racha;
  const copy = copyFor(status, racha);

  return (
    <LiteLayout user={user} title="Tu racha" subtitle="Días seguidos con al menos un check-in" tabs={TABS} navBadges={navBadges}>
      <div className="preview-bar">
        VISTA PREVIA DE ESTADO
        <SegmentedTabs items={STATE_TABS} value={status} onChange={setStatus} ariaLabel="Estado de la racha" size="sm" />
      </div>

      <div className="racha-grid">
        <div className="racha-left">
          <section className="panel streak-card" aria-label="Racha actual">
            <div className={`streak-flame streak-flame--${status}`}>
              <Icon name="flame" size={64} />
            </div>
            <div>
              <span className={`streak-chip streak-chip--${status}`}>{copy.chip}</span>
              <div className="streak-number">
                {current}
                <small>{current === 1 ? 'día' : 'días'}</small>
              </div>
              <p className="streak-msg">{copy.message}</p>
            </div>
          </section>

          <section className="panel" aria-label="Últimos 21 días">
            <div className="panel__head">
              <h2 className="panel__title">ÚLTIMOS 21 DÍAS</h2>
              <span className="panel__range">{rangeLabel}</span>
            </div>
            <div className="days21">
              {history.map((on, i) => (
                <span
                  key={i}
                  className={`day21${on ? ' is-on' : ''}${i === history.length - 1 ? ' is-today' : ''}`}
                  title={on ? 'Con check-in' : 'Sin check-in'}
                />
              ))}
            </div>
          </section>
        </div>

        <div className="racha-right">
          <div className="scene" aria-label="Tu mascota">
            <p className="scene__bubble">{copy.bubble}</p>
            <PixelAvatar size={140} tone="#8e24aa" variant={status === 'active' ? 0 : status === 'atRisk' ? 1 : 2} />
          </div>
          <div className="stat-row">
            <div className="stat">
              <span className="stat__label">Mejor racha</span>
              <span className="stat__value stat__value--gold">{best} días</span>
            </div>
            <div className="stat">
               <span className="stat__label">{secondaryLabel}</span>
               <span className="stat__value">{secondaryValue}</span>
            </div>
          </div>
        </div>
      </div>
    </LiteLayout>
  );
}
