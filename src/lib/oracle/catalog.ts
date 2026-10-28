import type { ZodiacSign } from "./zodiac.ts";

/** Версия алгоритма входит в seed, чтобы смена логики давала новые тексты. */
export const ALGORITHM_VERSION = "v16";
export const GENERATOR_SALT = "BLIND_ORACLE";

export const TONE_IDS = [
  "caution",
  "initiative",
  "patience",
  "clarity",
  "depth",
  "openness",
  "restraint",
  "renewal",
] as const;
export type ToneId = (typeof TONE_IDS)[number];

export const PLANET_IDS = [
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
  "lilith",
  "selene",
] as const;
export type PlanetId = (typeof PLANET_IDS)[number];

export const HOUSE_IDS = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
] as const;
export type HouseId = (typeof HOUSE_IDS)[number];

export const ASPECT_IDS = [
  "trine",
  "sextile",
  "square",
  "opposition",
  "conjunction",
  "quincunx",
] as const;
export type AspectId = (typeof ASPECT_IDS)[number];

export const TIME_IDS = [
  "morning",
  "firstHalf",
  "midday",
  "secondHalf",
  "evening",
] as const;
export type TimeId = (typeof TIME_IDS)[number];

export const WORK_FOCUS_IDS = [
  "measured_decisions",
  "resource_care",
  "precise_talks",
  "narrow_plan",
  "reputation",
  "steady_pace",
  "clear_step",
  "rebuild_plan",
] as const;
export type WorkFocusId = (typeof WORK_FOCUS_IDS)[number];

export const LOVE_FOCUS_IDS = [
  "open_talk",
  "boundaries",
  "simple_care",
  "pause_before_words",
  "trust_space",
  "inner_dialogue",
] as const;
export type LoveFocusId = (typeof LOVE_FOCUS_IDS)[number];

export interface PlanetLex {
  id: PlanetId;
  ru: { nom: string; ins: string; gen: string };
  en: string;
}

export interface HouseLex {
  id: HouseId;
  ru: { prep: string; short: string };
  en: { prep: string; short: string };
}

export interface AspectLex {
  id: AspectId;
  ru: { nom: string; nomCap: string };
  en: { a: string; aCap: string };
}

export interface TimeLex {
  id: TimeId;
  ru: { start: string; acc: string };
  en: { start: string; acc: string };
}

export const PLANETS: Record<PlanetId, PlanetLex> = {
  mercury: { id: "mercury", ru: { nom: "Меркурий", ins: "Меркурием", gen: "Меркурия" }, en: "Mercury" },
  venus: { id: "venus", ru: { nom: "Венера", ins: "Венерой", gen: "Венеры" }, en: "Venus" },
  mars: { id: "mars", ru: { nom: "Марс", ins: "Марсом", gen: "Марса" }, en: "Mars" },
  jupiter: { id: "jupiter", ru: { nom: "Юпитер", ins: "Юпитером", gen: "Юпитера" }, en: "Jupiter" },
  saturn: { id: "saturn", ru: { nom: "Сатурн", ins: "Сатурном", gen: "Сатурна" }, en: "Saturn" },
  uranus: { id: "uranus", ru: { nom: "Уран", ins: "Ураном", gen: "Урана" }, en: "Uranus" },
  neptune: { id: "neptune", ru: { nom: "Нептун", ins: "Нептуном", gen: "Нептуна" }, en: "Neptune" },
  pluto: { id: "pluto", ru: { nom: "Плутон", ins: "Плутоном", gen: "Плутона" }, en: "Pluto" },
  lilith: { id: "lilith", ru: { nom: "Лилит", ins: "Лилит", gen: "Лилит" }, en: "Lilith" },
  selene: { id: "selene", ru: { nom: "Селена", ins: "Селеной", gen: "Селены" }, en: "Selene" },
};

