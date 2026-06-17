import { memo, useEffect, useState } from "react";
import { Activity, Plus, Trash2, X } from "lucide-react";
import {
  deleteVital,
  getVitals,
  saveVital,
  type VitalReading,
} from "@/lib/localHealthStore";

type VType = VitalReading["type"];

const TYPES: { id: VType; label: string; unit: string; emoji: string }[] = [
  { id: "bp", label: "ضغط الدم", unit: "mmHg", emoji: "💓" },
  { id: "glucose", label: "سكر الدم", unit: "mg/dL", emoji: "🍬" },
  { id: "temp", label: "الحرارة", unit: "°C", emoji: "🌡️" },
  { id: "spo2", label: "الأكسجين", unit: "%", emoji: "🫁" },
  { id: "pulse", label: "النبض", unit: "bpm", emoji: "❤️" },
  { id: "weight", label: "الوزن", unit: "kg", emoji: "⚖️" },
];

// Minimal sparkline chart (SVG, no deps)
const Sparkline = ({ values, color }: { values: number[]; color: string }) => {
  if (values.length < 2) return null;
  const w = 220;
  const h = 48;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = w / (values.length - 1);
  const points = values
    .map((v, i) => `${i * step},${h - ((v - min) / range) * (h - 6) - 3}`)
    .join(" ");
  return (
    <svg width={w} height={h} className="w-full h-12">
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
};

const AddSheet = ({
  open,
  onClose,
  patientId,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  patientId?: string;
  onSaved: () => void;
}) => {
  const [type, setType] = useState<VType>("bp");
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [value, setValue] = useState("");
  const meta = TYPES.find((t) => t.id === type)!;

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end" onClick={onClose}>
      <div className="w-full max-w-md mx-auto bg-card rounded-t-3xl p-5 space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold">قياس جديد</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => setType(t.id)}
              className={`flex-shrink-0 px-3 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 ${
                type === t.id ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
              }`}
            >
              <span>{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>
        {type === "bp" ? (
          <div className="flex gap-2">
            <input
              inputMode="numeric"
              value={systolic}
              onChange={(e) => setSystolic(e.target.value)}
              placeholder="انقباضي"
              className="flex-1 px-4 py-3 rounded-2xl bg-muted border border-border outline-none text-center font-bold"
            />
            <input
              inputMode="numeric"
              value={diastolic}
              onChange={(e) => setDiastolic(e.target.value)}
              placeholder="انبساطي"
              className="flex-1 px-4 py-3 rounded-2xl bg-muted border border-border outline-none text-center font-bold"
            />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <input
              inputMode="decimal"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`القيمة (${meta.unit})`}
              className="flex-1 px-4 py-3 rounded-2xl bg-muted border border-border outline-none text-center font-bold"
            />
            <span className="text-sm font-bold text-muted-foreground">{meta.unit}</span>
          </div>
        )}
        <button
          onClick={() => {
            if (type === "bp") {
              const s = Number(systolic);
              const d = Number(diastolic);
              if (!s || !d) return;
              saveVital({ type, systolic: s, diastolic: d, unit: "mmHg", patient_id: patientId });
            } else {
              const v = Number(value);
              if (!v) return;
              saveVital({ type, value: v, unit: meta.unit, patient_id: patientId });
            }
            setSystolic(""); setDiastolic(""); setValue("");
            onSaved();
            onClose();
          }}
          className="w-full py-3 rounded-2xl gradient-primary text-white font-extrabold shadow-glow"
        >
          حفظ القياس
        </button>
        <p className="text-[10px] text-center text-muted-foreground">
          🔒 يحفظ محلياً على جهازك فقط
        </p>
      </div>
    </div>
  );
};

export const VitalsPanel = memo(({ patientId }: { patientId?: string }) => {
  const [vitals, setVitals] = useState<VitalReading[]>([]);
  const [addOpen, setAddOpen] = useState(false);

  const refresh = () => setVitals(getVitals().filter((v) => !patientId || v.patient_id === patientId));

  useEffect(() => {
    refresh();
    const h = () => refresh();
    window.addEventListener("local-health-changed", h);
    return () => window.removeEventListener("local-health-changed", h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  const recentByType = (t: VType) => vitals.filter((v) => v.type === t).slice(0, 8).reverse();
  const fmt = (v: VitalReading) =>
    v.type === "bp" ? `${v.systolic}/${v.diastolic}` : `${v.value}`;

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" /> العلامات الحيوية
        </h2>
        <button
          onClick={() => setAddOpen(true)}
          className="h-9 px-3 rounded-2xl bg-primary text-primary-foreground text-xs font-extrabold flex items-center gap-1.5 shadow-soft"
        >
          <Plus className="h-4 w-4" /> قياس
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {TYPES.map((t) => {
          const readings = recentByType(t.id);
          const last = readings[readings.length - 1];
          const series =
            t.id === "bp" ? readings.map((r) => r.systolic ?? 0) : readings.map((r) => r.value ?? 0);
          return (
            <article key={t.id} className="rounded-2xl bg-card border border-border p-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-xl">
                  {t.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-muted-foreground">{t.label}</p>
                  <p className="text-base font-extrabold text-foreground">
                    {last ? `${fmt(last)} ${t.unit}` : "—"}
                  </p>
                </div>
                {last && (
                  <button
                    onClick={() => deleteVital(last.id)}
                    className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground active:scale-90"
                    aria-label="حذف آخر قياس"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              {readings.length >= 2 && <Sparkline values={series} color="hsl(var(--primary))" />}
            </article>
          );
        })}
      </div>

      <AddSheet open={addOpen} onClose={() => setAddOpen(false)} patientId={patientId} onSaved={refresh} />
    </section>
  );
});
VitalsPanel.displayName = "VitalsPanel";
