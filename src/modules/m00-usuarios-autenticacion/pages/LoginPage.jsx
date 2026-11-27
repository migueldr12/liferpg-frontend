import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthError, signInWithEmail, signInWithGoogle } from '../api/authService';
import { AuthShell, Busy, Field, PasswordInput } from '../components/AuthShell';
import { isValidEmail } from '../utils/accountOptions';

// M00 · Iniciar sesión (RF002 · RDF006). Google o correo y contraseña.
// Al entrar, las guardas de ruta llevan al jugador a donde le toca (Crear cuenta, Bienvenida o la app).
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(null); // 'email' | 'google' | null
  const [error, setError] = useState(null);

  const canSubmit = isValidEmail(email) && password.length > 0 && busy === null;

  async function run(kind, action) {
    setBusy(kind);
    setError(null);
    try {
      await action();
      // Sin quitar "busy": la pantalla cambia sola en cuanto el servidor identifica al usuario
    } catch (e) {
      setError(e instanceof AuthError ? e.message : 'No se pudo iniciar sesión. Intenta de nuevo.');
      setBusy(null);
    }
  }

  const submit = (e) => {
    e.preventDefault();
    if (canSubmit) run('email', () => signInWithEmail(email, password));
  };

  return (
    <AuthShell>
      <button type="button" className="auth-google" disabled={busy !== null} onClick={() => run('google', signInWithGoogle)} aria-label="Continuar con Google">
        {busy === 'google' ? <Busy busy /> : (<><span className="auth-google-badge" aria-hidden="true">G</span>Continuar con Google</>)}
      </button>

      <div className="auth-divider">o con tu correo</div>

      <form className="auth-form" onSubmit={submit} noValidate>
        <Field label="Correo">
          <input className="auth-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@ejemplo.com" autoComplete="email" autoCapitalize="none" spellCheck={false} />
        </Field>
        <Field label="Contraseña">
          <PasswordInput value={password} onChange={setPassword} placeholder="Tu contraseña" autoComplete="current-password" />
        </Field>
        <Link className="auth-link auth-link--end" to={`/acceso/recuperar${email ? `?email=${encodeURIComponent(email)}` : ''}`}>¿Olvidaste tu contraseña?</Link>

        {error && <p className="auth-error" role="alert">{error}</p>}

        <button type="submit" className="auth-primary" disabled={!canSubmit}>
          <Busy busy={busy === 'email'}>Iniciar sesión</Busy>
        </button>
      </form>

      <Link className="auth-link" to="/acceso/crear-cuenta">¿Nuevo en Life-RPG? <strong>Crear cuenta</strong></Link>
    </AuthShell>
  );
}
