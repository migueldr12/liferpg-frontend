import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const area = process.env.AUDIT_AREA;
const appRoutes = [
  '/',
  '/lite/amigos', '/lite/amigos/perfil', '/lite/amigos/codigos',
  '/lite/botin/cofre', '/lite/botin/solicitudes', '/lite/botin/historial',
  '/lite/diario', '/lite/diario/detalle', '/lite/diario/graficas',
  '/lite/animo', '/lite/animo/stickers', '/lite/animo/historial',
  '/lite/progreso', '/lite/progreso/inactividad', '/lite/progreso/racha',
  '/lite/retos', '/lite/retos/metricas', '/lite/retos/por-area',
  '/admin/host', '/admin/host/clientes', '/admin/host/consola',
  '/admin/economia/curva', '/admin/economia/catalogo', '/admin/economia/push',
  '/admin/datos', '/admin/datos/respaldos', '/admin/datos/purga',
];
const routes = area === 'auth' ? ['/acceso/login', '/acceso/crear-cuenta', '/acceso/recuperar']
  : appRoutes.filter((route) => !area || (area === 'admin' ? route.startsWith('/admin/') : !route.startsWith('/admin/')));
const here = dirname(fileURLToPath(import.meta.url));
const output = process.env.AUDIT_OUT
  ? resolve(process.env.AUDIT_OUT)
  : join(here, '__screenshots__');
const baseUrl = process.env.AUDIT_BASE_URL ?? 'http://127.0.0.1:4173';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: process.env.AUDIT_BROWSER || 'chrome' });
const failures = [];
let checked = 0;

async function audit(viewport, theme) {
  const context = await browser.newContext({ viewport, colorScheme: theme, reducedMotion: 'reduce' });
  await context.addInitScript((value) => localStorage.setItem('liferpg-theme', value), theme);
  try {
    for (const route of routes) {
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
      try {
        const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded' });
        await page.getByRole('heading', { level: 1 }).waitFor({ timeout: 12000 });
        await page.waitForLoadState('networkidle', { timeout: 12000 });
        const rendered = new URL(page.url()).pathname;
        const actualTheme = await page.locator('html').getAttribute('data-theme');
        const key = route.slice(1).replaceAll('/', '-') || 'inicio';
        await page.screenshot({ path: join(output, `${key}-${viewport.name}-${theme}.png`), fullPage: true });
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
        if (!response?.ok() || rendered !== route || (route !== '/' && actualTheme !== theme) || errors.length || overflow) failures.push({ route, viewport: viewport.name, theme, status: response?.status(), rendered, actualTheme, overflow, errors });
      } catch (error) {
        failures.push({ route, viewport: viewport.name, theme, error: error.message, errors });
      } finally {
        checked++;
        await page.close();
      }
    }
  } finally { await context.close(); }
}

try {
  await Promise.all([{ name: 'desktop', width: 1440, height: 900 }, { name: 'mobile', width: 320, height: 760 }]
    .flatMap((viewport) => ['dark', 'light'].map((theme) => audit(viewport, theme))));
} finally { await browser.close(); }
console.log(JSON.stringify({ checked, output, failures }, null, 2));
if (failures.length) process.exitCode = 1;

