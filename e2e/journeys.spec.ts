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
  // Honest pending state for sections without verified content yet
  await expect(page.getByText(/hali tayyorlanmoqda/)).toBeVisible();
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

test('offline after priming: cold reload of a lesson works', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload(); // page now controlled by SW
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await context.setOffline(true);
  await page.goto('/dars/g9-s19');
  await expect(page.getByRole('heading', { level: 1, name: /Elektroliz/ })).toBeVisible();
  await expect(page.getByText('Katod (−): qaytarilish')).toBeVisible();
  await expect(page.getByText(/Oflayn rejim/)).toBeVisible();
});
