import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Icon } from './Icon';

export function ModuleTabs({ module, prefix }) {
  const { pathname } = useLocation();
  return (
    <nav className="module-tabs" aria-label={`Secciones de ${module.label}`}>
      {module.screens.map((screen) => (
        <NavLink key={screen.label} to={`${prefix}/${module.path}${screen.path ? `/${screen.path}` : ''}`} end className={({ isActive }) => `module-tabs__link ${isActive || (module.id === 'm09' && screen.path === 'detalle' && pathname.startsWith('/lite/diario/') && pathname !== '/lite/diario/graficas') ? 'module-tabs__link--active' : ''}`}>
          {screen.label}
        </NavLink>
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
