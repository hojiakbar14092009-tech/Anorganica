import { expect, it } from 'vitest';
import { contrast, palette } from '../features/settings/theme';

it('keeps WCAG AA contrast for every mode/tone/warmth combination', () => {
  const steps = [-1, -0.5, 0, 0.5, 1];
  for (const mode of ['light', 'dark'] as const)
    for (const tone of steps)
      for (const warm of steps) {
        const p = palette(mode, tone, warm);
        for (const bg of [p.bg!, p.surface!, p.raised!]) {
          for (const fg of ['text', 'muted', 'accent', 'formula', 'warn', 'ok'])
            expect(contrast(p[fg]!, bg), `${mode} t${tone} w${warm} ${fg}`).toBeGreaterThanOrEqual(4.5);
        }
        expect(contrast(p.accentText!, p.accent!)).toBeGreaterThanOrEqual(4.5);
      }
});
