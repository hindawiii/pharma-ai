import { Pill, Search, ShieldAlert, Bell, Plus, Clock, AlertTriangle, CheckCircle2, Trash2, Volume2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useSpeak } from "@/hooks/useSpeak";
import { MedicineDetailView } from "./MedicineDetailView";

// Local drug library (sample)
const DRUGS = [
  { id: "augmentin", name: "أوجمنتين 1g", category: "مضاد حيوي", company: "GSK" },
  { id: "panadol", name: "بانادول إكسترا", category: "مسكن وخافض حرارة", company: "GSK" },
  { id: "concor", name: "كونكور 5mg", category: "ضغط الدم", company: "Merck" },
  { id: "glucophage", name: "جلوكوفاج 500mg", category: "السكري", company: "Merck" },
  { id: "warfarin", name: "وارفارين 5mg", category: "مضاد تجلط", company: "Pfizer" },
  { id: "aspirin", name: "أسبرين 81mg", category: "مضاد تجلط", company: "Bayer" },
  { id: "ibuprofen", name: "بروفين 400mg", category: "مسكن", company: "Abbott" },
  { id: "omeprazole", name: "أوميبرازول 20mg", category: "حموضة المعدة", company: "Astra" },
  { id: "amlodipine", name: "أملوديبين 5mg", category: "ضغط الدم", company: "Pfizer" },
  { id: "metformin", name: "ميتفورمين 850mg", category: "السكري", company: "Sanofi" },
];

type Severity = "danger" | "caution" | "safe";

const INTERACTIONS: Record<string, { severity: Severity; note: string }> = {
  "warfarin|aspirin": { severity: "danger", note: "خطر نزيف شديد عند الجمع بين مضادي تجلط." },
  "warfarin|ibuprofen": { severity: "danger", note: "زيادة كبيرة في خطر النزيف." },
  "aspirin|ibuprofen": { severity: "caution", note: "قد يقلل بروفين من تأثير الأسبرين القلبي." },
  "concor|amlodipine": { severity: "caution", note: "هبوط شديد في ضغط الدم — مراقبة لازمة." },
  "glucophage|metformin": { severity: "danger", note: "نفس المادة الفعالة — احتمال جرعة زائدة." },
  "omeprazole|warfarin": { severity: "caution", note: "قد يزيد من تأثير الوارفارين." },
};

const pairKey = (a: string, b: string) => [a, b].sort().join("|");

const checkInteraction = (a: string, b: string) => {
  if (!a || !b || a === b) return null;
  return INTERACTIONS[pairKey(a, b)] ?? { severity: "safe" as Severity, note: "لا توجد تداخلات معروفة في قاعدة البيانات." };
};

type Reminder = { id: string; title: string; time: string; timeoutId?: number };

const STORAGE_KEY = "pharma-i:reminders";

