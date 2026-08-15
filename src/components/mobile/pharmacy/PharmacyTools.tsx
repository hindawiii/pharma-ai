import { useMemo, useState } from "react";
import { ChevronDown, ShieldAlert, Baby, HeartPulse, Scale, AlertTriangle, X, Search } from "lucide-react";
import { drugMonographs, searchMonographs } from "@/data/drugMonographs";
import type { DrugMonograph } from "@/types/drugMonograph";

// ============================================================
// م3 — الأدوات الصيدلانية
// فاحص التفاعلات · فاحص الآثار الجانبية · جرعة الأطفال · أدوات الحمل · BMI
// ============================================================

type ToolId = "interactions" | "effects" | "peds" | "pregnancy" | "bmi";

const TOOLS: { id: ToolId; title: string; desc: string; icon: typeof ShieldAlert }[] = [
  { id: "interactions", title: "فاحص التفاعلات الدوائية", desc: "اختر عدة أدوية لكشف التعارضات وشدّتها", icon: ShieldAlert },
  { id: "effects", title: "فاحص الآثار الجانبية", desc: "تحذيرات وموانع الاستعمال لأي دواء", icon: AlertTriangle },
  { id: "peds", title: "حاسبة جرعة الأطفال", desc: "mg/kg حسب وزن الطفل وعدد الجرعات", icon: Baby },
  { id: "pregnancy", title: "أدوات الحمل والرضاعة", desc: "فئات الأمان A–X وسلامة الرضاعة", icon: HeartPulse },
  { id: "bmi", title: "مؤشر كتلة الجسم (BMI)", desc: "تقييم الوزن ومساحة سطح الجسم", icon: Scale },
];

// ---------- shared bits ----------
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1">
    <label className="text-xs font-bold text-muted-foreground">{label}</label>
    {children}
  </div>
);

const NumInput = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) => (
  <input
    inputMode="decimal"
    type="number"
    value={value}
    placeholder={placeholder}
    onChange={(e) => onChange(e.target.value)}
    className="w-full px-3 py-2.5 rounded-xl bg-muted text-foreground border border-border focus:border-primary outline-none"
    dir="ltr"
  />
);

const Result = ({ value, hint, tone = "primary" }: { value: string; hint?: string; tone?: "primary" | "warn" | "danger" | "ok" }) => {
  const cls =
    tone === "danger" ? "bg-destructive/10 text-destructive border-destructive/30" :
    tone === "warn" ? "bg-[hsl(40_90%_50%/0.14)] text-[hsl(35_90%_35%)] border-[hsl(40_90%_50%/0.35)]" :
    tone === "ok" ? "bg-[hsl(150_60%_40%/0.14)] text-[hsl(150_60%_30%)] border-[hsl(150_60%_40%/0.35)]" :
    "bg-primary/10 text-primary border-primary/30";
  return (
    <div className={`mt-2 rounded-2xl border p-3 ${cls}`}>
      <p className="text-base font-extrabold" dir="ltr">{value}</p>
      {hint && <p className="text-xs mt-0.5 opacity-85 leading-relaxed" dir="rtl">{hint}</p>}
    </div>
  );
};

