import { memo, useState } from "react";
import {
  Stethoscope,
  Home as HomeIcon,
  GraduationCap,
  Plus,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Lightbulb,
  Siren,
  Pill,
  MapPin,
  ShieldAlert,
  X,
  Sparkles,
} from "lucide-react";
import { HOME_NURSING_CASES, type CaseColor, type HomeNursingCase } from "@/data/homeNursingCases";
import { NURSING_SPECIALTIES, NURSING_TIMELINE, type NursingSpecialty } from "@/data/nursingSpecialties";
import { useNursingPatients, type NursingPatient } from "@/hooks/useNursingPatients";
import { VitalsPanel } from "@/components/mobile/nursing/VitalsPanel";
import { NotesPanel } from "@/components/mobile/nursing/NotesPanel";
import { RemindersPanel } from "@/components/mobile/nursing/RemindersPanel";
import { SpecialtyDetailSheet } from "@/components/mobile/nursing/SpecialtyDetailSheet";
import { NurseAiPanel } from "@/components/mobile/nursing/NurseAiPanel";
import { NursingReferenceHub } from "@/components/mobile/nursing/NursingReferenceHub";
import { BookMarked } from "lucide-react";


type Mode = "home" | "general" | "reference";

// ============================================================
// Color tokens per case category (uses CSS hsl variables only)
// ============================================================
const colorMap: Record<CaseColor, { bg: string; text: string; ring: string; chip: string }> = {
  crimson: { bg: "bg-[hsl(0_70%_50%/0.12)]", text: "text-[hsl(0_72%_45%)]", ring: "ring-[hsl(0_70%_50%/0.4)]", chip: "bg-[hsl(0_70%_50%/0.18)] text-[hsl(0_72%_42%)]" },
  blue: { bg: "bg-[hsl(210_85%_50%/0.12)]", text: "text-[hsl(210_85%_45%)]", ring: "ring-[hsl(210_85%_50%/0.4)]", chip: "bg-[hsl(210_85%_50%/0.18)] text-[hsl(210_85%_42%)]" },
  green: { bg: "bg-[hsl(150_60%_40%/0.14)]", text: "text-[hsl(150_60%_35%)]", ring: "ring-[hsl(150_60%_40%/0.4)]", chip: "bg-[hsl(150_60%_40%/0.18)] text-[hsl(150_60%_32%)]" },
  amber: { bg: "bg-[hsl(40_90%_50%/0.15)]", text: "text-[hsl(40_90%_38%)]", ring: "ring-[hsl(40_90%_50%/0.4)]", chip: "bg-[hsl(40_90%_50%/0.2)] text-[hsl(40_90%_35%)]" },
  violet: { bg: "bg-[hsl(270_60%_55%/0.14)]", text: "text-[hsl(270_60%_50%)]", ring: "ring-[hsl(270_60%_55%/0.4)]", chip: "bg-[hsl(270_60%_55%/0.18)] text-[hsl(270_60%_45%)]" },
  orange: { bg: "bg-[hsl(20_85%_55%/0.14)]", text: "text-[hsl(20_85%_45%)]", ring: "ring-[hsl(20_85%_55%/0.4)]", chip: "bg-[hsl(20_85%_55%/0.18)] text-[hsl(20_85%_42%)]" },
};

