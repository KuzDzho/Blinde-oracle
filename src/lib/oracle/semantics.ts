import type { ToneId } from "./catalog.ts";

export type Family =
  | "detail"
  | "pace"
  | "social"
  | "inner"
  | "change"
  | "unfinished"
  | "rest"
  | "focus"
  | "speak"
  | "listen"
  | "boundary"
  | "start"
  | "care"
  | "wait"
  | "meeting"
  | "deadline"
  | "purchase"
  | "offer"
  | "misread"
  | "alone"
  | "reconcile"
  | "honesty"
  | "help"
  | "money"
  | "mood"
  | "decision";

export const VOICE_IDS = [
  "observational",
  "situational",
  "direct",
  "question",
  "contrast",
  "timeLed",
] as const;
export type VoiceId = (typeof VOICE_IDS)[number];

export const ASTRO_STYLES = ["lead", "mid", "close"] as const;
export type AstroStyle = (typeof ASTRO_STYLES)[number];

export const WORK_LEADS = ["work", "finance"] as const;
export type WorkLead = (typeof WORK_LEADS)[number];

export const EXTRA_FOLLOWS = ["work", "finance"] as const;
export type ExtraFollow = (typeof EXTRA_FOLLOWS)[number];

export interface Bilingual {
  ru: string;
  en: string;
}

export interface MoodItem {
  id: string;
  family: Family;
  tones: readonly ToneId[];
  phrase: Bilingual;
  open: Bilingual;
  /** Продолжение той же истории после «когда планета в доме» — не глагол влияния планеты. */
  setting: Bilingual;
  coda: Bilingual;
  notify: Bilingual;
}

export interface EventItem {
  id: string;
  family: Family;
  tones: readonly ToneId[];
  main: Bilingual;
  follow: Bilingual;
}

export interface AdviceItem {
  id: string;
  family: Family;
  tones: readonly ToneId[];
  text: Bilingual;
}

