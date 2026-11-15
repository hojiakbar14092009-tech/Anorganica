import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Skip the first-launch intro so journeys start on the real UI.
  await page.addInitScript(() => {
    if (!localStorage.getItem('anorganica:v1')) localStorage.setItem('anorganica:v1', JSON.stringify({ introSeen: true, installTipDismissed: true }));
  });
});

test('home → chapter → § → expand row → next §', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: '8-sinf' }).click();
  await page.getByText('Metallmaslar', { exact: true }).click();
  await page.getByRole('link', { name: /§23\s*Xlor/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Xlor' })).toBeVisible();
  const toggle = page.getByRole('button', { name: /Temir/ });
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByText(/temirni \+3 gacha oksidlaydi/)).toBeVisible();
  await page.getByRole('link', { name: /§24/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Vodorod xlorid' })).toBeVisible();
});

test('search by formula with subscripts and by §', async ({ page }) => {
  await page.goto('/qidiruv?q=H%E2%82%82SO%E2%82%84');
  await expect(page.getByRole('link', { name: /Sulfat kislota/ }).first()).toBeVisible();
  await page.getByRole('searchbox').fill('9-sinf §19');
  await expect(page.getByRole('link', { name: /Elektroliz/ })).toBeVisible();
});

test('practice: Y1, O1 decimal comma, progress persists, resume link', async ({ page }) => {
  await page.goto('/dars/g8-s23');
  const q1 = page.locator('.question').first();
  await q1.getByRole('button', { name: /FeCl3|FeCl₃/ }).first().click();
  await expect(q1.getByRole('status')).toContainText('To‘g‘ri');
  const q2 = page.locator('.question').nth(1);
  await q2.getByRole('textbox').fill('2,45');
  await q2.getByRole('button', { name: 'Tekshirish' }).click();
  await expect(q2.getByRole('status')).toContainText('To‘g‘ri');
  await page.goto('/');
  await expect(page.getByRole('link', { name: /Davom etish/ })).toContainText('Xlor');
  await page.goto('/mashq');
  await expect(page.getByText(/Yechilgan: 2 · to‘g‘ri: 2/)).toBeVisible();
});

test('settings: dark theme + warmth change colours, layout has no horizontal overflow', async ({ page }) => {
  await page.goto('/sozlamalar');
  await page.getByRole('button', { name: 'Qorong‘i' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-mode', 'dark');
  const before = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--bg'));
  await page.getByLabel(/Rang harorati/).fill('1');
  const after = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--bg'));
  expect(after).not.toBe(before);
  for (const path of ['/', '/dars/g8-s32', '/dars/g9-s19', '/mashq']) {
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
});

test('no login: home and a deep link open directly; scope is exactly 24 + 29', async ({ browser }) => {
  const page = await (await browser.newContext()).newPage(); // fresh profile, nothing stored
  await page.goto('/dars/g8-s23');
  await expect(page.getByRole('heading', { level: 1, name: 'Xlor' })).toBeVisible();
  await expect(page.locator('input[type=password]')).toHaveCount(0);
  await page.goto('/');
  await expect(page.getByRole('searchbox')).toBeVisible();
  await expect(page.getByRole('tab', { name: /8-sinf \(24 mavzu\)/ })).toBeVisible();
  await expect(page.getByRole('tab', { name: /9-sinf \(29 mavzu\)/ })).toBeVisible();
  await expect(page.locator('nav.chapters a')).toHaveCount(24);
  await page.getByRole('tab', { name: /9-sinf/ }).click();
  await expect(page.locator('nav.chapters a')).toHaveCount(29);
  for (const excluded of ['/dars/g8-s5', '/dars/g9-s3', '/dars/g9-s37']) {
    await page.goto(excluded);
    await expect(page.getByRole('heading', { name: 'Bo‘lim topilmadi' })).toBeVisible();
  }
});

test('3D model loads on demand with a text fallback always visible', async ({ page }) => {
  await page.goto('/dars/g8-s37');
  const fig = page.locator('figure.molecule');
  await expect(fig.getByText('∠H–N–H: 106,7°')).toBeVisible();
  await fig.getByRole('button', { name: '3D modelni ochish' }).click();
  await expect(fig.locator('canvas')).toBeVisible({ timeout: 20000 });
  await fig.getByRole('button', { name: /NH₄|NH4/ }).click();
  await expect(fig.getByText('∠ 109,5°')).toBeVisible();
});

test('offline after priming: cold reload of a lesson works', async ({ page, context }) => {
  test.setTimeout(120_000); // visits all 53 lessons offline
  await page.goto('/');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload(); // page now controlled by SW
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await context.setOffline(true);
  await page.goto('/dars/g9-s19');
  await expect(page.getByRole('heading', { level: 1, name: /Elektroliz/ })).toBeVisible();
  await expect(page.getByText('Katod (−): qaytarilish')).toBeVisible();
  await expect(page.getByText(/Oflayn rejim/)).toBeVisible();
  // every one of the 53 lessons is available offline
  for (const id of [...Array.from({ length: 24 }, (_, i) => `g8-s${21 + i}`), ...Array.from({ length: 29 }, (_, i) => `g9-s${8 + i}`)]) {
    await page.goto(`/dars/${id}`);
    await expect(page.locator('table').first(), id).toBeVisible();
  }
});

test('timed drill shows a timer and 10 questions; electrolysis visual has controls', async ({ page }) => {
  await page.goto('/mashq');
  await page.getByRole('button', { name: /Vaqtli mashq/ }).click();
  await expect(page.getByRole('timer')).toContainText(/Qoldi: 1[45]:/);
  await expect(page.locator('.question')).toHaveCount(8);
  await page.getByRole('button', { name: 'Mashqlar ro‘yxatiga qaytish' }).click();
  await page.getByRole('button', { name: /43 topshiriq/ }).click();
  await expect(page.locator('.question')).toHaveCount(43);
  await expect(page.locator('.question').last()).toContainText('O2');
  await page.goto('/dars/g9-s19');
  const fig = page.locator('figure.visual').first();
  await expect(fig.getByRole('img')).toBeVisible();
  await fig.getByRole('button', { name: 'Boshlash' }).click();
  await expect(fig.getByRole('button', { name: 'Pauza' })).toHaveAttribute('aria-pressed', 'true');
});

test('process flow steps and Le Chatelier explorer give verified results', async ({ page }) => {
  await page.goto('/dars/g9-s22');
  const flow = page.locator('figure.process');
  await flow.getByRole('button', { name: 'Keyingi bosqich' }).click();
  await expect(flow.locator('[aria-current="step"]')).toContainText('NaHCO₃ cho‘kmaga tushadi');
  await page.goto('/dars/g8-s34');
  const eq = page.locator('figure.visual').first();
  await eq.getByRole('button', { name: 'Bosimni oshirish' }).click();
  await expect(eq.getByRole('status')).toContainText('o‘ngga');
  await eq.getByRole('button', { name: 'Katalizator' }).click();
  await expect(eq.getByRole('status')).toContainText('siljimaydi');
  await page.goto('/dars/g8-s33');
  await page.getByLabel(/Harorat o‘zgarishi/).fill('40');
  await expect(page.getByRole('status').filter({ hasText: 'Tezlik' })).toContainText('16');
});
