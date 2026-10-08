/**
 * Двенадцать знаков зодиака с стихией, модальностью и характерным акцентом.
 */
export const ZodiacSign = {
  ARIES: "ARIES",
  TAURUS: "TAURUS",
  GEMINI: "GEMINI",
  CANCER: "CANCER",
  LEO: "LEO",
  VIRGO: "VIRGO",
  LIBRA: "LIBRA",
  SCORPIO: "SCORPIO",
  SAGITTARIUS: "SAGITTARIUS",
  CAPRICORN: "CAPRICORN",
  AQUARIUS: "AQUARIUS",
  PISCES: "PISCES",
} as const;

export type ZodiacSign = (typeof ZodiacSign)[keyof typeof ZodiacSign];

export type Element = "FIRE" | "EARTH" | "AIR" | "WATER";
export type Modality = "CARDINAL" | "FIXED" | "MUTABLE";

/**
 * Справочные данные знака, нужные генератору и интерфейсу.
 */
export interface ZodiacMeta {
  id: ZodiacSign;
  nameRu: string;
  nameEn: string;
  genitive: string;
  dative: string;
  nature: string;
  element: Element;
  elementRu: string;
  elementEn: string;
  modality: Modality;
  modalityRu: string;
  accent: string;
  glyph: string;
  datesLabel: string;
  datesLabelEn: string;
}

const TEXT_VS = "\uFE0E";

/**
 * Знаки в астрологическом порядке, от Овна к Рыбам.
 */
export const ZODIAC_ORDER: readonly ZodiacSign[] = [
  ZodiacSign.ARIES,
  ZodiacSign.TAURUS,
  ZodiacSign.GEMINI,
  ZodiacSign.CANCER,
  ZodiacSign.LEO,
  ZodiacSign.VIRGO,
  ZodiacSign.LIBRA,
  ZodiacSign.SCORPIO,
  ZodiacSign.SAGITTARIUS,
  ZodiacSign.CAPRICORN,
  ZodiacSign.AQUARIUS,
  ZodiacSign.PISCES,
] as const;

/**
 * Полный справочник двенадцати знаков.
 */
