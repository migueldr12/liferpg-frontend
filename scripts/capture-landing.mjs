// Genera las capturas reales de la PWA que usa el tutorial de la landing (M16).
// Arranca la PWA con datos de demostración y apunta LANDING_BASE_URL a ese servidor.
// Las imágenes quedan en public/landing/*.png con tema oscuro y 1280×800.
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { WEB_STEPS } from '../src/modules/m16-landing/api/landingContent.js';

const baseUrl = process.env.LANDING_BASE_URL ?? 'http://127.0.0.1:4173';
const outDir = fileURLToPath(new URL('../public/landing/', import.meta.url));

const contentByPath = {
  '/lite/amigos': '.companion-sheet',
  '/lite/botin/cofre': '.m08-item',
  '/lite/diario': '.adventure-ledger tbody tr',
  '/lite/animo/stickers': '.sticker-choice',
  '/lite/progreso/racha': '.streak-card',
  '/lite/retos': '.m12-reto',
};

await mkdir(outDir, { recursive: true });
// Sin `npx playwright install`, usa un navegador del sistema: LANDING_BROWSER=msedge o chrome.
const browser = await chromium.launch(process.env.LANDING_BROWSER ? { channel: process.env.LANDING_BROWSER } : {});
try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: 'dark', reducedMotion: 'reduce' });
  await context.addInitScript(() => localStorage.setItem('liferpg-theme', 'dark'));
  const page = await context.newPage();
  const captures = [];
  for (const { path, shot } of WEB_STEPS) {
    const response = await page.goto(new URL(path, baseUrl).href, { waitUntil: 'domcontentloaded' });
    if (!response?.ok() || new URL(page.url()).pathname !== path) throw new Error(`No se abrió la pantalla ${path}.`);
    await page.locator(contentByPath[path]).first().waitFor({ timeout: 12000 });
    if (await page.locator('.workspace__body [role="alert"]').count()) throw new Error(`La pantalla ${path} muestra un error.`);
    await page.addStyleTag({ content: '.bottom-dock{display:none!important}' });
    const name = shot.split('/').at(-1);
    captures.push({ name, bytes: await page.screenshot() });
  }
  // Si falla alguna pantalla, se conservan todas las capturas anteriores.
  for (const { name, bytes } of captures) {
    await writeFile(`${outDir}${name}`, bytes);
    console.log(`✓ ${name}`);
  }
} finally {
  await browser.close();
}
