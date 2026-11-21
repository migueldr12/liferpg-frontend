import { NavLink } from 'react-router-dom';
import { ME } from '../api/diarioApi';
import { getLastViewedId } from '../hooks/useDetalleActividad';

// Encabezado compartido de las 3 pantallas del M09 (Perfil lite):
// tarjeta del usuario, título de la pantalla y pestañas entre vistas.
// "Detalle" lleva a la actividad abierta, o a la última que se vio.

export default function DiarioHeader({ title, subtitle, detailId }) {
  const tabs = [
    { to: '/lite/diario', label: 'Actividades', end: true },
    { to: `/lite/diario/${detailId ?? getLastViewedId()}`, label: 'Detalle' },
    { to: '/lite/diario/graficas', label: 'Gráficas' },
  ];

  return (
    <header className="m09-header">
      <div className="m09-user">
        <span className="m09-avatar" style={{ background: ME.color }} aria-hidden="true">{ME.avatar}</span>
        <span>
          <strong>{ME.fullName}</strong>
          <small>LV {ME.level}</small>
        </span>
      </div>
      <div className="m09-header-text">
        <h1 className="titulo-pixel">{title}</h1>
        <p className="texto-suave">{subtitle}</p>
      </div>
      <nav className="m09-tabs" aria-label="Secciones del diario">
        {tabs.map((t) => (
          <NavLink key={t.label} to={t.to} end={t.end} className={({ isActive }) => (isActive ? 'm09-tab activo' : 'm09-tab')}>
            {t.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
