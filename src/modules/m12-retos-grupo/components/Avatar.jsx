import React from 'react';
import { PixelMascot } from '../../../shared/components/PixelMascot';
import { mascotFor } from '../../../shared/assets/demoParty';
// Avatar de un integrante de la party: su mascota sobre su color.
export default function Avatar({ person, size = 36, mood }) {
  const mascot = mascotFor(person);
  return (
    <span
      className={`m12-avatar m12-avatar--${person.id ?? 'dragon'}`}
      style={{ width: size, height: size }}
    >
      <PixelMascot {...mascot} mood={mood ?? mascot.mood} width="88%" height="84%" />
    </span>
  );
}
