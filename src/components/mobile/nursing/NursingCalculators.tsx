import { useState, useMemo } from "react";
import { Calculator, ChevronDown } from "lucide-react";

// ============================================================
// 8 Nursing Calculators — inline, no dependencies
// ============================================================

type CalcId = "bmi" | "bsa" | "peds-dose" | "drip" | "gcs" | "braden" | "parkland" | "apgar";

interface CalcMeta {
  id: CalcId;
  title: string;
  emoji: string;
  desc: string;
}

const CALCS: CalcMeta[] = [
  { id: "bmi", title: "مؤشر كتلة الجسم (BMI)", emoji: "⚖️", desc: "وزن / (طول×طول) لتقييم الوزن" },
  { id: "bsa", title: "مساحة سطح الجسم (BSA)", emoji: "📐", desc: "معادلة Mosteller لجرعات الأدوية" },
  { id: "peds-dose", title: "جرعة طفل حسب الوزن", emoji: "🧒", desc: "mg/kg × الوزن للجرعات الآمنة" },
  { id: "drip", title: "معدل التنقيط الوريدي", emoji: "💧", desc: "gtt/min من الحجم والزمن" },
  { id: "gcs", title: "مقياس جلاسكو (GCS)", emoji: "🧠", desc: "تقييم مستوى الوعي 3-15" },
  { id: "braden", title: "مقياس Braden لقرح الفراش", emoji: "🛏️", desc: "خطر تقرحات الضغط 6-23" },
  { id: "parkland", title: "معادلة Parkland للحروق", emoji: "🔥", desc: "حساب سوائل الإنعاش" },
  { id: "apgar", title: "درجة أبغار للمولود", emoji: "👶", desc: "تقييم حديث الولادة 0-10" },
];

// ---------- Small UI helpers ----------
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1">
    <label className="text-xs font-bold text-muted-foreground">{label}</label>
    {children}
  </div>
);

const NumInput = ({ value, onChange, placeholder, step }: { value: string; onChange: (v: string) => void; placeholder?: string; step?: string }) => (
  <input
    inputMode="decimal"
    type="number"
    step={step ?? "any"}
    value={value}
    placeholder={placeholder}
    onChange={(e) => onChange(e.target.value)}
    className="w-full px-3 py-2.5 rounded-xl bg-muted text-foreground border border-border focus:border-primary outline-none text-right"
    dir="ltr"
  />
);

const Select = ({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { v: string; l: string }[] }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full px-3 py-2.5 rounded-xl bg-muted text-foreground border border-border focus:border-primary outline-none text-right"
    dir="rtl"
  >
    {options.map((o) => (
      <option key={o.v} value={o.v}>{o.l}</option>
    ))}
  </select>
);

const Result = ({ value, hint, tone = "primary" }: { value: string; hint?: string; tone?: "primary" | "warn" | "danger" | "ok" }) => {
  const cls =
    tone === "danger" ? "bg-[hsl(0_70%_50%/0.12)] text-[hsl(0_72%_42%)] border-[hsl(0_70%_50%/0.35)]" :
    tone === "warn" ? "bg-[hsl(40_90%_50%/0.14)] text-[hsl(40_90%_35%)] border-[hsl(40_90%_50%/0.35)]" :
    tone === "ok" ? "bg-[hsl(150_60%_40%/0.14)] text-[hsl(150_60%_32%)] border-[hsl(150_60%_40%/0.35)]" :
    "bg-primary/10 text-primary border-primary/30";
  return (
    <div className={`mt-2 rounded-2xl border p-3 ${cls}`}>
      <p className="text-lg font-extrabold" dir="ltr">{value}</p>
      {hint && <p className="text-xs mt-0.5 opacity-80">{hint}</p>}
    </div>
  );
};

