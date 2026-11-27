// Variables de entorno de la PWA (archivo .env, ver .env.example)
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1';

// Módulos que ya hablan con el backend real, separados por coma (p. ej. "economia,retos").
// Los que no estén aquí siguen con sus datos simulados en memoria.
export const API_MODULES = (import.meta.env.VITE_API_MODULES ?? '')
  .split(',')
  .map((m) => m.trim())
  .filter(Boolean);

export const usaApi = (modulo) =>
  API_MODULES.includes('todos') || API_MODULES.includes(modulo);

// PROVISIONAL mientras no exista el inicio de sesión (M00): id de MongoDB del usuario de
// prueba que se manda en el encabezado x-user-id (el backend solo lo acepta fuera de producción).
export const DEV_USER_ID = import.meta.env.VITE_DEV_USER_ID || null;
