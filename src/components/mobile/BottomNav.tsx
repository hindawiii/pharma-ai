import { Sparkles, ScanLine, MapPin, Pill, UserCircle2 } from "lucide-react";
import { memo } from "react";

export type TabKey = "home" | "scanner" | "medication" | "map" | "profile";

// Order from RIGHT to LEFT (Arabic): home first
const tabs: { key: TabKey; label: string; icon: typeof ScanLine }[] = [
  { key: "home", label: "الرئيسية", icon: Sparkles },
  { key: "scanner", label: "الماسح", icon: ScanLine },
  { key: "medication", label: "الأدوية", icon: Pill },
  { key: "map", label: "الخريطة", icon: MapPin },
  { key: "profile", label: "حسابي", icon: UserCircle2 },
];

interface Props {
  active: TabKey;
  onChange: (key: TabKey) => void;
}

export const BottomNav = memo(({ active, onChange }: Props) => {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 glass border-t border-border/50 pb-[env(safe-area-inset-bottom)]"
      aria-label="القائمة السفلية"
    >
      <ul className="grid grid-cols-5 max-w-md mx-auto px-1">
        {tabs.map((tab) => {
          const isActive = active === tab.key;
          const Icon = tab.icon;
          return (
            <li key={tab.key} className="flex">
              <button
                onClick={() => onChange(tab.key)}
                className="w-full min-h-[60px] flex flex-col items-center justify-center gap-0.5 py-1.5 transition-smooth relative outline-none"
                aria-current={isActive ? "page" : undefined}
                aria-label={tab.label}
              >
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 h-[3px] w-8 rounded-b-full gradient-primary" />
                )}
                <span
                  className={`h-9 w-9 rounded-2xl flex items-center justify-center transition-bounce ${
                    isActive
                      ? "gradient-primary text-white shadow-glow scale-110"
                      : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-[20px] w-[20px]" strokeWidth={isActive ? 2.4 : 2} />
                </span>
                <span
                  className={`text-[11px] leading-none font-bold tracking-tight ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
});

BottomNav.displayName = "BottomNav";