// ---------- BMI ----------
const BmiCalc = () => {
  const [w, setW] = useState("");
  const [h, setH] = useState("");
  const bmi = useMemo(() => {
    const wn = parseFloat(w), hn = parseFloat(h) / 100;
    if (!wn || !hn) return null;
    return wn / (hn * hn);
  }, [w, h]);
  const cat = bmi == null ? "" : bmi < 18.5 ? "نقص وزن" : bmi < 25 ? "وزن طبيعي" : bmi < 30 ? "زيادة وزن" : "سمنة";
  const tone = bmi == null ? "primary" : bmi < 18.5 || bmi >= 30 ? "warn" : "ok";
  return (
    <div className="space-y-3">
      <Field label="الوزن (كجم)"><NumInput value={w} onChange={setW} placeholder="70" /></Field>
      <Field label="الطول (سم)"><NumInput value={h} onChange={setH} placeholder="170" /></Field>
      {bmi != null && <Result value={`${bmi.toFixed(1)} kg/m²`} hint={cat} tone={tone as "primary" | "warn" | "ok"} />}
    </div>
  );
};

// ---------- BSA (Mosteller) ----------
const BsaCalc = () => {
  const [w, setW] = useState("");
  const [h, setH] = useState("");
  const bsa = useMemo(() => {
    const wn = parseFloat(w), hn = parseFloat(h);
    if (!wn || !hn) return null;
    return Math.sqrt((hn * wn) / 3600);
  }, [w, h]);
  return (
    <div className="space-y-3">
      <Field label="الوزن (كجم)"><NumInput value={w} onChange={setW} placeholder="70" /></Field>
      <Field label="الطول (سم)"><NumInput value={h} onChange={setH} placeholder="170" /></Field>
      {bsa != null && <Result value={`${bsa.toFixed(2)} m²`} hint="معادلة Mosteller" />}
    </div>
  );
};

// ---------- Pediatric dose ----------
const PedsDoseCalc = () => {
  const [w, setW] = useState("");
  const [d, setD] = useState("");
  const [freq, setFreq] = useState("1");
  const dose = useMemo(() => {
    const wn = parseFloat(w), dn = parseFloat(d), fn = parseFloat(freq);
    if (!wn || !dn) return null;
    return { each: wn * dn, daily: wn * dn * (fn || 1) };
  }, [w, d, freq]);
  return (
    <div className="space-y-3">
      <Field label="وزن الطفل (كجم)"><NumInput value={w} onChange={setW} placeholder="15" /></Field>
      <Field label="الجرعة الموصى بها (mg/kg)"><NumInput value={d} onChange={setD} placeholder="10" /></Field>
      <Field label="عدد الجرعات يومياً"><NumInput value={freq} onChange={setFreq} placeholder="3" /></Field>
      {dose && <Result value={`${dose.each.toFixed(1)} mg / جرعة`} hint={`المجموع اليومي: ${dose.daily.toFixed(1)} mg`} />}
    </div>
  );
};

// ---------- IV Drip rate ----------
const DripCalc = () => {
  const [vol, setVol] = useState("");
  const [hr, setHr] = useState("");
  const [factor, setFactor] = useState("20");
  const rate = useMemo(() => {
    const v = parseFloat(vol), h = parseFloat(hr), f = parseFloat(factor);
    if (!v || !h || !f) return null;
    return (v * f) / (h * 60);
  }, [vol, hr, factor]);
  return (
    <div className="space-y-3">
      <Field label="الحجم الكلي (mL)"><NumInput value={vol} onChange={setVol} placeholder="1000" /></Field>
      <Field label="الزمن (ساعات)"><NumInput value={hr} onChange={setHr} placeholder="8" /></Field>
      <Field label="معامل التنقيط (gtt/mL)">
        <Select
          value={factor}
          onChange={setFactor}
          options={[
            { v: "10", l: "10 (Macro كبير)" },
            { v: "15", l: "15 (Macro متوسط)" },
            { v: "20", l: "20 (Macro قياسي)" },
            { v: "60", l: "60 (Micro دقيق)" },
          ]}
        />
      </Field>
      {rate != null && <Result value={`${Math.round(rate)} gtt/min`} hint={`≈ ${(parseFloat(vol) / parseFloat(hr)).toFixed(0)} mL/hr`} />}
    </div>
  );
};

