# iPhone 11 manual acceptance checklist

Automated results so far come from **Playwright WebKit with iPhone 11 emulation on Windows**, not from Safari on a real device.
Run this list on a physical iPhone 11 (iOS Safari) and record date, iOS version and result per line.

## Measured build (2026-11-15, `npm run build`)
| Asset | Raw | gzip |
|---|---|---|
| Main JS (app shell, all UI, search, practice) | 442 KB | 135 KB |
| CSS | 15 KB | 4.2 KB |
| 3D chunk (Three.js + R3F + Drei), loaded only on “3D modelni ochish” | 935 KB | 248 KB |
| Each lesson chunk | ~5–9 KB | ~2–4 KB |
| Service-worker precache (shell + 53 lessons + icons) | 832 KiB, 67 entries | — |
The 3D chunk is not precached; it is cached on first use (max 3 entries).

## Checklist
1. Open https://anorganica.vercel.app in Safari: the home screen appears directly — no login, code or password field.
2. Intro shows ≤ 1.6 s on the very first open only; it does not show again; with Settings → Accessibility → Reduce Motion it does not show at all.
3. Share → “Bosh ekranga qo‘shish”: the icon and the name “Anorganica” are correct; opening from the icon starts standalone with no Safari bars; the notch/home-indicator areas do not cover content.
4. Home: “8-sinf (24 mavzu)” / “9-sinf (29 mavzu)”; open a chapter → lesson in ≤ 3 taps; back gesture returns to the previous screen.
5. Search “H₂SO₄”, “sulfat”, “o‘g‘itlar”, “§23” — correct lessons; no § outside the 53 appears.
6. Lesson tables at portrait width: 2–3 column tables fit; 4+ column tables show as labelled cards; no sideways page scrolling.
7. Tap a row with “›”: details open with equation, observation, citation.
8. 3D (e.g. 8-sinf §37): “3D modelni ochish” loads the model; page scrolling still works over the model; after “Aylantirish…” one finger rotates and pinch zooms; “Asl ko‘rinish” resets; frame rate feels smooth (note subjectively; no FPS tool on iOS Safari).
9. Process flows (8-sinf §35, 9-sinf §36): Boshlash/Pauza/Keyingi/Qaytadan work; with Reduce Motion there is no auto-advance.
10. Settings: Light/Dark/System, “Vizual yorug‘lik” and “Rang harorati” sliders change app colours instantly; text stays readable at every slider end; Reset works. (Hardware brightness is intentionally not changed.)
11. Practice: answer a Y1 and an O1 with decimal comma (e.g. “2,24”); open “43 topshiriq · 180 daqiqa”; the timer counts; “Yakunlash” shows a raw score with the non-official label.
12. Offline: after visiting the site online once, enable Airplane Mode, force-quit and reopen from the Home Screen icon: home, menu, search and any of the 53 lessons open; 3D models that were never opened show text facts only.
13. Update: after a new deploy, reopen online; when returning to Home the new version applies, or a “Yangi versiya tayyor — yangilash” bar appears on other screens; progress and settings are kept.
14. Leave the phone unused for a week (iOS storage policy) and reopen: record whether cached content/progress survived.
