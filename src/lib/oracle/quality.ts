import { PLANETS, type PlanetId } from "./catalog.ts";
import { chartForSign, computeSky } from "./astro.ts";
import type { ForecastContext } from "./context.ts";
import type { AppLanguage } from "./i18n.ts";
import type { Forecast } from "./types.ts";
import { ZODIAC } from "./zodiac.ts";

const CYRILLIC = /[А-Яа-яЁё]/;
const LATIN_SENTENCE =
  /\b(The|Today|Mercury|Venus|Mars|Jupiter|Saturn|Uranus|Neptune|Pluto|Lilith|Selene|Aries|Taurus|Gemini|Cancer|Leo|Virgo|Libra|Scorpio|Sagittarius|Capricorn|Aquarius|Pisces|your|with|from|that|this|house)\b/;

function blob(forecast: Forecast): string {
  return [
    forecast.title,
    forecast.general,
    forecast.workAndFinance,
    forecast.loveAndRelationships,
    forecast.advice,
  ].join(" ");
}

function planetMentioned(text: string, planet: PlanetId, language: AppLanguage): boolean {
  const lex = PLANETS[planet];
  return language === "ru" ? text.includes(lex.ru.nom) : text.includes(lex.en);
}

function countMentions(text: string, needle: string): number {
  if (!needle) return 0;
  let count = 0;
  let from = 0;
  while (from < text.length) {
    const index = text.indexOf(needle, from);
    if (index === -1) break;
    count += 1;
    from = index + needle.length;
  }
  return count;
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/[«»""()—–-]/g, " ").replace(/\s+/g, " ").trim();
}

function windows(text: string, size: number): string[] {
  const words = normalize(text).split(" ").filter(Boolean);
  if (words.length < size) return [];
  const result: string[] = [];
  for (let i = 0; i <= words.length - size; i += 1) {
    result.push(words.slice(i, i + size).join(" "));
  }
  return result;
}

function adviceEchoes(forecast: Forecast): boolean {
  const advice = windows(forecast.advice, 5);
  if (advice.length === 0) return false;
  const rest = normalize(
    `${forecast.general} ${forecast.workAndFinance} ${forecast.loveAndRelationships}`,
  );
  return advice.some((chunk) => rest.includes(chunk));
}

function stemOveruse(forecast: Forecast, language: AppLanguage): boolean {
  const sections = [
    forecast.general,
    forecast.workAndFinance,
    forecast.loveAndRelationships,
    forecast.advice,
  ];
  const stems =
    language === "ru"
      ? [/провер/i, /не тороп/i, /не спеш/i, /подожд/i, /дайте себе время/i]
      : [/check(ing)? the/i, /do not rush/i, /slow down/i, /give yourself time/i];
  return stems.some((stem) => sections.filter((section) => stem.test(section)).length >= 2);
}

/**
 * Внутренняя проверка качества до показа прогноза пользователю.
 * Возвращает список проблем; пустой список означает, что текст можно показывать.
 */
