// Single source of truth for app colours. "tone" (−1…1) shifts perceived surface brightness and
// "warmth" (−1 cool … 1 warm) tints neutral surfaces. Text lightness is fixed per mode so contrast
// stays ≥ WCAG AA for every slider position (verified in tests/theme.test.ts). This never touches hardware brightness.

export type Mode = 'light' | 'dark';
type Oklch = [l: number, c: number, h: number];

function oklchToRgb([l, c, h]: Oklch): [number, number, number] {
  const a = c * Math.cos((h * Math.PI) / 180), b = c * Math.sin((h * Math.PI) / 180);
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const lin = [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ].map((v) => Math.min(1, Math.max(0, v)));
  return lin.map((v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055)) as [number, number, number];
}

const hex = (o: Oklch) => '#' + oklchToRgb(o).map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('');

export function luminance(hexColor: string): number {
  const v = [1, 3, 5].map((i) => parseInt(hexColor.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * v[0]! + 0.7152 * v[1]! + 0.0722 * v[2]!;
}
export const contrast = (a: string, b: string) => {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x! + 0.05) / (y! + 0.05);
};

export function palette(mode: Mode, tone = 0, warmth = 0): Record<string, string> {
  const hue = warmth >= 0 ? 75 : 245; // amber-paper vs. cool-glass neutrals
  const tint = Math.abs(warmth) * 0.022;
  const surf = (l: number): Oklch => [l, tint, hue];
  if (mode === 'light') {
    const base = 0.965 + tone * 0.03; // 0.935 … 0.995
    return {
      bg: hex(surf(base)), surface: hex(surf(Math.min(1, base + 0.025))), raised: hex(surf(base - 0.035)),
      line: hex(surf(base - 0.12)), text: hex([0.22, 0.012, hue]), muted: hex([0.44, 0.012, hue]),
      accent: hex([0.45, 0.09, 205]), accentText: '#ffffff', warn: hex([0.48, 0.13, 45]), ok: hex([0.46, 0.1, 150]),
      formula: hex([0.36, 0.08, 265]),
    };
  }
  const base = 0.19 + tone * 0.05; // 0.14 … 0.24
  return {
    bg: hex(surf(base)), surface: hex(surf(base + 0.035)), raised: hex(surf(base + 0.07)),
    line: hex(surf(base + 0.14)), text: hex([0.94, 0.008, hue]), muted: hex([0.76, 0.012, hue]),
    accent: hex([0.8, 0.1, 205]), accentText: hex([0.18, 0.03, 205]), warn: hex([0.8, 0.12, 60]), ok: hex([0.8, 0.12, 150]),
    formula: hex([0.84, 0.07, 265]),
  };
}

export function applyPalette(p: Record<string, string>, mode: Mode) {
  const root = document.documentElement;
  for (const [k, v] of Object.entries(p)) root.style.setProperty(`--${k}`, v);
  root.dataset.mode = mode;
  root.style.colorScheme = mode;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', p.bg!);
}
