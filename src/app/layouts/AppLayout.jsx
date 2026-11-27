import { PixelMascot } from '../../shared/components/PixelMascot';
import React, { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Icon } from '../../shared/components/Icon';
import { ModuleTabs } from '../../shared/components/ModuleScreen';
import { adminModules, liteModules } from '../router/modules';
import { http } from '../../api/httpClient';
import { AUTH_MODE } from '../../config/env';
import { useSession } from '../../modules/m00-usuarios-autenticacion/hooks/SessionProvider';
import './workspace.css';

function getInitialTheme() {
  try {
    return localStorage.getItem('liferpg-theme') === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export function AppLayout({ variant }) {
  const isAdmin = variant === 'admin';
  const modules = isAdmin ? adminModules : liteModules;
  const prefix = isAdmin ? '/admin' : '/lite';
  const { pathname } = useLocation();
  const current = modules.find((module) => pathname === `${prefix}/${module.path}` || pathname.startsWith(`${prefix}/${module.path}/`)) ?? modules[0];
  const subpath = pathname.slice(`${prefix}/${current.path}`.length).replace(/^\/|\/$/g, '');
  const isFriendProfile = current.id === 'm07' && subpath.startsWith('perfil/');
  const screen = current.screens.find((item) => item.path === subpath)
    ?? (isFriendProfile ? { title: 'Ficha de compañero', subtitle: 'Consulta el progreso que tu amigo comparte contigo.' } : undefined)
    ?? (current.id === 'm09' && subpath ? current.screens.find((item) => item.path === 'detalle') : current.screens[0]);
  const [theme, setTheme] = useState(getInitialTheme);
  const [miPerfil, setMiPerfil] = useState(null);
  const session = useSession();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0a0e1c' : '#f3f5fa');
    try {
      localStorage.setItem('liferpg-theme', theme);
    } catch {
      // La preferencia sigue funcionando durante esta sesión.
    }
  }, [theme]);

  // Mascota y nivel del jugador: GET /tamagotchi (especie, color, nivel y prendas equipadas)
  useEffect(() => {
    setMiPerfil(null);
    if (isAdmin || !session.user && AUTH_MODE !== 'dev') return undefined;
    let cancelled = false;
    http('/tamagotchi').then((data) => { if (!cancelled) setMiPerfil(data); }).catch(() => {
      // El perfil puede no existir todavía o la API puede no estar disponible.
    });
    return () => { cancelled = true; };
  }, [isAdmin, session.user]);

  const cuenta = session.cuenta;
  const mascotProps = miPerfil
    ? { pet: miPerfil.species, color: miPerfil.color, equipped: Object.values(miPerfil.equipped ?? {}) }
    : cuenta ? { pet: cuenta.pet, color: cuenta.petColor } : {};

  const displayName = isAdmin ? 'Admin' : (cuenta?.firstName || session.sesion?.displayName || 'Jugador');
  const displayLevel = isAdmin ? 'Game Master' : miPerfil?.level != null ? `Nivel ${miPerfil.level}` : 'Perfil';
  const ProfileChip = isAdmin ? 'div' : Link;

  return (
    <div className={`app-shell ${isAdmin ? 'app-shell--admin' : ''}`} data-chapter={current.path}>
      <a className="skip-link" href="#main-content">Ir al contenido</a>
      <header className="workspace-masthead">
        <div className="workspace-masthead__inner">
          <Link className="workspace-brand" to="/" aria-label="Life-RPG, inicio">
            <Icon name={isAdmin ? 'shield' : 'book'} size={21} /> Life-RPG
          </Link>
          <div className="workspace-account">
            <ProfileChip className="profile-chip" {...(!isAdmin && { to: '/lite/amigos/perfil', 'aria-label': 'Abrir mi perfil espejo' })}>
              <span className={`profile-chip__avatar ${isAdmin ? 'profile-chip__avatar--admin' : ''}`}>
                {isAdmin ? <Icon name="shield" size={22} /> : <PixelMascot {...mascotProps} width={32} height={30} label="Tu mascota" />}
              </span>
              <span className="profile-chip__identity">
                <strong>{displayName}</strong>
                <small>{displayLevel}</small>
              </span>
            </ProfileChip>
            <button className="theme-toggle" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'} title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}>
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={19} />
            </button>
            {session.user && (
              <button className="theme-toggle" type="button" onClick={() => session.logout()} aria-label="Cerrar sesión" title="Cerrar sesión">
                <Icon name="logout" size={19} />
              </button>
            )}
          </div>
        </div>
      </header>
      <main className="workspace" id="main-content" tabIndex={-1}>
        <header className="chapter">
          <div className="chapter__cover">
            <div>
              <p className="chapter__index">{isAdmin ? 'Administración' : 'Cuaderno de aventura'} <span aria-hidden="true">/</span> {current.label}</p>
              <h1>{screen.title ?? screen.label}</h1>
              <p className="chapter__description">{screen.subtitle ?? current.description}</p>
            </div>
            <div className="chapter__seal" aria-hidden="true"><Icon name={current.icon} size={38} /></div>
          </div>
          <ModuleTabs module={current} prefix={prefix} />
        </header>
        <div className="workspace__body"><Outlet /></div>
      </main>

      <nav className="bottom-dock" aria-label={isAdmin ? 'Navegación de administración' : 'Navegación del perfil lite'}>
        {modules.map((module) => (
          <NavLink key={module.id} to={`${prefix}/${module.path}`} className={({ isActive }) => `bottom-dock__link ${isActive ? 'bottom-dock__link--active' : ''}`}>
            <span className="bottom-dock__icon">
              <Icon name={module.icon} size={24} />
            </span>
            <span>{module.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
