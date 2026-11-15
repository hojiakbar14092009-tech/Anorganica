// Industrial/natural process flows. Equations are the same as in the lesson data and are balance-checked in tests/visuals.test.ts.
import type { ProcessSpec } from './ProcessFlow';

export const CONTACT_PROCESS: ProcessSpec = {
  title: 'Sulfat kislota ishlab chiqarish (kontakt usuli)',
  steps: [
    { place: 'Kuydirish pechi', name: 'Pirit kuydiriladi', equation: '4FeS2 + 11O2 → 2Fe2O3 + 8SO2', conditions: 'qaynovchi qatlam, havo mo‘l', note: 'Mayda pirit va qarshi oqimdagi havo — aloqa sirti katta, reaksiya tez. Qattiq qoldiq Fe₂O₃ (kuyundi).' },
    { place: 'Siklon, elektrofiltr, quritish minorasi', name: 'Gaz tozalanadi va quritiladi', note: 'Chang va suv bug‘i katalizatorni zaharlaydi, shuning uchun SO₂ tozalanadi; quritgich — konsentrlangan H₂SO₄. Kimyoviy o‘zgarish yo‘q.' },
    { place: 'Issiqlik almashtirgich → kontakt apparati', name: 'SO₂ oksidlanadi', equation: '2SO2 + O2 ⇄ 2SO3', conditions: 'V₂O₅, 400–450 °C, ekzotermik', note: 'Qaytar ekzotermik reaksiya: past harorat unumni oshiradi, katalizator tezlikni. Ajralgan issiqlik kirayotgan gazni isitadi.' },
    { place: 'Yuttirish minorasi', name: 'SO₃ yuttiriladi', equation: 'H2SO4 + SO3 → H2SO4·SO3', conditions: '98 % li H₂SO₄', note: 'SO₃ suvga emas, konsentrlangan kislotaga yuttiriladi — aks holda kislota tumani hosil bo‘ladi. Mahsulot — oleum.' },
  ],
  explanation: 'Oltingugurt piritdagi −1 oksidlanish darajasidan SO₂ da +4 ga, SO₃ da +6 ga oksidlanadi. Har bosqichda tezlik (maydalash, kislorod, katalizator) va muvozanat (harorat) omillari §33–34 dagi qoidalarga muvofiq tanlangan.',
};

export const NITRIC_ACID: ProcessSpec = {
  title: 'Nitrat kislota ishlab chiqarish (ammiakdan)',
  steps: [
    { place: 'Kontakt apparati', name: 'Ammiak katalitik oksidlanadi', equation: '4NH3 + 5O2 → 4NO + 6H2O', conditions: 'Pt–Rh to‘ri, yuqori harorat', note: 'Katalizatorsiz ammiak N₂ gacha yonadi; katalizator NO hosil bo‘lishini ta’minlaydi.' },
    { place: 'Oksidlash minorasi', name: 'NO oksidlanadi', equation: '2NO + O2 → 2NO2', conditions: 'sovutilgan gaz, havo', note: 'Rangsiz NO qo‘ng‘ir NO₂ ga aylanadi.' },
    { place: 'Yuttirish minorasi', name: 'NO₂ suv va kislorodga yuttiriladi', equation: '4NO2 + 2H2O + O2 → 4HNO3', conditions: 'qarshi oqim', note: 'Kislorod ishtirokida azot to‘liq +5 holatga o‘tadi va faqat nitrat kislota hosil bo‘ladi.' },
  ],
  explanation: 'Azot −3 (NH₃) → +2 (NO) → +4 (NO₂) → +5 (HNO₃) oksidlanadi; oksidlovchi — havo kislorodi.',
};

export const RUSTING: ProcessSpec = {
  title: 'Temirning zanglashi (nam havoda, elektrokimyoviy korroziya)',
  steps: [
    { place: 'Anod qism (temir sirti)', name: 'Temir oksidlanadi', equation: 'Fe → Fe^2+ + 2e^-', note: 'Temir atomlari elektron berib, ion holida suv tomchisiga o‘tadi.' },
    { place: 'Katod qism (tomchi cheti, O₂ ko‘p joy)', name: 'Kislorod qaytariladi', equation: 'O2 + 2H2O + 4e^- → 4OH^-', conditions: 'neytral muhit', note: 'Elektronlar metall orqali katod qismga oqadi; u yerda erigan kislorod qaytariladi.' },
    { place: 'Tomchi ichi', name: 'Temir(II) gidroksid hosil bo‘ladi', equation: '2Fe + O2 + 2H2O → 2Fe(OH)2', note: 'Fe²⁺ va OH⁻ ionlari uchrashib, oq, havoda tez yashillanadigan cho‘kma beradi.' },
    { place: 'Havo bilan aloqa', name: 'Zang hosil bo‘ladi', equation: '4Fe(OH)2 + O2 + 2H2O → 4Fe(OH)3', note: 'Fe(II) havoda Fe(III) gacha oksidlanadi. Haqiqiy zang — gidratlangan Fe₂O₃ (Fe₂O₃·nH₂O); Fe(OH)₃ soddalashtirilgan yozuv.' },
  ],
  explanation: 'Korroziya — elektrokimyoviy jarayon: anod va katod qismlar bitta temir bo‘lagida, elektrolit — suv tomchisi. Suv yoki kislorod bo‘lmasa, zanglash deyarli to‘xtaydi; tuzli suv elektrolitni kuchaytirib, jarayonni tezlashtiradi.',
};

