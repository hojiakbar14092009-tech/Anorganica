# Exam alignment (Milliy sertifikat, Kimyo)

- Specification: https://www.uzbmb.uz/upload/file/pdf/mtt/spetsifikatsiya/Kimyo-MS2025.pdf — fetched and checked 2026-11-15.
  Confirmed there: 180 min = 100 (tasks 1–40) + 80 (tasks 41–43, written); types Y1, Y2, O1, O2; tasks 41 general, 42 organic, 43 inorganic or analysis; O2 = 25 points each; Y1/Y2/O1 scored by the Rasch model.
  Task counts per type (Y1 32, Y2 3, O1 5, O2 3 = 43) are taken from the user's spec; re-verify on the next edition.
- Portals: https://uzbmb.uz/page/milliytest, https://www.uzbmb.uz/page/namuna_m (not used as a question source).
- **Boundary:** the app covers only the 53 allowed lessons. Organic chemistry, chemical analysis and general-chemistry topics outside these lessons are **not** covered. The 43-task session is labelled “Tanlangan 53 mavzu bo‘yicha sertifikat uslubidagi mashq”; no official score is computed.
- Bank: 255 original questions (Y1 100, Y2 42, O1 110, O2 3); machine-readable mapping in `src/content/exam-alignment.json`. Validated by `src/tests/content.test.ts` (schema, answer keys, unique stems, balanced equations).

