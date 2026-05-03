import { memo } from "react";
import {
  Bone, Flame, Droplet, HeartPulse, Activity, Eye, Bug, Sun,
  Soup, Snowflake, Candy, Gauge, Phone, AlertTriangle, CheckCircle2, XCircle, Info,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type FirstAidKey =
  | "fractures" | "burns" | "nosebleed" | "cpr" | "strokes" | "eye"
  | "bee" | "heatstroke" | "vomiting" | "frostbite" | "diabetes" | "bp";

export const FIRST_AID_TABS: { key: FirstAidKey; label: string; icon: LucideIcon }[] = [
  { key: "fractures", label: "الكسور والالتواءات", icon: Bone },
  { key: "burns", label: "الحروق", icon: Flame },
  { key: "nosebleed", label: "الرعاف", icon: Droplet },
  { key: "cpr", label: "الإنعاش CPR", icon: HeartPulse },
  { key: "strokes", label: "النوبات", icon: Activity },
  { key: "eye", label: "إصابات العين", icon: Eye },
  { key: "bee", label: "لسعات النحل", icon: Bug },
  { key: "heatstroke", label: "ضربة الشمس", icon: Sun },
  { key: "vomiting", label: "الغثيان والقيء", icon: Soup },
  { key: "frostbite", label: "قضمة الصقيع", icon: Snowflake },
  { key: "diabetes", label: "السكر في الدم", icon: Candy },
  { key: "bp", label: "ضغط الدم", icon: Gauge },
];

// ────────────────────────────────────────────────────────────
// Reusable presentational pieces
// ────────────────────────────────────────────────────────────
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h4 className="text-sm font-extrabold text-[#C62828] mt-4 mb-2 flex items-center gap-2">
    <span className="h-1.5 w-1.5 rounded-full bg-[#C62828]" />
    {children}
  </h4>
);

const Steps = ({ items }: { items: string[] }) => (
  <ol className="space-y-2 text-sm leading-relaxed text-foreground">
    {items.map((s, i) => (
      <li key={i} className="flex gap-2">
        <span className="flex-shrink-0 h-6 w-6 rounded-full bg-[#C62828] text-white text-[11px] font-bold flex items-center justify-center">
          {i + 1}
        </span>
        <span className="flex-1 pt-0.5">{s}</span>
      </li>
    ))}
  </ol>
);

const Bullets = ({ items, tone = "default" }: { items: string[]; tone?: "default" | "do" | "dont" }) => {
  const Icon = tone === "dont" ? XCircle : tone === "do" ? CheckCircle2 : Info;
  const color = tone === "dont" ? "text-[#C62828]" : tone === "do" ? "text-emerald-600" : "text-[#1D3557]";
  return (
    <ul className="space-y-1.5 text-sm leading-relaxed text-foreground">
      {items.map((s, i) => (
        <li key={i} className="flex gap-2">
          <Icon className={`h-4 w-4 flex-shrink-0 mt-0.5 ${color}`} />
          <span className="flex-1">{s}</span>
        </li>
      ))}
    </ul>
  );
};

const Warning = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl bg-[#C62828]/10 border border-[#C62828]/30 p-3 flex items-start gap-2 mt-3">
    <AlertTriangle className="h-4 w-4 text-[#C62828] flex-shrink-0 mt-0.5" />
    <div className="text-xs font-bold text-[#C62828] leading-relaxed">{children}</div>
  </div>
);

const InfoBox = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl bg-[#1D3557]/5 border border-[#1D3557]/20 p-3 text-xs text-[#1D3557] leading-relaxed mt-3">
    {children}
  </div>
);

