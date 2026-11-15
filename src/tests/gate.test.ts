import { describe, expect, it } from 'vitest';
import { gate, makeToken, validToken } from '../../middleware';

const S = 'correct-horse-battery-staple';
const req = (path: string, init?: RequestInit) => new Request('https://x.test' + path, init);

describe('access gate', () => {
  it('fails closed without a configured secret', async () => {
    expect((await gate(req('/'), undefined))?.status).toBe(503);
  });
  it('denies anonymous requests for pages, chunks and assets', async () => {
    for (const p of ['/', '/dars/g8-s23', '/assets/index.js', '/sw.js', '/manifest.webmanifest']) {
      const r = await gate(req(p), S);
      expect(r?.status, p).toBe(401);
      expect(await r!.text()).not.toContain('Xlor');
    }
  });
  it('rejects a wrong password and accepts the right one with a signed HttpOnly cookie', async () => {
    const post = (pw: string) => req('/__auth', { method: 'POST', body: new URLSearchParams({ password: pw }) });
    expect((await gate(post('wrong'), S))?.status).toBe(401);
    const ok = await gate(post(S), S);
    expect(ok?.status).toBe(303);
    const cookie = ok!.headers.get('set-cookie')!;
    expect(cookie).toMatch(/HttpOnly; Secure; SameSite=Lax/);
    const token = cookie.split(';')[0]!.split('=')[1]!;
    expect(await gate(req('/assets/index.js', { headers: { cookie: `a=1; ag_session=${token}` } }), S)).toBeNull();
  });
  it('rejects forged, expired and other-secret tokens', async () => {
    const now = Date.now();
    const t = await makeToken(S, now);
    expect(await validToken(t, S, now)).toBe(true);
    expect(await validToken(t.replace(/^\d+/, (e) => String(Number(e) + 999)), S, now)).toBe(false);
    expect(await validToken(t, S, now + 181 * 24 * 3600 * 1000)).toBe(false);
    expect(await validToken(t, 'other-secret', now)).toBe(false);
    expect(await validToken('garbage', S, now)).toBe(false);
  });
});
