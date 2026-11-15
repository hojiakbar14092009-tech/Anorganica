import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sectionById, sections } from '../../lib/content';
import { useAppState } from '../../lib/storage';
import { ChapterNav } from './ChapterNav';

export function Home() {
  const { lastLesson } = useAppState();
  const last = lastLesson ? sectionById.get(lastLesson) : undefined;
  const [grade, setGrade] = useState<8 | 9>(last?.grade ?? 8);
  const navigate = useNavigate();

  return (
    <main className="page home">
      <form role="search" className="search-big" onSubmit={(e) => {
        e.preventDefault();
        const q = new FormData(e.currentTarget).get('q');
        if (typeof q === 'string' && q.trim()) navigate(`/qidiruv?q=${encodeURIComponent(q.trim())}`);
      }}>
        <label htmlFor="home-q" className="sr-only">Qidirish</label>
        <input id="home-q" name="q" type="search" placeholder="Modda, formula yoki § (masalan, H₂SO₄, §32)" autoComplete="off" enterKeyHint="search" />
      </form>

      {last && (
        <Link className="resume" to={`/dars/${last.id}`}>
          <span className="resume-label">Davom etish</span>
          <span className="resume-title">{last.grade}-sinf · §{last.section}. {last.title}</span>
        </Link>
      )}

      <div className="seg" role="tablist" aria-label="Sinf">
        {([8, 9] as const).map((g) => (
          <button key={g} role="tab" aria-selected={grade === g} onClick={() => setGrade(g)}>{g}-sinf <span className="count">({sections.filter((x) => x.grade === g).length} mavzu)</span></button>
        ))}
      </div>
      <ChapterNav grade={grade} current={last?.id} />
    </main>
  );
}
