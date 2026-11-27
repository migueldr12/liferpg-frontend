import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../../../shared/components/Icon';
import { useTutorial } from '../hooks/useTutorial';

const PLATFORMS = [
  { value: 'mobile', label: 'App móvil' },
  { value: 'web', label: 'PWA web' },
];

// Tutorial interactivo: a la izquierda los pasos, a la derecha la vista del paso activo.
// Móvil muestra la mascota de cada paso; web muestra capturas reales de la PWA.
export function TutorialExplorer() {
  const { platform, setPlatform, steps, index, setIndex, step } = useTutorial();

  return (
    <div className="lp-tutorial">
      <div className="lp-switch" role="tablist" aria-label="Plataforma del tutorial">
        {PLATFORMS.map((p) => (
          <button
            key={p.value}
            type="button"
            role="tab"
            aria-selected={platform === p.value}
            className={`lp-switch__btn ${platform === p.value ? 'is-active' : ''}`}
            onClick={() => setPlatform(p.value)}
          >
            <Icon name={p.value === 'mobile' ? 'heart' : 'chart'} size={17} />
            {p.label}
          </button>
        ))}
      </div>

      <div className="lp-tutorial__body">
        <ol className="lp-steps">
          {steps.map((s, i) => (
            <li key={s.title}>
              <button
                type="button"
                className={`lp-step ${i === index ? 'is-active' : ''}`}
                aria-current={i === index ? 'step' : undefined}
                onClick={() => setIndex(i)}
              >
                <span className="lp-step__num">{i + 1}</span>
                <span className="lp-step__text">
                  <strong>{s.title}</strong>
                  <span>{s.text}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>

        <div className="lp-preview" aria-live="polite">
          {platform === 'mobile' ? (
            <div className="lp-preview__pet" key={step.title}>
              <img src={`/icons/${step.pet}.png`} alt={`Mascota ${step.pet} de Life-RPG`} width="220" height="220" />
              <p className="lp-preview__caption">
                <Icon name={step.icon} size={18} />
                {step.title}
              </p>
            </div>
          ) : (
            <div className="lp-preview__shot" key={step.title}>
              <div className="lp-frame">
                <div className="lp-frame__bar" aria-hidden="true">
                  <code>{step.path}</code>
                </div>
                <img src={step.shot} alt={`Captura de la sección ${step.title} de la PWA`} loading="lazy" width="1280" height="800" />
              </div>
              <Link className="lp-textlink" to={step.path}>Probar {step.title} <Icon name="arrow" size={16} /></Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
