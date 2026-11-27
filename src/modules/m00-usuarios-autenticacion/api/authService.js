import { initializeApp, getApp, getApps } from 'firebase/app';
import {
  GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, onAuthStateChanged,
  sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut as fbSignOut,
} from 'firebase/auth';
import { FIREBASE_CONFIG, FIREBASE_ENABLED } from '../../../config/env';

// Inicio de sesión con Firebase Authentication (M00 · RDF006), igual que la app móvil
// (services/firebase/authFirebase.ts). Si no hay configuración (modo "dev") nada de esto se usa.

// Códigos de Firebase → mensaje para el jugador (mismos textos que la app móvil)
const MESSAGES = {
  'auth/invalid-credential': 'El correo o la contraseña no son correctos.',
  'auth/wrong-password': 'El correo o la contraseña no son correctos.',
  'auth/user-not-found': 'El correo o la contraseña no son correctos.',
  'auth/invalid-email': 'Escribe un correo válido.',
  'auth/email-already-in-use': 'Ya existe una cuenta con ese correo. Inicia sesión.',
  'auth/weak-password': 'La contraseña es muy débil.',
  'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos e intenta de nuevo.',
  'auth/network-request-failed': 'No hay conexión. Revisa tu internet.',
  'auth/user-disabled': 'Esta cuenta está desactivada.',
  'auth/operation-not-allowed': 'Este método de inicio de sesión no está activado en Firebase.',
  'auth/popup-closed-by-user': 'Cerraste la ventana de Google antes de terminar.',
  'auth/cancelled-popup-request': 'Cerraste la ventana de Google antes de terminar.',
  'auth/popup-blocked': 'El navegador bloqueó la ventana de Google. Permite las ventanas emergentes.',
  'auth/unauthorized-domain': 'Este dominio no está autorizado en Firebase para iniciar sesión con Google.',
  'auth/credential-already-in-use': 'Ese correo ya está ligado a otra cuenta.',
};

export class AuthError extends Error {}

const toAuthError = (error) => new AuthError(MESSAGES[error?.code] ?? 'No se pudo completar. Intenta de nuevo.');

let auth = null;
export function getFirebaseAuth() {
  if (!FIREBASE_ENABLED) return null;
  auth ??= getAuth(getApps().length ? getApp() : initializeApp(FIREBASE_CONFIG));
  return auth;
}

const toAuthUser = (user) => user && ({
  uid: user.uid,
  email: user.email ?? '',
  displayName: user.displayName,
  provider: user.providerData.some((p) => p.providerId === 'google.com') ? 'google' : 'password',
});

async function run(action) {
  try {
    return await action();
  } catch (error) {
    throw toAuthError(error);
  }
}

export const googleSupported = true;

/** Avisa al abrir la app, al entrar y al salir. Devuelve la función para dejar de escuchar. */
export const observeAuth = (callback) => onAuthStateChanged(getFirebaseAuth(), (user) => callback(toAuthUser(user)));

export const signInWithEmail = (email, password) =>
  run(async () => toAuthUser((await signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password)).user));

export const signUpWithEmail = (email, password) =>
  run(async () => toAuthUser((await createUserWithEmailAndPassword(getFirebaseAuth(), email.trim(), password)).user));

export const signInWithGoogle = () =>
  run(async () => toAuthUser((await signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider())).user));

// RDF009 · Firebase envía el correo de recuperación
export const sendPasswordReset = (email) => run(() => sendPasswordResetEmail(getFirebaseAuth(), email.trim()));

// RDF008 · cerrarSesion
export const signOut = () => run(() => fbSignOut(getFirebaseAuth()));

/**
 * Token vigente para el backend. Espera a que Firebase termine de restaurar la sesión guardada
 * (al recargar, currentUser es null un instante) para no mandar la primera petición sin token.
 */
export async function getIdToken(forceRefresh = false) {
  const fb = getFirebaseAuth();
  if (!fb) return null;
  await fb.authStateReady();
  return fb.currentUser ? fb.currentUser.getIdToken(forceRefresh) : null;
}
