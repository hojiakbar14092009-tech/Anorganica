import { expect, it } from 'vitest';
import { buildSession, EXAM_QUOTA } from '../features/practice/session';
import type { Question } from '../lib/schema';

const q = (type: Question['type'], i: number) => ({ q: { type, id: `${type}${i}` } as unknown as Question });
const pool = [...Array.from({ length: 40 }, (_, i) => q('Y1', i)), ...Array.from({ length: 5 }, (_, i) => q('Y2', i)), ...Array.from({ length: 9 }, (_, i) => q('O1', i)), ...Array.from({ length: 3 }, (_, i) => q('O2', i))];

it('builds a 43-task session in exam order without duplicates', () => {
  const s = buildSession(pool, EXAM_QUOTA)!;
  expect(s).toHaveLength(43);
  expect(new Set(s.map((x) => x.q.id)).size).toBe(43);
  expect(s.map((x) => x.q.type).join('')).toBe('Y1'.repeat(32) + 'Y2'.repeat(3) + 'O1'.repeat(5) + 'O2'.repeat(3));
});
it('is disabled (null) when a type has too few questions', () => {
  expect(buildSession(pool.filter((x) => x.q.type !== 'O2' || x.q.id !== 'O20'), EXAM_QUOTA)).toBeNull();
});
