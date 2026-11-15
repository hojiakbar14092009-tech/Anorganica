import { describe, expect, it } from 'vitest';
import { distance, MOLECULES, type Molecule } from '../features/visuals/molecules';
import { parseFormula } from '../lib/chem';

const angle = (m: Molecule, c: number, a: number, b: number) => {
  const v = (i: number) => m.atoms[i]!.p.map((x, k) => x - m.atoms[c]!.p[k]!);
  const [u, w] = [v(a), v(b)];
  const dot = u.reduce((s, x, k) => s + x * w[k]!, 0);
  return (Math.acos(dot / (Math.hypot(...u) * Math.hypot(...w))) * 180) / Math.PI;
};

describe('molecule models', () => {
  it.each(Object.values(MOLECULES).map((m) => [m.id, m] as const))('%s: formula, connectivity, sane bond lengths', (_, m) => {
    if (!m.id.match(/diamond|graphite/)) {
      const counts: Record<string, number> = {};
      for (const a of m.atoms) counts[a.el] = (counts[a.el] ?? 0) + 1;
      expect(counts).toEqual(parseFormula(m.formula));
    }
    for (const b of m.bonds) {
      expect(distance(m, b)).toBeGreaterThan(0.9);
      expect(distance(m, b)).toBeLessThan(2.8);
    }
    const seen = new Set([0]); // graph is connected (lattice fragments too)
    for (let grew = true; grew; ) { grew = false; for (const b of m.bonds) for (const [x, y] of [[b.a, b.b], [b.b, b.a]] as const) if (seen.has(x) && !seen.has(y)) { seen.add(y); grew = true; } }
    // graphite = two unbonded layers by design; every other model is one connected graph
    if (m.id === 'graphite') expect(seen.size).toBe(m.atoms.length / 2);
    else expect(seen.size).toBe(m.atoms.length);
  });
  it('reproduces reference angles and lengths', () => {
    expect(angle(MOLECULES.h2o!, 0, 1, 2)).toBeCloseTo(104.5, 1);
    expect(angle(MOLECULES.h2s!, 0, 1, 2)).toBeCloseTo(92.1, 1);
    expect(angle(MOLECULES.nh3!, 0, 1, 2)).toBeCloseTo(106.7, 1);
    expect(angle(MOLECULES.ch4!, 0, 1, 2)).toBeCloseTo(109.47, 1);
    expect(angle(MOLECULES.co2!, 0, 1, 2)).toBeCloseTo(180, 1);
    for (const b of MOLECULES.p4!.bonds) expect(distance(MOLECULES.p4!, b)).toBeCloseTo(2.21, 2);
    expect(MOLECULES.diamond!.bonds.length).toBeGreaterThan(10);
    for (const b of MOLECULES.graphite!.bonds) expect(distance(MOLECULES.graphite!, b)).toBeCloseTo(1.42, 2);
  });
});
