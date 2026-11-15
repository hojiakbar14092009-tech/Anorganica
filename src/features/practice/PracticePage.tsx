import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { loadLesson, sections } from '../../lib/content';
import type { Question } from '../../lib/schema';
import { useAppState } from '../../lib/storage';
import { QuestionCard } from './QuestionCard';
import { buildSession, EXAM_QUOTA, hasEnough, type Quota } from './session';

type Item = { q: Question; lessonId: string };
type Drill = { title: string; items: Item[]; start: number; end: number; finished: boolean };
const QUICK: Quota = { Y1: 4, Y2: 1, O1: 3 };

function makeDrill(title: string, pool: Item[], quota: Quota, minutes: number): Drill | null {
  const list = buildSession(pool, quota);
  const t = Date.now();
  return list && { title, items: list, start: t, end: t + minutes * 60_000, finished: false };
}
const TYPES = ['Y1', 'Y2', 'O1', 'O2'] as const;

export function PracticePage() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [grade, setGrade] = useState<0 | 8 | 9>(0);
  const [type, setType] = useState<'all' | Question['type']>('all');
  const [onlyWrong, setOnlyWrong] = useState(false);
  const [limit, setLimit] = useState(20);
  const [drill, setDrill] = useState<Drill | null>(null);
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
  // Only count answers to questions that still exist (older versions had out-of-scope lessons).
  const attempted = (items ?? []).flatMap(({ q }) => (answers[q.id] ? [answers[q.id]!] : []));

  const open = (d: Drill | null) => { if (d) { setNow(d.start); setDrill(d); } };

  if (drill) {
    const left = Math.max(0, drill.end - now);
    const objective = drill.items.filter(({ q }) => q.type !== 'O2'); // O2 is self-assessed, never auto-scored
    const done = objective.filter(({ q }) => (answers[q.id]?.at ?? 0) >= drill.start);
    const correct = done.filter(({ q }) => answers[q.id]?.correct).length;
    const over = drill.finished || left === 0 || (objective.length === drill.items.length && done.length === objective.length);
    return (
      <main className="page practice-page">
        <h1>{drill.title}</h1>
        <p className="drill-bar" role="timer" aria-live="off">
          {over ? 'Yakunlandi' : `Qoldi: ${Math.floor(left / 60000)}:${String(Math.floor(left / 1000) % 60).padStart(2, '0')}`} ·
          {' '}javob berilgan {done.length}/{objective.length} · to‘g‘ri {correct}
        </p>
        {over && <p role="status">Natija: {correct} / {objective.length} test topshirig‘i (xom ball, rasmiy emas){objective.length < drill.items.length ? '; yozma ishlar mezon bo‘yicha o‘zingiz baholanadi' : ''}.</p>}
        {!over && drill.items.map(({ q }, i) => <QuestionCard key={q.id} q={q} index={i} />)}
        <div className="row">
          {!over && <button className="btn" onClick={() => setDrill({ ...drill, finished: true })}>Yakunlash</button>}
          <button className="btn ghost" onClick={() => setDrill(null)}>Mashqlar ro‘yxatiga qaytish</button>
        </div>
      </main>
    );
  }

  return (
    <main className="page practice-page">
      <h1>Tanlangan 53 mavzu bo‘yicha sertifikat uslubidagi mashq</h1>
      <p className="notice" role="note">
        Mustaqil tuzilgan mashqlar; rasmiy imtihon savollari emas. Faqat 8-sinf §21–44 va 9-sinf §8–36 mavzulari qamrab olingan —
        rasmiy sertifikatdagi organik kimyo, umumiy kimyoning boshqa bo‘limlari va kimyoviy tahlil bu yerda yo‘q. Natijalar — xom mashq ballari.
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
        <button className="btn" disabled={!shown || !hasEnough(shown, QUICK)} onClick={() => open(makeDrill('Vaqtli mashq', shown!, QUICK, 15))}>Vaqtli mashq: 8 savol, 15 daqiqa</button>
        <button className="btn ghost" disabled={!items || !hasEnough(items, EXAM_QUOTA)} onClick={() => open(makeDrill('43 topshiriqli mashq (53 mavzu)', items!, EXAM_QUOTA, 180))}>
          43 topshiriq · 180 daqiqa
        </button>
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