export const HOUSES: Record<HouseId, HouseLex> = {
  I: { id: "I", ru: { prep: "I доме личности", short: "I дома" }, en: { prep: "the 1st house of self", short: "the 1st house" } },
  II: { id: "II", ru: { prep: "II доме ресурсов", short: "II дома" }, en: { prep: "the 2nd house of resources", short: "the 2nd house" } },
  III: { id: "III", ru: { prep: "III доме общения", short: "III дома" }, en: { prep: "the 3rd house of communication", short: "the 3rd house" } },
  IV: { id: "IV", ru: { prep: "IV доме дома и семьи", short: "IV дома" }, en: { prep: "the 4th house of home and family", short: "the 4th house" } },
  V: { id: "V", ru: { prep: "V доме творчества", short: "V дома" }, en: { prep: "the 5th house of creativity", short: "the 5th house" } },
  VI: { id: "VI", ru: { prep: "VI доме повседневности", short: "VI дома" }, en: { prep: "the 6th house of daily work", short: "the 6th house" } },
  VII: { id: "VII", ru: { prep: "VII доме отношений", short: "VII дома" }, en: { prep: "the 7th house of relationships", short: "the 7th house" } },
  VIII: { id: "VIII", ru: { prep: "VIII доме общих ресурсов", short: "VIII дома" }, en: { prep: "the 8th house of shared resources", short: "the 8th house" } },
  IX: { id: "IX", ru: { prep: "IX доме мировоззрения", short: "IX дома" }, en: { prep: "the 9th house of worldview", short: "the 9th house" } },
  X: { id: "X", ru: { prep: "X доме карьеры", short: "X дома" }, en: { prep: "the 10th house of career", short: "the 10th house" } },
  XI: { id: "XI", ru: { prep: "XI доме планов", short: "XI дома" }, en: { prep: "the 11th house of plans", short: "the 11th house" } },
  XII: { id: "XII", ru: { prep: "XII доме подсознания", short: "XII дома" }, en: { prep: "the 12th house of the inner world", short: "the 12th house" } },
};

export const ASPECTS: Record<AspectId, AspectLex> = {
  trine: { id: "trine", ru: { nom: "трин", nomCap: "Трин" }, en: { a: "a trine", aCap: "A trine" } },
  sextile: { id: "sextile", ru: { nom: "секстиль", nomCap: "Секстиль" }, en: { a: "a sextile", aCap: "A sextile" } },
  square: { id: "square", ru: { nom: "квадратура", nomCap: "Квадратура" }, en: { a: "a square", aCap: "A square" } },
  opposition: { id: "opposition", ru: { nom: "оппозиция", nomCap: "Оппозиция" }, en: { a: "an opposition", aCap: "An opposition" } },
  conjunction: { id: "conjunction", ru: { nom: "соединение", nomCap: "Соединение" }, en: { a: "a conjunction", aCap: "A conjunction" } },
  quincunx: { id: "quincunx", ru: { nom: "квиконс", nomCap: "Квиконс" }, en: { a: "a quincunx", aCap: "A quincunx" } },
};

export const TIMES: Record<TimeId, TimeLex> = {
  morning: { id: "morning", ru: { start: "Утром", acc: "утро" }, en: { start: "In the morning", acc: "the morning" } },
  firstHalf: {
    id: "firstHalf",
    ru: { start: "В первой половине дня", acc: "первую половину дня" },
    en: { start: "In the first half of the day", acc: "the first half of the day" },
  },
  midday: { id: "midday", ru: { start: "В середине дня", acc: "середину дня" }, en: { start: "Around midday", acc: "midday" } },
  secondHalf: {
    id: "secondHalf",
    ru: { start: "Во второй половине дня", acc: "вторую половину дня" },
    en: { start: "In the latter part of the day", acc: "the latter part of the day" },
  },
  evening: { id: "evening", ru: { start: "Вечером", acc: "вечер" }, en: { start: "In the evening", acc: "the evening" } },
};

