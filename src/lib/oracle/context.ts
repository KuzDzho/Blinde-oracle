import { computeSky, featurePlacement } from "./astro.ts";
import {
  ALGORITHM_VERSION,
  GENERATOR_SALT,
  TIME_IDS,
  TITLES,
  type AspectId,
  type HouseId,
  type PlanetId,
  type TimeId,
  type ToneId,
} from "./catalog.ts";
import { toISODate, type LocalDate } from "./dates.ts";
import { DetRng, hashSeed } from "./rng.ts";
import {
  ADVICE_ITEMS,
  ASTRO_STYLES,
  EXTRA_FOLLOWS,
  FAMILY_TITLES,
  FINANCE_EVENTS,
  LOVE_EVENTS,
  MOODS,
  SIGN_VOICES,
  SLOT_CONFLICTS,
  TONE_MOODS,
  VOICE_IDS,
  WORK_EVENTS,
  WORK_LEADS,
  familiesConflict,
  type AdviceItem,
  type AstroStyle,
  type EventItem,
  type ExtraFollow,
  type Family,
  type MoodItem,
  type VoiceId,
  type WorkLead,
} from "./semantics.ts";
import { ZODIAC_ORDER, type ZodiacSign } from "./zodiac.ts";

/**
 * Единая смысловая основа прогноза.
 * Русский и английский тексты строятся из одного и того же контекста
 * и не добавляют новых событий.
 */
export interface ForecastContext {
  sign: ZodiacSign;
  date: LocalDate;
  tone: ToneId;
  titleId: string;
  moodId: string;
  workId: string;
  financeId: string;
  loveId: string;
  adviceId: string;
  planet: PlanetId;
  planet2: PlanetId;
  planetSign: ZodiacSign;
  retrograde: boolean;
  house: HouseId;
  aspect: AspectId;
  mentionAspect: boolean;
  aspectPartner: PlanetId | null;
  time: TimeId;
  voice: VoiceId;
  astroStyle: AstroStyle;
  workLead: WorkLead;
  extraFollow: ExtraFollow;
  dayThemeId: string;
  structureId: string;
}

interface Uniqueness {
  titles: Set<string>;
  advice: Set<string>;
  cores: Set<string>;
  moods: Set<string>;
  work: Set<string>;
  finance: Set<string>;
  love: Set<string>;
  voices: Set<VoiceId>;
}

const dayCache = new Map<string, Record<ZodiacSign, ForecastContext>>();

/**
 * Строит детерминированный seed: дата + знак + соль + версия алгоритма.
 */
export function seedKey(sign: ZodiacSign, date: LocalDate): string {
  return `${toISODate(date)}+${sign}+${GENERATOR_SALT}+${ALGORITHM_VERSION}`;
}

function rngFor(sign: ZodiacSign, date: LocalDate): DetRng {
  return new DetRng(hashSeed(seedKey(sign, date)));
}

function pickUnused<T extends { id: string }>(
  rng: DetRng,
  items: readonly T[],
  used: Set<string>,
  preferred?: (item: T) => boolean,
): T {
  const preferredItems = preferred ? items.filter(preferred) : items.slice();
  for (const item of rng.shuffle(preferredItems)) {
    if (!used.has(item.id)) return item;
  }
  for (const item of rng.shuffle(items.slice())) {
    if (!used.has(item.id)) return item;
  }
  return rng.pick(items);
}

function familyOfMood(id: string): Family {
  return MOODS.find((item) => item.id === id)?.family ?? "inner";
}

function familyOfEvent(list: readonly EventItem[], id: string): Family {
  return list.find((item) => item.id === id)?.family ?? "focus";
}

function familyOfAdvice(id: string): Family {
  return ADVICE_ITEMS.find((item) => item.id === id)?.family ?? "focus";
}

function contextFamilies(ctx: {
  moodId: string;
  workId: string;
  financeId: string;
  loveId: string;
  adviceId: string;
}): Family[] {
  return [
    familyOfMood(ctx.moodId),
    familyOfEvent(WORK_EVENTS, ctx.workId),
    familyOfEvent(FINANCE_EVENTS, ctx.financeId),
    familyOfEvent(LOVE_EVENTS, ctx.loveId),
    familyOfAdvice(ctx.adviceId),
  ];
}

function hasDuplicateFamily(families: readonly Family[]): boolean {
  return new Set(families).size !== families.length;
}

function hasSlotConflict(families: readonly Family[]): boolean {
  const [mood, work, , love, advice] = families;
  const pairs: Array<readonly [Family, Family]> = [
    [mood!, work!],
    [love!, advice!],
    [mood!, advice!],
    [work!, advice!],
  ];
  return pairs.some(([a, b]) => familiesConflict(a, b));
}

function isContextLogical(ctx: {
  moodId: string;
  workId: string;
  financeId: string;
  loveId: string;
  adviceId: string;
}): boolean {
  const families = contextFamilies(ctx);
  return !hasDuplicateFamily(families) && !hasSlotConflict(families);
}

function preferredEvent<T extends EventItem | AdviceItem | MoodItem>(
  items: readonly T[],
  tone: ToneId,
): T[] {
  const matched = items.filter((item) => item.tones.includes(tone));
  return matched.length > 0 ? matched : items.slice();
}

