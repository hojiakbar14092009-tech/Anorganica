import { expect, it } from 'vitest';
import { visuals } from '../features/visuals/registry';
import { checkBalance } from '../lib/chem';
import manifest from '../../content/manifest.json';

it('every visual targets a real section and shows balanced equations', () => {
  const ids = new Set(manifest.sections.map((s) => s.id));
  for (const [id, list] of Object.entries(visuals)) {
    expect(ids.has(id), id).toBe(true);
    for (const v of list) for (const eq of [v.spec.cathode, v.spec.anode, v.spec.overall]) expect(checkBalance(eq), eq).toEqual([]);
  }
});
