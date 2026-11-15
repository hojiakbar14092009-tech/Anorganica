// Ball-and-stick models built from experimental gas-phase bond lengths (Å) and angles (°), rounded
// (reference: NIST CCCBDB / standard inorganic chemistry tables). Pure data + geometry, no rendering.
// A ball-and-stick model is a schematic: atoms are not hard spheres and bonds are not sticks.

export type Vec = [number, number, number];
export interface Atom { el: string; p: Vec }
export interface Bond { a: number; b: number; order: 1 | 1.5 | 2 | 3 }
export interface Molecule {
  id: string; formula: string; name: string; shape: string;
  atoms: Atom[]; bonds: Bond[];
  facts: string[]; // bond lengths/angles shown as the text fallback and caption
}

const rad = (d: number) => (d * Math.PI) / 180;
const uz = (n: number, digits?: number) => (digits === undefined ? String(n) : n.toFixed(digits)).replace('.', ','); // Uzbek decimal comma
const atom = (el: string, p: Vec = [0, 0, 0]): Atom => ({ el, p });

/** Two-atom molecule along x. */
function diatomic(id: string, name: string, a: string, b: string, r: number, order: Bond['order']): Molecule {
  return {
    id, name, formula: a === b ? `${a}2` : a + b, shape: 'chiziqli',
    atoms: [atom(a, [-r / 2, 0, 0]), atom(b, [r / 2, 0, 0])], bonds: [{ a: 0, b: 1, order }],
    facts: [`${a}–${b}: ${uz(r, 2)} Å`],
  };
}

/** Central atom + n identical ligands in the xy plane, symmetric about y (bent / trigonal planar / linear). */
function planar(id: string, name: string, formula: string, shape: string, c: string, l: string, r: number, angle: number, n: 2 | 3, order: Bond['order']): Molecule {
  const dirs: number[] = n === 2 ? [90 + angle / 2, 90 - angle / 2] : [90, 210, 330];
  return {
    id, name, formula, shape,
    atoms: [atom(c), ...dirs.map((d) => atom(l, [r * Math.cos(rad(d)), r * Math.sin(rad(d)), 0]))],
    bonds: dirs.map((_, i) => ({ a: 0, b: i + 1, order })),
    facts: [`${c}–${l}: ${uz(r, 2)} Å`, `∠${l}–${c}–${l}: ${uz(angle)}°`],
  };
}

/** Central atom + 3 ligands forming a trigonal pyramid with the given L–C–L angle. */
function pyramidal(id: string, name: string, formula: string, c: string, l: string, r: number, angle: number): Molecule {
  // Three ligands at polar angle θ from the axis, 120° apart: cos(L–C–L) = 1 − 1.5·sin²θ.
  const theta = Math.asin(Math.sqrt((1 - Math.cos(rad(angle))) / 1.5));
  const pts = [0, 120, 240].map((phi): Vec => [r * Math.sin(theta) * Math.cos(rad(phi)), -r * Math.cos(theta), r * Math.sin(theta) * Math.sin(rad(phi))]);
  return {
    id, name, formula, shape: 'uchburchakli piramida',
    atoms: [atom(c), ...pts.map((p) => atom(l, p))], bonds: pts.map((_, i) => ({ a: 0, b: i + 1, order: 1 as const })),
    facts: [`${c}–${l}: ${uz(r, 2)} Å`, `∠${l}–${c}–${l}: ${uz(angle)}°`, 'Azotda bitta bo‘linmagan elektron jufti bor'],
  };
}

const TET: Vec[] = [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]].map((v) => v.map((x) => x / Math.sqrt(3)) as Vec);
const scale = (v: Vec, k: number): Vec => [v[0] * k, v[1] * k, v[2] * k];
const add = (a: Vec, b: Vec): Vec => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

function tetrahedral(id: string, name: string, formula: string, c: string, l: string, r: number): Molecule {
  return {
    id, name, formula, shape: 'tetraedr',
    atoms: [atom(c), ...TET.map((v) => atom(l, scale(v, r)))], bonds: TET.map((_, i) => ({ a: 0, b: i + 1, order: 1 as const })),
    facts: [`${c}–${l}: ${uz(r, 2)} Å`, '∠ 109,5°'],
  };
}

