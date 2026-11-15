import type { Question } from '../../lib/schema';

export type Quota = Partial<Record<Question['type'], number>>;
/** Official 2025 format (Y1 32, Y2 3, O1 5, O2 3; 180 min) — applied only to the 53 in-scope lessons. */
export const EXAM_QUOTA: Quota = { Y1: 32, Y2: 3, O1: 5, O2: 3 };
const ORDER: Question['type'][] = ['Y1', 'Y2', 'O1', 'O2'];

/** Random pick per type quota, in exam order. Returns null when any type lacks enough validated questions
 *  (the session is then disabled instead of padding with repeats). */
export function buildSession<T extends { q: Question }>(pool: T[], quota: Quota, random = Math.random): T[] | null {
  const out: T[] = [];
  for (const type of ORDER) {
    const need = quota[type] ?? 0;
    const of = pool.filter((x) => x.q.type === type);
    if (of.length < need) return null;
    for (let i = of.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [of[i], of[j]] = [of[j]!, of[i]!]; }
    out.push(...of.slice(0, need));
  }
  return out;
}

export const hasEnough = (pool: { q: Question }[], quota: Quota) =>
  ORDER.every((t) => pool.filter((x) => x.q.type === t).length >= (quota[t] ?? 0));
