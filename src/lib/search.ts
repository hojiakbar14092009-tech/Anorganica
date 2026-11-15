import { loadLesson, sections } from './content';
import type { SectionMeta } from './schema';

const SUB = '₀₁₂₃₄₅₆₇₈₉';
/** Lowercase, unify Uzbek apostrophes (o‘ o' oʻ o`), map subscripts/superscripts to digits, drop markup. */
export function normalize(s: string): string {
  return s
    .replace(/[₀-₉]/g, (c) => String(SUB.indexOf(c)))
    .replace(/[‘’`ʻʼ´']/g, "'")
    .replace(/[{}^·]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

export interface Hit { section: SectionMeta; where: string }

let corpus: { section: SectionMeta; raw: string[]; texts: string[] }[] | null = null;

/** Builds the offline corpus lazily (all lesson chunks are precached by the service worker). */
async function getCorpus() {
  if (corpus) return corpus;
  corpus = await Promise.all(
    sections.map(async (section) => {
      const l = await loadLesson(section.id);
      const texts = [section.title];
      if (l) {
        texts.push(l.summary, ...l.keyConcepts, ...Object.values(l.reactions).map((r) => r.equation));
        for (const t of l.tables) for (const r of t.rows) texts.push(...Object.values(r.cells));
      }
      return { section, raw: texts, texts: texts.map(normalize) };
    }),
  );
  return corpus;
}

export async function search(query: string, limit = 20): Promise<Hit[]> {
  const q = normalize(query);
  if (!q) return [];
  const para = q.match(/^§?\s*(\d{1,2})\s*(?:§)?$/) ?? q.match(/^([89])\s*-?\s*sinf\s*§?\s*(\d{1,2})$/);
  if (para) {
    const [g, n] = para.length === 3 && para[2] ? [Number(para[1]), Number(para[2])] : [null, Number(para[1])];
    return sections.filter((s) => s.section === n && (g === null || s.grade === g)).map((section) => ({ section, where: `§${section.section}` }));
  }
  const words = q.split(' ');
  const scored: (Hit & { score: number })[] = [];
  for (const { section, raw, texts } of await getCorpus()) {
    const title = texts[0]!;
    if (words.every((w) => title.includes(w))) { scored.push({ section, where: 'sarlavha', score: 3 }); continue; }
    const i = texts.findIndex((t) => words.every((w) => t.includes(w)));
    const hit = raw[i]?.replace(/[{}]/g, '');
    if (hit) scored.push({ section, where: hit.length > 70 ? hit.slice(0, 70) + '…' : hit, score: 1 });
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}
