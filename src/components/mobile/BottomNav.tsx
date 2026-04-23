import { Sparkles, ScanLine, MapPin, Settings, Pill } from "lucide-react";

export type TabKey = "home" | "scanner" | "medication" | "map" | "profile";

interface Props {
  active: TabKey;
  onChange: (key: TabKey) => void;
}

// Order from RIGHT to LEFT (Arabic): home first
const tabs: { key: TabKey; label: string; icon: typeof ScanLine }[] = [
  { key: "home", label: "الرئيسية", icon: Sparkles },
  { key: "scanner", label: "الماسح", icon: ScanLine },
  { key: "medication", label: "الأدوية", icon: Pill },
  { key: "map", label: "الخريطة", icon: MapPin },
  { key: "profile", label: "الإعدادات", icon: Settings },
];

export const BottomNav = ({ active, onChange }: Props) => {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 glass border-t border-border/50 pb-[env(safe-area-inset-bottom)]"
      aria-label="القائمة السفلية"
    >
      <ul className="grid grid-cols-5 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = active === tab.key;
          const Icon = tab.icon;
          return (
            <li key={tab.key}>
              <button
                onClick={() => onChange(tab.key)}
                className="w-full min-h-[56px] flex flex-col items-center justify-center gap-1 py-2 transition-smooth relative"
                aria-current={isActive ? "page" : undefined}
                aria-label={tab.label}
              >
                {isActive && (
                  <span className="absolute top-0 inset-x-4 h-0.5 rounded-full gradient-primary" />
                )}
                <span
                  className={`h-9 w-9 rounded-2xl flex items-center justify-center transition-bounce ${
                    isActive
                      ? "gradient-primary text-white shadow-glow scale-110"
                      : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span
                  className={`text-[12px] font-extrabold ${
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
};
