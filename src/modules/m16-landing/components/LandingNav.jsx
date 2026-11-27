import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../../../shared/components/Icon';
import { PixelMascot } from '../../../shared/components/PixelMascot';
import { NAV_LINKS } from '../api/landingContent';

export function LandingNav({ theme, onToggleTheme }) {
  return (
    <header className="lp-nav">
      <a className="lp-brand" href="#inicio" aria-label="Life-RPG, ir al inicio">
        <span className="lp-brand__mark"><PixelMascot size={30} label="" /></span>
        <span className="lp-brand__name">Life-RPG</span>
      </a>
      <nav className="lp-nav__links" aria-label="Secciones de la página">
        {NAV_LINKS.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
      </nav>
      <div className="lp-nav__actions">
        <button
          className="theme-toggle"
          type="button"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
          title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
        >
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={19} />
        </button>
        <Link className="lp-btn lp-btn--primary lp-btn--sm" to="/lite/amigos">Abrir la PWA</Link>
      </div>
    </header>
  );
}