const SimpleTable = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div className="rounded-2xl border border-[#C62828]/20 overflow-hidden mt-3">
    <table className="w-full text-xs" dir="rtl">
      <thead className="bg-[#C62828] text-white">
        <tr>
          {headers.map((h, i) => (
            <th key={i} className="px-2 py-2 text-right font-bold">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, ri) => (
          <tr key={ri} className={ri % 2 ? "bg-[#C62828]/5" : "bg-white"}>
            {r.map((c, ci) => (
              <td key={ci} className="px-2 py-2 text-foreground border-t border-[#C62828]/10">{c}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ────────────────────────────────────────────────────────────
// Intro block
// ────────────────────────────────────────────────────────────
export const FirstAidIntro = memo(() => (
  <div className="space-y-3">
    <div className="rounded-2xl bg-gradient-to-l from-[#C62828] to-[#8B1A1A] text-white p-4 shadow-soft">
      <h3 className="text-base font-extrabold mb-2">أهمية الإسعافات الأولية</h3>
      <p className="text-xs leading-relaxed text-white/95">
        الإسعافات الأولية هي المساعدة الطبية الفورية التي تُقدَّم لمصاب قبل وصول المساعدة الطبية المتخصصة.
      </p>
      <p className="text-xs leading-relaxed text-white/95 mt-2">
        تهدف إلى إنقاذ الحياة، منع تفاقم الإصابة، تخفيف الألم، وتجنب المضاعفات.
      </p>
    </div>

    <div className="rounded-2xl border-r-4 border-[#C62828] bg-[#C62828]/5 p-3">
      <p className="text-sm font-bold text-[#C62828] leading-relaxed">
        "كل دقيقة لها أهميتها"
      </p>
      <p className="text-xs text-foreground mt-1 leading-relaxed">
        السرعة في التدخل هي الفرق بين الحياة والوفاة.
      </p>
    </div>

    {/* Emergency numbers */}
    <div>
      <h4 className="text-sm font-extrabold text-foreground mb-2">أرقام الطوارئ</h4>
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "الإسعاف", num: "123" },
          { label: "الطوارئ", num: "122" },
          { label: "المطافئ", num: "180" },
        ].map((x) => (
          <a
            key={x.num}
            href={`tel:${x.num}`}
            className="rounded-2xl bg-white border-2 border-[#C62828] p-3 flex flex-col items-center gap-1 transition-bounce active:scale-95 hover:bg-[#C62828]/5"
          >
            <Phone className="h-4 w-4 text-[#C62828]" />
            <span className="text-[11px] font-bold text-foreground">{x.label}</span>
            <span className="text-base font-extrabold text-[#C62828] tracking-wider">{x.num}</span>
          </a>
        ))}
      </div>
    </div>
  </div>
));
FirstAidIntro.displayName = "FirstAidIntro";

// ────────────────────────────────────────────────────────────
// Per-category content
// ────────────────────────────────────────────────────────────
const Fractures = () => (
  <div>
    <SectionTitle>أنواع الكسور</SectionTitle>
    <SimpleTable
      headers={["النوع", "الوصف"]}
      rows={[
        ["كسر مغلق", "العظم مكسور دون اختراق الجلد."],
        ["كسر مفتوح", "العظم يخترق الجلد ويظهر للخارج."],
        ["كسر مضاعف", "العظم مكسور لأكثر من قطعتين."],
        ["كسر شعري", "شرخ بسيط في العظم دون انفصال."],
        ["التواء", "تمزّق أو شدّ في الأربطة حول المفصل."],
      ]}
    />
    <SectionTitle>قاعدة R.I.C.E للالتواءات</SectionTitle>
    <SimpleTable
      headers={["الحرف", "المعنى", "التطبيق"]}
      rows={[
        ["R", "Rest — الراحة", "أوقف النشاط فوراً وأرح المفصل."],
        ["I", "Ice — الثلج", "كمادات باردة ١٥-٢٠ دقيقة كل ساعتين."],
        ["C", "Compression — الضغط", "ضمّاد ضاغط دون قطع الدورة الدموية."],
        ["E", "Elevation — الرفع", "ارفع الطرف المصاب فوق مستوى القلب."],
      ]}
    />
    <Warning>
      لا تحاول إعادة العظم إلى مكانه. ثبّت الإصابة كما هي ونقل المصاب إلى أقرب مستشفى.
    </Warning>
  </div>
);

const Burns = () => (
  <div>
    <SectionTitle>درجات الحروق</SectionTitle>
    <SimpleTable
      headers={["الدرجة", "العمق", "الأعراض"]}
      rows={[
        ["الأولى", "البشرة فقط", "احمرار وألم خفيف (مثل حروق الشمس)."],
        ["الثانية", "البشرة + الأدمة", "بثور، ألم شديد، تورّم."],
        ["الثالثة", "كل طبقات الجلد", "جلد متفحّم/أبيض، ضعف الإحساس."],
      ]}
    />
    <SectionTitle>خطوات الإسعاف</SectionTitle>
    <Steps
      items={[
        "أبعد المصاب عن مصدر الحرق فوراً.",
        "اشطف الحرق بماء بارد جارٍ ١٠-٢٠ دقيقة.",
        "أزل الملابس والمجوهرات قبل التورّم (إن لم تلتصق).",
        "غطِّ الحرق بضماد معقم جاف غير لاصق.",
        "اطلب الإسعاف للحروق الواسعة أو من الدرجة الثالثة.",
      ]}
    />
    <Warning>
      لا تستخدم الثلج المباشر، أو الزبدة، أو معجون الأسنان، ولا تفقع البثور.
    </Warning>
  </div>
);

const Nosebleed = () => (
  <div>
    <SectionTitle>خطوات إيقاف النزيف</SectionTitle>
    <Steps
      items={[
        "اجلس المصاب وأمل الرأس قليلاً للأمام (ليس للخلف).",
        "اضغط بقوّة على الجزء الليّن من الأنف ١٠ دقائق متواصلة.",
        "تنفّس من الفم وتجنّب التحدّث.",
        "ضع كمادات باردة على الجبهة وجسر الأنف.",
        "بعد التوقّف، تجنّب نفخ الأنف لعدة ساعات.",
      ]}
    />
    <SectionTitle>متى تتصل بالطوارئ؟</SectionTitle>
    <Bullets
      tone="dont"
      items={[
        "النزيف لا يتوقّف بعد ٢٠ دقيقة من الضغط المستمر.",
        "كان النزيف بعد إصابة قوية أو حادث.",
        "يصاحبه دوار، شحوب، أو صعوبة في التنفّس.",
      ]}
    />
  </div>
);

const CPR = () => (
  <div>
    <SectionTitle>قاعدة ض-م-ن</SectionTitle>
    <SimpleTable
      headers={["الحرف", "المعنى", "الإجراء"]}
      rows={[
        ["ض", "ضغطات الصدر", "٣٠ ضغطة في منتصف الصدر بعمق ٥-٦ سم."],
        ["م", "ممرّ هوائي", "إمالة الرأس للخلف ورفع الذقن."],
        ["ن", "نفس صناعي", "نفسان عميقان فم لفم بعد كل ٣٠ ضغطة."],
      ]}
    />
    <SectionTitle>خطوات الإنعاش القلبي الرئوي</SectionTitle>
    <Steps
      items={[
        "تأكّد من سلامة المكان واتصل بالإسعاف ١٢٣.",
        "افحص الوعي والتنفّس (انظر، استمع، أحسّ).",
        "ضع راحتي اليدين متشابكتين في منتصف الصدر.",
        "اضغط ٣٠ ضغطة بمعدّل ١٠٠-١٢٠ ضغطة/دقيقة.",
        "أعطِ نفسين صناعيين لمدة ثانية لكل نفس.",
        "كرّر الدورة (٣٠:٢) حتى وصول الإسعاف أو استعادة الوعي.",
      ]}
    />
    <InfoBox>
      للأطفال: استخدم يداً واحدة. للرضّع: استخدم إصبعين بعمق ٤ سم تقريباً.
    </InfoBox>
  </div>
);

const Strokes = () => (
  <div>
    <SectionTitle>النوبة القلبية — الأعراض</SectionTitle>
    <Bullets
      items={[
        "ألم ضاغط في وسط الصدر يمتد للذراع الأيسر أو الفك.",
        "ضيق تنفّس، تعرّق بارد، غثيان.",
        "دوار أو شعور بالإغماء.",
      ]}
    />
    <SectionTitle>قاعدة F.A.S.T للسكتة الدماغية</SectionTitle>
    <SimpleTable
      headers={["الحرف", "الفحص", "العلامة"]}
      rows={[
        ["F", "Face — الوجه", "اطلب الابتسامة، هل يتدلّى أحد الجانبين؟"],
        ["A", "Arms — الذراعان", "ارفع الذراعين، هل ينزل أحدهما؟"],
        ["S", "Speech — الكلام", "هل الكلام متلعثم أو غير مفهوم؟"],
        ["T", "Time — الوقت", "اتصل بالإسعاف فوراً وسجّل وقت بدء الأعراض."],
      ]}
    />
    <Warning>
      لا تعطِ المصاب أي طعام أو شراب. أبقِه في وضع مريح حتى وصول الإسعاف.
    </Warning>
  </div>
);

const EyeInjuries = () => (
  <div>
    <SectionTitle>أنواع الإصابات والإسعاف</SectionTitle>
    <SimpleTable
      headers={["الإصابة", "الإجراء"]}
      rows={[
        ["جسم غريب صغير", "اشطف بماء نظيف من الزاوية الداخلية للخارجية."],
        ["مواد كيميائية", "اشطف ١٥-٢٠ دقيقة بماء جارٍ، ثم للطوارئ."],
        ["جسم مخترق", "لا تنزعه! ثبّته بضماد ونقل المصاب فوراً."],
        ["كدمة/ضربة", "كمادة باردة بدون ضغط على العين."],
      ]}
    />
    <Warning>
      لا تفرك العين، ولا تستخدم قطرات بدون استشارة طبيب.
    </Warning>
  </div>
);

const BeeStings = () => (
  <div>
    <SectionTitle>إزالة اللسعة</SectionTitle>
    <Steps
      items={[
        "أزل الإبرة بكشطها بظفر أو بطاقة، لا تستخدم الملقاط.",
        "اغسل المنطقة بماء وصابون.",
        "ضع كمادة باردة لتقليل التورّم.",
        "ارفع الطرف المصاب إن أمكن.",
      ]}
    />
    <SectionTitle>علامات الحساسية المفرطة (Anaphylaxis)</SectionTitle>
    <Bullets
      tone="dont"
      items={[
        "صعوبة تنفّس أو صفير في الصدر.",
        "تورّم الوجه، الشفتين، أو اللسان.",
        "طفح جلدي منتشر أو دوار شديد.",
        "اتصل بالإسعاف فوراً واستخدم حقنة الإبينفرين إن توفّرت.",
      ]}
    />
  </div>
);

const HeatStroke = () => (
  <div>
    <SectionTitle>الأعراض</SectionTitle>
    <Bullets
      items={[
        "ارتفاع حرارة الجسم فوق ٤٠°م.",
        "جلد ساخن وجاف وأحمر.",
        "صداع شديد، تشوّش، أو فقدان وعي.",
        "تسارع النبض والتنفّس.",
      ]}
    />
    <SectionTitle>طرق التبريد</SectionTitle>
    <Steps
      items={[
        "انقل المصاب لمكان بارد ومظلّل.",
        "اخلع الملابس الزائدة.",
        "رشّ الجسم بماء بارد أو ضع كمادات على الرقبة، الإبط، وأعلى الفخذ.",
        "أعطه ماء بارد إن كان واعياً.",
        "اتصل بالإسعاف فوراً.",
      ]}
    />
  </div>
);

const Vomiting = () => (
  <div>
    <SectionTitle>خطوات التعامل</SectionTitle>
    <Steps
      items={[
        "أجلس المصاب أو أمله على جانبه لمنع الشرقة.",
        "ابتعد عن الطعام لمدة ساعة بعد آخر قيء.",
        "ابدأ بسوائل صغيرة الكميات كل ١٥ دقيقة (ماء، محلول معالجة الجفاف).",
        "تدرّج لطعام خفيف (موز، أرز، خبز محمّص).",
        "تجنّب الدهون، الحلويات، والكافيين.",
      ]}
    />
    <Warning>
      راجع الطوارئ إذا استمر القيء أكثر من ٢٤ ساعة، أو ظهر دم، أو علامات جفاف شديد.
    </Warning>
  </div>
);

const Frostbite = () => (
  <div>
    <SectionTitle>التعامل مع قضمة الصقيع</SectionTitle>
    <Steps
      items={[
        "انقل المصاب لمكان دافئ.",
        "أزل الملابس المبللة بلطف.",
        "اغمر المنطقة في ماء دافئ (٣٧-٣٩°م) ٢٠-٣٠ دقيقة.",
        "لا تستخدم حرارة مباشرة (نار، مدفأة).",
        "غطِّ المنطقة بضمادات معقّمة جافة.",
      ]}
    />
    <Warning>
      لا تفرك المنطقة المصابة ولا تكسر البثور. توجّه للطوارئ في الحالات الشديدة.
    </Warning>
  </div>
);

const Diabetes = () => (
  <div>
    <SectionTitle>انخفاض السكر (Hypoglycemia)</SectionTitle>
    <Bullets items={["تعرّق، ارتعاش، جوع شديد، تشوّش، فقدان وعي محتمل."]} />
    <Steps
      items={[
        "إن كان واعياً: أعطه ١٥غ سكر سريع (عصير، عسل، سكر).",
        "انتظر ١٥ دقيقة وأعد القياس.",
        "كرّر إن لم يتحسّن، ثم وجبة كاملة بعد التحسّن.",
        "إن كان فاقد الوعي: لا تطعمه — اتصل بالإسعاف.",
      ]}
    />
    <SectionTitle>ارتفاع السكر (Hyperglycemia)</SectionTitle>
    <Bullets items={["عطش شديد، تبوّل متكرّر، إرهاق، رائحة فم تشبه الأسيتون."]} />
    <Steps
      items={[
        "شجّع شرب الماء.",
        "افحص السكر إن أمكن، ولا تعطِ إنسولين بدون وصفة.",
        "توجّه للطوارئ إذا تجاوز ٣٠٠ مج/دل أو ظهر تنفّس عميق.",
      ]}
    />
  </div>
);

const BloodPressure = () => (
  <div>
    <SectionTitle>التحضير للقياس</SectionTitle>
    <Bullets
      items={[
        "استرح ٥ دقائق على الأقل قبل القياس.",
        "تجنّب الكافيين والتدخين قبل ٣٠ دقيقة.",
        "اجلس على كرسي بظهر مستقيم والقدمان على الأرض.",
        "ضع الذراع على مستوى القلب.",
      ]}
    />
    <SectionTitle>خطوات القياس</SectionTitle>
    <Steps
      items={[
        "اربط السوار حول العضد ٢-٣ سم فوق ثنية المرفق.",
        "ابقَ ساكناً ولا تتحدّث أثناء القياس.",
        "خذ قراءتين بفارق دقيقة وسجّل المتوسّط.",
      ]}
    />
    <SectionTitle>قراءة ضغط الدم (mmHg)</SectionTitle>
    <SimpleTable
      headers={["التصنيف", "الانقباضي", "الانبساطي"]}
      rows={[
        ["طبيعي", "أقل من ١٢٠", "أقل من ٨٠"],
        ["مرتفع قليلاً", "١٢٠-١٢٩", "أقل من ٨٠"],
        ["مرحلة ١", "١٣٠-١٣٩", "٨٠-٨٩"],
        ["مرحلة ٢", "١٤٠ فأكثر", "٩٠ فأكثر"],
        ["نوبة (طوارئ)", "١٨٠ فأكثر", "١٢٠ فأكثر"],
      ]}
    />
    <Warning>
      عند قراءة ١٨٠/١٢٠ فأكثر مع أعراض كألم صدر أو ضيق نفس، اتصل بالإسعاف فوراً.
    </Warning>
  </div>
);

// ────────────────────────────────────────────────────────────
// Switcher
// ────────────────────────────────────────────────────────────
export const FirstAidContent = memo(({ section }: { section: FirstAidKey }) => {
  switch (section) {
    case "fractures": return <Fractures />;
    case "burns": return <Burns />;
    case "nosebleed": return <Nosebleed />;
    case "cpr": return <CPR />;
    case "strokes": return <Strokes />;
    case "eye": return <EyeInjuries />;
    case "bee": return <BeeStings />;
    case "heatstroke": return <HeatStroke />;
    case "vomiting": return <Vomiting />;
    case "frostbite": return <Frostbite />;
    case "diabetes": return <Diabetes />;
    case "bp": return <BloodPressure />;
    default: return null;
  }
});
FirstAidContent.displayName = "FirstAidContent";
