import { describe, expect, it } from 'vitest';
import { EQ_SYSTEMS, predictShift, rateFactor } from '../features/visuals/kinetics';
import { checkBalance } from '../lib/chem';

const sys = (id: string) => EQ_SYSTEMS.find((s) => s.id === id)!;

it('rate factor follows van ’t Hoff and mass action', () => {
  expect(rateFactor(2, 40)).toBe(16);
  expect(rateFactor(3, 30)).toBe(27);
  expect(rateFactor(2, 0, 3)).toBe(3);
  expect(rateFactor(2, 0, 3, 2)).toBe(9);
});

describe('Le Chatelier', () => {
  it('matches textbook examples', () => {
    expect(predictShift(sys('so3'), 'heat')).toBe('left');
    expect(predictShift(sys('so3'), 'pressureUp')).toBe('right');
    expect(predictShift(sys('so3'), { add: 'O2' })).toBe('right');
    expect(predictShift(sys('so3'), { remove: 'SO3' })).toBe('right');
    expect(predictShift(sys('so3'), 'catalyst')).toBe('none');
    expect(predictShift(sys('nh3'), 'pressureDown')).toBe('left');
    expect(predictShift(sys('co'), 'heat')).toBe('right'); // endothermic
    expect(predictShift(sys('co'), 'pressureUp')).toBe('left');
    expect(predictShift(sys('no'), 'pressureUp')).toBe('none'); // equal gas volumes
    expect(predictShift(sys('co'), { add: 'CO' })).toBe('left');
  });
  it('systems are balanced and gas counts match the equations', () => {
    for (const s of EQ_SYSTEMS) expect(checkBalance(s.equation), s.equation).toEqual([]);
  });
});
