# Known issues and limitations (facts only)

- Content: 53/53 lessons (schema + chemistry validators pass, author-checked against PDF pages). G8 §40–44 and all G9 lessons except §19 were drafted by sub-agents under the same rules; no subject-teacher or native-speaker review yet.
- Questions: 255 original (Y1 100, Y2 42, O1 110, O2 3). O1 answers are hand-derived, not recomputed by code. O2 is self-assessed with a rubric, never auto-graded. Only 3 O2 tasks exist, exactly the 43-task session minimum.
- Visuals: 31 of 53 lessons have a verified visual (24 tested 3D models on 20 lessons, 7 process flows, rate/equilibrium explorers, 3 electrolysis cells). Lessons without a visual use tables only; the textbook-figure audit for them is pending.
- The 3D engine (≈250 KB gz) is cached on first use only; offline without prior use, lessons show the text facts instead of the model.
- Stacked phone tables use `display:block`; VoiceOver may announce them as plain text rather than a table (visual labels are present).
- No physical iPhone 11 test: mobile results come from Playwright WebKit (iPhone 11 emulation) on Windows. iOS storage eviction and Home Screen install flow are untested on device.
- Not private: no login by design (docs/DEPLOYMENT.md).
- `npm audit`: advisories only in dev-only lint tooling.
