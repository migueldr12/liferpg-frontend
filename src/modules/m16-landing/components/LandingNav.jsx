import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../../../shared/components/Icon';
import { PixelMascot } from '../../../shared/components/PixelMascot';
import { NAV_LINKS } from '../api/landingContent';

export function LandingNav({ theme, onToggleTheme }) {
  const menu = useRef(null);

  function closeMenu(event) {
    if (event.key === 'Escape' && menu.current.open) {
      menu.current.open = false;
      menu.current.querySelector('summary').focus();
    }
  }

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
        <details ref={menu} className="lp-nav__menu" onKeyDown={closeMenu}>
          <summary>Secciones <Icon name="chevron" size={15} /></summary>
          <nav aria-label="Secciones de la página">
            {NAV_LINKS.map((link) => <a key={link.href} href={link.href} onClick={() => { menu.current.open = false; }}>{link.label}</a>)}
          </nav>
        </details>
        <button
          className="theme-toggle"
          type="button"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
          title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
        >
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={19} />
        </button>
        <Link className="lp-btn lp-btn--primary lp-btn--sm" to="/lite/amigos">Entrar</Link>
      </div>
    </header>
  );
}
