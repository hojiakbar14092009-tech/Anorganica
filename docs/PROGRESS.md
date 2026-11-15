# Progress (resume here)

```
PHASE: 0 — Inspect and map — DONE
CONTENT: 85/85 sections mapped (44 + 41), auto-verified; printed page = PDF index; G8 TOC §§6–13 mismatch documented
```

```
PHASE: 1 — Mobile foundation — DONE
```

```
PHASE: 2 — All textbook lessons — DONE (pending expert review, see KNOWN_ISSUES)
CONTENT: 85/85 lessons; 435 questions (Y1 180, O1 178, Y2 74, O2 3); 665 reactions, all atom/charge-balanced; 143 textbook clarifications
```

```
PHASE: 3 — Visual engine — STARTED
IMPLEMENTED: src/features/visuals (ElectrolysisCell SVG, play/pause/reset, reduced-motion safe), registry with balance tests
CONTENT: 2 verified scenes (G9 §19). NEXT: NaCl lattice, molecular geometry, contact process / blast furnace flows, precipitation
```

```
PHASE: 4 — Certificate practice — MOSTLY DONE
IMPLEMENTED: filters, error review, timed drill (10 q / 15 min), paging, O2 rubric self-check, non-official labelling
NEXT: more O2 tasks; exam-skill tags beyond per-lesson skills
```

```
PHASE: 5 — Hardening/deploy — IN PROGRESS
IMPLEMENTED: middleware.ts access gate (+ unit tests), credentialed manifest, vercel.json CSP/noindex
CHECKS (2026-11-15): typecheck ✓ lint ✓ vitest 113/113 ✓ build ✓ Playwright WebKit iPhone11 6/6 ✓ desktop Edge 6/6 ✓
NEXT: verify deployed gate with anonymous curl (401 on /, /assets/*, /sw.js); real iPhone check
```

## How to author/fix a lesson
1. Pages from docs/SOURCE_MAP.md; text from `reference/text/g{8,9}.json` (regenerate with `npm run source-map`).
2. Edit `content/lessons/g{grade}-s{n}.json` (structure: g8-s32.json). Textbook errors → `clarifications`.
3. `npm run validate:content`.
