import { Link } from 'react-router-dom';
import { chapters, hasLesson, sectionById } from '../../lib/content';

/** Grade → chapter → § navigation using native <details> (keyboard/VoiceOver friendly, no JS state). */
export function ChapterNav({ grade, current }: { grade: 8 | 9; current?: string }) {
  return (
    <nav aria-label={`${grade}-sinf boblari`} className="chapters">
      {chapters.filter((c) => c.grade === grade).map((c) => {
        const ids = c.sections.map((n) => `g${grade}-s${n}`);
        return (
          <details key={c.id} open={current ? ids.includes(current) : undefined}>
            <summary>
              <span className="roman">{c.roman}</span>
              <span>{c.title}</span>
              <span className="count">{c.sections.length}</span>
            </summary>
            <ol>
              {ids.map((id) => {
                const s = sectionById.get(id)!;
                return (
                  <li key={id}>
                    <Link to={`/dars/${id}`} aria-current={id === current ? 'page' : undefined}>
                      <span className="num">§{s.section}</span>
                      <span className="t">{s.title}</span>
                      {!hasLesson(id) && <span className="pending" title="Dars mazmuni tayyorlanmoqda">·</span>}
                    </Link>
                  </li>
                );
              })}
            </ol>
          </details>
        );
      })}
    </nav>
  );
}
