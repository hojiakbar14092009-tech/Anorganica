# Known issues and limitations (facts only)

- Content: 53/53 lessons. Agent-written lessons (G8 §40–44, G9 §8–36 except §19) received an independent sub-agent review on 2026-11-15: all O1/Y1/Y2 keys recomputed, no numeric errors; 8 factual fixes/clarifications applied. No subject-teacher or native-speaker review yet.
- Questions: 260 original (O2 8). O1 answers hand-derived and independently re-checked by review, not recomputed by code. O2 is self-assessed (rubric = 25 points, test-enforced), never auto-graded.
- Visuals: 38 of 53 lessons have a verified visual (3D incl. P₄O₁₀, Cu/Fe cells, CO₃²⁻, SiO₄⁴⁻; 12 process flows; rate/equilibrium explorers; 3 electrolysis cells). 15 lessons use tables only; per-figure textbook audit for them is pending.
- The 3D engine (≈250 KB gz) is cached on first use only; offline without prior use, lessons show the text facts instead of the model.
- Stacked phone tables use `display:block`; VoiceOver may announce them as plain text rather than a table (visual labels are present).
- No physical iPhone 11 test: mobile results come from Playwright WebKit (iPhone 11 emulation) on Windows. iOS storage eviction and Home Screen install flow are untested on device.
- Not private: no login by design (docs/DEPLOYMENT.md).
- `npm audit`: advisories only in dev-only lint tooling.
