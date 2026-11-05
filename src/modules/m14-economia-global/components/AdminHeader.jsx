import { NavLink } from 'react-router-dom';

// Encabezado compartido de las 3 pantallas del M14:
// insignia de administrador, título de la pantalla y pestañas entre vistas.

const TABS = [
  { to: '/admin/economia/curva', label: 'Curva XP' },
  { to: '/admin/economia/catalogo', label: 'Catálogo' },
  { to: '/admin/economia/push', label: 'Push' },
];

export default function AdminHeader({ title, subtitle }) {
  return (
    <header className="m14-header">
      <div className="m14-badge">
        <span className="m14-badge-icon" aria-hidden="true">🛡️</span>
        <span>
          <strong>Admin</strong>
          <small>GAME MASTER</small>
        </span>
      </div>
      <div className="m14-header-text">
        <h1 className="titulo-pixel">{title}</h1>
        <p className="texto-suave">{subtitle}</p>
      </div>
      <nav className="m14-tabs" aria-label="Secciones de economía">
        {TABS.map((t) => (
          <NavLink key={t.to} to={t.to} className={({ isActive }) => (isActive ? 'm14-tab activo' : 'm14-tab')}>
            {t.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
