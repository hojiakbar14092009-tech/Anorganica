# Anorganica

Private, offline-capable PWA chemistry atlas for Uzbek grades 8–9 (textbooks: Asqarov, G‘opirov, To‘xtaboyev, *Kimyo 8* / *Kimyo 9*, 2019).

## Setup (Windows / VS Code)
```
npm install
npm run dev          # http://localhost:5173
npm run build        # content gate + typecheck + production build
npm run preview      # serves dist on :4173 (service worker active)
npm run typecheck && npm run lint && npm run test
npx playwright install chromium webkit && npm run e2e
```

## Source PDFs (never deployed)
Put `reference/kimyo-8-2019.pdf` and `reference/kimyo-9-2019.pdf` in place (gitignored), then `npm run source-map`
to regenerate `content/manifest.json` and `docs/SOURCE_MAP.md`.

## Content
One JSON per § in `content/lessons/`. Formulas `{H2SO4}`, ions `SO4^2-`, electrons `e^-`. `npm run validate:content`
checks schema, page ranges, reaction atom/charge balance and question keys.

## iPhone
Safari → Ulashish → Bosh ekranga qo‘shish. After the first online load every lesson, search and practice works offline.
Updates are checked on launch/foreground/reconnect and applied only after “Yangilash”.

## Deployment
Not deployed. Private access control is not implemented yet — see `docs/KNOWN_ISSUES.md`. `vercel.json` holds SPA rewrites and security headers.

Docs: `docs/PROGRESS.md`, `docs/DECISIONS.md`, `docs/SOURCE_MAP.md`, `docs/EXAM_BLUEPRINT.md`, `docs/VISUAL_COVERAGE.md`, `docs/KNOWN_ISSUES.md`.
