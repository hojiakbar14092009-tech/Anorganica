// Rasterizes public/icon.svg into PWA/Apple PNG icons using Playwright's Chromium (dev-only).
// Full-bleed square; the mark sits in the central ~60%, so it is safe as a maskable icon.
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';

const svg = readFileSync('public/icon.svg', 'utf8');
const browser = await chromium.launch({ channel: 'msedge' });
for (const [name, size] of [['icon-192.png', 192], ['icon-512.png', 512], ['apple-touch-icon.png', 180]]) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  await page.setContent(`<style>*{margin:0}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`);
  await page.screenshot({ path: `public/${name}` });
  await page.close();
}
await browser.close();
console.log('icons ok');