export const SOLVAY: ProcessSpec = {
  title: 'Soda ishlab chiqarish (Solve usuli)',
  steps: [
    { place: 'Ohak pechi', name: 'Ohaktosh kuydiriladi', equation: 'CaCO3 → CaO + CO2', conditions: 'yuqori harorat', note: 'CO₂ karbonlash kolonnasiga, CaO ammiakni qayta tiklashga yuboriladi.' },
    { place: 'Karbonlash kolonnasi', name: 'NaHCO₃ cho‘kmaga tushadi', equation: 'NaCl + NH3 + CO2 + H2O → NaHCO3 + NH4Cl', conditions: 'sovuq, to‘yingan NaCl eritmasi', note: 'NaHCO₃ sovuq eritmada kam eriydi va cho‘kadi — usulning asosiy g‘oyasi shu.' },
    { place: 'Kalsinatsiya pechi', name: 'Soda hosil bo‘ladi', equation: '2NaHCO3 → Na2CO3 + CO2 + H2O', conditions: 'qizdirish', note: 'Ajralgan CO₂ yana kolonnaga qaytariladi.' },
    { place: 'Regeneratsiya', name: 'Ammiak qayta tiklanadi', equation: '2NH4Cl + Ca(OH)2 → 2NH3 + CaCl2 + 2H2O', conditions: 'qizdirish', note: 'Ammiak sarflanmaydi, aylanib yuradi; chiqindi — CaCl₂.' },
  ],
  explanation: 'Barcha bosqichlar yig‘indisi: 2NaCl + CaCO₃ → Na₂CO₃ + CaCl₂. Bu reaksiya bevosita bormaydi; ammiak va CO₂ ning aylanishi orqali amalga oshadi.',
};

export const BLAST_FURNACE: ProcessSpec = {
  title: 'Domna pechida cho‘yan olish (yuqoridan pastga)',
  steps: [
    { place: 'Pech og‘zi, ≈ 500–700 °C', name: 'Shixta quriydi', equation: 'Fe2O3·H2O → Fe2O3 + H2O', note: 'Ruda, koks va flyus (ohaktosh) yuqoridan solinadi; issiq gazlar pastdan ko‘tariladi (qarshi oqim).' },
    { place: 'Shaxta, ≈ 450–800 °C', name: 'Oksidlar bosqichma-bosqich qaytariladi', equation: '3Fe2O3 + CO → 2Fe3O4 + CO2', conditions: 'so‘ng Fe₃O₄ → FeO → Fe', note: 'Qaytaruvchi — CO. Temir Fe₂O₃ → Fe₃O₄ → FeO → Fe tartibida qaytariladi.' },
    { place: 'Shaxta pastki qismi', name: 'Temir hosil bo‘ladi', equation: 'FeO + CO → Fe + CO2', conditions: '700–800 °C', note: 'Hosil bo‘lgan temir uglerodni eritib oladi — cho‘yan (C > 2,14 %).' },
    { place: 'Raspar', name: 'Shlak hosil bo‘ladi', equation: 'CaO + SiO2 → CaSiO3', conditions: 'yuqori harorat', note: 'Flyus (CaCO₃ → CaO) bekorchi jins SiO₂ ni suyuq shlakka bog‘laydi; shlak cho‘yandan yengil va ustida suzadi.' },
    { place: 'Furmalar (havo purkash)', name: 'Koks yonadi va CO hosil bo‘ladi', equation: 'C + O2 → CO2', conditions: 'so‘ng CO₂ + C → 2CO', note: 'Bu zona eng issiq; hosil bo‘lgan CO yuqoriga ko‘tarilib qaytaruvchi vazifasini bajaradi.' },
  ],
  explanation: 'Umumiy tenglama: Fe₂O₃ + 3CO → 2Fe + 3CO₂. Qattiq shixta pastga tushadi, CO yuqoriga ko‘tariladi — qarshi oqim issiqlik va qaytaruvchidan to‘liq foydalanishga imkon beradi. Suyuq cho‘yan va shlak pech tubidan alohida chiqariladi.',
};

