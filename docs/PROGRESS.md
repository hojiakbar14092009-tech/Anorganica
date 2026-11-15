# Progress (resume here)

```
PHASE: 0 — Inspect and map — DONE
IMPLEMENTED: reference/ PDFs located (Downloads → reference/kimyo-8-2019.pdf, kimyo-9-2019.pdf; 208 pp each),
  content/inventory.json, scripts/build-source-map.mjs → content/manifest.json + docs/SOURCE_MAP.md,
  docs/EXAM_BLUEPRINT.md (official PDF re-checked 2026-11-15), docs/DECISIONS.md
CONTENT: 85/85 sections mapped (44 + 41), all auto-verified (heading found + title matched); printed page = PDF index
CHECKS: src/tests/content.test.ts inventory gate — passed
RISKS/BLOCKERS: Grade 8 TOC wrong for §§6–13 (documented). Lab-work pages (G8 p.200+, G9 pp.192–) not yet indexed.
```

```
PHASE: 1 — Mobile foundation — IN PROGRESS (core done; see CHECKS)
IMPLEMENTED: React/Vite/TS app: home (search, Davom etish, 8/9-sinf, chapter <details> nav), lesson page
  (table-first, expandable rows, reactions, citations, clarifications, favorites, prev/next, skeleton, pending state),
  search (§, formula, subscripts, apostrophe variants; offline corpus), practice hub (Y1/Y2/O1/O2 cards, filters, error review),
  settings (Light/Dark/System, Vizual yorug‘lik, Rang harorati, reduced motion, export/import), intro animation,
  PWA (prompt-based update, foreground/reconnect checks, offline banner, iOS install tip), vercel.json headers/CSP.
CONTENT: 3 verified lessons (g8-s23, g8-s32, g9-s19); 34 reactions balance-checked; 15 original questions; 0 visuals
CHECKS: see latest run below
RISKS/BLOCKERS: private access not implemented; no real iPhone; bundle 122 KB gz
NEXT: author lessons for G8 §§21–44 then G9 §§8–36 (compulsory), same JSON format, 4–5 questions each
```

## How to author a lesson (cheap path)
1. `node --input-type=module -e "…"` print `reference/text/g{8,9}.json` pages listed in docs/SOURCE_MAP.md (pdfPage..endPage).
2. Write `content/lessons/g{grade}-s{n}.json` (copy structure of g8-s32.json). Original wording; cite pages.
3. `npm run validate:content` (schema, page range, atom/charge balance, answer keys).
