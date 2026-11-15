// Visual registry: lessonId → verified schematic scenes. Every equation here is balance-checked in tests/visuals.test.ts.
import type { ElectrolysisSpec } from './ElectrolysisCell';

export type Visual =
  | { kind: 'electrolysis'; purpose: string; spec: ElectrolysisSpec }
  | { kind: 'molecule'; purpose: string; ids: string[] };

const mol = (purpose: string, ...ids: string[]): Visual => ({ kind: 'molecule', purpose, ids });

export const visuals: Record<string, Visual[]> = {
  'g8-s21': [mol('Metallmas molekulalarida bog‘ karraliligi: N≡N, O=O, Cl–Cl', 'n2', 'o2', 'cl2')],
  'g8-s22': [mol('Galogen molekulalari: F₂ → I₂ bog‘ uzunligi ortadi', 'f2', 'cl2', 'br2', 'i2')],
  'g8-s23': [mol('Cl₂ — qutbsiz kovalent bog‘', 'cl2')],
  'g8-s24': [mol('HCl — qutbli kovalent bog‘', 'hcl')],
  'g8-s28': [mol('F₂, Br₂, I₂ bog‘ uzunliklari', 'f2', 'br2', 'i2')],
  'g8-s29': [mol('H₂O va H₂S burchaklari farqi', 'h2o', 'h2s', 'o2')],
  'g8-s30': [mol('H₂S — burchakli molekula', 'h2s')],
  'g8-s31': [mol('SO₂ (burchakli) va SO₃ (yassi uchburchak)', 'so2', 'so3')],
  'g8-s32': [mol('H₂SO₄ tuzilishi: ikki S=O va ikki S–OH', 'h2so4')],
  'g8-s35': [mol('Kontakt jarayonda SO₂ → SO₃', 'so2', 'so3')],
  'g8-s36': [mol('N≡N uchlamchi bog‘ — azotning nofaolligi sababi', 'n2')],
  'g8-s37': [mol('NH₃ piramida va NH₄⁺ tetraedr', 'nh3', 'nh4')],
  'g8-s38': [mol('NO₂ — burchakli, toq elektronli molekula', 'no2')],
  'g8-s39': [mol('HNO₃ — yassi molekula', 'hno3')],
  'g8-s40': [mol('Oq fosfor P₄ — kuchlangan tetraedr', 'p4')],
  'g9-s8': [mol('Olmos va grafit: bir element — ikki panjara', 'diamond', 'graphite')],
  'g9-s9': [mol('Olmos va grafit xossalari tuzilishdan kelib chiqadi', 'diamond', 'graphite')],
  'g9-s10': [mol('CO, CO₂ va CH₄ molekulalari', 'co', 'co2', 'ch4')],
  'g9-s19': [
    { kind: 'electrolysis', purpose: 'Ionlar harakati va elektrod jarayonlari', spec: {
      title: 'CuCl₂ eritmasining elektrolizi (inert elektrodlar)', cation: 'Cu^2+', anion: 'Cl^-',
      cathode: 'Cu^2+ + 2e^- → Cu', anode: '2Cl^- → Cl2 + 2e^-', overall: 'CuCl2 → Cu + Cl2',
      explanation: 'Tok manbai katodga elektron beradi: Cu²⁺ ionlari unga tortilib, elektron oladi va qizil mis qatlami bo‘lib o‘tiradi. Cl⁻ ionlari anodga elektron berib, xlor gaziga aylanadi. Katodda olingan va anodda berilgan elektronlar soni teng.',
    } },
    { kind: 'electrolysis', purpose: 'Ionlar harakati va elektrod jarayonlari', spec: {
      title: 'NaCl eritmasining elektrolizi (inert elektrodlar)', cation: 'Na^+', anion: 'Cl^-',
      cathode: '2H2O + 2e^- → H2 + 2OH^-', anode: '2Cl^- → Cl2 + 2e^-', overall: '2NaCl + 2H2O → 2NaOH + H2 + Cl2',
      explanation: 'Na⁺ ionlari katodga boradi, lekin natriy juda faol — uning o‘rniga suv qaytarilib, vodorod ajraladi va OH⁻ to‘planadi. Anodda xlor ajraladi. Eritmada Na⁺ va OH⁻ qoladi — natriy gidroksid hosil bo‘ladi.',
    } },
  ],
};
