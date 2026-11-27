// Variables de entorno de la PWA (archivo .env, ver .env.example)
export const API_URL =
  import.meta.env.VITE_API_URL ??
  "https://liferpg-backend-56d5.onrender.com/api/v1";

// Módulos que ya hablan con el backend real, separados por coma (p. ej. "economia,retos").
// Los que no estén aquí siguen con sus datos simulados en memoria.
export const API_MODULES = (import.meta.env.VITE_API_MODULES ?? "todos")
  .split(",")
  .map((m) => m.trim())
  .filter(Boolean);

export const usaApi = (modulo) =>
  API_MODULES.includes("todos") || API_MODULES.includes(modulo);

// PROVISIONAL mientras no exista el inicio de sesión (M00): id de MongoDB del usuario de
// prueba que se manda en el encabezado x-user-id (el backend solo lo acepta fuera de producción).
export const DEV_USER_ID = import.meta.env.VITE_DEV_USER_ID || null;

// Firebase Authentication (M00): mismo proyecto que la app móvil. Si falta la configuración
// la PWA entra en modo desarrollo: sin pantalla de login, con x-user-id (DEV_USER_ID).
export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
export const FIREBASE_ENABLED = Boolean(FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.projectId && FIREBASE_CONFIG.appId);
export const AUTH_MODE = FIREBASE_ENABLED ? 'firebase' : 'dev';
