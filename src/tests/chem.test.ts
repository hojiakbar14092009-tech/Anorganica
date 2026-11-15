import { describe, expect, it } from 'vitest';
import { checkBalance, molarMass, parseFormula } from '../lib/chem';

describe('parseFormula', () => {
  it('handles groups, hydrates and ions', () => {
    expect(parseFormula('Ca(OH)2')).toEqual({ Ca: 1, O: 2, H: 2 });
    expect(parseFormula('CuSO4·5H2O')).toEqual({ Cu: 1, S: 1, O: 9, H: 10 });
    expect(parseFormula('Al2(SO4)3')).toEqual({ Al: 2, S: 3, O: 12 });
    expect(parseFormula('SO4^2-')).toEqual({ S: 1, O: 4 });
    expect(parseFormula('K3[Fe(CN)6]')).toEqual({ K: 3, Fe: 1, C: 6, N: 6 });
    expect(parseFormula('e^-')).toEqual({});
  });
  it('rejects malformed formulas', () => {
    expect(() => parseFormula('Ca(OH')).toThrow();
    expect(() => parseFormula('cl2')).toThrow();
  });
});

describe('checkBalance', () => {
  it('accepts balanced molecular, ionic and redox half equations', () => {
    expect(checkBalance('2H2 + O2 → 2H2O')).toEqual([]);
    expect(checkBalance('MnO2 + 4HCl → MnCl2 + Cl2↑ + 2H2O')).toEqual([]);
    expect(checkBalance('Ba^2+ + SO4^2- → BaSO4↓')).toEqual([]);
    expect(checkBalance('Cu^2+ + 2e^- → Cu')).toEqual([]);
    expect(checkBalance('2SO2 + O2 ⇄ 2SO3')).toEqual([]);
    expect(checkBalance('H2 + 1/2O2 → H2O')).toEqual([]);
  });
  it('reports atom and charge errors', () => {
    expect(checkBalance('H2 + O2 → H2O')).toEqual(['O: 2 ≠ 1']);
    expect(checkBalance('Cu^2+ + e^- → Cu')).toEqual(['zaryad: 1 ≠ 0']);
    // textbook G8 p.119 misprint is caught
    expect(checkBalance('2Ca(OH)2 + 2Cl2 → Ca(OCl)2 + CaCl2 + H2O')).toEqual(['O: 4 ≠ 3', 'H: 4 ≠ 2']);
  });
});

it('molarMass', () => {
  expect(molarMass('H2SO4')).toBe(98);
  expect(molarMass('NaCl')).toBe(58.5);
});
