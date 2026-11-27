// Prueba optativa de la demo local contra liferpg_test y un navegador de Playwright.
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const backend = path.resolve(root, '..', 'liferpg-backend');
const apiUrl = 'http://127.0.0.1:31399/api/v1';
const webUrl = 'http://127.0.0.1:5199';
const api = spawn(process.execPath, ['scripts/start-demo.js'], { cwd: backend, env: { ...process.env, PORT: '31399' }, stdio: 'inherit' });
const web = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5199', '--strictPort'], {
  cwd: root, stdio: 'inherit', env: { ...process.env, VITE_API_URL: apiUrl, VITE_API_MODULES: 'todos', VITE_DEV_USER_ID: '670000000000000000000001', VITE_FIREBASE_API_KEY: '', VITE_FIREBASE_PROJECT_ID: '', VITE_FIREBASE_APP_ID: '' },
});

async function waitFor(url) {
  for (let attempt = 0; attempt < 60; attempt++) {
    try { if ((await fetch(url)).ok) return; } catch { /* Esperar el servidor. */ }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`No arrancó ${url}`);
}

let browser;
try {
  await Promise.all([waitFor(`${apiUrl}/estado`), waitFor(webUrl)]);
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`${webUrl}/lite/amigos`);
  await page.getByText('Beto Demo').first().waitFor({ timeout: 30000 });
  await page.getByRole('link', { name: 'Perfil espejo', exact: true }).click();
  await page.getByRole('heading', { name: 'Ana Demo', exact: true }).waitFor();
  await page.getByRole('img', { name: 'Pixel, mascota de Ana Demo' }).waitFor();
  await page.getByRole('link', { name: 'Amigos', exact: true }).first().click();
  await page.getByRole('article', { name: 'Ficha de Beto Demo' }).getByRole('button', { name: 'Ver perfil' }).click();
  await page.waitForURL(/\/lite\/amigos\/perfil\//);
  await page.getByRole('heading', { name: 'Beto Demo', exact: true }).waitFor();
  await page.getByText('Solo lectura').first().waitFor({ timeout: 30000 });
  await page.getByRole('link', { name: 'Abrir mi perfil espejo' }).click();
  await page.getByRole('heading', { name: 'Ana Demo', exact: true }).waitFor();
  await page.goto(`${webUrl}/lite/animo/stickers`);
  const sticker = page.getByRole('button', { name: '¡Tú puedes!' });
  await sticker.waitFor({ timeout: 30000 });
  await sticker.click();
  if (await sticker.getAttribute('aria-pressed') !== 'true') throw new Error('El sticker no quedó seleccionado');
  console.log('Demo PWA: party, ficha propia, ficha de amigo y catálogo de stickers verificados.');
} finally {
  await browser?.close();
  api.kill(); web.kill();
}
