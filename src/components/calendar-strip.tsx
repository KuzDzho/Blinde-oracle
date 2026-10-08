import { formatDate, toISODate, weekdayShort, type LocalDate } from "@/lib/oracle/dates";
import { UI } from "@/lib/oracle/i18n";
import { calendarDays, isToday, useOracleStore } from "@/lib/oracle/store";
import { cn } from "@/lib/utils";

export function CalendarStrip({
  today,
  selected,
  onSelect,
}: {
  today: LocalDate;
  selected: LocalDate;
  onSelect: (date: LocalDate) => void;
}) {
  const language = useOracleStore((state) => state.settings.language);
  const copy = UI[language];
  const days = calendarDays(today);

  return (
    <div>
      <p className="mb-3 text-center text-[11px] tracking-[0.22em] text-subtle uppercase">
        {copy.last7Days}
      </p>
      <div className="flex justify-between gap-1">
        {days.map((day) => {
          const active = toISODate(day) === toISODate(selected);
          const current = isToday(day, today);
          return (
            <button
              key={toISODate(day)}
              type="button"
              onClick={() => onSelect(day)}
              className={cn(
                "flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center rounded-md border transition-colors duration-150",
                active
                  ? "border-gold bg-gold/15 text-gold"
                  : "border-line bg-card text-muted hover:border-gold/50 hover:text-fg",
              )}
              aria-label={formatDate(day, language)}
              aria-pressed={active}
            >
              <span className="text-[10px] tracking-wider uppercase">
                {weekdayShort(day, language)}
              </span>
              <span className="font-display text-lg leading-none">{day.day}</span>
              {current ? <span className="mt-0.5 size-1 rounded-full bg-gold" /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