// ---------- GCS ----------
const GcsCalc = () => {
  const [e, setE] = useState(4);
  const [v, setV] = useState(5);
  const [m, setM] = useState(6);
  const total = e + v + m;
  const tone = total <= 8 ? "danger" : total <= 12 ? "warn" : "ok";
  const label = total <= 8 ? "غيبوبة شديدة — تنبيب ضروري" : total <= 12 ? "إصابة متوسطة" : "إصابة خفيفة/طبيعي";
  const rowCls = "grid grid-cols-2 gap-2 items-center";
  return (
    <div className="space-y-3">
      <div className={rowCls}>
        <label className="text-xs font-bold">فتح العين (E)</label>
        <Select value={String(e)} onChange={(x) => setE(+x)} options={[
          { v: "4", l: "4 - تلقائي" }, { v: "3", l: "3 - عند النداء" },
          { v: "2", l: "2 - عند الألم" }, { v: "1", l: "1 - لا يفتح" },
        ]} />
      </div>
      <div className={rowCls}>
        <label className="text-xs font-bold">الاستجابة اللفظية (V)</label>
        <Select value={String(v)} onChange={(x) => setV(+x)} options={[
          { v: "5", l: "5 - متوجه" }, { v: "4", l: "4 - مشوش" },
          { v: "3", l: "3 - كلمات غير مناسبة" }, { v: "2", l: "2 - أصوات غير مفهومة" }, { v: "1", l: "1 - لا استجابة" },
        ]} />
      </div>
      <div className={rowCls}>
        <label className="text-xs font-bold">الاستجابة الحركية (M)</label>
        <Select value={String(m)} onChange={(x) => setM(+x)} options={[
          { v: "6", l: "6 - ينفذ الأوامر" }, { v: "5", l: "5 - يحدد الألم" },
          { v: "4", l: "4 - انسحاب من الألم" }, { v: "3", l: "3 - انثناء غير طبيعي" },
          { v: "2", l: "2 - تمدد غير طبيعي" }, { v: "1", l: "1 - لا استجابة" },
        ]} />
      </div>
      <Result value={`GCS = ${total} / 15`} hint={label} tone={tone as "danger" | "warn" | "ok"} />
    </div>
  );
};

// ---------- Braden ----------
const BradenCalc = () => {
  const items: { key: string; label: string; max: number }[] = [
    { key: "s", label: "الإحساس الحسي", max: 4 },
    { key: "m", label: "الرطوبة", max: 4 },
    { key: "a", label: "النشاط", max: 4 },
    { key: "mo", label: "الحركة", max: 4 },
    { key: "n", label: "التغذية", max: 4 },
    { key: "f", label: "الاحتكاك والقص", max: 3 },
  ];
  const [vals, setVals] = useState<Record<string, number>>({ s: 3, m: 3, a: 3, mo: 3, n: 3, f: 2 });
  const total = Object.values(vals).reduce((a, b) => a + b, 0);
  const tone = total <= 12 ? "danger" : total <= 14 ? "warn" : total <= 18 ? "warn" : "ok";
  const label = total <= 9 ? "خطر شديد جداً" : total <= 12 ? "خطر شديد" : total <= 14 ? "خطر متوسط" : total <= 18 ? "خطر خفيف" : "لا يوجد خطر";
  return (
    <div className="space-y-3">
      {items.map((it) => (
        <div key={it.key} className="grid grid-cols-2 gap-2 items-center">
          <label className="text-xs font-bold">{it.label}</label>
          <Select
            value={String(vals[it.key])}
            onChange={(x) => setVals((p) => ({ ...p, [it.key]: +x }))}
            options={Array.from({ length: it.max }, (_, i) => ({ v: String(i + 1), l: String(i + 1) }))}
          />
        </div>
      ))}
      <Result value={`Braden = ${total} / 23`} hint={label} tone={tone as "danger" | "warn" | "ok"} />
    </div>
  );
};