export const MedicationScreen = () => {
  const speak = useSpeak();
  const [tab, setTab] = useState<"library" | "interactions" | "reminders">("library");
  const [selectedDrug, setSelectedDrug] = useState<typeof DRUGS[number] | null>(null);

  // ---- Library ----
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      DRUGS.filter(
        (d) => d.name.includes(query) || d.category.includes(query) || d.company.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );

  // ---- Interactions ----
  const [drugA, setDrugA] = useState("");
  const [drugB, setDrugB] = useState("");
  const result = checkInteraction(drugA, drugB);

  // ---- Reminders ----
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Reminder[]) : [];
    } catch {
      return [];
    }
  });
  const [rTitle, setRTitle] = useState("");
  const [rTime, setRTime] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders.map(({ timeoutId, ...r }) => r)));
  }, [reminders]);

  // Schedule alarms whenever reminders or permission change
  useEffect(() => {
    const timers: number[] = [];
    reminders.forEach((r) => {
      const [hh, mm] = r.time.split(":").map(Number);
      if (Number.isNaN(hh) || Number.isNaN(mm)) return;
      const now = new Date();
      const next = new Date();
      next.setHours(hh, mm, 0, 0);
      if (next.getTime() <= now.getTime()) next.setDate(next.getDate() + 1);
      const delay = next.getTime() - now.getTime();
      const id = window.setTimeout(() => {
        const body = `حان الآن: ${r.title}`;
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Pharma-i — تذكير", { body, icon: "/favicon.ico" });
        }
        toast(`⏰ ${r.title}`, { description: `الموعد: ${r.time}` });
        try {
          const audio = new Audio(
            "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=",
          );
          audio.play().catch(() => {});
        } catch {}
      }, delay);
      timers.push(id);
    });
    return () => timers.forEach((t) => clearTimeout(t));
  }, [reminders]);

  const requestNotifPermission = async () => {
    if (!("Notification" in window)) {
      toast.error("التنبيهات غير مدعومة على هذا الجهاز");
      return;
    }
    const p = await Notification.requestPermission();
    if (p === "granted") toast.success("تم تفعيل التنبيهات");
    else toast.error("لم يتم منح الإذن");
  };

  const addReminder = () => {
    if (!rTitle.trim() || !rTime) {
      toast.error("اكتب عنوان التذكير ووقت التنبيه");
      return;
    }
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
    setReminders((arr) => [...arr, { id: crypto.randomUUID(), title: rTitle.trim(), time: rTime }]);
    setRTitle("");
    setRTime("");
    toast.success("تم ضبط التذكير");
  };

  const removeReminder = (id: string) => setReminders((arr) => arr.filter((r) => r.id !== id));

  // ---- UI helpers ----
  const sevStyles: Record<Severity, { bg: string; text: string; label: string; icon: typeof AlertTriangle }> = {
    danger: { bg: "bg-destructive/15 border-destructive/40", text: "text-destructive", label: "خطر — تجنّب الدمج", icon: AlertTriangle },
    caution: { bg: "bg-warning/15 border-warning/40", text: "text-warning-foreground", label: "تحذير — مراقبة طبية", icon: AlertTriangle },
    safe: { bg: "bg-success/15 border-success/40", text: "text-success", label: "آمن — لا تداخل معروف", icon: CheckCircle2 },
  };

  return (
    <div className="min-h-[calc(100dvh-9rem)] bg-background pb-24">
      {/* Header */}
      <div className="px-4 pt-4">
        <div className="rounded-3xl gradient-hero p-4 text-white shadow-elegant relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <p className="text-xs font-bold opacity-80">مكتبة الدواء</p>
          <h2 className="text-xl font-extrabold mt-1">إدارة ذكية لأدويتك</h2>
          <p className="text-xs opacity-90 mt-1">بحث · تداخلات · تنبيهات ذكية</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-3">
        <div className="grid grid-cols-3 rounded-2xl bg-muted p-1">
          {[
            { k: "library", label: "بحث" },
            { k: "interactions", label: "تداخلات" },
            { k: "reminders", label: "تذكير" },
          ].map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k as typeof tab)}
              className={`py-2 rounded-xl text-xs font-bold transition-smooth ${
                tab === (t.k as typeof tab) ? "bg-card shadow-soft text-primary" : "text-muted-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Library */}
      {tab === "library" && (
        <div className="px-4 mt-4">
          <div className="relative mb-3">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن دواء، فئة، أو شركة..."
              className="w-full h-12 rounded-2xl bg-card border border-border pr-10 pl-3 text-sm outline-none focus:border-primary shadow-soft"
            />
          </div>
          <div className="space-y-2">
            {filtered.map((d) => (
              <div key={d.id} className="rounded-2xl p-3 bg-card border border-border shadow-soft flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-primary/15 text-primary flex items-center justify-center">
                  <Pill className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{d.name}</p>
                  <p className="text-[11px] text-muted-foreground">{d.category} · {d.company}</p>
                </div>
                <button
                  onClick={() => speak(`${d.name}. الفئة: ${d.category}`)}
                  aria-label={`نطق ${d.name}`}
                  className="h-9 w-9 rounded-full bg-secondary/10 text-secondary flex items-center justify-center active:scale-95 transition-bounce"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setSelectedDrug(d)}
                  className="text-[11px] font-bold text-primary px-3 py-1 rounded-full bg-primary/10 active:scale-95 transition-bounce"
                >
                  تفاصيل
                </button>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">لا توجد نتائج</p>
            )}
          </div>
        </div>
      )}

      {/* Interactions */}
      {tab === "interactions" && (
        <div className="px-4 mt-4">
          <div className="rounded-2xl p-4 bg-card border border-border shadow-soft">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="h-4 w-4 text-primary" />
              <h3 className="font-bold text-sm">ركن التداخلات الدوائية</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={drugA}
                onChange={(e) => setDrugA(e.target.value)}
                className="h-11 rounded-xl bg-background border border-border px-3 text-xs outline-none focus:border-primary"
              >
                <option value="">الدواء الأول</option>
                {DRUGS.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              <select
                value={drugB}
                onChange={(e) => setDrugB(e.target.value)}
                className="h-11 rounded-xl bg-background border border-border px-3 text-xs outline-none focus:border-primary"
              >
                <option value="">الدواء الثاني</option>
                {DRUGS.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            {result && (() => {
              const s = sevStyles[result.severity];
              const Icon = s.icon;
              return (
                <div className={`mt-3 rounded-2xl border p-3 ${s.bg}`}>
                  <div className={`flex items-center gap-2 font-bold text-sm ${s.text}`}>
                    <Icon className="h-4 w-4" />
                    {s.label}
                  </div>
                  <p className="text-xs text-foreground/80 mt-1 leading-relaxed">{result.note}</p>
                </div>
              );
            })()}

            {drugA && drugB && drugA === drugB && (
              <p className="text-xs text-muted-foreground mt-3">اختر دوائين مختلفين للمقارنة.</p>
            )}
          </div>

          <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
            * هذه القاعدة للأغراض التوعوية. استشر الصيدلي أو الطبيب قبل أي تعديل.
          </p>
        </div>
      )}

      {/* Reminders / Smart Alarm */}
      {tab === "reminders" && (
        <div className="px-4 mt-4">
          <div className="rounded-2xl p-4 bg-card border border-border shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                <h3 className="font-bold text-sm">منبّه ذكي</h3>
              </div>
              <button
                onClick={requestNotifPermission}
                className="text-[11px] font-bold text-primary"
              >
                تفعيل التنبيهات
              </button>
            </div>

            <input
              value={rTitle}
              onChange={(e) => setRTitle(e.target.value)}
              placeholder="عنوان التذكير (مثال: أخذ الإنسولين)"
              className="w-full h-11 rounded-xl bg-background border border-border px-3 text-sm outline-none focus:border-primary mb-2"
            />
            <div className="flex gap-2">
              <input
                type="time"
                value={rTime}
                onChange={(e) => setRTime(e.target.value)}
                className="flex-1 h-11 rounded-xl bg-background border border-border px-3 text-sm outline-none focus:border-primary"
              />
              <button
                onClick={addReminder}
                className="h-11 px-4 rounded-xl gradient-primary text-white text-sm font-bold flex items-center gap-1 shadow-card"
              >
                <Plus className="h-4 w-4" /> ضبط
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {reminders.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-6">لا توجد تذكيرات بعد</p>
            )}
            {reminders.map((r) => (
              <div key={r.id} className="rounded-2xl p-3 bg-card border border-border shadow-soft flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{r.title}</p>
                  <p className="text-[11px] text-muted-foreground">يومياً عند {r.time}</p>
                </div>
                <button
                  onClick={() => removeReminder(r.id)}
                  className="h-9 w-9 rounded-full bg-destructive/10 text-destructive flex items-center justify-center"
                  aria-label="حذف"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <MedicineDetailView
        drug={selectedDrug}
        onClose={() => setSelectedDrug(null)}
        onAddReminder={(name) => {
          const now = new Date();
          const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
          setReminders((arr) => [...arr, { id: crypto.randomUUID(), title: name, time }]);
          setTab("reminders");
        }}
      />
    </div>
  );
};
