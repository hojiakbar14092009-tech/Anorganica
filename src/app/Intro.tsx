import { useEffect } from 'react';

/** Mark: a tetrahedral-ish AB4 skeleton (central atom + 4 ligands), drawn as a flat schematic. */
export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden className="logo">
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="16" y1="16" x2="16" y2="5" /><line x1="16" y1="16" x2="6" y2="22" />
        <line x1="16" y1="16" x2="26" y2="22" /><line x1="16" y1="16" x2="16" y2="28" opacity=".35" />
      </g>
      <circle cx="16" cy="16" r="5" fill="var(--accent)" />
      <circle cx="16" cy="5" r="3" fill="currentColor" /><circle cx="6" cy="22" r="3" fill="currentColor" /><circle cx="26" cy="22" r="3" fill="currentColor" />
    </svg>
  );
}

/** ~1.4 s first-launch intro: ligands converge onto the centre, then the wordmark fades in. Tap skips. */
export function Intro({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1500);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="intro" onClick={onDone} role="presentation">
      <svg viewBox="0 0 120 120" width="120" height="120" aria-hidden>
        <g className="bonds" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <line x1="60" y1="60" x2="60" y2="22" /><line x1="60" y1="60" x2="26" y2="80" /><line x1="60" y1="60" x2="94" y2="80" />
        </g>
        <circle className="a a1" cx="60" cy="22" r="9" fill="currentColor" />
        <circle className="a a2" cx="26" cy="80" r="9" fill="currentColor" />
        <circle className="a a3" cx="94" cy="80" r="9" fill="currentColor" />
        <circle className="core" cx="60" cy="60" r="15" fill="var(--accent)" />
      </svg>
      <p className="intro-word">Anorganica</p>
    </div>
  );
}
