import { X, Volume2, Sparkles, Pill, Sun, Moon, Sunset, Utensils, AlertTriangle, CheckCircle2, FlaskConical, Tag, Stethoscope, User, Calendar, ClipboardList, Syringe, Droplet, ShieldCheck, Radar, FileDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSpeak } from "@/hooks/useSpeak";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";
import { PulseAlert } from "../PulseAlert";
import { DigitalPrescription } from "./DigitalPrescription";

type ScanMode = "prescription" | "barcode";

interface Props {
  imageUrl: string;
  mode: ScanMode;
  onClose: () => void;
}

type DrugForm = "tablet" | "syrup" | "injection";
type Timing = "morning" | "noon" | "evening" | "night";

interface MedItem {
  name: string;
  form: DrugForm;
  dosageText: string;
  timings: Timing[];
  pillsPerDose: number;
  warning?: string;
  withFood?: boolean;
}

const TODAY = new Date().toLocaleDateString("ar-EG", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

// Mocked extracted data — In production these would come from OCR + NLP
const PRESCRIPTION_DATA = {
  patientName: "محمد أحمد عثمان",
  age: "34 سنة",
  diagnosis: "التهاب حاد في الجهاز التنفسي العلوي",
  examType: "فحص عام (باطنية)",
  clinic: "د. سلمى الفاتح — عيادة النيل",
  meds: [
    {
      name: "أوجمنتين 1g",
      form: "tablet" as DrugForm,
      dosageText: "قرص واحد كل ١٢ ساعة",
      timings: ["morning", "evening"] as Timing[],
      pillsPerDose: 1,
      warning: "يُؤخذ بعد الأكل مباشرة",
      withFood: true,
    },
    {
      name: "بروفين 400mg",
      form: "tablet" as DrugForm,
      dosageText: "قرص عند الحاجة كل ٨ ساعات",
      timings: ["morning", "noon", "night"] as Timing[],
      pillsPerDose: 1,
      warning: "تجنّب على معدة فارغة",
      withFood: true,
    },
    {
      name: "شراب فنتولين",
      form: "syrup" as DrugForm,
      dosageText: "ملعقة صغيرة (٥ مل) ٣ مرات يومياً",
      timings: ["morning", "noon", "evening"] as Timing[],
      pillsPerDose: 1,
    },
  ] as MedItem[],
};

const BARCODE_DATA = {
  brand: "Panadol Extra",
  scientific: "باراسيتامول 500mg + كافيين 65mg",
  manufacturer: "GlaxoSmithKline",
  price: "850 جنيه سوداني",
  category: "مسكن للألم وخافض حرارة",
  activeIngredient: "الباراسيتامول مادة مسكنة وخافضة للحرارة، تعمل على تثبيط إنزيم سيكلوأوكسيجيناز في الدماغ.",
  verified: true,
};

const FormIcon = ({ form }: { form: DrugForm }) => {
  if (form === "syrup") return <Droplet className="h-5 w-5" />;
  if (form === "injection") return <Syringe className="h-5 w-5" />;
  return <Pill className="h-5 w-5" />;
};

const TimingIcon = ({ t, active }: { t: Timing; active: boolean }) => {
  const cls = `h-4 w-4 ${active ? "text-warning" : "text-white/30"}`;
  if (t === "morning") return <Sun className={cls} />;
  if (t === "noon") return <Sun className={cls} />;
  if (t === "evening") return <Sunset className={cls} />;
  return <Moon className={cls} />;
};

const TIMING_LABELS: Record<Timing, string> = {
  morning: "صباحاً",
  noon: "ظهراً",
  evening: "مساءً",
  night: "ليلاً",
};

export const ScanResultsOverlay = ({ imageUrl, mode, onClose }: Props) => {
  const speak = useSpeak();
  const { profile } = useProfile();
  const [mounted, setMounted] = useState(false);
  const [allergyAlert, setAllergyAlert] = useState<string | null>(null);
  const [showDigital, setShowDigital] = useState(false);

  // Cross-reference detected meds against user's allergies
  const detectedAllergyMatches = useMemo(() => {
    if (mode !== "prescription") {
      // Barcode mode: check single brand
      const allergies = profile?.allergies ?? [];
      const hay = `${BARCODE_DATA.brand} ${BARCODE_DATA.scientific}`.toLowerCase();
      return allergies.filter((a) => a.trim() && hay.includes(a.trim().toLowerCase()));
    }
    const allergies = profile?.allergies ?? [];
    const hits: string[] = [];
    for (const med of PRESCRIPTION_DATA.meds) {
      const hay = med.name.toLowerCase();
      for (const a of allergies) {
        if (a.trim() && hay.includes(a.trim().toLowerCase())) {
          hits.push(`${med.name} يحتوي على «${a}» المسجّلة في حساسيتك!`);
        }
      }
    }
    return hits;
  }, [mode, profile]);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (detectedAllergyMatches.length > 0) {
      // Trigger pulsing red alert after a short delay so it appears after the card
      const t = setTimeout(() => setAllergyAlert(detectedAllergyMatches.join(" — ")), 600);
      return () => clearTimeout(t);
    }
  }, [detectedAllergyMatches]);

  const handleClose = () => {
    setMounted(false);
    setTimeout(onClose, 250);
  };

  return (
    <div
      className={`absolute inset-0 z-40 transition-opacity duration-300 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
      dir="rtl"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

      {/* Captured image as background hint */}
      <img
        src={imageUrl}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover opacity-20 blur-md"
      />

      {/* Sliding glass card */}
      <div
        className={`absolute inset-x-0 bottom-0 max-h-[92%] overflow-y-auto rounded-t-[28px] border-t border-white/20 bg-white/10 backdrop-blur-2xl shadow-elegant transition-transform duration-500 ease-out ${
          mounted ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ scrollbarWidth: "none" }}
      >
        {/* Drag handle */}
        <div className="sticky top-0 z-10 pt-2 pb-1 bg-gradient-to-b from-black/40 to-transparent flex justify-center">
          <span className="h-1.5 w-12 rounded-full bg-white/40" />
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label="إغلاق"
          className="absolute top-3 left-3 z-20 h-9 w-9 rounded-full bg-white/15 backdrop-blur flex items-center justify-center text-white active:scale-95 transition-bounce"
        >
          <X className="h-4 w-4" />
        </button>

        {/* AI badge */}
        <div className="px-4 pt-1 pb-3 flex justify-center">
          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-primary to-secondary text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-card">
            <Sparkles className="h-3 w-3" /> تحليل ذكي بواسطة AI
          </span>
        </div>

        <div className="px-4 pb-6 text-white space-y-4">
          {detectedAllergyMatches.length > 0 && (
            <div className="rounded-2xl border-2 border-destructive bg-destructive/15 backdrop-blur p-3 animate-fade-up">
              <div className="flex items-center gap-2 text-destructive font-extrabold text-sm mb-1">
                <AlertTriangle className="h-5 w-5" />
                ⚠️ تنبيه حساسية مسجّلة!
              </div>
              {detectedAllergyMatches.map((m, i) => (
                <p key={i} className="text-xs text-white/90 font-bold leading-relaxed mt-1">{m}</p>
              ))}
            </div>
          )}

          {mode === "prescription" ? (
            <PrescriptionView speak={speak} onExport={() => setShowDigital(true)} />
          ) : (
            <BarcodeView speak={speak} />
          )}
        </div>
      </div>

      <PulseAlert
        open={!!allergyAlert}
        title="تنبيه حساسية!"
        body={allergyAlert ?? ""}
        variant="danger"
        onClose={() => setAllergyAlert(null)}
      />
    </div>
  );
};

