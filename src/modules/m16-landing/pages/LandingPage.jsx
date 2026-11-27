import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../../../shared/components/Icon';
import { LandingNav } from '../components/LandingNav';
import { HeroHud } from '../components/HeroHud';
import { TutorialExplorer } from '../components/TutorialExplorer';
import { useLandingTheme } from '../hooks/useLandingTheme';
import { FAQ, GAME_LOOP, POINT_TYPES } from '../api/landingContent';
import '../components/landing.css';

// M16 · Landing: explica qué es Life-RPG y cómo se usa en el celular y en la web.
export default function LandingPage() {
  const { theme, toggle } = useLandingTheme();

  return (
    <div className="m16">
      <a className="skip-link" href="#contenido">Ir al contenido</a>
      <LandingNav theme={theme} onToggleTheme={toggle} />

      <main id="contenido" tabIndex={-1}>
        {/* Hero */}
        <section className="lp-hero" id="inicio">
          <div className="lp-hero__copy">
            <h1><span>Tu vida diaria,</span> <span>jugada como un RPG.</span></h1>
            <p>Cumple hábitos, gana experiencia y cuida a tu mascota. Tu party te acompaña desde el celular y la web.</p>
            <div className="lp-hero__ctas">
              <Link className="lp-btn lp-btn--primary" to="/lite/amigos">Entrar a Life-RPG</Link>
              <a className="lp-btn lp-btn--ghost" href="#tutorial">Ver tutorial</a>
            </div>
          </div>
          <HeroHud />
        </section>

        {/* Qué es */}
        <section className="lp-section lp-about" id="que-es" aria-labelledby="que-es-title">
          <div className="lp-about__lead">
            <h2 id="que-es-title">Un juego donde el personaje mejora cuando tú mejoras.</h2>
            <p>
              Life-RPG convierte tus rutinas en misiones. Cada hábito cumplido se vuelve experiencia,
              monedas y vitalidad para tu mascota. Sirve para construir constancia sin hojas de cálculo
              ni recordatorios fríos, y para hacerlo acompañado de tus amigos.
            </p>
          </div>
          <ul className="lp-points" aria-label="Tipos de puntos">
            {POINT_TYPES.map((p) => (
              <li key={p.key} className={`lp-point lp-point--${p.key}`}>
                <span className="lp-point__icon"><Icon name={p.icon} size={22} /></span>
                <div>
                  <strong>{p.label}</strong>
                  <p>{p.example}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Cómo funciona */}
        <section className="lp-section" id="como-funciona" aria-labelledby="loop-title">
          <div className="lp-heading">
            <h2 id="loop-title">Así es un día en Life-RPG</h2>
            <p>El ciclo se repite cada día. Las reglas (experiencia, monedas, vitalidad) las calcula el servidor, así que valen igual en el celular y en la web.</p>
          </div>
          <ol className="lp-loop">
            {GAME_LOOP.map((step) => (
              <li key={step.title} className="lp-loop__item">
                <span className="lp-loop__icon"><Icon name={step.icon} size={22} /></span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Tutorial */}
        <section className="lp-section" id="tutorial" aria-labelledby="tutorial-title">
          <div className="lp-heading">
            <span className="eyebrow">TUTORIAL</span>
            <h2 id="tutorial-title">Recorre la app paso a paso</h2>
            <p>Elige la plataforma y toca cada paso. En la web puedes saltar directo a la pantalla real.</p>
          </div>
          <TutorialExplorer />
        </section>

        {/* Móvil vs web */}
        <section className="lp-section lp-compare" aria-labelledby="compare-title">
          <h2 id="compare-title">Dos pantallas, una misma partida</h2>
          <div className="lp-compare__grid">
            <article className="lp-compare__col">
              <h3><Icon name="heart" size={20} /> En el celular juegas</h3>
              <ul>
                <li>Check-in de hábitos y misiones</li>
                <li>Modo enfoque con temporizador</li>
                <li>Cuidar a tu mascota y vestirla</li>
                <li>Tienda, logros y registro de ánimo</li>
                <li>Recordatorio diario en el teléfono</li>
              </ul>
            </article>
            <article className="lp-compare__col lp-compare__col--web">
              <h3><Icon name="friends" size={20} /> En la web convives</h3>
              <ul>
                <li>Ver tu Perfil espejo y las fichas de tu party</li>
                <li>Regalar objetos del cofre</li>
                <li>Revisar tu diario con gráficas</li>
                <li>Mandar stickers de ánimo</li>
                <li>Retos y métricas de grupo</li>
              </ul>
            </article>
          </div>
          <p className="lp-compare__note"><Icon name="refresh" size={16} /> Todo se sincroniza con el mismo servidor: lo que haces en uno aparece en el otro.</p>
        </section>

        {/* Preguntas */}
        <section className="lp-section lp-faq" id="preguntas" aria-labelledby="faq-title">
          <h2 id="faq-title">Preguntas frecuentes</h2>
          <div className="lp-faq__list">
            {FAQ.map((item) => (
              <details key={item.q} className="lp-faq__item">
                <summary>{item.q}<Icon name="chevron" size={18} className="lp-faq__chev" /></summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Cierre */}
        <section className="lp-cta" aria-labelledby="cta-title">
          <div className="lp-cta__pets" aria-hidden="true">
            {['gato', 'perro', 'hamster', 'leon'].map((pet) => <img key={pet} src={`/icons/${pet}.png`} alt="" width="72" height="72" />)}
          </div>
          <h2 id="cta-title">Tu party ya está jugando.</h2>
          <p>Entra a la PWA para ver su progreso, o abre la app móvil para hacer tu primer check-in.</p>
          <Link className="lp-btn lp-btn--primary" to="/lite/amigos">Entrar a Life-RPG</Link>
        </section>
      </main>

      <footer className="lp-footer">
        <span>Life-RPG</span>
        <span>App móvil, PWA web y un mismo servidor para tu progreso.</span>
      </footer>
    </div>
  );
}
