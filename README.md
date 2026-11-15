# Anorganica

Offline-capable PWA chemistry atlas: exactly 53 lessons — grade 8 §21–44 and grade 9 §8–36 (textbooks: Asqarov, G‘opirov, To‘xtaboyev, *Kimyo 8* / *Kimyo 9*, 2019).

## Setup (Windows / VS Code)
```
npm install
npm run dev          # http://localhost:5173
npm run build        # content gate + typecheck + production build
npm run preview      # serves dist on :4173 (service worker active)
npm run typecheck && npm run lint && npm run test
npx playwright install webkit && npm run test:e2e
```

## Source PDFs (never deployed)
Put `reference/kimyo-8-2019.pdf` and `reference/kimyo-9-2019.pdf` in place (gitignored), then `npm run source-map`
to regenerate (scope comes from `src/content/allowed-lessons.json`) `content/manifest.json` and `docs/SOURCE_MAP.md`.

## Content
One JSON per § in `content/lessons/`. Formulas `{H2SO4}`, ions `SO4^2-`, electrons `e^-`. `npm run validate:content`
checks schema, page ranges, reaction atom/charge balance and question keys.

## iPhone
Safari → Ulashish → Bosh ekranga qo‘shish. After the first online load every lesson, search and practice works offline.
Updates are checked on launch/foreground/reconnect and applied only after “Yangilash”.

## Deployment (Vercel)
No login of any kind. Push to `main` deploys https://anorganica.vercel.app. Details and the privacy trade-off: `docs/DEPLOYMENT.md`.

Docs: `docs/PROGRESS.md`, `docs/DECISIONS.md`, `docs/SOURCE_MAP.md`, `docs/EXAM_ALIGNMENT.md`, `docs/DEPLOYMENT.md`, `docs/VISUAL_COVERAGE.md`, `docs/KNOWN_ISSUES.md`.