export function inspectForecastQuality(
  forecast: Forecast,
  ctx: ForecastContext,
  language: AppLanguage,
): string[] {
  const issues: string[] = [];
  const text = blob(forecast);

  if (!forecast.title.trim()) issues.push("empty-title");
  if (!forecast.general.trim()) issues.push("empty-general");
  if (!forecast.workAndFinance.trim()) issues.push("empty-work");
  if (!forecast.loveAndRelationships.trim()) issues.push("empty-love");
  if (!forecast.advice.trim()) issues.push("empty-advice");

  const meta = ZODIAC[ctx.sign];
  const names =
    language === "en" ? [meta.nameEn] : [meta.nameRu, meta.dative, meta.genitive];
  if (!names.some((name) => text.includes(name))) {
    issues.push("missing-sign");
  }

  if (forecast.sign !== ctx.sign) issues.push("sign-mismatch");
  if (
    forecast.date.year !== ctx.date.year ||
    forecast.date.month !== ctx.date.month ||
    forecast.date.day !== ctx.date.day
  ) {
    issues.push("date-mismatch");
  }

  if (language === "ru") {
    if (LATIN_SENTENCE.test(text)) issues.push("english-in-russian");
    if (!CYRILLIC.test(forecast.general)) issues.push("russian-missing-cyrillic");
  } else if (CYRILLIC.test(text)) {
    issues.push("russian-in-english");
  }

  const sentences = `${forecast.general} ${forecast.workAndFinance} ${forecast.loveAndRelationships}`
    .split(/(?<=[.!?…])\s+/)
    .filter(Boolean);
  if (sentences.some((sentence) => sentence.trim().split(/\s+/).length < 3)) {
    issues.push("fragment");
  }

  const planetName = language === "ru" ? PLANETS[ctx.planet].ru.nom : PLANETS[ctx.planet].en;
  if (!planetMentioned(text, ctx.planet, language)) issues.push("missing-planet");
  if (countMentions(text, planetName) > 2) issues.push("planet-overuse");
  if (countMentions(forecast.workAndFinance, planetName) > 0) issues.push("planet-in-work");
  if (countMentions(forecast.loveAndRelationships, planetName) > 0) issues.push("planet-in-love");
  if (countMentions(forecast.advice, planetName) > 0) issues.push("planet-in-advice");

  const banned =
    language === "ru"
      ? [
          /траектори/i,
          /вибрац/i,
          /резонанс/i,
          /архетип/i,
          /внутренн\w*\s+динамик/i,
          /пространство возможност/i,
          /эмоциональн\w+\s+горизонт/i,
          /глубина сегодня/i,
          /доверьтесь течению/i,
          /ритм собственной/i,
          /внутреннее течение/i,
          /точку гармонии/i,
          /устойчивого потенциала/i,
          /тишина скажет больше/i,
          /небесн\w*\s+детал/i,
          /коротко о небе/i,
          /астрологическ/i,
          /главное влияние сегодня/i,
          /это не охлаждение/i,
          /не охлаждение чувств/i,
          /не стоит делать из этого большой вывод/i,
          /чувства.{0,24}сильнее самой ситуации/i,
          /это может встретиться так/i,
          /это будет заметно сразу/i,
          /это проявляется так/i,
          /в личной жизни день выглядит иначе/i,
          /не думайте, что всё идёт не так/i,
          /это не значит, что вы устали/i,
          /не стоит воспринимать это как конфликт/i,
          /эмоциональн\w+\s+фон/i,
          /внутренн\w+\s+ресурс/i,
          /точк\w+\s+роста/i,
          /выстроить коммуникац/i,
          /прожить эмоц/i,
          /разбрасыва\w*\s+вниман/i,
          /подталкива/i,
          /раскачива/i,
          /размыва\w*\s+границ/i,
          /запускает процесс/i,
          /активирует простран/i,
          /выводит на (первый план|поверхность)/i,
          /формирует фон/i,
          /усиливает динамик/i,
          /пять минут/i,
          /через пять минут/i,
          /если присмотреться/i,
          /если обратить внимание/i,
          /стоит отметить/i,
          /важно отметить/i,
          /можно заметить/i,
          /на этом фоне/i,
          /таким образом/i,
          /если задуматься/i,
          /не скорость, а глубина/i,
          /не количество, а качество/i,
        ]
      : [
          /inner (rhythm|trajectory|dynamics|resonance)/i,
          /emotional horizon/i,
          /space of possibilities/i,
          /trust the (flow|current)/i,
          /depth is more trustworthy than speed/i,
          /silence will (say|speak) more/i,
          /own trajectory/i,
          /vibrational/i,
          /one sky detail/i,
          /brief sky note/i,
          /this is not a cooling/i,
          /cooling of feeling/i,
          /feelings (today )?may be stronger than the situation/i,
          /will feel it plainly/i,
          /may notice this:/i,
          /private life follows a different thread/i,
          /astrological picture/i,
          /main influence today/i,
          /scatters attention/i,
          /nudges you/i,
          /five minutes/i,
          /if you look closely/i,
          /it is worth noting/i,
          /against this backdrop/i,
        ];
  if (banned.some((pattern) => pattern.test(text))) issues.push("abstract-phrase");

  const fullSentences = `${forecast.general} ${forecast.workAndFinance} ${forecast.loveAndRelationships} ${forecast.advice}`
    .split(/(?<=[.!?…])\s+/)
    .map((sentence) => sentence.trim().toLowerCase())
    .filter(Boolean);
  if (new Set(fullSentences).size !== fullSentences.length) {
    issues.push("duplicate-sentence");
  }

  if (adviceEchoes(forecast)) issues.push("advice-echo");
  if (stemOveruse(forecast, language)) issues.push("repeated-stem");

  const fillerWord = language === "ru" ? /сегодня/gi : /\btoday\b/gi;
  const maybeWord = language === "ru" ? /может/gi : /\bmay\b/gi;
  if ((text.match(fillerWord) ?? []).length > 3) issues.push("today-overuse");
  if ((forecast.general.match(maybeWord) ?? []).length > 2) issues.push("maybe-overuse");

  const sectionList = [forecast.general, forecast.workAndFinance, forecast.loveAndRelationships];
  for (const section of sectionList) {
    const openings = section
      .split(/(?<=[.!?…])\s+/)
      .map((sentence) => sentence.trim())
      .filter(Boolean)
      .map((sentence) => {
        const words = sentence.split(/\s+/).filter(Boolean);
        const skip = new Set(["a", "an", "the", "в", "на", "у", "с", "к"]);
        const start = skip.has(words[0]?.toLowerCase() ?? "") ? words.slice(1, 3) : words.slice(0, 2);
        return start.join(" ").toLowerCase();
      });
    for (let i = 1; i < openings.length; i += 1) {
      if (openings[i] && openings[i] === openings[i - 1]) {
        issues.push("same-opening");
        break;
      }
    }
  }

  const timePhrase = language === "ru" ? /больше времени/gi : /take[s]? longer/gi;
  if ((text.match(timePhrase) ?? []).length > 1) issues.push("time-repeat");
  if (language === "ru" && /письмо,\s*встреча или/i.test(text)) issues.push("random-list");

  const sky = computeSky(ctx.date);
  const chart = chartForSign(sky, ctx.sign);
  if (chart.houses[ctx.planet] !== ctx.house) issues.push("house-mismatch");
  if (sky.bodies[ctx.planet].sign !== ctx.planetSign) issues.push("planet-sign-mismatch");
  if (sky.bodies[ctx.planet].retrograde !== ctx.retrograde) issues.push("retrograde-mismatch");

  if ((language === "ru" ? /ретроград/i : /retrograde/i).test(text) && !ctx.retrograde) {
    issues.push("false-retrograde");
  }

  const aspectWords =
    language === "ru"
      ? /трин|секстиль|квадратур|оппозиц|соединен|квиконс/i
      : /\b(trine|sextile|square|opposition|conjunction|quincunx)\b/i;
  if (aspectWords.test(text) && !ctx.mentionAspect) issues.push("invented-aspect");

  return issues;
}

/**
 * Прогноз считается годным, если проверка не нашла проблем.
 */
export function isForecastSound(
  forecast: Forecast,
  ctx: ForecastContext,
  language: AppLanguage,
): boolean {
  return inspectForecastQuality(forecast, ctx, language).length === 0;
}