export const TITLES: readonly { id: string; ru: string; en: string }[] = [
  { id: "hidden_openings", ru: "День скрытых возможностей", en: "A Day of Hidden Opportunities" },
  { id: "subtle_shifts", ru: "День небольших перемен", en: "A Day of Small Changes" },
  { id: "inner_impulse", ru: "День, когда хочется начать", en: "A Day to Make a Start" },
  { id: "quiet_clarity", ru: "День ясных мыслей", en: "A Day of Clear Thinking" },
  { id: "sharp_edges", ru: "День острых разговоров", en: "A Day of Direct Talks" },
  { id: "soft_strength", ru: "День спокойных решений", en: "A Day of Calm Decisions" },
  { id: "distant_echo", ru: "День старых вопросов", en: "A Day of Old Questions" },
  { id: "precise_choice", ru: "День точного выбора", en: "A Day of a Careful Choice" },
  { id: "shadow_light", ru: "День ясных деталей", en: "A Day of Clear Details" },
  { id: "gathered_will", ru: "День собранности", en: "A Day to Stay Focused" },
  { id: "fragile_bounds", ru: "День личных границ", en: "A Day of Personal Boundaries" },
  { id: "deep_listening", ru: "День внимательного слуха", en: "A Day of Careful Listening" },
  { id: "slow_fire", ru: "День без спешки", en: "A Day Without Haste" },
  { id: "silver_pause", ru: "День нужной паузы", en: "A Day for a Needed Pause" },
  { id: "karmic_thread", ru: "День незакрытых дел", en: "A Day of Unfinished Business" },
  { id: "open_door", ru: "День новых вариантов", en: "A Day of New Options" },
  { id: "inner_tide", ru: "День сильных чувств", en: "A Day of Strong Feelings" },
  { id: "stern_tenderness", ru: "День тёплой прямоты", en: "A Day of Warm Directness" },
  { id: "hidden_reserve", ru: "День, когда лучше беречь силы", en: "A Day to Save Your Strength" },
  { id: "clear_refusal", ru: "День ясного отказа", en: "A Day of a Clear No" },
  { id: "subtle_alliance", ru: "День договорённостей", en: "A Day of Agreements" },
  { id: "reassembled_meaning", ru: "День нового взгляда", en: "A Day of a Fresh Look" },
  { id: "careful_step", ru: "День осторожного шага", en: "A Day for a Careful Step" },
  { id: "quiet_resolve", ru: "День спокойного решения", en: "A Day of a Quiet Decision" },
  { id: "far_horizon", ru: "День дальних планов", en: "A Day of Longer Plans" },
  { id: "inner_support", ru: "День, когда нужна опора", en: "A Day When You Need Support" },
  { id: "clear_motives", ru: "День честных намерений", en: "A Day of Honest Intentions" },
  { id: "careful_power", ru: "День без лишнего давления", en: "A Day Without Extra Pressure" },
];

