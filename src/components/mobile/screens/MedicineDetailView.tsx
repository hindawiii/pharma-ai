import { useState } from "react";
import {
  Volume2,
  X,
  Pill,
  AlertTriangle,
  ShieldAlert,
  Clock,
  Sun,
  Moon,
  Bell,
  CheckCircle2,
  Info,
  Tag,
  FlaskConical,
  Repeat,
} from "lucide-react";
import { useSpeak } from "@/hooks/useSpeak";
import { toast } from "sonner";

export type MedicineDetail = {
  id: string;
  name: string;
  scientificName?: string;
  category: string;
  company: string;
  price?: string;
  uses?: string[];
  warnings?: string[];
  interactions?: { with: string; note: string; severity: "danger" | "caution" }[];
  dosage?: { label: string; count: number; time: "morning" | "evening" | "noon"; form: "pill" | "spoon" | "injection" }[];
  alternatives?: { name: string; company: string }[];
};

const buildMockDetail = (base: { id: string; name: string; category?: string; company?: string }): MedicineDetail => {
  const category = base.category ?? "دواء";
  const company = base.company ?? "غير محدد";
  return ({
  ...base,
  category,
  company,
  scientificName: category.includes("مضاد حيوي")
    ? "Amoxicillin + Clavulanic Acid"
    : category.includes("مسكن")
    ? "Paracetamol / Ibuprofen"
    : category.includes("ضغط")
    ? "Bisoprolol / Amlodipine"
    : category.includes("السكري")
    ? "Metformin HCl"
    : category.includes("تجلط")
    ? "Warfarin / Acetylsalicylic Acid"
    : "Active Pharmaceutical Ingredient",
  price: "≈ 1,200 SDG",
  uses: [
    "علاج الأعراض المرتبطة بـ " + base.category,
    "يستخدم تحت إشراف طبي للحالات المزمنة",
    "قد يساعد في تخفيف الألم والالتهاب المرتبط",
  ],
  warnings: [
    "لا يستخدم أثناء الحمل دون استشارة الطبيب",
    "تجنّب القيادة في حال الشعور بالدوار",
    "يحفظ بعيداً عن متناول الأطفال",
  ],
  interactions: [
    { with: "وارفارين", note: "زيادة خطر النزيف عند الاستخدام المتزامن.", severity: "danger" },
    { with: "بروفين", note: "قد يقلل من الفعالية القلبية.", severity: "caution" },
  ],
  dosage: [
    { label: "حبة صباحاً", count: 1, time: "morning", form: "pill" },
    { label: "حبة مساءً", count: 1, time: "evening", form: "pill" },
  ],
  alternatives: [
    { name: "بديل محلي A", company: "Sudan Pharma" },
    { name: "بديل محلي B", company: "Blue Nile Labs" },
    { name: "بديل عالمي", company: "Generic Intl." },
  ],
});
};

type TabKey = "overview" | "safety" | "dosage" | "alternatives";

interface Props {
  drug: { id: string; name: string; category: string; company: string } | null;
  onClose: () => void;
  onAddReminder?: (name: string) => void;
}

