// Release gate: inventory completeness, source mapping, lesson schema and chemistry conservation.
import { describe, expect, it } from 'vitest';
import manifest from '../../content/manifest.json';
import { LessonSchema, type Lesson } from '../lib/schema';
import { checkBalance } from '../lib/chem';

const raw = import.meta.glob<{ default: unknown }>('../../content/lessons/*.json', { eager: true });
const lessons: Lesson[] = Object.entries(raw).map(([path, mod]) => {
  const r = LessonSchema.safeParse(mod.default);
  if (!r.success) throw new Error(`${path}: ${r.error.message}`);
  return r.data;
});

describe('inventory', () => {
  const s = manifest.sections;
  it('has exactly 44 + 41 unique sections', () => {
    expect(s.filter((x) => x.grade === 8)).toHaveLength(44);
    expect(s.filter((x) => x.grade === 9)).toHaveLength(41);
    expect(new Set(s.map((x) => x.id)).size).toBe(85);
  });
  it('numbers sections contiguously with ascending source pages', () => {
    for (const g of [8, 9]) {
      const gs = s.filter((x) => x.grade === g);
      gs.forEach((x, i) => {
        expect(x.section).toBe(i + 1);
        if (i) expect(x.pdfPage).toBeGreaterThanOrEqual(gs[i - 1]!.pdfPage);
      });
    }
  });
  it('every section is source-verified and cited', () => {
    for (const x of s) {
      expect(x.verification, x.id).toBe('auto-verified');
      expect(x.source.citation).toMatch(/Kimyo [89]/);
    }
  });
});

describe('lessons', () => {
  const ids = new Set(manifest.sections.map((x) => x.id));
  it.each(lessons.map((l) => [l.id, l] as const))('%s is consistent', (id, l) => {
    expect(ids.has(id)).toBe(true);
    const sec = manifest.sections.find((x) => x.id === id)!;
    const end = sec.endPage ?? 208;
    for (const p of l.pages) expect(p >= sec.pdfPage - 1 && p <= end, `page ${p}`).toBe(true);
    for (const [rid, r] of Object.entries(l.reactions)) expect(checkBalance(r.equation), `${id}/${rid}: ${r.equation}`).toEqual([]);
    for (const t of l.tables) for (const row of t.rows) {
      for (const c of t.columns.filter((c) => c.reaction)) {
        const rid = row.cells[c.key] ?? '';
        if (rid) expect(l.reactions[rid], `${t.id}/${row.id}`).toBeDefined(); // '' = deliberately no reaction (physical step)
      }
      for (const rid of row.detail?.reactionIds ?? []) expect(l.reactions[rid], rid).toBeDefined();
    }
    if (l.status === 'seed-verified') expect(l.questions.length).toBeGreaterThanOrEqual(4);
    for (const q of l.questions) {
      expect(q.id.startsWith(id + '-')).toBe(true);
      if (q.type === 'Y1') expect(q.answer).toBeLessThan(q.choices.length);
      if (q.type === 'Y2') {
        expect(q.answer).toHaveLength(q.left.length);
        expect(new Set(q.answer).size).toBe(q.answer.length);
        for (const a of q.answer) expect(a).toBeLessThan(q.right.length);
      }
    }
  });
  it('has globally unique question ids and stems', () => {
    const qs = lessons.flatMap((l) => l.questions);
    expect(new Set(qs.map((q) => q.id)).size).toBe(qs.length);
    expect(new Set(qs.map((q) => q.stem)).size).toBe(qs.length);
  });
});