// ============================================================
// Patient selector
// ============================================================
const PatientChips = ({
  patients,
  activeId,
  onSelect,
  onAdd,
}: {
  patients: NursingPatient[];
  activeId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
}) => (
  <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4" style={{ scrollbarWidth: "none" }}>
    {patients.map((p) => {
      const isActive = p.id === activeId;
      return (
        <button
          key={p.id}
          onClick={() => onSelect(p.id)}
          className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-2xl transition-bounce border ${
            isActive
              ? "bg-primary text-primary-foreground border-primary shadow-soft scale-[1.02]"
              : "bg-card text-foreground border-border"
          }`}
        >
          <span className="text-lg leading-none">{p.emoji}</span>
          <span className="text-sm font-bold leading-none">{p.name}</span>
        </button>
      );
    })}
    <button
      onClick={onAdd}
      className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border border-dashed border-border text-muted-foreground active:scale-95 transition-smooth"
    >
      <Plus className="h-4 w-4" />
      <span className="text-sm font-bold">جديد</span>
    </button>
  </div>
);

// ============================================================
// Add-patient inline dialog
// ============================================================
const AddPatientSheet = ({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (p: { name: string; emoji: string }) => void;
}) => {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🧑");
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md bg-card rounded-t-3xl p-5 space-y-4 animate-in slide-in-from-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold">إضافة مريض جديد</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground">الاسم</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: جدتي"
            className="w-full px-4 py-3 rounded-2xl bg-muted text-foreground border border-border focus:border-primary outline-none text-right"
            dir="rtl"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground">رمز تعبيري</label>
          <div className="flex gap-2 flex-wrap">
            {["👴", "👵", "👶", "🧑", "👨", "👩", "🧒", "👧", "👦"].map((e) => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                className={`h-11 w-11 rounded-2xl text-2xl flex items-center justify-center transition-bounce ${
                  emoji === e ? "bg-primary/15 ring-2 ring-primary" : "bg-muted"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => {
            if (!name.trim()) return;
            onSave({ name: name.trim(), emoji });
            setName("");
            setEmoji("🧑");
            onClose();
          }}
          className="w-full py-3 rounded-2xl gradient-primary text-white font-extrabold shadow-glow"
        >
          حفظ
        </button>
      </div>
    </div>
  );
};

// ============================================================
// Case card (expandable)
// ============================================================
const CaseCard = ({ c, patientName }: { c: HomeNursingCase; patientName: string }) => {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const col = colorMap[c.color];

  return (
    <article className={`rounded-3xl bg-card border border-border shadow-soft overflow-hidden`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full p-4 flex items-center gap-3 text-right"
      >
        <div className={`h-12 w-12 rounded-2xl ${col.bg} flex items-center justify-center text-2xl flex-shrink-0`}>
          {c.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-extrabold text-foreground leading-tight">{c.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{c.subtitle}</p>
        </div>
        <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
          <p className="text-xs font-bold text-muted-foreground">للمريض: <span className="text-foreground">{patientName}</span></p>

          {/* Steps */}
          <section>
            <h4 className={`text-sm font-extrabold mb-2 flex items-center gap-1.5 ${col.text}`}>
              <CheckCircle2 className="h-4 w-4" /> خطوات العناية
            </h4>
            <ul className="space-y-2">
              {c.steps.map((step, i) => {
                const isChecked = !!checked[i];
                return (
                  <li key={i}>
                    <button
                      onClick={() => setChecked((p) => ({ ...p, [i]: !p[i] }))}
                      className="w-full flex items-start gap-2 text-right p-2 rounded-xl active:bg-muted transition-smooth"
                    >
                      <span
                        className={`mt-0.5 h-5 w-5 flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-bounce ${
                          isChecked ? "bg-primary border-primary" : "border-muted-foreground/40"
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="h-3.5 w-3.5 text-primary-foreground" />}
                      </span>
                      <span className={`text-sm leading-relaxed ${isChecked ? "line-through text-muted-foreground" : "text-foreground"}`}>
                        {step}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Red flags */}
          <section className="rounded-2xl bg-[hsl(0_70%_50%/0.08)] border border-[hsl(0_70%_50%/0.3)] p-3">
            <h4 className="text-sm font-extrabold mb-2 flex items-center gap-1.5 text-[hsl(0_72%_45%)]">
              <AlertTriangle className="h-4 w-4" /> علامات الخطر — اتصل بالإسعاف فوراً
            </h4>
            <ul className="space-y-1.5">
              {c.redFlags.map((r, i) => (
                <li key={i} className="text-sm text-foreground flex items-start gap-2">
                  <span className="text-[hsl(0_72%_45%)] mt-1">●</span>
                  <span className="leading-relaxed">{r}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Tips */}
          <section>
            <h4 className="text-sm font-extrabold mb-2 flex items-center gap-1.5 text-secondary">
              <Lightbulb className="h-4 w-4" /> نصائح مفيدة
            </h4>
            <ul className="space-y-1.5">
              {c.tips.map((t, i) => (
                <li key={i} className="text-sm text-foreground/90 flex items-start gap-2 leading-relaxed">
                  <span className={col.text}>✓</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </article>
  );
};

// ============================================================
// Home Nursing tab
// ============================================================
const HomeNursingView = () => {
  const { patients, active, activeId, setActiveId, addPatient } = useNursingPatients();
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="space-y-5 pb-8">
      {/* Patient selector */}
      <section>
        <h2 className="text-xs font-extrabold text-muted-foreground mb-2 flex items-center gap-1.5">
          <span>👤</span> اختيار المريض
        </h2>
        <PatientChips
          patients={patients}
          activeId={activeId}
          onSelect={setActiveId}
          onAdd={() => setAddOpen(true)}
        />
      </section>

      {/* Cases list */}
      <section>
        <h2 className="text-base font-extrabold text-foreground mb-3 flex items-center gap-2">
          <span className="text-xl">📋</span> حالات التمريض المنزلي الشائعة
        </h2>
        <div className="space-y-3">
          {HOME_NURSING_CASES.map((c) => (
            <CaseCard key={c.id} c={c} patientName={active?.name ?? ""} />
          ))}
        </div>
      </section>

      {/* Phase 2: vitals, reminders, notes — all local */}
      <VitalsPanel patientId={activeId} />
      <RemindersPanel patientId={activeId} />
      <NotesPanel patientId={activeId} />

      {/* Smart links */}
      <section>
        <h2 className="text-base font-extrabold text-foreground mb-3 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" /> الربط الذكي
        </h2>
        <div className="grid grid-cols-1 gap-2.5">
          <a href="tel:911" className="flex items-center gap-3 p-3.5 rounded-2xl bg-[hsl(0_70%_50%/0.1)] border border-[hsl(0_70%_50%/0.3)] active:scale-[0.98] transition-bounce">
            <span className="h-11 w-11 rounded-2xl bg-[hsl(0_72%_45%)] text-white flex items-center justify-center">
              <Siren className="h-5 w-5" />
            </span>
            <span className="flex-1 text-right">
              <span className="block text-sm font-extrabold text-foreground">هل تحتاج مساعدة فورية؟</span>
              <span className="block text-xs text-muted-foreground">الاتصال بالإسعاف</span>
            </span>
          </a>
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-secondary/10 border border-secondary/30">
            <span className="h-11 w-11 rounded-2xl bg-secondary text-secondary-foreground flex items-center justify-center">
              <Pill className="h-5 w-5" />
            </span>
            <span className="flex-1 text-right">
              <span className="block text-sm font-extrabold text-foreground">اطلب الأدوية والمستلزمات</span>
              <span className="block text-xs text-muted-foreground">من مكتبة الأدوية</span>
            </span>
          </div>
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-primary/10 border border-primary/30">
            <span className="h-11 w-11 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center">
              <MapPin className="h-5 w-5" />
            </span>
            <span className="flex-1 text-right">
              <span className="block text-sm font-extrabold text-foreground">أقرب مركز رعاية تمريضية</span>
              <span className="block text-xs text-muted-foreground">من الخريطة</span>
            </span>
          </div>
        </div>
      </section>

      {/* Legal disclaimer */}
      <section className="rounded-2xl bg-muted/50 border border-border p-3.5">
        <div className="flex items-start gap-2.5">
          <ShieldAlert className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="text-[11px] text-muted-foreground leading-relaxed">
            <p className="font-bold text-foreground mb-1">تنبيه طبي</p>
            <p>هذا القسم للتثقيف والتوعية فقط ولا يغني عن استشارة الممرض/الطبيب المتخصص. في حالات الطوارئ اتصل بالإسعاف فوراً.</p>
          </div>
        </div>
      </section>

      <AddPatientSheet
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={(p) => addPatient(p)}
      />
    </div>
  );
};

// ============================================================
// General Nursing tab (teaser for Phase 2)
// ============================================================
const GeneralNursingView = () => {
  const [selected, setSelected] = useState<NursingSpecialty | null>(null);
  return (
    <div className="space-y-5 pb-8">
      {/* Timeline */}
      <section>
        <h2 className="text-base font-extrabold text-foreground mb-3 flex items-center gap-2">
          <span className="text-xl">📚</span> تاريخ التمريض حتى ٢٠٢٦
        </h2>
        <div className="relative pr-4 border-r-2 border-primary/30 space-y-3">
          {NURSING_TIMELINE.map((t, i) => (
            <div key={i} className="relative">
              <span className="absolute -right-[22px] top-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-primary/20" />
              <div className="rounded-2xl bg-card border border-border p-3">
                <p className="text-xs font-extrabold text-primary mb-0.5">{t.year}</p>
                <p className="text-sm text-foreground leading-relaxed">{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Coming-soon banner */}
      <section className="rounded-3xl gradient-primary text-white p-5 shadow-elegant">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">🎓</div>
          <div className="flex-1">
            <h3 className="text-base font-extrabold mb-1">منهج كامل قريباً</h3>
            <p className="text-sm text-white/90 leading-relaxed">
              ٥٠ تخصصاً تمريضياً مع محتوى أكاديمي معتمد + اختبارات + شهادات إتمام (المرحلة ٢).
            </p>
          </div>
        </div>
      </section>

      {/* Specialties grid (read-only preview) */}
      <section>
        <h2 className="text-base font-extrabold text-foreground mb-3 flex items-center gap-2">
          <span className="text-xl">🏥</span> التخصصات التمريضية ({NURSING_SPECIALTIES.length})
        </h2>
        <div className="grid grid-cols-2 gap-2.5">
          {NURSING_SPECIALTIES.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelected(s)}
              className="text-right rounded-2xl bg-card border border-border p-3 flex flex-col gap-1.5 active:scale-[0.97] transition-bounce hover:border-primary/40"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl leading-none">{s.emoji}</span>
                <span className="text-[10px] font-bold text-muted-foreground">#{s.id}</span>
              </div>
              <h3 className="text-[13px] font-extrabold text-foreground leading-tight">{s.name_ar}</h3>
              <p className="text-[10px] text-muted-foreground leading-tight">{s.name_en}</p>
              <span className={`mt-1 inline-block w-fit text-[9px] font-bold px-2 py-0.5 rounded-full ${
                s.era === "classic" ? "bg-amber-500/15 text-amber-700" : "bg-secondary/15 text-secondary"
              }`}>
                {s.era === "classic" ? "كلاسيكي" : "حديث"}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-muted/50 border border-border p-3.5">
        <p className="text-[11px] text-muted-foreground leading-relaxed text-center">
          المصادر العلمية: WHO · AHA · AACN · ANA · ICN · Johns Hopkins
        </p>
      </section>

      <SpecialtyDetailSheet specialty={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

// ============================================================
// Main screen
// ============================================================
export const NursingScreen = memo(() => {
  const [mode, setMode] = useState<Mode>("home");
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <div className="min-h-full">
      {/* Header — dark blue medical band */}
      <header
        className="px-4 pt-4 pb-3 text-white"
        style={{
          background: "linear-gradient(135deg, hsl(215 60% 22%), hsl(210 75% 32%))",
        }}
      >
        <div className="flex items-center gap-2.5 mb-3">
          <div className="h-10 w-10 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-extrabold leading-tight">قسم التمريض</h1>
            <p className="text-[11px] text-white/80">رعاية منزلية وأكاديمية</p>
          </div>
          <button
            onClick={() => setAiOpen(true)}
            className="h-10 px-3 rounded-2xl bg-white/15 backdrop-blur flex items-center gap-1.5 text-xs font-extrabold active:scale-95 transition-bounce"
            aria-label="فتح المساعد الذكي"
          >
            <Sparkles className="h-4 w-4" />
            ممرض AI
          </button>
        </div>

        {/* Mode toggle */}
        <div className="flex bg-white/10 backdrop-blur rounded-2xl p-1">
          <button
            onClick={() => setMode("home")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-extrabold transition-bounce ${
              mode === "home" ? "bg-white text-[hsl(215_60%_22%)] shadow-soft" : "text-white/85"
            }`}
          >
            <HomeIcon className="h-4 w-4" /> منزلي
          </button>
          <button
            onClick={() => setMode("general")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-extrabold transition-bounce ${
              mode === "general" ? "bg-white text-[hsl(215_60%_22%)] shadow-soft" : "text-white/85"
            }`}
          >
            <GraduationCap className="h-4 w-4" /> عام
          </button>
        </div>
      </header>

      <div className="px-4 pt-4">
        {mode === "home" ? <HomeNursingView /> : <GeneralNursingView />}
      </div>

      {aiOpen && <NurseAiPanel onClose={() => setAiOpen(false)} />}
    </div>
  );
});

NursingScreen.displayName = "NursingScreen";
