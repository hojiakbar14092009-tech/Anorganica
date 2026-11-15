import type { Question } from '../../lib/schema';
import { normalize } from '../../lib/search';

/** Parses "2,24", "2.24 l", "−1,5", "1,2·10^-3", "1.2e-3"; returns null when not a number. */
export function parseNumber(input: string): number | null {
  const s = input.trim().replace(/[−–]/g, '-').replace(/\s+/g, '').replace(/[a-zA-Z°%/]+$/, '');
  const m = s.match(/^([+-]?\d+(?:[.,]\d+)?)(?:(?:[·*x×]10\^?|e)([+-]?\d+))?$/i);
  if (!m) return null;
  return Number(m[1]!.replace(',', '.')) * 10 ** Number(m[2] ?? 0);
}

export type Response = number | number[] | string;

/** Deterministic grading for objective types; O2 is never auto-graded (returns null → self-check with rubric). */
export function grade(q: Question, r: Response): boolean | null {
  switch (q.type) {
    case 'Y1':
      return r === q.answer;
    case 'Y2':
      return Array.isArray(r) && r.length === q.answer.length && r.every((v, i) => v === q.answer[i]);
    case 'O1': {
      if (typeof r !== 'string') return false;
      if (typeof q.answer === 'string') return normalize(r) === normalize(q.answer);
      const n = parseNumber(r);
      return n !== null && Math.abs(n - q.answer) <= (q.tolerance ?? 1e-9) + 1e-12;
    }
    case 'O2':
      return null;
  }
}
