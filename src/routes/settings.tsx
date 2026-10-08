import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { HairlineDiamond } from "@/components/ornament";
import { UI } from "@/lib/oracle/i18n";
import { requestNotifyPermission, useOracleStore } from "@/lib/oracle/store";
import { ZODIAC, ZODIAC_ORDER } from "@/lib/oracle/zodiac";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
  const settings = useOracleStore((state) => state.settings);
  const updateSettings = useOracleStore((state) => state.updateSettings);
  const copy = UI[settings.language];

  async function onToggleNotifications(enabled: boolean) {
    if (enabled) {
      await requestNotifyPermission();
    }
    updateSettings({ notificationsEnabled: enabled });
  }

  return (
    <AppShell tab="settings">
      <main className="px-5 pt-8">
        <header className="text-center">
          <h1 className="font-display text-4xl tracking-[0.18em] text-fg">{copy.settingsCaps}</h1>
          <HairlineDiamond className="mx-auto mt-5 max-w-40" />
        </header>

        <section className="mt-8">
          <h2 className="text-center text-[11px] tracking-[0.22em] text-subtle uppercase">
            {copy.language}
          </h2>
          <p className="mt-2 text-center text-sm text-muted">{copy.languageHint}</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {(["ru", "en"] as const).map((language) => {
              const active = settings.language === language;
              return (
                <button
                  key={language}
                  type="button"
                  onClick={() => updateSettings({ language })}
                  className={cn(
                    "min-h-12 rounded-md border px-3 text-sm transition-colors duration-150",
                    active
                      ? "border-gold bg-gold/15 text-gold"
                      : "border-line bg-card text-muted hover:text-fg",
                  )}
                >
                  {language === "ru" ? copy.russian : copy.english}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-8 space-y-3">
          <ToggleRow
            label={copy.darkTheme}
            hint={copy.darkThemeHint}
            checked={settings.darkTheme}
            onChange={(darkTheme) => updateSettings({ darkTheme })}
          />
          <ToggleRow
            label={copy.notifications}
            hint={copy.notificationsHint}
            checked={settings.notificationsEnabled}
            onChange={onToggleNotifications}
          />
        </section>

        {settings.notificationsEnabled ? (
          <section className="mt-6 rounded-lg border border-line bg-card px-4 py-4">
            <label className="block text-sm text-muted" htmlFor="notify-time">
              {copy.notifyTime}
            </label>
            <input
              id="notify-time"
              type="time"
              value={settings.notificationTime}
              onChange={(event) => updateSettings({ notificationTime: event.target.value })}
              className="mt-2 h-11 w-full rounded-md border border-line bg-bg px-3 text-fg outline-none ring-gold/40 focus:ring-2"
            />
          </section>
        ) : null}

        <section className="mt-8">
          <h2 className="text-center text-[11px] tracking-[0.22em] text-subtle uppercase">
            {copy.mySign}
          </h2>
          <p className="mt-2 text-center text-sm text-muted">{copy.mySignHint}</p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {ZODIAC_ORDER.map((sign) => {
              const meta = ZODIAC[sign];
              const active = settings.mySign === sign;
              return (
                <button
                  key={sign}
                  type="button"
                  onClick={() => updateSettings({ mySign: sign })}
                  className={cn(
                    "min-h-12 rounded-md border px-2 text-sm transition-colors duration-150",
                    active
                      ? "border-gold bg-gold/15 text-gold"
                      : "border-line bg-card text-muted hover:text-fg",
                  )}
                >
                  {settings.language === "en" ? meta.nameEn : meta.nameRu}
                </button>
              );
            })}
          </div>
        </section>
      </main>
    </AppShell>
  );
}

function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-line bg-card px-4 py-4">
      <div>
        <p className="text-sm text-fg">{label}</p>
        <p className="mt-1 text-xs text-subtle">{hint}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full border transition-colors duration-150",
          checked ? "border-gold bg-gold/30" : "border-line bg-bg",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 size-5 rounded-full bg-gold transition-transform duration-150",
            checked ? "translate-x-5" : "translate-x-0 opacity-50",
          )}
        />
      </button>
    </div>
  );
}