export const MOODS: readonly MoodItem[] = [
  {
    id: "more_details",
    family: "detail",
    tones: ["clarity", "caution", "restraint"],
    phrase: { ru: "с большим числом мелких деталей, чем обычно", en: "with more small details than usual" },
    open: { ru: "пригодится немного больше внимания к мелочам", en: "will need a little more attention to small things" },
    setting: { ru: "всплывает уточнение, которого не было в плане", en: "a small detail surfaces that was not in the plan" },
    coda: { ru: "Весь день из-за этого перестраивать не нужно: достаточно небольшого запаса времени.", en: "There is no need to rebuild the whole day; a little spare time will do." },
    notify: { ru: "мелочей будет больше, чем кажется с утра", en: "there will be more small things than the morning suggests" },
  },
  {
    id: "slower_day",
    family: "pace",
    tones: ["patience", "caution", "restraint"],
    phrase: { ru: "спокойнее и медленнее, чем выглядит со стороны", en: "calmer and slower than it looks from the outside" },
    open: { ru: "день пойдёт спокойнее, чем кажется по списку дел", en: "will have a slower day than the to-do list suggests" },
    setting: { ru: "дела занимают столько времени, сколько им нужно", en: "tasks take the time they actually need" },
    coda: { ru: "Спешка со стороны почти ничего не ускоряет.", en: "Other people’s hurry will hardly speed anything up." },
    notify: { ru: "день будет спокойнее, чем кажется", en: "the day will be calmer than it looks" },
  },
  {
    id: "more_talks",
    family: "social",
    tones: ["openness", "clarity", "initiative"],
    phrase: { ru: "через короткие разговоры и неожиданные сообщения", en: "through short talks and unexpected messages" },
    open: { ru: "предстоит больше коротких разговоров, чем планировалось", en: "will have more short conversations than planned" },
    setting: { ru: "они встраиваются между делами и занимают больше места, чем кажется", en: "they slip in between tasks and take more room than they seem to" },
    coda: { ru: "На часть из них хватит короткого ответа.", en: "A short reply will do for some of them." },
    notify: { ru: "разговоров будет больше, чем вы ждали", en: "there will be more conversations than you expected" },
  },
  {
    id: "uneven_mood",
    family: "inner",
    tones: ["depth", "patience", "caution"],
    phrase: { ru: "с переменчивым настроением без явной причины", en: "with a shifting mood and no obvious reason" },
    open: { ru: "настроение будет меняться без явной причины", en: "will find their mood shifting without an obvious reason" },
    setting: { ru: "искать отдельную причину для каждого сдвига почти бесполезно", en: "looking for a separate reason for each shift is almost useless" },
    coda: { ru: "Короткая пауза перед ответом обычно всё ставит на место.", en: "A brief pause before you answer usually sets things right." },
    notify: { ru: "настроение будет меняться без причины", en: "your mood may shift without a reason" },
  },
  {
    id: "small_shifts",
    family: "change",
    tones: ["renewal", "initiative", "clarity"],
    phrase: { ru: "через небольшие сдвиги в уже привычных делах", en: "through small shifts in familiar matters" },
    open: { ru: "будет заметно, что привычные обстоятельства чуть сдвинулись", en: "will notice familiar circumstances shifting a little" },
    setting: { ru: "пара привычных пунктов выглядит иначе, чем вчера", en: "a couple of familiar points look different from yesterday" },
    coda: { ru: "Речь скорее о точечной правке, а не о полной перестройке дня.", en: "It is more a small adjustment than a full rebuild of the day." },
    notify: { ru: "привычные обстоятельства чуть сдвинутся", en: "familiar circumstances will shift a little" },
  },
  {
    id: "old_thread",
    family: "unfinished",
    tones: ["depth", "caution", "renewal"],
    phrase: { ru: "с возвращением вчерашнего незакрытого вопроса", en: "with yesterday’s unfinished question coming back" },
    open: { ru: "вернётся вопрос, который вчера так и не закрыли", en: "will see a question return that was left open yesterday" },
    setting: { ru: "он занимает место, даже если его не трогать", en: "it takes up space even if you leave it alone" },
    coda: { ru: "Коротко назвать его вслух обычно легче, чем снова откладывать.", en: "Naming it out loud is usually easier than putting it off again." },
    notify: { ru: "вернётся незакрытый вчерашний вопрос", en: "yesterday’s open question will return" },
  },
  {
    id: "early_fatigue",
    family: "rest",
    tones: ["patience", "restraint", "caution"],
    phrase: { ru: "с более ранней усталостью, чем обычно", en: "with tiredness arriving earlier than usual" },
    open: { ru: "силы закончатся раньше обычного", en: "will run out of strength earlier than usual" },
    setting: { ru: "пустое место в расписании оказывается нужнее ещё одного пункта", en: "an empty slot in the schedule matters more than one more task" },
    coda: { ru: "Добирать день до краёв мало что даёт.", en: "Filling the day to the brim will give you little." },
    notify: { ru: "силы закончатся раньше обычного", en: "your strength will run out earlier than usual" },
  },
  {
    id: "scattered_attention",
    family: "focus",
    tones: ["clarity", "restraint", "initiative"],
    phrase: { ru: "с рассеянным вниманием, если дел слишком много", en: "with scattered attention if there is too much going on" },
    open: { ru: "внимание будет рассыпаться, если держать в голове сразу несколько тем", en: "will find attention scattering if too many topics sit in mind at once" },
    setting: { ru: "проще выбрать одно занятие, чем пытаться удержать все сразу", en: "it is easier to pick one task than to hold them all at once" },
    coda: { ru: "То, что не успеется, спокойно переносится дальше.", en: "What does not get done can quietly move to later." },
    notify: { ru: "внимание будет рассеиваться, если дел слишком много", en: "attention will scatter if you take on too much" },
  },
  {
    id: "easier_to_hear",
    family: "listen",
    tones: ["depth", "openness", "patience"],
    phrase: { ru: "с большим вниманием к чужим словам, чем к своим объяснениям", en: "with more attention to other people’s words than to your own explanations" },
    open: { ru: "будет проще услышать другого человека, чем объяснить себя", en: "will find it easier to hear another person than to explain themselves" },
    setting: { ru: "разговор складывается лучше, когда меньше объясняешь и больше слышишь", en: "the talk goes better when you explain less and hear more" },
    coda: { ru: "Один короткий вопрос часто закрывает тему целиком.", en: "One short question often settles the whole topic." },
    notify: { ru: "важнее услышать, чем объяснять", en: "it matters more to listen than to explain" },
  },
  {
    id: "changed_mind",
    family: "offer",
    tones: ["caution", "openness", "renewal"],
    phrase: { ru: "с людьми, которые передумают после согласия", en: "with people who change their mind after agreeing" },
    open: { ru: "кто-то передумает после того, как уже согласился", en: "will meet someone who changes their mind after already agreeing" },
    setting: { ru: "условия, на которые уже кивнули, вдруг выглядят иначе", en: "terms that already had a yes suddenly look different" },
    coda: { ru: "Спокойный вопрос, что изменилось, обычно проясняет дело быстрее спора.", en: "A calm question about what changed usually clarifies things faster than an argument." },
    notify: { ru: "кто-то передумает после согласия", en: "someone will change their mind after agreeing" },
  },
  {
    id: "feelings_first",
    family: "mood",
    tones: ["depth", "openness", "patience"],
    phrase: { ru: "с более острой реакцией на мелочи, чем обычно", en: "with a sharper reaction to small things than usual" },
    open: { ru: "на мелочи можно реагировать острее обычного", en: "will react more sharply than usual to small things" },
    setting: { ru: "реакция приходит быстрее, чем слова", en: "the reaction arrives faster than the words" },
    coda: { ru: "Если что-то заденет, пауза перед разговором помогает не сказать лишнего.", en: "If something stings, a pause before talking helps you not say too much." },
    notify: { ru: "легко острее обычного реагировать на мелочи", en: "you may react more sharply than usual to small things" },
  },
  {
    id: "short_encounters",
    family: "meeting",
    tones: ["initiative", "openness", "clarity"],
    phrase: { ru: "через короткие встречи и случайные пересечения", en: "through short encounters and chance crossings" },
    open: { ru: "день сложится из коротких встреч и случайных пересечений", en: "will have a day made of short encounters and chance crossings" },
    setting: { ru: "одно из таких пересечений оказывается полезнее запланированного созвона", en: "one of those crossings proves more useful than a planned call" },
    coda: { ru: "Короткий разговор в дверях может оказаться как раз тем, что было нужно.", en: "A short talk in a doorway may be exactly what was needed." },
    notify: { ru: "день сложится из коротких встреч", en: "the day will be made of short encounters" },
  },
  {
    id: "hard_to_hide",
    family: "honesty",
    tones: ["openness", "clarity", "depth"],
    phrase: { ru: "с трудностью скрывать то, что вы на самом деле думаете", en: "with it being harder to hide what you actually think" },
    open: { ru: "скрыть то, что вы думаете, будет сложнее", en: "will find it harder to hide what they actually think" },
    setting: { ru: "прямые слова даются проще, чем вид, будто всё равно", en: "plain words come more easily than pretending you do not care" },
    coda: { ru: "Короткой честной фразы обычно достаточно.", en: "A short honest sentence is usually enough." },
    notify: { ru: "скрывать свои мысли будет сложнее", en: "it will be harder to hide your thoughts" },
  },
  {
    id: "slow_replies",
    family: "wait",
    tones: ["patience", "caution", "restraint"],
    phrase: { ru: "с ответами, которые приходят медленнее обычного", en: "with replies that arrive more slowly than usual" },
    open: { ru: "ответы будут приходить медленнее обычного", en: "will wait longer than usual for replies" },
    setting: { ru: "пока письма нет, соседняя задача продвигается лучше бесконечной проверки входящих", en: "while the message is missing, a neighbouring task moves faster than checking the inbox" },
    coda: { ru: "Спешка здесь почти ничего не меняет.", en: "Hurrying changes almost nothing here." },
    notify: { ru: "ответы будут приходить медленнее обычного", en: "replies will arrive more slowly than usual" },
  },
  {
    id: "simple_attention",
    family: "care",
    tones: ["patience", "openness", "depth"],
    phrase: { ru: "через простые знаки внимания, а не через большие жесты", en: "through simple signs of attention rather than grand gestures" },
    open: { ru: "простое внимание нужнее больших жестов", en: "will find that simple attention matters more than grand gestures" },
    setting: { ru: "короткого сообщения или обычного вопроса бывает достаточно", en: "a short message or an ordinary question is often enough" },
    coda: { ru: "Громкий жест здесь ни к чему.", en: "A loud gesture is not needed here." },
    notify: { ru: "нужнее простое внимание, чем большие жесты", en: "simple attention matters more than grand gestures" },
  },
  {
    id: "urge_to_begin",
    family: "start",
    tones: ["initiative", "renewal", "clarity"],
    phrase: { ru: "с желанием начать что-то, что давно откладывалось", en: "with a wish to start something long postponed" },
    open: { ru: "захочется начать то, что давно откладывалось", en: "will feel like starting something that has been postponed for a while" },
    setting: { ru: "первый шаг в отложенном деле даётся легче, чем весь план целиком", en: "the first step on a postponed task comes more easily than the whole plan" },
    coda: { ru: "Остальное можно не расписывать сразу.", en: "The rest does not have to be mapped out at once." },
    notify: { ru: "появится желание начать отложенное дело", en: "you may want to start a postponed task" },
  },
  {
    id: "skip_noise",
    family: "focus",
    tones: ["restraint", "clarity", "caution"],
    phrase: { ru: "с желанием отложить лишние сообщения на потом", en: "with a wish to leave extra messages for later" },
    open: { ru: "будет проще не отвечать на каждое сообщение сразу", en: "will find it easier not to answer every message at once" },
    setting: { ru: "тишина между сообщениями оказывается полезнее быстрой реакции", en: "the quiet between messages turns out more useful than a quick reply" },
    coda: { ru: "Мир не развалится, если одно письмо подождёт.", en: "The world will not fall apart if one email waits." },
    notify: { ru: "не на все сообщения нужно отвечать сразу", en: "not every message needs an answer at once" },
  },
  {
    id: "stay_put",
    family: "focus",
    tones: ["restraint", "patience", "clarity"],
    phrase: { ru: "через желание остаться на одном месте и довести дело", en: "through a wish to stay in one place and finish a task" },
    open: { ru: "полезнее не метаться между делами, а закончить одно", en: "will do better staying with one task than switching around" },
    setting: { ru: "одно спокойное занятие даёт больше, чем три начатых", en: "one calm task gives more than three started ones" },
    coda: { ru: "Переключение само по себе сегодня мало что даёт.", en: "Switching itself will not help much today." },
    notify: { ru: "лучше довести одно дело, чем начинать три", en: "better to finish one task than start three" },
  },
  {
    id: "outing_moved",
    family: "change",
    tones: ["patience", "renewal", "caution"],
    phrase: { ru: "с переносом простой договорённости на другое время", en: "with a simple plan moving to another time" },
    open: { ru: "одна из простых договорённостей сдвинется", en: "one simple arrangement will shift" },
    setting: { ru: "перенос выглядит досадным, но день от этого не ломается", en: "the shift feels annoying, but it does not break the day" },
    coda: { ru: "Другой час часто оказывается даже удобнее.", en: "Another hour often turns out more convenient." },
    notify: { ru: "простая договорённость может сдвинуться", en: "a simple plan may shift" },
  },
  {
    id: "body_slower",
    family: "rest",
    tones: ["patience", "depth", "restraint"],
    phrase: { ru: "через более медленный ритм тела, чем у расписания", en: "through a slower body rhythm than the schedule wants" },
    open: { ru: "телу понадобится более спокойный темп, чем в календаре", en: "the body will want a calmer pace than the calendar" },
    setting: { ru: "короткая пауза возвращает ясность лучше, чем ещё одна задача", en: "a short pause brings clarity back better than one more task" },
    coda: { ru: "Сегодня сила не в том, чтобы перетерпеть усталость.", en: "Strength today is not about pushing through tiredness." },
    notify: { ru: "телу понадобится более спокойный темп", en: "the body will want a calmer pace" },
  },
  {
    id: "home_pull",
    family: "care",
    tones: ["patience", "depth", "restraint"],
    phrase: { ru: "с желанием заняться домашними делами, а не громкими планами", en: "with a wish to deal with home things, not loud plans" },
    open: { ru: "домашние мелочи будут важнее дальних планов", en: "small home matters will matter more than distant plans" },
    setting: { ru: "порядок в обычных вещах снимает больше напряжения, чем новый проект", en: "order in ordinary things eases more tension than a new project" },
    coda: { ru: "Большие решения можно спокойно отложить.", en: "Big decisions can calmly wait." },
    notify: { ru: "домашние дела сегодня важнее дальних планов", en: "home matters matter more than distant plans today" },
  },
  {
    id: "money_second",
    family: "money",
    tones: ["caution", "clarity", "patience"],
    phrase: { ru: "с ощущением, что деньги сегодня не главная тема", en: "with a sense that money is not the main topic today" },
    open: { ru: "денежный вопрос отойдёт на второй план", en: "a money question will step into the background" },
    setting: { ru: "сначала проясняется дело, и только потом сумма", en: "the matter becomes clear first, and only then the amount" },
    coda: { ru: "Платить «заодно» сегодня незачем.", en: "There is no need to pay “while you are at it” today." },
    notify: { ru: "с деньгами лучше не решать на бегу", en: "money is better not decided on the run" },
  },
  {
    id: "easy_no",
    family: "boundary",
    tones: ["restraint", "clarity", "openness"],
    phrase: { ru: "через более лёгкий отказ, чем обычно", en: "through an easier no than usual" },
    open: { ru: "короткое «нет» сегодня даётся проще", en: "a short no will come more easily today" },
    setting: { ru: "отказ без длинного оправдания звучит спокойнее, чем кажется", en: "a refusal without a long excuse sounds calmer than it seems" },
    coda: { ru: "Объяснять отказ трижды не нужно.", en: "You do not need to explain a no three times." },
    notify: { ru: "короткий отказ сегодня прозвучит спокойно", en: "a short no will sound calm today" },
  },
  {
    id: "two_choices",
    family: "decision",
    tones: ["clarity", "caution", "initiative"],
    phrase: { ru: "через выбор между двумя понятными вариантами", en: "through a choice between two clear options" },
    open: { ru: "придётся выбрать один из двух понятных вариантов", en: "will have to choose one of two clear options" },
    setting: { ru: "третьего пути сегодня скорее нет, и это упрощает дело", en: "there is probably no third path today, and that simplifies things" },
    coda: { ru: "Дольше сравнивать почти нечего.", en: "There is almost nothing left to compare at length." },
    notify: { ru: "выбор будет между двумя понятными вариантами", en: "the choice will be between two clear options" },
  },
  {
    id: "old_contact",
    family: "social",
    tones: ["openness", "renewal", "caution"],
    phrase: { ru: "через неожиданное сообщение от человека из прошлого", en: "through an unexpected message from someone in the past" },
    open: { ru: "может отозваться человек, с которым давно не было связи", en: "someone you have not heard from in a while may get in touch" },
    setting: { ru: "короткий ответ уместнее, чем сразу восстанавливать всю историю", en: "a short reply fits better than rebuilding the whole history at once" },
    coda: { ru: "Необязательно встречаться или всё выяснять сегодня.", en: "You do not have to meet or settle everything today." },
    notify: { ru: "может отозваться человек из прошлого", en: "someone from the past may get in touch" },
  },
  {
    id: "quiet_pride",
    family: "focus",
    tones: ["clarity", "patience", "restraint"],
    phrase: { ru: "через маленькое законченное дело, которое хочется заметить", en: "through a small finished thing worth noticing" },
    open: { ru: "хватит маленького законченного дела, без большой победы", en: "a small finished task will be enough, without a big win" },
    setting: { ru: "законченный кусок работы успокаивает сильнее нового списка", en: "a finished piece of work settles you more than a new list" },
    coda: { ru: "Хвалить себя за это не смешно — это честный итог дня.", en: "It is not silly to notice that — it is an honest result of the day." },
    notify: { ru: "хватит маленького законченного дела", en: "a small finished task will be enough" },
  },
  {
    id: "paper_trail",
    family: "detail",
    tones: ["clarity", "caution", "patience"],
    phrase: { ru: "через бумаги, справки и мелкие формальности", en: "through papers, forms and small formalities" },
    open: { ru: "всплывёт бумага или формальность, которую лучше закрыть сразу", en: "a paper or formality will surface that is better closed at once" },
    setting: { ru: "десять минут на документ экономят вечер нервов", en: "a few minutes on a document save an evening of nerves" },
    coda: { ru: "Откладывать такие вещи сегодня особенно неудобно.", en: "Putting such things off is especially inconvenient today." },
    notify: { ru: "лучше сразу закрыть одну бумажную мелочь", en: "better to close one paper task at once" },
  },
  {
    id: "shared_table",
    family: "care",
    tones: ["openness", "patience", "depth"],
    phrase: { ru: "через простой совместный стол, а не через серьёзный разговор", en: "through a simple shared meal, not a serious talk" },
    open: { ru: "проще провести время за общим столом, чем начинать трудный разговор", en: "it will be easier to share a table than to start a hard talk" },
    setting: { ru: "обычный обед или чай снимает напряжение лучше спора", en: "an ordinary lunch or tea eases tension better than an argument" },
    coda: { ru: "Серьёзные темы можно не поднимать за едой.", en: "Serious topics can wait until after the meal." },
    notify: { ru: "проще просто поесть вместе, чем всё обсуждать", en: "easier to eat together than to discuss everything" },
  },
  {
    id: "late_morning",
    family: "pace",
    tones: ["patience", "restraint", "caution"],
    phrase: { ru: "с более медленным утром, чем хотелось бы", en: "with a slower morning than you would like" },
    open: { ru: "утро начнётся позже и соннее, чем в плане", en: "morning will start later and sleepier than planned" },
    setting: { ru: "первый час лучше не забивать сложными разговорами", en: "the first hour is better without difficult conversations" },
    coda: { ru: "День ещё успеет собраться — не с утра.", en: "The day will still come together — just not at dawn." },
    notify: { ru: "утро будет медленнее, чем в плане", en: "morning will be slower than planned" },
  },
  {
    id: "small_fix",
    family: "unfinished",
    tones: ["initiative", "clarity", "patience"],
    phrase: { ru: "через желание починить одну мелкую сломанную вещь", en: "through a wish to fix one small broken thing" },
    open: { ru: "захочется починить одну мелкую вещь, которая давно мешает", en: "will want to fix one small thing that has been in the way" },
    setting: { ru: "маленький ремонт возвращает ощущение порядка", en: "a small repair brings back a sense of order" },
    coda: { ru: "Не нужно затевать большой ремонт вокруг этого.", en: "There is no need to start a big overhaul around it." },
    notify: { ru: "захочется починить одну мелкую вещь", en: "you may want to fix one small thing" },
  },
  {
    id: "hold_news",
    family: "wait",
    tones: ["caution", "patience", "restraint"],
    phrase: { ru: "с желанием не рассказывать новость сразу всем", en: "with a wish not to tell the news to everyone at once" },
    open: { ru: "новость лучше не разносить сразу по всем чатам", en: "it is better not to spread news across every chat at once" },
    setting: { ru: "пауза перед сообщением помогает сказать ровно столько, сколько нужно", en: "a pause before sending helps you say only as much as needed" },
    coda: { ru: "Не всё, что стало известно утром, нужно озвучивать днём.", en: "Not everything learned in the morning needs to be said in the afternoon." },
    notify: { ru: "новость лучше не рассказывать сразу всем", en: "better not to tell the news to everyone at once" },
  },
  {
    id: "keep_word",
    family: "honesty",
    tones: ["restraint", "clarity", "patience"],
    phrase: { ru: "через маленькое обещание, которое пора выполнить", en: "through a small promise that is due" },
    open: { ru: "всплывёт маленькое обещание, которое пора закрыть", en: "a small promise will surface that is time to keep" },
    setting: { ru: "короткое выполненное слово стоит больше нового плана", en: "a short kept word is worth more than a new plan" },
    coda: { ru: "Новых обещаний сегодня лучше не набирать.", en: "Better not to take on new promises today." },
    notify: { ru: "маленькое обещание пора выполнить", en: "a small promise is due" },
  },
  {
    id: "new_route",
    family: "change",
    tones: ["renewal", "initiative", "clarity"],
    phrase: { ru: "через другой маршрут в привычном дне", en: "through a different route in a familiar day" },
    open: { ru: "привычный маршрут дня захочется чуть изменить", en: "the usual route of the day will want a small change" },
    setting: { ru: "другая дорога или другой порядок дел освежает голову", en: "another road or another order of tasks clears the head" },
    coda: { ru: "Менять всё расписание незачем — хватит одного звена.", en: "There is no need to change the whole schedule — one link is enough." },
    notify: { ru: "привычный маршрут дня можно чуть изменить", en: "the usual route of the day can shift a little" },
  },
  {
    id: "ask_openly",
    family: "help",
    tones: ["openness", "initiative", "depth"],
    phrase: { ru: "через более простую просьбу о помощи, чем обычно", en: "through an easier request for help than usual" },
    open: { ru: "попросить о конкретной помощи будет проще, чем делать всё самим", en: "asking for a specific kind of help will be easier than doing it all alone" },
    setting: { ru: "короткая просьба экономит вечер лучше гордого молчания", en: "a short request saves the evening better than proud silence" },
    coda: { ru: "Люди чаще готовы помочь, чем кажется в голове.", en: "People are more ready to help than it seems in your head." },
    notify: { ru: "попросить о конкретной помощи будет проще", en: "asking for specific help will be easier" },
  },
  {
    id: "finish_half",
    family: "unfinished",
    tones: ["renewal", "clarity", "initiative"],
    phrase: { ru: "через желание закрыть дело, которое бросили на середине", en: "through a wish to close a task left half-done" },
    open: { ru: "вернётся дело, которое осталось на середине", en: "a task left half-done will come back" },
    setting: { ru: "второй заход оказывается короче, чем страх перед ним", en: "the second pass turns out shorter than the fear of it" },
    coda: { ru: "Доводить до идеала не нужно — хватит рабочего конца.", en: "It does not have to be perfect — a working finish is enough." },
    notify: { ru: "вернётся дело, брошенное на середине", en: "a half-done task will come back" },
  },
  {
    id: "weather_inside",
    family: "mood",
    tones: ["depth", "patience", "openness"],
    phrase: { ru: "через смену настроения без большой внешней причины", en: "through a mood shift without a big outer reason" },
    open: { ru: "настроение может смениться без явной причины", en: "mood may shift without an obvious reason" },
    setting: { ru: "достаточно назвать себе чувство и не искать виноватых", en: "it is enough to name the feeling to yourself and not look for someone to blame" },
    coda: { ru: "Это не повод устраивать серьёзный разговор со всеми.", en: "That is not a reason to start a serious talk with everyone." },
    notify: { ru: "настроение может смениться без явной причины", en: "mood may shift without an obvious reason" },
  },
];

