import { useEffect, useState } from 'react';
import { Formula } from '../../components/Formula';

export interface ProcessStep { name: string; place: string; equation?: string; conditions?: string; note: string }
export interface ProcessSpec { title: string; steps: ProcessStep[]; explanation: string }

const reduceMotion = () => document.documentElement.dataset.reduceMotion === 'true';

/** Simplified, correct process flow (not machinery drawings): matter moves step by step; the active stage is highlighted. */
export function ProcessFlow({ spec }: { spec: ProcessSpec }) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const last = spec.steps.length - 1;

  useEffect(() => {
    if (!playing || reduceMotion()) return;
    const t = setTimeout(() => (active < last ? setActive(active + 1) : setPlaying(false)), 2400);
    return () => clearTimeout(t);
  }, [playing, active, last]);

  return (
    <figure className="visual process">
      <figcaption><strong>{spec.title}</strong> <span className="muted small">— soddalashtirilgan sxema</span></figcaption>
      <ol className="flow">
        {spec.steps.map((s, i) => (
          <li key={i} data-state={i === active ? 'active' : i < active ? 'done' : undefined} aria-current={i === active ? 'step' : undefined}>
            <button className="flow-step" onClick={() => { setActive(i); setPlaying(false); }}>
              <span className="flow-place">{s.place}</span>
              <span className="flow-name">{s.name}</span>
            </button>
            {i === active && (
              <div className="flow-detail">
                {s.equation && <p><Formula>{s.equation}</Formula>{s.conditions && <span className="cond"> · {s.conditions}</span>}</p>}
                <p className="small">{s.note}</p>
              </div>
            )}
          </li>
        ))}
      </ol>
      <div className="row" role="group" aria-label="Jarayon boshqaruvi">
        <button className="btn ghost" onClick={() => { if (active === last) setActive(0); setPlaying(!playing); }} aria-pressed={playing}>
          {playing ? 'Pauza' : 'Boshlash'}
        </button>
        <button className="btn ghost" disabled={active === last} onClick={() => { setActive(active + 1); setPlaying(false); }}>Keyingi bosqich</button>
        <button className="btn ghost" onClick={() => { setActive(0); setPlaying(false); }}>Qaytadan</button>
      </div>
      <details className="more"><summary>Nima sodir bo‘ldi?</summary><p>{spec.explanation}</p></details>
    </figure>
  );
}
