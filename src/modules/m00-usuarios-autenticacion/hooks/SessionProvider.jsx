import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AUTH_MODE } from '../../../config/env';
import { observeAuth, signOut as firebaseSignOut } from '../api/authService';
import { getCuenta, getSesion } from '../api/cuenta.api';

// Sesión de la PWA (M00). Mismo recorrido que la app móvil (app/_layout.tsx):
//   loading      → Firebase aún restaura la sesión guardada (pantalla de carga)
//   anon         → sin sesión: Iniciar sesión / Crear cuenta / Recuperar
//   needsAccount → entró pero no llena "Crear cuenta"
//   needsPet     → ya tiene cuenta pero no eligió mascota ("Bienvenido a Life-RPG")
//   ready        → entra a la app
//   error        → el servidor no pudo identificarlo (se puede reintentar o cerrar sesión)
// Los administradores (role ADMIN) entran sin cuenta de jugador ni mascota.
// Sin configuración de Firebase (modo "dev") no hay login: entra con el usuario de DEV_USER_ID.

const SessionContext = createContext(null);
export const useSession = () => useContext(SessionContext);

function statusFrom(sesion) {
  if (sesion.role === 'ADMIN') return 'ready';
  if (!sesion.hasAccount) return 'needsAccount';
  if (!sesion.pet) return 'needsPet';
  return 'ready';
}

export function SessionProvider({ children }) {
  const [state, setState] = useState({ status: 'loading', user: null, sesion: null, cuenta: null, error: null });
  const userRef = useRef(null);

  // Carga rol y avance del alta; con cuenta completa trae también su perfil.
  // El estado anterior se conserva mientras carga: así Login / Crear cuenta no se desmontan a medias.
  const load = useCallback(async (user) => {
    try {
      const sesion = await getSesion();
      const status = statusFrom(sesion);
      const cuenta = sesion.hasAccount ? await getCuenta().catch(() => null) : null;
      if (userRef.current === user) setState({ status, user, sesion, cuenta, error: null });
    } catch (e) {
      if (userRef.current === user) setState({ status: 'error', user, sesion: null, cuenta: null, error: e.message });
    }
  }, []);

  useEffect(() => {
    if (AUTH_MODE === 'dev') {
      // Sin login: siempre entra (con el usuario de DEV_USER_ID si el backend lo reconoce)
      getSesion().catch(() => null).then((sesion) => setState({ status: 'ready', user: null, sesion, cuenta: null, error: null }));
      return undefined;
    }
    return observeAuth((user) => {
      userRef.current = user;
      if (!user) setState({ status: 'anon', user: null, sesion: null, cuenta: null, error: null });
      else load(user);
    });
  }, [load]);

  const refresh = useCallback(() => load(userRef.current), [load]);
  const logout = useCallback(async () => {
    await firebaseSignOut();
    // Recarga completa: borra lo que el usuario anterior dejó en memoria (módulos, cachés)
    window.location.assign('/acceso/login');
  }, []);

  const value = useMemo(() => ({ ...state, isAdmin: state.sesion?.role === 'ADMIN', canAdmin: AUTH_MODE === 'dev' || state.sesion?.role === 'ADMIN', refresh, logout }), [state, refresh, logout]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
