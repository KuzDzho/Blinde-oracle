import {
  ASPECT_IDS,
  HOUSE_IDS,
  PLANET_IDS,
  type AspectId,
  type HouseId,
  type PlanetId,
  type ToneId,
} from "./catalog.ts";
import type { LocalDate } from "./dates.ts";
import { longitudesNoonUTC, retrogradeFlags, type BodyId } from "./ephemeris.ts";
import { ZODIAC_ORDER, type ZodiacSign } from "./zodiac.ts";

export const ASTRO_ZODIAC = "tropical" as const;
export const ASTRO_HOUSE_SYSTEM = "whole-sign" as const;
export const ASTRO_MOMENT = "12:00 UTC" as const;

const ASPECT_ANGLES: Record<AspectId, number> = {
  conjunction: 0,
  sextile: 60,
  square: 90,
  trine: 120,
  quincunx: 150,
  opposition: 180,
};

const ASPECT_ORBS: Record<AspectId, number> = {
  conjunction: 8,
  opposition: 8,
  trine: 7,
  square: 7,
  sextile: 5,
  quincunx: 3,
};

const MENTIONABLE: readonly PlanetId[] = [
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
  "lilith",
];

export interface BodyState {
  id: PlanetId;
  longitude: number;
  sign: ZodiacSign;
  retrograde: boolean;
}

export interface AspectFact {
  planetA: PlanetId;
  planetB: PlanetId;
  type: AspectId;
  orb: number;
}

export interface SkySnapshot {
  date: LocalDate;
  moment: typeof ASTRO_MOMENT;
  zodiac: typeof ASTRO_ZODIAC;
  houseSystem: typeof ASTRO_HOUSE_SYSTEM;
  bodies: Record<PlanetId, BodyState>;
  sunSign: ZodiacSign;
  sunLongitude: number;
  aspects: AspectFact[];
}

export interface SignChart {
  sign: ZodiacSign;
  houses: Record<PlanetId, HouseId>;
}

const skyCache = new Map<string, SkySnapshot>();

export function signFromLongitude(longitude: number): ZodiacSign {
  const index = Math.floor(((longitude % 360) + 360) % 360 / 30) % 12;
  return ZODIAC_ORDER[index]!;
}

export function houseFromSign(planetSign: ZodiacSign, sunSign: ZodiacSign): HouseId {
  const planetIndex = ZODIAC_ORDER.indexOf(planetSign);
  const sunIndex = ZODIAC_ORDER.indexOf(sunSign);
  const houseIndex = (planetIndex - sunIndex + 12) % 12;
  return HOUSE_IDS[houseIndex]!;
}

function angleDelta(a: number, b: number): number {
  return Math.abs(((a - b + 540) % 360) - 180);
}

function findAspects(bodies: Record<PlanetId, BodyState>): AspectFact[] {
  const facts: AspectFact[] = [];
  for (let i = 0; i < MENTIONABLE.length; i += 1) {
    for (let j = i + 1; j < MENTIONABLE.length; j += 1) {
      const a = MENTIONABLE[i]!;
      const b = MENTIONABLE[j]!;
      const delta = angleDelta(bodies[a].longitude, bodies[b].longitude);
      let best: AspectFact | null = null;
      for (const type of ASPECT_IDS) {
        const orb = Math.abs(delta - ASPECT_ANGLES[type]);
        if (orb <= ASPECT_ORBS[type] && (!best || orb < best.orb)) {
          best = { planetA: a, planetB: b, type, orb };
        }
      }
      if (best) facts.push(best);
    }
  }
  return facts.sort((left, right) => left.orb - right.orb);
}

function cacheKey(date: LocalDate): string {
  return `${date.year}-${date.month}-${date.day}`;
}

/**
 * Считает небо на дату. Без места рождения: дома считаются отдельно от солнечного знака.
 */