export const ADVICE: readonly { id: string; tone: ToneId; ru: string; en: string }[] = [
  { id: "pause_answer", tone: "caution", ru: "Не торопитесь с важным решением — сначала соберите нужную информацию.", en: "Do not rush an important decision — gather the information you need first." },
  { id: "soft_boundary", tone: "restraint", ru: "Скажите спокойное «нет», если просьба уже слишком много от вас требует.", en: "Say a calm no if the request already asks too much of you." },
  { id: "precision_over_scale", tone: "clarity", ru: "Сделайте одно дело точно, вместо того чтобы начинать сразу несколько.", en: "Finish one thing carefully instead of starting several at once." },
  { id: "trust_pause", tone: "patience", ru: "Если сомневаетесь, возьмите паузу: сегодня она поможет больше, чем спешка.", en: "If you are unsure, pause: it will help more today than hurrying." },
  { id: "say_less", tone: "clarity", ru: "Говорите короче: так вас скорее поймут правильно.", en: "Say less, so you are more likely to be understood." },
  { id: "one_step", tone: "initiative", ru: "Сделайте один конкретный шаг и на этом остановитесь.", en: "Take one concrete step, then stop." },
  { id: "leave_question", tone: "patience", ru: "Оставьте один вопрос без ответа до завтра — это нормально.", en: "Leave one question unanswered until tomorrow — that is fine." },
  { id: "silence_ally", tone: "depth", ru: "Если ситуация вызывает сомнения, сначала выслушайте другую сторону.", en: "If the situation feels doubtful, listen to the other side first." },
  { id: "small_promise", tone: "restraint", ru: "Дайте небольшое обещание и выполните его полностью.", en: "Make a small promise and keep it completely." },
  { id: "clarity_then_gesture", tone: "clarity", ru: "Сначала разберитесь в фактах, потом действуйте.", en: "Get the facts straight, then act." },
  { id: "attention_not_fix", tone: "depth", ru: "Не пытайтесь сразу всё исправить: иногда человеку нужно просто внимание.", en: "Do not try to fix everything at once: sometimes the other person only needs attention." },
  { id: "short_decision", tone: "initiative", ru: "Примите короткое решение и не объясняйте его слишком долго.", en: "Make a short decision and do not over-explain it." },
  { id: "guard_strength", tone: "caution", ru: "Берегите силы: не беритесь сегодня за всё сразу.", en: "Save your strength: do not take on everything at once today." },
  { id: "honest_no", tone: "restraint", ru: "Сегодня достаточно одного честного «нет».", en: "One honest no is enough today." },
  { id: "fact_not_shadow", tone: "clarity", ru: "Опирайтесь на факты, а не на тревожные догадки.", en: "Rely on the facts, not on anxious guesses." },
  { id: "depth_not_speed", tone: "depth", ru: "Лучше понять ситуацию до конца, чем решить её слишком быстро.", en: "It is better to understand the situation fully than to settle it too fast." },
  { id: "body_before_thought", tone: "patience", ru: "Перед трудным разговором остановитесь, выдохните и только потом отвечайте.", en: "Before a hard conversation, pause, breathe, and only then answer." },
  { id: "narrow_day", tone: "restraint", ru: "Сузьте список дел: лучше сделать меньше, но довести до конца.", en: "Shorten the to-do list: do less, but finish it." },
  { id: "not_all_doors", tone: "caution", ru: "Не соглашайтесь сразу на все предложения — выберите одно.", en: "Do not say yes to every offer at once — choose one." },
  { id: "own_rhythm", tone: "patience", ru: "Работайте в своём темпе, даже если вокруг все спешат.", en: "Work at your own pace, even if everyone around you is rushing." },
  { id: "support_then_risk", tone: "caution", ru: "Сначала уточните детали, потом рискуйте деньгами или временем.", en: "Check the details first, then risk money or time." },
  { id: "name_the_wish", tone: "openness", ru: "Скажите вслух, чего вы хотите, прежде чем настаивать.", en: "Say out loud what you want before you insist on it." },
  { id: "speak_plain", tone: "openness", ru: "Скажите прямо то, что уже давно понятно.", en: "Say plainly what has already become clear." },
  { id: "one_honest_talk", tone: "openness", ru: "Один честный разговор сегодня полезнее длинной переписки.", en: "One honest conversation is more useful today than a long exchange of messages." },
  { id: "invite_not_push", tone: "openness", ru: "Предложите поговорить, но не требуйте ответа сразу.", en: "Invite a conversation, but do not demand an answer at once." },
  { id: "fresh_look", tone: "renewal", ru: "Посмотрите на привычную задачу иначе: старый способ может уже не работать.", en: "Look at a familiar task differently: the old way may no longer work." },
  { id: "change_one_form", tone: "renewal", ru: "Измените один пункт плана — этого может быть достаточно.", en: "Change one item in the plan — that may be enough." },
  { id: "leave_old_script", tone: "renewal", ru: "Не повторяйте вчерашний сценарий только потому, что он привычен.", en: "Do not repeat yesterday’s pattern only because it is familiar." },
  { id: "quiet_beginning", tone: "renewal", ru: "Начните заново спокойно, без громких обещаний.", en: "Start again quietly, without loud promises." },
  { id: "act_once", tone: "initiative", ru: "Сделайте одно действие и дайте ему сработать, не добавляя сразу второе.", en: "Do one thing and let it work before adding a second." },
  { id: "short_yes", tone: "initiative", ru: "Если вы согласны — скажите короткое и честное «да».", en: "If you agree, say a short and honest yes." },
  { id: "listen_inward", tone: "depth", ru: "Сначала поймите, чего хотите вы сами, и только потом отвечайте другим.", en: "First understand what you want, then answer other people." },
];

