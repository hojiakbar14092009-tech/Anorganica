import { expect, it } from 'vitest';
import { visuals } from '../features/visuals/registry';
import { checkBalance } from '../lib/chem';
import { MOLECULES } from '../features/visuals/molecules';
import manifest from '../../content/manifest.json';

it('every visual targets a real section and shows balanced equations', () => {
  const ids = new Set(manifest.sections.map((s) => s.id));
  for (const [id, list] of Object.entries(visuals)) {
    expect(ids.has(id), id).toBe(true);
    for (const v of list) {
      expect(v.purpose.length).toBeGreaterThan(5);
      if (v.kind === 'electrolysis') for (const eq of [v.spec.cathode, v.spec.anode, v.spec.overall]) expect(checkBalance(eq), eq).toEqual([]);
      else for (const m of v.ids) expect(MOLECULES[m], `${id}: ${m}`).toBeDefined();
    }
  }
});