export const AMPHOTERIC_AL: ProcessSpec = {
  title: 'Aluminiy gidroksidning amfoterligi (virtual tajriba)',
  steps: [
    { place: 'Probirka: AlCl₃ eritmasi', name: 'Ishqor tomchilatiladi — cho‘kma', equation: 'Al^3+ + 3OH^- → Al(OH)3↓', note: 'Oq, quyqasimon Al(OH)₃ cho‘kmasi hosil bo‘ladi.' },
    { place: 'Cho‘kmaning bir qismi + kislota', name: 'Asos sifatida: kislotada eriydi', equation: 'Al(OH)3 + 3HCl → AlCl3 + 3H2O', note: 'Cho‘kma eriydi — Al(OH)₃ kislotani neytrallaydi.' },
    { place: 'Cho‘kmaning bir qismi + mo‘l ishqor', name: 'Kislota sifatida: ishqorda eriydi', equation: 'Al(OH)3 + NaOH → Na[Al(OH)4]', note: 'Cho‘kma yana eriydi — gidroksokompleks (tetragidroksoaluminat) hosil bo‘ladi.' },
    { place: 'Xulosa', name: 'Amfoter gidroksid', note: 'Bitta modda ham kislotalar, ham ishqorlar bilan tuz hosil qiladi. Shuning uchun AlCl₃ ga ishqorni ehtiyotkorlik bilan, ortiqcha qo‘shmasdan quyiladi.' },
  ],
  explanation: 'Al(OH)₃ ham H⁺ ni, ham OH⁻ ni bog‘lay oladi. Bu xossa Zn(OH)₂, Cr(OH)₃ uchun ham xos (§30, §32). Laboratoriyada ishqorlar ko‘zni va terini kuydiradi — bu yerda faqat virtual namoyish.',
};

export const CHROMIUM_COLOURS: ProcessSpec = {
  title: 'Xrom birikmalari: oksidlanish darajasi va rang',
  steps: [
    { place: 'Cr(+3) tuzi eritmasi', name: 'Ishqor bilan kul-yashil cho‘kma', equation: 'Cr^3+ + 3OH^- → Cr(OH)3↓', note: 'Cr(OH)₃ — amfoter: kislotada ham, mo‘l ishqorda ham (yashil eritma) eriydi.' },
    { place: 'Xromat (+6), sariq', name: 'Kislota qo‘shilsa — dixromat, zarg‘aldoq', equation: '2CrO4^2- + 2H^+ ⇄ Cr2O7^2- + H2O', note: 'Oksidlanish darajasi o‘zgarmaydi (+6); muvozanat kislotada o‘ngga (zarg‘aldoq), ishqorda chapga (sariq) siljiydi.' },
    { place: 'Dixromat + qaytaruvchi (kislotali muhit)', name: 'Cr(+6) → Cr(+3): zarg‘aldoqdan yashilga', equation: 'Cr2O7^2- + 14H^+ + 6e^- → 2Cr^3+ + 7H2O', note: 'K₂Cr₂O₇ kuchli oksidlovchi: masalan, FeSO₄ ni Fe(III) gacha oksidlaydi va o‘zi yashil Cr³⁺ ga qaytariladi.' },
  ],
  explanation: 'Rang oksidlanish darajasi va zarrachaning tuzilishiga bog‘liq: Cr³⁺ birikmalari — yashil/kulrang-yashil, CrO₄²⁻ — sariq, Cr₂O₇²⁻ — zarg‘aldoq. Cr(VI) birikmalari zaharli va kanserogen — faqat virtual namoyish.',
};

export const PERMANGANATE_MEDIA: ProcessSpec = {
  title: 'KMnO₄ ning qaytarilishi muhitga bog‘liq (K₂SO₃ bilan, virtual tajriba)',
  steps: [
    { place: 'Kislotali muhit (H₂SO₄)', name: 'Binafsha rang yo‘qoladi', equation: 'MnO4^- + 8H^+ + 5e^- → Mn^2+ + 4H2O', note: 'Mn(+7) → Mn(+2): deyarli rangsiz eritma. Eng kuchli oksidlovchi xossa shu muhitda.' },
    { place: 'Neytral muhit', name: 'Qo‘ng‘ir cho‘kma tushadi', equation: 'MnO4^- + 2H2O + 3e^- → MnO2↓ + 4OH^-', note: 'Mn(+7) → Mn(+4): qo‘ng‘ir MnO₂ cho‘kmasi.' },
    { place: 'Ishqoriy muhit (KOH)', name: 'Eritma yashil tusga kiradi', equation: 'MnO4^- + e^- → MnO4^2-', note: 'Mn(+7) → Mn(+6): yashil manganat-ion.' },
  ],
  explanation: 'Bir xil oksidlovchi (MnO₄⁻) muhitga qarab turli miqdorda elektron qabul qiladi: kislotada 5, neytral muhitda 3, ishqorda 1. Shuning uchun redoks tenglamalarida muhitni albatta hisobga olish kerak.',
};