export const MedicineDetailView = ({ drug, onClose, onAddReminder }: Props) => {
  const speak = useSpeak();
  const [tab, setTab] = useState<TabKey>("overview");

  if (!drug) return null;
  const detail = buildMockDetail(drug);

  const tabs: { k: TabKey; label: string; icon: typeof Info }[] = [
    { k: "overview", label: "نظرة عامة", icon: Info },
    { k: "safety", label: "تحذيرات", icon: ShieldAlert },
    { k: "dosage", label: "الجرعات", icon: Pill },
    { k: "alternatives", label: "البدائل", icon: Repeat },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-stretch justify-center bg-black/40 backdrop-blur-sm" dir="rtl">
      <div className="relative mx-auto w-full max-w-md h-dvh bg-background flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Hero header */}
        <div className="relative gradient-primary text-white px-5 pt-5 pb-6 rounded-b-[2rem] shadow-elegant">
          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="absolute top-4 left-4 h-9 w-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center active:scale-95 transition-bounce"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-start gap-3 mt-2">
            <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <Pill className="h-7 w-7" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-extrabold leading-tight truncate">{detail.name}</h2>
                <button
                  onClick={() => speak(`${detail.name}. ${detail.scientificName ?? ""}`)}
                  aria-label="نطق الاسم"
                  className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center active:scale-95"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm opacity-90 mt-1">{detail.scientificName}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[11px] font-bold bg-white/20 px-2 py-0.5 rounded-full">{detail.category}</span>
                <span className="text-[11px] opacity-80">{detail.company}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 mt-3">
          <div className="grid grid-cols-4 rounded-2xl bg-muted p-1">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.k;
              return (
                <button
                  key={t.k}
                  onClick={() => setTab(t.k)}
                  className={`py-2 rounded-xl text-[11px] font-bold transition-smooth flex flex-col items-center gap-0.5 ${
                    active ? "bg-card shadow-soft text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 mt-3 pb-28 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tab === "overview" && (
            <div className="space-y-3">
              <div className="rounded-2xl p-4 bg-card border border-border shadow-soft">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4 text-primary" />
                  <h3 className="font-bold text-sm">السعر التقريبي</h3>
                </div>
                <p className="text-2xl font-extrabold text-primary">{detail.price}</p>
                <p className="text-[11px] text-muted-foreground mt-1">قد يختلف السعر حسب الصيدلية والمنطقة.</p>
              </div>

              <div className="rounded-2xl p-4 bg-card border border-border shadow-soft">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="h-4 w-4 text-primary" />
                  <h3 className="font-bold text-sm">الاستخدامات</h3>
                </div>
                <ul className="space-y-2">
                  {detail.uses?.map((u, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                      <span className="leading-relaxed">{u}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl p-4 bg-secondary/10 border border-secondary/30">
                <div className="flex items-center gap-2 mb-2">
                  <FlaskConical className="h-4 w-4 text-secondary" />
                  <h3 className="font-bold text-sm">المادة الفعّالة</h3>
                </div>
                <p className="text-sm text-foreground/80">{detail.scientificName}</p>
              </div>
            </div>
          )}

          {tab === "safety" && (
            <div className="space-y-3">
              <div className="rounded-2xl p-4 bg-warning/15 border border-warning/40">
                <div className="flex items-center gap-2 mb-3 text-warning-foreground">
                  <AlertTriangle className="h-4 w-4" />
                  <h3 className="font-bold text-sm">تحذيرات هامة</h3>
                </div>
                <ul className="space-y-2">
                  {detail.warnings?.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-warning mt-2 shrink-0" />
                      <span className="leading-relaxed">{w}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-primary" /> تداخلات دوائية
                </h3>
                {detail.interactions?.map((it, i) => {
                  const danger = it.severity === "danger";
                  return (
                    <div
                      key={i}
                      className={`rounded-2xl p-3 border ${
                        danger
                          ? "bg-destructive/10 border-destructive/40"
                          : "bg-warning/10 border-warning/40"
                      }`}
                    >
                      <div className={`flex items-center gap-2 font-bold text-sm ${danger ? "text-destructive" : "text-warning-foreground"}`}>
                        <AlertTriangle className="h-4 w-4" />
                        مع: {it.with}
                      </div>
                      <p className="text-xs text-foreground/80 mt-1 leading-relaxed">{it.note}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === "dosage" && (
            <div className="space-y-3">
              <div className="rounded-2xl p-4 bg-card border border-border shadow-soft">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-primary" />
                  <h3 className="font-bold text-sm">الجرعة اليومية الموصى بها</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {detail.dosage?.map((d, i) => (
                    <div key={i} className="rounded-2xl p-3 bg-primary/5 border border-primary/20 flex flex-col items-center text-center">
                      <div className="flex items-center gap-1 mb-2">
                        {d.time === "morning" ? (
                          <Sun className="h-4 w-4 text-warning" />
                        ) : (
                          <Moon className="h-4 w-4 text-secondary" />
                        )}
                        <span className="text-[11px] font-bold">
                          {d.time === "morning" ? "صباحاً" : "مساءً"}
                        </span>
                      </div>
                      <div className="flex gap-1 mb-2">
                        {Array.from({ length: d.count }).map((_, j) => (
                          <Pill key={j} className="h-6 w-6 text-primary" />
                        ))}
                      </div>
                      <p className="text-xs font-bold">{d.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl p-3 bg-muted/50 border border-border text-[11px] text-muted-foreground leading-relaxed">
                * الجرعة قد تتغير حسب وزن المريض والحالة. استشر الطبيب أو الصيدلي.
              </div>
            </div>
          )}

          {tab === "alternatives" && (
            <div className="space-y-2">
              {detail.alternatives?.map((a, i) => (
                <div key={i} className="rounded-2xl p-3 bg-card border border-border shadow-soft flex items-center gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-success/15 text-success flex items-center justify-center">
                    <Repeat className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{a.name}</p>
                    <p className="text-[11px] text-muted-foreground">{a.company}</p>
                  </div>
                  <span className="text-[11px] font-bold text-success bg-success/10 px-2 py-1 rounded-full">
                    نفس المادة
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Floating Action Button */}
        <div className="absolute bottom-4 inset-x-4">
          <button
            onClick={() => {
              onAddReminder?.(detail.name);
              toast.success("تمت إضافة الدواء إلى التذكيرات");
              onClose();
            }}
            className="w-full h-14 rounded-2xl gradient-primary text-white font-bold shadow-elegant flex items-center justify-center gap-2 active:scale-[0.98] transition-bounce"
          >
            <Bell className="h-5 w-5" />
            تنبيه لموعد الدواء
          </button>
        </div>
      </div>
    </div>
  );
};
