import assert from "node:assert/strict";
import { test } from "node:test";
import { type LocalDate } from "./dates.ts";
import { generateForecast, textGeneratorEngine } from "./generator.ts";
import { inspectForecastQuality } from "./quality.ts";
import { ZodiacSign, ZODIAC, ZODIAC_ORDER } from "./zodiac.ts";

const date: LocalDate = { year: 2026, month: 10, day: 28 };
const NATAL_TERMS = /\b(?:натальн\w*|асцендент\w*|десцендент\w*|\d{1,2}\s*дом(?:е|а|ом|у)?|natal chart|ascendant|descendant|house)\b/i;

test("one sign and date always produce the same horoscope", () => {
  assert.deepEqual(generateForecast(ZodiacSign.LEO, date), generateForecast(ZodiacSign.LEO, date));
});

test("all twelve signs generate a single non-empty narrative", () => {
  const forecasts = textGeneratorEngine.generateAll(date);
  assert.equal(forecasts.length, 12);
  for (const forecast of forecasts) {
    assert.ok(forecast.general.trim(), forecast.sign + ": empty narrative");
    assert.equal(forecast.workAndFinance, "");
    assert.equal(forecast.loveAndRelationships, "");
    assert.equal(forecast.advice, "");
    assert.ok(forecast.general.includes(ZODIAC[forecast.sign].nameRu) ||
      forecast.general.includes(ZODIAC[forecast.sign].dative) ||
      forecast.general.includes(ZODIAC[forecast.sign].genitive));
  }
});

test("same date gives distinct narratives for all zodiac signs", () => {
  const texts = textGeneratorEngine.generateAll(date).map((forecast) => forecast.general);
  assert.equal(new Set(texts).size, 12);
});

test("different dates change the deterministic daily narrative", () => {
  const nextDate: LocalDate = { year: 2026, month: 10, day: 29 };
  assert.notEqual(generateForecast(ZodiacSign.PISCES, date).general, generateForecast(ZodiacSign.PISCES, nextDate).general);
});

test("Russian horoscope contains no natal chart or house terminology", () => {
  for (const sign of ZODIAC_ORDER) {
    const forecast = generateForecast(sign, date, "ru");
    assert.equal(NATAL_TERMS.test(forecast.general), false, sign + ": " + forecast.general);
  }
});

test("English horoscope contains no natal chart or house terminology", () => {
  for (const sign of ZODIAC_ORDER) {
    const forecast = generateForecast(sign, date, "en");
    assert.equal(NATAL_TERMS.test(forecast.general), false, sign + ": " + forecast.general);
    assert.ok(forecast.general.includes(ZODIAC[sign].nameEn));
  }
});

test("language switch keeps a readable Russian and English narrative", () => {
  const ru = generateForecast(ZodiacSign.SCORPIO, date, "ru");
  const en = generateForecast(ZodiacSign.SCORPIO, date, "en");
  assert.ok(/[А-Яа-яЁё]/.test(ru.general));
  assert.equal(/[А-Яа-яЁё]/.test(en.general), false);
  assert.ok(ru.general.length > 0 && en.general.length > 0);
});

test("quality checker no longer requires houses or planetary house placements", () => {
  const forecast = generateForecast(ZodiacSign.ARIES, date);
  const ctx = textGeneratorEngine.getContext(ZodiacSign.ARIES, date);
  const issues = inspectForecastQuality(forecast, ctx, "ru");
  assert.equal(issues.includes("missing-house"), false);
  assert.equal(issues.includes("house-mismatch"), false);
});