export const IRON_TESTS: ProcessSpec = {
  title: 'Fe²⁺ va Fe³⁺ ionlarini aniqlash (virtual tajriba)',
  steps: [
    { place: 'Fe²⁺ + ishqor', name: 'Oq cho‘kma, havoda yashillanib qo‘ng‘irlashadi', equation: 'Fe^2+ + 2OH^- → Fe(OH)2↓', note: 'Fe(OH)₂ havoda tez oksidlanadi: 4Fe(OH)₂ + O₂ + 2H₂O → 4Fe(OH)₃.' },
    { place: 'Fe³⁺ + ishqor', name: 'Qizil-qo‘ng‘ir cho‘kma', equation: 'Fe^3+ + 3OH^- → Fe(OH)3↓', note: 'Rangi darhol qizil-qo‘ng‘ir — Fe(II) dan farqi shu.' },
    { place: 'Fe²⁺ + qizil qon tuzi K₃[Fe(CN)₆]', name: 'To‘q ko‘k cho‘kma', equation: 'FeCl2 + K3[Fe(CN)6] → KFe[Fe(CN)6]↓ + 2KCl', note: 'Fe²⁺ ga xos reaksiya.' },
    { place: 'Fe³⁺ + tiotsianat KSCN', name: 'Qon-qizil eritma', equation: 'FeCl3 + 3KSCN → Fe(SCN)3 + 3KCl', note: 'Fe³⁺ ga xos, juda sezgir reaksiya.' },
  ],
  explanation: 'Ishqor bilan cho‘kma rangi (oq → yashil → qo‘ng‘ir yoki darhol qizil-qo‘ng‘ir) temirning oksidlanish darajasini ko‘rsatadi; aniq tasdiqlash uchun K₃[Fe(CN)₆] (Fe²⁺) va KSCN (Fe³⁺) ishlatiladi. Turnbul ko‘ki va berlin lazuri aslida bir xil modda — KFe[Fe(CN)₆].',
};

export const WATER_SOFTENING: ProcessSpec = {
  title: 'Suvning qattiqligini yo‘qotish usullari',
  steps: [
    { place: 'Vaqtinchalik qattiqlik', name: 'Qaynatish', equation: 'Ca(HCO3)2 → CaCO3↓ + H2O + CO2↑', conditions: 'qaynatish', note: 'Gidrokarbonatlar parchalanib, CaCO₃ cho‘kadi — choynakdagi quyqa shu.' },
    { place: 'Vaqtinchalik qattiqlik', name: 'So‘ndirilgan ohak qo‘shish', equation: 'Ca(HCO3)2 + Ca(OH)2 → 2CaCO3↓ + 2H2O', note: 'Ohak gidrokarbonatni karbonatga aylantiradi. Ortiqcha ohak suvni yana qattiq qiladi — miqdori hisoblanadi.' },
    { place: 'Doimiy qattiqlik', name: 'Soda qo‘shish', equation: 'CaSO4 + Na2CO3 → CaCO3↓ + Na2SO4', note: 'Sulfat va xloridlar qaynatishda yo‘qolmaydi; Ca²⁺ ni karbonat bilan cho‘ktirish kerak.' },
    { place: 'Har ikkala qattiqlik', name: 'Kationitli kolonka', equation: 'Na2R + Ca^2+ → CaR + 2Na^+', conditions: 'R — ionit qoldig‘i', note: 'Ionit Ca²⁺/Mg²⁺ ni ushlab, o‘rniga Na⁺ beradi; NaCl eritmasi bilan qayta tiklanadi.' },
  ],
  explanation: 'Qattiqlikni Ca²⁺ va Mg²⁺ ionlari beradi. Vaqtinchalik (gidrokarbonatli) qattiqlik qaynatishda yo‘qoladi; doimiy (sulfat, xloridli) qattiqlik uchun ionlarni cho‘ktirish yoki ion almashinish kerak.',
};