export const WORK_EVENTS: readonly EventItem[] = [
  {
    id: "plan_tweak",
    family: "change",
    tones: ["renewal", "clarity", "initiative"],
    main: { ru: "На работе коллега предложит поправить уже согласованный план.", en: "At work a colleague will suggest adjusting a plan that was already agreed." },
    follow: { ru: "Обычно это точечные правки, и если из-за них всплывут лишние траты, появится повод спокойно переспросить.", en: "It is usually a few targeted edits, and if extra costs appear, there will be a reason to ask again calmly." },
  },
  {
    id: "long_meeting",
    family: "meeting",
    tones: ["patience", "openness", "caution"],
    main: { ru: "Совещание или созвон затянется дольше, чем стоит в календаре.", en: "A meeting or call will run longer than the calendar says." },
    follow: { ru: "Заранее понятый главный вопрос поможет не утонуть в побочных темах — и не оплачивать из-за этого лишнее в тот же день.", en: "Knowing the main question in advance helps you not get lost in side topics, and not pay for extras the same day because of it." },
  },
  {
    id: "sooner_deadline",
    family: "deadline",
    tones: ["caution", "clarity", "initiative"],
    main: { ru: "Кто-то попросит сдать задачу раньше оговорённого срока.", en: "Someone will ask you to deliver a task earlier than agreed." },
    follow: { ru: "Перед согласием полезно сказать, что из текущего списка тогда сдвинется, и стоит ли ускорение отдельной оплаты.", en: "Before agreeing, it helps to say what else on the list would then move, and whether a rush fee is even worth it." },
  },
  {
    id: "extra_task",
    family: "offer",
    tones: ["restraint", "caution", "initiative"],
    main: { ru: "Вам предложат взять ещё одну задачу «совсем ненадолго».", en: "You will be offered one more task that is supposedly brief." },
    follow: { ru: "Имеет смысл уточнить, когда это реально нужно, а если намекают на отдельную оплату — назвать сумму до начала.", en: "It is worth asking when it is actually needed, and if extra pay is hinted at, naming the amount before you start." },
  },
  {
    id: "old_task",
    family: "unfinished",
    tones: ["renewal", "depth", "restraint"],
    main: { ru: "Появится шанс закрыть старую рабочую задачу, которая давно висит в списке.", en: "There will be a chance to close an old work task that has been sitting on the list." },
    follow: { ru: "Даже короткое продвижение по ней полезнее новой большой идеи, а крупные траты лучше пока не планировать.", en: "Even a short step on it is more useful than a new big idea, and large expenses can wait." },
  },
  {
    id: "explain_choice",
    family: "speak",
    tones: ["clarity", "openness", "initiative"],
    main: { ru: "На работе понадобится коротко объяснить своё решение.", en: "At work you will need to explain your decision in a few words." },
    follow: { ru: "Хватит фактов и одного аргумента; если речь о деньгах, ясная цифра сильнее длинной защитной речи.", en: "Facts and one argument are enough; if money is involved, a clear figure is stronger than a long defence." },
  },
  {
    id: "too_many_tabs",
    family: "focus",
    tones: ["restraint", "clarity", "patience"],
    main: { ru: "В работе легко открыть сразу слишком много задач и ни одну не закрыть.", en: "At work it is easy to open too many tasks at once and finish none of them." },
    follow: { ru: "Выберите одну, которую можно закончить до вечера. С тратами тот же принцип: один необходимый платёж, остальное подождёт.", en: "Pick one you can finish by evening. The same with money: settle one necessary payment and leave the rest." },
  },
  {
    id: "start_postponed",
    family: "start",
    tones: ["initiative", "renewal", "clarity"],
    main: { ru: "Удобно начать рабочее дело, которое вы откладывали.", en: "It is a good day to start a work task you have been putting off." },
    follow: { ru: "Не нужно делать его целиком: хватит первого понятного куска, без громкого финансового плана.", en: "You do not need to finish it all: the first clear piece is enough, without a grand spending plan." },
  },
  {
    id: "ask_favor",
    family: "help",
    tones: ["openness", "patience", "restraint"],
    main: { ru: "Коллега попросит о небольшой услуге в неудобный момент.", en: "A colleague will ask a small favour at an inconvenient moment." },
    follow: { ru: "Можно помочь коротко или назвать другое время — оба ответа нормальны. Если дело связано с деньгами, сумму лучше сказать сразу.", en: "You can help briefly or name another time — both answers are fine. If money is involved, it is better to name the amount at once." },
  },
  {
    id: "misread_message",
    family: "misread",
    tones: ["caution", "clarity", "openness"],
    main: { ru: "Рабочее сообщение легко понять не так, особенно если оно короткое и сухое.", en: "A work message is easy to misread, especially if it is short and dry." },
    follow: { ru: "Перед тем как обижаться, уточните одну фразу. То же со счетами: сумму лучше перечитать до резкого ответа.", en: "Before you take offence, clarify one sentence. The same with bills: reread the amount before a sharp reply." },
  },
  {
    id: "late_reply",
    family: "wait",
    tones: ["patience", "caution", "restraint"],
    main: { ru: "Ответ от рабочего партнёра или заказчика задержится.", en: "A reply from a work partner or client will be delayed." },
    follow: { ru: "Пока его нет, соседняя задача продвигается лучше бесконечной проверки почты. Ожидаемый перевод тоже может прийти позже.", en: "While it is missing, a neighbouring task moves faster than checking the inbox. An expected transfer may also arrive later." },
  },
  {
    id: "admit_delay",
    family: "honesty",
    tones: ["clarity", "openness", "caution"],
    main: { ru: "Придётся честно сказать, что срок по работе сдвигается.", en: "You will need to say honestly that a work deadline is moving." },
    follow: { ru: "Короткое предупреждение выглядит сильнее молчания до последнего. Если из-за сдвига меняется оплата, это лучше проговорить в том же разговоре.", en: "A short warning looks stronger than silence until the last minute. If the delay changes the pay, talk that through in the same conversation." },
  },
  {
    id: "stay_late",
    family: "boundary",
    tones: ["restraint", "caution", "patience"],
    main: { ru: "Вас ненавязчиво попросят задержаться после работы.", en: "You will be asked, without much fuss, to stay after work." },
    follow: { ru: "Если день уже полный, спокойный отказ не разрушит отношения. Сверхурочные без договорённости о компенсации брать не обязательно.", en: "If the day is already full, a calm refusal will not ruin the relationship. You do not have to take overtime without an agreement on compensation." },
  },
  {
    id: "simple_explain",
    family: "care",
    tones: ["patience", "openness", "clarity"],
    main: { ru: "Кто-то из коллег попросит объяснить простую вещь ещё раз.", en: "A colleague will ask you to explain a simple thing once more." },
    follow: { ru: "Короткий повтор сэкономит обоим время завтра. Оплачивать за других «заодно» не обязательно.", en: "Repeating it briefly will save you both time tomorrow. You do not have to pay for others “while you are at it”." },
  },
  {
    id: "small_correction",
    family: "detail",
    tones: ["clarity", "caution", "restraint"],
    main: { ru: "В рабочем документе или письме найдётся небольшая неточность.", en: "A small inaccuracy will show up in a work document or email." },
    follow: { ru: "Исправить её сейчас проще, чем делать вид, что никто не заметит. То же со счётом: на ошибку в сумме взгляните сразу.", en: "Fixing it now is easier than pretending no one will notice. The same with a bill: look at an error in the amount at once." },
  },
  {
    id: "unexpected_call",
    family: "social",
    tones: ["initiative", "openness", "caution"],
    main: { ru: "Возможен незапланированный рабочий звонок или короткое «на минутку».", en: "An unplanned work call or a quick “got a minute?” will appear." },
    follow: { ru: "Если вы заняты, назвать другое время для разговора — не грубость. По телефону легко согласиться на лишний расход, поэтому цифры лучше смотреть отдельно.", en: "If you are busy, naming another time to talk is not rudeness. It is easy to agree to an extra expense on the phone, so the numbers are better looked at separately." },
  },
];

