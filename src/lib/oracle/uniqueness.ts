import type { ForecastContext } from "./context.ts";
import { dayNumber, toISODate, type LocalDate } from "./dates.ts";
import type { AppLanguage } from "./i18n.ts";
import { hashSeed } from "./rng.ts";
import {
  ADVICE_ITEMS,
  LOVE_EVENTS,
  MOODS,
  WORK_EVENTS,
  type AstroStyle,
  type Family,
  type VoiceId,
} from "./semantics.ts";
import type { Forecast } from "./types.ts";
import { ZODIAC_ORDER, type ZodiacSign } from "./zodiac.ts";

export type Domain =
  | "work"
  | "finance"
  | "relationship"
  | "social"
  | "family"
  | "personal"
  | "routine"
  | "emotional"
  | "decision"
  | "communication";

export interface DayTheme {
  id: string;
  family: Family;
  domains: readonly Domain[];
  moodId: string;
  workId: string;
  financeId: string;
  loveId: string;
  adviceId: string;
}

export interface Structure {
  id: string;
  voice: VoiceId;
  astroStyle: AstroStyle;
}

/**
 * Центральные сюжеты дня. Каждый прогноз берёт один сюжет
 * и 1–3 связанные сферы, а не случайный набор из всех каталогов.
 */
export const DAY_THEMES: readonly DayTheme[] = [
  { id: "one_task", family: "focus", domains: ["work", "decision"], moodId: "slower_day", workId: "too_many_tabs", financeId: "one_payment", loveId: "want_alone", adviceId: "compare_two" },
  { id: "spare_strength", family: "rest", domains: ["personal", "routine"], moodId: "early_fatigue", workId: "stay_late", financeId: "refuse_extra", loveId: "quiet_evening", adviceId: "keep_evening_empty" },
  { id: "plain_words", family: "honesty", domains: ["relationship", "communication"], moodId: "hard_to_hide", workId: "explain_choice", financeId: "money_talk", loveId: "say_the_want", adviceId: "short_truth" },
  { id: "hear_first", family: "listen", domains: ["relationship", "communication"], moodId: "easier_to_hear", workId: "simple_explain", financeId: "split_cost", loveId: "listen_no_fix", adviceId: "ask_one_question" },
  { id: "unfinished_return", family: "unfinished", domains: ["work", "personal"], moodId: "old_thread", workId: "old_task", financeId: "old_bill", loveId: "postponed_topic", adviceId: "close_old" },
  { id: "small_shift", family: "change", domains: ["work", "decision"], moodId: "small_shifts", workId: "plan_tweak", financeId: "price_shift", loveId: "reschedule", adviceId: "change_one_item" },
  { id: "hold_the_buy", family: "purchase", domains: ["finance", "decision"], moodId: "more_details", workId: "small_correction", financeId: "small_purchase", loveId: "small_gesture", adviceId: "sleep_on_buy" },
  { id: "calm_no", family: "boundary", domains: ["work", "personal"], moodId: "scattered_attention", workId: "extra_task", financeId: "borrow_ask", loveId: "name_limit", adviceId: "not_auto_yes" },
  { id: "late_answers", family: "wait", domains: ["communication", "work"], moodId: "slow_replies", workId: "late_reply", financeId: "late_payment", loveId: "no_instant_answer", adviceId: "leave_till_tomorrow" },
  { id: "first_piece", family: "start", domains: ["work", "personal"], moodId: "urge_to_begin", workId: "start_postponed", financeId: "set_aside", loveId: "write_first", adviceId: "first_step_only" },
  { id: "simple_care", family: "care", domains: ["relationship", "personal"], moodId: "simple_attention", workId: "ask_favor", financeId: "no_buy_today", loveId: "small_gesture", adviceId: "small_kindness" },
  { id: "short_crossings", family: "meeting", domains: ["social", "work"], moodId: "short_encounters", workId: "long_meeting", financeId: "compare_options", loveId: "reschedule", adviceId: "offer_new_time" },
  { id: "changed_terms", family: "offer", domains: ["work", "decision"], moodId: "changed_mind", workId: "extra_task", financeId: "split_cost", loveId: "direct_answer", adviceId: "not_auto_yes" },
  { id: "moved_deadline", family: "deadline", domains: ["work", "decision"], moodId: "more_details", workId: "sooner_deadline", financeId: "bill_error", loveId: "reschedule", adviceId: "say_what_moves" },
  { id: "mood_first", family: "mood", domains: ["emotional", "personal"], moodId: "feelings_first", workId: "misread_message", financeId: "refuse_extra", loveId: "stronger_than_words", adviceId: "notice_the_feeling" },
  { id: "more_messages", family: "social", domains: ["social", "communication"], moodId: "more_talks", workId: "unexpected_call", financeId: "money_talk", loveId: "write_first", adviceId: "write_first_short" },
  { id: "read_again", family: "misread", domains: ["communication", "work"], moodId: "more_details", workId: "misread_message", financeId: "bill_error", loveId: "message_misread", adviceId: "reread_before_reply" },
  { id: "help_nearby", family: "help", domains: ["social", "relationship"], moodId: "simple_attention", workId: "ask_favor", financeId: "borrow_ask", loveId: "need_support", adviceId: "do_not_fix" },
  { id: "inner_weather", family: "inner", domains: ["emotional", "personal"], moodId: "uneven_mood", workId: "admit_delay", financeId: "subscription", loveId: "want_alone", adviceId: "look_inward_once" },
  { id: "pace_the_day", family: "pace", domains: ["routine", "personal"], moodId: "slower_day", workId: "long_meeting", financeId: "no_buy_today", loveId: "quiet_evening", adviceId: "skip_grand" },
];

