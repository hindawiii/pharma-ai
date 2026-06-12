import { Pill, Search, ShieldAlert, Bell, Plus, Clock, AlertTriangle, CheckCircle2, ShieldCheck, Trash2, Volume2, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useSpeak } from "@/hooks/useSpeak";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { MedicineDetailView } from "./MedicineDetailView";
import { PulseAlert } from "../PulseAlert";

interface Drug {
  id: string;
  brand_ar: string;
  brand_en: string;
  scientific_ar: string;
  scientific_en: string;
  category_ar: string | null;
  manufacturer: string | null;
  price_sdg: number | null;
  form: string | null;
  description_ar: string | null;
}

type Severity = "danger" | "warning" | "safe";

interface InteractionResult {
  severity: Severity;
  description_ar: string;
  personalWarnings: string[];
}

interface DBReminder {
  id: string;
  drug_name: string;
  frequency: "daily" | "weekdays" | "interval";
  weekdays: number[] | null;
  interval_hours: number | null;
  times: string[] | null;
  active: boolean;
  notes: string | null;
}

const WEEKDAY_LABELS = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

// Drug category filter chips. Each entry maps an Arabic label to keywords matched against
// `category_ar`, `scientific_ar`, `brand_ar` and description fields (case-insensitive substring).
const DRUG_CATEGORIES: { key: string; label: string; keywords: string[] }[] = [
  { key: "all", label: "الكل", keywords: [] },
  { key: "heart", label: "🫀 القلب", keywords: ["قلب", "ضغط الدم", "heart", "cardio", "بيتا", "نترات"] },
  { key: "diabetes", label: "🩸 السكر", keywords: ["سكر", "سكري", "diabetes", "ميتفورمين", "إنسولين", "انسولين"] },
  { key: "bp_ibs", label: "🩺 الضغط/المصران", keywords: ["ضغط", "مصران", "قولون", "أمعاء", "امعاء", "ibs", "hypertension"] },
  { key: "depression", label: "🧠 الاكتئاب", keywords: ["اكتئاب", "مهدئ", "قلق", "مزاج", "depression", "anxio", "sedative", "نوم"] },
  { key: "stomach", label: "💊 المعدة", keywords: ["معدة", "حموضة", "قرحة", "هضم", "stomach", "antacid", "ppi", "أوميبرازول"] },
  { key: "pain", label: "🩹 المسكنات", keywords: ["مسكن", "ألم", "صداع", "باراسيتامول", "ايبوبروفين", "إيبوبروفين", "اسبرين", "أسبرين", "analgesic", "pain", "nsaid", "paracetamol", "ibuprofen"] },
];

// ---- helper: cross-reference allergies & chronic conditions ----
const personalRisksFor = (drug: Drug | undefined, allergies: string[], chronic: string[]): string[] => {
  if (!drug) return [];
  const risks: string[] = [];
  const haystack = `${drug.scientific_ar} ${drug.scientific_en} ${drug.brand_ar} ${drug.brand_en} ${drug.category_ar ?? ""}`.toLowerCase();
  for (const a of allergies) {
    const t = a.trim().toLowerCase();
    if (t && haystack.includes(t)) risks.push(`خطر: لديك حساسية مسجّلة من «${a}» وهذا الدواء يحتويها أو يشبهها.`);
  }
  // simple chronic→category map
  const chronicMap: Record<string, string[]> = {
    "ضغط": ["مسكن", "كورتيزون", "احتقان"],
    "سكري": ["كورتيزون", "شراب"],
    "قلب": ["مضاد التهاب", "احتقان"],
    "كلى": ["مضاد التهاب", "مسكن"],
    "ربو": ["حاصر بيتا", "اسبرين", "أسبرين"],
  };
  for (const cond of chronic) {
    for (const [keyword, badCats] of Object.entries(chronicMap)) {
      if (cond.includes(keyword)) {
        for (const cat of badCats) {
          if (haystack.includes(cat.toLowerCase())) {
            risks.push(`تحذير: هذا الدواء قد يتعارض مع حالة «${cond}» المسجّلة في ملفّك.`);
          }
        }
      }
    }
  }
  return Array.from(new Set(risks));
};

