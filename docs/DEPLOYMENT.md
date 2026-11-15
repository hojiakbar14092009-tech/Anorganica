# Deployment (Vercel)

- Project: Vercel `anorganica` (Hobby), linked to `github.com/hojiakbar14092009-tech/Anorganica`; every push to `main` deploys production.
  URL: https://anorganica.vercel.app
- Build: `npm run build` (content gate → typecheck → vite build + service worker). Output `dist/`. `vercel.json`: SPA rewrites, CSP, `X-Robots-Tag: noindex, nofollow`, `sw.js` no-cache.
- **No login, password, PIN or account** — by the owner's decision. `/` and every `/dars/<id>` open directly.
- **No login means not private.** `noindex`, `robots.txt: Disallow: /`, no sitemap and no analytics only reduce discovery; anyone with the URL can open the app and download its bundled content. Real access restriction would be a new, explicit requirement.
- Vercel-side settings the owner controls (not changed by code): Vercel Authentication is enabled for **preview** deployments only; production is public. The old `ACCESS_PASSWORD` environment variable is unused and can be deleted in Project → Settings → Environment Variables.
- Reference PDFs (`reference/`) are gitignored and never deployed.
- Smoke test after deploy: `node scripts/smoke-prod.mjs https://anorganica.vercel.app` (WebKit, iPhone 11 emulation: home → lesson → offline lesson).
