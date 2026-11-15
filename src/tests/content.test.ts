// Release gate: inventory completeness, source mapping, lesson schema and chemistry conservation.
import { describe, expect, it } from 'vitest';
import manifest from '../../content/manifest.json';
import allowed from '../content/allowed-lessons.json';
import { LessonSchema, type Lesson } from '../lib/schema';
import { checkBalance } from '../lib/chem';

const raw = import.meta.glob<{ default: unknown }>('../../content/lessons/*.json', { eager: true });
const lessons: Lesson[] = Object.entries(raw).map(([path, mod]) => {
  const r = LessonSchema.safeParse(mod.default);
  if (!r.success) throw new Error(`${path}: ${r.error.message}`);
  return r.data;
});

describe('scope: exactly 53 lessons', () => {
  const s = manifest.sections;
  const G8 = Array.from({ length: 24 }, (_, i) => 21 + i);
  const G9 = Array.from({ length: 29 }, (_, i) => 8 + i);
  it('has exactly grade 8 §21–44 and grade 9 §8–36', () => {
    expect(s.filter((x) => x.grade === 8).map((x) => x.section)).toEqual(G8);
    expect(s.filter((x) => x.grade === 9).map((x) => x.section)).toEqual(G9);
    expect(new Set(s.map((x) => x.id)).size).toBe(53);
  });
  it('allowlist titles and chapters match the manifest', () => {
    for (const x of s) expect(x.title).toBe((allowed.titles as Record<string, Record<string, string>>)[x.grade]![x.section]);
    expect(allowed.chapters.flatMap((c) => c.sections.map((n) => `g${c.grade}-s${n}`))).toEqual(s.map((x) => x.id));
  });
  it('every allowed section has a lesson and no lesson exists outside the allowlist', () => {
    expect(lessons.map((l) => l.id).sort()).toEqual(s.map((x) => x.id).sort());
  });
  it('every section is source-verified with ascending pages', () => {
    for (const x of s) {
      expect(x.verification, x.id).toBe('auto-verified');
      expect(x.source.citation).toMatch(/Kimyo [89]/);
    }
    for (const g of [8, 9]) {
      const gs = s.filter((x) => x.grade === g);
      gs.forEach((x, i) => i && expect(x.pdfPage).toBeGreaterThanOrEqual(gs[i - 1]!.pdfPage));
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
    // Row citations may point to another allowed lesson of the same grade, never to excluded textbook sections.
    const inScope = (p: number) => manifest.sections.some((x) => x.grade === sec.grade && p >= x.pdfPage - 1 && p <= (x.endPage ?? 208));
    for (const t of l.tables) for (const row of t.rows) for (const p of row.detail?.pages ?? []) expect(inScope(p), `${t.id}/${row.id} p${p}`).toBe(true);
    if (l.status === 'seed-verified') expect(l.questions.length).toBeGreaterThanOrEqual(4);
    for (const q of l.questions) if (q.type === 'O2') expect(q.rubric.reduce((s, r) => s + r.points, 0), q.id).toBe(25); // official O2 = 25 points
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
