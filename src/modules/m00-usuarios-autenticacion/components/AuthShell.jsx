import React, { useState } from 'react';
import { PixelMascot } from '../../../shared/components/PixelMascot';
import { PET_SPECIES } from '../../../shared/assets/mobilePets';
import './auth.css';

// Marco de las pantallas de acceso (M00): portada con las 5 mascotas, marca y tarjeta del formulario.
// Mismo orden y tamaños que el login de la app móvil (la del centro, el dragón, más grande).
export function AuthShell({ children, hero = true, title, subtitle }) {
  return (
    <div className="auth-page">
      <main className="auth-card">
        {hero && (
          <header className="auth-hero">
            <div className="auth-pets" aria-hidden="true">
              {PET_SPECIES.map((pet, i) => (
                <span key={pet.key} className={i === 2 ? 'auth-pet auth-pet--center' : 'auth-pet'}><PixelMascot pet={pet.key} mood="focus" label={pet.label} /></span>
              ))}
            </div>
            <h1 className="auth-brand">LIFE-RPG</h1>
            <p className="auth-tagline">Cumple tus hábitos y tu mascota crece contigo.</p>
          </header>
        )}
        {!hero && title && <h1 className="auth-title">{title}</h1>}
        {!hero && subtitle && <p className="auth-subtitle">{subtitle}</p>}
        {children}
      </main>
    </div>
  );
}

export function SplashScreen() {
  return (
    <div className="auth-page" role="status" aria-live="polite">
      <div className="auth-splash"><span className="auth-spinner" aria-hidden="true" /><p>Cargando Life-RPG…</p></div>
    </div>
  );
}

export function Field({ label, error, children, hint }) {
  return (
    <label className="auth-field">
      <span className="auth-label">{label}</span>
      {children}
      {hint && <span className="auth-hint">{hint}</span>}
      {error && <span className="auth-field-error" role="alert">{error}</span>}
    </label>
  );
}

export function PasswordInput({ value, onChange, placeholder, autoComplete, invalid, onEnter }) {
  const [visible, setVisible] = useState(false);
  return (
    <span className="auth-password">
      <input
        className={`auth-input ${invalid ? 'auth-input--error' : ''}`}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onKeyDown={(e) => e.key === 'Enter' && onEnter?.()}
      />
      <button type="button" className="auth-show" onClick={() => setVisible((v) => !v)} aria-pressed={visible}>{visible ? 'Ocultar' : 'Mostrar'}</button>
    </span>
  );
}

export function Chip({ label, active, onClick }) {
  return <button type="button" className={`auth-chip ${active ? 'auth-chip--on' : ''}`} onClick={onClick} aria-pressed={active}>{label}</button>;
}

export function Busy({ children, busy }) {
  return busy ? <span className="auth-spinner auth-spinner--small" aria-label="Cargando" /> : children;
}
