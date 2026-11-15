// Render PDF pages to PNG for visual verification of extraction. Usage: node scripts/render-page.mjs <pdf> <outDir> <page...> (1-based)
import * as mupdf from 'mupdf';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const [pdf, outDir, ...pages] = process.argv.slice(2);
const doc = mupdf.Document.openDocument(readFileSync(pdf), 'application/pdf');
mkdirSync(outDir, { recursive: true });
for (const p of pages) {
  const pix = doc.loadPage(Number(p) - 1).toPixmap(mupdf.Matrix.scale(1, 1), mupdf.ColorSpace.DeviceRGB, false, true);
  writeFileSync(`${outDir}/p${p}.png`, pix.asPNG());
}
console.log('pages', doc.countPages());