export const FINANCE_EVENTS: readonly EventItem[] = [
  {
    id: "small_purchase",
    family: "purchase",
    tones: ["caution", "patience", "renewal"],
    main: { ru: "По деньгам возможна небольшая незапланированная покупка.", en: "With money, a small unplanned purchase may come up." },
    follow: { ru: "Если она не срочная, её можно спокойно отложить.", en: "If it is not urgent, it can calmly wait." },
  },
  {
    id: "late_payment",
    family: "wait",
    tones: ["patience", "caution", "restraint"],
    main: { ru: "Ожидаемый платёж или перевод может прийти позже, чем хотелось бы.", en: "An expected payment or transfer may arrive later than you would like." },
    follow: { ru: "Не стоит строить на нём крупные планы до подтверждения.", en: "Do not build large plans on it until it is confirmed." },
  },
  {
    id: "split_cost",
    family: "offer",
    tones: ["openness", "caution", "restraint"],
    main: { ru: "Кто-то может предложить разделить расход или скинуться на общее дело.", en: "Someone may suggest splitting a cost or chipping in for something shared." },
    follow: { ru: "Имеет смысл сразу назвать сумму, которую вам комфортно дать.", en: "It is worth naming right away the amount you are comfortable giving." },
  },
  {
    id: "subscription",
    family: "money",
    tones: ["restraint", "clarity", "caution"],
    main: { ru: "Может напомниться подписка, регулярный платёж или мелкий автоматический расход.", en: "A subscription, a regular payment or a small automatic charge may come to mind." },
    follow: { ru: "Удобный момент решить, нужна ли она вам ещё.", en: "A convenient moment to decide whether you still need it." },
  },
  {
    id: "refuse_extra",
    family: "boundary",
    tones: ["restraint", "caution", "patience"],
    main: { ru: "Появится соблазн согласиться на доплату или «чуть более дорогой» вариант.", en: "There will be a temptation to agree to a surcharge or a “slightly more expensive” option." },
    follow: { ru: "Базовый вариант часто ничем не хуже.", en: "The basic option is often no worse." },
  },
  {
    id: "bill_error",
    family: "detail",
    tones: ["clarity", "caution", "restraint"],
    main: { ru: "В счёте, чеке или переводе может оказаться мелкая ошибка.", en: "A small error may appear in a bill, a receipt or a transfer." },
    follow: { ru: "На неё стоит взглянуть сразу, пока сумма не потерялась среди других трат.", en: "It is worth looking at it at once, before the amount disappears among other expenses." },
  },
  {
    id: "price_shift",
    family: "change",
    tones: ["renewal", "caution", "clarity"],
    main: { ru: "Цена или условие покупки могут измениться в последний момент.", en: "A price or a purchase term may change at the last moment." },
    follow: { ru: "Не стесняйтесь переспросить, действует ли прежнее условие.", en: "Do not hesitate to ask whether the previous term still applies." },
  },
  {
    id: "set_aside",
    family: "start",
    tones: ["initiative", "restraint", "patience"],
    main: { ru: "Можно отложить небольшую сумму, даже если план большой экономии ещё не готов.", en: "You can set aside a small amount, even if a big saving plan is not ready yet." },
    follow: { ru: "Даже небольшая сумма будет полезнее громкого плана.", en: "Even a small amount is more useful than a loud plan." },
  },
  {
    id: "borrow_ask",
    family: "help",
    tones: ["caution", "openness", "restraint"],
    main: { ru: "Вас могут попросить в долг или, наоборот, напомнить о старом долге.", en: "You may be asked for a loan, or reminded of an old one." },
    follow: { ru: "Ответ лучше дать ясный и без обиняков, даже если он не самый удобный.", en: "It is better to give a clear answer without hints, even if it is not the most comfortable one." },
  },
  {
    id: "old_bill",
    family: "unfinished",
    tones: ["caution", "restraint", "depth"],
    main: { ru: "Может всплыть старый неоплаченный счёт или забытое списание.", en: "An old unpaid bill or a forgotten charge may surface." },
    follow: { ru: "Закрыть его спокойнее, чем снова откладывать «на потом».", en: "Closing it is calmer than putting it off “for later” again." },
  },
  {
    id: "one_payment",
    family: "focus",
    tones: ["restraint", "clarity", "patience"],
    main: { ru: "Из денежных дел лучше выбрать один необходимый платёж и не размазывать внимание на остальные.", en: "Of the money tasks, it is better to choose one necessary payment and not spread attention across the rest." },
    follow: { ru: "Остальное спокойно можно оставить на потом.", en: "The rest can calmly wait." },
  },
  {
    id: "no_buy_today",
    family: "pace",
    tones: ["patience", "restraint", "caution"],
    main: { ru: "Покупать что-то крупное нет особой нужды, даже если кажется, что «сейчас самое время».", en: "There is no real need to buy anything large, even if it feels like “the right moment”." },
    follow: { ru: "Ночь на размышление почти ничего не стоит и часто экономит деньги.", en: "A night to think costs almost nothing and often saves money." },
  },
  {
    id: "compare_options",
    family: "detail",
    tones: ["clarity", "caution", "initiative"],
    main: { ru: "Перед покупкой стоит сравнить два варианта, а не брать первый попавшийся.", en: "Before a purchase it is worth comparing two options rather than taking the first one." },
    follow: { ru: "Разница может быть небольшой, но именно она важна.", en: "The difference may be small, but that is exactly what matters." },
  },
  {
    id: "money_talk",
    family: "honesty",
    tones: ["openness", "clarity", "caution"],
    main: { ru: "Может понадобиться спокойно проговорить с кем-то денежный вопрос.", en: "You may need to talk through a money question with someone, calmly." },
    follow: { ru: "Лучше назвать конкретную сумму, чем ходить вокруг да около.", en: "It is better to name a specific amount than to talk around it." },
  },
];

