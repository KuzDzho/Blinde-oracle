/**
 * Календарная дата без часового пояса.
 * Используется генератором, чтобы один и тот же день давал один прогноз
 * на Android, iOS и в браузере.
 */
export interface LocalDate {
  year: number;
  month: number;
  day: number;
}

const MONTHS_RU = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
] as const;

const MONTHS_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const WEEKDAYS_SHORT_RU = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"] as const;
const WEEKDAYS_SHORT_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

/**
 * Превращает дату в строку `YYYY-MM-DD`.
 */
export function toISODate(date: LocalDate): string {
  const month = String(date.month).padStart(2, "0");
  const day = String(date.day).padStart(2, "0");
  return `${date.year}-${month}-${day}`;
}

/**
 * Читает `YYYY-MM-DD`. Возвращает `null`, если строка не является реальной датой.
 */
export function parseISODate(value: string): LocalDate | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const utc = new Date(Date.UTC(year, month - 1, day));
  if (
    utc.getUTCFullYear() !== year ||
    utc.getUTCMonth() !== month - 1 ||
    utc.getUTCDate() !== day
  ) {
    return null;
  }
  return { year, month, day };
}

/**
 * Сегодняшняя дата в локальном календаре устройства.
 */
export function todayLocal(): LocalDate {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  };
}

/**
 * Сдвигает календарную дату на целое число дней.
 */
export function addDays(date: LocalDate, delta: number): LocalDate {
  const utc = new Date(Date.UTC(date.year, date.month - 1, date.day + delta));
  return {
    year: utc.getUTCFullYear(),
    month: utc.getUTCMonth() + 1,
    day: utc.getUTCDate(),
  };
}

/**
 * Сегодня и шесть предыдущих дней, от старого к новому.
 */
export function lastSevenDays(today: LocalDate): LocalDate[] {
  return Array.from({ length: 7 }, (_, index) => addDays(today, index - 6));
}

/**
 * Формат вроде «22 августа 2026».
 */
export function formatDateRu(date: LocalDate): string {
  return `${date.day} ${MONTHS_RU[date.month - 1]} ${date.year}`;
}

/**
 * Format like “August 22, 2026”.
 */
export function formatDateEn(date: LocalDate): string {
  return `${MONTHS_EN[date.month - 1]} ${date.day}, ${date.year}`;
}

/**
 * Дата на выбранном языке.
 */
export function formatDate(date: LocalDate, language: "ru" | "en"): string {
  return language === "en" ? formatDateEn(date) : formatDateRu(date);
}

/**
 * Короткий день недели: «пт».
 */
export function weekdayShortRu(date: LocalDate): string {
  const utc = new Date(Date.UTC(date.year, date.month - 1, date.day));
  return WEEKDAYS_SHORT_RU[utc.getUTCDay()] ?? "";
}

/**
 * Short weekday: “Fri”.
 */
export function weekdayShortEn(date: LocalDate): string {
  const utc = new Date(Date.UTC(date.year, date.month - 1, date.day));
  return WEEKDAYS_SHORT_EN[utc.getUTCDay()] ?? "";
}

/**
 * Короткий день недели на выбранном языке.
 */
export function weekdayShort(date: LocalDate, language: "ru" | "en"): string {
  return language === "en" ? weekdayShortEn(date) : weekdayShortRu(date);
}

/**
 * Сравнивает две календарные даты.
 */
export function datesEqual(a: LocalDate, b: LocalDate): boolean {
  return a.year === b.year && a.month === b.month && a.day === b.day;
}

/**
 * Порядковый номер дня от фиксированной эпохи.
 */
export function dayNumber(date: LocalDate): number {
  const utc = Date.UTC(date.year, date.month - 1, date.day);
  const epoch = Date.UTC(2020, 0, 1);
  return Math.round((utc - epoch) / 86400000);
}