/** بحث + اختيار دواء من البطاقات السريرية */
const DrugPicker = ({
  onPick,
  placeholder = "ابحث باسم الدواء عربي أو إنجليزي…",
}: { onPick: (d: DrugMonograph) => void; placeholder?: string }) => {
  const [q, setQ] = useState("");
  const results = useMemo(() => (q.trim() ? searchMonographs(q).slice(0, 8) : []), [q]);
  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className="w-full pr-9 pl-3 py-2.5 rounded-xl bg-muted text-foreground border border-border focus:border-primary outline-none text-sm"
        />
      </div>
      {results.length > 0 && (
        <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
          {results.map((d) => (
            <button
              key={d.id}
              onClick={() => { onPick(d); setQ(""); }}
              className="w-full px-3 py-2 text-right hover:bg-muted transition-smooth"
            >
              <span className="text-sm font-bold text-foreground">{d.nameAr}</span>
              <span className="text-[11px] text-muted-foreground block">{d.nameEn} · {d.categoryAr}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Chip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
    {label}
    <button onClick={onRemove} aria-label={`إزالة ${label}`}><X className="h-3 w-3" /></button>
  </span>
);

const norm = (s?: string) =>
  (s ?? "").toLowerCase().replace(/[\u064B-\u0652]/g, "").replace(/[^a-z\u0621-\u064A]/g, "");

// ---------- 1. Interaction checker ----------
const InteractionTool = () => {
  const [picked, setPicked] = useState<DrugMonograph[]>([]);

  const findings = useMemo(() => {
    const out: { a: DrugMonograph; b: DrugMonograph; note: string; severity: "danger" | "caution" }[] = [];
    for (let i = 0; i < picked.length; i++) {
      for (let j = 0; j < picked.length; j++) {
        if (i === j) continue;
        const a = picked[i], b = picked[j];
        const bKeys = [b.nameAr, b.nameEn, b.scientificAr, b.scientificEn, b.categoryAr].map(norm).filter((k) => k.length > 2);
        for (const it of a.interactions) {
          const w = norm(it.with);
          if (!w) continue;
          if (bKeys.some((k) => w.includes(k) || k.includes(w))) {
            const dup = out.some((o) => (o.a.id === b.id && o.b.id === a.id && o.note === it.note));
            if (!dup) out.push({ a, b, note: it.note, severity: it.severity });
          }
        }
      }
    }
    return out;
  }, [picked]);

  return (
    <div className="space-y-3">
      <DrugPicker onPick={(d) => setPicked((p) => (p.some((x) => x.id === d.id) ? p : [...p, d]))} />
      {picked.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {picked.map((d) => (
            <Chip key={d.id} label={d.nameAr} onRemove={() => setPicked((p) => p.filter((x) => x.id !== d.id))} />
          ))}
        </div>
      )}
      {picked.length < 2 && <p className="text-xs text-muted-foreground">أضف دوائين على الأقل لفحص التعارض بينهما.</p>}
      {picked.length >= 2 && findings.length === 0 && (
        <Result value="لا يوجد تعارض مسجّل" hint="لم نجد تفاعلاً موثقاً بين الأدوية المختارة في قاعدتنا — راجع الصيدلي دائماً." tone="ok" />
      )}
      {findings.map((f, i) => (
        <div
          key={i}
          className={`rounded-2xl border p-3 ${f.severity === "danger" ? "bg-destructive/10 border-destructive/30" : "bg-[hsl(40_90%_50%/0.12)] border-[hsl(40_90%_50%/0.35)]"}`}
        >
          <p className="text-sm font-extrabold text-foreground">{f.a.nameAr} + {f.b.nameAr}</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{f.note}</p>
          <span className={`inline-block mt-2 text-[11px] font-bold px-2 py-0.5 rounded-full ${f.severity === "danger" ? "bg-destructive/20 text-destructive" : "bg-[hsl(40_90%_50%/0.25)] text-[hsl(35_90%_32%)]"}`}>
            {f.severity === "danger" ? "خطر — تجنّب الجمع" : "احتياط — مراقبة لازمة"}
          </span>
        </div>
      ))}
    </div>
  );
};

// ---------- 2. Side effects / warnings ----------
const EffectsTool = () => {
  const [drug, setDrug] = useState<DrugMonograph | null>(null);
  return (
    <div className="space-y-3">
      <DrugPicker onPick={setDrug} />
      {!drug && <p className="text-xs text-muted-foreground">اختر دواءً لعرض تحذيراته وموانع استعماله.</p>}
      {drug && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-extrabold text-foreground">{drug.nameAr}</p>
              <p className="text-[11px] text-muted-foreground">{drug.nameEn} · {drug.categoryAr}</p>
            </div>
            <button onClick={() => setDrug(null)} className="text-xs text-primary font-bold">تغيير</button>
          </div>
          <div className="rounded-2xl border border-border bg-card p-3">
            <p className="text-xs font-extrabold text-foreground mb-1.5">⚠️ التحذيرات</p>
            <ul className="space-y-1">
              {drug.warnings.map((w, i) => (
                <li key={i} className="text-xs text-muted-foreground leading-relaxed">• {w}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-3">
            <p className="text-xs font-extrabold text-destructive mb-1.5">🚫 موانع الاستعمال</p>
            <ul className="space-y-1">
              {drug.contraindications.map((c, i) => (
                <li key={i} className="text-xs text-muted-foreground leading-relaxed">• {c}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-3">
            <p className="text-xs font-extrabold text-foreground mb-1.5">💊 الجرعة الزائدة</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{drug.overdose}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ---------- 3. Pediatric dose ----------
const PedsTool = () => {
  const [w, setW] = useState("");
  const [mgkg, setMgkg] = useState("");
  const [freq, setFreq] = useState("3");
  const [conc, setConc] = useState("");
  const res = useMemo(() => {
    const wn = parseFloat(w), dn = parseFloat(mgkg), fn = parseFloat(freq) || 1;
    if (!wn || !dn) return null;
    const each = wn * dn;
    const cn = parseFloat(conc);
    const ml = cn ? (each / cn) * 5 : null; // conc = mg / 5 mL
    return { each, daily: each * fn, ml };
  }, [w, mgkg, freq, conc]);
  return (
    <div className="space-y-3">
      <Field label="وزن الطفل (كجم)"><NumInput value={w} onChange={setW} placeholder="15" /></Field>
      <Field label="الجرعة الموصى بها (mg/kg)"><NumInput value={mgkg} onChange={setMgkg} placeholder="10" /></Field>
      <Field label="عدد الجرعات يومياً"><NumInput value={freq} onChange={setFreq} placeholder="3" /></Field>
      <Field label="تركيز الشراب (mg لكل 5 مل) — اختياري"><NumInput value={conc} onChange={setConc} placeholder="120" /></Field>
      {res && (
        <Result
          value={`${res.each.toFixed(1)} mg / جرعة`}
          hint={`المجموع اليومي: ${res.daily.toFixed(1)} mg${res.ml ? ` · الحجم لكل جرعة ≈ ${res.ml.toFixed(1)} مل` : ""}`}
        />
      )}
      <p className="text-[11px] text-muted-foreground">لا تتجاوز الحد الأقصى اليومي المذكور في نشرة الدواء.</p>
    </div>
  );
};

// ---------- 4. Pregnancy & lactation ----------
const CATEGORY_INFO: Record<string, { tone: "ok" | "warn" | "danger"; text: string }> = {
  A: { tone: "ok", text: "دراسات بشرية لم تُظهر خطراً على الجنين — آمن نسبياً." },
  B: { tone: "ok", text: "لا خطر في الدراسات الحيوانية ولا دراسات بشرية كافية — يُستخدم عند الحاجة." },
  C: { tone: "warn", text: "خطر محتمل — يُستخدم فقط إذا فاقت الفائدة الخطر." },
  D: { tone: "danger", text: "دليل على خطر بشري — يُستخدم فقط في حالات مهدِّدة للحياة." },
  X: { tone: "danger", text: "ممنوع تماماً في الحمل — الخطر يفوق أي فائدة." },
};

const PregnancyTool = () => {
  const [drug, setDrug] = useState<DrugMonograph | null>(null);
  const cat = (drug?.pregnancy.category ?? "").trim().toUpperCase().charAt(0);
  const info = CATEGORY_INFO[cat];
  return (
    <div className="space-y-3">
      <DrugPicker onPick={setDrug} placeholder="ابحث عن الدواء للتحقق من سلامته…" />
      {drug && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-extrabold text-foreground">{drug.nameAr} <span className="text-[11px] font-normal text-muted-foreground">{drug.nameEn}</span></p>
            <button onClick={() => setDrug(null)} className="text-xs text-primary font-bold">تغيير</button>
          </div>
          <Result
            value={`فئة الحمل: ${drug.pregnancy.category}`}
            hint={`${info?.text ?? ""} ${drug.pregnancy.note}`}
            tone={info?.tone ?? "primary"}
          />
          <div className="rounded-2xl border border-border bg-card p-3">
            <p className="text-xs font-extrabold text-foreground mb-1">🤱 الرضاعة</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{drug.lactation}</p>
          </div>
        </div>
      )}
      <div className="rounded-2xl bg-muted p-3 space-y-1.5">
        <p className="text-xs font-extrabold text-foreground">دليل الفئات (FDA)</p>
        {Object.entries(CATEGORY_INFO).map(([k, v]) => (
          <p key={k} className="text-[11px] text-muted-foreground leading-relaxed">
            <span className="font-extrabold text-foreground">{k}:</span> {v.text}
          </p>
        ))}
      </div>
    </div>
  );
};

// ---------- 5. BMI + BSA ----------
const BmiTool = () => {
  const [w, setW] = useState("");
  const [h, setH] = useState("");
  const calc = useMemo(() => {
    const wn = parseFloat(w), hn = parseFloat(h);
    if (!wn || !hn) return null;
    const m = hn / 100;
    return { bmi: wn / (m * m), bsa: Math.sqrt((hn * wn) / 3600) };
  }, [w, h]);
  const cat = !calc ? "" : calc.bmi < 18.5 ? "نقص وزن" : calc.bmi < 25 ? "وزن طبيعي" : calc.bmi < 30 ? "زيادة وزن" : "سمنة";
  const tone = !calc ? "primary" : calc.bmi < 18.5 || calc.bmi >= 30 ? "warn" : "ok";
  return (
    <div className="space-y-3">
      <Field label="الوزن (كجم)"><NumInput value={w} onChange={setW} placeholder="70" /></Field>
      <Field label="الطول (سم)"><NumInput value={h} onChange={setH} placeholder="170" /></Field>
      {calc && (
        <Result
          value={`${calc.bmi.toFixed(1)} kg/m²`}
          hint={`${cat} · مساحة سطح الجسم (Mosteller): ${calc.bsa.toFixed(2)} m² — تُستخدم لحساب جرعات الأدوية الدقيقة`}
          tone={tone as "warn" | "ok" | "primary"}
        />
      )}
    </div>
  );
};

const COMPONENTS: Record<ToolId, () => JSX.Element> = {
  interactions: InteractionTool,
  effects: EffectsTool,
  peds: PedsTool,
  pregnancy: PregnancyTool,
  bmi: BmiTool,
};

export const PharmacyTools = () => {
  const [open, setOpen] = useState<ToolId | null>("interactions");
  return (
    <div className="space-y-2.5">
      {TOOLS.map((t) => {
        const isOpen = open === t.id;
        const Cmp = COMPONENTS[t.id];
        const Icon = t.icon;
        return (
          <div key={t.id} className="rounded-2xl bg-card border border-border overflow-hidden">
            <button
              onClick={() => setOpen(isOpen ? null : t.id)}
              className="w-full p-3.5 flex items-center gap-3 text-right"
              aria-expanded={isOpen}
            >
              <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-extrabold text-foreground">{t.title}</h4>
                <p className="text-[11px] text-muted-foreground">{t.desc}</p>
              </div>
              <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && <div className="p-3.5 border-t border-border">{Cmp && <Cmp />}</div>}
          </div>
        );
      })}
      <p className="text-center text-[11px] text-muted-foreground pt-1">
        المصادر: FDA DailyMed · BNF/NICE · WHO EML — الأدوات تعليمية ولا تُغني عن الصيدلي.
      </p>
      <p className="text-center text-[10px] text-muted-foreground">{drugMonographs.length} دواء في القاعدة السريرية</p>
    </div>
  );
};
