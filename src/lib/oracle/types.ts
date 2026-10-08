import type { LocalDate } from "./dates.ts";
import type { ZodiacSign } from "./zodiac.ts";

/**
 * Готовый прогноз на конкретный знак и календарный день.
 */
export interface Forecast {
  sign: ZodiacSign;
  date: LocalDate;
  title: string;
  general: string;
  workAndFinance: string;
  loveAndRelationships: string;
  advice: string;
}
