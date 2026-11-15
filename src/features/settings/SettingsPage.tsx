import { useRef, useState } from 'react';
import { exportProgress, importProgress, storageError, update, useAppState } from '../../lib/storage';

export function SettingsPage() {
  const s = useAppState();
  const file = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState('');

  const download = () => {
    const url = URL.createObjectURL(new Blob([exportProgress()], { type: 'application/json' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: 'anorganica-progress.json' });
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="page settings">
      <h1>Sozlamalar</h1>

      <fieldset>
        <legend>Mavzu</legend>
        <div className="seg">
          {(['system', 'light', 'dark'] as const).map((t) => (
            <button key={t} aria-pressed={s.theme === t} onClick={() => update({ theme: t })}>
              {{ system: 'Tizim', light: 'Yorug‘', dark: 'Qorong‘i' }[t]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Ko‘z qulayligi</legend>
        <label className="slider">
          <span>Vizual yorug‘lik</span>
          <input type="range" min={-1} max={1} step={0.1} value={s.tone} onChange={(e) => update({ tone: Number(e.target.value) })} />
        </label>
        <label className="slider">
          <span>Rang harorati <small>(sovuq ↔ iliq)</small></span>
          <input type="range" min={-1} max={1} step={0.1} value={s.warmth} onChange={(e) => update({ warmth: Number(e.target.value) })} />
        </label>
        <p className="muted small">Faqat ilova ranglarini o‘zgartiradi, telefon ekranining yorqinligini emas. Matn kontrasti har qanday holatda WCAG AA darajasida saqlanadi.</p>
        <button className="btn ghost" onClick={() => update({ tone: 0, warmth: 0 })}>Asl holatga qaytarish</button>
      </fieldset>

      <fieldset>
        <legend>Harakat</legend>
        <label className="toggle">
          <input type="checkbox" checked={s.reduceMotion} onChange={(e) => update({ reduceMotion: e.target.checked })} />
          <span>Harakatni kamaytirish</span>
        </label>
      </fieldset>

      <fieldset>
        <legend>Natijalarim</legend>
        <p className="muted small">Natijalar faqat shu qurilmada saqlanadi.</p>
        {storageError && <p className="state-error" role="alert">Xotira to‘lgan yoki yopiq — o‘zgarishlar saqlanmayapti.</p>}
        <div className="row">
          <button className="btn ghost" onClick={download}>Eksport (JSON)</button>
          <button className="btn ghost" onClick={() => file.current?.click()}>Import</button>
        </div>
        <input ref={file} type="file" accept="application/json" hidden onChange={async (e) => {
          const f = e.target.files?.[0];
          if (f) setMsg(importProgress(await f.text()) ? 'Natijalar tiklandi.' : 'Fayl noto‘g‘ri yoki buzilgan.');
          e.target.value = '';
        }} />
        {msg && <p role="status">{msg}</p>}
      </fieldset>
    </main>
  );
}
