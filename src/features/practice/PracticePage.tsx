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
  const [limit, setLimit] = useState(20);
  const [drill, setDrill] = useState<{ items: Item[]; start: number; end: number } | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const { answers } = useAppState();

  useEffect(() => {
    if (!drill) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [drill]);

  useEffect(() => {
    Promise.all(sections.map(async (s) => ((await loadLesson(s.id))?.questions ?? []).map((q) => ({ q, lessonId: s.id }))))
      .then((all) => setItems(all.flat()));
  }, []);

  const shown = items?.filter(({ q, lessonId }) =>
    (!grade || lessonId.startsWith(`g${grade}`)) && (type === 'all' || q.type === type) && (!onlyWrong || answers[q.id]?.correct === false));
  const attempted = Object.values(answers);

  const startDrill = () => {
    // Fisher–Yates on objective questions only; O2 needs self-assessment, not a timer.
    const pool = (shown ?? []).filter(({ q }) => q.type !== 'O2');
    for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j]!, pool[i]!]; }
    const t = Date.now();
    setNow(t);
    setDrill({ items: pool.slice(0, 10), start: t, end: t + 15 * 60_000 });
  };

  if (drill) {
    const left = Math.max(0, drill.end - now);
    const done = drill.items.filter(({ q }) => (answers[q.id]?.at ?? 0) >= drill.start);
    const over = left === 0 || done.length === drill.items.length;
    return (
      <main className="page practice-page">
        <h1>Vaqtli mashq</h1>
        <p className="drill-bar" role="timer" aria-live="off">
          {over ? 'Yakunlandi' : `Qoldi: ${Math.floor(left / 60000)}:${String(Math.floor(left / 1000) % 60).padStart(2, '0')}`} ·
          {' '}javob berilgan {done.length}/{drill.items.length} · to‘g‘ri {done.filter(({ q }) => answers[q.id]?.correct).length}
        </p>
        {over && <p role="status">Natija: {done.filter(({ q }) => answers[q.id]?.correct).length} / {drill.items.length} (xom ball, rasmiy emas).</p>}
        {!over && drill.items.map(({ q }, i) => <QuestionCard key={q.id} q={q} index={i} />)}
        <button className="btn ghost" onClick={() => setDrill(null)}>Mashqlar ro‘yxatiga qaytish</button>
      </main>
    );
  }

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
        <button className="btn" disabled={!shown?.length} onClick={startDrill}>Vaqtli mashq: 10 savol, 15 daqiqa</button>
      </div>

      {!items && <div className="skeleton" aria-busy="true" aria-label="Yuklanmoqda"><div /><div /></div>}
      {shown?.length === 0 && <p className="muted">Tanlangan filtr bo‘yicha savol yo‘q.</p>}
      {shown?.slice(0, limit).map(({ q, lessonId }, i) => (
        <div key={q.id}>
          <Link className="q-source" to={`/dars/${lessonId}`}>{lessonId.replace('g', '').replace('-s', '-sinf §')}</Link>
          <QuestionCard q={q} index={i} />
        </div>
      ))}
      {shown && shown.length > limit && <button className="btn ghost" onClick={() => setLimit(limit + 20)}>Yana 20 ta savol ({shown.length - limit} qoldi)</button>}
    </main>
  );
}
