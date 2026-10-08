import type { LocalDate } from "./dates.ts";

/**
 * Геоцентрическая эклиптическая долгота.
 * Тропический зодиак, момент 12:00 UTC.
 *
 * Планеты: элементы JPL (1800–2050).
 * Луна: ряд Meeus.
 * Лилит: средняя лунная апогея (Black Moon).
 */
const DEG = Math.PI / 180;

function sind(x: number): number {
  return Math.sin(x * DEG);
}
function cosd(x: number): number {
  return Math.cos(x * DEG);
}
export function norm360(x: number): number {
  const value = x % 360;
  return value < 0 ? value + 360 : value;
}

/**
 * Юлианский день для календарной даты в 12:00 UTC.
 */
export function julianDayNoonUTC(date: LocalDate): number {
  let year = date.year;
  let month = date.month;
  const day = date.day + 0.5;
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

interface Elements {
  a: number;
  e: number;
  I: number;
  L: number;
  longPeri: number;
  longNode: number;
  b: number;
  c: number;
  s: number;
  f: number;
}

/** JPL Keplerian elements + rates per century, J2000, 1800–2050. */
const ELEMENTS: Record<string, { base: number[]; rate: number[]; extra?: [number, number, number, number] }> = {
  mercury: {
    base: [0.38709927, 0.20563593, 7.00497902, 252.2503235, 77.45779628, 48.33076593],
    rate: [0.00000037, 0.00001906, -0.00594749, 149472.67411175, 0.16047689, -0.12534081],
  },
  venus: {
    base: [0.72333566, 0.00677672, 3.39467605, 181.9790995, 131.60246718, 76.67984255],
    rate: [0.0000039, -0.00004107, -0.0007889, 58517.81538729, 0.00268329, -0.27769418],
  },
  earth: {
    base: [1.00000261, 0.01671123, -0.00001531, 100.46457166, 102.93768193, 0],
    rate: [0.00000562, -0.00004392, -0.01294668, 35999.37244981, 0.32327364, 0],
  },
  mars: {
    base: [1.52371034, 0.0933941, 1.84969142, -4.55343205, -23.94362959, 49.55953891],
    rate: [0.00001847, 0.00007882, -0.00813131, 19140.30268499, 0.44441088, -0.29257343],
  },
  jupiter: {
    base: [5.202887, 0.04838624, 1.30439695, 34.39644051, 14.72847983, 100.47390909],
    rate: [-0.00011607, -0.00013253, -0.00183714, 3034.74612775, 0.21252668, 0.20469106],
    extra: [-0.00012452, 0.0606406, -0.35635438, 38.35125],
  },
  saturn: {
    base: [9.53667594, 0.05386179, 2.48599187, 49.95424423, 92.59887831, 113.66242448],
    rate: [-0.0012506, -0.00050991, 0.00193609, 1222.49362201, -0.41897216, -0.28867794],
    extra: [0.00025899, -0.13434469, 0.87320147, 38.35125],
  },
  uranus: {
    base: [19.18916464, 0.04725744, 0.77263783, 313.23810451, 170.9542763, 74.01692503],
    rate: [-0.00196176, -0.00004397, -0.00242939, 428.48202785, 0.40805281, 0.04240589],
    extra: [0.00058331, -0.97731848, 0.17689245, 7.67025],
  },
  neptune: {
    base: [30.06992276, 0.00859048, 1.77004347, -55.12002969, 44.96476227, 131.78422574],
    rate: [0.00026291, 0.00005105, 0.00035372, 218.45945325, -0.32241464, -0.00508664],
    extra: [-0.00041348, 0.68346318, -0.10162547, 7.67025],
  },
  pluto: {
    base: [39.48211675, 0.2488273, 17.14001206, 238.92903833, 224.06891629, 110.30393684],
    rate: [-0.00031596, 0.0000517, 0.00004818, 145.20780515, -0.04062942, -0.01183482],
    extra: [-0.01262724, 0, 0, 0],
  },
};

function elementsAt(name: string, T: number): Elements {
  const spec = ELEMENTS[name]!;
  const [a, e, I, L, longPeri, longNode] = spec.base.map((value, index) => value + spec.rate[index]! * T);
  const extra = spec.extra ?? [0, 0, 0, 0];
  return { a, e, I, L, longPeri, longNode, b: extra[0], c: extra[1], s: extra[2], f: extra[3] };
}

function eccentricAnomaly(Mdeg: number, e: number): number {
  const wrapped = ((Mdeg + 180) % 360) - 180;
  const M = wrapped * DEG;
  let E = M;
  for (let i = 0; i < 24; i += 1) {
    const dE = (M - E + e * Math.sin(E)) / (1 - e * Math.cos(E));
    E += dE;
    if (Math.abs(dE) < 1e-10) break;
  }
  return E;
}

function heliocentric(el: Elements, T: number): { x: number; y: number; z: number } {
  const w = el.longPeri - el.longNode;
  let M = el.L - el.longPeri + el.b * T * T + el.c * cosd(el.f * T) + el.s * sind(el.f * T);
  M = norm360(M);
  const E = eccentricAnomaly(M, el.e);
  const xv = el.a * (Math.cos(E) - el.e);
  const yv = el.a * Math.sqrt(Math.max(0, 1 - el.e * el.e)) * Math.sin(E);
  const v = Math.atan2(yv, xv);
  const r = Math.hypot(xv, yv);
  const vw = v + w * DEG;
  const xh = r * (cosd(el.longNode) * Math.cos(vw) - sind(el.longNode) * Math.sin(vw) * cosd(el.I));
  const yh = r * (sind(el.longNode) * Math.cos(vw) + cosd(el.longNode) * Math.sin(vw) * cosd(el.I));
  const zh = r * Math.sin(vw) * sind(el.I);
  return { x: xh, y: yh, z: zh };
}

function longitudeOf(pos: { x: number; y: number }): number {
  return norm360(Math.atan2(pos.y, pos.x) / DEG);
}

function moonLongitude(d: number): number {
  const L = 218.3164477 + 13.17639648 * d;
  const M = 134.9633964 + 13.06499295 * d;
  const Ms = 357.5291092 + 0.98560028 * d;
  const D = 297.8501921 + 12.19074912 * d;
  const F = 93.272095 + 13.22935038 * d;
  const lon =
    L +
    6.288774 * sind(M) +
    1.274027 * sind(2 * D - M) +
    0.658314 * sind(2 * D) +
    0.213616 * sind(2 * M) -
    0.185596 * sind(Ms) -
    0.114336 * sind(2 * F) +
    0.058793 * sind(2 * D - 2 * M) +
    0.057066 * sind(2 * D - Ms - M) +
    0.053322 * sind(2 * D + M) +
    0.045758 * sind(2 * D - Ms) +
    0.040986 * sind(D);
  return norm360(lon);
}

function meanPerigee(T: number): number {
  return norm360(83.35324312 + 4069.01360937 * T - 0.010323725 * T * T - 0.000012507 * T * T * T);
}

export type BodyId =
  | "sun"
  | "moon"
  | "mercury"
  | "venus"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune"
  | "pluto"
  | "lilith"
  | "selene";

export interface BodyLongitude {
  id: BodyId;
  longitude: number;
}

function longitudesAtJd(jd: number): Record<BodyId, number> {
  const T = (jd - 2451545.0) / 36525;
  const d = jd - 2451545.0;
  const earth = heliocentric(elementsAt("earth", T), T);
  const result = {} as Record<BodyId, number>;
  const planets: Array<Exclude<BodyId, "sun" | "moon" | "lilith" | "selene">> = [
    "mercury",
    "venus",
    "mars",
    "jupiter",
    "saturn",
    "uranus",
    "neptune",
    "pluto",
  ];
  for (const id of planets) {
    const helio = heliocentric(elementsAt(id, T), T);
    result[id] = longitudeOf({ x: helio.x - earth.x, y: helio.y - earth.y });
  }
  result.sun = longitudeOf({ x: -earth.x, y: -earth.y });
  result.moon = moonLongitude(d);
  const perigee = meanPerigee(T);
  result.lilith = norm360(perigee + 180);
  result.selene = perigee;
  return result;
}

/**
 * Геоцентрические тропические долготы на полдень UTC.
 */
export function longitudesNoonUTC(date: LocalDate): Record<BodyId, number> {
  return longitudesAtJd(julianDayNoonUTC(date));
}

/**
 * Ретроградность: долгота на полдень меньше, чем за 12 часов до него.
 * Солнце, Лилит и Селена не ретроградны в этой модели.
 */
export function retrogradeFlags(date: LocalDate): Record<BodyId, boolean> {
  const jd = julianDayNoonUTC(date);
  const now = longitudesAtJd(jd);
  const earlier = longitudesAtJd(jd - 0.5);
  const flags = {} as Record<BodyId, boolean>;
  (Object.keys(now) as BodyId[]).forEach((id) => {
    if (id === "sun" || id === "lilith" || id === "selene") {
      flags[id] = false;
      return;
    }
    const delta = ((now[id] - earlier[id] + 540) % 360) - 180;
    flags[id] = delta < 0;
  });
  return flags;
}