/** H2SO4: S at centre, two S=O (1.42 Å) and two S–OH (1.57 Å) on a tetrahedron; O–H 0.97 Å pointing outward. */
function sulfuricAcid(): Molecule {
  const atoms: Atom[] = [atom('S'), atom('O', scale(TET[0]!, 1.42)), atom('O', scale(TET[1]!, 1.42)), atom('O', scale(TET[2]!, 1.57)), atom('O', scale(TET[3]!, 1.57))];
  atoms.push(atom('H', add(atoms[3]!.p, scale(TET[2]!, 0.97))), atom('H', add(atoms[4]!.p, scale(TET[3]!, 0.97))));
  return {
    id: 'h2so4', name: 'Sulfat kislota', formula: 'H2SO4', shape: 'S atrofida buzilgan tetraedr',
    atoms, bonds: [{ a: 0, b: 1, order: 2 }, { a: 0, b: 2, order: 2 }, { a: 0, b: 3, order: 1 }, { a: 0, b: 4, order: 1 }, { a: 3, b: 5, order: 1 }, { a: 4, b: 6, order: 1 }],
    facts: ['S=O: 1,42 Å', 'S–OH: 1,57 Å', 'O–H: 0,97 Å', 'Model soddalashtirilgan: H atomlari yo‘nalishi taxminiy'],
  };
}

/** HNO3: planar; N–O 1.21 Å (×2, delocalised), N–OH 1.41 Å, O–H 0.96 Å. */
function nitricAcid(): Molecule {
  const p = (r: number, d: number, o: Vec = [0, 0, 0]): Vec => add(o, [r * Math.cos(rad(d)), r * Math.sin(rad(d)), 0]);
  const oh = p(1.41, 270);
  return {
    id: 'hno3', name: 'Nitrat kislota', formula: 'HNO3', shape: 'yassi',
    atoms: [atom('N'), atom('O', p(1.21, 30)), atom('O', p(1.21, 150)), atom('O', oh), atom('H', p(0.96, 210, oh))],
    bonds: [{ a: 0, b: 1, order: 1.5 }, { a: 0, b: 2, order: 1.5 }, { a: 0, b: 3, order: 1 }, { a: 3, b: 4, order: 1 }],
    facts: ['N–O: 1,21 Å (ikkita, delokallashgan)', 'N–OH: 1,41 Å', 'Azotning valentligi IV, oksidlanish darajasi +5'],
  };
}

function p4(): Molecule {
  const r = 2.21;
  const atoms = TET.map((v) => atom('P', scale(v, r / Math.sqrt(8 / 3)))); // |TETi − TETj| = √(8/3) for unit vectors
  const bonds: Bond[] = [];
  for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) bonds.push({ a: i, b: j, order: 1 });
  return { id: 'p4', name: 'Oq fosfor molekulasi', formula: 'P4', shape: 'tetraedr (P atomlari uchlarida)', atoms, bonds, facts: ['P–P: 2,21 Å', '∠P–P–P: 60° — kuchlangan halqa, shuning uchun oq fosfor juda faol'] };
}

/** Diamond fragment: one conventional cubic cell (a = 3.567 Å) with all C–C contacts at 1.545 Å. */
function diamond(): Molecule {
  const a = 3.567;
  const fcc: Vec[] = [[0, 0, 0], [0, 0.5, 0.5], [0.5, 0, 0.5], [0.5, 0.5, 0]];
  const basis: Vec[] = [[0, 0, 0], [0.25, 0.25, 0.25]];
  const pts: Vec[] = [];
  for (const f of fcc) for (const b of basis) pts.push(scale(add(f, b), a));
  for (const extra of [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 1, 0], [1, 0, 1], [0, 1, 1], [1, 1, 1], [1, 0.5, 0.5], [0.5, 1, 0.5], [0.5, 0.5, 1]] as Vec[]) pts.push(scale(extra, a));
  return lattice('diamond', 'Olmos (kristall panjara bo‘lagi)', 'C', pts, 1.545, ['C–C: 1,545 Å', 'Har bir C atomi 4 ta C bilan tetraedrik bog‘langan (sp³)', 'Uch o‘lchamli atom panjara — juda qattiq, elektr o‘tkazmaydi']);
}

