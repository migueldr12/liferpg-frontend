import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const baseUrl = process.env.AUDIT_BASE_URL ?? 'http://127.0.0.1:4173';
const here = dirname(fileURLToPath(import.meta.url));
const shots = resolve(process.env.AUDIT_OUT ?? join(here, '__screenshots__'));
await mkdir(shots, { recursive: true });

const browser = await chromium.launch();
const results = [];
const fail = (name, detail) => results.push({ name, ok: false, detail: String(detail) });
const pass = (name) => results.push({ name, ok: true });

async function withPage(fn, name) {
  const page = await browser.newPage({ viewport: { width: 1180, height: 760 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  try {
    await fn(page);
    if (errors.length) fail(name, errors.join(' | '));
    else pass(name);
  } catch (cause) {
    fail(name, cause.stack || cause.message);
  } finally {
    await page.close();
  }
}

// M07 · filtros + eliminar amigo
await withPage(async (page) => {
  await page.goto(`${baseUrl}/lite/amigos`, { waitUntil: 'networkidle' });
  await page.getByPlaceholder('Buscar por alias o nombre').fill('ana');
  await page.waitForTimeout(150);
  const cards = await page.locator('.m07-card-amigo').count();
  if (cards !== 1) throw new Error(`filtro búsqueda: esperaba 1 tarjeta, hay ${cards}`);
  await page.getByPlaceholder('Buscar por alias o nombre').fill('');
  await page.getByRole('button', { name: 'Actividad', exact: true }).click();
  await page.waitForTimeout(100);
  await page.getByRole('button', { name: 'Terminar amistad con Mateo' }).click();
  await page.locator('.m07-remove-confirm').getByRole('button', { name: 'Eliminar', exact: true }).click();
  await page.waitForTimeout(100);
  const after = await page.locator('.m07-card-amigo').count();
  if (after !== 5) throw new Error(`eliminar: esperaba 5, hay ${after}`);
  const avatars = await page.locator('.m07-avatar-box img').evaluateAll((imgs) => imgs.map((i) => i.getAttribute('src')));
  if (!avatars.some((s) => s && s.endsWith('.png'))) throw new Error('M07 sin avatares PNG');
}, 'M07 filtros y eliminar amigo');

// M08 · responder solicitud
await withPage(async (page) => {
  await page.goto(`${baseUrl}/lite/botin/solicitudes`, { waitUntil: 'networkidle' });
  const pending = await page.locator('.m08-solicitud:not(.cerrada)').count();
  if (pending < 1) throw new Error('sin solicitudes pendientes');
  const accept = page.getByRole('button', { name: 'Aceptar y enviar' }).first();
  const disabled = await accept.isDisabled();
  if (disabled) {
    await page.getByRole('button', { name: 'Rechazar' }).first().click();
  } else {
    await accept.click();
  }
  await page.waitForTimeout(300);
  const text = await page.locator('.m08').innerText();
  if (!/Enviado|Rechazada|notice|error/i.test(text)) throw new Error('sin estado tras responder');
  const petSrc = await page.locator('.m08-avatar img').first().getAttribute('src');
  if (!petSrc?.endsWith('.png')) throw new Error(`M08 avatar no PNG: ${petSrc}`);
}, 'M08 responder solicitud');

// M10 · Avisos → Stickers
await withPage(async (page) => {
  await page.goto(`${baseUrl}/lite/animo`, { waitUntil: 'networkidle' });
  if (!(await page.getByRole('heading', { name: 'Tus avisos' }).count())) throw new Error('falta sección Tus avisos');
  const avis = await page.locator('.notice-card').count();
  if (avis < 3) throw new Error(`avisos: ${avis}`);
  await page.goto(`${baseUrl}/lite/animo/stickers`, { waitUntil: 'networkidle' });
  const stickers = await page.locator('.sticker-card').count();
  if (stickers !== 6) throw new Error(`stickers categoría ánim o: ${stickers}`);
  await page.getByRole('tab', { name: 'Celebrar' }).click();
  await page.waitForTimeout(100);
  const celebrar = await page.locator('.sticker-card').count();
  if (celebrar !== 6) throw new Error(`stickers celebrar: ${celebrar}`);
  await page.getByRole('button', { name: /Enviar/ }).click();
  await page.waitForTimeout(300);
  const sent = await page.getByRole('button', { name: /Enviado/ }).count();
  if (!sent) throw new Error('sin feedback de envío');
}, 'M10 avisos y stickers');

// M11 · retomar pendiente + estados racha
await withPage(async (page) => {
  await page.goto(`${baseUrl}/lite/progreso`, { waitUntil: 'networkidle' });
  const resume = page.getByRole('button', { name: 'Retomar hoy' }).first();
  await resume.click();
  await page.waitForTimeout(200);
  const pressed = await page.getByRole('button', { name: 'En tu lista de hoy' }).count();
  if (!pressed) throw new Error('retomar no marcó estado');
  await page.goto(`${baseUrl}/lite/progreso/racha`, { waitUntil: 'networkidle' });
  await page.getByRole('tab', { name: 'En riesgo' }).click();
  await page.waitForTimeout(100);
  const chip = await page.locator('.streak-chip').innerText();
  if (!/riesgo/i.test(chip)) throw new Error(`chip racha: ${chip}`);
}, 'M11 retomar y estados de racha');

// M12 · creación de reto
await withPage(async (page) => {
  await page.goto(`${baseUrl}/lite/retos`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: '+ Crear reto' }).click();
  await page.waitForTimeout(200);
  const form = await page.getByRole('heading', { name: 'Nuevo reto' }).count();
  if (!form) throw new Error('formulario Nuevo reto no abrió');
  await page.screenshot({ path: join(shots, 'interaction-m12-crear.png'), fullPage: true });
}, 'M12 abrir creación de reto');

// M13 · revocar cliente
await withPage(async (page) => {
  await page.goto(`${baseUrl}/admin/host/clientes`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Revocar' }).first().click();
  await page.getByRole('button', { name: 'Confirmar' }).first().click();
  await page.waitForTimeout(300);
  const badges = await page.locator('.state-badge, [class*="badge"]').allInnerTexts();
  if (!badges.some((t) => /Revocada/i.test(t))) {
    const text = await page.locator('body').innerText();
    if (!/Revocada/i.test(text)) throw new Error('estado Revocada no visible');
  }
}, 'M13 revocar sesión');

// M14 · publicar push
await withPage(async (page) => {
  await page.goto(`${baseUrl}/admin/economia/push`, { waitUntil: 'networkidle' });
  const submit = page.locator('form.m14-form button[type="submit"]');
  const disabled = await submit.isDisabled();
  if (disabled) {
    await page.getByPlaceholder('¡Semana de rachas!').fill('¡Semana de rachas!');
    await page.getByPlaceholder(/Esta semana cada check-in/).fill('Este mensaje de prueba valida el disparador push del M14.');
    await page.waitForTimeout(100);
  }
  if (await submit.isDisabled()) throw new Error('submit push sigue deshabilitado');
  await submit.click();
  await page.waitForTimeout(400);
  const notice = await page.locator('.m14-notice, .m14-error').count();
  if (!notice) throw new Error('sin notice/error tras enviar push');
}, 'M14 publicar push');

// M15 · días + vista previa + PURGAR
await withPage(async (page) => {
  await page.goto(`${baseUrl}/admin/datos/purga`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: '180 días' }).click();
  await page.waitForTimeout(100);
  await page.getByRole('button', { name: 'Vista previa' }).click();
  await page.waitForTimeout(500);
  await page.getByLabel('Escribe PURGAR para confirmar').fill('PURGAR');
  const purge = page.getByRole('button', { name: 'Purgar', exact: true });
  if (await purge.isDisabled()) throw new Error('botón Purgar sigue deshabilitado');
  page.once('dialog', (d) => d.accept());
  await purge.click();
  await page.waitForTimeout(400);
  const text = await page.locator('body').innerText();
  if (!/Purga completada/i.test(text)) throw new Error('sin confirmación de purga');
  await page.screenshot({ path: join(shots, 'interaction-m15-purga.png'), fullPage: true });
}, 'M15 purga 180 días con confirmación');

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(JSON.stringify({ total: results.length, passed: results.length - failed.length, failed: failed.length, results }, null, 2));
process.exit(failed.length ? 1 : 0);
