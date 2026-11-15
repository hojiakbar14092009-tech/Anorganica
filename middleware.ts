// Server-side access gate (Vercel Routing Middleware): every request — HTML, JS, lesson chunks, icons, sw.js —
// needs a signed HttpOnly session cookie. The password lives only in the ACCESS_PASSWORD env var.
// shortcut: no rate limiting (no shared store) — use a long random password; add KV-based throttling if the URL leaks.
import { next } from '@vercel/functions';

export const config = { runtime: 'nodejs' };

const COOKIE = 'ag_session';
const MAX_AGE = 180 * 24 * 3600; // long-lived so authorized phones keep working offline-first
const enc = new TextEncoder();

async function sign(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', enc.encode('anorganica:' + secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(data)));
  return btoa(String.fromCharCode(...sig)).replace(/[+/=]/g, (c) => ({ '+': '-', '/': '_', '=': '' })[c]!);
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function makeToken(secret: string, now: number): Promise<string> {
  const exp = String(Math.floor(now / 1000) + MAX_AGE);
  return `${exp}.${await sign(exp, secret)}`;
}

export async function validToken(token: string | undefined, secret: string, now: number): Promise<boolean> {
  const [exp, sig] = (token ?? '').split('.');
  if (!exp || !sig || !/^\d+$/.test(exp) || Number(exp) * 1000 < now) return false;
  return safeEqual(sig, await sign(exp, secret));
}

const cookieOf = (req: Request) => req.headers.get('cookie')?.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`))?.[1];

const loginPage = (error: boolean) => `<!doctype html><html lang="uz"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="noindex">
<title>Anorganica — kirish</title><style>
body{margin:0;min-height:100dvh;display:grid;place-items:center;font:17px/1.5 -apple-system,system-ui,sans-serif;background:#f4f3f0;color:#1d1c1a}
@media(prefers-color-scheme:dark){body{background:#16181a;color:#eceef0}input{background:#1d2023;color:#eceef0}}
form{width:min(340px,calc(100vw - 32px));display:grid;gap:12px}h1{margin:0;font-size:1.5rem}
input,button{font:inherit;min-height:48px;border-radius:10px;padding:0 14px;border:1px solid #888}
button{background:#006b7a;color:#fff;border-color:#006b7a;font-weight:600}.e{color:#b3261e;margin:0}</style></head>
<body><form method="post" action="/__auth"><h1>Anorganica</h1><label for="p">Kirish paroli</label>
<input id="p" name="password" type="password" autocomplete="current-password" required autofocus>
${error ? '<p class="e" role="alert">Parol noto‘g‘ri.</p>' : ''}<button>Kirish</button></form></body></html>`;

const html = (body: string, status: number) =>
  new Response(body, {
    status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex, nofollow',
      'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'",
    },
  });

/** Returns a Response to send, or null to let the request through. Pure for testing. */
export async function gate(req: Request, secret: string | undefined, now = Date.now()): Promise<Response | null> {
  if (!secret) return new Response('Server is not configured', { status: 503 }); // fail closed
  const url = new URL(req.url);
  if (url.pathname === '/__auth' && req.method === 'POST') {
    const password = String((await req.formData().catch(() => null))?.get('password') ?? '');
    if (!safeEqual(await sign(password, secret), await sign(secret, secret))) return html(loginPage(true), 401);
    return new Response(null, {
      status: 303,
      headers: {
        location: '/',
        'set-cookie': `${COOKIE}=${await makeToken(secret, now)}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax`,
      },
    });
  }
  if (await validToken(cookieOf(req), secret, now)) return null;
  return html(loginPage(false), 401);
}

export default async function middleware(req: Request): Promise<Response> {
  return (await gate(req, process.env.ACCESS_PASSWORD)) ?? next();
}