/** Graphite fragment: two AB-stacked hexagonal layers, C–C 1.42 Å, interlayer 3.35 Å (no bonds between layers). */
function graphite(): Molecule {
  const d = 1.42;
  const pts: Vec[] = [];
  const a1: Vec = [d * Math.sqrt(3), 0, 0], a2: Vec = [d * Math.sqrt(3) / 2, 0, d * 1.5];
  for (const layer of [0, 1]) for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) {
    const o = add(scale(a1, i), scale(a2, j));
    const shift: Vec = layer ? [0, -3.35, d] : [0, 0, 0];
    pts.push(add(o, shift), add(add(o, [0, 0, d]), shift));
  }
  return lattice('graphite', 'Grafit (ikki qatlam)', 'C', pts, d, ['C–C qatlam ichida: 1,42 Å (sp²)', 'Qatlamlar orasi: 3,35 Å — kuchsiz tortishish, qatlamlar oson siljiydi', 'Delokallashgan elektronlar — elektr o‘tkazadi']);
}

function lattice(id: string, name: string, el: string, raw: Vec[], bond: number, facts: string[]): Molecule {
  const pts: Vec[] = [];
  for (const p of raw) if (!pts.some((q) => Math.hypot(q[0] - p[0], q[1] - p[1], q[2] - p[2]) < 0.1)) pts.push(p);
  const c = pts.reduce((s, p) => add(s, p), [0, 0, 0] as Vec).map((x) => x / pts.length) as Vec;
  const atoms = pts.map((p) => atom(el, add(p, scale(c, -1))));
  const bonds: Bond[] = [];
  for (let i = 0; i < atoms.length; i++) for (let j = i + 1; j < atoms.length; j++) {
    const [p, q] = [atoms[i]!.p, atoms[j]!.p];
    if (Math.abs(Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]) - bond) < 0.05) bonds.push({ a: i, b: j, order: 1 });
  }
  // Drop atoms of the cut-out fragment that ended up without any bond inside the fragment.
  const used = new Set(bonds.flatMap((b) => [b.a, b.b]));
  const keep = atoms.map((_, i) => i).filter((i) => used.has(i));
  const idx = new Map(keep.map((old, i) => [old, i]));
  return {
    id, name, formula: `${el}${keep.length}`, shape: 'panjara bo‘lagi',
    atoms: keep.map((i) => atoms[i]!), bonds: bonds.map((b) => ({ ...b, a: idx.get(b.a)!, b: idx.get(b.b)! })),
    facts: [...facts, 'Ko‘rsatilgan — cheksiz kristallning kichik bo‘lagi'],
  };
}

/** Metal unit cell; sticks join nearest neighbours only — metallic bonding is delocalised, not localised pair bonds. */
function metalCell(id: string, name: string, el: string, a: number, kind: 'fcc' | 'bcc', facts: string[]): Molecule {
  const corners: Vec[] = [];
  for (const x of [0, 1]) for (const y of [0, 1]) for (const z of [0, 1]) corners.push([x, y, z]);
  const extra: Vec[] = kind === 'bcc' ? [[0.5, 0.5, 0.5]] : [[0.5, 0.5, 0], [0.5, 0.5, 1], [0.5, 0, 0.5], [0.5, 1, 0.5], [0, 0.5, 0.5], [1, 0.5, 0.5]];
  const nn = kind === 'bcc' ? (a * Math.sqrt(3)) / 2 : a / Math.SQRT2;
  return lattice(id, name, el, [...corners, ...extra].map((v) => scale(v, a)), nn, [...facts, 'Chiziqlar — eng yaqin qo‘shni atomlar; metall bog‘ delokallashgan elektronlar hisobiga, juft kovalent bog‘ emas']);
}

