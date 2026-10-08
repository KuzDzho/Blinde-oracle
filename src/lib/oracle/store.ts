import { create } from "zustand";
import {
  addDays,
  datesEqual,
  lastSevenDays,
  toISODate,
  todayLocal,
  type LocalDate,
} from "./dates.ts";
import { generateNotificationText } from "./generator.ts";
import { UI, type AppLanguage } from "./i18n.ts";
import { ZodiacSign } from "./zodiac.ts";

const FAVORITES_KEY = "blind-oracle:favorites";
const SETTINGS_KEY = "blind-oracle:settings";
const LAST_NOTIFY_KEY = "blind-oracle:last-notify";

/**
 * Сохранённый прогноз: знак и дата. Текст всегда пересобирается генератором.
 */
export interface Favorite {
  sign: ZodiacSign;
  date: string;
  savedAt: number;
}

/**
 * Локальные настройки приложения.
 */
export interface OracleSettings {
  darkTheme: boolean;
  notificationsEnabled: boolean;
  notificationTime: string;
  mySign: ZodiacSign;
  language: AppLanguage;
}

const DEFAULT_SETTINGS: OracleSettings = {
  darkTheme: true,
  notificationsEnabled: false,
  notificationTime: "09:00",
  mySign: ZodiacSign.SCORPIO,
  language: "ru",
};

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function applyTheme(darkTheme: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = darkTheme ? "dark" : "light";
}

function applyLanguage(language: AppLanguage) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = language;
}

interface OracleState {
  ready: boolean;
  today: LocalDate;
  selectedDate: LocalDate;
  settings: OracleSettings;
  favorites: Favorite[];
  notice: string | null;
  hydrate: () => void;
  setSelectedDate: (date: LocalDate) => void;
  toggleFavorite: (sign: ZodiacSign, date: LocalDate) => void;
  isFavorite: (sign: ZodiacSign, date: LocalDate) => boolean;
  updateSettings: (patch: Partial<OracleSettings>) => void;
  dismissNotice: () => void;
  checkNotifications: () => void;
}

function favoriteId(sign: ZodiacSign, date: LocalDate | string): string {
  const iso = typeof date === "string" ? date : toISODate(date);
  return `${sign}:${iso}`;
}

/**
 * Клиентское состояние: дата, избранное, настройки. Без сервера.
 */
export const useOracleStore = create<OracleState>((set, get) => ({
  ready: false,
  today: todayLocal(),
  selectedDate: todayLocal(),
  settings: DEFAULT_SETTINGS,
  favorites: [],
  notice: null,

  hydrate: () => {
    if (get().ready) {
      maybeNotify(get().settings, get().today);
      return;
    }
    const today = todayLocal();
    const settings = {
      ...DEFAULT_SETTINGS,
      ...readJson<Partial<OracleSettings>>(SETTINGS_KEY, {}),
    };
    if (settings.language !== "en" && settings.language !== "ru") {
      settings.language = "ru";
    }
    const favorites = readJson<Favorite[]>(FAVORITES_KEY, []).filter(
      (item) => typeof item.sign === "string" && typeof item.date === "string",
    );
    applyTheme(settings.darkTheme);
    applyLanguage(settings.language);
    set({
      ready: true,
      today,
      selectedDate: today,
      settings,
      favorites,
    });
    maybeNotify(settings, today);
  },

  setSelectedDate: (date) => set({ selectedDate: date }),

  toggleFavorite: (sign, date) => {
    const iso = toISODate(date);
    const id = favoriteId(sign, iso);
    const current = get().favorites;
    const exists = current.some((item) => favoriteId(item.sign, item.date) === id);
    const next = exists
      ? current.filter((item) => favoriteId(item.sign, item.date) !== id)
      : [{ sign, date: iso, savedAt: Date.now() }, ...current];
    writeJson(FAVORITES_KEY, next);
    set({ favorites: next });
  },

  isFavorite: (sign, date) => {
    const id = favoriteId(sign, date);
    return get().favorites.some((item) => favoriteId(item.sign, item.date) === id);
  },

  updateSettings: (patch) => {
    const settings = { ...get().settings, ...patch };
    writeJson(SETTINGS_KEY, settings);
    if (patch.darkTheme !== undefined) applyTheme(settings.darkTheme);
    if (patch.language !== undefined) applyLanguage(settings.language);
    set({ settings });
    if (patch.notificationsEnabled || patch.notificationTime || patch.mySign) {
      maybeNotify(settings, get().today);
    }
  },

  dismissNotice: () => set({ notice: null }),

  checkNotifications: () => {
    maybeNotify(get().settings, get().today);
  },
}));

function parseTime(value: string): { hour: number; minute: number } {
  const [hourRaw, minuteRaw] = value.split(":");
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);
  return {
    hour: Number.isFinite(hour) ? hour : 9,
    minute: Number.isFinite(minute) ? minute : 0,
  };
}

function maybeNotify(settings: OracleSettings, today: LocalDate) {
  if (typeof window === "undefined" || !settings.notificationsEnabled) return;
  const { hour, minute } = parseTime(settings.notificationTime);
  const now = new Date();
  const minutesNow = now.getHours() * 60 + now.getMinutes();
  if (minutesNow < hour * 60 + minute) return;

  const iso = toISODate(today);
  const last = window.localStorage.getItem(LAST_NOTIFY_KEY);
  if (last === iso) return;

  const text = generateNotificationText(settings.mySign, today, settings.language);
  window.localStorage.setItem(LAST_NOTIFY_KEY, iso);
  useOracleStore.setState({ notice: text });

  if ("Notification" in window && Notification.permission === "granted") {
    try {
      new Notification(UI[settings.language].notifyTitle, { body: text });
    } catch {
      /* iframe or unsupported */
    }
  }
}

/**
 * Запрашивает разрешение на системные уведомления.
 */
export async function requestNotifyPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  try {
    const result = await Notification.requestPermission();
    return result === "granted";
  } catch {
    return false;
  }
}

/**
 * Семь дат календаря относительно «сегодня».
 */
export function calendarDays(today: LocalDate): LocalDate[] {
  return lastSevenDays(today);
}

export function isToday(date: LocalDate, today: LocalDate): boolean {
  return datesEqual(date, today);
}

export function shiftDate(date: LocalDate, delta: number): LocalDate {
  return addDays(date, delta);
}
