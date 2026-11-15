import { Component, lazy, Suspense, useState, type ReactNode } from 'react';
import { Formula } from '../../components/Formula';
import { ELEMENT_COLOR, MOLECULES } from './molecules';

const MoleculeScene = lazy(() => import('./MoleculeScene'));

const webglOk = (() => {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') ?? c.getContext('webgl'));
  } catch {
    return false;
  }
})();

/** WebGL context loss or a failed chunk load must never break the lesson — the text facts stay visible. */
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <p className="state-error">3D modelni ko‘rsatib bo‘lmadi. Quyidagi ma’lumotlardan foydalaning.</p> : this.props.children; }
}

export function MoleculeCard({ ids }: { ids: string[] }) {
  const [id, setId] = useState(ids[0]!);
  const [open, setOpen] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [view, setView] = useState(0);
  const m = MOLECULES[id]!;
  const elements = [...new Set(m.atoms.map((a) => a.el))];

  return (
    <figure className="visual molecule">
      <figcaption>
        <strong>3D model: {m.name}</strong> <Formula>{m.formula}</Formula> · {m.shape}
        <span className="muted small"> — sxematik model (sharlar va tayoqchalar)</span>
      </figcaption>
      {ids.length > 1 && (
        <div className="chips" role="group" aria-label="Molekulani tanlash">
          {ids.map((x) => (
            <button key={x} className="chip" aria-pressed={x === id} onClick={() => { setId(x); setView((v) => v + 1); }}>
              <Formula>{MOLECULES[x]!.formula}</Formula>
            </button>
          ))}
        </div>
      )}
      {open && webglOk ? (
        <div className="scene" role="img" aria-label={`${m.name} molekulasining 3D modeli. ${m.facts.join('. ')}`}>
          <SceneBoundary>
            <Suspense fallback={<div className="scene-skeleton" aria-busy="true">3D model yuklanmoqda…</div>}>
              <MoleculeScene key={`${id}-${view}`} m={m} interactive={interactive} />
            </Suspense>
          </SceneBoundary>
        </div>
      ) : null}
      <div className="row" role="group" aria-label="3D boshqaruvi">
        {!open && webglOk && <button className="btn ghost" onClick={() => setOpen(true)}>3D modelni ochish</button>}
        {open && (
          <>
            <button className="btn ghost" aria-pressed={interactive} onClick={() => setInteractive(!interactive)}>
              {interactive ? 'Aylantirishni o‘chirish' : 'Aylantirish (1 barmoq), kattalashtirish (2 barmoq)'}
            </button>
            <button className="btn ghost" onClick={() => setView(view + 1)}>Asl ko‘rinish</button>
          </>
        )}
      </div>
      <ul className="facts small">{m.facts.map((f) => <li key={f}>{f}</li>)}</ul>
      <div className="legend small">
        {elements.map((el) => <span key={el}><span className="dot" style={{ background: ELEMENT_COLOR[el] }} /> {el}</span>)}
      </div>
    </figure>
  );
}
