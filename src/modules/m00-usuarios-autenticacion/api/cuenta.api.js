import { http } from '../../../api/httpClient';

// Cuenta del jugador (M00). Rutas del backend: /usuarios/me/sesion, /me/cuenta y /me/mascota.

/** Rol y avance del alta: { role, email, displayName, hasAccount, pet }. Funciona sin cuenta del juego. */
export const getSesion = () => http('/usuarios/me/sesion');

/** RDF001 · datos de "Crear cuenta". La mascota se elige después (PUT /me/mascota). */
export const crearCuenta = (datos) => http('/usuarios/me/cuenta', { method: 'POST', body: datos });

export const elegirMascota = (pet) => http('/usuarios/me/mascota', { method: 'PUT', body: { pet } });

export const getCuenta = () => http('/usuarios/me/cuenta');
