// Genera las capturas reales de la PWA que usa el tutorial de la landing (M16).
// Uso: `pnpm build && pnpm preview` en una terminal y `pnpm landing:shots` en otra.
// Las imágenes quedan en public/landing/*.png con tema oscuro y 1280×800.
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const baseUrl = process.env.LANDING_BASE_URL ?? 'http://127.0.0.1:4173';
const outDir = fileURLToPath(new URL('../public/landing/', import.meta.url));

const SHOTS = [
  ['amigos', '/lite/amigos'],
  ['botin', '/lite/botin/cofre'],
  ['diario', '/lite/diario/graficas'],
  ['animo', '/lite/animo/stickers'],
  ['progreso', '/lite/progreso/racha'],
  ['retos', '/lite/retos'],
];

await mkdir(outDir, { recursive: true });
// Sin `npx playwright install`, usa un navegador del sistema: LANDING_BROWSER=msedge o chrome.
const browser = await chromium.launch(process.env.LANDING_BROWSER ? { channel: process.env.LANDING_BROWSER } : {});
const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: 'dark' });
await context.addInitScript(() => localStorage.setItem('liferpg-theme', 'dark'));
const page = await context.newPage();

for (const [name, route] of SHOTS) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: '.bottom-dock{display:none!important}' });
  await page.screenshot({ path: `${outDir}${name}.png` });
  console.log(`✓ ${name}.png`);
}

await browser.close();
