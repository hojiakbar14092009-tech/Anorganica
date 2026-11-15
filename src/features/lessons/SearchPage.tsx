import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { search, type Hit } from '../../lib/search';

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const [result, setResult] = useState<{ q: string; hits: Hit[] } | null>(null);

  useEffect(() => {
    let alive = true;
    const t = setTimeout(() => search(q).then((hits) => alive && setResult({ q, hits })), 120);
    return () => { alive = false; clearTimeout(t); };
  }, [q]);

  const hits = result?.q === q ? result.hits : null;
  return (
    <main className="page">
      <h1 className="sr-only">Qidiruv</h1>
      <div role="search" className="search-big">
        <label htmlFor="q" className="sr-only">Qidirish</label>
        <input id="q" type="search" autoFocus value={q} placeholder="Modda, formula yoki §" autoComplete="off"
          onChange={(e) => setParams({ q: e.target.value }, { replace: true })} />
      </div>
      <p className="sr-only" role="status">{hits ? `${hits.length} ta natija` : ''}</p>
      {q.trim() && hits?.length === 0 && <p className="muted">«{q}» bo‘yicha hech narsa topilmadi.</p>}
      <ul className="results">
        {hits?.map(({ section: s, where }) => (
          <li key={s.id}>
            <Link to={`/dars/${s.id}`}>
              <span className="num">{s.grade}-sinf · §{s.section}</span>
              <span className="t">{s.title}</span>
              {where !== 'sarlavha' && <span className="where">{where}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