export const LOVE_EVENTS: readonly EventItem[] = [
  {
    id: "direct_answer",
    family: "speak",
    tones: ["openness", "clarity", "initiative"],
    main: { ru: "Близкий человек ждёт более прямого ответа, чем обычно.", en: "Someone close is waiting for a more direct answer than usual." },
    follow: { ru: "Хватит короткой фразы — длинные объяснения не обязательны.", en: "A short sentence will do — long explanations are not required." },
  },
  {
    id: "postponed_topic",
    family: "unfinished",
    tones: ["depth", "openness", "renewal"],
    main: { ru: "Появится возможность спокойно обсудить то, что давно откладывали.", en: "There will be a chance to calmly discuss something that has been postponed for a while." },
    follow: { ru: "Не нужно решать всё за один раз: достаточно назвать суть.", en: "You do not need to settle everything at once: naming the point is enough." },
  },
  {
    id: "small_gesture",
    family: "care",
    tones: ["patience", "openness", "renewal"],
    main: { ru: "Близкому человеку хватит простого внимания — без долгих объяснений.", en: "Someone close needs simple attention, without a long explanation." },
    follow: { ru: "Сообщение, чашка чая или короткая прогулка скажут достаточно.", en: "A message, a cup of tea or a short walk will say enough." },
  },
  {
    id: "message_misread",
    family: "misread",
    tones: ["caution", "clarity", "openness"],
    main: { ru: "Сообщение от близкого человека легко прочитать резче, чем было задумано.", en: "A message from someone close is easy to read as harsher than it was meant." },
    follow: { ru: "Перед ответом перечитайте его или спросите, так ли это было сказано.", en: "Before answering, reread it or ask whether that is what was meant." },
  },
  {
    id: "want_alone",
    family: "alone",
    tones: ["depth", "patience", "restraint"],
    main: { ru: "Вам захочется немного больше личного пространства.", en: "You will want a little more personal space." },
    follow: { ru: "Если получится, оставьте вечер для отдыха без лишних разговоров.", en: "If you can, leave the evening to rest without extra conversation." },
  },
  {
    id: "need_support",
    family: "help",
    tones: ["depth", "patience", "openness"],
    main: { ru: "Близкому человеку нужнее поддержка, чем советы.", en: "Someone close needs support more than advice." },
    follow: { ru: "Выслушать и не бросаться исправлять — уже много.", en: "Listening without rushing to fix things is already a lot." },
  },
  {
    id: "name_limit",
    family: "boundary",
    tones: ["restraint", "caution", "clarity"],
    main: { ru: "В личном разговоре понадобится спокойно сказать, на что вы не готовы.", en: "In a personal conversation you will need to say, calmly, what you are not ready for." },
    follow: { ru: "Одной ясной фразы хватит — без обвинений и без длинного оправдания.", en: "One clear sentence will do — without blame and without a long apology." },
  },
  {
    id: "small_peace",
    family: "reconcile",
    tones: ["renewal", "openness", "patience"],
    main: { ru: "Есть шанс помириться по мелкому недоразумению, которое ещё не успело вырасти.", en: "There is a chance to make peace over a small misunderstanding that has not yet grown." },
    follow: { ru: "Первый шаг может быть коротким: не раздувать это дальше.", en: "The first step can be short: not making this bigger." },
  },
  {
    id: "no_instant_answer",
    family: "wait",
    tones: ["patience", "caution", "restraint"],
    main: { ru: "Близкий человек ответит не сразу.", en: "Someone close will not answer at once." },
    follow: { ru: "Разговор от этого не ломается — он просто продолжится позже.", en: "The conversation does not break because of that — it will simply continue later." },
  },
  {
    id: "say_the_want",
    family: "honesty",
    tones: ["openness", "depth", "clarity"],
    main: { ru: "Полезно сказать вслух, чего вы хотите, а не ждать, что догадаются.", en: "It helps to say out loud what you want, instead of waiting to be guessed." },
    follow: { ru: "Формулировка может быть простой: что именно вам важно.", en: "The wording can be simple: what exactly matters to you." },
  },
  {
    id: "listen_no_fix",
    family: "listen",
    tones: ["depth", "patience", "openness"],
    main: { ru: "В разговоре с близким важнее не перебивать и не чинить чужие чувства.", en: "In a talk with someone close, it matters more not to interrupt and not to fix their feelings." },
    follow: { ru: "Им нужно, чтобы их дослушали до конца.", en: "They need to be heard to the end." },
  },
  {
    id: "reschedule",
    family: "change",
    tones: ["renewal", "patience", "caution"],
    main: { ru: "Встреча или совместный план сдвинутся по времени.", en: "A meeting or a shared plan will shift in time." },
    follow: { ru: "Если так выйдет, достаточно предложить другой час.", en: "If that happens, offering another hour is enough." },
  },
  {
    id: "stronger_than_words",
    family: "mood",
    tones: ["depth", "openness", "patience"],
    main: { ru: "В разговоре с близким человеком не найдётся точных слов.", en: "In a talk with someone close, the exact words will not come." },
    follow: { ru: "Можно честно сказать, что слова пока не складываются — этого достаточно.", en: "You can honestly say that the words are not coming yet — that is enough." },
  },
  {
    id: "dont_check",
    family: "focus",
    tones: ["restraint", "patience", "depth"],
    main: { ru: "Близкому человеку не нужны повторные сообщения «ну что там?».", en: "Someone close does not need repeated “so, what’s going on?” messages." },
    follow: { ru: "Если хочется написать ещё раз, дайте человеку немного времени — ответ придёт сам.", en: "If you want to write again, give the person a little time — the reply will come." },
  },
  {
    id: "quiet_evening",
    family: "pace",
    tones: ["patience", "depth", "restraint"],
    main: { ru: "Захочется провести немного времени вдвоём без привычной суеты.", en: "You will want a little time together without the usual bustle." },
    follow: { ru: "Хороший момент для спокойного разговора или обычной совместной прогулки.", en: "A good moment for a calm conversation or an ordinary walk together." },
  },
  {
    id: "write_first",
    family: "start",
    tones: ["initiative", "openness", "renewal"],
    main: { ru: "Если разговор завис, можно написать первым.", en: "If a conversation has stalled, you can write first." },
    follow: { ru: "Не нужно сразу выяснять отношения: хватит короткого живого сообщения.", en: "You do not need to settle the relationship at once: a short living message is enough." },
  },
];

