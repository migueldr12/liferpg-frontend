import { useCallback, useEffect, useState } from 'react';

// Los endpoints administrativos se habilitan al implementar sus rutas en el backend.
export const adminApiEnabled = import.meta.env.VITE_ADMIN_API_ENABLED === 'true';
const baseUrl = (import.meta.env.VITE_API_URL || '/api/v1').replace(/\/$/, '');

export async function adminRequest(path, options = {}) {
  const response = await fetch(`${baseUrl}/admin/${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!response.ok) throw new Error(`La API respondió ${response.status}. Intenta de nuevo.`);
  return response.status === 204 ? null : response.json();
}

export function useAdminResource(path, demoData, refreshMs = 0) {
  const [data, setData] = useState(adminApiEnabled ? null : demoData);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(adminApiEnabled);
  const refresh = useCallback(async ({ silent = false } = {}) => {
    if (!adminApiEnabled) return;
    if (!silent) setLoading(true);
    try {
      setData(await adminRequest(path));
      setError('');
    } catch (cause) {
      setError(cause.message);
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    if (!adminApiEnabled) return undefined;
    refresh();
    if (!refreshMs) return undefined;
    const timer = window.setInterval(() => refresh({ silent: true }), refreshMs);
    return () => window.clearInterval(timer);
  }, [refresh, refreshMs]);

  return { data, error, loading, refresh };
}
