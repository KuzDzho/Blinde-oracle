import { Link } from "@tanstack/react-router";
import { Heart, House, Settings } from "lucide-react";
import { UI } from "@/lib/oracle/i18n";
import { useOracleStore } from "@/lib/oracle/store";
import { cn } from "@/lib/utils";

export type TabId = "home" | "favorites" | "settings";

export function BottomNav({ active }: { active: TabId }) {
  const language = useOracleStore((state) => state.settings.language);
  const copy = UI[language];
  const tabs = [
    { to: "/", label: copy.home, icon: House, id: "home" as const },
    { to: "/favorites", label: copy.favorites, icon: Heart, id: "favorites" as const },
    { to: "/settings", label: copy.settings, icon: Settings, id: "settings" as const },
  ];

  return (
    <nav
      className="absolute inset-x-0 bottom-0 z-20 border-t border-line bg-bg-elevated/92 backdrop-blur-md"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      <ul className="grid grid-cols-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === active;
          return (
            <li key={tab.id}>
              <Link
                to={tab.to}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] tracking-wide transition-colors duration-150",
                  isActive ? "text-gold" : "text-muted hover:text-fg",
                )}
              >
                <Icon
                  className="size-5"
                  strokeWidth={isActive ? 2.2 : 1.7}
                  fill={tab.id === "favorites" && isActive ? "currentColor" : "none"}
                />
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
