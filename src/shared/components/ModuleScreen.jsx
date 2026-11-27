import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Icon } from './Icon';

export function ModuleTabs({ module, prefix }) {
  const { pathname } = useLocation();
  const base = `${prefix}/${module.path}`;
  const path = pathname.slice(base.length).replace(/^\/|\/$/g, '');
  const selected = module.screens.find((screen) => screen.path === path)?.path
    ?? (module.id === 'm09' && path ? 'detalle'
      : module.id === 'm07' && path.startsWith('perfil/') ? ''
        : module.id === 'm10' && path === 'avisos' ? '' : module.screens[0].path);
  return (
    <nav className="module-tabs" aria-label={`Secciones de ${module.label}`}>
      {module.screens.map((screen) => (
        <Link key={screen.label} to={`${base}${screen.path ? `/${screen.path}` : ''}`} aria-current={selected === screen.path ? 'page' : undefined} className={`module-tabs__link ${selected === screen.path ? 'module-tabs__link--active' : ''}`}>
          {screen.label}
        </Link>
      ))}
    </nav>
  );
}

export function ModuleScreen({ module, screen, prefix }) {
  const nextScreen = module.screens[(module.screens.indexOf(screen) + 1) % module.screens.length];

  return (
    <>
      <section className="empty-panel" aria-labelledby="pending-title">
        <div className="empty-panel__icon"><Icon name={module.icon} size={30} /></div>
        <span className="eyebrow">ESTRUCTURA LISTA</span>
        <h2 id="pending-title">{screen.label} está listo para construirse</h2>
        <p>Esta ruta ya utiliza el layout, el tema y la navegación compartidos. Aquí se integrará la pantalla del módulo {module.id.toUpperCase()}.</p>
        <NavLink className="text-link" to={`${prefix}/${module.path}${nextScreen.path ? `/${nextScreen.path}` : ''}`}>
          Ir a {nextScreen.label} <Icon name="arrow" size={17} />
        </NavLink>
      </section>
    </>
  );
}
