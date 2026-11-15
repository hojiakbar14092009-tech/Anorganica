// Pure rules behind the rate and equilibrium explorers (§33–34). Tested in tests/kinetics.test.ts.

/** Van 't Hoff rule × mass-action factor: v₂/v₁ = γ^(Δt/10) · (c₂/c₁)^order. */
export const rateFactor = (gamma: number, deltaT: number, concFactor = 1, order = 1) => gamma ** (deltaT / 10) * concFactor ** order;

export interface EqSystem { id: string; equation: string; gasLeft: number; gasRight: number; exothermic: boolean; species: { left: string[]; right: string[] } }
export type Change = 'heat' | 'cool' | 'pressureUp' | 'pressureDown' | 'catalyst' | { add: string } | { remove: string };
export type Shift = 'right' | 'left' | 'none';

/** Le Chatelier: direction in which the equilibrium shifts after a change. */
export function predictShift(s: EqSystem, c: Change): Shift {
  if (c === 'catalyst') return 'none';
  if (c === 'heat') return s.exothermic ? 'left' : 'right';
  if (c === 'cool') return s.exothermic ? 'right' : 'left';
  if (c === 'pressureUp' || c === 'pressureDown') {
    if (s.gasLeft === s.gasRight) return 'none';
    const towardFewer: Shift = s.gasRight < s.gasLeft ? 'right' : 'left';
    return c === 'pressureUp' ? towardFewer : towardFewer === 'right' ? 'left' : 'right';
  }
  const sp = 'add' in c ? c.add : c.remove;
  const onLeft = s.species.left.includes(sp);
  if (!onLeft && !s.species.right.includes(sp)) throw new Error(`${sp} is not in ${s.id}`);
  return ('add' in c) === onLeft ? 'right' : 'left';
}

export const EQ_SYSTEMS: EqSystem[] = [
  { id: 'so3', equation: '2SO2 + O2 ⇄ 2SO3', gasLeft: 3, gasRight: 2, exothermic: true, species: { left: ['SO2', 'O2'], right: ['SO3'] } },
  { id: 'nh3', equation: 'N2 + 3H2 ⇄ 2NH3', gasLeft: 4, gasRight: 2, exothermic: true, species: { left: ['N2', 'H2'], right: ['NH3'] } },
  { id: 'co', equation: 'CO2 + C ⇄ 2CO', gasLeft: 1, gasRight: 2, exothermic: false, species: { left: ['CO2'], right: ['CO'] } },
  { id: 'no', equation: 'N2 + O2 ⇄ 2NO', gasLeft: 2, gasRight: 2, exothermic: false, species: { left: ['N2', 'O2'], right: ['NO'] } },
];
