import { useMemo, useRef, useState, type PointerEvent } from "react";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CalendarStrip } from "@/components/calendar-strip";
import { HairlineDiamond } from "@/components/ornament";
import { formatDate, parseISODate, toISODate } from "@/lib/oracle/dates";
import { generateForecast } from "@/lib/oracle/generator";
import { UI } from "@/lib/oracle/i18n";
import { useOracleStore } from "@/lib/oracle/store";
import { adjacentSign, parseZodiacSign, ZODIAC } from "@/lib/oracle/zodiac";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/forecast/$sign")({
  validateSearch: (search: Record<string, unknown>): { date?: string } => ({
    date: typeof search.date === "string" ? search.date : undefined,
  }),
  component: ForecastPage,
});

function ForecastPage() {
  const { sign: signParam } = Route.useParams();
  const { date: dateParam } = Route.useSearch();
  const navigate = useNavigate();
  const router = useRouter();
  const today = useOracleStore((state) => state.today);
  const selectedDate = useOracleStore((state) => state.selectedDate);
  const setSelectedDate = useOracleStore((state) => state.setSelectedDate);
  const toggleFavorite = useOracleStore((state) => state.toggleFavorite);
  const favorites = useOracleStore((state) => state.favorites);
  const language = useOracleStore((state) => state.settings.language);
  const copy = UI[language];

  const sign = parseZodiacSign(signParam);
  const date = (dateParam ? parseISODate(dateParam) : null) ?? selectedDate;
  const [dragX, setDragX] = useState(0);
  const startX = useRef<number | null>(null);

  const forecast = useMemo(() => {
    if (!sign) return null;
    return generateForecast(sign, date, language);
  }, [sign, date, language]);

  const saved = sign
    ? favorites.some((item) => item.sign === sign && item.date === toISODate(date))
    : false;

  function goToSign(nextSign: NonNullable<typeof sign>, replace = true) {
    void navigate({
      to: "/forecast/$sign",
      params: { sign: nextSign },
      search: { date: toISODate(date) },
      replace,
    });
  }

  function onPointerDown(event: PointerEvent<HTMLElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const target = event.target as HTMLElement;
    if (target.closest("button, a, input")) return;
    startX.current = event.clientX;
    setDragX(0);
  }

  function onPointerMove(event: PointerEvent<HTMLElement>) {
    if (startX.current === null) return;
    setDragX(event.clientX - startX.current);
  }

  function onPointerUp() {
    if (startX.current === null || !sign) {
      startX.current = null;
      setDragX(0);
      return;
    }
    if (dragX <= -56) goToSign(adjacentSign(sign, 1));
    else if (dragX >= 56) goToSign(adjacentSign(sign, -1));
    startX.current = null;
    setDragX(0);
  }

  if (!sign) {
    return (
      <AppShell tab="home">
        <p className="px-6 pt-16 text-center text-muted">{copy.signNotFound}</p>
      </AppShell>
    );
  }

  const meta = ZODIAC[sign];

  return (
    <AppShell tab="home">
      <article
        className="touch-pan-y px-5 pt-4"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          transform: `translateX(${Math.max(-72, Math.min(72, dragX * 0.35))}px)`,
          transition: startX.current === null ? "transform 180ms var(--ease-smooth-out)" : "none",
        }}
      >
        <header className="relative">
          <div className="flex items-center justify-between">
            <button
              type="button"
              aria-label={copy.back}
              onClick={() => {
                if (typeof window !== "undefined" && window.history.length > 1) {
                  router.history.back();
                } else {
                  void navigate({ to: "/" });
                }
              }}
              className="flex size-11 items-center justify-center rounded-md text-gold transition-transform duration-150 active:scale-[0.96]"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              aria-label={copy.nextSign}
              onClick={() => goToSign(adjacentSign(sign, 1))}
              className="flex size-11 items-center justify-center rounded-md text-gold transition-transform duration-150 active:scale-[0.96]"
            >
              <ChevronRight className="size-6" />
            </button>
          </div>
          <div className="text-center">
            <p className="font-display text-3xl leading-none tracking-[0.18em] text-fg uppercase">
              {language === "en" ? meta.nameEn : meta.nameRu}
            </p>
            <p className="mt-2 text-sm text-gold">{formatDate(date, language)}</p>
          </div>
        </header>

        <div className="mt-5">
          <CalendarStrip
            today={today}
            selected={date}
            onSelect={(next) => {
              setSelectedDate(next);
              void navigate({
                to: "/forecast/$sign",
                params: { sign },
                search: { date: toISODate(next) },
                replace: true,
              });
            }}
          />
        </div>

        {forecast ? (
          <div key={`${sign}-${toISODate(date)}-${language}`} className="fade-up mt-6 pb-6">
            <HairlineDiamond className="mx-auto max-w-48" />
            <h1 className="mt-5 text-center font-display text-3xl italic leading-tight text-gold">
              {forecast.title}
            </h1>

            <section className="mt-7">
              <p className="text-[0.95rem] leading-relaxed text-fg/90">{forecast.general}</p>
            </section>

            <button
              type="button"
              onClick={() => toggleFavorite(sign, date)}
              className={cn(
                "mt-8 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border text-sm tracking-wide transition-colors duration-150",
                saved
                  ? "border-gold bg-gold/15 text-gold"
                  : "border-line bg-card text-muted hover:text-fg",
              )}
            >
              <Heart className="size-4" fill={saved ? "currentColor" : "none"} />
              {saved ? copy.inFavorites : copy.addFavorite}
            </button>
            <p className="mt-3 text-center text-[11px] tracking-[0.18em] text-subtle uppercase">
              {copy.swipeHint}
            </p>
            <p className="mt-5 text-center text-[11px] leading-relaxed text-subtle">
              {copy.astroMethod}
            </p>
          </div>
        ) : null}
      </article>
    </AppShell>
  );
}

