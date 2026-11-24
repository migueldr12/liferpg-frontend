import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const routes = [
  '/lite/amigos', '/lite/amigos/perfil', '/lite/amigos/codigos',
  '/lite/botin/cofre', '/lite/botin/solicitudes', '/lite/botin/historial',
  '/lite/diario', '/lite/diario/a-5', '/lite/diario/graficas',
  '/lite/animo', '/lite/animo/stickers', '/lite/animo/historial',
  '/lite/progreso', '/lite/progreso/inactividad', '/lite/progreso/racha',
  '/lite/retos', '/lite/retos/metricas', '/lite/retos/por-area',
  '/admin/host', '/admin/host/clientes', '/admin/host/consola',
  '/admin/economia/curva', '/admin/economia/catalogo', '/admin/economia/push',
  '/admin/datos', '/admin/datos/respaldos', '/admin/datos/purga',
];
const here = dirname(fileURLToPath(import.meta.url));
const output = process.env.AUDIT_OUT
  ? resolve(process.env.AUDIT_OUT)
  : join(here, '__screenshots__');
const baseUrl = process.env.AUDIT_BASE_URL ?? 'http://127.0.0.1:4173';
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const failures = [];

for (const viewport of [{ name: 'desktop', width: 1180, height: 760 }, { name: 'mobile', width: 390, height: 844 }]) {
  const context = await browser.newContext({ viewport });
  for (const route of routes) {
    const page = await context.newPage();
    const errors = [];
    page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
    page.on('pageerror', (error) => errors.push(error.message));
    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
    const key = route.replace(/^\//, '').replaceAll('/', '-');
    await page.screenshot({ path: join(output, `${key}-${viewport.name}.png`), fullPage: true });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    if (!response?.ok() || errors.length || overflow) failures.push({ route, viewport: viewport.name, status: response?.status(), overflow, errors });
    await page.close();
  }
  await context.close();
}

await browser.close();
console.log(JSON.stringify({ checked: routes.length * 2, output, failures }, null, 2));