// ---------- Parkland ----------
const ParklandCalc = () => {
  const [w, setW] = useState("");
  const [tbsa, setTbsa] = useState("");
  const res = useMemo(() => {
    const wn = parseFloat(w), tn = parseFloat(tbsa);
    if (!wn || !tn) return null;
    const total = 4 * wn * tn;
    return { total, first: total / 2, second: total / 2 };
  }, [w, tbsa]);
  return (
    <div className="space-y-3">
      <Field label="الوزن (كجم)"><NumInput value={w} onChange={setW} placeholder="70" /></Field>
      <Field label="نسبة الحرق TBSA (%)"><NumInput value={tbsa} onChange={setTbsa} placeholder="30" /></Field>
      {res && (
        <Result
          value={`${res.total.toFixed(0)} mL / 24 ساعة`}
          hint={`النصف الأول (8 س): ${res.first.toFixed(0)} mL · النصف الثاني (16 س): ${res.second.toFixed(0)} mL — Lactated Ringer's`}
        />
      )}
    </div>
  );
};

// ---------- APGAR ----------
const ApgarCalc = () => {
  const items = [
    { key: "a", label: "المظهر (اللون)" },
    { key: "p", label: "النبض" },
    { key: "g", label: "التحفز (Grimace)" },
    { key: "ac", label: "النشاط (توتر العضلات)" },
    { key: "r", label: "التنفس" },
  ];
  const [vals, setVals] = useState<Record<string, number>>({ a: 2, p: 2, g: 2, ac: 2, r: 2 });
  const total = Object.values(vals).reduce((a, b) => a + b, 0);
  const tone = total <= 3 ? "danger" : total <= 6 ? "warn" : "ok";
  const label = total <= 3 ? "ضائقة شديدة — إنعاش" : total <= 6 ? "ضائقة متوسطة" : "طبيعي";
  return (
    <div className="space-y-3">
      {items.map((it) => (
        <div key={it.key} className="grid grid-cols-2 gap-2 items-center">
          <label className="text-xs font-bold">{it.label}</label>
          <Select
            value={String(vals[it.key])}
            onChange={(x) => setVals((p) => ({ ...p, [it.key]: +x }))}
            options={[{ v: "0", l: "0" }, { v: "1", l: "1" }, { v: "2", l: "2" }]}
          />
        </div>
      ))}
      <Result value={`APGAR = ${total} / 10`} hint={label} tone={tone as "danger" | "warn" | "ok"} />
    </div>
  );
};

const CALC_COMPONENTS: Record<CalcId, () => JSX.Element> = {
  bmi: BmiCalc,
  bsa: BsaCalc,
  "peds-dose": PedsDoseCalc,
  drip: DripCalc,
  gcs: GcsCalc,
  braden: BradenCalc,
  parkland: ParklandCalc,
  apgar: ApgarCalc,
};

export const NursingCalculators = () => {
  const [open, setOpen] = useState<CalcId | null>(null);
  return (
    <div className="space-y-2.5">
      {CALCS.map((c) => {
        const isOpen = open === c.id;
        const Cmp = CALC_COMPONENTS[c.id];
        return (
          <div key={c.id} className="rounded-2xl bg-card border border-border overflow-hidden">
            <button
              onClick={() => setOpen(isOpen ? null : c.id)}
              className="w-full p-3.5 flex items-center gap-3 text-right"
            >
              <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl">{c.emoji}</div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-extrabold text-foreground">{c.title}</h4>
                <p className="text-[11px] text-muted-foreground">{c.desc}</p>
              </div>
              <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && (
              <div className="p-3.5 border-t border-border">
                <Cmp />
              </div>
            )}
          </div>
        );
      })}
      <div className="flex items-center gap-1.5 justify-center text-[11px] text-muted-foreground pt-2">
        <Calculator className="h-3 w-3" /> الحاسبات تعليمية ولا تغني عن التحقق الطبي
      </div>
    </div>
  );
};