| Lesson | Skills | Questions |
|---|---|---|
| g8-s21 | davriy qonuniyat, umumiy formulalar, bog‘ turi, massa ulushi | 4 (Y1 2, Y2 1, O1 1) |
| g8-s22 | galogenlar faolligi, stexiometriya, atom tuzilishi, fizik xossalar | 4 (Y1 2, O1 1, Y2 1) |
| g8-s23 | reaksiya mahsuloti, gaz zichligi, oksidlanish-qaytarilish, stexiometriya, oksidlanish darajasi | 5 (Y1 3, O1 2) |
| g8-s24 | stexiometriya, bog‘ turi, olinish sharoiti, gaz zichligi | 4 (O1 2, Y1 2) |
| g8-s25 | molyar hajm, nisbiy zichlik, Avogadro qonuni, zarrachalar soni, gaz zichligi | 5 (O1 4, Y1 1) |
| g8-s26 | ekvivalent massa, ekvivalentlar qonuni | 4 (O1 3, Y1 1) |
| g8-s27 | sifat reaksiyasi, stexiometriya, konsentratsiya, reaksiya mahsuloti, oksidlanish darajasi | 5 (Y1 2, O1 2, Y2 1) |
| g8-s28 | sifat reaksiyalari, galogenlar faolligi, stexiometriya, fizik xossalar | 4 (Y2 1, Y1 2, O1 1) |
| g8-s29 | oksidlanish darajasi, stexiometriya, oksidlovchi/qaytaruvchi, atom tuzilishi | 4 (Y1 3, O1 1) |
| g8-s30 | gaz zichligi, sifat reaksiyasi, stexiometriya, oksidlovchi/qaytaruvchi | 4 (O1 2, Y1 2) |
| g8-s31 | nisbiy zichlik, stexiometriya, oksidlovchi/qaytaruvchi, kislotali oksidlar | 4 (O1 2, Y1 2) |
| g8-s32 | metall + kislota, reaksiya mahsulotlari, stexiometriya, xavfsizlik, oksidlanish-qaytarilish | 5 (Y1 2, Y2 1, O1 2) |
| g8-s33 | reaksiya tezligi, Vant-Goff qoidasi, massalar ta’siri qonuni, katalizator | 4 (O1 3, Y1 1) |
| g8-s34 | muvozanat siljishi, qaytar/qaytmas, muvozanat ta’rifi | 4 (Y1 3, Y2 1) |
| g8-s35 | sanoat hisoblari, texnologiya tamoyillari, muvozanat, texnologiya bosqichlari | 5 (O1 1, Y1 2, Y2 1, O2 1) |
| g8-s36 | molekula tuzilishi, gaz zichligi, stexiometriya, olinish usullari | 4 (Y1 2, O1 2) |
| g8-s37 | gaz hajmlari, sifat reaksiyasi, oksidlanish darajasi, stexiometriya | 4 (O1 2, Y1 2) |
| g8-s38 | oksidlar sinflanishi, nisbiy zichlik, oksidlanish darajasi, stexiometriya | 4 (Y1 1, O1 2, Y2 1) |
| g8-s39 | nitrat kislota + metall, nitratlar parchalanishi, elektron balans | 4 (Y1 1, O1 2, Y2 1) |
| g8-s40 | oksidlanish darajasi, stexiometriya, allotropiya, xavfsizlik va saqlash | 5 (Y1 2, O1 2, Y2 1) |
| g8-s41 | ionlar nomi, stexiometriya, sifat reaksiyalari, fosfor oksidi | 5 (Y1 2, O1 2, Y2 1) |
| g8-s42 | o‘g‘it turlari, massa ulushi, o‘g‘it va ozuqa elementi, agrokimyo, ozuqa elementlari roli | 6 (Y1 3, O1 2, Y2 1) |
| g8-s43 | ozuqa elementi, gaz hajmi, fosforli o‘g‘itlar, o‘g‘itning olinishi | 6 (O1 4, Y1 1, Y2 1) |
| g8-s44 | elementlar tasnifi, foiz hisobi, elementning roli, massa ulushi, geokimyo | 5 (Y1 2, O1 2, Y2 1) |
| g9-s8 | guruh elementlari tuzilishi, vodorodli birikma bo‘yicha element, allotroplar, oksidlanish darajasi, guruh tarkibi | 5 (Y1 3, O1 1, Y2 1) |
| g9-s9 | stexiometriya, uglerodning reaksiyalari, karbidlar va ularning gidrolizi, adsorbsiya | 5 (O1 2, Y1 2, Y2 1) |
| g9-s10 | stexiometriya, CO2 sifat reaksiyasi, CO va CO2 xossalari, CO2 ning ishlatilishi | 5 (O1 2, Y1 2, Y2 1) |
| g9-s11 | karbonatlarning termik barqarorligi, stexiometriya, aralashmali masala, karbonatlar reaksiyalari, karbonatlarni aniqlash, moddaning tozaligi | 6 (Y1 2, O1 3, Y2 1) |
| g9-s12 | elektron konfiguratsiya, stexiometriya, kremniy materiallarining ishlatilishi, tarqalganligi, massa ulushi | 5 (Y1 2, O1 2, Y2 1) |
| g9-s13 | stexiometriya, SiO2 xossalari, kremniy birikmalari xossalari, kislotalar kuchi | 6 (O1 3, Y1 2, Y2 1) |
| g9-s14 | shisha tarkibi, stexiometriya, silikat materiallari, temir-beton | 5 (Y1 2, O1 2, Y2 1) |
| g9-s15 | metallarning tabiatda uchrashi, elektrometallurgiya, metall olish usullari, metallurgiya hisoblari, gidrometallurgiya hisoblari | 5 (Y1 2, Y2 1, O1 2) |
| g9-s16 | qotishma xossalari, qotishmalar va ishlatilishi, qotishma formulasi, qotishma tarkibini aniqlash | 4 (Y1 2, Y2 1, O1 1) |
| g9-s17 | kuchlanishlar qatori, metall + kislota hisobi, metall + tuz hisobi, metallarning fizik xossalari, metall bog‘ | 5 (Y1 2, O1 2, Y2 1) |
| g9-s18 | elektrokimyoviy himoya, himoya usullari, zanglash hisoblari, korroziya turlari, aluminiy pardasi | 5 (Y1 3, Y2 1, O1 1) |
| g9-s19 | elektroliz mahsulotlari, elektroliz hisoblari, anod jarayonlari, elektroliz mohiyati | 6 (Y1 3, O1 1, Y2 1, O2 1) |
| g9-s20 | guruh qonuniyatlari, kislorod bilan mahsulotlar, ishqoriy metall + suv hisobi, ishqoriy metall xossalari | 4 (Y1 2, Y2 1, O1 1) |
| g9-s21 | eritma konsentratsiyasi, natriy xossalari, natriy va kaliy birikmalari, peroksid hisobi, sifat reaksiyalari | 5 (O1 2, Y1 2, Y2 1) |
| g9-s22 | Solve usuli, soda hisoblari, soda ishlab chiqarish reaksiyalari, xomashyo sarfi, soda turlari | 5 (Y1 2, O1 2, Y2 1) |
| g9-s23 | kalsiy birikmalari, ohakli suv hisobi, tabiiy birikmalar, ohaktosh kuydirish hisobi, magniy xossalari | 5 (Y1 2, O1 2, Y2 1) |
| g9-s24 | qattiqlik turlari, qaynatish hisobi, ohak bilan yumshatish, yumshatish reaksiyalari, yumshatish usullari | 5 (Y1 2, O1 2, Y2 1) |
| g9-s25 | aluminiy olinishi, elektroliz hisobi, minerallar tarkibi, massa ulushi, elektroliz jarayoni | 5 (Y1 2, O1 2, Y2 1) |
| g9-s26 | gaz hajmi hisobi, aluminotermiya hisobi, passivlanish, aluminiy reaksiyalari, qotishma tarkibi | 5 (O1 3, Y1 1, Y2 1) |
| g9-s27 | amfoter gidroksid, cho‘kma massasi, amfoter gidroksid xossalari, termik parchalanish, kristallgidrat tarkibi | 5 (Y1 1, O1 3, Y2 1) |
| g9-s28 | mis birikmalari rangi, kristallgidrat hisobi, gaz hajmi hisobi | 5 (Y1 1, O1 3, Y2 1) |
| g9-s29 | cho‘kma massasi, zar suvi, proba hisobi, galogenidlarning rangi, sianlash hisobi | 5 (O1 3, Y1 1, Y2 1) |
| g9-s30 | gaz hajmi hisobi, kuydirish hisobi, tabiiy birikmalar, amfoterlik, simob xavfsizligi | 5 (O1 2, Y2 1, Y1 2) |
| g9-s31 | elektron konfiguratsiya, aluminotermiya hisobi, gaz hajmi hisobi, passivlanish, qotishma tarkibi | 5 (Y1 2, O1 3) |
| g9-s32 | xromat va dixromat, termik parchalanish hisobi, oksidlovchi-qaytaruvchi hisobi, oksid xarakteri, sifat reaksiyasi | 5 (Y1 2, O1 2, Y2 1) |
| g9-s33 | KMnO4 qaytarilishi, muhit va mahsulot, kislorod olish hisobi, xlor olish hisobi, massa ulushi | 5 (Y1 1, Y2 1, O1 3) |
| g9-s34 | gaz hajmi hisobi, siqib chiqarish hisobi, passivlanish, massa ulushi, minerallar tarkibi | 5 (O1 3, Y1 1, Y2 1) |
| g9-s35 | sifat reaksiyasi, temir ionlari reaksiyalari, cho‘kma massasi, termik parchalanish, oksidlanish-qaytarilish hisobi | 5 (Y1 1, Y2 1, O1 3) |
| g9-s36 | domna jarayoni, ruda hisobi, gaz hajmi hisobi, domna xomashyolari, cho‘yan va po‘lat, metallurgiya hisoblari | 6 (Y1 2, O1 2, Y2 1, O2 1) |
