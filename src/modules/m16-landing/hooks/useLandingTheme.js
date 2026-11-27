import { useEffect, useState } from 'react';

// La landing vive fuera de AppLayout, así que maneja el mismo tema claro/oscuro con la
// misma clave de localStorage: al entrar a la PWA se conserva la preferencia.
const KEY = 'liferpg-theme';

function readTheme() {
  try {
    return localStorage.getItem(KEY) === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export function useLandingTheme() {
  const [theme, setTheme] = useState(readTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0a0e1c' : '#f3f5fa');
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      // Sin almacenamiento la preferencia dura solo esta sesión.
    }
  }, [theme]);

  return { theme, toggle: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) };
}
