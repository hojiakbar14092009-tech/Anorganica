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
