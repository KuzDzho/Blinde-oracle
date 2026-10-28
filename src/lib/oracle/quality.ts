import type { ForecastContext } from "./context.ts";
import type { AppLanguage } from "./i18n.ts";
import type { Forecast } from "./types.ts";
import { ZODIAC } from "./zodiac.ts";

const CYRILLIC = /[А-Яа-яЁё]/;
const NATAL_TERMS_RU = /\b(?:натальн\w*|асцендент\w*|десцендент\w*|\d{1,2}\s*дом(?:е|а|ом|у)?|первом доме|седьмом доме)\b/i;
const NATAL_TERMS_EN = /\b(?:natal chart|ascendant|descendant|\d{1,2}(?:st|nd|rd|th)? house|in the house)\b/i;
const CERTAINTY_RU = /\b(?:точно произойд[её]т|обязательно случится|гарантированно|неизбежно)\b/i;
const CERTAINTY_EN = /\b(?:will definitely happen|guaranteed to happen|certain to happen|inevitably)\b/i;

function textOf(forecast: Forecast): string {
  return [forecast.title, forecast.general].filter(Boolean).join(" ").trim();
}

export function inspectForecastQuality(
  forecast: Forecast,
  ctx: ForecastContext,
  language: AppLanguage,
): string[] {
  const issues: string[] = [];
  const text = textOf(forecast);
  const narrative = forecast.general.trim();
  if (!forecast.title.trim()) issues.push("empty-title");
  if (!narrative) issues.push("empty-horoscope");
  if (forecast.sign !== ctx.sign) issues.push("sign-mismatch");
  if (
    forecast.date.year !== ctx.date.year ||
    forecast.date.month !== ctx.date.month ||
    forecast.date.day !== ctx.date.day
  ) issues.push("date-mismatch");

  const meta = ZODIAC[ctx.sign];
  const signNames = language === "en" ? [meta.nameEn] : [meta.nameRu, meta.dative, meta.genitive];
  if (!signNames.some((name) => text.includes(name))) issues.push("missing-sign");

  if (language === "ru") {
    if (!CYRILLIC.test(text)) issues.push("russian-missing-cyrillic");
    if (/\b(?:the|today|your|with|from|mercury|venus|mars|jupiter|saturn|house)\b/i.test(text)) issues.push("english-in-russian");
    if (NATAL_TERMS_RU.test(narrative)) issues.push("natal-chart-reference");
    if (!/^Один из возможных сценариев\b/i.test(narrative)) issues.push("missing-possibility-framing");
    if (!/\bЕсли это окажется актуальным\b/i.test(narrative)) issues.push("missing-conditional-framing");
    if (CERTAINTY_RU.test(narrative)) issues.push("unsupported-certainty");
  } else {
    if (CYRILLIC.test(text)) issues.push("russian-in-english");
    if (NATAL_TERMS_EN.test(narrative)) issues.push("natal-chart-reference");
    if (!/^One possible scenario\b/i.test(narrative)) issues.push("missing-possibility-framing");
    if (!/\bIf this feels relevant\b/i.test(narrative)) issues.push("missing-conditional-framing");
    if (CERTAINTY_EN.test(narrative)) issues.push("unsupported-certainty");
  }

  const sentences = narrative.split(/(?<=[.!?…])\s+/).filter(Boolean);
  if (sentences.length < 3) issues.push("too-short");
  if (sentences.some((part) => part.trim().split(/\s+/).length < 4)) issues.push("sentence-fragment");

  const normalized = sentences.map((part) => part.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, "").trim());
  if (new Set(normalized).size !== normalized.length) issues.push("duplicate-sentence");
  if (language === "ru" && /\bретроград\w*\b/i.test(narrative)) issues.push("technical-astrology-jargon");

  return issues;
}

export function isForecastSound(forecast: Forecast, ctx: ForecastContext, language: AppLanguage): boolean {
  return inspectForecastQuality(forecast, ctx, language).length === 0;
}
