import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Rich } from '../../components/Formula';
import { LessonTable } from '../../components/LessonTable';
import { loadLesson, neighbours, sectionById } from '../../lib/content';
import type { Lesson } from '../../lib/schema';
import { update, useAppState, visitLesson } from '../../lib/storage';
import { QuestionCard } from '../practice/QuestionCard';
import { ElectrolysisCell } from '../visuals/ElectrolysisCell';
import { MoleculeCard } from '../visuals/MoleculeCard';
import { visuals } from '../visuals/registry';

type Load = { id: string; lesson: Lesson | null } | { id: string; error: true };

export function LessonPage() {
  const { id = '' } = useParams();
  const meta = sectionById.get(id);
  const [load, setLoad] = useState<Load | null>(null);
  const { favorites } = useAppState();

  useEffect(() => {
    if (!meta) return;
    visitLesson(id);
    let alive = true;
    loadLesson(id).then(
      (lesson) => alive && setLoad({ id, lesson }),
      () => alive && setLoad({ id, error: true }),
    );
    window.scrollTo(0, 0);
    return () => { alive = false; };
  }, [id, meta]);

  if (!meta) return <main className="page"><h1>Bo‘lim topilmadi</h1><Link to="/">Bosh sahifaga</Link></main>;
  const { prev, next } = neighbours(id);
  const fav = favorites.includes(id);
  const ready = load?.id === id ? load : null;

  return (
    <main className="page lesson">
      <header className="lesson-head">
        <p className="eyebrow">{meta.grade}-sinf · §{meta.section}</p>
        <h1>{meta.title}</h1>
        <div className="lesson-actions">
          <p className="cite">Darslik: Kimyo {meta.grade} (2019), {meta.printedPage}-bet</p>
          <button className="icon-btn" aria-pressed={fav} aria-label={fav ? 'Saralanganlardan olib tashlash' : 'Saralanganlarga qo‘shish'}
            onClick={() => update((s) => ({ favorites: fav ? s.favorites.filter((f) => f !== id) : [...s.favorites, id] }))}>
            {fav ? '★' : '☆'}
          </button>
        </div>
      </header>

      {!ready && <div className="skeleton" aria-busy="true" aria-label="Yuklanmoqda"><div /><div /><div /></div>}
      {ready && 'error' in ready && <p className="state-error" role="alert">Darsni yuklab bo‘lmadi. Internet aloqasini tekshiring yoki ilovani qayta oching.</p>}
      {ready && 'lesson' in ready && !ready.lesson && (
        <p className="state-pending">Bu § uchun tekshirilgan dars mazmuni hali tayyorlanmoqda. Hozircha darslikning {meta.printedPage}–{meta.endPage ?? meta.printedPage}-betlaridan foydalaning.</p>
      )}
      {ready && 'lesson' in ready && ready.lesson && <LessonBody lesson={ready.lesson} />}

      <nav className="pager" aria-label="Qo‘shni bo‘limlar">
        {prev ? <Link to={`/dars/${prev.id}`} rel="prev">‹ §{prev.section} {prev.grade !== meta.grade ? `(${prev.grade}-sinf)` : ''}</Link> : <span />}
        {next ? <Link to={`/dars/${next.id}`} rel="next">§{next.section} {next.grade !== meta.grade ? `(${next.grade}-sinf)` : ''} ›</Link> : <span />}
      </nav>
    </main>
  );
}

function LessonBody({ lesson }: { lesson: Lesson }) {
  return (
    <>
      <p className="summary"><Rich text={lesson.summary} /></p>
      {lesson.tables.map((t) => <LessonTable key={t.id} table={t} lesson={lesson} />)}
      {visuals[lesson.id]?.map((v, i) => (v.kind === 'electrolysis' ? <ElectrolysisCell key={i} spec={v.spec} /> : <MoleculeCard key={i} ids={v.ids} />))}
      <details className="more">
        <summary>Batafsil: asosiy tushunchalar</summary>
        <ul>{lesson.keyConcepts.map((k, i) => <li key={i}><Rich text={k} /></li>)}</ul>
      </details>
      {lesson.clarifications?.map((c, i) => (
        <p key={i} className="clarify" role="note"><strong>Aniqlik kiritish:</strong> {c.text}</p>
      ))}
      {lesson.questions.length > 0 && (
        <section className="practice" aria-labelledby="pr-h">
          <h2 id="pr-h">Mashqlar</h2>
          <p className="muted">Original mashqlar; rasmiy sertifikat savollari emas.</p>
          {lesson.questions.map((q, i) => <QuestionCard key={q.id} q={q} index={i} />)}
        </section>
      )}
    </>
  );
}
