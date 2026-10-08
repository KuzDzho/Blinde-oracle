import { useEffect } from "react";
import { BottomNav, type TabId } from "@/components/bottom-nav";
import { Starfield } from "@/components/starfield";
import { UI } from "@/lib/oracle/i18n";
import { useOracleStore } from "@/lib/oracle/store";
import { cn } from "@/lib/utils";

export function AppShell({
  children,
  tab,
}: {
  children: React.ReactNode;
  tab: TabId;
}) {
  const hydrate = useOracleStore((state) => state.hydrate);
  const notice = useOracleStore((state) => state.notice);
  const dismissNotice = useOracleStore((state) => state.dismissNotice);
  const language = useOracleStore((state) => state.settings.language);
  const copy = UI[language];

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const id = window.setInterval(() => {
      useOracleStore.getState().checkNotifications();
    }, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="relative min-h-dvh bg-bg text-fg">
      <Starfield />
      <div
        className={cn(
          "relative mx-auto flex min-h-dvh w-full max-w-lg flex-col",
          "md:border-x md:border-line md:bg-bg/80 md:shadow-[0_0_80px_var(--color-glow)]",
        )}
      >
        {notice ? (
          <div className="relative z-10 mx-4 mt-4 rounded-lg border border-line bg-surface px-4 py-3 fade-up">
            <p className="font-display text-base text-gold">{notice}</p>
            <button
              type="button"
              onClick={dismissNotice}
              className="mt-2 text-xs tracking-wide text-muted uppercase"
            >
              {copy.hide}
            </button>
          </div>
        ) : null}
        <div className="relative flex-1 pb-24">{children}</div>
        <BottomNav active={tab} />
      </div>
    </div>
  );
}
