// Real-browser smoke test against a deployed URL: login through the gate, open a lesson, reload offline.
// Usage: ACCESS_PASSWORD=... node scripts/smoke-prod.mjs https://<deployment>
import { webkit, devices } from '@playwright/test';
const base = process.argv[2];
const pw = process.env.ACCESS_PASSWORD;
if (!base || !pw) throw new Error('usage: ACCESS_PASSWORD=... node scripts/smoke-prod.mjs <url>');
const browser = await webkit.launch();
const ctx = await browser.newContext({ ...devices['iPhone 11'] });
const page = await ctx.newPage();
const problems = [];
page.on('console', (m) => m.type() === 'error' && problems.push(m.text()));
page.on('response', (r) => r.status() === 401 && problems.push('401 ' + r.url()));
page.on('pageerror', (e) => problems.push(String(e)));
await page.goto(base);
await page.getByLabel('Kirish paroli').fill(pw);
await page.getByRole('button', { name: 'Kirish' }).click();
await page.waitForSelector('text=Anorganica');
problems.length = 0; // the pre-login page is intentionally served with 401
await page.goto(base + '/dars/g9-s19');
await page.getByRole('heading', { level: 1 }).waitFor();
const h1 = await page.getByRole('heading', { level: 1 }).textContent();
await page.evaluate(async () => { await navigator.serviceWorker.ready; });
await page.reload();
await page.evaluate(async () => { await navigator.serviceWorker.ready; });
await ctx.setOffline(true);
await page.goto(base + '/dars/g8-s32');
const offlineH1 = await page.getByRole('heading', { level: 1 }).textContent({ timeout: 10000 });
console.log(JSON.stringify({ h1, offlineH1, consoleErrors: problems }, null, 1));
await browser.close();
if (problems.length) process.exitCode = 1;
