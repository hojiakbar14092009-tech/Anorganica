# Known issues and limitations (facts only)

- Content: 85/85 sections have lesson content (status seed-verified = schema + chemistry validators pass, author-checked against the PDF pages). No native-speaker or subject-teacher review yet; 143 textbook clarifications should get an expert spot-check (highest risk: G8 §43 soil pH note, G9 §7 hydrolysis, G9 §24 softening).
- Questions: 435 original (Y1 180, O1 178, Y2 74, O2 3). O1 answers are hand-derived and not re-computed by code. O2 is self-assessed with a rubric, never auto-graded.
- Some table-row `detail.pages` may cite pages slightly outside the lesson's own range (only lesson-level pages are validated).
- Visuals: only 2 schematic electrolysis scenes (G9 §19). No Three.js/3D yet; the other high-value scenes in docs/VISUAL_COVERAGE.md are not built.
- Lab works (G8 p.200+, G9 pp.192–) are not indexed as virtual demonstrations.
- Access gate has no rate limiting; security relies on a long random password. Offline content on an authorized device is readable by anyone with that device. An expired session cannot be renewed offline; the service worker keeps serving cached content.
- Main JS bundle ≈ 126 KB gzip; total precache ≈ 1 MB (99 entries). Not measured on a real iPhone.
- `npm audit`: moderate/low advisories in dev-only lint tooling; not shipped.
- No real iPhone 11 was available: mobile results come from Playwright WebKit (iPhone 11 emulation) on Windows — not Safari on iOS. Desktop e2e uses the installed Edge channel.
- iOS storage eviction behaviour for the installed PWA is untested.