export const TONE_CLAUSES: Record<ToneId, readonly { id: string; ru: string; en: string }[]> = {
  caution: [
    { id: "c1", ru: "не принимайте важное решение на бегу", en: "do not make an important decision in a rush" },
    { id: "c2", ru: "сначала соберите информацию, потом отвечайте", en: "gather the information first, then answer" },
    { id: "c3", ru: "сегодня лучше подождать, чем ошибиться из-за спешки", en: "it is better to wait today than to err because of haste" },
  ],
  initiative: [
    { id: "i1", ru: "сделайте один понятный шаг вместо десяти обещаний", en: "take one clear step instead of ten promises" },
    { id: "i2", ru: "сегодня можно начать дело, которое вы откладывали", en: "today you can start the task you have been putting off" },
    { id: "i3", ru: "действуйте коротко и по делу", en: "act briefly and to the point" },
  ],
  patience: [
    { id: "p1", ru: "дайте себе больше времени на важные решения", en: "give yourself more time for important decisions" },
    { id: "p2", ru: "не торопите результат — сегодня спешка мало что даст", en: "do not hurry the result — haste will not help much today" },
    { id: "p3", ru: "берегите силы и не беритесь сразу за всё", en: "save your strength and do not take on everything at once" },
  ],
  clarity: [
    { id: "k1", ru: "говорите короче и по существу", en: "speak more briefly and stick to the point" },
    { id: "k2", ru: "отделите факты от догадок, прежде чем решать", en: "separate facts from guesses before you decide" },
    { id: "k3", ru: "сегодня важны детали, а не громкие планы", en: "details matter more today than big announcements" },
  ],
  depth: [
    { id: "d1", ru: "прислушайтесь к своей интуиции и не заглушайте сомнения", en: "listen to your intuition and do not silence your doubts" },
    { id: "d2", ru: "не отмахивайтесь от того, что давно вас беспокоит", en: "do not brush aside what has been bothering you for a while" },
    { id: "d3", ru: "лучше не торопиться и понять, чего вы на самом деле хотите", en: "it is better not to rush and to understand what you actually want" },
  ],
  openness: [
    { id: "o1", ru: "честный разговор снимет лишнее напряжение", en: "an honest conversation will ease needless tension" },
    { id: "o2", ru: "сегодня полезно сказать вслух то, что уже понятно", en: "it helps today to say out loud what is already clear" },
    { id: "o3", ru: "не держите всё в себе — спокойно проговорите ситуацию", en: "do not keep everything in — talk the situation through calmly" },
  ],
  restraint: [
    { id: "r1", ru: "не обещайте больше, чем можете сделать", en: "do not promise more than you can do" },
    { id: "r2", ru: "сегодня полезно сказать «нет», если сил не хватает", en: "it is useful today to say no if you do not have the strength" },
    { id: "r3", ru: "сузьте список дел и доведите одно до конца", en: "shorten the list and finish one thing" },
  ],
  renewal: [
    { id: "n1", ru: "можно поменять привычный порядок, если он уже не работает", en: "you can change the usual order if it no longer works" },
    { id: "n2", ru: "посмотрите на ситуацию иначе — старый способ может не подойти", en: "look at the situation differently — the old way may not fit" },
    { id: "n3", ru: "сегодня уместно начать заново, без лишнего шума", en: "today is a good day to start again, without extra noise" },
  ],
};

export const SIGN_LEAD_RU: Record<ZodiacSign, string> = {
  ARIES: "Овнам сегодня стоит обратить внимание",
  TAURUS: "Тельцам важно не торопиться",
  GEMINI: "Близнецам может пригодиться спокойный разговор",
  CANCER: "Ракам стоит прислушаться к своим чувствам",
  LEO: "Львам будет проще, если не торопить события",
  VIRGO: "Девам сегодня полезно всё проверить ещё раз",
  LIBRA: "Весам важно не спешить с выбором",
  SCORPIO: "Скорпионам стоит внимательнее отнестись к разговорам",
  SAGITTARIUS: "Стрельцам полезно не разбрасываться",
  CAPRICORN: "Козерогам следует сначала уточнить план",
  AQUARIUS: "Водолеям стоит сначала ясно сформулировать мысль",
  PISCES: "Рыбам стоит доверять своей интуиции",
};

export const SIGN_LEAD_EN: Record<ZodiacSign, string> = {
  ARIES: "Aries would do well to notice this today",
  TAURUS: "Taurus may benefit from slowing down",
  GEMINI: "Gemini may find a calm conversation especially useful",
  CANCER: "Cancer would do well to listen to their feelings",
  LEO: "Leo may find the day easier if they do not rush events",
  VIRGO: "Virgo is likely to benefit from checking the details again",
  LIBRA: "Libra would do well not to hurry a choice",
  SCORPIO: "Scorpio may want to pay closer attention to conversations",
  SAGITTARIUS: "Sagittarius may benefit from focusing on one thing",
  CAPRICORN: "Capricorn would do well to clarify the plan first",
  AQUARIUS: "Aquarius may want to put the idea into clear words first",
  PISCES: "Pisces would do well to trust their intuition",
};

