import { useEffect, useState, useSyncExternalStore } from 'react';
import { BrowserRouter, Link, NavLink, Route, Routes } from 'react-router-dom';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Home } from '../features/lessons/Home';
import { LessonPage } from '../features/lessons/LessonPage';
import { SearchPage } from '../features/lessons/SearchPage';
import { PracticePage } from '../features/practice/PracticePage';
import { SettingsPage } from '../features/settings/SettingsPage';
import { applyPalette, palette, type Mode } from '../features/settings/theme';
import { update, useAppState } from '../lib/storage';
import { Intro, Logo } from './Intro';

const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const useMedia = (q: MediaQueryList) =>
  useSyncExternalStore((cb) => (q.addEventListener('change', cb), () => q.removeEventListener('change', cb)), () => q.matches);
const useOnline = () =>
  useSyncExternalStore((cb) => {
    addEventListener('online', cb); addEventListener('offline', cb);
    return () => { removeEventListener('online', cb); removeEventListener('offline', cb); };
  }, () => navigator.onLine);

export function App() {
  const s = useAppState();
  const sysDark = useMedia(darkQuery);
  const sysReduce = useMedia(motionQuery);
  const online = useOnline();
  const mode: Mode = s.theme === 'system' ? (sysDark ? 'dark' : 'light') : s.theme;
  const reduce = s.reduceMotion || sysReduce;
  const [intro, setIntro] = useState(!s.introSeen && !reduce);

  useEffect(() => applyPalette(palette(mode, s.tone, s.warmth), mode), [mode, s.tone, s.warmth]);
  useEffect(() => { document.documentElement.dataset.reduceMotion = String(reduce); }, [reduce]);

  return (
    <BrowserRouter>
      <a className="skip" href="#main">Asosiy mazmunga o‘tish</a>
      <header className="topbar">
        <Link to="/" className="brand" aria-label="Anorganica — bosh sahifa"><Logo /><span>Anorganica</span></Link>
        <nav aria-label="Asosiy">
          <NavLink to="/qidiruv" aria-label="Qidiruv" className="icon-btn">⌕</NavLink>
          <NavLink to="/mashq" aria-label="Sertifikatga tayyorgarlik" className="icon-btn">✓</NavLink>
          <NavLink to="/sozlamalar" aria-label="Sozlamalar" className="icon-btn">⚙</NavLink>
        </nav>
      </header>
      {!online && <p className="net-status" role="status">Oflayn rejim — saqlangan darslar ishlaydi</p>}
      <UpdateBanner />
      <div id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dars/:id" element={<LessonPage />} />
          <Route path="/qidiruv" element={<SearchPage />} />
          <Route path="/mashq" element={<PracticePage />} />
          <Route path="/sozlamalar" element={<SettingsPage />} />
          <Route path="*" element={<main className="page"><h1>Sahifa topilmadi</h1><Link to="/">Bosh sahifaga</Link></main>} />
        </Routes>
      </div>
      <InstallTip />
      {intro && <Intro onDone={() => { setIntro(false); update({ introSeen: true }); }} />}
    </BrowserRouter>
  );
}

function UpdateBanner() {
  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW({
    onRegisteredSW(_url, reg) {
      if (!reg) return;
      // Check for a new version on foreground and on reconnect (iOS gives no background guarantees).
      const check = () => navigator.onLine && reg.update().catch(() => undefined);
      document.addEventListener('visibilitychange', () => document.visibilityState === 'visible' && check());
      addEventListener('online', check);
    },
  });
  if (!needRefresh) return null;
  return (
    <div className="update" role="status">
      <span>Yangi versiya tayyor</span>
      <button className="btn" onClick={() => updateServiceWorker(true)}>Yangilash</button>
    </div>
  );
}

function InstallTip() {
  const { installTipDismissed } = useAppState();
  const nav = navigator as Navigator & { standalone?: boolean };
  const iosSafari = /iPhone|iPad|iPod/.test(navigator.userAgent) && !nav.standalone;
  if (!iosSafari || installTipDismissed) return null;
  return (
    <div className="install-tip" role="note">
      <span>O‘rnatish: Safari → <strong>Ulashish</strong> → <strong>Bosh ekranga qo‘shish</strong></span>
      <button className="icon-btn" aria-label="Yopish" onClick={() => update({ installTipDismissed: true })}>×</button>
    </div>
  );
}
