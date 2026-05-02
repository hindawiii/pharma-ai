import { memo, useMemo, useState } from "react";
import { BookOpen, Calculator, FlaskConical, HandHeart, Siren, ArrowLeftRight, Droplet, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

// ────────────────────────────────────────────────────────────
// Shared types & data
// ────────────────────────────────────────────────────────────
type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

const BLOOD_TYPES: BloodType[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

interface BloodInfo {
  type: BloodType;
  arabicName: string;
  rarity: string; // percent in general population (approx, global avg)
  characteristics: string;
  notes: string;
  giveTo: BloodType[];
  receiveFrom: BloodType[];
}

const BLOOD_DB: Record<BloodType, BloodInfo> = {
  "O-": {
    type: "O-",
    arabicName: "المتبرع العام",
    rarity: "٧٪",
    characteristics: "لا تحتوي على مستضدات A أو B أو Rh على سطح الكريات الحمراء.",
    notes: "تُعتبر المتبرع العالمي للكريات الحمراء، ويُستخدم دمها في حالات الطوارئ القصوى.",
    giveTo: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    receiveFrom: ["O-"],
  },
  "O+": {
    type: "O+",
    arabicName: "الأكثر شيوعاً",
    rarity: "٣٨٪",
    characteristics: "لا تحتوي على مستضدات A أو B، لكنها تحمل عامل Rh الموجب.",
    notes: "أكثر فصائل الدم انتشاراً وتُعدّ مصدراً مهماً للتبرع لجميع فصائل Rh+.",
    giveTo: ["A+", "B+", "AB+", "O+"],
    receiveFrom: ["O+", "O-"],
  },
  "A-": {
    type: "A-",
    arabicName: "نادرة نسبياً",
    rarity: "٦٪",
    characteristics: "تحمل مستضد A فقط دون عامل Rh.",
    notes: "متبرع مهم لمرضى A و AB سواء موجب أو سالب.",
    giveTo: ["A+", "A-", "AB+", "AB-"],
    receiveFrom: ["A-", "O-"],
  },
  "A+": {
    type: "A+",
    arabicName: "شائعة",
    rarity: "٣٤٪",
    characteristics: "تحمل مستضد A وعامل Rh الموجب.",
    notes: "ثاني أكثر الفصائل شيوعاً، وتتبرع لـ A+ و AB+.",
    giveTo: ["A+", "AB+"],
    receiveFrom: ["A+", "A-", "O+", "O-"],
  },
  "B-": {
    type: "B-",
    arabicName: "نادرة",
    rarity: "٢٪",
    characteristics: "تحمل مستضد B فقط دون عامل Rh.",
    notes: "من الفصائل النادرة وتُعد ذات أهمية كبيرة في بنوك الدم.",
    giveTo: ["B+", "B-", "AB+", "AB-"],
    receiveFrom: ["B-", "O-"],
  },
  "B+": {
    type: "B+",
    arabicName: "متوسطة الشيوع",
    rarity: "٩٪",
    characteristics: "تحمل مستضد B وعامل Rh الموجب.",
    notes: "تتبرع لـ B+ و AB+، وأكثر شيوعاً في بعض الشعوب الآسيوية.",
    giveTo: ["B+", "AB+"],
    receiveFrom: ["B+", "B-", "O+", "O-"],
  },
  "AB-": {
    type: "AB-",
    arabicName: "الأندر",
    rarity: "١٪",
    characteristics: "تحمل مستضدي A و B دون عامل Rh.",
    notes: "أندر فصائل الدم على الإطلاق، وتُعدّ المتلقي العام للبلازما.",
    giveTo: ["AB+", "AB-"],
    receiveFrom: ["A-", "B-", "AB-", "O-"],
  },
  "AB+": {
    type: "AB+",
    arabicName: "المتلقي العام",
    rarity: "٣٪",
    characteristics: "تحمل مستضدي A و B وعامل Rh الموجب.",
    notes: "تُعتبر المتلقي العالمي للكريات الحمراء، يمكنها استقبال أي فصيلة دم.",
    giveTo: ["AB+"],
    receiveFrom: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },
};

// ────────────────────────────────────────────────────────────
// Compatibility (genetics) calculator
// ABO genotype combos -> phenotype distribution
// ────────────────────────────────────────────────────────────
const ABO_GENOTYPES: Record<string, string[]> = {
  "A": ["AA", "AO"], // possible genotypes; we'll average over both equally for simplicity
  "B": ["BB", "BO"],
  "AB": ["AB"],
  "O": ["OO"],
};

function aboFromType(t: BloodType): "A" | "B" | "AB" | "O" {
  return t.replace(/[+-]/g, "") as "A" | "B" | "AB" | "O";
}
function rhFromType(t: BloodType): "+" | "-" {
  return t.endsWith("+") ? "+" : "-";
}

function calcAboChildren(p1: BloodType, p2: BloodType): Record<"A" | "B" | "AB" | "O", number> {
  const counts = { A: 0, B: 0, AB: 0, O: 0 };
  let total = 0;
  const g1s = ABO_GENOTYPES[aboFromType(p1)];
  const g2s = ABO_GENOTYPES[aboFromType(p2)];
  for (const g1 of g1s) {
    for (const g2 of g2s) {
      for (const a1 of g1) {
        for (const a2 of g2) {
          const alleles = [a1, a2].sort().join("");
          let pheno: "A" | "B" | "AB" | "O";
          if (alleles === "AA" || alleles === "AO") pheno = "A";
          else if (alleles === "BB" || alleles === "BO") pheno = "B";
          else if (alleles === "AB") pheno = "AB";
          else pheno = "O";
          counts[pheno]++;
          total++;
        }
      }
    }
  }
  return {
    A: (counts.A / total) * 100,
    B: (counts.B / total) * 100,
    AB: (counts.AB / total) * 100,
    O: (counts.O / total) * 100,
  };
}

function calcRhChildren(p1: BloodType, p2: BloodType): { "+": number; "-": number } {
  // Treat + parent as Rr (heterozygous) for general estimation, - parent as rr.
  // This gives an educational approximation.
  const a = rhFromType(p1) === "+" ? ["R", "r"] : ["r", "r"];
  const b = rhFromType(p2) === "+" ? ["R", "r"] : ["r", "r"];
  let pos = 0, neg = 0, total = 0;
  for (const x of a) for (const y of b) {
    if (x === "R" || y === "R") pos++; else neg++;
    total++;
  }
  return { "+": (pos / total) * 100, "-": (neg / total) * 100 };
}

function calcChildBloodTypes(p1: BloodType, p2: BloodType): { type: BloodType; pct: number }[] {
  const abo = calcAboChildren(p1, p2);
  const rh = calcRhChildren(p1, p2);
  const out: { type: BloodType; pct: number }[] = [];
  (["A", "B", "AB", "O"] as const).forEach((g) => {
    (["+", "-"] as const).forEach((r) => {
      const pct = (abo[g] / 100) * rh[r];
      if (pct > 0.5) out.push({ type: `${g}${r}` as BloodType, pct: Math.round(pct * 10) / 10 });
    });
  });
  return out.sort((a, b) => b.pct - a.pct);
}

// ────────────────────────────────────────────────────────────
// Section 1: Encyclopedia
// ────────────────────────────────────────────────────────────
const EncyclopediaSection = () => {
  const [selected, setSelected] = useState<BloodType>("O+");
  const info = BLOOD_DB[selected];
  return (
    <div className="space-y-4" dir="rtl">
      <div className="grid grid-cols-4 gap-2">
        {BLOOD_TYPES.map((t) => {
          const active = t === selected;
          return (
            <button
              key={t}
              onClick={() => setSelected(t)}
              className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center font-extrabold transition-bounce active:scale-90 border-2 ${
                active
                  ? "bg-[#C62828] text-white border-[#C62828] shadow-elegant scale-105"
                  : "bg-white text-[#C62828] border-[#C62828]/30 hover:border-[#C62828]"
              }`}
            >
              <Droplet className={`h-4 w-4 mb-0.5 ${active ? "text-white" : "text-[#C62828]"}`} fill="currentColor" />
              <span className="text-base">{t}</span>
            </button>
          );
        })}
      </div>

      <div className="rounded-3xl overflow-hidden border-2 border-[#C62828]/20 bg-white shadow-soft">
        <div className="bg-gradient-to-l from-[#C62828] to-[#8B1A1A] text-white px-5 py-4 flex items-center justify-between">
          <div>
            <div className="text-xs opacity-90 font-bold">{info.arabicName}</div>
            <div className="text-3xl font-black mt-0.5">{info.type}</div>
          </div>
          <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Droplet className="h-8 w-8 text-white" fill="currentColor" />
          </div>
        </div>
        <div className="p-5 space-y-4">
          <Field label="الندرة في المجتمع" value={info.rarity} accent />
          <Field label="خصائص الفصيلة" value={info.characteristics} />
          <Field label="ملاحظات طبية" value={info.notes} />
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) => (
  <div>
    <div className={`text-xs font-extrabold mb-1 ${accent ? "text-[#C62828]" : "text-foreground"}`}>{label}</div>
    <div className="text-sm text-muted-foreground leading-relaxed">{value}</div>
  </div>
);

// ────────────────────────────────────────────────────────────
// Section 2: Genetics calculator
// ────────────────────────────────────────────────────────────
const CalculatorSection = () => {
  const [father, setFather] = useState<BloodType>("A+");
  const [mother, setMother] = useState<BloodType>("O+");
  const results = useMemo(() => calcChildBloodTypes(father, mother), [father, mother]);

  return (
    <div className="space-y-4" dir="rtl">
      <div className="rounded-2xl border-2 border-[#C62828]/20 bg-white p-4 shadow-soft">
        <div className="text-xs font-extrabold text-[#C62828] mb-3 flex items-center gap-1.5">
          <Calculator className="h-4 w-4" />
          أدخل فصيلة دم الوالدين
        </div>
        <div className="grid grid-cols-2 gap-3">
          <ParentPicker label="الأب" value={father} onChange={setFather} />
          <ParentPicker label="الأم" value={mother} onChange={setMother} />
        </div>
      </div>

      <div className="rounded-2xl bg-gradient-to-l from-[#C62828] to-[#8B1A1A] text-white p-4 shadow-elegant">
        <div className="text-xs font-bold opacity-90 mb-2">الفصائل المحتملة للأبناء</div>
        <div className="space-y-2">
          {results.map((r) => (
            <div key={r.type} className="flex items-center gap-3">
              <div className="h-9 w-12 rounded-lg bg-white text-[#C62828] flex items-center justify-center font-black text-sm flex-shrink-0">
                {r.type}
              </div>
              <div className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${r.pct}%` }}
                />
              </div>
              <div className="text-sm font-extrabold tabular-nums w-14 text-left">{r.pct}٪</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3 flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-700 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-amber-900 leading-relaxed font-semibold">
          الحاسبة تعليمية تقريبية بناءً على قوانين مندل، النتائج الفعلية تعتمد على الجينات الدقيقة للأبوين.
        </p>
      </div>
    </div>
  );
};

const ParentPicker = ({ label, value, onChange }: { label: string; value: BloodType; onChange: (t: BloodType) => void }) => (
  <div>
    <div className="text-[11px] font-bold text-muted-foreground mb-1.5">{label}</div>
    <div className="grid grid-cols-4 gap-1">
      {BLOOD_TYPES.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`py-2 rounded-lg text-xs font-extrabold transition-bounce active:scale-90 ${
            value === t
              ? "bg-[#C62828] text-white shadow-soft"
              : "bg-[#C62828]/5 text-[#C62828] hover:bg-[#C62828]/10"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  </div>
);

// ────────────────────────────────────────────────────────────
// Section 3: Lab guide
// ────────────────────────────────────────────────────────────
const LabSection = () => {
  const [tab, setTab] = useState<"sample" | "testing">("sample");
  return (
    <div className="space-y-4" dir="rtl">
      <div className="grid grid-cols-2 gap-2 p-1 bg-[#C62828]/10 rounded-2xl">
        <button
          onClick={() => setTab("sample")}
          className={`py-2.5 rounded-xl text-xs font-extrabold transition-bounce ${
            tab === "sample" ? "bg-[#C62828] text-white shadow-soft" : "text-[#C62828]"
          }`}
        >
          أخذ العينة
        </button>
        <button
          onClick={() => setTab("testing")}
          className={`py-2.5 rounded-xl text-xs font-extrabold transition-bounce ${
            tab === "testing" ? "bg-[#C62828] text-white shadow-soft" : "text-[#C62828]"
          }`}
        >
          طريقة الفحص
        </button>
      </div>

      {tab === "sample" ? (
        <div className="space-y-3">
          <SubHeader title="سحب الدم الوريدي (Venipuncture)" />
          <Steps
            items={[
              "تحقق من بيانات المريض وحضّر الأنابيب المناسبة (EDTA للفصيلة).",
              "اختر الوريد المناسب (الوريد المتوسط في الكوع غالباً) واربط العاصبة فوقه بـ٧–١٠ سم.",
              "عقّم منطقة الوخز بالكحول ٧٠٪ بحركة دائرية من الداخل للخارج، واتركها تجف.",
              "ادخل الإبرة بزاوية ١٥–٣٠ درجة مع اتجاه الوريد، ثم اسحب الكمية المطلوبة.",
              "فك العاصبة قبل سحب الإبرة، وضع شاشة معقمة واضغط ٣–٥ دقائق.",
              "اقلب الأنبوب برفق ٨–١٠ مرات لمزجه بمضاد التجلط، وعنونه فوراً.",
            ]}
          />
          <SubHeader title="وخز طرف الإصبع (Finger Prick)" />
          <Steps
            items={[
              "نظّف طرف الإصبع الوسطى أو البنصر بالكحول واتركه يجف.",
              "استخدم لانست معقمة لمرة واحدة وقم بالوخز بحركة سريعة على جانب الإصبع.",
              "تخلّص من القطرة الأولى بقطعة شاش جافة لتجنب التلوث.",
              "اجمع القطرات التالية على شريحة الفحص أو في الأنبوب الشعري.",
              "اضغط بقطعة شاش معقمة حتى يتوقف النزيف.",
            ]}
          />
        </div>
      ) : (
        <div className="space-y-3">
          <SubHeader title="طريقة Forward Grouping" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            يتم وضع ثلاث قطرات من دم المريض على شريحة، ثم إضافة كاشف Anti-A على القطرة الأولى، Anti-B على الثانية، و Anti-D على الثالثة، ومراقبة حدوث التجلط (Agglutination).
          </p>
          <div className="rounded-2xl border-2 border-[#C62828]/20 bg-white overflow-hidden">
            <div className="grid grid-cols-4 text-center text-xs font-extrabold bg-[#C62828] text-white">
              <div className="py-2">Anti-A</div>
              <div className="py-2">Anti-B</div>
              <div className="py-2">Anti-D</div>
              <div className="py-2">الفصيلة</div>
            </div>
            {[
              { a: true, b: false, d: true, t: "A+" },
              { a: true, b: false, d: false, t: "A-" },
              { a: false, b: true, d: true, t: "B+" },
              { a: false, b: true, d: false, t: "B-" },
              { a: true, b: true, d: true, t: "AB+" },
              { a: true, b: true, d: false, t: "AB-" },
              { a: false, b: false, d: true, t: "O+" },
              { a: false, b: false, d: false, t: "O-" },
            ].map((row, i) => (
              <div key={i} className={`grid grid-cols-4 text-center text-xs ${i % 2 ? "bg-[#C62828]/5" : "bg-white"}`}>
                <Cell agg={row.a} />
                <Cell agg={row.b} />
                <Cell agg={row.d} />
                <div className="py-2.5 font-black text-[#C62828]">{row.t}</div>
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-[#C62828]/5 border border-[#C62828]/20 p-3">
            <div className="text-[11px] font-extrabold text-[#C62828] mb-1">📌 ما هو التجلط (Agglutination)؟</div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              تكتل الكريات الحمراء على شكل حبيبات أو رواسب مرئية بالعين المجردة عند تفاعل المستضد مع الجسم المضاد، ويعني وجود المستضد على الكريات.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const Cell = ({ agg }: { agg: boolean }) => (
  <div className="py-2.5 flex items-center justify-center">
    {agg ? (
      <span className="inline-flex items-center gap-1 text-[#C62828] font-extrabold">
        <CheckCircle2 className="h-3.5 w-3.5" /> تجلط
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 text-muted-foreground">
        <XCircle className="h-3.5 w-3.5" /> سلبي
      </span>
    )}
  </div>
);

const SubHeader = ({ title }: { title: string }) => (
  <h4 className="text-sm font-extrabold text-[#C62828] flex items-center gap-2">
    <FlaskConical className="h-4 w-4" /> {title}
  </h4>
);

const Steps = ({ items }: { items: string[] }) => (
  <ol className="space-y-2">
    {items.map((s, i) => (
      <li key={i} className="flex gap-3 items-start rounded-xl bg-white border border-[#C62828]/15 p-3 shadow-soft">
        <div className="h-6 w-6 rounded-full bg-[#C62828] text-white flex items-center justify-center text-[11px] font-black flex-shrink-0">
          {i + 1}
        </div>
        <p className="text-xs text-foreground leading-relaxed flex-1">{s}</p>
      </li>
    ))}
  </ol>
);

// ────────────────────────────────────────────────────────────
// Section 4: Donor compatibility
// ────────────────────────────────────────────────────────────
const DonorSection = () => {
  const [selected, setSelected] = useState<BloodType>("O+");
  const info = BLOOD_DB[selected];
  return (
    <div className="space-y-4" dir="rtl">
      <div className="text-xs font-extrabold text-[#C62828] flex items-center gap-1.5">
        <ArrowLeftRight className="h-4 w-4" /> اختر فصيلتك لمعرفة التوافق
      </div>
      <div className="grid grid-cols-4 gap-2">
        {BLOOD_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setSelected(t)}
            className={`py-3 rounded-xl font-extrabold transition-bounce active:scale-90 ${
              selected === t
                ? "bg-[#C62828] text-white shadow-elegant scale-105"
                : "bg-white text-[#C62828] border-2 border-[#C62828]/20"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3">
        <CompatCard
          title="من يمكنك التبرع لهم؟"
          subtitle="يمكنك إعطاء الدم لـ"
          types={info.giveTo}
          icon={<HandHeart className="h-5 w-5" />}
        />
        <CompatCard
          title="ممن يمكنك تلقي الدم؟"
          subtitle="يمكنك استقبال الدم من"
          types={info.receiveFrom}
          icon={<Droplet className="h-5 w-5" fill="currentColor" />}
          inverse
        />
      </div>
    </div>
  );
};

const CompatCard = ({
  title,
  subtitle,
  types,
  icon,
  inverse = false,
}: {
  title: string;
  subtitle: string;
  types: BloodType[];
  icon: React.ReactNode;
  inverse?: boolean;
}) => (
  <div
    className={`rounded-2xl p-4 shadow-soft border-2 ${
      inverse ? "bg-white border-[#C62828]/30 text-foreground" : "bg-gradient-to-l from-[#C62828] to-[#8B1A1A] text-white border-transparent"
    }`}
  >
    <div className="flex items-center gap-2 mb-3">
      <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${inverse ? "bg-[#C62828]/10 text-[#C62828]" : "bg-white/20"}`}>
        {icon}
      </div>
      <div>
        <div className={`text-sm font-extrabold ${inverse ? "text-[#C62828]" : "text-white"}`}>{title}</div>
        <div className={`text-[11px] ${inverse ? "text-muted-foreground" : "text-white/80"}`}>{subtitle}</div>
      </div>
    </div>
    <div className="flex flex-wrap gap-1.5">
      {types.map((t) => (
        <span
          key={t}
          className={`px-3 py-1.5 rounded-lg text-xs font-black ${
            inverse ? "bg-[#C62828] text-white" : "bg-white text-[#C62828]"
          }`}
        >
          {t}
        </span>
      ))}
    </div>
  </div>
);

// ────────────────────────────────────────────────────────────
// Section 5: Urgent need (Rakoba community)
// ────────────────────────────────────────────────────────────
const UrgentSection = ({ onRequestUrgent }: { onRequestUrgent?: () => void }) => {
  const [type, setType] = useState<BloodType>("O+");
  const [city, setCity] = useState("");
  const [hospital, setHospital] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    onRequestUrgent?.();
    setTimeout(() => setSubmitted(false), 3500);
  };

  return (
    <div className="space-y-4" dir="rtl">
      <div className="rounded-2xl bg-gradient-to-l from-[#C62828] to-[#8B1A1A] text-white p-4 shadow-elegant">
        <div className="flex items-center gap-2 mb-1">
          <Siren className="h-5 w-5" />
          <div className="text-sm font-extrabold">حالة طوارئ - تحتاج دم؟</div>
        </div>
        <p className="text-[11px] text-white/85 leading-relaxed">
          أرسل طلبك إلى مجتمع رقوبة وسيصل التنبيه فوراً للمتبرعين المتطوعين في منطقتك.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-[11px] font-extrabold text-foreground block mb-1.5">الفصيلة المطلوبة</label>
          <div className="grid grid-cols-4 gap-1.5">
            {BLOOD_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`py-2 rounded-lg text-xs font-extrabold transition-bounce ${
                  type === t ? "bg-[#C62828] text-white shadow-soft" : "bg-[#C62828]/5 text-[#C62828]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <UrgentInput label="المدينة" value={city} onChange={setCity} placeholder="مثال: الخرطوم" />
        <UrgentInput label="المستشفى" value={hospital} onChange={setHospital} placeholder="مثال: مستشفى الأكاديمي" />
        <UrgentInput label="رقم التواصل" value={phone} onChange={setPhone} placeholder="رقم الهاتف" />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!city || !hospital || !phone || submitted}
        className="w-full h-14 rounded-2xl bg-[#C62828] text-white font-extrabold text-sm shadow-elegant transition-bounce active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
      >
        <Siren className="h-5 w-5" />
        {submitted ? "تم إرسال الطلب إلى مجتمع رقوبة ✓" : "🚨 طلب تبرع عاجل"}
      </button>
    </div>
  );
};

const UrgentInput = ({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) => (
  <div>
    <label className="text-[11px] font-extrabold text-foreground block mb-1.5">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      dir="rtl"
      className="w-full h-11 rounded-xl border-2 border-[#C62828]/20 bg-white px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[#C62828] transition-colors"
    />
  </div>
);

// ────────────────────────────────────────────────────────────
// Main exported tabs router
// ────────────────────────────────────────────────────────────
export type BloodSectionKey = "encyclopedia" | "matching" | "lab" | "donate" | "urgent";

export const BLOOD_TABS: { key: BloodSectionKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "encyclopedia", label: "موسوعة الفصائل", icon: BookOpen },
  { key: "matching", label: "حاسبة التزاوج", icon: Calculator },
  { key: "lab", label: "المختبر", icon: FlaskConical },
  { key: "donate", label: "من يتبرع لمن؟", icon: HandHeart },
  { key: "urgent", label: "طلب حاجة عاجلة", icon: Siren },
];

export const BloodTypesContent = memo(({ section, onRequestUrgent }: { section: BloodSectionKey; onRequestUrgent?: () => void }) => {
  if (section === "encyclopedia") return <EncyclopediaSection />;
  if (section === "matching") return <CalculatorSection />;
  if (section === "lab") return <LabSection />;
  if (section === "donate") return <DonorSection />;
  return <UrgentSection onRequestUrgent={onRequestUrgent} />;
});

BloodTypesContent.displayName = "BloodTypesContent";
