import { composeForecast, composeNotification } from "./compose.ts";
import type { ForecastContext } from "./context.ts";

/**
 * Builds natural English from the shared semantic context.
 * This is not a word-for-word translation of the Russian text.
 */
export class EnglishTextGenerator {
  /**
   * Returns title, sections and advice in English.
   */
  render(ctx: ForecastContext): {
    title: string;
    general: string;
    workAndFinance: string;
    loveAndRelationships: string;
    advice: string;
  } {
    return composeForecast(ctx, "en");
  }

  /**
   * Short local notification line.
   */
  notify(ctx: ForecastContext): string {
    return composeNotification(ctx, "en");
  }
}

export const englishTextGenerator = new EnglishTextGenerator();