export const ADVICE_ITEMS: readonly AdviceItem[] = [
  { id: "not_auto_yes", family: "boundary", tones: ["restraint", "caution"], text: { ru: "Не соглашайтесь автоматически — сначала поймите, подходит ли вам предложение.", en: "Do not agree automatically — first see whether the offer actually suits you." } },
  { id: "name_one_thing", family: "focus", tones: ["clarity", "restraint"], text: { ru: "Выберите одно дело и доведите его до понятного конца.", en: "Pick one task and take it to a clear finish." } },
  { id: "ask_one_question", family: "listen", tones: ["depth", "openness"], text: { ru: "Задайте один уточняющий вопрос, прежде чем делать вывод.", en: "Ask one clarifying question before you draw a conclusion." } },
  { id: "leave_till_tomorrow", family: "wait", tones: ["patience", "caution"], text: { ru: "Оставьте один вопрос без ответа до завтра — это нормально.", en: "Leave one question unanswered until tomorrow — that is fine." } },
  { id: "small_kindness", family: "care", tones: ["patience", "openness"], text: { ru: "Проявите немного больше внимания к близкому человеку — для этого необязательно начинать серьёзный разговор.", en: "Show a little more attention to someone close — you do not need to start a serious conversation for that." } },
  { id: "first_step_only", family: "start", tones: ["initiative", "renewal"], text: { ru: "Сделайте только первый шаг и остановитесь, не добавляя сразу второй.", en: "Take only the first step and stop, without adding a second at once." } },
  { id: "say_the_sum", family: "money", tones: ["clarity", "restraint"], text: { ru: "Если речь о деньгах, назовите сумму вслух, а не намекайте.", en: "If money is involved, name the amount out loud instead of hinting." } },
  { id: "reread_before_reply", family: "misread", tones: ["caution", "clarity"], text: { ru: "Перечитайте сообщение, прежде чем отвечать на него резко.", en: "Reread the message before you answer it sharply." } },
  { id: "short_truth", family: "honesty", tones: ["openness", "clarity"], text: { ru: "Скажите короткую правду вместо длинного удобного объяснения.", en: "Tell a short truth instead of a long convenient explanation." } },
  { id: "keep_evening_empty", family: "rest", tones: ["patience", "restraint"], text: { ru: "Оставьте вечер без новых обязательств.", en: "Leave the evening free of new commitments." } },
  { id: "change_one_item", family: "change", tones: ["renewal", "initiative"], text: { ru: "Измените один пункт плана — этого может быть достаточно.", en: "Change one item in the plan — that may be enough." } },
  { id: "close_old", family: "unfinished", tones: ["depth", "renewal"], text: { ru: "Закройте одно старое дело, прежде чем открывать новое.", en: "Close one old task before you open a new one." } },
  { id: "write_first_short", family: "social", tones: ["initiative", "openness"], text: { ru: "Если молчание затянулось, напишите коротко первым.", en: "If the silence has stretched, write first — briefly." } },
  { id: "do_not_fix", family: "help", tones: ["depth", "patience"], text: { ru: "Если близкому человеку тяжело, просто побудьте рядом — советы не обязательны.", en: "If someone close is having a hard time, just stay nearby — advice is not required." } },
  { id: "compare_two", family: "detail", tones: ["clarity", "caution"], text: { ru: "Сравните два варианта, прежде чем выбрать первый попавшийся.", en: "Compare two options before you take the first one that appears." } },
  { id: "skip_grand", family: "pace", tones: ["patience", "restraint"], text: { ru: "Сделайте что-то простое и законченное — этого хватит.", en: "Do one simple, finished thing — that will be enough." } },
  { id: "name_the_limit", family: "speak", tones: ["openness", "restraint"], text: { ru: "Скажите вслух, на что вы готовы, а на что — нет.", en: "Be clear about your yes and your no." } },
  { id: "offer_new_time", family: "meeting", tones: ["openness", "initiative"], text: { ru: "Если время неудобно, сразу предложите другое, а не молчите.", en: "If the time is inconvenient, offer another one at once instead of staying silent." } },
  { id: "say_what_moves", family: "deadline", tones: ["caution", "clarity"], text: { ru: "Если срок сдвигают, сразу скажите, что из остального тогда придётся подвинуть.", en: "If a deadline is moved, say at once what else will then have to shift." } },
  { id: "sleep_on_buy", family: "purchase", tones: ["caution", "patience"], text: { ru: "Не принимайте решение о покупке только потому, что она кажется выгодной в моменте.", en: "Do not decide on a purchase only because it looks like a bargain in the moment." } },
  { id: "hour_alone", family: "alone", tones: ["depth", "patience"], text: { ru: "Возьмите час только для себя и не заполняйте его чужими делами.", en: "Take an hour only for yourself and do not fill it with other people’s tasks." } },
  { id: "first_to_soften", family: "reconcile", tones: ["renewal", "openness"], text: { ru: "Если ссора мелкая, сделайте первый мягкий шаг сами.", en: "If the quarrel is small, take the first gentle step yourself." } },
  { id: "notice_the_feeling", family: "mood", tones: ["depth", "openness"], text: { ru: "Прежде чем отвечать, назовите себе, что вы чувствуете.", en: "Before you answer, name to yourself what you feel." } },
  { id: "look_inward_once", family: "inner", tones: ["depth", "caution"], text: { ru: "Перед важным ответом спросите себя, чего хотите вы.", en: "Before an important answer, ask yourself what you want." } },
];

