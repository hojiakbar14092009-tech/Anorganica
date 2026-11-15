# Progress (resume here) — spec: Anorganica_Claude_Code_Master_Prompt_53_Mavzu_Loginsiz.md

```
PHASE: 0–1 Audit, scope allowlist, source map — DONE
SCOPE: 8-sinf 24/24; 9-sinf 29/29; total 53/53 (src/content/allowed-lessons.json → content/manifest.json, docs/SOURCE_MAP.md)
AUTH: removed (middleware, gate tests, env example, @vercel/functions); no-login verified by e2e on fresh browser profile
```

```
PHASE: 2–3 App + 53 lessons — DONE (expert review pending, KNOWN_ISSUES)
```

```
PHASE: 4 Graphics — MOSTLY DONE
DONE: reusable 3D MoleculeScene (Three.js/R3F/Drei, lazy, demand frameloop, toggle-to-rotate, WebGL fallback), 22 tested models on 18 lessons;
  2D electrolysis; ProcessFlow (contact process, HNO₃, rusting, Solvay, blast furnace); rate + equilibrium explorers (logic unit-tested)
NEXT: Al electrolysis (g9-s25), metallic lattice/alloys (g9-s16/17), amphoteric Al(OH)₃ (g9-s27), Cr/Mn colour series (g9-s32/33)
```

```
PHASE: 5 Practice — DONE
DONE: 255 questions; filters, error review, 8-question quick drill, 43-task session (32/3/5/3, 180 min, scope-labelled), O2 rubric; exam-alignment.json + docs/EXAM_ALIGNMENT.md
```

```
PHASE: 6 Offline/updates/polish — DONE
DONE: 53 lessons precached; 3D runtime-cached; auto-update at home (safe boundary) + banner elsewhere; phone card tables
```

```
PHASE: 7 Tests/handoff — DONE for this milestone
TESTS (2026-11-15): typecheck ✓, lint ✓, vitest ✓, build ✓, Playwright WebKit iPhone 11 + desktop Edge 16/16 ✓ (incl. offline 53 lessons, no-login, excluded §§ 404)
DEPLOY: docs/DEPLOYMENT.md; push to main auto-deploys https://anorganica.vercel.app
```
