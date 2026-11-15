import { useState, type CSSProperties } from 'react';
import { Formula } from '../../components/Formula';
import { EQ_SYSTEMS, predictShift, rateFactor, type Change } from './kinetics';

const fmt = (n: number) => (n >= 100 ? Math.round(n).toString() : n.toFixed(n < 10 ? 2 : 1).replace(/\.?0+$/, '')).replace('.', ',');

/** §33: v₂/v₁ = γ^(Δt/10) · [A] factor. Dots are a schematic of collision frequency, not a simulation. */
export function RateExplorer() {
  const [dt, setDt] = useState(0);
  const [gamma, setGamma] = useState(2);
  const [conc, setConc] = useState(1);
  const f = rateFactor(gamma, dt, conc);
  const dots = Array.from({ length: 4 * conc }, (_, i) => i);
  return (
    <figure className="visual">
      <figcaption><strong>Reaksiya tezligi: harorat va konsentratsiya</strong> <span className="muted small">— A + B → mahsulot, v = k·[A]·[B]</span></figcaption>
      <label className="slider"><span>Harorat o‘zgarishi: +{dt} °C</span>
        <input type="range" min={0} max={50} step={10} value={dt} onChange={(e) => setDt(Number(e.target.value))} /></label>
      <label className="slider"><span>Harorat koeffitsiyenti γ</span>
        <select value={gamma} onChange={(e) => setGamma(Number(e.target.value))}>{[2, 3, 4].map((g) => <option key={g}>{g}</option>)}</select></label>
      <label className="slider"><span>[A] konsentratsiyasi: ×{conc}</span>
        <input type="range" min={1} max={3} step={1} value={conc} onChange={(e) => setConc(Number(e.target.value))} /></label>
      <svg viewBox="0 0 300 90" className="box" role="img" aria-label={`Idishda ${dots.length} ta A zarracha; harakat tezligi haroratga bog‘liq`}>
        <rect x="1" y="1" width="298" height="88" rx="8" />
        {dots.map((i) => (
          <circle key={i} r="5" cx={20 + ((i * 53) % 260)} cy={18 + ((i * 29) % 56)} className="jiggle"
            style={{ animationDuration: `${(1.6 / Math.sqrt(1 + dt / 25)).toFixed(2)}s`, animationDelay: `${(i % 5) * 0.13}s` } as CSSProperties} />
        ))}
      </svg>
      <p role="status" className="result">Tezlik <strong>{fmt(f)}</strong> marta ortadi: γ<sup>Δt/10</sup> · [A] = {gamma}<sup>{dt / 10}</sup> · {conc}</p>
      <p className="muted small">Harorat oshganda faol (yetarli energiyali) zarrachalar ulushi keskin ortadi; konsentratsiya oshganda to‘qnashuvlar soni ortadi. Katalizator ham tezlikni oshiradi, lekin o‘zi sarflanmaydi.</p>
    </figure>
  );
}

const CHANGES: { c: Change; label: string; why: (exo: boolean) => string }[] = [
  { c: 'heat', label: 'Isitish', why: (exo) => `Reaksiya ${exo ? 'ekzotermik' : 'endotermik'}: isitilganda issiqlik yutiladigan tomonga siljiydi.` },
  { c: 'cool', label: 'Sovutish', why: (exo) => `Reaksiya ${exo ? 'ekzotermik' : 'endotermik'}: sovutilganda issiqlik ajraladigan tomonga siljiydi.` },
  { c: 'pressureUp', label: 'Bosimni oshirish', why: () => 'Bosim oshsa — gaz molekulalari (hajm) kamroq tomonga; hajmlar teng bo‘lsa siljimaydi.' },
  { c: 'pressureDown', label: 'Bosimni kamaytirish', why: () => 'Bosim kamaysa — gaz molekulalari ko‘proq tomonga; hajmlar teng bo‘lsa siljimaydi.' },
  { c: 'catalyst', label: 'Katalizator', why: () => 'Katalizator ikkala reaksiyani teng tezlashtiradi: muvozanat siljimaydi, faqat tezroq qaror topadi.' },
];

/** §34: Le Chatelier on verified systems; direction comes from predictShift (tested). */
export function EquilibriumExplorer() {
  const [sysId, setSysId] = useState(EQ_SYSTEMS[0]!.id);
  const [last, setLast] = useState<{ label: string; shift: ReturnType<typeof predictShift>; why: string } | null>(null);
  const s = EQ_SYSTEMS.find((x) => x.id === sysId)!;
  const apply = (c: Change, label: string, why: string) => setLast({ label, shift: predictShift(s, c), why });
  return (
    <figure className="visual">
      <figcaption><strong>Muvozanatning siljishi (Le Shatelye prinsipi)</strong></figcaption>
      <div className="chips" role="group" aria-label="Tizimni tanlash">
        {EQ_SYSTEMS.map((x) => (
          <button key={x.id} className="chip" aria-pressed={x.id === sysId} onClick={() => { setSysId(x.id); setLast(null); }}><Formula>{x.equation}</Formula></button>
        ))}
      </div>
      <p className="eq-line" data-shift={last?.shift}>
        <Formula>{s.equation}</Formula> <span className="muted small">({s.exothermic ? '+Q, ekzotermik' : '−Q, endotermik'}; gaz: {s.gasLeft} → {s.gasRight})</span>
      </p>
      <div className="row" role="group" aria-label="O‘zgarish">
        {CHANGES.map(({ c, label, why }) => <button key={label} className="btn ghost" onClick={() => apply(c, label, why(s.exothermic))}>{label}</button>)}
        {s.species.left.concat(s.species.right).map((sp) => (
          <button key={sp} className="btn ghost" onClick={() => apply({ add: sp }, `${sp} qo‘shish`, `Qo‘shilgan modda sarflanadigan tomonga siljiydi.`)}>
            <Formula>{sp}</Formula>&nbsp;qo‘shish
          </button>
        ))}
      </div>
      {last && (
        <p role="status" className="result">
          {last.label}: <strong>{last.shift === 'right' ? 'o‘ngga (mahsulotlar tomonga) →' : last.shift === 'left' ? '← chapga (dastlabki moddalar tomonga)' : 'siljimaydi'}</strong>. {last.why}
        </p>
      )}
    </figure>
  );
}
