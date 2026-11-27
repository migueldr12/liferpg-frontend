import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AUTH_MODE } from '../../../config/env';
import { useSession } from './SessionProvider';
import { SplashScreen } from '../components/AuthShell';

// Guardas de rutas: llevan a cada quien a la pantalla que le toca, como el layout raíz de la app móvil.

const LOGIN = '/acceso/login';
const CREAR = '/acceso/crear-cuenta';
const BIENVENIDA = '/acceso/bienvenida';

export const homeFor = (session) => (session.isAdmin ? '/admin/host' : '/lite/amigos');

/** Pantalla que le toca según su avance (null = ya puede entrar a la app). */
function pendingRoute(status) {
  if (status === 'anon') return LOGIN;
  if (status === 'needsAccount') return CREAR;
  if (status === 'needsPet') return BIENVENIDA;
  return null;
}

/** /lite y /admin: solo con sesión completa; /admin solo para administradores. */
export function RequireSession({ area }) {
  const session = useSession();
  if (session.status === 'loading') return <SplashScreen />;
  if (session.status === 'error') return <Navigate to="/acceso/error" replace />;
  const pending = pendingRoute(session.status);
  if (pending) return <Navigate to={pending} replace />;
  if (area === 'admin' && !session.canAdmin) return <Navigate to="/lite/amigos" replace />;
  return <Outlet />;
}

/** /acceso/*: Login, Crear cuenta, Recuperar y Bienvenida solo cuando corresponden. */
export function AccessGate() {
  const session = useSession();
  const { pathname } = useLocation();
  if (AUTH_MODE === 'dev') return <Navigate to="/" replace />;
  if (session.status === 'loading') return <SplashScreen />;
  if (session.status === 'ready') return <Navigate to={homeFor(session)} replace />;
  if (session.status === 'error') return pathname === '/acceso/error' ? <Outlet /> : <Navigate to="/acceso/error" replace />;
  const pending = pendingRoute(session.status);
  // Sin sesión se permite Login, Recuperar y Crear cuenta con correo; con sesión a medias, solo su paso
  const allowed = session.status === 'anon' ? [LOGIN, '/acceso/recuperar', CREAR] : [pending];
  if (!allowed.includes(pathname)) return <Navigate to={pending} replace />;
  return <Outlet />;
}
