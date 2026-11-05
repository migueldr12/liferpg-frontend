import { NavLink } from 'react-router-dom';
import { ME } from '../api/retosApi';

// Encabezado compartido de las 3 pantallas del M12 (Perfil lite):
// tarjeta del usuario, título de la pantalla y pestañas entre vistas.

const TABS = [
  { to: '/lite/retos', label: 'Retos', end: true },
  { to: '/lite/retos/metricas', label: 'Métricas' },
  { to: '/lite/retos/por-area', label: 'Por área' },
];

export default function LiteHeader({ title, subtitle }) {
  return (
    <header className="m12-header">
      <div className="m12-user">
        <span className="m12-avatar" style={{ background: ME.color }} aria-hidden="true">{ME.avatar}</span>
        <span>
          <strong>{ME.fullName}</strong>
          <small>LV {ME.level}</small>
        </span>
      </div>
      <div className="m12-header-text">
        <h1 className="titulo-pixel">{title}</h1>
        <p className="texto-suave">{subtitle}</p>
      </div>
      <nav className="m12-tabs" aria-label="Secciones de retos">
        {TABS.map((t) => (
          <NavLink key={t.to} to={t.to} end={t.end} className={({ isActive }) => (isActive ? 'm12-tab activo' : 'm12-tab')}>
            {t.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
