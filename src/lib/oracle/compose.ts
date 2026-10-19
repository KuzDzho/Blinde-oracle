import { PLANETS, TITLES, type TimeId } from "./catalog.ts";
import type { ForecastContext } from "./context.ts";
import { editSection } from "./editor.ts";
import type { AppLanguage } from "./i18n.ts";
import {
  ADVICE_ITEMS,
  LOVE_EVENTS,
  MOODS,
  WORK_EVENTS,
  itemById,
  type VoiceId,
} from "./semantics.ts";
import { ZODIAC } from "./zodiac.ts";

function joinSentences(parts: readonly string[]): string {
  return parts
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => (/[.!?…]$/.test(part) ? part : `${part}.`))
    .join(" ");
}

function pickLang(text: { ru: string; en: string }, language: AppLanguage): string {
  return language === "en" ? text.en : text.ru;
}

const SIGN_PREPOSITIONAL_RU: Record<ForecastContext["planetSign"], string> = {
  ARIES: "Овне", TAURUS: "Тельце", GEMINI: "Близнецах", CANCER: "Раке",
  LEO: "Льве", VIRGO: "Деве", LIBRA: "Весах", SCORPIO: "Скорпионе",
  SAGITTARIUS: "Стрельце", CAPRICORN: "Козероге", AQUARIUS: "Водолее", PISCES: "Рыбах",
};

function towardTime(time: TimeId, language: AppLanguage): string {
  if (language === "en") {
    switch (time) {
      case "morning":
        return "Toward morning";
      case "firstHalf":
        return "As the first half of the day unfolds";
      case "midday":
        return "Toward midday";
      case "secondHalf":
        return "Later in the day";
      case "evening":
        return "Toward evening";
    }
  }
  switch (time) {
    case "morning":
      return "Ближе к утру";
    case "firstHalf":
      return "Ближе к первой половине дня";
    case "midday":
      return "Ближе к середине дня";
    case "secondHalf":
      return "Ближе ко второй половине дня";
    case "evening":
      return "Ближе к вечеру";
  }
}

function observation(ctx: ForecastContext, language: AppLanguage): string {
  const mood = itemById(MOODS, ctx.moodId);
  const meta = ZODIAC[ctx.sign];
  const open = pickLang(mood.open, language);
  const phrase = pickLang(mood.phrase, language);
  const voice: VoiceId = ctx.voice;
  const toward = towardTime(ctx.time, language);

  if (language === "ru") {
    switch (voice) {
      case "observational":
        return `У ${meta.genitive} день пройдёт ${phrase}`;
      case "situational":
        return `${meta.dative} ${open}`;
      case "direct":
        return `${meta.dative} ${open}`;
      case "question":
        return `${meta.dative} ${open}`;
      case "contrast":
        return `Даже в обычном расписании ${meta.dative} ${open}`;
      case "timeLed":
        return `${toward} ${meta.dative} ${open}`;
    }
  }

  switch (voice) {
    case "observational":
      return `For ${meta.nameEn}, the day will pass ${phrase}`;
    case "situational":
      return `${meta.nameEn} ${open}`;
    case "direct":
      return `${meta.nameEn} ${open}`;
    case "question":
      return `${meta.nameEn} ${open}`;
    case "contrast":
      return `Even on an ordinary schedule, ${meta.nameEn} ${open}`;
    case "timeLed":
      return `${toward}, ${meta.nameEn} ${open}`;
  }
}

function atmosphere(ctx: ForecastContext, language: AppLanguage): string {
  const planet = language === "en" ? PLANETS[ctx.planet].en : PLANETS[ctx.planet].ru.nom;
  if (language === "en") {
    return ctx.retrograde
      ? `${planet} is retrograde in ${ZODIAC[ctx.planetSign].nameEn}.`
      : `${planet} is in ${ZODIAC[ctx.planetSign].nameEn}.`;
  }
  const sign = SIGN_PREPOSITIONAL_RU[ctx.planetSign];
  return ctx.retrograde
    ? `Ретроградный ${planet} находится в ${sign}.`
    : `${planet} находится в ${sign}.`;
}

function titleOf(ctx: ForecastContext, language: AppLanguage): string {
  const title = TITLES.find((item) => item.id === ctx.titleId) ?? TITLES[0]!;
  return pickLang(title, language);
}

/**
 * Авторская стадия: из контекста собирается цельный черновик блока,
 * а не отдельное предложение на каждое поле.
 */
function authorDraft(
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
  const lead = observation(ctx, language);
  const astro = atmosphere(ctx, language);
  const landing = pickLang(mood.coda, language);

  const generalParts = [lead, astro, landing];

  return {
    title: titleOf(ctx, language),
    general: joinSentences(generalParts),
    workAndFinance: joinSentences([pickLang(work.main, language), pickLang(work.follow, language)]),
    loveAndRelationships: joinSentences([pickLang(love.main, language), pickLang(love.follow, language)]),
    advice: pickLang(advice.text, language),
  };
}

/**
 * Собирает готовый текст: сначала авторский черновик, затем редактура.
 * Новых событий не добавляет — только формулирует уже выбранный смысл.
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
  const draft = authorDraft(ctx, language);
  const planet = language === "en" ? PLANETS[ctx.planet].en : PLANETS[ctx.planet].ru.nom;
  return {
    title: draft.title,
    general: editSection(draft.general, language, 3, [planet]),
    workAndFinance: editSection(draft.workAndFinance, language, 2),
    loveAndRelationships: editSection(draft.loveAndRelationships, language, 2),
    advice: draft.advice,
  };
}

/**
 * Короткая фраза для локального уведомления — тот же смысл, без новых событий.
 */
export function composeNotification(ctx: ForecastContext, language: AppLanguage): string {
  const mood = itemById(MOODS, ctx.moodId);
  const meta = ZODIAC[ctx.sign];
  const line = pickLang(mood.notify, language);
  return language === "en" ? `${meta.nameEn}: ${line}` : `${meta.nameRu}: ${line}`;
}
