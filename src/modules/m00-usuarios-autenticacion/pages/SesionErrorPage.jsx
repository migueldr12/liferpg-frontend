import React from 'react';
import { useSession } from '../hooks/SessionProvider';
import { AuthShell } from '../components/AuthShell';

// El servidor no pudo identificar al usuario (sin conexión, correo sin verificar, etc.).
export default function SesionErrorPage() {
  const session = useSession();
  return (
    <AuthShell hero={false} title="No pudimos entrar" subtitle="Hubo un problema al identificar tu sesión.">
      <p className="auth-error" role="alert">{session.error ?? 'Intenta de nuevo.'}</p>
      <button type="button" className="auth-primary" onClick={() => session.refresh()}>Reintentar</button>
      <button type="button" className="auth-link" onClick={() => session.logout()}>Cerrar sesión</button>
    </AuthShell>
  );
}
