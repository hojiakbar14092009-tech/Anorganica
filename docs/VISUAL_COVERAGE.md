# Visual coverage plan

Source of truth: `src/features/visuals/registry.ts` (lesson → visuals, each with a purpose) and `molecules.ts` (geometry data).
Tests: `src/tests/molecules.test.ts` (formula ↔ atoms, connectivity, bond lengths, H–O–H 104.5°, H–S–H 92.1°, H–N–H 106.7°, CH₄ 109.47°, P–P 2.21 Å, graphite C–C 1.42 Å), `src/tests/visuals.test.ts` (allowed lesson IDs, balanced electrode equations).

| Lesson | Visual | Type | Status |
|---|---|---|---|
| g8-s21 | N₂, O₂, Cl₂ (bond order) | 3D | tested |
| g8-s22 | F₂, Cl₂, Br₂, I₂ (bond length trend 1.42→2.67 Å) | 3D | tested |
| g8-s23 / s24 / s28 | Cl₂ / HCl / F₂, Br₂, I₂ | 3D | tested |
| g8-s29 / s30 | H₂O vs H₂S angle, O₂ / H₂S | 3D | tested |
| g8-s31 / s35 | SO₂, SO₃ | 3D | tested |
| g8-s32 | H₂SO₄ (S=O 1.42, S–OH 1.57 Å; H orientation approximate) | 3D | tested |
| g8-s36 / s37 / s38 / s39 / s40 | N₂ / NH₃, NH₄⁺ / NO₂ / HNO₃ / P₄ | 3D | tested |
| g9-s8, s9 | diamond cell fragment, graphite two layers | 3D | tested |
| g9-s10 | CO, CO₂, CH₄ | 3D | tested |
| g9-s19 | CuCl₂ and NaCl electrolysis cells | 2D SVG animation | tested |
| g8-s33 | rate explorer: γ^(Δt/10)·[A] with schematic particles | interactive 2D | logic tested |
| g8-s34 | Le Chatelier explorer (SO₃, NH₃, CO, NO systems) | interactive 2D | logic tested |
| g8-s35 | contact process flow (pyrite → SO₂ → clean → V₂O₅ → oleum) | step animation | equations tested |
| g8-s39 | nitric acid from ammonia flow | step animation | equations tested |
| g9-s18 | iron rusting (anode/cathode/Fe(OH)₂/Fe(OH)₃) | step animation | equations tested |
| g9-s22 | Solvay process flow incl. NH₃ regeneration | step animation | equations tested |
| g9-s36 | blast furnace zones top → bottom | step animation | equations tested |
| g9-s16, s17 | Cu fcc and α-Fe bcc unit cells (nearest-neighbour sticks, metallic-bond caveat) | 3D | tested (2.556 / 2.482 Å) |
| g9-s25 | Al₂O₃ in molten cryolite electrolysis | 2D SVG animation | equations tested |
| g9-s27 | Al(OH)₃ amphoterism (virtual test-tube sequence) | step animation | equations tested |
| g9-s32 | Cr(III)/chromate/dichromate colours and Cr(VI) → Cr(III) | step animation | equations tested |
| g8-s27 | HCl (acid = HCl solution) | 3D | tested |
| g9-s11 | CO₃²⁻ planar ion (C–O 1.29 Å, delocalised), CO₂ | 3D | tested |
| g9-s13 | SiO₄⁴⁻ tetrahedron (Si–O 1.62 Å) | 3D | tested |
| g9-s24 | water softening methods | step animation | equations tested |
| g9-s33 | KMnO₄ reduction by medium (Mn²⁺ / MnO₂ / MnO₄²⁻) | step animation | equations tested |
| g9-s35 | Fe²⁺ / Fe³⁺ qualitative tests | step animation | equations tested |
| others (18) | tables + equations only — judged sufficient (laws, fertilizers, biogenic elements, metals overview) | — | figure audit pending |

All models are labelled “sxematik model”; text facts (lengths/angles) are always visible as the fallback.
