import assert from "node:assert/strict";
import { test } from "node:test";
import { PLANETS } from "./catalog.ts";
import { addDays, type LocalDate } from "./dates.ts";
import { chartForSign, computeSky, houseFromSign } from "./astro.ts";
import {
  buildDayContexts,
  contextCoreKey,
  generateForecast,
  getForecastContext,
  textGeneratorEngine,
} from "./generator.ts";
import { inspectForecastQuality } from "./quality.ts";
import { inspectDayForecastQuality } from "./day-quality.ts";
import { ZodiacSign, ZODIAC, ZODIAC_ORDER } from "./zodiac.ts";

const dateA: LocalDate = { year: 2026, month: 8, day: 22 };
const dateB: LocalDate = { year: 2026, month: 8, day: 23 };
const dateC: LocalDate = { year: 2026, month: 8, day: 24 };

const CYRILLIC = /[А-Яа-яЁё]/;
const LATIN_WORD =
  /\b(The|Today|Mercury|Venus|Mars|Jupiter|Saturn|Uranus|Neptune|Pluto|Aries|Taurus|Gemini|Cancer|Leo|Virgo|Libra|Scorpio|Sagittarius|Capricorn|Aquarius|Pisces)\b/;

function blob(forecast: ReturnType<typeof generateForecast>): string {
  return [
    forecast.title,
    forecast.general,
    forecast.workAndFinance,
    forecast.loveAndRelationships,
    forecast.advice,
  ].join("\n");
}

test("прогноз не пустой", () => {
  const forecast = generateForecast(ZodiacSign.SCORPIO, dateA);
  assert.ok(forecast.title.trim().length > 0);
  assert.ok(forecast.general.trim().length > 0);
  assert.ok(forecast.workAndFinance.trim().length > 0);
  assert.ok(forecast.loveAndRelationships.trim().length > 0);
  assert.ok(forecast.advice.trim().length > 0);
});

test("прогноз содержит название знака", () => {
  const forecast = generateForecast(ZodiacSign.SCORPIO, dateA);
  const meta = ZODIAC[ZodiacSign.SCORPIO];
  assert.equal(forecast.sign, ZodiacSign.SCORPIO);
  const text = blob(forecast);
  assert.ok(text.includes(meta.nameRu) || text.includes(meta.dative) || text.includes(meta.genitive));
});

test("все обязательные разделы существуют", () => {
  const forecast = generateForecast(ZodiacSign.ARIES, dateA);
  assert.equal(typeof forecast.title, "string");
  assert.equal(typeof forecast.workAndFinance, "string");
  assert.equal(typeof forecast.loveAndRelationships, "string");
  assert.equal(typeof forecast.advice, "string");
  assert.equal(forecast.date.year, dateA.year);
  assert.equal(forecast.date.month, dateA.month);
  assert.equal(forecast.date.day, dateA.day);
});

test("один знак и одна дата дают одинаковый прогноз", () => {
  const first = generateForecast(ZodiacSign.LEO, dateA);
  const second = generateForecast(ZodiacSign.LEO, dateA);
  assert.deepEqual(first, second);
});

test("одна дата и разные знаки дают разные прогнозы", () => {
  const aries = generateForecast(ZodiacSign.ARIES, dateA);
  const taurus = generateForecast(ZodiacSign.TAURUS, dateA);
  assert.notEqual(aries.title + aries.general, taurus.title + taurus.general);
});

test("один знак и разные даты дают разные прогнозы", () => {
  const first = generateForecast(ZodiacSign.PISCES, dateA);
  const second = generateForecast(ZodiacSign.PISCES, dateB);
  assert.notEqual(first.title + first.general, second.title + second.general);
});

