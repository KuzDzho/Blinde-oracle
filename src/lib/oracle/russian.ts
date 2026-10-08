import { composeForecast, composeNotification } from "./compose.ts";
import type { ForecastContext } from "./context.ts";

/**
 * Собирает естественный русский текст по готовому смысловому контексту.
 * Новых событий не добавляет.
 */
export class RussianTextGenerator {
  /**
   * Возвращает заголовок, разделы и совет на русском языке.
   */
  render(ctx: ForecastContext): {
    title: string;
    general: string;
    workAndFinance: string;
    loveAndRelationships: string;
    advice: string;
  } {
    return composeForecast(ctx, "ru");
  }

  /**
   * Короткая фраза для локального уведомления.
   */
  notify(ctx: ForecastContext): string {
    return composeNotification(ctx, "ru");
  }
}

export const russianTextGenerator = new RussianTextGenerator();