export const STRUCTURES: readonly Structure[] = [
  { id: "observe_mid", voice: "observational", astroStyle: "mid" },
  { id: "time_mid", voice: "timeLed", astroStyle: "mid" },
  { id: "question_mid", voice: "question", astroStyle: "mid" },
  { id: "contrast_mid", voice: "contrast", astroStyle: "mid" },
  { id: "direct_mid", voice: "direct", astroStyle: "mid" },
  { id: "situational_mid", voice: "situational", astroStyle: "mid" },
  { id: "observe_time", voice: "observational", astroStyle: "close" },
];

/** Смысловые группы заголовков: «день решений» не считается тремя разными. */
export const TITLE_SENSE: Record<string, string> = {
  precise_choice: "choice",
  clear_motives: "choice",
  quiet_resolve: "choice",
  hidden_openings: "opening",
  open_door: "opening",
  inner_impulse: "start",
  gathered_will: "will",
  careful_power: "will",
  silver_pause: "pause",
  slow_fire: "pause",
  hidden_reserve: "pause",
  quiet_clarity: "clarity",
  shadow_light: "clarity",
  deep_listening: "listen",
  inner_support: "care",
  stern_tenderness: "care",
  soft_strength: "care",
  sharp_edges: "edge",
  clear_refusal: "edge",
  fragile_bounds: "edge",
  subtle_shifts: "shift",
  reassembled_meaning: "shift",
  distant_echo: "echo",
  karmic_thread: "echo",
  inner_tide: "inner",
  careful_step: "step",
  subtle_alliance: "ally",
  far_horizon: "horizon",
};

export function latinIndex(
  length: number,
  day: number,
  signIndex: number,
  stride: number,
  step: number,
  attempt = 0,
): number {
  if (length <= 0) return 0;
  const value = day * stride + signIndex * step + attempt * 41;
  return ((value % length) + length) % length;
}

export function signIndexOf(sign: ZodiacSign): number {
  return ZODIAC_ORDER.indexOf(sign);
}

export function themeById(id: string): DayTheme {
  return DAY_THEMES.find((item) => item.id === id) ?? DAY_THEMES[0]!;
}

export function structureById(id: string): Structure {
  return STRUCTURES.find((item) => item.id === id) ?? STRUCTURES[0]!;
}

export function pickTheme(date: LocalDate, sign: ZodiacSign, attempt = 0): DayTheme {
  const index = latinIndex(DAY_THEMES.length, dayNumber(date), signIndexOf(sign), 1, 1, attempt);
  return DAY_THEMES[index]!;
}

export function pickStructure(date: LocalDate, sign: ZodiacSign, attempt = 0): Structure {
  const index = latinIndex(STRUCTURES.length, dayNumber(date), signIndexOf(sign), 2, 3, attempt);
  return STRUCTURES[index]!;
}

function familyOf(list: readonly { id: string; family: Family }[], id: string): Family {
  return list.find((item) => item.id === id)?.family ?? "focus";
}

/**
 * Компактный ключ сюжета: без полного текста.
 */
export function scenarioKey(ctx: Pick<ForecastContext, "dayThemeId" | "moodId" | "workId" | "financeId" | "loveId" | "adviceId" | "structureId">): string {
  return [
    ctx.dayThemeId,
    ctx.moodId,
    ctx.workId,
    ctx.financeId,
    ctx.loveId,
    ctx.adviceId,
    ctx.structureId,
  ].join("|");
}

