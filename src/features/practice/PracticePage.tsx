import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { loadLesson, sections } from '../../lib/content';
import type { Question } from '../../lib/schema';
import { useAppState } from '../../lib/storage';
import { QuestionCard } from './QuestionCard';

type Item = { q: Question; lessonId: string };
const TYPES = ['Y1', 'Y2', 'O1', 'O2'] as const;

export function PracticePage() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [grade, setGrade] = useState<0 | 8 | 9>(0);
  const [type, setType] = useState<'all' | Question['type']>('all');
  const [onlyWrong, setOnlyWrong] = useState(false);
  const { answers } = useAppState();

  useEffect(() => {
    Promise.all(sections.map(async (s) => ((await loadLesson(s.id))?.questions ?? []).map((q) => ({ q, lessonId: s.id }))))
      .then((all) => setItems(all.flat()));
  }, []);

  const shown = items?.filter(({ q, lessonId }) =>
    (!grade || lessonId.startsWith(`g${grade}`)) && (type === 'all' || q.type === type) && (!onlyWrong || answers[q.id]?.correct === false));
  const attempted = Object.values(answers);

  return (
    <main className="page practice-page">
      <h1>8–9-sinf mavzulari bo‘yicha sertifikat mashqlari</h1>
      <p className="notice" role="note">
        Bu rasmiy Milliy sertifikat testi emas. Darsliklar organik kimyo va kimyoviy tahlilning barcha mavzularini qamrab olmaydi, shuning uchun
        to‘liq 43 topshiriqli simulyatsiya berilmaydi. Natijalar — xom mashq ballari.
      </p>
      <p className="muted">Yechilgan: {attempted.length} · to‘g‘ri: {attempted.filter((a) => a.correct).length}</p>

      <div className="filters">
        <select aria-label="Sinf" value={grade} onChange={(e) => setGrade(Number(e.target.value) as 0 | 8 | 9)}>
          <option value={0}>Barcha sinflar</option><option value={8}>8-sinf</option><option value={9}>9-sinf</option>
        </select>
        <select aria-label="Topshiriq turi" value={type} onChange={(e) => setType(e.target.value as typeof type)}>
          <option value="all">Barcha turlar</option>{TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
        <label className="toggle"><input type="checkbox" checked={onlyWrong} onChange={(e) => setOnlyWrong(e.target.checked)} /> <span>Faqat xatolar</span></label>
      </div>

      {!items && <div className="skeleton" aria-busy="true" aria-label="Yuklanmoqda"><div /><div /></div>}
      {shown?.length === 0 && <p className="muted">Tanlangan filtr bo‘yicha savol yo‘q.</p>}
      {shown?.map(({ q, lessonId }, i) => (
        <div key={q.id}>
          <Link className="q-source" to={`/dars/${lessonId}`}>{lessonId.replace('g', '').replace('-s', '-sinf §')}</Link>
          <QuestionCard q={q} index={i} />
        </div>
      ))}
    </main>
  );
}
