import { describe, expect, it } from 'vitest';
import { grade, parseNumber } from '../features/practice/grade';
import type { Question } from '../lib/schema';

const base = { id: 'g8-s1-q1', skill: 's', difficulty: 1 as const, stem: 'Savol matni bu yerda', solution: 'Yechim matni bu yerda' };

describe('parseNumber', () => {
  it.each([['2,24', 2.24], ['2.24 l', 2.24], ['−1,5', -1.5], ['1,2·10^-3', 0.0012], ['1.2e-3', 0.0012], ['98 g/mol', 98], ['abc', null], ['', null]])('%s', (s, v) => {
    const n = parseNumber(s);
    if (v === null) expect(n).toBeNull();
    else expect(n).toBeCloseTo(v, 10);
  });
});

describe('grade', () => {
  const o1: Question = { ...base, type: 'O1', answer: 2.24, tolerance: 0.01 };
  it('O1 numeric with tolerance and decimal comma', () => {
    expect(grade(o1, '2,24')).toBe(true);
    expect(grade(o1, '2.25')).toBe(true);
    expect(grade(o1, '2,26')).toBe(false);
    expect(grade(o1, 'ikki')).toBe(false);
  });
  it('O1 text answers ignore case and apostrophe variants', () => {
    expect(grade({ ...base, type: 'O1', answer: "qo'rg'oshin" }, 'Qo‘rg‘oshin')).toBe(true);
  });
  it('Y1, Y2 exact; O2 not auto-graded', () => {
    expect(grade({ ...base, type: 'Y1', choices: ['a', 'b', 'c'], answer: 2 }, 2)).toBe(true);
    const y2: Question = { ...base, type: 'Y2', left: ['a', 'b'], right: ['x', 'y'], answer: [1, 0] };
    expect(grade(y2, [1, 0])).toBe(true);
    expect(grade(y2, [0, 1])).toBe(false);
    expect(grade({ ...base, type: 'O2', steps: ['1', '2'], rubric: [{ criterion: 'c', points: 5 }] }, 'x')).toBeNull();
  });
});