export const SIGN_TONES: Record<ZodiacSign, readonly ToneId[]> = {
  ARIES: ["initiative", "clarity", "renewal"],
  TAURUS: ["patience", "restraint", "caution"],
  GEMINI: ["openness", "clarity", "initiative"],
  CANCER: ["caution", "depth", "patience"],
  LEO: ["initiative", "openness", "clarity"],
  VIRGO: ["clarity", "restraint", "caution"],
  LIBRA: ["openness", "patience", "clarity"],
  SCORPIO: ["depth", "caution", "restraint"],
  SAGITTARIUS: ["renewal", "initiative", "openness"],
  CAPRICORN: ["restraint", "clarity", "caution"],
  AQUARIUS: ["renewal", "openness", "initiative"],
  PISCES: ["depth", "patience", "openness"],
};

export const TONE_PLANETS: Record<ToneId, readonly PlanetId[]> = {
  caution: ["saturn", "mercury", "neptune", "selene"],
  initiative: ["mars", "jupiter", "uranus", "mercury"],
  patience: ["venus", "saturn", "selene", "jupiter"],
  clarity: ["mercury", "saturn", "uranus", "selene"],
  depth: ["pluto", "lilith", "neptune", "saturn"],
  openness: ["mercury", "venus", "jupiter", "uranus"],
  restraint: ["saturn", "pluto", "mercury", "lilith"],
  renewal: ["uranus", "jupiter", "pluto", "neptune"],
};

export const TONE_HOUSES: Record<ToneId, readonly HouseId[]> = {
  caution: ["VI", "XII", "IV", "VIII"],
  initiative: ["I", "X", "V", "XI"],
  patience: ["II", "IV", "VI", "XI"],
  clarity: ["III", "VI", "X", "IX"],
  depth: ["VIII", "XII", "IV", "IX"],
  openness: ["III", "VII", "XI", "V"],
  restraint: ["X", "II", "VI", "VIII"],
  renewal: ["XI", "IX", "I", "V"],
};

export const TONE_ASPECTS: Record<ToneId, readonly AspectId[]> = {
  caution: ["sextile", "quincunx", "opposition", "square"],
  initiative: ["trine", "conjunction", "sextile", "square"],
  patience: ["trine", "sextile", "conjunction", "quincunx"],
  clarity: ["sextile", "trine", "conjunction", "opposition"],
  depth: ["opposition", "square", "conjunction", "quincunx"],
  openness: ["trine", "sextile", "conjunction", "opposition"],
  restraint: ["square", "opposition", "quincunx", "sextile"],
  renewal: ["trine", "sextile", "conjunction", "square"],
};

export const TONE_WORK: Record<ToneId, readonly WorkFocusId[]> = {
  caution: ["measured_decisions", "resource_care", "steady_pace"],
  initiative: ["clear_step", "precise_talks", "rebuild_plan"],
  patience: ["resource_care", "steady_pace", "narrow_plan"],
  clarity: ["precise_talks", "measured_decisions", "reputation"],
  depth: ["narrow_plan", "resource_care", "measured_decisions"],
  openness: ["precise_talks", "reputation", "clear_step"],
  restraint: ["narrow_plan", "resource_care", "measured_decisions"],
  renewal: ["rebuild_plan", "clear_step", "reputation"],
};

export const TONE_LOVE: Record<ToneId, readonly LoveFocusId[]> = {
  caution: ["pause_before_words", "boundaries", "inner_dialogue"],
  initiative: ["open_talk", "simple_care", "trust_space"],
  patience: ["simple_care", "trust_space", "pause_before_words"],
  clarity: ["open_talk", "boundaries", "pause_before_words"],
  depth: ["inner_dialogue", "trust_space", "simple_care"],
  openness: ["open_talk", "trust_space", "simple_care"],
  restraint: ["boundaries", "pause_before_words", "inner_dialogue"],
  renewal: ["simple_care", "open_talk", "trust_space"],
};

/** Совместимые вторые планеты: не дублируют первую и держат тон. */
export const SECOND_PLANETS: Record<ToneId, readonly PlanetId[]> = {
  caution: ["saturn", "mercury", "selene", "pluto", "neptune"],
  initiative: ["mars", "jupiter", "mercury", "uranus", "venus"],
  patience: ["venus", "saturn", "jupiter", "selene", "neptune"],
  clarity: ["mercury", "saturn", "uranus", "selene", "jupiter"],
  depth: ["pluto", "neptune", "lilith", "saturn", "selene"],
  openness: ["venus", "mercury", "jupiter", "uranus", "mars"],
  restraint: ["saturn", "pluto", "mercury", "lilith", "selene"],
  renewal: ["uranus", "jupiter", "neptune", "pluto", "venus"],
};