function pickLogicalSet(
  rng: DetRng,
  tone: ToneId,
  used: Uniqueness,
): {
  mood: MoodItem;
  work: EventItem;
  finance: EventItem;
  love: EventItem;
  advice: AdviceItem;
} {
  const moodPool = preferredEvent(MOODS, tone).filter((item) => TONE_MOODS[tone].includes(item.id) || item.tones.includes(tone));
  const moods = moodPool.length > 0 ? moodPool : MOODS.slice();

  for (let attempt = 0; attempt < 48; attempt += 1) {
    const mood = pickUnused(rng, moods, used.moods);
    const work = pickUnused(rng, preferredEvent(WORK_EVENTS, tone), used.work, (item) => item.family !== mood.family);
    const finance = pickUnused(
      rng,
      preferredEvent(FINANCE_EVENTS, tone),
      used.finance,
      (item) => item.family !== mood.family && item.family !== work.family,
    );
    const love = pickUnused(
      rng,
      preferredEvent(LOVE_EVENTS, tone),
      used.love,
      (item) => item.family !== mood.family && item.family !== work.family && item.family !== finance.family,
    );
    const taken = new Set([mood.family, work.family, finance.family, love.family]);
    const advice = pickUnused(
      rng,
      preferredEvent(ADVICE_ITEMS, tone),
      used.advice,
      (item) => !taken.has(item.family),
    );
    const candidate = {
      moodId: mood.id,
      workId: work.id,
      financeId: finance.id,
      loveId: love.id,
      adviceId: advice.id,
    };
    if (isContextLogical(candidate)) {
      return { mood, work, finance, love, advice };
    }
  }

  const mood = pickUnused(rng, MOODS, used.moods);
  const work = pickUnused(rng, WORK_EVENTS, used.work);
  const finance = pickUnused(rng, FINANCE_EVENTS, used.finance);
  const love = pickUnused(rng, LOVE_EVENTS, used.love);
  const advice = pickUnused(rng, ADVICE_ITEMS, used.advice);
  return { mood, work, finance, love, advice };
}

function pickContext(
  sign: ZodiacSign,
  date: LocalDate,
  used: Uniqueness,
  usedPlanets: Set<PlanetId>,
): ForecastContext {
  const rng = rngFor(sign, date);
  const sky = computeSky(date);
  const featured = featurePlacement(sky, sign, usedPlanets, rng.int(9));
  const tone = featured.tone;
  const { mood, work, finance, love, advice } = pickLogicalSet(rng, tone, used);

  const preferredTitleIds = new Set(FAMILY_TITLES[mood.family]);
  const title = pickUnused(rng, TITLES, used.titles, (item) => preferredTitleIds.has(item.id));

  const preferredVoices = SIGN_VOICES[sign] ?? VOICE_IDS;
  let voice = rng.pick(preferredVoices);
  if (used.voices.has(voice)) {
    const unused = VOICE_IDS.filter((item) => !used.voices.has(item));
    if (unused.length > 0) voice = rng.pick(unused);
    else voice = rng.pick(VOICE_IDS);
  }

  return {
    sign,
    date,
    tone,
    titleId: title.id,
    moodId: mood.id,
    workId: work.id,
    financeId: finance.id,
    loveId: love.id,
    adviceId: advice.id,
    planet: featured.planet,
    planet2: featured.planet2,
    planetSign: featured.planetSign,
    retrograde: featured.retrograde,
    house: featured.house,
    aspect: featured.aspect,
    mentionAspect: featured.mentionAspect,
    aspectPartner: featured.aspectPartner,
    time: rng.pick(TIME_IDS),
    voice,
    astroStyle: rng.pick(ASTRO_STYLES),
    workLead: rng.pick(WORK_LEADS),
    extraFollow: rng.pick(EXTRA_FOLLOWS),
    dayThemeId: `${featured.planet}_${featured.house}_${mood.id}`,
    structureId: voice,
  };
}

/**
 * Строит уникальные контексты всех 12 знаков на одну дату.
 * Порядок знаков фиксирован, поэтому результат воспроизводим.
 * Планеты и дома берутся из расчёта неба, а не подбираются под текст.
 */
export function buildDayContexts(date: LocalDate): Record<ZodiacSign, ForecastContext> {
  const key = `${toISODate(date)}+${ALGORITHM_VERSION}`;
  const cached = dayCache.get(key);
  if (cached) return cached;

  const used: Uniqueness = {
    titles: new Set(),
    advice: new Set(),
    cores: new Set(),
    moods: new Set(),
    work: new Set(),
    finance: new Set(),
    love: new Set(),
    voices: new Set(),
  };
  const usedPlanets = new Set<PlanetId>();
  const plan = {} as Record<ZodiacSign, ForecastContext>;
  for (const sign of ZODIAC_ORDER) {
    const ctx = pickContext(sign, date, used, usedPlanets);
    used.titles.add(ctx.titleId);
    used.advice.add(ctx.adviceId);
    used.cores.add(`${ctx.planet}|${ctx.house}|${ctx.aspect}`);
    used.moods.add(ctx.moodId);
    used.work.add(ctx.workId);
    used.finance.add(ctx.financeId);
    used.love.add(ctx.loveId);
    used.voices.add(ctx.voice);
    usedPlanets.add(ctx.planet);
    plan[sign] = ctx;
  }
  if (dayCache.size > 21) {
    const first = dayCache.keys().next().value;
    if (first) dayCache.delete(first);
  }
  dayCache.set(key, plan);
  return plan;
}

/**
 * Возвращает смысловой контекст для знака и даты.
 */
export function getForecastContext(sign: ZodiacSign, date: LocalDate): ForecastContext {
  return buildDayContexts(date)[sign];
}

/**
 * Ключ содержательного ядра — для проверки уникальности без сравнения строк.
 */
export function contextCoreKey(ctx: ForecastContext): string {
  return [
    ctx.tone,
    ctx.moodId,
    ctx.workId,
    ctx.financeId,
    ctx.loveId,
    ctx.adviceId,
    ctx.planet,
    ctx.house,
    ctx.aspect,
    ctx.voice,
  ].join("|");
}

export { SLOT_CONFLICTS };
