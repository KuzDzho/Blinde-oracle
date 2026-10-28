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

function lowerFirst(text: string): string {
  return text.length ? text[0]!.toLocaleLowerCase() + text.slice(1) : text;
}

function titleOf(ctx: ForecastContext, language: AppLanguage): string {
  const title = TITLES.find((item) => item.id === ctx.titleId) ?? TITLES[0]!;
  return pickLang(title, language);
}

/**
 * A compact daily horoscope written as a possibility, not a guaranteed event.
 * It does not expose natal-chart data, houses or technical astrology terminology.
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
    ? "For " + meta.nameEn + ", one possible scenario today is that they " + lowerFirst(mood.open)
    : "У " + meta.genitive + " сегодня может возникнуть ситуация, когда " + lowerFirst(mood.open);

  const continuation = language === "en"
    ? "If this feels relevant, " + lowerFirst(mood.setting)
    : "Если это окажется актуальным, " + lowerFirst(mood.setting);

  const narrative = [
    sentence(opening),
    sentence(continuation),
    sentence(pickLang(mood.coda, language)),
  ].filter(Boolean).join(" ");

  return {
    title: titleOf(ctx, language),
    general: narrative,
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
