import { createFileRoute, Link } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import { AppShell } from "@/components/app-shell";
import { CalendarStrip } from "@/components/calendar-strip";
import { HairlineDiamond } from "@/components/ornament";
import { ZodiacGlyph } from "@/components/zodiac-glyph";
import { formatDate, toISODate } from "@/lib/oracle/dates";
import { UI } from "@/lib/oracle/i18n";
import { useOracleStore } from "@/lib/oracle/store";
import { ZODIAC, ZODIAC_ORDER } from "@/lib/oracle/zodiac";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  const today = useOracleStore((state) => state.today);
  const selectedDate = useOracleStore((state) => state.selectedDate);
  const setSelectedDate = useOracleStore((state) => state.setSelectedDate);
  const language = useOracleStore((state) => state.settings.language);
  const copy = UI[language];

  return (
    <AppShell tab="home">
      <main className="px-5 pt-8">
        <header className="text-center">
          <p className="text-[11px] tracking-[0.38em] text-gold uppercase">{copy.tagline}</p>
          <h1 className="mt-3 font-display text-[2.15rem] leading-none tracking-[0.22em] text-fg">
            {copy.appNameCaps}
          </h1>
          <HairlineDiamond className="mx-auto mt-5 max-w-56" />
          <p className="mt-5 text-sm tracking-[0.16em] text-muted uppercase">{copy.todayForecasts}</p>
          <p className="mt-2 font-display text-lg text-gold">{formatDate(selectedDate, language)}</p>
        </header>

        <div className="mt-6">
          <CalendarStrip today={today} selected={selectedDate} onSelect={setSelectedDate} />
        </div>

        <section className="mt-6 grid grid-cols-3 gap-2.5 pb-4">
          {ZODIAC_ORDER.map((sign, index) => {
            const meta = ZODIAC[sign];
            return (
              <Link
                key={sign}
                to="/forecast/$sign"
                params={{ sign }}
                search={{ date: toISODate(selectedDate) }}
                className={cn(
                  "fade-up flex min-h-[7.25rem] flex-col items-center justify-center rounded-lg border border-line bg-card px-2 py-3 text-center",
                  "transition-transform duration-150 ease-out active:scale-[0.96]",
                  "hover:border-gold/55 hover:bg-surface",
                )}
                style={{ "--stagger": index } as CSSProperties}
              >
                <ZodiacGlyph sign={sign} className="size-8 text-gold" />
                <span className="mt-2 font-display text-base leading-tight text-fg">
                  {language === "en" ? meta.nameEn : meta.nameRu}
                </span>
                <span className="mt-1 text-[10px] tracking-wide text-subtle">
                  {language === "en" ? meta.elementEn : meta.elementRu}
                </span>
              </Link>
            );
          })}
        </section>
      </main>
    </AppShell>
  );
}
