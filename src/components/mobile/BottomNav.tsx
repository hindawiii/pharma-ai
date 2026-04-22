import { ScanLine, MapPin, Pill, FileHeart } from "lucide-react";

export type TabKey = "scanner" | "map" | "medication" | "record";

interface Props {
  active: TabKey;
  onChange: (key: TabKey) => void;
}

// Order from RIGHT to LEFT (Arabic): scanner first
const tabs: { key: TabKey; label: string; icon: typeof ScanLine }[] = [
  { key: "scanner", label: "الماسح", icon: ScanLine },
  { key: "map", label: "الخريطة", icon: MapPin },
  { key: "medication", label: "الأدوية", icon: Pill },
  { key: "record", label: "ملفي الطبي", icon: FileHeart },
];

export const BottomNav = ({ active, onChange }: Props) => {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 glass border-t border-border/50 pb-[env(safe-area-inset-bottom)]"
      aria-label="القائمة السفلية"
    >
      <ul className="grid grid-cols-4 max-w-md mx-auto">
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
                  <span className="absolute top-0 inset-x-6 h-0.5 rounded-full gradient-primary" />
                )}
                <span
                  className={`h-10 w-10 rounded-2xl flex items-center justify-center transition-bounce ${
                    isActive
                      ? "gradient-primary text-white shadow-glow scale-110"
                      : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span
                  className={`text-[11px] font-bold ${
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
