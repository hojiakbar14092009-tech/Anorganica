import { expect, it } from 'vitest';
import { normalize, search } from '../lib/search';

it('normalizes apostrophes and subscripts', () => {
  expect(normalize('Energetik pog‘onachalar')).toBe(normalize("energetik pog'onachalar"));
  expect(normalize('H₂SO₄')).toBe('h2so4');
});

it('finds by section number, title, formula and equation text', async () => {
  expect((await search('§23')).map((h) => h.section.id)).toEqual(['g8-s23', 'g9-s23']);
  expect((await search('8-sinf §23')).map((h) => h.section.id)).toEqual(['g8-s23']);
  expect((await search('pog`onachalar'))[0]?.section.id).toBe('g8-s10');
  expect((await search('KClO₃')).map((h) => h.section.id)).toContain('g8-s23');
  expect(await search('   ')).toEqual([]);
});