export function computeSky(date: LocalDate): SkySnapshot {
  const key = cacheKey(date);
  const cached = skyCache.get(key);
  if (cached) return cached;

  const longs = longitudesNoonUTC(date);
  const retro = retrogradeFlags(date);
  const bodies = {} as Record<PlanetId, BodyState>;
  for (const id of PLANET_IDS) {
    bodies[id] = {
      id,
      longitude: longs[id as BodyId],
      sign: signFromLongitude(longs[id as BodyId]),
      retrograde: retro[id as BodyId],
    };
  }
  const snapshot: SkySnapshot = {
    date,
    moment: ASTRO_MOMENT,
    zodiac: ASTRO_ZODIAC,
    houseSystem: ASTRO_HOUSE_SYSTEM,
    bodies,
    sunSign: signFromLongitude(longs.sun),
    sunLongitude: longs.sun,
    aspects: findAspects(bodies),
  };
  if (skyCache.size > 64) {
    const first = skyCache.keys().next().value;
    if (first) skyCache.delete(first);
  }
  skyCache.set(key, snapshot);
  return snapshot;
}

/**
 * Целознаковые дома: I дом = солнечный знак пользователя.
 */
export function chartForSign(sky: SkySnapshot, sign: ZodiacSign): SignChart {
  const houses = {} as Record<PlanetId, HouseId>;
  for (const id of PLANET_IDS) {
    houses[id] = houseFromSign(sky.bodies[id].sign, sign);
  }
  return { sign, houses };
}

const PLANET_TONES: Record<PlanetId, ToneId> = {
  mercury: "clarity",
  venus: "openness",
  mars: "initiative",
  jupiter: "renewal",
  saturn: "caution",
  uranus: "renewal",
  neptune: "depth",
  pluto: "depth",
  lilith: "restraint",
  selene: "patience",
};

export function toneFromPlacement(planet: PlanetId, _house: HouseId): ToneId {
  // The daily narrative must not derive its meaning from a house placement.
  return PLANET_TONES[planet];
}

export interface FeaturedPlacement {
  planet: PlanetId;
  planet2: PlanetId;
  house: HouseId;
  planetSign: ZodiacSign;
  retrograde: boolean;
  aspect: AspectId;
  mentionAspect: boolean;
  aspectPartner: PlanetId | null;
  tone: ToneId;
}

function scorePlacement(planet: PlanetId, sky: SkySnapshot, used: ReadonlySet<string>): number {
  let score = 1;
  if (sky.bodies[planet].retrograde) score += 2;
  if (used.has(planet)) score -= 4;
  const hasAspect = sky.aspects.some((item) => item.planetA === planet || item.planetB === planet);
  if (hasAspect) score += 1;
  return score;
}

/**
 * Выбирает планету по реальным положениям, ретроградности и аспектам на дату.
 * Дома не используются для выбора смыслового акцента прогноза.
 */
export function featurePlacement(
  sky: SkySnapshot,
  sign: ZodiacSign,
  usedPlanets: ReadonlySet<PlanetId>,
  pickIndex: number,
): FeaturedPlacement {
  const chart = chartForSign(sky, sign);
  const ranked = MENTIONABLE.map((planet) => ({
    planet,
    house: chart.houses[planet],
    score: scorePlacement(planet, sky, usedPlanets),
  })).sort((a, b) => b.score - a.score || a.planet.localeCompare(b.planet));

  const chosen = ranked[Math.abs(pickIndex) % ranked.length]!;
  const planet = chosen.planet;
  const house = chosen.house;
  const partnerPool = ranked.filter((item) => item.planet !== planet);
  const planet2 = partnerPool[0]?.planet ?? (planet === "mercury" ? "venus" : "mercury");

  const aspectHit = sky.aspects.find(
    (item) => item.planetA === planet || item.planetB === planet,
  );
  const aspectPartner = aspectHit
    ? aspectHit.planetA === planet
      ? aspectHit.planetB
      : aspectHit.planetA
    : null;

  return {
    planet,
    planet2,
    house,
    planetSign: sky.bodies[planet].sign,
    retrograde: sky.bodies[planet].retrograde,
    aspect: aspectHit?.type ?? "sextile",
    mentionAspect: Boolean(aspectHit),
    aspectPartner,
    tone: toneFromPlacement(planet, house),
  };
}

export function aspectBetween(sky: SkySnapshot, a: PlanetId, b: PlanetId): AspectFact | null {
  return (
    sky.aspects.find(
      (item) =>
        (item.planetA === a && item.planetB === b) || (item.planetA === b && item.planetB === a),
    ) ?? null
  );
}
