import { API_URL, DEV_USER_ID, FIREBASE_ENABLED } from '../config/env';
import { getIdToken } from '../modules/m00-usuarios-autenticacion/api/authService';

// Cliente HTTP base que usan todos los módulos: agrega la URL del backend y quién eres
// (token de Firebase; en modo desarrollo sin Firebase, el usuario de prueba x-user-id) y
// convierte las respuestas de error en excepciones con el mensaje del servidor.

/** Encabezados de identidad. También los usan adminClient y las descargas directas. */
export async function authHeaders(forceRefresh = false) {
  if (FIREBASE_ENABLED) {
    const token = await getIdToken(forceRefresh);
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  return DEV_USER_ID ? { 'x-user-id': DEV_USER_ID } : {};
}

async function send(path, { method, body }, forceRefresh) {
  try {
    return await fetch(`${API_URL}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', ...(await authHeaders(forceRefresh)) },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('No hay conexión con el servidor.');
  }
}

export async function http(path, { method = 'GET', body } = {}) {
  let res = await send(path, { method, body }, false);
  // El token de Firebase caduca cada hora: si el servidor lo rechaza, se renueva y se reintenta una vez
  if (res.status === 401 && FIREBASE_ENABLED) res = await send(path, { method, body }, true);
  if (!res.ok) {
    // El backend responde { "error": "mensaje en español", "code": "..." }
    const text = await res.text();
    let message = text || `Error ${res.status}`;
    try {
      message = JSON.parse(text).error ?? message;
    } catch {
      // No era JSON: se usa el texto tal cual
    }
    throw Object.assign(new Error(message), { status: res.status });
  }
  return res.status === 204 ? null : res.json();
}