export const MedicationScreen = () => {
  const speak = useSpeak();
  const { user } = useAuth();
  const { profile } = useProfile();
  const [tab, setTab] = useState<"library" | "interactions" | "reminders">("library");
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);

  // ---- Library: live search ----
  const [query, setQuery] = useState("");
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [searching, setSearching] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setSearching(true);
      const term = query.trim();
      try {
        if (!term) {
          const { data, error } = await supabase
            .from("drugs")
            .select("*")
            .order("brand_ar")
            .limit(40);
          if (error) throw error;
          if (!cancelled) setDrugs((data ?? []) as Drug[]);
        } else {
          // Sanitize: PostgREST .or() uses ',' '(' ')' as syntax — strip them from the term
          const safe = term.replace(/[(),]/g, " ").trim();
          const like = `%${safe}%`;
          const { data, error } = await supabase
            .from("drugs")
            .select("*")
            .or(
              `brand_ar.ilike.${like},brand_en.ilike.${like},scientific_ar.ilike.${like},scientific_en.ilike.${like},category_ar.ilike.${like}`
            )
            .limit(40);
          if (error) throw error;
          if (!cancelled) setDrugs((data ?? []) as Drug[]);
        }
      } catch (e) {
        console.error("[drug search] failed:", e);
        if (!cancelled) {
          setDrugs([]);
          toast.error("تعذّر تحميل قاعدة الأدوية");
        }
      } finally {
        if (!cancelled) setSearching(false);
      }
    };
    const id = setTimeout(run, 250);
    return () => { cancelled = true; clearTimeout(id); };
  }, [query]);

  // Client-side category filter applied on top of the server search results.
  const filteredDrugs = useMemo(() => {
    const cat = DRUG_CATEGORIES.find((c) => c.key === activeCategory);
    if (!cat || cat.key === "all" || cat.keywords.length === 0) return drugs;
    return drugs.filter((d) => {
      const hay = `${d.category_ar ?? ""} ${d.scientific_ar} ${d.scientific_en} ${d.brand_ar} ${d.brand_en} ${d.description_ar ?? ""}`.toLowerCase();
      return cat.keywords.some((kw) => hay.includes(kw.toLowerCase()));
    });
  }, [drugs, activeCategory]);

  // ---- Interactions (multi-drug) ----
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pairResults, setPairResults] = useState<Array<{
    drugA: Drug;
    drugB: Drug;
    severity: Severity;
    description_ar: string;
  }>>([]);
  const [personalAlerts, setPersonalAlerts] = useState<string[]>([]);
  const [checkingInter, setCheckingInter] = useState(false);

  const addDrugToCheck = (id: string) => {
    if (!id) return;
    setSelectedIds((arr) => (arr.includes(id) ? arr : [...arr, id]));
  };
  const removeDrugFromCheck = (id: string) =>
    setSelectedIds((arr) => arr.filter((x) => x !== id));

  useEffect(() => {
    const run = async () => {
      if (selectedIds.length < 1) {
        setPairResults([]);
        setPersonalAlerts([]);
        return;
      }
      setCheckingInter(true);

      // Personal warnings for every selected drug
      const personal = new Set<string>();
      for (const id of selectedIds) {
        const drugObj = drugs.find((d) => d.id === id);
        for (const w of personalRisksFor(drugObj, profile?.allergies ?? [], profile?.chronic_conditions ?? [])) {
          personal.add(w);
        }
      }
      setPersonalAlerts(Array.from(personal));

      // Pairwise check via DB
      const pairs: Array<{ drugA: Drug; drugB: Drug; severity: Severity; description_ar: string }> = [];
      for (let i = 0; i < selectedIds.length; i++) {
        for (let j = i + 1; j < selectedIds.length; j++) {
          const a = selectedIds[i];
          const b = selectedIds[j];
          const { data } = await supabase
            .from("drug_interactions")
            .select("severity, description_ar")
            .or(`and(drug_a.eq.${a},drug_b.eq.${b}),and(drug_a.eq.${b},drug_b.eq.${a})`)
            .maybeSingle();
          const drugA = drugs.find((d) => d.id === a)!;
          const drugB = drugs.find((d) => d.id === b)!;
          if (!drugA || !drugB) continue;
          if (data) {
            pairs.push({
              drugA,
              drugB,
              severity: data.severity as Severity,
              description_ar: data.description_ar,
            });
          } else {
            pairs.push({
              drugA,
              drugB,
              severity: "safe",
              description_ar: "آمن: لا يوجد تعارض معروف بين هذين الدوائين.",
            });
          }
        }
      }
      setPairResults(pairs);
      setCheckingInter(false);
    };
    run();
  }, [selectedIds, drugs, profile]);

  // ---- Reminders (DB-backed) ----
  const [reminders, setReminders] = useState<DBReminder[]>([]);
  const [rName, setRName] = useState("");
  const [rFreq, setRFreq] = useState<"daily" | "weekdays" | "interval">("daily");
  const [rDays, setRDays] = useState<number[]>([]);
  const [rInterval, setRInterval] = useState<number>(8);
  const [rTime, setRTime] = useState("");

  // Pulse alert state
  const [alert, setAlert] = useState<{ title: string; body?: string } | null>(null);

  const loadReminders = () => {
    setReminders(getReminders() as unknown as DBReminder[]);
  };

  useEffect(() => {
    loadReminders();
    const h = () => loadReminders();
    window.addEventListener("local-health-changed", h);
    return () => window.removeEventListener("local-health-changed", h);
  }, []);


  // Schedule alarms in-app
  useEffect(() => {
    const timers: number[] = [];
    const now = new Date();

    reminders.filter((r) => r.active).forEach((r) => {
      if (r.frequency === "interval" && r.interval_hours) {
        const ms = r.interval_hours * 3600 * 1000;
        const id = window.setTimeout(() => fire(r.drug_name, `كل ${r.interval_hours} ساعات`), ms);
        timers.push(id);
      } else {
        (r.times ?? []).forEach((t) => {
          const [hh, mm] = t.split(":").map(Number);
          if (Number.isNaN(hh)) return;
          const next = new Date();
          next.setHours(hh, mm ?? 0, 0, 0);
          if (next.getTime() <= now.getTime()) next.setDate(next.getDate() + 1);
          if (r.frequency === "weekdays" && r.weekdays && r.weekdays.length > 0) {
            while (!r.weekdays.includes(next.getDay())) {
              next.setDate(next.getDate() + 1);
            }
          }
          const delay = next.getTime() - now.getTime();
          if (delay > 0 && delay < 24 * 3600 * 1000 * 2) {
            const id = window.setTimeout(() => fire(r.drug_name, `الموعد: ${t}`), delay);
            timers.push(id);
          }
        });
      }
    });

    return () => timers.forEach((t) => clearTimeout(t));
  }, [reminders]);

  const fire = (name: string, sub: string) => {
    setAlert({ title: name, body: sub });
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Pharma-i — تذكير دواء", { body: `${name} — ${sub}`, icon: "/favicon.ico" });
    }
  };

  const requestNotifPermission = async () => {
    if (!("Notification" in window)) return;
    const p = await Notification.requestPermission();
    if (p === "granted") toast.success("تم تفعيل التنبيهات");
  };

  const addReminder = async () => {
    if (!user) { toast.error("سجّل الدخول أولاً"); return; }
    if (!rName.trim()) { toast.error("اكتب اسم الدواء"); return; }
    if (rFreq !== "interval" && !rTime) { toast.error("اختر وقت التذكير"); return; }
    if (rFreq === "weekdays" && rDays.length === 0) { toast.error("اختر أيام الأسبوع"); return; }

    // Strict schema match:
    //   times: time without time zone[]   →  "HH:MM:SS" strings (or [])
    //   weekdays: smallint[]              →  number[] (or [])
    //   interval_hours: smallint | null   →  1..24 only when interval, else null
    //   start_date: date                  →  YYYY-MM-DD
    //   active: boolean                   →  true
    const today = new Date();
    const startDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const normalizedTime = rFreq === "interval" ? null : `${rTime}:00`;
    const safeInterval = rFreq === "interval" ? Math.min(24, Math.max(1, Math.floor(rInterval || 8))) : null;

    const payload = {
      user_id: user.id,
      drug_name: rName.trim(),
      frequency: rFreq,
      times: rFreq === "interval" ? [] : [normalizedTime as string],
      weekdays: rFreq === "weekdays" ? rDays : [],
      interval_hours: safeInterval,
      active: true,
      start_date: startDate,
      notes: null,
    };
    const { error } = await supabase.from("reminders").insert(payload);
    if (error) {
      console.error("[reminders insert] failed:", error, "payload:", payload);
      toast.error(`تعذّر حفظ التذكير: ${error.message}`);
      return;
    }
    toast.success("تم ضبط التذكير");
    setRName(""); setRTime(""); setRDays([]);
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
    loadReminders();
  };

  const removeReminder = async (id: string) => {
    await supabase.from("reminders").delete().eq("id", id);
    loadReminders();
  };

  const toggleDay = (d: number) =>
    setRDays((arr) => (arr.includes(d) ? arr.filter((x) => x !== d) : [...arr, d]));

  // ---- traffic-light styling ----
  const sevStyle = (s: Severity) =>
    s === "danger"
      ? { wrap: "bg-destructive/10 border-destructive", title: "text-destructive", label: "🔴 خطر — لا تجمع بينهما", icon: AlertTriangle }
      : s === "warning"
        ? { wrap: "bg-warning/15 border-warning", title: "text-warning", label: "🟡 تحذير — استشر الطبيب", icon: AlertTriangle }
        : { wrap: "bg-success/10 border-success", title: "text-success", label: "🟢 آمن — يمكن استخدامهما معاً", icon: ShieldCheck };

  return (
    <div className="min-h-[calc(100dvh-9rem)] bg-background pb-24">
      <div className="px-4 pt-4">
        <div className="rounded-3xl gradient-hero p-4 text-white shadow-elegant relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <p className="text-xs font-bold opacity-80">مكتبة الدواء</p>
          <h2 className="text-xl font-extrabold mt-1">إدارة ذكية لأدويتك</h2>
          <p className="text-xs opacity-90 mt-1">بحث · تداخلات · تنبيهات شخصية</p>
        </div>
      </div>

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

      {/* LIBRARY */}
      {tab === "library" && (
        <div className="px-4 mt-4">
          {/* Category filter — compact 3-column grid, RTL */}
          <div dir="rtl" className="mb-3 grid grid-cols-3 gap-1.5 font-sans">
            {DRUG_CATEGORIES.map((c) => {
              const active = activeCategory === c.key;
              return (
                <button
                  key={c.key}
                  onClick={() => setActiveCategory(c.key)}
                  className={`w-full min-h-8 px-2 py-1.5 rounded-xl text-[11px] leading-tight font-bold border transition-colors duration-150 active:scale-95 text-center break-words ${
                    active
                      ? "bg-primary text-primary-foreground border-primary shadow-soft"
                      : "bg-card text-foreground border-border hover:bg-muted"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          <div className="relative mb-3">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث بالاسم التجاري أو العلمي (عربي/English)..."
              className="w-full h-11 rounded-2xl bg-card border border-border pr-10 pl-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary shadow-soft"
            />
            {searching && <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />}
          </div>

          {/* Compact 2-column grid of drug cards */}
          <div dir="rtl" className="grid grid-cols-2 gap-2 font-sans">
            {filteredDrugs.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDrug(d)}
                className="text-right rounded-2xl p-2.5 bg-card border border-border shadow-soft active:scale-[0.98] transition-bounce flex flex-col gap-1.5 min-h-[112px]"
              >
                <div className="flex items-start justify-between gap-1">
                  <div className="h-8 w-8 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
                    <Pill className="h-4 w-4" />
                  </div>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => { e.stopPropagation(); speak(`${d.brand_ar}. ${d.scientific_ar}`); }}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); speak(`${d.brand_ar}. ${d.scientific_ar}`); } }}
                    aria-label={`نطق ${d.brand_ar}`}
                    className="h-7 w-7 rounded-full bg-secondary/10 text-secondary flex items-center justify-center active:scale-95 cursor-pointer"
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                  </span>
                </div>
                <p className="font-extrabold text-[12.5px] leading-tight text-foreground line-clamp-2">
                  {d.brand_ar}
                </p>
                <p className="text-[10.5px] text-muted-foreground line-clamp-1">
                  {d.scientific_ar}
                </p>
                {d.category_ar && (
                  <span className="self-start text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-auto line-clamp-1">
                    {d.category_ar}
                  </span>
                )}
              </button>
            ))}
            {!searching && filteredDrugs.length === 0 && (
              <p className="col-span-2 text-center text-sm text-muted-foreground py-8">
                {drugs.length === 0 ? "لا توجد نتائج لبحثك" : "لا توجد أدوية ضمن هذه الفئة"}
              </p>
            )}
          </div>
        </div>
      )}

      {/* INTERACTIONS — multi drug */}
      {tab === "interactions" && (
        <div className="px-4 mt-4">
          <div className="rounded-2xl p-4 bg-card border border-border shadow-soft">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="h-4 w-4 text-primary" />
              <h3 className="font-bold text-sm">إشارة المرور للتداخلات الدوائية</h3>
            </div>

            {/* Add-drug picker */}
            <div className="flex items-center gap-2">
              <select
                value=""
                onChange={(e) => addDrugToCheck(e.target.value)}
                className="flex-1 h-11 rounded-xl bg-background border border-input px-3 text-xs text-foreground outline-none focus:border-primary"
              >
                <option value="">إضافة دواء للفحص...</option>
                {drugs
                  .filter((d) => !selectedIds.includes(d.id))
                  .map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.brand_ar} · {d.scientific_ar}
                    </option>
                  ))}
              </select>
            </div>

            {/* Selected drug chips */}
            {selectedIds.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedIds.map((id) => {
                  const d = drugs.find((x) => x.id === id);
                  if (!d) return null;
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-[11px] font-bold px-3 py-1.5 rounded-full"
                    >
                      {d.brand_ar}
                      <button
                        onClick={() => removeDrugFromCheck(id)}
                        aria-label={`إزالة ${d.brand_ar}`}
                        className="h-5 w-5 rounded-full bg-primary/15 hover:bg-destructive/20 hover:text-destructive flex items-center justify-center"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            )}

            {checkingInter && <p className="text-xs text-muted-foreground mt-3">جارٍ التحقق...</p>}

            {selectedIds.length >= 2 && pairResults.length > 0 && (
              <div className="mt-4 space-y-2">
                {pairResults.map((p, idx) => {
                  const s = sevStyle(p.severity);
                  const Icon = s.icon;
                  return (
                    <div key={idx} className={`rounded-2xl border-2 p-3 ${s.wrap}`}>
                      <div className={`flex items-center gap-2 font-extrabold text-sm ${s.title}`}>
                        <Icon className="h-5 w-5" />
                        {s.label}
                      </div>
                      <p className="text-[11px] text-foreground/70 mt-1 font-bold">
                        {p.drugA.brand_ar} ↔ {p.drugB.brand_ar}
                      </p>
                      <p className="text-xs text-foreground/85 mt-1 leading-relaxed">
                        {p.description_ar}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {selectedIds.length === 1 && (
              <p className="text-xs text-muted-foreground mt-3">
                أضف دواءً ثانياً على الأقل لفحص التداخل.
              </p>
            )}

            {personalAlerts.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-[11px] font-extrabold text-destructive">
                  تنبيهات شخصية مبنية على ملفّك الطبي:
                </p>
                {personalAlerts.map((w, i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-destructive/10 border border-destructive/40 p-2 text-xs font-bold text-destructive flex items-start gap-2"
                  >
                    <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
            * نتائج توعوية. استشر الصيدلي قبل أي تعديل في العلاج.
          </p>
        </div>
      )}

      {/* REMINDERS */}
      {tab === "reminders" && (
        <div className="px-4 mt-4">
          <div className="rounded-2xl p-4 bg-card border border-border shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                <h3 className="font-bold text-sm">منبّه ذكي</h3>
              </div>
              <button onClick={requestNotifPermission} className="text-[11px] font-bold text-primary">
                تفعيل الإشعارات
              </button>
            </div>

            <input
              value={rName}
              onChange={(e) => setRName(e.target.value)}
              placeholder="اسم الدواء (مثال: أوجمنتين)"
              className="w-full h-11 rounded-xl bg-background border border-input px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary mb-2"
            />

            <div className="grid grid-cols-3 gap-1 bg-muted p-1 rounded-xl mb-2">
              {[
                { k: "daily", l: "يومياً" },
                { k: "weekdays", l: "أيام محددة" },
                { k: "interval", l: "كل عدة ساعات" },
              ].map((o) => (
                <button
                  key={o.k}
                  onClick={() => setRFreq(o.k as typeof rFreq)}
                  className={`py-1.5 rounded-lg text-[11px] font-bold ${rFreq === o.k ? "bg-card text-primary shadow-soft" : "text-muted-foreground"}`}
                >
                  {o.l}
                </button>
              ))}
            </div>

            {rFreq === "weekdays" && (
              <div className="flex flex-wrap gap-1 mb-2">
                {WEEKDAY_LABELS.map((l, i) => (
                  <button
                    key={i}
                    onClick={() => toggleDay(i)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border ${rDays.includes(i) ? "bg-primary text-primary-foreground border-primary" : "bg-background text-foreground border-input"}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            )}

            {rFreq === "interval" ? (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-foreground font-bold">كل</span>
                <input
                  type="number"
                  min={1} max={24}
                  value={rInterval}
                  onChange={(e) => setRInterval(parseInt(e.target.value) || 8)}
                  className="w-20 h-11 rounded-xl bg-background border border-input px-3 text-sm text-foreground outline-none focus:border-primary text-center"
                />
                <span className="text-xs text-foreground font-bold">ساعات</span>
              </div>
            ) : (
              <input
                type="time"
                value={rTime}
                onChange={(e) => setRTime(e.target.value)}
                className="w-full h-11 rounded-xl bg-background border border-input px-3 text-sm text-foreground outline-none focus:border-primary mb-2"
              />
            )}

            <button
              onClick={addReminder}
              className="w-full h-11 rounded-xl gradient-primary text-white text-sm font-bold flex items-center justify-center gap-1 shadow-card active:scale-[.98]"
            >
              <Plus className="h-4 w-4" /> إضافة تذكير
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {!user && <p className="text-center text-xs text-muted-foreground">سجّل الدخول لحفظ تذكيراتك في السحابة</p>}
            {user && reminders.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-6">لا توجد تذكيرات بعد</p>
            )}
            {reminders.map((r) => (
              <div key={r.id} className="rounded-2xl p-3 bg-card border border-border shadow-soft flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{r.drug_name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {r.frequency === "daily" && `يومياً عند ${(r.times ?? []).join(", ")}`}
                    {r.frequency === "weekdays" && `${(r.weekdays ?? []).map((d) => WEEKDAY_LABELS[d]).join("، ")} عند ${(r.times ?? []).join(", ")}`}
                    {r.frequency === "interval" && `كل ${r.interval_hours} ساعات`}
                  </p>
                </div>
                <button onClick={() => removeReminder(r.id)} className="h-9 w-9 rounded-full bg-destructive/10 text-destructive flex items-center justify-center" aria-label="حذف">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <MedicineDetailView
        drug={selectedDrug as any}
        onClose={() => setSelectedDrug(null)}
        onAddReminder={(name) => {
          setRName(name);
          setRFreq("daily");
          const now = new Date();
          setRTime(`${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`);
          setTab("reminders");
        }}
      />

      <PulseAlert
        open={!!alert}
        title={alert?.title ?? ""}
        body={alert?.body}
        onClose={() => setAlert(null)}
      />
    </div>
  );
};
