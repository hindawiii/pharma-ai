import { memo, useState } from "react";
import { Cross, Droplet, X, Siren } from "lucide-react";
import { BLOOD_TABS, BloodTypesContent, type BloodSectionKey } from "./BloodTypesContent";
import { FIRST_AID_TABS, FirstAidContent, FirstAidIntro, type FirstAidKey } from "./FirstAidContent";

// ────────────────────────────────────────────────────────────
// Reusable Sheet (responsive: full-screen on mobile, centered card on larger)
// ────────────────────────────────────────────────────────────
interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  accent: string; // tailwind gradient classes for header
  children: React.ReactNode;
}

const Sheet = ({ open, onClose, title, accent, children }: SheetProps) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in-0"
      onClick={onClose}
      dir="rtl"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-2xl h-[95dvh] sm:h-[90dvh] bg-background rounded-t-3xl sm:rounded-3xl shadow-elegant overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 duration-300"
        style={{ fontFamily: "'Cairo','Noto Sans Arabic',system-ui,sans-serif" }}
      >
        {/* Header */}
        <div className={`relative px-5 py-4 bg-gradient-to-l ${accent} text-white flex-shrink-0`}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold leading-tight">{title}</h2>
            <button
              onClick={onClose}
              aria-label="إغلاق"
              className="h-9 w-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-bounce active:scale-90"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {/* drag handle for mobile */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 sm:hidden h-1 w-12 rounded-full bg-white/40" />
        </div>
        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────
// Grid of categories — expands selected item content below
// ────────────────────────────────────────────────────────────
interface GridItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}
const CategoryGrid = ({
  items,
  active,
  onSelect,
  accent = "#C62828",
}: {
  items: GridItem[];
  active: string;
  onSelect: (k: string) => void;
  accent?: string;
}) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5" dir="rtl">
    {items.map((c) => {
      const Icon = c.icon;
      const isActive = c.key === active;
      return (
        <button
          key={c.key}
          onClick={() => onSelect(c.key)}
          className={`flex flex-col items-center justify-center gap-2 px-3 py-4 rounded-2xl border-2 text-center transition-bounce active:scale-95 ${
            isActive
              ? "text-white shadow-soft"
              : "bg-white hover:bg-[#C62828]/5"
          }`}
          style={{
            borderColor: accent,
            background: isActive ? accent : undefined,
            color: isActive ? "#fff" : accent,
          }}
        >
          <Icon className="h-6 w-6" />
          <span className="text-[13px] font-extrabold leading-tight">{c.label}</span>
        </button>
      );
    })}
  </div>
);

// ────────────────────────────────────────────────────────────
// First Aid data
// ────────────────────────────────────────────────────────────
const FirstAidModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [active, setActive] = useState<FirstAidKey>(FIRST_AID_TABS[0].key);
  const activeCat = FIRST_AID_TABS.find((c) => c.key === active)!;
  const ActiveIcon = activeCat.icon;

  return (
    <Sheet open={open} onClose={onClose} title="🔴 دليل الإسعافات الأولية" accent="from-[#C62828] to-[#8B1A1A]">
      <div className="p-5 bg-white" dir="rtl">
        <FirstAidIntro />
      </div>

      {/* Category grid */}
      <div className="px-4 pb-2 bg-white" dir="rtl">
        <CategoryGrid
          items={FIRST_AID_TABS as unknown as GridItem[]}
          active={active}
          onSelect={(k) => setActive(k as FirstAidKey)}
        />
      </div>

      {/* Selected content */}
      <div className="p-5 space-y-4 bg-white border-t border-[#C62828]/10 mt-2" dir="rtl">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-[#C62828]/10 text-[#C62828] flex items-center justify-center">
            <ActiveIcon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-foreground">{activeCat.label}</h3>
            <p className="text-sm text-muted-foreground">خطوات الإسعاف الأولي والإرشادات الموصى بها</p>
          </div>
        </div>

        <FirstAidContent section={active} />

        <div className="rounded-2xl bg-[#C62828]/10 border border-[#C62828]/30 p-4 flex items-start gap-3">
          <Siren className="h-5 w-5 text-[#C62828] flex-shrink-0 mt-0.5" />
          <p className="text-sm font-bold text-[#C62828] leading-relaxed">
            في حالة الطوارئ، اتصل فوراً برقم الإسعاف 123. هذا الدليل لا يغني عن المساعدة الطبية المتخصصة.
          </p>
        </div>
      </div>
    </Sheet>
  );
};