const PrescriptionView = ({ speak }: { speak: (t: string) => void }) => {
  const d = PRESCRIPTION_DATA;
  return (
    <>
      {/* Patient header card */}
      <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur p-4 animate-fade-up">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-white/60 mb-1 inline-flex items-center gap-1">
              <User className="h-3 w-3" /> اسم المريض
            </p>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold truncate">{d.patientName}</h3>
              <button
                onClick={() => speak(`اسم المريض ${d.patientName}، العمر ${d.age}`)}
                aria-label="استماع لاسم المريض"
                className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center shadow-card active:scale-95 transition-bounce flex-shrink-0"
              >
                <Volume2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-secondary/90 text-white px-2 py-1 rounded-full whitespace-nowrap">
            {d.age}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <InfoChip icon={<Stethoscope className="h-3.5 w-3.5" />} label="التشخيص" value={d.diagnosis} accent="primary" />
          <InfoChip icon={<ClipboardList className="h-3.5 w-3.5" />} label="نوع الفحص" value={d.examType} />
          <InfoChip icon={<Calendar className="h-3.5 w-3.5" />} label="التاريخ" value={TODAY} />
          <InfoChip icon={<User className="h-3.5 w-3.5" />} label="العيادة" value={d.clinic} />
        </div>
      </div>

      {/* Meds */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold inline-flex items-center gap-2">
            <Pill className="h-4 w-4 text-secondary-glow" />
            الأدوية الموصوفة ({d.meds.length})
          </h4>
          <span className="text-[10px] text-white/60">اضغط 🔊 لسماع الجرعة</span>
        </div>

        {d.meds.map((med, i) => (
          <MedCapsule key={i} med={med} speak={speak} />
        ))}
      </div>

      {/* Footer CTA */}
      <button
        onClick={() => toast.success("جاري البحث عن الصيدليات القريبة...")}
        className="w-full h-12 rounded-2xl gradient-primary text-white font-bold shadow-elegant active:scale-[.98] transition-bounce inline-flex items-center justify-center gap-2"
      >
        <Radar className="h-4 w-4" /> ابحث عن صيدلية قريبة
      </button>
    </>
  );
};

const MedCapsule = ({ med, speak }: { med: MedItem; speak: (t: string) => void }) => {
  return (
    <div className="rounded-2xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur p-3 animate-fade-up">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-card flex-shrink-0">
          <FormIcon form={med.form} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-extrabold text-sm truncate">{med.name}</p>
          <p className="text-[11px] text-white/70 truncate">{med.dosageText}</p>
        </div>
        <button
          onClick={() => speak(`${med.name}. ${med.dosageText}. ${med.warning ?? ""}`)}
          aria-label={`استماع لجرعة ${med.name}`}
          className="h-9 w-9 rounded-full bg-white/15 flex items-center justify-center active:scale-95 transition-bounce flex-shrink-0"
        >
          <Volume2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Visual dosage */}
      <div className="flex items-center justify-between gap-2 mb-2">
        {/* Pills count */}
        <div className="flex items-center gap-1 bg-black/20 rounded-full px-2 py-1">
          {Array.from({ length: med.pillsPerDose }).map((_, i) => (
            <Pill key={i} className="h-3.5 w-3.5 text-secondary-glow" />
          ))}
          <span className="text-[10px] font-bold text-white/80 mr-1">× جرعة</span>
        </div>

        {/* Timings */}
        <div className="flex items-center gap-1.5">
          {(["morning", "noon", "evening", "night"] as Timing[]).map((t) => {
            const active = med.timings.includes(t);
            return (
              <div
                key={t}
                className={`flex flex-col items-center gap-0.5 px-1.5 py-1 rounded-lg transition-colors ${
                  active ? "bg-warning/20 border border-warning/40" : "bg-white/5 border border-white/10"
                }`}
                title={TIMING_LABELS[t]}
              >
                <TimingIcon t={t} active={active} />
                <span className={`text-[8px] font-bold ${active ? "text-warning" : "text-white/40"}`}>
                  {TIMING_LABELS[t]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Smart alert */}
      {med.warning && (
        <div
          className={`mt-2 rounded-xl px-3 py-2 text-[11px] font-bold inline-flex items-center gap-1.5 ${
            med.withFood
              ? "bg-warning/20 text-warning border border-warning/30"
              : "bg-destructive/20 text-destructive-foreground border border-destructive/30"
          }`}
        >
          {med.withFood ? <Utensils className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
          {med.warning}
        </div>
      )}
    </div>
  );
};

const BarcodeView = ({ speak }: { speak: (t: string) => void }) => {
  const d = BARCODE_DATA;
  return (
    <>
      <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur p-4 animate-fade-up">
        <div className="flex items-center gap-4">
          {/* Visual mock */}
          <div className="h-24 w-20 rounded-2xl bg-gradient-to-br from-primary/40 to-secondary/40 border border-white/20 flex items-center justify-center text-white shadow-card flex-shrink-0">
            <Pill className="h-10 w-10" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-extrabold truncate">{d.brand}</h3>
              <button
                onClick={() => speak(`${d.brand}. ${d.scientific}`)}
                aria-label="استماع لاسم الدواء"
                className="h-7 w-7 rounded-full gradient-primary flex items-center justify-center shadow-card active:scale-95 transition-bounce flex-shrink-0"
              >
                <Volume2 className="h-3 w-3" />
              </button>
            </div>
            <p className="text-[11px] text-white/70 mb-2">{d.scientific}</p>
            {d.verified && (
              <span className="inline-flex items-center gap-1 bg-secondary/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                <ShieldCheck className="h-3 w-3" /> دواء موثّق
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <InfoChip icon={<Tag className="h-3.5 w-3.5" />} label="السعر التقريبي" value={d.price} accent="primary" />
        <InfoChip icon={<ClipboardList className="h-3.5 w-3.5" />} label="التصنيف" value={d.category} />
        <InfoChip icon={<CheckCircle2 className="h-3.5 w-3.5" />} label="الشركة المصنّعة" value={d.manufacturer} />
        <InfoChip icon={<FlaskConical className="h-3.5 w-3.5" />} label="الحالة" value="متوفّر بالصيدليات" accent="secondary" />
      </div>

      <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur p-4 animate-fade-up">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-bold inline-flex items-center gap-1.5">
            <FlaskConical className="h-4 w-4 text-secondary-glow" /> المادة الفعّالة
          </p>
          <button
            onClick={() => speak(d.activeIngredient)}
            aria-label="استماع للشرح"
            className="h-8 w-8 rounded-full bg-white/15 flex items-center justify-center active:scale-95 transition-bounce"
          >
            <Volume2 className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="text-[12px] text-white/80 leading-relaxed">{d.activeIngredient}</p>
      </div>

      <button
        onClick={() => toast.success("جاري البحث عن الصيدليات القريبة...")}
        className="w-full h-12 rounded-2xl gradient-primary text-white font-bold shadow-elegant active:scale-[.98] transition-bounce inline-flex items-center justify-center gap-2"
      >
        <Radar className="h-4 w-4" /> ابحث عن أقرب صيدلية
      </button>
    </>
  );
};

const InfoChip = ({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: "primary" | "secondary";
}) => {
  const accentCls =
    accent === "primary"
      ? "border-primary/40 bg-primary/15"
      : accent === "secondary"
      ? "border-secondary/40 bg-secondary/15"
      : "border-white/15 bg-white/5";
  return (
    <div className={`rounded-xl border ${accentCls} backdrop-blur p-2.5`}>
      <p className="text-[10px] text-white/60 mb-0.5 inline-flex items-center gap-1">
        {icon} {label}
      </p>
      <p className="text-[12px] font-bold leading-tight line-clamp-2">{value}</p>
    </div>
  );
};