export const MOLECULES: Record<string, Molecule> = Object.fromEntries([
  diatomic('f2', 'Ftor', 'F', 'F', 1.42, 1),
  diatomic('cl2', 'Xlor', 'Cl', 'Cl', 1.99, 1),
  diatomic('br2', 'Brom', 'Br', 'Br', 2.28, 1),
  diatomic('i2', 'Yod', 'I', 'I', 2.67, 1),
  diatomic('hcl', 'Vodorod xlorid', 'H', 'Cl', 1.27, 1),
  diatomic('n2', 'Azot', 'N', 'N', 1.10, 3),
  diatomic('o2', 'Kislorod', 'O', 'O', 1.21, 2),
  diatomic('co', 'Uglerod(II) oksid', 'C', 'O', 1.13, 3),
  planar('h2o', 'Suv', 'H2O', 'burchakli', 'O', 'H', 0.96, 104.5, 2, 1),
  planar('h2s', 'Vodorod sulfid', 'H2S', 'burchakli', 'S', 'H', 1.34, 92.1, 2, 1),
  planar('so2', 'Oltingugurt(IV) oksid', 'SO2', 'burchakli', 'S', 'O', 1.43, 119.5, 2, 2),
  planar('no2', 'Azot(IV) oksid', 'NO2', 'burchakli', 'N', 'O', 1.20, 134.1, 2, 1.5),
  planar('co2', 'Uglerod(IV) oksid', 'CO2', 'chiziqli', 'C', 'O', 1.16, 180, 2, 2),
  planar('so3', 'Oltingugurt(VI) oksid', 'SO3', 'yassi uchburchak', 'S', 'O', 1.42, 120, 3, 2),
  pyramidal('nh3', 'Ammiak', 'NH3', 'N', 'H', 1.01, 106.7),
  tetrahedral('nh4', 'Ammoniy ioni', 'NH4^+', 'N', 'H', 1.03),
  tetrahedral('ch4', 'Metan', 'CH4', 'C', 'H', 1.09),
  sulfuricAcid(), nitricAcid(), p4(), diamond(), graphite(),
  metalCell('cu_fcc', 'Mis: yoqlari markazlashgan kub panjara', 'Cu', 3.615, 'fcc', ['a = 3,615 Å', 'Eng yaqin qo‘shnilar orasi 2,56 Å, har bir atomning 12 qo‘shnisi bor', 'Qatlamlar oson siljiydi — mis yumshoq va cho‘ziluvchan']),
  metalCell('fe_bcc', 'Temir (α-Fe): hajmi markazlashgan kub panjara', 'Fe', 2.866, 'bcc', ['a = 2,866 Å', 'Eng yaqin qo‘shnilar orasi 2,48 Å, 8 qo‘shni', 'Uglerod atomlari panjara bo‘shliqlariga kirib, po‘lat va cho‘yan xossalarini o‘zgartiradi']),
].map((m) => [m.id, m]));

// Jmol/CPK colours (sRGB hex).
export const ELEMENT_COLOR: Record<string, string> = {
  H: '#f2f2f2', C: '#505050', Cu: '#c88033', Fe: '#e06633', N: '#3050f8', O: '#ff0d0d', F: '#90e050', P: '#ff8000', S: '#e0c000', Cl: '#1ff01f', Br: '#a62929', I: '#940094',
};
// Covalent radii (Å) — used only to size spheres proportionally.
export const COVALENT_RADIUS: Record<string, number> = { H: 0.31, C: 0.76, Cu: 1.32, Fe: 1.32, N: 0.71, O: 0.66, F: 0.57, P: 1.07, S: 1.05, Cl: 1.02, Br: 1.2, I: 1.39 };

export const distance = (m: Molecule, b: Bond) => {
  const [p, q] = [m.atoms[b.a]!.p, m.atoms[b.b]!.p];
  return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
};
