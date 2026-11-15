import { useState, type CSSProperties } from 'react';
import { Formula } from '../../components/Formula';

export interface ElectrolysisSpec {
  title: string;
  cation: string; // e.g. "Cu^2+"
  anion: string; // e.g. "Cl^-"
  cathode: string; // half-reaction at (−)
  anode: string; // half-reaction at (+)
  overall: string;
  explanation: string;
}

const ROWS = [70, 110, 150];

/** Schematic (not to scale) inert-electrode cell: cations drift to the cathode (−), anions to the anode (+). */
export function ElectrolysisCell({ spec }: { spec: ElectrolysisSpec }) {
  const [playing, setPlaying] = useState(false);
  const [run, setRun] = useState(0);
  return (
    <figure className="visual">
      <figcaption><strong>{spec.title}</strong> <span className="muted small">— sxema, masshtabsiz</span></figcaption>
      <svg viewBox="0 0 320 210" role="img" aria-label={`${spec.title}: kationlar katodga, anionlar anodga harakatlanadi`} key={run}
        className="cell" data-playing={playing}>
        <rect x="20" y="40" width="280" height="150" rx="8" className="vessel" />
        <rect x="21" y="60" width="278" height="129" className="liquid" />
        <rect x="50" y="20" width="14" height="150" className="electrode" />
        <rect x="256" y="20" width="14" height="150" className="electrode" />
        <text x="57" y="14" textAnchor="middle" className="lbl">Katod (−)</text>
        <text x="263" y="14" textAnchor="middle" className="lbl">Anod (+)</text>
        {ROWS.map((y, i) => (
          <g key={i}>
            <g className="ion cat" style={{ animationDelay: `${i * 0.4}s`, '--dx': `${74 - (170 + i * 18)}px` } as CSSProperties} transform={`translate(${170 + i * 18} ${y})`}>
              <circle r="9" /><text textAnchor="middle" dy="4">+</text>
            </g>
            <g className="ion an" style={{ animationDelay: `${i * 0.4 + 0.2}s`, '--dx': `${246 - (150 - i * 18)}px` } as CSSProperties} transform={`translate(${150 - i * 18} ${y + 20})`}>
              <circle r="9" /><text textAnchor="middle" dy="4">−</text>
            </g>
          </g>
        ))}
      </svg>
      <div className="legend small">
        <span><span className="dot cat" /> kation <Formula>{spec.cation}</Formula> → katodga</span>
        <span><span className="dot an" /> anion <Formula>{spec.anion}</Formula> → anodga</span>
      </div>
      <div className="row" role="group" aria-label="Animatsiya boshqaruvi">
        <button className="btn ghost" onClick={() => setPlaying(!playing)} aria-pressed={playing}>{playing ? 'Pauza' : 'Boshlash'}</button>
        <button className="btn ghost" onClick={() => { setPlaying(false); setRun(run + 1); }}>Qaytadan</button>
      </div>
      <dl className="half">
        <dt>Katod (−), qaytarilish</dt><dd><Formula>{spec.cathode}</Formula></dd>
        <dt>Anod (+), oksidlanish</dt><dd><Formula>{spec.anode}</Formula></dd>
        <dt>Umumiy</dt><dd><Formula>{spec.overall}</Formula></dd>
      </dl>
      <details className="more"><summary>Nima sodir bo‘ldi?</summary><p>{spec.explanation}</p></details>
    </figure>
  );
}
