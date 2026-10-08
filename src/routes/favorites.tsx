import { createFileRoute, Link } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import { Heart } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { HairlineDiamond } from "@/components/ornament";
import { ZodiacGlyph } from "@/components/zodiac-glyph";
import { formatDate, parseISODate } from "@/lib/oracle/dates";
import { generateForecast } from "@/lib/oracle/generator";
import { UI } from "@/lib/oracle/i18n";
import { useOracleStore } from "@/lib/oracle/store";
import { ZODIAC } from "@/lib/oracle/zodiac";

export const Route = createFileRoute("/favorites")({ component: FavoritesPage });

function FavoritesPage() {
  const favorites = useOracleStore((state) => state.favorites);
  const language = useOracleStore((state) => state.settings.language);
  const copy = UI[language];

  return (
    <AppShell tab="favorites">
      <main className="px-5 pt-8">
        <header className="text-center">
          <h1 className="font-display text-4xl tracking-[0.18em] text-fg">{copy.favoritesCaps}</h1>
          <HairlineDiamond className="mx-auto mt-5 max-w-40" />
        </header>

        {favorites.length === 0 ? (
          <div className="mt-16 flex flex-col items-center text-center">
            <Heart className="size-8 text-gold/70" strokeWidth={1.4} />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{copy.emptyFavorites}</p>
          </div>
        ) : null}

        <ul className="mt-8 space-y-3 pb-4">
          {favorites.map((item, index) => {
            const date = parseISODate(item.date);
            if (!date) return null;
            const meta = ZODIAC[item.sign];
            const forecast = generateForecast(item.sign, date, language);
            return (
              <li
                key={`${item.sign}-${item.date}-${item.savedAt}`}
                className="fade-up"
                style={{ "--stagger": index } as CSSProperties}
              >
                <Link
                  to="/forecast/$sign"
                  params={{ sign: item.sign }}
                  search={{ date: item.date }}
                  className="block rounded-lg border border-line bg-card px-4 py-4 transition-colors duration-150 hover:border-gold/55"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="flex items-center gap-2 font-display text-xl text-fg">
                      <ZodiacGlyph sign={item.sign} className="size-5 text-gold" />
                      {language === "en" ? meta.nameEn : meta.nameRu}
                    </p>
                    <p className="text-xs tracking-wide text-subtle">{formatDate(date, language)}</p>
                  </div>
                  <p className="mt-2 font-display text-lg italic text-gold">{forecast.title}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
    </AppShell>
  );
}
