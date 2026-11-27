import React from 'react';
import { PixelMascot } from '../../../shared/components/PixelMascot';
import { mascotFor } from '../../../shared/assets/demoParty';
// Avatar de un integrante de la party: su mascota sobre su color.
export default function Avatar({ person, size = 36, mood }) {
  const mascot = person?.pet ? { pet: person.pet, color: person.color } : mascotFor(person ?? {});
  return (
    <span
      className="m08-avatar"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <PixelMascot {...mascot} mood={mood ?? mascot.mood} width="88%" height="84%" />
    </span>
  );
}
