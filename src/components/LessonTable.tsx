import { useId, useState } from 'react';
import type { Lesson, LessonTable as T, Reaction } from '../lib/schema';
import { Formula, Rich } from './Formula';

export function ReactionLine({ r }: { r: Reaction }) {
  return (
    <div className="reaction">
      <Formula>{r.equation}</Formula>
      {r.conditions && <span className="cond">{r.conditions}</span>}
    </div>
  );
}

export function LessonTable({ table, lesson }: { table: T; lesson: Lesson }) {
  const [open, setOpen] = useState<string | null>(null);
  const titleId = useId();
  const cols = table.columns;
  return (
    <section className="table-block" aria-labelledby={titleId}>
      <h2 id={titleId}>{table.title}</h2>
      <div className="table-scroll" tabIndex={0} role="region" aria-label={`${table.title} jadvali`}>
        {/* 4+ columns become labelled cards on phone widths (see .stack in app.css) */}
        <table className={cols.length >= 4 ? 'stack' : undefined}>
          <thead>
            <tr>{cols.map((c) => <th key={c.key} scope="col">{c.label}</th>)}</tr>
          </thead>
          <tbody>
            {table.rows.map((row) => {
              const expanded = open === row.id;
              const d = row.detail;
              return [
                <tr key={row.id} className={d ? 'has-detail' : undefined} data-open={expanded || undefined}>
                  {cols.map((c, i) => {
                    const v = row.cells[c.key] ?? '';
                    const r = c.reaction && v ? lesson.reactions[v] : undefined;
                    const content = r ? <ReactionLine r={r} /> : <Rich text={c.reaction ? '—' : v} />;
                    if (i === 0 && d)
                      return (
                        <th key={c.key} scope="row">
                          <button className="row-toggle" aria-expanded={expanded} onClick={() => setOpen(expanded ? null : row.id)}>
                            {content}<span className="chev" aria-hidden>›</span>
                          </button>
                        </th>
                      );
                    return i === 0 ? <th key={c.key} scope="row">{content}</th> : <td key={c.key} data-label={c.label}>{content}</td>;
                  })}
                </tr>,
                expanded && d && (
                  <tr key={row.id + '-d'} className="detail-row">
                    <td colSpan={cols.length}>
                      <div className="detail">
                        <p><Rich text={d.concept} /></p>
                        {d.reactionIds?.map((id) => {
                          const r = lesson.reactions[id]!;
                          return (
                            <div key={id} className="detail-reaction">
                              <ReactionLine r={r} />
                              {r.observation && <p className="obs">Kuzatiladi: {r.observation}</p>}
                              {r.safety && <p className="safety" role="note">⚠ {r.safety}</p>}
                            </div>
                          );
                        })}
                        {d.observation && <p className="obs">Kuzatiladi: {d.observation}</p>}
                        {d.examTip && <p className="tip"><strong>Imtihon uchun:</strong> {d.examTip}</p>}
                        {d.pages && <p className="cite">Manba: darslik, {d.pages.join(', ')}-bet</p>}
                      </div>
                    </td>
                  </tr>
                ),
              ];
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