export const ZODIAC: Record<ZodiacSign, ZodiacMeta> = {
  [ZodiacSign.ARIES]: {
    id: ZodiacSign.ARIES,
    nameRu: "Овен",
    nameEn: "Aries",
    genitive: "Овна",
    dative: "Овнам",
    nature: "Огненная природа Овна",
    element: "FIRE",
    elementRu: "Огонь",
    elementEn: "Fire",
    modality: "CARDINAL",
    modalityRu: "Кардинальный",
    accent: "действие и инициатива",
    glyph: `\u2648${TEXT_VS}`,
    datesLabel: "21 марта — 19 апреля",
    datesLabelEn: "March 21 — April 19",
  },
  [ZodiacSign.TAURUS]: {
    id: ZodiacSign.TAURUS,
    nameRu: "Телец",
    nameEn: "Taurus",
    genitive: "Тельца",
    dative: "Тельцам",
    nature: "Земная природа Тельца",
    element: "EARTH",
    elementRu: "Земля",
    elementEn: "Earth",
    modality: "FIXED",
    modalityRu: "Фиксированный",
    accent: "устойчивость и ресурсы",
    glyph: `\u2649${TEXT_VS}`,
    datesLabel: "20 апреля — 20 мая",
    datesLabelEn: "April 20 — May 20",
  },
  [ZodiacSign.GEMINI]: {
    id: ZodiacSign.GEMINI,
    nameRu: "Близнецы",
    nameEn: "Gemini",
    genitive: "Близнецов",
    dative: "Близнецам",
    nature: "Воздушная природа Близнецов",
    element: "AIR",
    elementRu: "Воздух",
    elementEn: "Air",
    modality: "MUTABLE",
    modalityRu: "Мутабельный",
    accent: "коммуникация и информация",
    glyph: `\u264A${TEXT_VS}`,
    datesLabel: "21 мая — 20 июня",
    datesLabelEn: "May 21 — June 20",
  },
  [ZodiacSign.CANCER]: {
    id: ZodiacSign.CANCER,
    nameRu: "Рак",
    nameEn: "Cancer",
    genitive: "Рака",
    dative: "Ракам",
    nature: "Водная природа Рака",
    element: "WATER",
    elementRu: "Вода",
    elementEn: "Water",
    modality: "CARDINAL",
    modalityRu: "Кардинальный",
    accent: "эмоции и безопасность",
    glyph: `\u264B${TEXT_VS}`,
    datesLabel: "21 июня — 22 июля",
    datesLabelEn: "June 21 — July 22",
  },
  [ZodiacSign.LEO]: {
    id: ZodiacSign.LEO,
    nameRu: "Лев",
    nameEn: "Leo",
    genitive: "Льва",
    dative: "Львам",
    nature: "Огненная природа Льва",
    element: "FIRE",
    elementRu: "Огонь",
    elementEn: "Fire",
    modality: "FIXED",
    modalityRu: "Фиксированный",
    accent: "самовыражение",
    glyph: `\u264C${TEXT_VS}`,
    datesLabel: "23 июля — 22 августа",
    datesLabelEn: "July 23 — August 22",
  },
  [ZodiacSign.VIRGO]: {
    id: ZodiacSign.VIRGO,
    nameRu: "Дева",
    nameEn: "Virgo",
    genitive: "Девы",
    dative: "Девам",
    nature: "Земная природа Девы",
    element: "EARTH",
    elementRu: "Земля",
    elementEn: "Earth",
    modality: "MUTABLE",
    modalityRu: "Мутабельный",
    accent: "анализ и порядок",
    glyph: `\u264D${TEXT_VS}`,
    datesLabel: "23 августа — 22 сентября",
    datesLabelEn: "August 23 — September 22",
  },
  [ZodiacSign.LIBRA]: {
    id: ZodiacSign.LIBRA,
    nameRu: "Весы",
    nameEn: "Libra",
    genitive: "Весов",
    dative: "Весам",
    nature: "Воздушная природа Весов",
    element: "AIR",
    elementRu: "Воздух",
    elementEn: "Air",
    modality: "CARDINAL",
    modalityRu: "Кардинальный",
    accent: "отношения и баланс",
    glyph: `\u264E${TEXT_VS}`,
    datesLabel: "23 сентября — 22 октября",
    datesLabelEn: "September 23 — October 22",
  },
  [ZodiacSign.SCORPIO]: {
    id: ZodiacSign.SCORPIO,
    nameRu: "Скорпион",
    nameEn: "Scorpio",
    genitive: "Скорпиона",
    dative: "Скорпионам",
    nature: "Водная природа Скорпиона",
    element: "WATER",
    elementRu: "Вода",
    elementEn: "Water",
    modality: "FIXED",
    modalityRu: "Фиксированный",
    accent: "трансформация",
    glyph: `\u264F${TEXT_VS}`,
    datesLabel: "23 октября — 21 ноября",
    datesLabelEn: "October 23 — November 21",
  },
  [ZodiacSign.SAGITTARIUS]: {
    id: ZodiacSign.SAGITTARIUS,
    nameRu: "Стрелец",
    nameEn: "Sagittarius",
    genitive: "Стрельца",
    dative: "Стрельцам",
    nature: "Огненная природа Стрельца",
    element: "FIRE",
    elementRu: "Огонь",
    elementEn: "Fire",
    modality: "MUTABLE",
    modalityRu: "Мутабельный",
    accent: "расширение возможностей",
    glyph: `\u2650${TEXT_VS}`,
    datesLabel: "22 ноября — 21 декабря",
    datesLabelEn: "November 22 — December 21",
  },
  [ZodiacSign.CAPRICORN]: {
    id: ZodiacSign.CAPRICORN,
    nameRu: "Козерог",
    nameEn: "Capricorn",
    genitive: "Козерога",
    dative: "Козерогам",
    nature: "Земная природа Козерога",
    element: "EARTH",
    elementRu: "Земля",
    elementEn: "Earth",
    modality: "CARDINAL",
    modalityRu: "Кардинальный",
    accent: "ответственность и цели",
    glyph: `\u2651${TEXT_VS}`,
    datesLabel: "22 декабря — 19 января",
    datesLabelEn: "December 22 — January 19",
  },
  [ZodiacSign.AQUARIUS]: {
    id: ZodiacSign.AQUARIUS,
    nameRu: "Водолей",
    nameEn: "Aquarius",
    genitive: "Водолея",
    dative: "Водолеям",
    nature: "Воздушная природа Водолея",
    element: "AIR",
    elementRu: "Воздух",
    elementEn: "Air",
    modality: "FIXED",
    modalityRu: "Фиксированный",
    accent: "идеи и перемены",
    glyph: `\u2652${TEXT_VS}`,
    datesLabel: "20 января — 18 февраля",
    datesLabelEn: "January 20 — February 18",
  },
  [ZodiacSign.PISCES]: {
    id: ZodiacSign.PISCES,
    nameRu: "Рыбы",
    nameEn: "Pisces",
    genitive: "Рыб",
    dative: "Рыбам",
    nature: "Водная природа Рыб",
    element: "WATER",
    elementRu: "Вода",
    elementEn: "Water",
    modality: "MUTABLE",
    modalityRu: "Мутабельный",
    accent: "интуиция и внутренний мир",
    glyph: `\u2653${TEXT_VS}`,
    datesLabel: "19 февраля — 20 марта",
    datesLabelEn: "February 19 — March 20",
  },
};

/**
 * Соседний знак по кругу зодиака. `delta` = 1 — следующий, −1 — предыдущий.
 */
export function adjacentSign(sign: ZodiacSign, delta: number): ZodiacSign {
  const index = ZODIAC_ORDER.indexOf(sign);
  const next = (index + delta + ZODIAC_ORDER.length) % ZODIAC_ORDER.length;
  return ZODIAC_ORDER[next] ?? sign;
}

/**
 * Разбирает строку маршрута в знак. Неизвестный код даёт `null`.
 */
export function parseZodiacSign(value: string): ZodiacSign | null {
  const upper = value.trim().toUpperCase();
  return (ZODIAC_ORDER as readonly string[]).includes(upper)
    ? (upper as ZodiacSign)
    : null;
}

/**
 * Имя знака на выбранном языке.
 */
export function signName(sign: ZodiacSign, language: "ru" | "en"): string {
  return language === "en" ? ZODIAC[sign].nameEn : ZODIAC[sign].nameRu;
}