test("все 12 знаков успешно генерируются", () => {
  for (const sign of ZODIAC_ORDER) {
    const forecast = generateForecast(sign, dateA);
    assert.equal(forecast.sign, sign);
    const meta = ZODIAC[sign];
    assert.ok(
      forecast.general.includes(meta.nameRu) ||
        forecast.general.includes(meta.dative) ||
        forecast.general.includes(meta.genitive),
      `${sign} без имени знака`,
    );
    assert.ok(forecast.general.split(/[.!?…]\s+/).length >= 3);
    assert.ok(forecast.workAndFinance.split(/[.!?…]\s+/).length >= 2);
    assert.ok(forecast.loveAndRelationships.split(/[.!?…]\s+/).length >= 2);
  }
});

test("генерация всех 12 прогнозов выполняется достаточно быстро", () => {
  const started = performance.now();
  const all = textGeneratorEngine.generateAll(dateA);
  const elapsed = performance.now() - started;
  assert.equal(all.length, 12);
  assert.ok(elapsed < 100, `заняло ${elapsed.toFixed(2)} мс`);
});

test("русский прогноз не содержит английских предложений", () => {
  for (const sign of ZODIAC_ORDER) {
    const forecast = generateForecast(sign, dateA, "ru");
    const text = blob(forecast);
    assert.ok(CYRILLIC.test(text), `${sign} без кириллицы`);
    assert.equal(LATIN_WORD.test(text), false, `${sign}: ${text}`);
  }
});

test("английский прогноз не содержит русских предложений", () => {
  for (const sign of ZODIAC_ORDER) {
    const forecast = generateForecast(sign, dateA, "en");
    const text = blob(forecast);
    assert.equal(CYRILLIC.test(text), false, `${sign}: ${text}`);
    assert.ok(text.includes(ZODIAC[sign].nameEn));
  }
});

test("все 12 русских прогнозов за один день имеют различное содержательное ядро", () => {
  const cores = ZODIAC_ORDER.map((sign) => contextCoreKey(getForecastContext(sign, dateA)));
  assert.equal(new Set(cores).size, 12);
});

test("все 12 английских прогнозов за один день имеют различное содержательное ядро", () => {
  const cores = ZODIAC_ORDER.map((sign) => contextCoreKey(getForecastContext(sign, dateA)));
  const texts = ZODIAC_ORDER.map((sign) => blob(generateForecast(sign, dateA, "en")));
  assert.equal(new Set(cores).size, 12);
  assert.equal(new Set(texts).size, 12);
});

test("прогноз текущего дня отличается от прогноза предыдущего и следующего", () => {
  const today = generateForecast(ZodiacSign.SCORPIO, dateB);
  const yesterday = generateForecast(ZodiacSign.SCORPIO, dateA);
  const tomorrow = generateForecast(ZodiacSign.SCORPIO, dateC);
  assert.notDeepEqual(today, yesterday);
  assert.notDeepEqual(today, tomorrow);
  assert.notEqual(
    contextCoreKey(getForecastContext(ZodiacSign.SCORPIO, dateB)),
    contextCoreKey(getForecastContext(ZodiacSign.SCORPIO, dateA)),
  );
  assert.notEqual(
    contextCoreKey(getForecastContext(ZodiacSign.SCORPIO, dateB)),
    contextCoreKey(getForecastContext(ZodiacSign.SCORPIO, dateC)),
  );
});

test("одинаковый знак и одинаковая дата дают воспроизводимый результат", () => {
  const ru1 = generateForecast(ZodiacSign.VIRGO, dateA, "ru");
  const ru2 = generateForecast(ZodiacSign.VIRGO, dateA, "ru");
  const en1 = generateForecast(ZodiacSign.VIRGO, dateA, "en");
  const en2 = generateForecast(ZodiacSign.VIRGO, dateA, "en");
  assert.deepEqual(ru1, ru2);
  assert.deepEqual(en1, en2);
});

test("заголовки не повторяются между знаками в рамках одного дня", () => {
  for (const date of [dateA, dateB, dateC]) {
    const titlesRu = ZODIAC_ORDER.map((sign) => generateForecast(sign, date, "ru").title);
    const titlesEn = ZODIAC_ORDER.map((sign) => generateForecast(sign, date, "en").title);
    assert.equal(new Set(titlesRu).size, 12, `ru ${date.day}: ${titlesRu.join(" | ")}`);
    assert.equal(new Set(titlesEn).size, 12, `en ${date.day}: ${titlesEn.join(" | ")}`);
  }
});

