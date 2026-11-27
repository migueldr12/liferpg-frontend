// Opciones y reglas del formulario "Crear cuenta" (M00). Mismas que constants/accountOptions.ts de la app móvil.

export const GENDER_OPTIONS = [
  { key: 'mujer', label: 'Mujer' },
  { key: 'hombre', label: 'Hombre' },
  { key: 'no_binario', label: 'No binario' },
  { key: 'prefiero_no_decir', label: 'Prefiero no decir' },
];

export const GOAL_OPTIONS = [
  { key: 'lectura', label: 'Mejorar mi lectura' },
  { key: 'ejercicio', label: 'Hacer más ejercicio' },
  { key: 'enfoque', label: 'Concentrarme mejor' },
  { key: 'sueno', label: 'Dormir mejor' },
  { key: 'animo', label: 'Cuidar mi ánimo' },
];

export const NAME_MAX = 40;
export const CUSTOM_GOAL_MAX = 60;
export const AGE_MIN = 1;
export const AGE_MAX = 120;

// Reglas de la contraseña; el formulario las muestra en vivo
export const PASSWORD_RULES = [
  { label: 'Mínimo 8 caracteres', test: (v) => v.length >= 8 },
  { label: 'Una letra mayúscula', test: (v) => /[A-ZÁÉÍÓÚÑ]/.test(v) },
  { label: 'Un número', test: (v) => /\d/.test(v) },
];

export const isValidPassword = (value) => PASSWORD_RULES.every((r) => r.test(value));
export const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
