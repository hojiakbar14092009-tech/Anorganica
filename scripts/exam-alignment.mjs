// Regenerates src/content/exam-alignment.json from the lesson files (kept in sync by src/tests/content.test.ts).
// Run: node scripts/exam-alignment.mjs
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

const lessons = {};
for (const f of readdirSync('content/lessons').sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))) {
  const l = JSON.parse(readFileSync(`content/lessons/${f}`, 'utf8'));
  lessons[l.id] = {
    skills: [...new Set(l.questions.map((q) => q.skill))],
    questionIds: l.questions.map((q) => q.id),
    types: l.questions.reduce((a, q) => ((a[q.type] = (a[q.type] ?? 0) + 1), a), {}),
  };
}
writeFileSync('src/content/exam-alignment.json', JSON.stringify({
  source: 'https://www.uzbmb.uz/upload/file/pdf/mtt/spetsifikatsiya/Kimyo-MS2025.pdf',
  checked: '2026-11-15',
  scope: '53 lessons only (G8 §21–44, G9 §8–36)',
  domain: 'inorganic + general chemistry topics present in these lessons',
  lessons,
}, null, 1));
console.log('exam-alignment.json:', Object.keys(lessons).length, 'lessons');
