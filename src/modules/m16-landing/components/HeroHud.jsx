import React from 'react';
import { Icon } from '../../../shared/components/Icon';

// Visual del hero: las cinco mascotas del juego juntas en el bosque, con el HUD que el
// jugador ve en la Casa de la app móvil. Valores ilustrativos.
const STATS = [
  { label: 'HP', value: 82, tone: 'hp' },
  { label: 'XP', value: 64, tone: 'xp' },
];

export function HeroHud() {
  return (
    <figure className="lp-hud" aria-label="Las mascotas de Life-RPG juntas, con la vitalidad y experiencia de un jugador">
      <div className="lp-hud__stage">
        <img
          src="/landing/amigosjuntos-1400.webp"
          srcSet="/landing/amigosjuntos-800.webp 800w, /landing/amigosjuntos-1400.webp 1400w"
          sizes="(max-width: 860px) 100vw, 560px"
          alt="Perro, gato, dragón, hámster y león en un bosque pixel art"
          width="1400"
          height="781"
          fetchPriority="high"
        />
      </div>
      <figcaption className="lp-hud__panel">
        <div className="lp-hud__who">
          <strong>Yess</strong>
          <span>LV 14</span>
        </div>
        {STATS.map((s) => (
          <div key={s.label} className="lp-bar">
            <span className="lp-bar__label">{s.label}</span>
            <span className="lp-bar__track"><span className={`lp-bar__fill lp-bar__fill--${s.tone}`} style={{ width: `${s.value}%` }} /></span>
          </div>
        ))}
        <div className="lp-hud__coins"><Icon name="coins" size={16} /> 340 monedas</div>
      </figcaption>
    </figure>
  );
}
