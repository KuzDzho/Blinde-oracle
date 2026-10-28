import { TITLES } from "./catalog.ts";
import type { ForecastContext } from "./context.ts";
import type { AppLanguage } from "./i18n.ts";
import { MOODS, itemById } from "./semantics.ts";
import { ZODIAC } from "./zodiac.ts";

function pickLang(text: { ru: string; en: string }, language: AppLanguage): string {
  return language === "en" ? text.en : text.ru;
}

function sentence(text: string): string {
  const clean = text.trim();
  if (!clean) return "";
  return /[.!?…]$/.test(clean) ? clean : clean + ".";
}

function titleOf(ctx: ForecastContext, language: AppLanguage): string {
  const title = TITLES.find((item) => item.id === ctx.titleId) ?? TITLES[0]!;
  return pickLang(title, language);
}

/**
 * A compact, single-piece daily horoscope. It avoids natal-chart language,
 * house placements and separate work/love/finance/advice sections.
 */
export function composeForecast(
  ctx: ForecastContext,
  language: AppLanguage,
): {
  title: string;
  general: string;
  workAndFinance: string;
  loveAndRelationships: string;
  advice: string;
} {
  const mood = itemById(MOODS, ctx.moodId);
  const meta = ZODIAC[ctx.sign];
  const opening = language === "en"
    ? meta.nameEn + ": " + pickLang(mood.open, language)
    : meta.dative + " " + pickLang(mood.open, language);

  // These three sentences share one daily situation and one practical takeaway.
  const narrative = [
    sentence(opening),
    sentence(pickLang(mood.setting, language)),
    sentence(pickLang(mood.coda, language)),
  ].filter(Boolean).join(" ");

  return {
    title: titleOf(ctx, language),
    general: narrative,
    // Retained only for compatibility with existing internal callers.
    workAndFinance: "",
    loveAndRelationships: "",
    advice: "",
  };
}

export function composeNotification(ctx: ForecastContext, language: AppLanguage): string {
  const mood = itemById(MOODS, ctx.moodId);
  const meta = ZODIAC[ctx.sign];
  const line = pickLang(mood.notify, language);
  return language === "en" ? meta.nameEn + ": " + line : meta.nameRu + ": " + line;
}
