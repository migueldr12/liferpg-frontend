import React from 'react';
import { Icon } from '../../../shared/components/Icon';
import { PixelMascot } from '../../../shared/components/PixelMascot';
import './ficha-companero.css';

const areas = [['cultura', 'Cultura', 'book'], ['fisico', 'Físico', 'dumbbell'], ['enfoque', 'Enfoque', 'target']];
const number = new Intl.NumberFormat('es-MX');

export function CompanionSheet({ name, alias, level, streak, mascot, points, caption, expanded = false, className = '', children }) {
  const species = mascot?.pet?.toLowerCase();
  return <article className={`companion-sheet${expanded ? ' companion-sheet--expanded' : ''} ${className}`} aria-label={`Ficha de ${name}`}>
    <header className="companion-sheet__identity">
      <div className="companion-sheet__portrait" data-pet={species}>
        {mascot ? <PixelMascot {...mascot} width={expanded ? 160 : 76} height={expanded ? 118 : 72} label={mascot.name ? `${mascot.name}, mascota de ${name}` : `Mascota de ${name}`} /> : <Icon name="shield" size={44} />}
        {level != null && <span>Nivel {level}</span>}
      </div>
      <div className="companion-sheet__name">
        {caption && <span className="companion-sheet__caption">{caption}</span>}
        <h2>{name}</h2>
        {alias && <p>{alias}</p>}
        {expanded && mascot?.name && <p>{mascot.name}{mascot.title && ` · ${mascot.title}`}</p>}
        {streak != null && <span className="companion-sheet__streak"><Icon name="flame" size={17} /> {streak} {streak === 1 ? 'día' : 'días'} de racha</span>}
      </div>
    </header>
    {points && <dl className="companion-sheet__points" aria-label="Puntos acumulados">
      {areas.map(([key, label, icon]) => <div key={key} className={`companion-sheet__area companion-sheet__area--${key}`}>
        <dt><Icon name={icon} size={15} />{label}</dt><dd>{points[key] == null ? '—' : number.format(points[key])}</dd>
      </div>)}
    </dl>}
    {children}
  </article>;
}
