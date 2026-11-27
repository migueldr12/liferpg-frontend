import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './app/router/AppRouter';
import { SessionProvider } from './modules/m00-usuarios-autenticacion/hooks/SessionProvider';
import './shared/styles/index.css';
import './shared/styles/folio.css';

// El tema guardado se aplica desde el arranque: también debe verse en las pantallas de acceso.
try {
  document.documentElement.dataset.theme = localStorage.getItem('liferpg-theme') === 'light' ? 'light' : 'dark';
} catch {
  document.documentElement.dataset.theme = 'dark';
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SessionProvider>
        <AppRouter />
      </SessionProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
