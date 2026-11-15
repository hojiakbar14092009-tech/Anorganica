# Decisions (stable; update only when a decision changes)

| # | Decision | Why |
|---|---|---|
| 1 | React 19 + Vite 8 + strict TS 5.9 (not TS 7) | typescript-eslint supports TS < 6.1 |
| 2 | Plain CSS + design tokens; no Tailwind/shadcn | Spec forbids CSS frameworks; tokens are computed in `src/features/settings/theme.ts` so contrast is testable |
| 3 | Colours computed in OKLCH → sRGB in TS; WCAG AA verified for 50 mode×tone×warmth combos | One source of truth; sliders cannot break contrast |
| 4 | PDF processing with `mupdf` (npm, WASM — same engine as PyMuPDF) | PyPI was unreachable from this machine; npm works. Dev-only dependency |
| 5 | `content/inventory.json` (hand-entered from spec, checked against PDFs) + generated `content/manifest.json` | Inventory is the human source; pages are machine-extracted |
| 6 | Printed page = PDF page index for both books | Verified programmatically on every numbered page + visual check of G8 p.34 |
| 7 | Grade 8 TOC is wrong for §§6–13 (off by 1–2 pages) → heading page wins | Book's own TOC conflicts with the body; documented in SOURCE_MAP |
| 8 | Lessons = one JSON per §, lazily imported (own chunk ≈3 KB gz), all precached by SW | Data-driven rendering; offline for all lessons without loading everything at start |
| 9 | Formulas written as `{H2SO4}`, ions `SO4^2-`, electrons `e^-` in content | Same string feeds renderer, search and atom/charge validator |
| 10 | Questions live inside their lesson JSON | One source; the practice hub aggregates them |
| 11 | Local state in localStorage, zod-validated, JSON export/import | Few KB; synchronous; corrupt data falls back to defaults |
| 12 | `registerType: 'prompt'` + update checks on foreground/reconnect | Never reloads under a student; iOS gives no background-update guarantees |
| 13 | 43-task session uses the official type counts but only the 53 lessons, labelled as such; disabled automatically if any type lacks validated questions | Spec §5 |
| 14 | No authentication of any kind (owner decision, spec 53-Mavzu-Loginsiz). Earlier middleware gate removed | One-tap entry; see docs/DEPLOYMENT.md for the privacy trade-off |
| 15 | Scope = exactly 53 lessons; `src/content/allowed-lessons.json` is the single allowlist, `content/manifest.json` is generated from it; 32 earlier out-of-scope lessons deleted | Spec hard gate; tests enforce 24/29/53 |
| 16 | 3D = Three.js + R3F + Drei, one reusable `MoleculeScene` fed by tested geometry data (`molecules.ts`); lazy chunk, not precached (runtime CacheFirst, max 3), `frameloop="demand"`, rotation only after an explicit toggle so page scroll is never hijacked | iPhone 11 performance and offline size |
| 17 | Phone tables with ≥4 columns render as labelled cards (≤560 px) | No cramped horizontal tables |
| 18 | Updates auto-apply when the user reaches the home screen (safe boundary); elsewhere a “Yangi versiya tayyor — yangilash” button | Never interrupts an answer or timer |
| 19 | Progress stays in schema-validated localStorage (small JSON) instead of IndexedDB | Few KB; same eviction rules on iOS; avoids a dependency |
