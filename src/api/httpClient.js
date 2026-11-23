import { API_URL, DEV_USER_ID } from '../config/env';

// Cliente HTTP base que usan todos los módulos: agrega la URL del backend,
// el token JWT (o el usuario de prueba x-user-id mientras no hay login) y
// convierte las respuestas de error en excepciones con el mensaje del servidor.
export async function http(path, { method = 'GET', body } = {}) {
  const token = localStorage.getItem('token');
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(!token && DEV_USER_ID && { 'x-user-id': DEV_USER_ID }),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('No hay conexión con el servidor.');
  }
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
