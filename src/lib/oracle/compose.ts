import type { ForecastContext } from "./context.ts";
import type { AppLanguage } from "./i18n.ts";
import { ADVICE_ITEMS, LOVE_EVENTS, MOODS, WORK_EVENTS, itemById } from "./semantics.ts";
import { ZODIAC } from "./zodiac.ts";

function pickLang(text: { ru: string; en: string }, language: AppLanguage): string {
  return language === "en" ? text.en : text.ru;
}

function sentence(text: string): string {
  const clean = text.trim();
  if (!clean) return "";
  return /[.!?…]$/.test(clean) ? clean : `${clean}.`;
}

function join(parts: readonly string[]): string {
  return parts.map(sentence).filter(Boolean).join(" ");
}

function titleOf(ctx: ForecastContext, language: AppLanguage): string {
  const titles: Record<string, { ru: string; en: string }> = {
    calm: { ru: "Спокойный ритм", en: "A Steady Pace" },
    focus: { ru: "Главное — ясность", en: "Keep It Clear" },
    change: { ru: "Место для нового", en: "Room for Change" },
    balance: { ru: "Без лишней спешки", en: "No Need to Rush" },
  };
  const fallback = language === "en" ? "Your Day" : "Ваш день";
  return titles[ctx.titleId] ? pickLang(titles[ctx.titleId]!, language) : fallback;
}

/**
 * One continuous daily horoscope. No natal chart, houses, ascendant or topic blocks
 * are presented to the reader. Text is generated locally and deterministically.
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
  const work = itemById(WORK_EVENTS, ctx.workId);
  const love = itemById(LOVE_EVENTS, ctx.loveId);
  const advice = itemById(ADVICE_ITEMS, ctx.adviceId);
  const meta = ZODIAC[ctx.sign];

  const opening = language === "en"
    ? `${meta.nameEn}: ${pickLang(mood.open, language)}`
    : `${meta.dative} ${pickLang(mood.open, language)}`;

  // Keep a single readable narrative rather than separate life-area sections.
  const narrative = join([
    opening,
    pickLang(mood.setting, language),
    pickLang(mood.coda, language),
    pickLang(work.main, language),
    pickLang(work.follow, language),
    pickLang(love.main, language),
    pickLang(love.follow, language),
    pickLang(advice.text, language),
  ]);

  return {
    title: titleOf(ctx, language),
    general: narrative,
    // Legacy fields stay empty for compatibility with saved callers; the UI renders only general.
    workAndFinance: "",
    loveAndRelationships: "",
    advice: "",
  };
}

export function composeNotification(ctx: ForecastContext, language: AppLanguage): string {
  const mood = itemById(MOODS, ctx.moodId);
  const meta = ZODIAC[ctx.sign];
  const line = pickLang(mood.notify, language);
  return language === "en" ? `${meta.nameEn}: ${line}` : `${meta.nameRu}: ${line}`;
}
