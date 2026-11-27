import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AuthError, sendPasswordReset } from '../api/authService';
import { AuthShell, Busy, Field } from '../components/AuthShell';
import { isValidEmail } from '../utils/accountOptions';

// M00 · Recuperar contraseña (RDF009). Firebase envía el correo con el enlace.
export default function RecuperarPage() {
  const [params] = useSearchParams();
  const [email, setEmail] = useState(params.get('email') ?? '');
  const [sentTo, setSentTo] = useState(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const canSend = isValidEmail(email) && !sending;

  async function submit(e) {
    e.preventDefault();
    if (!canSend) return;
    setSending(true);
    setError(null);
    try {
      await sendPasswordReset(email);
      setSentTo(email.trim());
    } catch (err) {
      // Por privacidad no se revela si el correo existe: ese caso se trata como enviado
      if (err instanceof AuthError && /no son correctos/.test(err.message)) setSentTo(email.trim());
      else setError(err instanceof AuthError ? err.message : 'No se pudo enviar el correo.');
    } finally {
      setSending(false);
    }
  }

  return (
    <AuthShell hero={false} title="Recuperar contraseña" subtitle={sentTo ? null : 'Escribe el correo de tu cuenta y te enviaremos un enlace para crear una contraseña nueva.'}>
      {sentTo ? (
        <>
          <p className="auth-notice" role="status">Si {sentTo} tiene una cuenta, te llegará un correo con un enlace para crear una contraseña nueva. Revisa también la carpeta de spam.</p>
          <Link className="auth-primary" to="/acceso/login" style={{ textDecoration: 'none' }}>Volver a iniciar sesión</Link>
        </>
      ) : (
        <form className="auth-form" onSubmit={submit} noValidate>
          <Field label="Correo">
            <input className="auth-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@ejemplo.com" autoComplete="email" spellCheck={false} />
          </Field>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button type="submit" className="auth-primary" disabled={!canSend}><Busy busy={sending}>Enviar enlace</Busy></button>
          <Link className="auth-link" to="/acceso/login">Volver</Link>
        </form>
      )}
    </AuthShell>
  );
}