test("советы дня не повторяются между знаками в рамках одного дня", () => {
  for (const date of [dateA, dateB, dateC]) {
    const adviceRu = ZODIAC_ORDER.map((sign) => generateForecast(sign, date, "ru").advice);
    const adviceEn = ZODIAC_ORDER.map((sign) => generateForecast(sign, date, "en").advice);
    assert.equal(new Set(adviceRu).size, 12, `ru ${date.day}: ${adviceRu.join(" | ")}`);
    assert.equal(new Set(adviceEn).size, 12, `en ${date.day}: ${adviceEn.join(" | ")}`);
  }
});

test("русский и английский варианты основаны на одном ForecastContext", () => {
  for (const sign of ZODIAC_ORDER) {
    const ctx = getForecastContext(sign, dateA);
    const ru = generateForecast(sign, dateA, "ru");
    const en = generateForecast(sign, dateA, "en");
    assert.equal(ctx.sign, sign);
    assert.equal(ctx.date.day, dateA.day);
    assert.equal(ru.sign, en.sign);
    assert.deepEqual(ru.date, en.date);
    assert.notEqual(blob(ru), blob(en));
    assert.equal(inspectForecastQuality(ru, ctx, "ru").join(","), "");
    assert.equal(inspectForecastQuality(en, ctx, "en").join(","), "");
  }
});

test("переключение языка не меняет смысловой контекст", () => {
  const before = getForecastContext(ZodiacSign.ARIES, dateA);
  generateForecast(ZodiacSign.ARIES, dateA, "ru");
  generateForecast(ZodiacSign.ARIES, dateA, "en");
  generateForecast(ZodiacSign.ARIES, dateA, "ru");
  const after = getForecastContext(ZodiacSign.ARIES, dateA);
  assert.deepEqual(before, after);
});

test("смысловые параметры совпадают у русской и английской версии", () => {
  const ctx = getForecastContext(ZodiacSign.GEMINI, dateA);
  assert.ok(ctx.planet);
  assert.ok(ctx.planet2);
  assert.notEqual(ctx.planet, ctx.planet2);
  assert.ok(ctx.house);
  assert.ok(ctx.aspect);
  assert.ok(ctx.tone);
  assert.ok(ctx.workId);
  assert.ok(ctx.loveId);
  assert.ok(ctx.financeId);
  assert.ok(ctx.moodId);
  assert.ok(ctx.adviceId);
  const ru = generateForecast(ZodiacSign.GEMINI, dateA, "ru");
  const en = generateForecast(ZodiacSign.GEMINI, dateA, "en");
  assert.equal(ru.sign, ctx.sign);
  assert.equal(en.sign, ctx.sign);
});

test("день даёт 12 уникальных ядер на нескольких датах подряд", () => {
  for (let offset = 0; offset < 10; offset += 1) {
    const date = addDays(dateA, offset);
    const cores = Object.values(buildDayContexts(date)).map(contextCoreKey);
    assert.equal(new Set(cores).size, 12, `date offset ${offset}`);
  }
});

const ABSTRACT_RU =
  /траектори|вибрац|резонанс|архетип|внутренн\w*\s+динамик|пространство возможност|глубина сегодня|доверьтесь течению|ритм собственной|внутреннее течение/i;
const ABSTRACT_EN =
  /inner (rhythm|trajectory|dynamics|resonance)|emotional horizon|space of possibilities|trust the (flow|current)|depth is more trustworthy than speed/i;

