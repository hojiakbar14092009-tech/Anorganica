# Visual coverage plan

Status: **started** — G9 §19 electrolysis scenes (CuCl₂, NaCl) are built and balance-tested (`src/features/visuals/registry.ts`). Three.js is not installed. Rows below are the
planned high-value scenes for the seeded lessons only; the full 85-section audit of textbook figures is pending.

| sectionId | Concept | Why it helps | Type | Chemistry to verify | Fallback |
|---|---|---|---|---|---|
| g8-s23 | Fig. 15 lab Cl₂ generation; Fig. 16 Cl₂ + Na/Sb/Fe/Cu | Shows apparatus + observations | animated2D | MnO₂ + 4HCl balanced; FeCl₃ brown smoke | table row + equation |
| g8-s32 | Dilution “acid into water”; BaSO₄ precipitate | Safety + qualitative test | animated2D | white precipitate, insoluble in HNO₃ | text |
| g9-s19 | Electrolysis cell CuSO₄ / NaCl | Ion migration, electrode half-reactions | animated2D (SVG) | 2e⁻ per Cu, 4e⁻ per O₂ | cathode/anode tables |
