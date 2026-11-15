# Known issues and limitations (facts only)

- Content: 20 of 85 sections have verified lesson content (G8 §§21–39, G9 §19); the other 65 show an honest “tayyorlanmoqda” state with source pages.
- Questions: 85 original questions (target ≥ 340); no O2 yet. O1 numeric answers are hand-derived and spot-checked; no automated arithmetic re-derivation yet.
- No 3D/animation module yet (Phase 3). No O2 written-task questions yet.
- Private access is NOT implemented. Do not deploy publicly; `noindex` + robots.txt are deterrents only.
- Main JS bundle ≈ 122 KB gzip (React + router + zod). zod/mini could cut it; not yet measured on device.
- `npm audit`: 12 moderate/low advisories, all in dev-only lint tooling (@typescript-eslint); not shipped to clients.
- Grade 8 TOC printed pages for §§6–13 differ from the real heading pages; app uses heading pages.
- No real iPhone 11 was available; mobile results come from Playwright WebKit (iPhone 11 emulation) on Windows — not Safari on iOS. Desktop project runs on the installed Edge (Chromium) channel because the Playwright Chromium download was too slow on this network.
- Playwright WebKit's service-worker offline test passed on Windows; iOS Safari storage eviction (≈7 days without use for non-installed sites) is untested.
