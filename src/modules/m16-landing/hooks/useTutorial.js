import { useState } from 'react';
import { MOBILE_STEPS, WEB_STEPS } from '../api/landingContent';

// Estado del tutorial interactivo: plataforma elegida (móvil o web) y paso activo.
export function useTutorial() {
  const [platform, setPlatformState] = useState('mobile');
  const [index, setIndex] = useState(0);
  const steps = platform === 'mobile' ? MOBILE_STEPS : WEB_STEPS;

  function setPlatform(next) {
    setPlatformState(next);
    setIndex(0);
  }

  return { platform, setPlatform, steps, index, setIndex, step: steps[index] };
}
