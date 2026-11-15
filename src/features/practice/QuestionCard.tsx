import { useId, useState } from 'react';
import { plainFormula, Rich } from '../../components/Formula';
import type { Question } from '../../lib/schema';
import { update } from '../../lib/storage';
import { grade, type Response } from './grade';

const TYPE_LABEL = { Y1: 'Y1 · bitta javob', Y2: 'Y2 · moslashtirish', O1: 'O1 · qisqa javob', O2: 'O2 · yozma ish' } as const;

export function QuestionCard({ q, index }: { q: Question; index: number }) {
  const [response, setResponse] = useState<Response | null>(null);
  const [result, setResult] = useState<boolean | null | undefined>(undefined);
  const [text, setText] = useState('');
  const [pairs, setPairs] = useState<number[]>(q.type === 'Y2' ? q.left.map(() => -1) : []);
  const inputId = useId();
  const done = result !== undefined;

  const submit = (r: Response) => {
    const g = grade(q, r);
    setResponse(r);
    setResult(g);
    if (g !== null) update((s) => ({ answers: { ...s.answers, [q.id]: { correct: g, at: Date.now() } } }));
  };

  return (
    <article className="question" aria-labelledby={inputId + '-stem'}>
      <p className="q-meta">{index + 1}. {TYPE_LABEL[q.type]} · {q.skill}</p>
      <p id={inputId + '-stem'} className="q-stem"><Rich text={q.stem} /></p>

      {q.type === 'Y1' && (
        <div className="choices" role="group" aria-label="Javob variantlari">
          {q.choices.map((c, i) => {
            const state = done ? (i === q.answer ? 'right' : i === response ? 'wrong' : undefined) : undefined;
            return (
              <button key={i} className="choice" data-state={state} disabled={done} onClick={() => submit(i)}>
                <span className="letter">{'ABCDE'[i]}</span> <Rich text={c} />
              </button>
            );
          })}
        </div>
      )}

      {q.type === 'Y2' && (
        <form className="match" onSubmit={(e) => (e.preventDefault(), submit(pairs))}>
          {q.left.map((l, i) => (
            <label key={i} className="match-row">
              <span><Rich text={l} /></span>
              <select value={pairs[i]} disabled={done} onChange={(e) => setPairs(pairs.map((p, j) => (j === i ? Number(e.target.value) : p)))}>
                <option value={-1}>— tanlang —</option>
                {q.right.map((r, j) => <option key={j} value={j}>{plainFormula(r)}</option>)}
              </select>
            </label>
          ))}
          {!done && <button className="btn" disabled={pairs.includes(-1)}>Tekshirish</button>}
        </form>
      )}

      {q.type === 'O1' && (
        <form className="short" onSubmit={(e) => (e.preventDefault(), text.trim() && submit(text))}>
          <label htmlFor={inputId}>Javob{q.unit ? ` (${q.unit})` : ''}</label>
          <div className="short-row">
            <input id={inputId} inputMode={typeof q.answer === 'number' ? 'decimal' : 'text'} autoComplete="off" value={text} disabled={done} onChange={(e) => setText(e.target.value)} />
            {!done && <button className="btn" disabled={!text.trim()}>Tekshirish</button>}
          </div>
        </form>
      )}

      {q.type === 'O2' && !done && (
        <div className="o2">
          <ol>{q.steps.map((s, i) => <li key={i}><Rich text={s} /></li>)}</ol>
          <textarea aria-label="Yechimingiz" rows={5} value={text} onChange={(e) => setText(e.target.value)} />
          <button className="btn" onClick={() => submit(text)}>Namunaviy yechim va mezonlarni ko‘rish</button>
        </div>
      )}

      {done && (
        <div className="feedback" role="status" data-state={result === null ? 'self' : result ? 'right' : 'wrong'}>
          <strong>{result === null ? 'O‘zingizni mezon bo‘yicha baholang' : result ? 'To‘g‘ri' : 'Noto‘g‘ri'}</strong>
          {q.type === 'O1' && !result && <p>To‘g‘ri javob: {String(q.answer).replace('.', ',')}{q.unit ? ` ${q.unit}` : ''}</p>}
          <p><Rich text={q.solution} /></p>
          {q.mistakes && <p className="tip"><strong>Ko‘p uchraydigan xato:</strong> <Rich text={q.mistakes} /></p>}
          {q.type === 'O2' && (
            <ul className="rubric">{q.rubric.map((r, i) => <li key={i}>{r.criterion} — {r.points} ball</li>)}</ul>
          )}
          <button className="btn ghost" onClick={() => { setResult(undefined); setResponse(null); setText(''); }}>Qayta urinish</button>
        </div>
      )}
    </article>
  );
}