test("тексты без псевдоглубоких и непонятных формулировок", () => {
  for (let offset = 0; offset < 7; offset += 1) {
    const date = addDays(dateA, offset);
    for (const sign of ZODIAC_ORDER) {
      const ru = generateForecast(sign, date, "ru");
      const en = generateForecast(sign, date, "en");
      assert.equal(ABSTRACT_RU.test(blob(ru)), false, blob(ru));
      assert.equal(ABSTRACT_EN.test(blob(en)), false, blob(en));
      assert.ok(ru.advice.length > 20, ru.advice);
      assert.ok(en.advice.length > 20, en.advice);
      assert.equal(/доверьтесь течению|тишина скажет/i.test(ru.advice), false);
      assert.equal(/trust the flow|silence will say/i.test(en.advice), false);
    }
  }
});

test("планета не повторяется в работе, отношениях и совете", () => {
  for (const sign of ZODIAC_ORDER) {
    const ctx = getForecastContext(sign, dateA);
    const ru = generateForecast(sign, dateA, "ru");
    const en = generateForecast(sign, dateA, "en");
    const ruName = PLANETS[ctx.planet].ru.nom;
    const enName = PLANETS[ctx.planet].en;
    assert.equal(ru.workAndFinance.includes(ruName), false, ru.workAndFinance);
    assert.equal(ru.loveAndRelationships.includes(ruName), false, ru.loveAndRelationships);
    assert.equal(ru.advice.includes(ruName), false, ru.advice);
    assert.equal(en.workAndFinance.includes(enName), false, en.workAndFinance);
    assert.equal(en.loveAndRelationships.includes(enName), false, en.loveAndRelationships);
    assert.ok(ru.general.includes(ruName));
  }
});

test("блоки одного прогноза не копируют одну и ту же рабочую ситуацию", () => {
  for (const sign of ZODIAC_ORDER) {
    const ru = generateForecast(sign, dateA, "ru");
    const workLead = ru.workAndFinance.split(/[.!?…]/)[0]!.trim();
    if (workLead.length > 24) {
      assert.equal(ru.general.includes(workLead), false, `${sign}: ${workLead}`);
      assert.equal(ru.loveAndRelationships.includes(workLead), false, `${sign}: ${workLead}`);
      assert.equal(ru.advice.includes(workLead), false, `${sign}: ${workLead}`);
    }
  }
});

test("смысловые семьи внутри одного прогноза не повторяются", () => {
  for (const sign of ZODIAC_ORDER) {
    const ctx = getForecastContext(sign, dateA);
    const ids = [ctx.moodId, ctx.workId, ctx.financeId, ctx.loveId, ctx.adviceId];
    assert.equal(new Set(ids).size, 5, `${sign}: ${ids.join(",")}`);
  }
});

test("нет метакомментариев о гороскопе и ложных опровержений", () => {
  const bannedRu =
    /небесн\w*\s+детал|коротко о небе|это не охлаждение|большой вывод|сильнее самой ситуации|это может встретиться так|это будет заметно сразу|астрологическ|добрый жест и не превращайте|письмо,\s*встреча или|разбрасыва\w*\s+вниман|подталкива|пять минут/i;
  const bannedEn =
    /one sky detail|brief sky note|cooling of feeling|stronger than the situation|will feel it plainly|may notice this:|scatters attention|nudges you/i;
  for (let offset = 0; offset < 14; offset += 1) {
    const date = addDays(dateA, offset);
    for (const sign of ZODIAC_ORDER) {
      const ru = generateForecast(sign, date, "ru");
      const en = generateForecast(sign, date, "en");
      const ruText = blob(ru);
      const enText = blob(en);
      assert.equal(bannedRu.test(ruText), false, ruText);
      assert.equal(bannedEn.test(enText), false, enText);
      assert.equal(inspectForecastQuality(ru, getForecastContext(sign, date), "ru").join(","), "");
      assert.equal(inspectForecastQuality(en, getForecastContext(sign, date), "en").join(","), "");
      assert.ok((ruText.match(/сегодня/gi) ?? []).length <= 3, ruText);
      assert.ok((ru.general.match(/может/gi) ?? []).length <= 2, ru.general);
    }
  }
});

