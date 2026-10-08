import type { AppLanguage } from "./i18n.ts";

const INFLUENCE_RU =
  /разбрасыва|раскачива|подталкива|размыва\w*\s+границ|переключает энерг|запускает процесс|активирует простран|выводит на (первый план|поверхность)|формирует фон|усиливает динамик|обостряет реакц/i;
const INFLUENCE_EN =
  /scatters attention|nudges you|stirs the situation|blurs (the )?boundar|switches (the )?energ|sets processes in motion|activates (the )?space|brings to the (fore|surface)|shapes the backdrop|amplifies the dynam/i;

const TIME_RU = /утром|вечером|к вечеру|в первой половине дня|во второй половине дня|в середине дня|ближе к/i;
const TIME_EN = /\bin the morning\b|\bin the evening\b|\btoward (morning|evening|midday)\b|\baround midday\b|\bin the (first|latter) half\b|\blater in the day\b/i;

const COMMAND_RU = /^(не |сделайте|проверьте|уточните|назовите|скажите|подождите|оставьте|выберите)/i;
const COMMAND_EN = /^(do not |don't |make sure|check |clarify |name |say |wait |leave |pick |choose )/i;

export function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?…])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function joinSentences(parts: readonly string[]): string {
  return parts
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => (/[.!?…]$/.test(part) ? part : `${part}.`))
    .join(" ");
}

function normalizeWords(sentence: string): string[] {
  return sentence
    .toLowerCase()
    .replace(/[«»""()—–:,;]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter((word) => word.length > 3);
}

function sharesImage(a: string, b: string): boolean {
  const left = new Set(normalizeWords(a));
  const right = normalizeWords(b);
  let overlap = 0;
  for (const word of right) {
    if (left.has(word)) overlap += 1;
  }
  return overlap >= 4;
}

function hasTime(sentence: string, language: AppLanguage): boolean {
  return language === "ru" ? TIME_RU.test(sentence) : TIME_EN.test(sentence);
}

function stripTime(sentence: string, language: AppLanguage): string {
  const next =
    language === "ru"
      ? sentence.replace(
          /^(утром|вечером|к вечеру|в первой половине дня|во второй половине дня|в середине дня|ближе к [^,]+),?\s*/i,
          "",
        )
      : sentence.replace(
          /^(in the morning|in the evening|toward (?:morning|evening|midday)|around midday|in the (?:first|latter) half of the day|later in the day),?\s*/i,
          "",
        );
  if (next === sentence) return sentence;
  return next.charAt(0).toUpperCase() + next.slice(1);
}

function isCommand(sentence: string, language: AppLanguage): boolean {
  return language === "ru" ? COMMAND_RU.test(sentence) : COMMAND_EN.test(sentence);
}

function hasInfluence(sentence: string, language: AppLanguage): boolean {
  return language === "ru" ? INFLUENCE_RU.test(sentence) : INFLUENCE_EN.test(sentence);
}

/**
 * Редакторская стадия: чистит черновик, не добавляя новых смыслов.
 * Может удалить предложение, убрать повтор времени и ослабить командный тон.
 */
export function editSection(
  text: string,
  language: AppLanguage,
  minSentences: number,
  keep?: readonly string[],
): string {
  let sentences = splitSentences(text);
  const mustKeep = (sentence: string) =>
    Boolean(keep?.some((needle) => needle && sentence.includes(needle)));

  const dropIfSafe = (predicate: (sentence: string) => boolean) => {
    const next = sentences.filter((sentence) => mustKeep(sentence) || !predicate(sentence));
    if (next.length >= minSentences) sentences = next;
  };

  dropIfSafe((sentence) => hasInfluence(sentence, language));

  const deduped: string[] = [];
  for (const sentence of sentences) {
    const previous = deduped[deduped.length - 1];
    if (previous && sharesImage(previous, sentence) && !mustKeep(sentence) && deduped.length + (sentences.length - deduped.length - 1) >= minSentences) {
      continue;
    }
    deduped.push(sentence);
  }
  if (deduped.length >= minSentences) sentences = deduped;

  let seenTime = false;
  sentences = sentences.map((sentence) => {
    if (!hasTime(sentence, language)) return sentence;
    if (!seenTime) {
      seenTime = true;
      return sentence;
    }
    if (mustKeep(sentence)) return sentence;
    return stripTime(sentence, language);
  });

  const commandCount = sentences.filter((sentence) => isCommand(sentence, language)).length;
  if (commandCount >= 2 && sentences.length > minSentences) {
    const lastCommand = [...sentences].reverse().findIndex((sentence) => isCommand(sentence, language) && !mustKeep(sentence));
    if (lastCommand >= 0) {
      const index = sentences.length - 1 - lastCommand;
      sentences = sentences.filter((_, current) => current !== index);
    }
  }

  return joinSentences(sentences);
}

export function editAdvice(text: string, rest: string, language: AppLanguage): string {
  const windows: string[] = [];
  const words = rest
    .toLowerCase()
    .replace(/[«»""()—–-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
  for (let i = 0; i <= words.length - 5; i += 1) {
    windows.push(words.slice(i, i + 5).join(" "));
  }
  const advice = text.toLowerCase();
  if (windows.some((chunk) => advice.includes(chunk))) {
    return text;
  }
  return text;
}
