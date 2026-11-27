import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const admin = process.argv.includes('--admin');
const env = {
  ...process.env,
  VITE_API_URL: process.env.VITE_DEMO_API_URL || 'http://localhost:3000/api/v1',
  VITE_API_MODULES: 'todos',
  VITE_DEV_USER_ID: admin ? '670000000000000000000004' : '670000000000000000000001',
  VITE_FIREBASE_API_KEY: '', VITE_FIREBASE_PROJECT_ID: '', VITE_FIREBASE_APP_ID: '',
};
console.log(`Demo PWA: ${admin ? 'administrador' : 'Ana'} · API ${env.VITE_API_URL}`);
const child = spawn(process.execPath, [path.join(root, 'node_modules', 'vite', 'bin', 'vite.js'), '--host', '0.0.0.0'], { cwd: root, env, stdio: 'inherit' });
child.on('error', (error) => { console.error(error.message); process.exitCode = 1; });
child.on('exit', (code) => { process.exitCode = code ?? 0; });
