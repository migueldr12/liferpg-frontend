import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthError, signOut, signUpWithEmail } from '../api/authService';
import { crearCuenta } from '../api/cuenta.api';
import { useSession } from '../hooks/SessionProvider';
import { AuthShell, Busy, Chip, Field, PasswordInput } from '../components/AuthShell';
import {
  AGE_MAX, AGE_MIN, CUSTOM_GOAL_MAX, GENDER_OPTIONS, GOAL_OPTIONS, NAME_MAX, PASSWORD_RULES, isValidEmail, isValidPassword,
} from '../utils/accountOptions';

// M00 · Crear cuenta (RF001 · RDF001).
//  - Sin sesión: correo + contraseña (Firebase) y datos del jugador.
//  - Con sesión de Google (o de un correo que aún no llena el alta): correo fijo, sin contraseña.
export default function CrearCuentaPage() {
  const session = useSession();
  const loggedIn = Boolean(session.user);
  const [email, setEmail] = useState(session.user?.email ?? '');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState(session.user?.displayName?.split(' ')[0] ?? '');
  const [lastName, setLastName] = useState(session.user?.displayName?.split(' ').slice(1).join(' ') ?? '');
  const [ageText, setAgeText] = useState('');
  const [gender, setGender] = useState(null);
  const [goals, setGoals] = useState([]);
  const [customOn, setCustomOn] = useState(false);
  const [customGoal, setCustomGoal] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const age = Number(ageText);
  const errors = {};
  if (!loggedIn && !isValidEmail(email)) errors.email = 'Escribe un correo válido.';
  if (!loggedIn && !isValidPassword(password)) errors.password = 'La contraseña no cumple las reglas.';
  if (!firstName.trim()) errors.firstName = 'Escribe tu nombre.';
  if (!lastName.trim()) errors.lastName = 'Escribe tu apellido.';
  if (!/^\d+$/.test(ageText) || age < AGE_MIN || age > AGE_MAX) errors.age = `Edad de ${AGE_MIN} a ${AGE_MAX}.`;
  if (!gender) errors.gender = 'Elige una opción.';
  if (goals.length === 0 && !(customOn && customGoal.trim())) errors.goals = 'Elige al menos una meta o escribe la tuya.';
  const shown = (field) => (submitted ? errors[field] : null);

  const toggleGoal = (key) => setGoals((g) => (g.includes(key) ? g.filter((x) => x !== key) : [...g, key]));

  async function submit(e) {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length > 0 || saving) return;
    setSaving(true);
    setError(null);
    try {
      if (!loggedIn) await signUpWithEmail(email, password);
      await crearCuenta({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        age,
        gender,
        goals,
        customGoal: customOn && customGoal.trim() ? customGoal.trim() : null,
      });
      await session.refresh(); // Las guardas llevan a elegir mascota
    } catch (err) {
      setError(err instanceof AuthError || err instanceof Error ? err.message : 'No se pudo crear tu cuenta.');
      setSaving(false);
    }
  }

  return (
    <AuthShell
      hero={false}
      title={loggedIn ? 'Cuéntanos de ti' : 'Crear cuenta'}
      subtitle={loggedIn ? 'Un último paso para empezar tu aventura.' : 'Crea tu cuenta y empieza tu aventura con tu mascota.'}
    >
      <form className="auth-form" onSubmit={submit} noValidate>
        <Field label="Correo" error={shown('email')}>
          <input className={`auth-input ${shown('email') ? 'auth-input--error' : ''}`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loggedIn} placeholder="tucorreo@ejemplo.com" autoComplete="email" spellCheck={false} />
        </Field>

        <div className="auth-row">
          <Field label="Nombre" error={shown('firstName')}>
            <input className={`auth-input ${shown('firstName') ? 'auth-input--error' : ''}`} value={firstName} onChange={(e) => setFirstName(e.target.value)} maxLength={NAME_MAX} placeholder="Majo" autoComplete="given-name" />
          </Field>
          <Field label="Apellido" error={shown('lastName')}>
            <input className={`auth-input ${shown('lastName') ? 'auth-input--error' : ''}`} value={lastName} onChange={(e) => setLastName(e.target.value)} maxLength={NAME_MAX} placeholder="Ramírez" autoComplete="family-name" />
          </Field>
        </div>

        {!loggedIn && (
          <Field label="Contraseña" error={shown('password')}>
            <PasswordInput value={password} onChange={setPassword} placeholder="Crea tu contraseña" autoComplete="new-password" invalid={Boolean(shown('password'))} />
            <ul className="auth-rules">
              {PASSWORD_RULES.map((rule) => {
                const ok = rule.test(password);
                return <li key={rule.label} className={ok ? 'ok' : ''}>{ok ? '✓' : '•'} {rule.label}</li>;
              })}
            </ul>
          </Field>
        )}

        <div className="auth-row">
          <Field label="Edad" error={shown('age')}>
            <input className={`auth-input ${shown('age') ? 'auth-input--error' : ''}`} inputMode="numeric" value={ageText} onChange={(e) => setAgeText(e.target.value.replace(/\D/g, ''))} maxLength={3} placeholder="21" />
          </Field>
          <span />
        </div>

        <div className="auth-field" role="group" aria-label="Género">
          <span className="auth-label">Género</span>
          <div className="auth-chips">
            {GENDER_OPTIONS.map((g) => <Chip key={g.key} label={g.label} active={gender === g.key} onClick={() => setGender(g.key)} />)}
          </div>
          {shown('gender') && <span className="auth-field-error" role="alert">{shown('gender')}</span>}
        </div>

        <div className="auth-field" role="group" aria-label="Metas">
          <span className="auth-label">¿Qué te gustaría lograr?</span>
          <span className="auth-hint">Elige todas las que quieras.</span>
          <div className="auth-chips">
            {GOAL_OPTIONS.map((g) => <Chip key={g.key} label={g.label} active={goals.includes(g.key)} onClick={() => toggleGoal(g.key)} />)}
            <Chip label="Otra meta" active={customOn} onClick={() => setCustomOn((v) => !v)} />
          </div>
          {customOn && (
            <input className="auth-input" value={customGoal} onChange={(e) => setCustomGoal(e.target.value)} maxLength={CUSTOM_GOAL_MAX} placeholder="Ej. Aprender a tocar guitarra" aria-label="Tu meta" />
          )}
          {shown('goals') && <span className="auth-field-error" role="alert">{shown('goals')}</span>}
        </div>

        {error && <p className="auth-error" role="alert">{error}</p>}

        <button type="submit" className="auth-primary" disabled={saving}><Busy busy={saving}>Crear cuenta</Busy></button>
      </form>

      {loggedIn
        ? <button type="button" className="auth-link" onClick={() => signOut()}>Usar otra cuenta</button>
        : <Link className="auth-link" to="/acceso/login">¿Ya tienes cuenta? <strong>Iniciar sesión</strong></Link>}
    </AuthShell>
  );
}
