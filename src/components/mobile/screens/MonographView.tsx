import { useMemo, useState } from "react";
import {
  Volume2,
  X,
  Pill,
  AlertTriangle,
  ShieldAlert,
  Clock,
  Bell,
  CheckCircle2,
  Info,
  Tag,
  FlaskConical,
  Baby,
  HeartPulse,
  Droplets,
  Thermometer,
  Users,
  Printer,
  ChevronDown,
  Ban,
  Syringe,
  BookOpen,
} from "lucide-react";
import { useSpeak } from "@/hooks/useSpeak";
import { printHtml, esc } from "@/lib/printExport";
import { toast } from "sonner";
import type { DrugMonograph } from "@/types/drugMonograph";

type TabKey = "overview" | "dosage" | "safety" | "special" | "patient";

const Section = ({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
  tone = "card",
}: {
  title: string;
  icon: typeof Info;
  children: React.ReactNode;
  defaultOpen?: boolean;
  tone?: "card" | "warn" | "danger" | "success";
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const toneCls =
    tone === "warn"
      ? "bg-warning/10 border-warning/40"
      : tone === "danger"
      ? "bg-destructive/10 border-destructive/40"
      : tone === "success"
      ? "bg-success/10 border-success/30"
      : "bg-card border-border shadow-soft";
  return (
    <div className={`rounded-2xl border ${toneCls} overflow-hidden`}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center gap-2 px-4 py-3 text-right"
      >
        <Icon className="h-4 w-4 text-primary shrink-0" />
        <h3 className="font-bold text-sm flex-1">{title}</h3>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-smooth ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-4 pb-4 text-sm leading-relaxed">{children}</div>}
    </div>
  );
};

const Bullets = ({ items, icon }: { items: string[]; icon?: "check" | "dot" | "ban" }) => (
  <ul className="space-y-2">
    {items.map((t, i) => (
      <li key={i} className="flex items-start gap-2">
        {icon === "check" ? (
          <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
        ) : icon === "ban" ? (
          <Ban className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
        ) : (
          <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
        )}
        <span>{t}</span>
      </li>
    ))}
  </ul>
);

const Row = ({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Info }) => (
  <div className="rounded-2xl p-3 bg-card border border-border shadow-soft">
    <div className="flex items-center gap-2 mb-1">
      <Icon className="h-4 w-4 text-primary" />
      <span className="font-bold text-xs">{label}</span>
    </div>
    <p className="text-sm text-foreground/85 leading-relaxed">{value}</p>
  </div>
);

interface Props {
  mono: DrugMonograph;
  onClose: () => void;
  onAddReminder?: (name: string) => void;
}

export const MonographView = ({ mono, onClose, onAddReminder }: Props) => {
  const speak = useSpeak();
  const [tab, setTab] = useState<TabKey>("overview");

  const pregTone = useMemo(() => {
    const c = mono.pregnancy.category.toUpperCase();
    if (c.includes("X") || c.includes("D")) return "danger" as const;
    if (c.includes("C")) return "warn" as const;
    return "success" as const;
  }, [mono.pregnancy.category]);

  const handlePrint = () => {
    const list = (arr: string[]) => `<ul>${arr.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
    const html = `
<div class="box"><h2>${esc(mono.nameAr)} — ${esc(mono.nameEn)}</h2>
<p>المادة الفعالة: ${esc(mono.scientificAr)} (${esc(mono.scientificEn)}) · الفئة: ${esc(mono.categoryAr)} · التكلفة: ${esc(mono.cost)}</p></div>
<h2>دواعي الاستعمال</h2>${list(mono.indications)}
<h2>الجرعة</h2><table><tr><th>الفئة</th><th>الجرعة</th></tr>${mono.dosage
      .map((d) => `<tr><td>${esc(d.group)}</td><td>${esc(d.text)}</td></tr>`)
      .join("")}</table>
<h2>موانع الاستعمال</h2>${list(mono.contraindications)}
<h2>التحذيرات</h2>${list(mono.warnings)}
<h2>التفاعلات الدوائية</h2><table><tr><th>مع</th><th>الملاحظة</th><th>الشدة</th></tr>${mono.interactions
      .map((i) => `<tr><td>${esc(i.with)}</td><td>${esc(i.note)}</td><td>${i.severity === "danger" ? "خطير" : "احتياط"}</td></tr>`)
      .join("")}</table>
<h2>حالات خاصة</h2>
<div class="box"><h3>الفشل الكبدي</h3><p>${esc(mono.hepatic)}</p>
<h3>الفشل الكلوي</h3><p>${esc(mono.renal)}</p>
<h3>كبار السن</h3><p>${esc(mono.elderly)}</p>
<h3>الأطفال</h3><p>${esc(mono.pediatric)}</p>
<h3>الحمل (فئة ${esc(mono.pregnancy.category)})</h3><p>${esc(mono.pregnancy.note)}</p>
<h3>الرضاعة</h3><p>${esc(mono.lactation)}</p>
<h3>الفئات العمرية</h3><p>${esc(mono.ageGroups)}</p></div>
<h2>الأشكال الصيدلانية</h2>${list(mono.forms)}
<h2>التخزين</h2><p>${esc(mono.storage)}</p>
<h2>الجرعة الزائدة</h2><p class="warn">${esc(mono.overdose)}</p>
<h2>إرشادات المريض</h2>${list(mono.patientAdvice)}
<h2>المصادر</h2>${list(mono.sources)}`;
    if (!printHtml(`بطاقة دواء: ${mono.nameAr}`, html)) toast.error("تعذر فتح نافذة الطباعة");
  };

  const tabs: { k: TabKey; label: string; icon: typeof Info }[] = [
    { k: "overview", label: "نظرة عامة", icon: Info },
    { k: "dosage", label: "الجرعة", icon: Pill },
    { k: "safety", label: "الأمان", icon: ShieldAlert },
    { k: "special", label: "حالات خاصة", icon: HeartPulse },
    { k: "patient", label: "إرشادات", icon: BookOpen },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-stretch justify-center bg-black/40 backdrop-blur-sm" dir="rtl">
      <div className="relative app-shell h-dvh bg-background flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Hero */}
        <div className="relative gradient-primary text-white px-5 pt-5 pb-6 rounded-b-[2rem] shadow-elegant">
          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="absolute top-4 left-4 h-9 w-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center active:scale-95 transition-bounce"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            onClick={handlePrint}
            aria-label="تصدير كـ PDF"
            className="absolute top-4 left-16 h-9 w-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center active:scale-95 transition-bounce"
          >
            <Printer className="h-5 w-5" />
          </button>

          <div className="flex items-start gap-3 mt-2">
            <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <Pill className="h-7 w-7" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-extrabold leading-tight truncate">{mono.nameAr}</h2>
                <button
                  onClick={() => speak(`${mono.nameAr}. ${mono.scientificAr}`)}
                  aria-label="نطق الاسم"
                  className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center active:scale-95 shrink-0"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm opacity-90 mt-1 truncate">
                {mono.nameEn} · {mono.scientificEn}
              </p>
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-[11px] font-bold bg-white/20 px-2 py-0.5 rounded-full">{mono.categoryAr}</span>
                <span className="text-[11px] font-bold bg-white/20 px-2 py-0.5 rounded-full">
                  حمل: {mono.pregnancy.category}
                </span>
                <span className="text-[11px] font-bold bg-white/20 px-2 py-0.5 rounded-full">{mono.cost}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-3 mt-3">
          <div className="grid grid-cols-5 rounded-2xl bg-muted p-1">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.k;
              return (
                <button
                  key={t.k}
                  onClick={() => setTab(t.k)}
                  className={`py-2 rounded-xl text-[10px] font-bold transition-smooth flex flex-col items-center gap-0.5 ${
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
        <div className="flex-1 min-h-0 overflow-y-auto px-4 mt-3 pb-28 space-y-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tab === "overview" && (
            <>
              <Section title="دواعي الاستعمال" icon={Info}>
                <Bullets items={mono.indications} icon="check" />
              </Section>
              <Section title="المادة الفعّالة" icon={FlaskConical}>
                <p>
                  {mono.scientificAr} — <span dir="ltr">{mono.scientificEn}</span>
                </p>
              </Section>
              <Section title="الأشكال الصيدلانية" icon={Syringe}>
                <div className="flex flex-wrap gap-2">
                  {mono.forms.map((f, i) => (
                    <span key={i} className="text-xs font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                      {f}
                    </span>
                  ))}
                </div>
              </Section>
              <Section title="التكلفة التقريبية" icon={Tag} defaultOpen={false}>
                <p>{mono.cost}</p>
              </Section>
              <Section title="التخزين" icon={Thermometer} defaultOpen={false}>
                <p>{mono.storage}</p>
              </Section>
              <Section title="المصادر الطبية" icon={BookOpen} defaultOpen={false}>
                <Bullets items={mono.sources} />
              </Section>
            </>
          )}

          {tab === "dosage" && (
            <>
              <Section title="الجرعات حسب الفئة" icon={Clock}>
                <div className="space-y-2">
                  {mono.dosage.map((d, i) => (
                    <div key={i} className="rounded-xl p-3 bg-primary/5 border border-primary/20">
                      <p className="text-xs font-bold text-primary mb-1">{d.group}</p>
                      <p className="text-sm">{d.text}</p>
                    </div>
                  ))}
                </div>
              </Section>
              <Section title="الفئات العمرية" icon={Users}>
                <p>{mono.ageGroups}</p>
              </Section>
              <Section title="الجرعة الزائدة" icon={AlertTriangle} tone="danger">
                <p>{mono.overdose}</p>
              </Section>
              <div className="rounded-2xl p-3 bg-muted/50 border border-border text-[11px] text-muted-foreground leading-relaxed">
                * الجرعة قد تتغيّر حسب الوزن والحالة السريرية. استشر الطبيب أو الصيدلي.
              </div>
            </>
          )}

          {tab === "safety" && (
            <>
              <Section title="موانع الاستعمال" icon={Ban} tone="danger">
                <Bullets items={mono.contraindications} icon="ban" />
              </Section>
              <Section title="التحذيرات" icon={AlertTriangle} tone="warn">
                <Bullets items={mono.warnings} />
              </Section>
              <Section title="التفاعلات الدوائية" icon={ShieldAlert}>
                <div className="space-y-2">
                  {mono.interactions.map((it, i) => {
                    const danger = it.severity === "danger";
                    return (
                      <div
                        key={i}
                        className={`rounded-xl p-3 border ${
                          danger ? "bg-destructive/10 border-destructive/40" : "bg-warning/10 border-warning/40"
                        }`}
                      >
                        <div
                          className={`flex items-center gap-2 font-bold text-sm ${
                            danger ? "text-destructive" : "text-warning-foreground"
                          }`}
                        >
                          <AlertTriangle className="h-4 w-4" />
                          <span dir="ltr">{it.with}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-background/60">
                            {danger ? "خطير" : "احتياط"}
                          </span>
                        </div>
                        <p className="text-xs text-foreground/80 mt-1 leading-relaxed">{it.note}</p>
                      </div>
                    );
                  })}
                </div>
              </Section>
            </>
          )}

          {tab === "special" && (
            <div className="space-y-2">
              <Row label="الفشل الكبدي" value={mono.hepatic} icon={FlaskConical} />
              <Row label="الفشل الكلوي" value={mono.renal} icon={Droplets} />
              <Row label="كبار السن" value={mono.elderly} icon={Users} />
              <Row label="الأطفال" value={mono.pediatric} icon={Baby} />
              <Section title={`الحمل — فئة ${mono.pregnancy.category}`} icon={HeartPulse} tone={pregTone}>
                <p>{mono.pregnancy.note}</p>
              </Section>
              <Row label="الرضاعة" value={mono.lactation} icon={Baby} />
            </div>
          )}

          {tab === "patient" && (
            <>
              <Section title="إرشادات المريض" icon={BookOpen} tone="success">
                <Bullets items={mono.patientAdvice} icon="check" />
              </Section>
              <button
                onClick={() => speak(mono.patientAdvice.join(". "))}
                className="w-full h-11 rounded-2xl bg-card border border-border font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-bounce"
              >
                <Volume2 className="h-4 w-4 text-primary" /> استمع للإرشادات
              </button>
              <div className="rounded-2xl p-3 bg-muted/50 border border-border text-[11px] text-muted-foreground leading-relaxed">
                محتوى تعليمي مبني على مصادر موثوقة — لا يُغني عن استشارة الطبيب أو الصيدلي.
              </div>
            </>
          )}
        </div>

        {/* FAB */}
        <div className="absolute bottom-4 inset-x-4">
          <button
            onClick={() => {
              onAddReminder?.(mono.nameAr);
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