export const SIGN_VOICES: Record<string, readonly VoiceId[]> = {
  ARIES: ["direct", "situational", "timeLed"],
  TAURUS: ["observational", "timeLed", "contrast"],
  GEMINI: ["question", "situational", "direct"],
  CANCER: ["observational", "contrast", "question"],
  LEO: ["direct", "contrast", "situational"],
  VIRGO: ["observational", "timeLed", "question"],
  LIBRA: ["situational", "question", "contrast"],
  SCORPIO: ["contrast", "observational", "direct"],
  SAGITTARIUS: ["situational", "direct", "timeLed"],
  CAPRICORN: ["timeLed", "observational", "direct"],
  AQUARIUS: ["question", "contrast", "situational"],
  PISCES: ["observational", "question", "contrast"],
};

export const TONE_MOODS: Record<ToneId, readonly string[]> = {
  caution: ["more_details", "slower_day", "old_thread", "early_fatigue", "slow_replies", "changed_mind"],
  initiative: ["urge_to_begin", "small_shifts", "more_talks", "short_encounters", "scattered_attention"],
  patience: ["slower_day", "early_fatigue", "simple_attention", "slow_replies", "uneven_mood"],
  clarity: ["more_details", "scattered_attention", "hard_to_hide", "short_encounters", "small_shifts"],
  depth: ["uneven_mood", "old_thread", "easier_to_hear", "feelings_first", "simple_attention"],
  openness: ["more_talks", "hard_to_hide", "simple_attention", "short_encounters", "changed_mind"],
  restraint: ["early_fatigue", "scattered_attention", "slower_day", "slow_replies", "more_details"],
  renewal: ["small_shifts", "urge_to_begin", "old_thread", "changed_mind", "short_encounters"],
};

