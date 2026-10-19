import type { ForecastContext } from "./context.ts";
import { ADVICE_ITEMS, LOVE_EVENTS, MOODS, WORK_EVENTS, FINANCE_EVENTS, familiesConflict, type Family } from "./semantics.ts";
import type { AppLanguage } from "./i18n.ts";
import type { Forecast } from "./types.ts";
import { ZODIAC, ZODIAC_ORDER } from "./zodiac.ts";

export interface DayQualityIssue {
  code: string;
  signs: readonly string[];
  detail: string;
}

const STOP_WORDS = new Set([
  "и", "а", "но", "в", "во", "на", "по", "к", "ко", "с", "со", "у", "из", "за", "для", "от", "до", "не", "ни",
  "это", "так", "как", "что", "если", "то", "же", "ли", "бы", "вы", "вам", "вас", "ваш", "ваша", "ваше", "ваши",
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "from", "with", "of", "if", "then", "you",
  "your", "it", "is", "are", "will", "may", "can", "today", "this", "that",
]);

function normalize(text: string, language: AppLanguage): string {
  let result = text.toLocaleLowerCase(language === "ru" ? "ru-RU" : "en-US")
    .replace(/[«»"'“”()—–,:;.!?…]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  for (const sign of ZODIAC_ORDER) {
    const meta = ZODIAC[sign];
    for (const name of [meta.nameRu, meta.nameEn, meta.dative, meta.genitive]) {
      if (name) result = result.split(name.toLocaleLowerCase(language === "ru" ? "ru-RU" : "en-US")).join(" ");
    }
  }
  return result.replace(/\s+/g, " ").trim();
}

function sentences(text: string, language: AppLanguage): string[] {
  return text.split(/(?<=[.!?…])\s+/).map((part) => normalize(part, language)).filter((part) => part.length > 0);
}

function family(list: readonly { id: string; family: Family }[], id: string): Family | "unknown" {
  return list.find((item) => item.id === id)?.family ?? "unknown";
}

function isAstrologyPositionSentence(text: string): boolean {
  // Planetary positions are shared facts for the date, not duplicated horoscope writing.
  return /^(?:ретроградный\s+)?(?:меркурий|венера|марс|юпитер|сатурн|уран|нептун|плутон|солнце|луна)\s+находится\s+в\b/i.test(text.trim())
    || /^(?:mercury|venus|mars|jupiter|saturn|uranus|neptune|pluto|sun|moon)\s+is\s+(?:retrograde\s+)?in\b/i.test(text.trim());
}

function contentWords(text: string, language: AppLanguage): Set<string> {
  return new Set(normalize(text, language).split(/\s+/).filter((word) => word.length > 3 && !STOP_WORDS.has(word)));
}

function overlap(left: Set<string>, right: Set<string>): number {
  if (left.size === 0 || right.size === 0) return 0;
  let intersection = 0;
  for (const word of left) if (right.has(word)) intersection += 1;
  return intersection / (left.size + right.size - intersection);
}

export function inspectDayForecastQuality(
  forecasts: readonly Forecast[],
  contexts: readonly ForecastContext[],
  language: AppLanguage,
): DayQualityIssue[] {
  const issues: DayQualityIssue[] = [];
  const contextBySign = new Map(contexts.map((ctx) => [ctx.sign, ctx]));
  const forecastBySign = new Map(forecasts.map((forecast) => [forecast.sign, forecast]));
  const sentenceOwners = new Map<string, string[]>();
  const openingOwners = new Map<string, string[]>();
  const scenarioOwners = new Map<string, string[]>();
  const textWords = new Map<string, Set<string>>();

  for (const sign of ZODIAC_ORDER) {
    const forecast = forecastBySign.get(sign);
    const ctx = contextBySign.get(sign);
    if (!forecast || !ctx) {
      issues.push({ code: "missing-sign", signs: [sign], detail: "Forecast or context missing from the 12-sign set." });
      continue;
    }

    const generalSentences = forecast.general
      .split(/(?<=[.!?…])\s+/)
      .filter((part) => !isAstrologyPositionSentence(part))
      .flatMap((part) => sentences(part, language));
    const allSentences = [
      ...generalSentences,
      ...sentences(forecast.workAndFinance, language),
      ...sentences(forecast.loveAndRelationships, language),
      ...sentences(forecast.advice, language),
    ];
    for (const sentence of allSentences) {
      if (isAstrologyPositionSentence(sentence)) continue;
      if (sentence.split(/\s+/).filter(Boolean).length < 5) continue;
      const owners = sentenceOwners.get(sentence) ?? [];
      owners.push(sign);
      sentenceOwners.set(sentence, owners);
    }

    const firstGeneral = sentences(forecast.general, language)[0];
    if (firstGeneral) {
      const key = firstGeneral.split(" ").slice(0, 7).join(" ");
      const owners = openingOwners.get(key) ?? [];
      owners.push(sign);
      openingOwners.set(key, owners);
    }

    const scenario = [
      family(MOODS, ctx.moodId), family(WORK_EVENTS, ctx.workId),
      family(FINANCE_EVENTS, ctx.financeId), family(LOVE_EVENTS, ctx.loveId),
      family(ADVICE_ITEMS, ctx.adviceId),
    ].join("|");
    const scenarioSigns = scenarioOwners.get(scenario) ?? [];
    scenarioSigns.push(sign);
    scenarioOwners.set(scenario, scenarioSigns);

    const adviceFamily = family(ADVICE_ITEMS, ctx.adviceId);
    const otherFamilies = [
      family(MOODS, ctx.moodId), family(WORK_EVENTS, ctx.workId),
      family(FINANCE_EVENTS, ctx.financeId), family(LOVE_EVENTS, ctx.loveId),
    ];
    if (adviceFamily !== "unknown" && otherFamilies.some(
      (other) => other !== "unknown" && familiesConflict(adviceFamily, other),
    )) {
      issues.push({ code: "advice-conflicts-with-forecast", signs: [sign], detail: `Advice family ${adviceFamily} clashes with the forecast's situation.` });
    }

    textWords.set(sign, contentWords([
      forecast.title, forecast.general, forecast.workAndFinance,
      forecast.loveAndRelationships, forecast.advice,
    ].join(" "), language));
  }

  for (const [sentence, owners] of sentenceOwners) {
    const signs = [...new Set(owners)];
    if (signs.length > 1) issues.push({ code: "duplicate-sentence-across-signs", signs, detail: sentence });
  }
  for (const [opening, owners] of openingOwners) {
    const signs = [...new Set(owners)];
    if (signs.length > 1) issues.push({ code: "repeated-general-opening", signs, detail: opening });
  }
  for (const [scenario, owners] of scenarioOwners) {
    const signs = [...new Set(owners)];
    if (signs.length > 1) issues.push({ code: "duplicate-scenario-family", signs, detail: scenario });
  }

  for (let i = 0; i < ZODIAC_ORDER.length; i += 1) {
    for (let j = i + 1; j < ZODIAC_ORDER.length; j += 1) {
      const left = ZODIAC_ORDER[i]!;
      const right = ZODIAC_ORDER[j]!;
      const score = overlap(textWords.get(left) ?? new Set(), textWords.get(right) ?? new Set());
      if (score >= 0.48) {
        issues.push({ code: "high-textual-overlap", signs: [left, right], detail: `Content-word Jaccard similarity ${score.toFixed(2)} exceeds 0.48.` });
      }
    }
  }

  return issues;
}