/**
 * Смысловой отпечаток: семьи и сюжет, а не формулировки.
 */
export function semanticFingerprint(
  ctx: Pick<ForecastContext, "dayThemeId" | "moodId" | "workId" | "loveId" | "adviceId" | "structureId">,
): string {
  return [
    ctx.dayThemeId,
    familyOf(MOODS, ctx.moodId),
    familyOf(WORK_EVENTS, ctx.workId),
    familyOf(LOVE_EVENTS, ctx.loveId),
    familyOf(ADVICE_ITEMS, ctx.adviceId),
    ctx.structureId,
  ].join("|");
}

function normalizeSense(text: string): string {
  return text
    .toLowerCase()
    .replace(/не\s+стоит\s+тороп\w*/g, "RUSH")
    .replace(/не\s+спеш\w*/g, "RUSH")
    .replace(/не\s+тороп\w*/g, "RUSH")
    .replace(/дайте себе время/g, "RUSH")
    .replace(/do not rush/g, "RUSH")
    .replace(/don't rush/g, "RUSH")
    .replace(/slow down/g, "RUSH")
    .replace(/give yourself time/g, "RUSH")
    .replace(/[«»""()—–.,:;!?]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function contentHash(text: string): string {
  return (hashSeed(normalizeSense(text)) >>> 0).toString(16);
}

export function forecastBlob(forecast: Forecast): string {
  return [
    forecast.title,
    forecast.general,
    forecast.workAndFinance,
    forecast.loveAndRelationships,
    forecast.advice,
  ].join("\n");
}

export function titleSenseOf(titleId: string): string {
  return TITLE_SENSE[titleId] ?? titleId;
}

export interface UniquenessRecord {
  d: string;
  s: string;
  th: string;
  sc: string;
  st: string;
  ch: string;
  sf: string;
}

export function makeRecord(
  ctx: ForecastContext,
  forecast: Forecast,
  _language: AppLanguage,
): UniquenessRecord {
  return {
    d: toISODate(ctx.date),
    s: ctx.sign,
    th: ctx.dayThemeId,
    sc: scenarioKey(ctx),
    st: ctx.structureId,
    ch: contentHash(forecastBlob(forecast)),
    sf: semanticFingerprint(ctx),
  };
}

const LEDGER_KEY = "blind-oracle:uniqueness";
const memoryLedger = new Map<string, UniquenessRecord>();

function recordKey(date: string, sign: string): string {
  return `${date}|${sign}`;
}

/**
 * Журнал антидубликатов. Это не избранное и не текст прогнозов —
 * только компактные идентификаторы.
 */
export function rememberUniqueness(record: UniquenessRecord): void {
  memoryLedger.set(recordKey(record.d, record.s), record);
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(LEDGER_KEY);
    const parsed = raw ? (JSON.parse(raw) as { v: number; rec: UniquenessRecord[] }) : { v: 1, rec: [] };
    const next = parsed.rec.filter((item) => recordKey(item.d, item.s) !== recordKey(record.d, record.s));
    next.push(record);
    const trimmed = next.length > 8000 ? next.slice(next.length - 8000) : next;
    window.localStorage.setItem(LEDGER_KEY, JSON.stringify({ v: 1, rec: trimmed }));
  } catch {
    /* quota or private mode */
  }
}

export function uniquenessIssues(
  ctx: ForecastContext,
  used: {
    themes: Set<string>;
    scenario: Set<string>;
    fingerprints: Set<string>;
    titleSenses: Set<string>;
    advice: Set<string>;
    moods: Set<string>;
    work: Set<string>;
    love: Set<string>;
  },
): string[] {
  const issues: string[] = [];
  if (used.themes.has(ctx.dayThemeId)) issues.push("theme-repeat");
  if (used.moods.has(ctx.moodId)) issues.push("mood-repeat");
  if (used.work.has(ctx.workId)) issues.push("work-repeat");
  if (used.love.has(ctx.loveId)) issues.push("love-repeat");
  if (used.advice.has(ctx.adviceId)) issues.push("advice-repeat");
  if (used.scenario.has(scenarioKey(ctx))) issues.push("scenario-repeat");
  if (used.fingerprints.has(semanticFingerprint(ctx))) issues.push("semantic-repeat");
  if (used.titleSenses.has(titleSenseOf(ctx.titleId))) issues.push("title-sense-repeat");
  return issues;
}