test("астрологические факты совпадают с расчётом неба", () => {
  const date = { year: 2026, month: 9, day: 5 };
  const sky = computeSky(date);
  assert.equal(sky.zodiac, "tropical");
  assert.equal(sky.houseSystem, "whole-sign");
  assert.equal(sky.bodies.mercury.sign, "VIRGO");
  assert.equal(sky.bodies.venus.sign, "LIBRA");
  assert.equal(sky.bodies.mars.sign, "CANCER");
  assert.equal(sky.bodies.jupiter.sign, "LEO");
  assert.equal(sky.bodies.saturn.sign, "ARIES");
  assert.equal(sky.bodies.uranus.sign, "GEMINI");
  assert.equal(sky.bodies.neptune.sign, "ARIES");
  assert.equal(sky.bodies.pluto.sign, "AQUARIUS");
  assert.equal(sky.bodies.saturn.retrograde, true);
  assert.equal(sky.bodies.neptune.retrograde, true);
  assert.equal(sky.bodies.pluto.retrograde, true);
  assert.equal(sky.bodies.mercury.retrograde, false);
  assert.equal(houseFromSign(sky.bodies.uranus.sign, "ARIES"), "III");
  assert.equal(houseFromSign(sky.bodies.mercury.sign, "VIRGO"), "I");
  assert.equal(sky.sunSign, "VIRGO");

  for (const sign of ZODIAC_ORDER) {
    const ctx = getForecastContext(sign, date);
    const chart = chartForSign(sky, sign);
    assert.equal(ctx.house, chart.houses[ctx.planet], `${sign} ${ctx.planet}`);
    assert.equal(ctx.planetSign, sky.bodies[ctx.planet].sign);
    assert.equal(ctx.retrograde, sky.bodies[ctx.planet].retrograde);
    const ru = generateForecast(sign, date, "ru");
    assert.equal(/(?:^|\s)(?:I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII) доме/.test(ru.general), false);
    assert.equal(/\b(?:house|houses)\b/.test(generateForecast(sign, date, "en").general), false);
    assert.ok(ru.general.includes(PLANETS[ctx.planet].ru.nom), ru.general);
    if (ctx.retrograde) {
      assert.equal(/ретроград/i.test(ru.general), true, ru.general);
    }
  }
});


test("все 12 прогнозов проверяются вместе: без дублей, конфликтующих советов и одинаковых сценариев", () => {
  for (const date of [dateA, dateB, dateC]) {
    for (const language of ["ru", "en"] as const) {
      const forecasts = textGeneratorEngine.generateAll(date, language);
      const contexts = ZODIAC_ORDER.map((sign) => getForecastContext(sign, date));
      const issues = inspectDayForecastQuality(forecasts, contexts, language);
      const blocking = issues.filter((issue) =>
        [
          "missing-sign",
          "duplicate-sentence-across-signs",
          "repeated-general-opening",
          "duplicate-scenario-family",
          "advice-conflicts-with-forecast",
          "high-textual-overlap",
        ].includes(issue.code),
      );
      assert.deepEqual(
        blocking,
        [],
        `${language} ${date.year}-${date.month}-${date.day}: ${JSON.stringify(blocking, null, 2)}`,
      );
    }
  }
});

test("межзнаковый анализ обнаруживает одинаковый общий фон", () => {
  const forecasts = textGeneratorEngine.generateAll(dateA, "ru").map((forecast) => ({ ...forecast }));
  const contexts = ZODIAC_ORDER.map((sign) => getForecastContext(sign, dateA));
  forecasts[1]!.general = forecasts[0]!.general;
  const issues = inspectDayForecastQuality(forecasts, contexts, "ru");
  assert.ok(
    issues.some((issue) =>
      issue.code === "duplicate-sentence-across-signs" &&
      issue.signs.includes(ZODIAC_ORDER[0]) &&
      issue.signs.includes(ZODIAC_ORDER[1]),
    ),
    "копирование общего фона между знаками должно быть обнаружено",
  );
});
