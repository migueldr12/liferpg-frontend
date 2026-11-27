import { readFile, writeFile } from 'node:fs/promises';
import { parseEnv } from 'node:util';

const config = parseEnv(await readFile(new URL('../.env', import.meta.url), 'utf8'));
const api = new URL(process.argv[2] ?? 'https://liferpg-backend-56d5.onrender.com/api/v1');
if (api.protocol !== 'https:' || api.username || api.password || api.search || api.hash || !/^\/api\/v1\/?$/.test(api.pathname)) {
  throw new Error('Indica la URL HTTPS del backend terminada en /api/v1, sin credenciales ni parámetros.');
}

const required = ['API_KEY', 'AUTH_DOMAIN', 'PROJECT_ID', 'APP_ID'];
const optional = ['STORAGE_BUCKET', 'MESSAGING_SENDER_ID'];
const entries = [
  ['VITE_API_URL', api.href.replace(/\/$/, '')],
  ['VITE_API_MODULES', 'todos'],
  ['VITE_ADMIN_API_ENABLED', 'false'],
];
for (const name of [...required, ...optional]) {
  const key = `VITE_FIREBASE_${name}`;
  const value = config[key]?.trim();
  if (!value && required.includes(name)) throw new Error(`Falta ${key} en .env.`);
  if (value) {
    if (!/^[\w.:-]+$/.test(value)) throw new Error(`Revisa el formato de ${key} en .env.`);
    entries.push([key, value]);
  }
}

const destination = new URL('../.env.deploy', import.meta.url);
try {
  await writeFile(destination, entries.map(([key, value]) => `${key}=${value}`).join('\n') + '\n', { flag: 'wx' });
  console.log('.env.deploy listo para copiar al panel de hosting.');
} catch (error) {
  if (error.code !== 'EEXIST') throw error;
  console.error('.env.deploy ya existe. Renómbralo o bórralo si quieres generar otro.');
  process.exitCode = 1;
}
