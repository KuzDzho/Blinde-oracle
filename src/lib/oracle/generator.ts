import type { Forecast } from "./types.ts";
import type { ForecastContext } from "./context.ts";
import { getForecastContext } from "./context.ts";
import type { LocalDate } from "./dates.ts";
import { englishTextGenerator } from "./english.ts";
import type { AppLanguage } from "./i18n.ts";
import { inspectForecastQuality } from "./quality.ts";
import { russianTextGenerator } from "./russian.ts";
import { ZODIAC_ORDER, type ZodiacSign } from "./zodiac.ts";

function qualityIssues(forecast: Forecast, ctx: ForecastContext, language: AppLanguage): string[] {
  return inspectForecastQuality(forecast, ctx, language);
}

function renderLanguage(ctx: ForecastContext, language: AppLanguage) {
  return language === "en"
    ? englishTextGenerator.render(ctx)
    : russianTextGenerator.render(ctx);
}

/**
 * Алгоритмический генератор псевдоастрологических прогнозов.
 *
 * Сначала строится единый `ForecastContext`, затем русский и английский
 * генераторы независимо собирают естественный текст с тем же смыслом.
 * Работает полностью локально, без сети и без готовой базы гороскопов.
 */
export class TextGeneratorEngine {
  /**
   * Возвращает смысловой контекст для знака и даты.
   */
  getContext(sign: ZodiacSign, date: LocalDate): ForecastContext {
    return getForecastContext(sign, date);
  }

  /**
   * Строит прогноз для знака на заданную календарную дату и язык.
   * Переключение языка не меняет смысл: меняется только формулировка.
   */
  generateForecast(
    sign: ZodiacSign,
    date: LocalDate,
    language: AppLanguage = "ru",
  ): Forecast {
    const ctx = this.getContext(sign, date);
    const rendered = renderLanguage(ctx, language);
    const forecast: Forecast = {
      sign,
      date,
      ...rendered,
    };
    const issues = qualityIssues(forecast, ctx, language);
    if (issues.length > 0) {
      throw new Error(`Forecast quality check failed for ${sign} on ${date.year}-${date.month}-${date.day}: ${issues.join(", ")}`);
    }
    return forecast;
  }

  /**
   * Строит короткую фразу для ежедневного уведомления.
   */
  generateNotificationText(
    sign: ZodiacSign,
    date: LocalDate,
    language: AppLanguage = "ru",
  ): string {
    const ctx = this.getContext(sign, date);
    return language === "en"
      ? englishTextGenerator.notify(ctx)
      : russianTextGenerator.notify(ctx);
  }

  /**
   * Генерирует все двенадцать прогнозов на одну дату.
   */
  generateAll(date: LocalDate, language: AppLanguage = "ru"): Forecast[] {
    return ZODIAC_ORDER.map((sign) => this.generateForecast(sign, date, language));
  }
}

/** Общий экземпляр генератора для приложения. */
export const textGeneratorEngine = new TextGeneratorEngine();

/**
 * Строит прогноз для знака на заданную календарную дату.
 */
export function generateForecast(
  sign: ZodiacSign,
  date: LocalDate,
  language: AppLanguage = "ru",
): Forecast {
  return textGeneratorEngine.generateForecast(sign, date, language);
}

/**
 * Строит короткую фразу для ежедневного уведомления.
 */
export function generateNotificationText(
  sign: ZodiacSign,
  date: LocalDate,
  language: AppLanguage = "ru",
): string {
  return textGeneratorEngine.generateNotificationText(sign, date, language);
}

export type { Forecast } from "./types.ts";
export type { ForecastContext } from "./context.ts";
export { getForecastContext, contextCoreKey, buildDayContexts } from "./context.ts";