// ────────────────────────────────────────────────────────────
// Blood Types modal — Crimson Red theme, RTL, full content
// ────────────────────────────────────────────────────────────
const BloodModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [active, setActive] = useState<BloodSectionKey>("encyclopedia");
  const activeCat = BLOOD_TABS.find((c) => c.key === active)!;
  const ActiveIcon = activeCat.icon;

  return (
    <Sheet open={open} onClose={onClose} title="🩸 فصائل الدم والموسوعة" accent="from-[#C62828] to-[#8B1A1A]">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-[#C62828]/15 px-3 py-3" dir="rtl">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {BLOOD_TABS.map((c) => {
            const Icon = c.icon;
            const isActive = c.key === active;
            return (
              <button
                key={c.key}
                onClick={() => setActive(c.key)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold transition-bounce ${
                  isActive
                    ? "bg-[#C62828] text-white shadow-soft"
                    : "bg-[#C62828]/5 text-[#C62828] hover:bg-[#C62828]/10"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-5 space-y-4 bg-white" dir="rtl">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-[#C62828]/10 text-[#C62828] flex items-center justify-center">
            <ActiveIcon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-foreground">{activeCat.label}</h3>
            <p className="text-xs text-muted-foreground">معلومات تفاعلية شاملة عن فصائل الدم</p>
          </div>
        </div>

        <BloodTypesContent section={active} onRequestUrgent={() => { /* hook to community feed later */ }} />
      </div>
    </Sheet>
  );
};

// ────────────────────────────────────────────────────────────
// Main exported section: two cards on the home dashboard
// ────────────────────────────────────────────────────────────
export const HealthGuidesSection = memo(() => {
  const [openFirstAid, setOpenFirstAid] = useState(false);
  const [openBlood, setOpenBlood] = useState(false);

  return (
    <section aria-labelledby="health-guides-title" className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 id="health-guides-title" className="text-base font-extrabold text-foreground">
          دلائل صحية سريعة
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* First Aid card */}
        <button
          onClick={() => setOpenFirstAid(true)}
          className="relative overflow-hidden rounded-3xl p-4 text-right shadow-soft border border-white/10 transition-bounce active:scale-95 hover:shadow-card"
          style={{ background: "linear-gradient(135deg, #C62828 0%, #8B1A1A 100%)" }}
        >
          <div className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-white/15 blur-xl" />
          <div className="relative">
            <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-3">
              <Cross className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>
            <h3 className="text-sm font-extrabold text-white leading-tight mb-1">
              دليل الإسعافات الأولية
            </h3>
            <p className="text-[11px] text-white/85 leading-relaxed">
              ١٢ حالة طارئة وخطوات إنقاذ سريعة
            </p>
          </div>
        </button>

        {/* Blood Types card */}
        <button
          onClick={() => setOpenBlood(true)}
          className="relative overflow-hidden rounded-3xl p-4 text-right shadow-soft border border-white/10 transition-bounce active:scale-95 hover:shadow-card"
          style={{ background: "linear-gradient(135deg, #1D3557 0%, #2A9D8F 100%)" }}
        >
          <div className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-white/15 blur-xl" />
          <div className="relative">
            <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-3">
              <Droplet className="h-6 w-6 text-white" fill="currentColor" />
            </div>
            <h3 className="text-sm font-extrabold text-white leading-tight mb-1">
              🩸 فصائل الدم
            </h3>
            <p className="text-[11px] text-white/85 leading-relaxed">
              موسوعة، توافق، تبرع وطلب عاجل
            </p>
          </div>
        </button>
      </div>

      <FirstAidModal open={openFirstAid} onClose={() => setOpenFirstAid(false)} />
      <BloodModal open={openBlood} onClose={() => setOpenBlood(false)} />
    </section>
  );
});

HealthGuidesSection.displayName = "HealthGuidesSection";
