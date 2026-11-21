import { NavLink } from 'react-router-dom';
import { ME } from '../api/botinApi';

// Encabezado compartido de las 3 pantallas del M08 (Perfil lite):
// tarjeta del usuario, título de la pantalla y pestañas entre vistas.

const TABS = [
  { to: '/lite/botin/cofre', label: 'Cofre' },
  { to: '/lite/botin/solicitudes', label: 'Solicitudes' },
  { to: '/lite/botin/historial', label: 'Historial' },
];

export default function BotinHeader({ title, subtitle }) {
  return (
    <header className="m08-header">
      <div className="m08-user">
        <span className="m08-avatar" style={{ background: ME.color }} aria-hidden="true">{ME.avatar}</span>
        <span>
          <strong>{ME.fullName}</strong>
          <small>LV {ME.level}</small>
        </span>
      </div>
      <div className="m08-header-text">
        <h1 className="titulo-pixel">{title}</h1>
        <p className="texto-suave">{subtitle}</p>
      </div>
      <nav className="m08-tabs" aria-label="Secciones del botín">
        {TABS.map((t) => (
          <NavLink key={t.to} to={t.to} className={({ isActive }) => (isActive ? 'm08-tab activo' : 'm08-tab')}>
            {t.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
