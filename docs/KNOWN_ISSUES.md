# Known issues and limitations (facts only)

- Content: only 3 of 85 sections have verified lesson content (g8-s23, g8-s32, g9-s19); the other 82 show an honest “tayyorlanmoqda” state with source pages.
- Questions: 15 original questions (target ≥ 340). O1 numeric answers are checked by hand; there is no automated arithmetic re-derivation yet.
- No 3D/animation module yet (Phase 3). No O2 written-task questions yet.
- Private access is NOT implemented. Do not deploy publicly; `noindex` + robots.txt are deterrents only.
- Main JS bundle ≈ 122 KB gzip (React + router + zod). zod/mini could cut it; not yet measured on device.
- `npm audit`: 12 moderate/low advisories, all in dev-only lint tooling (@typescript-eslint); not shipped to clients.
- Grade 8 TOC printed pages for §§6–13 differ from the real heading pages; app uses heading pages.
- No real iPhone 11 was available; mobile results come from Playwright WebKit with iPhone 11 emulation on Windows, which is not Safari on iOS.
