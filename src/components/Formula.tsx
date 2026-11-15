import { Fragment, type ReactNode } from 'react';

// Tokenizer for chemistry notation: subscripts after element/bracket, "^2-" charges,
// orbital occupancy "3p5" as superscript. Coefficients (digits at term start) stay normal.
const TOKEN = /([1-7][spdf])(\d{1,2})|\^(\d*[+-])|([A-Za-z)\]])(\d+)/g;

export function Formula({ children }: { children: string }) {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of children.matchAll(TOKEN)) {
    out.push(children.slice(last, m.index));
    if (m[1]) out.push(m[1], <sup key={m.index}>{m[2]}</sup>);
    else if (m[3]) out.push(<sup key={m.index}>{m[3].replace('-', '−')}</sup>);
    else out.push(m[4], <sub key={m.index}>{m[5]}</sub>);
    last = m.index + m[0].length;
  }
  out.push(children.slice(last));
  return <span className="formula">{out}</span>;
}

/** Plain text where {…} marks formulas. */
export function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\{[^}]+\})/).map((part, i) =>
        part.startsWith('{') ? <Formula key={i}>{part.slice(1, -1)}</Formula> : <Fragment key={i}>{part}</Fragment>,
      )}
    </>
  );
}

/** Unicode-only rendering for places that cannot hold markup (e.g. <option>). */
export function plainFormula(text: string): string {
  const sub = '₀₁₂₃₄₅₆₇₈₉', sup: Record<string, string> = { '+': '⁺', '-': '⁻', ...Object.fromEntries([...'0123456789'].map((d, i) => [d, '⁰¹²³⁴⁵⁶⁷⁸⁹'[i]!])) };
  return text.replace(/\{([^}]+)\}/g, (_, f: string) =>
    f.replace(/\^(\d*[+-])/g, (_m, c: string) => [...c].map((ch) => sup[ch]).join(''))
      .replace(/([A-Za-z)\]])(\d+)/g, (_m, a: string, d: string) => a + [...d].map((x) => sub[Number(x)]).join('')));
}
