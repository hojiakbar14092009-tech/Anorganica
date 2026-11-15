// Pure chemistry helpers: formula parsing and equation conservation checks.
// Notation used in content: "Cl2", "Ca(OH)2", "CuSO4·5H2O", ions "SO4^2-", "Na^+", electrons "e^-",
// states "(g)/(s)/(l)/(aq)" and precipitate/gas arrows "↓/↑" are ignored for counting.

export type Counts = Record<string, number>;

const STATE = /\((?:g|s|l|aq|q|k|e)\)|[↓↑]/g;

/** Split "SO4^2-" into body and signed charge. "e^-" is an electron (no atoms, charge −1). */
export function splitCharge(species: string): { body: string; charge: number } {
  const m = species.match(/\^(\d*)([+-])$/);
  if (!m) return { body: species, charge: 0 };
  const mag = m[1] ? Number(m[1]) : 1;
  return { body: species.slice(0, m.index), charge: m[2] === '+' ? mag : -mag };
}

/** Atom counts of a neutral or ionic formula. Throws on malformed input so bad content fails validation. */
export function parseFormula(species: string): Counts {
  const { body } = splitCharge(species.replace(STATE, '').trim());
  if (body === 'e') return {};
  const counts: Counts = {};
  for (const part of body.split(/[·*]/)) {
    const lead = part.match(/^(\d+)/);
    const mult = lead ? Number(lead[1]) : 1;
    const rest = lead ? part.slice(lead[1]!.length) : part;
    for (const [el, n] of Object.entries(parseGroup(rest))) counts[el] = (counts[el] ?? 0) + n * mult;
  }
  return counts;
}

function parseGroup(s: string): Counts {
  const stack: Counts[] = [{}];
  let i = 0;
  const num = () => {
    const m = s.slice(i).match(/^\d+/);
    if (!m) return 1;
    i += m[0].length;
    return Number(m[0]);
  };
  while (i < s.length) {
    const c = s[i]!;
    if (c === '(' || c === '[') { stack.push({}); i++; continue; }
    if (c === ')' || c === ']') {
      i++;
      const n = num();
      const top = stack.pop();
      const into = stack[stack.length - 1];
      if (!top || !into) throw new Error(`Unbalanced brackets in "${s}"`);
      for (const [el, k] of Object.entries(top)) into[el] = (into[el] ?? 0) + k * n;
      continue;
    }
    const m = s.slice(i).match(/^[A-Z][a-z]?/);
    if (!m) throw new Error(`Bad formula "${s}" at ${i}`);
    i += m[0].length;
    const n = num();
    const top = stack[stack.length - 1]!;
    top[m[0]] = (top[m[0]] ?? 0) + n;
  }
  if (stack.length !== 1) throw new Error(`Unbalanced brackets in "${s}"`);
  return stack[0]!;
}

export interface Term { coef: number; species: string }
export interface ParsedEquation { left: Term[]; right: Term[]; reversible: boolean }

/** Parse "2H2 + O2 → 2H2O" (also ⇄, ⇌, =). Ions are written with ^ so "+" separators stay unambiguous. */
export function parseEquation(eq: string): ParsedEquation {
  const parts = eq.split(/\s*(→|⇄|⇌|=)\s*/);
  if (parts.length !== 3) throw new Error(`Equation needs exactly one arrow: "${eq}"`);
  const side = (s: string): Term[] =>
    s.split(/\s+\+\s+/).map((t) => {
      const m = t.trim().match(/^(\d+(?:\/\d+)?)?\s*(.+)$/);
      if (!m) throw new Error(`Bad term "${t}"`);
      const [a, b] = (m[1] ?? '1').split('/');
      return { coef: Number(a) / Number(b ?? 1), species: m[2]!.trim() };
    });
  return { left: side(parts[0]!), right: side(parts[2]!), reversible: parts[1] !== '→' && parts[1] !== '=' };
}

function total(terms: Term[]): { atoms: Counts; charge: number } {
  const atoms: Counts = {};
  let charge = 0;
  for (const { coef, species } of terms) {
    for (const [el, n] of Object.entries(parseFormula(species))) atoms[el] = (atoms[el] ?? 0) + n * coef;
    charge += splitCharge(species.replace(STATE, '').trim()).charge * coef;
  }
  return { atoms, charge };
}

/** Returns [] when atoms and charge are conserved, otherwise human-readable problems. */
export function checkBalance(eq: string): string[] {
  const { left, right } = parseEquation(eq);
  const L = total(left), R = total(right);
  const problems: string[] = [];
  for (const el of new Set([...Object.keys(L.atoms), ...Object.keys(R.atoms)])) {
    const a = L.atoms[el] ?? 0, b = R.atoms[el] ?? 0;
    if (Math.abs(a - b) > 1e-9) problems.push(`${el}: ${a} ≠ ${b}`);
  }
  if (Math.abs(L.charge - R.charge) > 1e-9) problems.push(`zaryad: ${L.charge} ≠ ${R.charge}`);
  return problems;
}

// IUPAC 2021 standard atomic weights rounded as used in school problems (Cl 35.5 as in Uzbek textbooks).
export const ATOMIC_MASS: Readonly<Record<string, number>> = {
  H: 1, He: 4, Li: 7, Be: 9, B: 11, C: 12, N: 14, O: 16, F: 19, Ne: 20, Na: 23, Mg: 24, Al: 27, Si: 28,
  P: 31, S: 32, Cl: 35.5, Ar: 40, K: 39, Ca: 40, Cr: 52, Mn: 55, Fe: 56, Cu: 64, Zn: 65, Br: 80,
  Ag: 108, I: 127, Ba: 137, Au: 197, Hg: 201, Pb: 207,
};

export function molarMass(formula: string): number {
  return Object.entries(parseFormula(formula)).reduce((m, [el, n]) => {
    const a = ATOMIC_MASS[el];
    if (a === undefined) throw new Error(`No atomic mass for ${el}`);
    return m + a * n;
  }, 0);
}
