// Visual registry: lessonId → verified schematic scenes. Every equation here is balance-checked in tests/visuals.test.ts.
import type { ElectrolysisSpec } from './ElectrolysisCell';

export type Visual = { kind: 'electrolysis'; spec: ElectrolysisSpec };

export const visuals: Record<string, Visual[]> = {
  'g9-s19': [
    { kind: 'electrolysis', spec: {
      title: 'CuCl₂ eritmasining elektrolizi (inert elektrodlar)', cation: 'Cu^2+', anion: 'Cl^-',
      cathode: 'Cu^2+ + 2e^- → Cu', anode: '2Cl^- → Cl2 + 2e^-', overall: 'CuCl2 → Cu + Cl2',
      explanation: 'Tok manbai katodga elektron beradi: Cu²⁺ ionlari unga tortilib, elektron oladi va qizil mis qatlami bo‘lib o‘tiradi. Cl⁻ ionlari anodga elektron berib, xlor gaziga aylanadi. Katodda olingan va anodda berilgan elektronlar soni teng.',
    } },
    { kind: 'electrolysis', spec: {
      title: 'NaCl eritmasining elektrolizi (inert elektrodlar)', cation: 'Na^+', anion: 'Cl^-',
      cathode: '2H2O + 2e^- → H2 + 2OH^-', anode: '2Cl^- → Cl2 + 2e^-', overall: '2NaCl + 2H2O → 2NaOH + H2 + Cl2',
      explanation: 'Na⁺ ionlari katodga boradi, lekin natriy juda faol — uning o‘rniga suv qaytarilib, vodorod ajraladi va OH⁻ to‘planadi. Anodda xlor ajraladi. Eritmada Na⁺ va OH⁻ qoladi — natriy gidroksid hosil bo‘ladi.',
    } },
  ],
};
