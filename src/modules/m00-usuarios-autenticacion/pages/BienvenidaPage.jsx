import React, { useState } from 'react';
import { elegirMascota } from '../api/cuenta.api';
import { useSession } from '../hooks/SessionProvider';
import { AuthShell, Busy } from '../components/AuthShell';
import { PixelMascot } from '../../../shared/components/PixelMascot';
import { PET_SPECIES } from '../../../shared/assets/mobilePets';

// M00 · Bienvenido a Life-RPG: el jugador elige su animal una sola vez por cuenta.
// Se guarda en el backend, así que en otro dispositivo ya no se pregunta.
export default function BienvenidaPage() {
  const session = useSession();
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const option = PET_SPECIES.find((p) => p.key === selected) ?? null;

  const name = session.cuenta?.firstName ? `, ${session.cuenta.firstName}` : '';
  const gender = session.cuenta?.gender;
  const greeting = gender === 'mujer' ? `¡Bienvenida a Life-RPG${name}!` : gender === 'hombre' ? `¡Bienvenido a Life-RPG${name}!` : `¡Te damos la bienvenida a Life-RPG${name}!`;

  async function confirm() {
    if (!selected || saving) return;
    setSaving(true);
    setError(null);
    try {
      await elegirMascota(selected);
      await session.refresh(); // Las guardas llevan a la app
    } catch {
      setError('No se pudo guardar tu mascota. Intenta de nuevo.');
      setSaving(false);
    }
  }

  return (
    <AuthShell hero={false} title={greeting} subtitle="Elige a tu compañero. Crecerá contigo cada vez que cumplas tus hábitos y misiones. Esta decisión es para siempre.">
      <div className="auth-preview" aria-live="polite">
        {option ? (<><span className="auth-big"><PixelMascot pet={option.key} mood="joy" label={option.label} /></span>{option.label}</>) : '¿Quién será tu mascota?'}
      </div>

      <div className="auth-pet-grid" role="group" aria-label="Animales disponibles">
        {PET_SPECIES.map((pet) => (
          <button key={pet.key} type="button" className="auth-pet-card" aria-pressed={selected === pet.key} onClick={() => setSelected(pet.key)}>
            <span className="auth-thumb"><PixelMascot pet={pet.key} mood="focus" label="" /></span>
            {pet.label}
          </button>
        ))}
      </div>

      {error && <p className="auth-error" role="alert">{error}</p>}
      <button type="button" className="auth-primary" disabled={!selected || saving} onClick={confirm}>
        <Busy busy={saving}>{option ? `Elegir a ${option.label}` : 'Elige un animal'}</Busy>
      </button>
    </AuthShell>
  );
}
