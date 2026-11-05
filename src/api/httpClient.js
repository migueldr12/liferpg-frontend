import { API_URL } from '../config/env';

// Cliente HTTP base que usan todos los módulos: agrega la URL del backend,
// el token JWT y convierte las respuestas de error en excepciones.
export async function http(path, { method = 'GET', body } = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error((await res.text()) || `Error ${res.status}`);
  return res.status === 204 ? null : res.json();
}