export const FAMILY_TITLES: Record<Family, readonly string[]> = {
  detail: ["shadow_light", "careful_step", "quiet_clarity"],
  pace: ["slow_fire", "silver_pause", "careful_power"],
  social: ["sharp_edges", "subtle_alliance", "open_door"],
  inner: ["inner_tide", "inner_support", "quiet_clarity"],
  change: ["subtle_shifts", "reassembled_meaning", "open_door"],
  unfinished: ["karmic_thread", "distant_echo", "quiet_resolve"],
  rest: ["hidden_reserve", "silver_pause", "careful_power"],
  focus: ["gathered_will", "precise_choice", "careful_step"],
  speak: ["stern_tenderness", "sharp_edges", "clear_motives"],
  listen: ["deep_listening", "inner_support", "quiet_clarity"],
  boundary: ["fragile_bounds", "clear_refusal", "careful_power"],
  start: ["inner_impulse", "open_door", "quiet_resolve"],
  care: ["stern_tenderness", "inner_support", "soft_strength"],
  wait: ["silver_pause", "slow_fire", "hidden_reserve"],
  meeting: ["subtle_alliance", "open_door", "sharp_edges"],
  deadline: ["precise_choice", "careful_step", "quiet_resolve"],
  purchase: ["precise_choice", "careful_step", "slow_fire"],
  offer: ["open_door", "hidden_openings", "subtle_alliance"],
  misread: ["sharp_edges", "quiet_clarity", "careful_step"],
  alone: ["hidden_reserve", "inner_support", "silver_pause"],
  reconcile: ["stern_tenderness", "reassembled_meaning", "subtle_alliance"],
  honesty: ["clear_motives", "stern_tenderness", "sharp_edges"],
  help: ["inner_support", "stern_tenderness", "soft_strength"],
  money: ["precise_choice", "careful_step", "soft_strength"],
  mood: ["inner_tide", "inner_support", "quiet_clarity"],
  decision: ["precise_choice", "quiet_resolve", "clear_motives"],
};

export const SLOT_CONFLICTS: ReadonlyArray<readonly [Family, Family]> = [
  ["pace", "deadline"],
  ["rest", "deadline"],
  ["alone", "speak"],
  ["wait", "start"],
  ["rest", "start"],
  ["start", "unfinished"],
  ["deadline", "wait"],
  ["purchase", "money"],
];

export function familiesConflict(a: Family, b: Family): boolean {
  return SLOT_CONFLICTS.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
}

export function itemById<T extends { id: string }>(list: readonly T[], id: string): T {
  return list.find((item) => item.id === id) ?? list[0]!;
}
