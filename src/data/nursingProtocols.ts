// ============================================================
// Rapid Emergency Protocols (Nursing)
// Curated from AHA ACLS/BLS 2020-2025, Surviving Sepsis Campaign 2021,
// WHO Emergency Care, ADA Standards of Care, AHA/ASA Stroke Guidelines.
// Educational use only — always follow local hospital policy.
// ============================================================

export interface ProtocolStep {
  t: string;              // action text
  time?: string;          // when / target time
  drug?: string;          // drug + dose
  warn?: string;          // critical caution
}

export interface EmergencyProtocol {
  id: string;
  name_ar: string;
  name_en: string;
  emoji: string;
  severity: "critical" | "urgent";
  recognize: string[];    // كيف تتعرف عليها
  goldenTime: string;     // النافذة الذهبية
  steps: ProtocolStep[];
  drugs: { name: string; dose: string; route: string; note?: string }[];
  avoid: string[];
  refs: string[];
}

export const EMERGENCY_PROTOCOLS: EmergencyProtocol[] = [
  {
    id: "cardiac-arrest",
    name_ar: "توقف القلب — Code Blue",
    name_en: "Cardiac Arrest / ACLS",
    emoji: "💔",
    severity: "critical",
    goldenTime: "بدء الإنعاش خلال أقل من ١٠ ثوانٍ من اكتشاف التوقف",
    recognize: ["لا استجابة", "لا تنفس أو لهاث احتضاري (gasping)", "لا نبض سباتي خلال ١٠ ثوانٍ"],
    steps: [
      { t: "نادِ للمساعدة وفعّل Code Blue واطلب عربة الإنعاش والمزيل الرجفان", time: "0 ثانية" },
      { t: "ابدأ ضغطات الصدر: ١٠٠–١٢٠/دقيقة، عمق ٥–٦ سم، ارتداد كامل للصدر", warn: "لا تقاطع الضغطات أكثر من ١٠ ثوانٍ" },
      { t: "تهوية ٣٠:٢ بالقناع الحقيبي، أو ١ نفس كل ٦ ثوانٍ بعد تأمين المجرى الهوائي" },
      { t: "ركّب المزيل وحلّل النظم فور توفره", time: "كل دقيقتين" },
      { t: "نظم قابل للصدمة (VF/pVT): صدمة ثنائية الطور ١٢٠–٢٠٠ J ثم استأنف الضغطات فوراً" },
      { t: "نظم غير قابل للصدمة (Asystole/PEA): استمر بالضغطات + أدرينالين مبكراً" },
      { t: "أدرينالين ١ ملغ IV/IO كل ٣–٥ دقائق", drug: "Epinephrine 1 mg (1:10,000)" },
      { t: "أميودارون ٣٠٠ ملغ بعد الصدمة الثالثة في VF/pVT المقاوم", drug: "Amiodarone 300 mg IV bolus" },
      { t: "ابحث عن الأسباب القابلة للعكس 5H & 5T", tip: undefined as never, warn: "نقص أكسجة/حجم، K، حرارة، حماض — انسداد تاجي/رئوي، اندحاس، استرواح ضاغط، سموم" },
      { t: "بعد عودة الدورة (ROSC): SpO₂ 92–98%، ضغط انقباضي ≥ ٩٠، ECG 12-lead، تبريد مستهدف" },
    ],
    drugs: [
      { name: "Epinephrine", dose: "1 mg", route: "IV/IO كل 3–5 د" },
      { name: "Amiodarone", dose: "300 mg ثم 150 mg", route: "IV bolus" },
      { name: "Lidocaine (بديل)", dose: "1–1.5 mg/kg", route: "IV" },
      { name: "Sodium Bicarbonate", dose: "1 mEq/kg", route: "IV — فقط لحالات محددة" },
    ],
    avoid: ["تأخير الضغطات لتركيب الوريد", "التهوية المفرطة", "رفع اليدين عن الصدر بين الضغطات"],
    refs: ["AHA ACLS Guidelines 2020 (update 2025)", "ERC Resuscitation Guidelines 2021"],
  },
  {
    id: "anaphylaxis",
    name_ar: "التأق (الحساسية المفرطة)",
    name_en: "Anaphylaxis",
    emoji: "🐝",
    severity: "critical",
    goldenTime: "الأدرينالين العضلي خلال أول ٥ دقائق يقلل الوفيات بشكل حاسم",
    recognize: ["بدء مفاجئ بعد التعرض لمُحسِّس", "شرى/وذمة وعائية + ضيق تنفس أو صفير", "هبوط ضغط أو دوخة أو إغماء", "تقيؤ ومغص بطني"],
    steps: [
      { t: "أوقف مصدر التحسس فوراً (أوقف التسريب/اللدغة)" },
      { t: "أدرينالين ٠٫٥ ملغ عضلي في الفخذ الوحشي (vastus lateralis)", drug: "Epinephrine 1:1000, 0.01 mg/kg (max 0.5 mg)", warn: "لا تعطِه تحت الجلد ولا تؤخره بانتظار الأدوية الأخرى" },
      { t: "استلقاء مع رفع الساقين — لا تُجلس المريض فجأة", warn: "الجلوس/الوقوف قد يسبب توقف قلبي (empty ventricle)" },
      { t: "أكسجين عالي التدفق ١٠–١٥ ل/د بقناع مع خزان" },
      { t: "مدخلان وريديان كبيران + سوائل بلورية ٢٠ مل/كغ سريعاً" },
      { t: "كرر الأدرينالين كل ٥–١٥ دقيقة إذا لم يتحسن" },
      { t: "أدوية مساندة: مضاد هيستامين + كورتيزون (ليست بديلاً عن الأدرينالين)" },
      { t: "راقب ٦–١٢ ساعة لخطر التفاعل ثنائي الطور (biphasic)" },
    ],
    drugs: [
      { name: "Epinephrine IM", dose: "0.5 mg بالغ / 0.15–0.3 mg طفل", route: "IM فخذ" },
      { name: "Hydrocortisone", dose: "200 mg", route: "IV" },
      { name: "Chlorphenamine", dose: "10 mg", route: "IV بطيء" },
      { name: "Salbutamol neb", dose: "5 mg", route: "استنشاق للصفير" },
    ],
    avoid: ["تأخير الأدرينالين", "الاعتماد على مضادات الهيستامين وحدها", "إجلاس المريض"],
    refs: ["WAO Anaphylaxis Guidance 2020", "Resuscitation Council UK 2021"],
  },
  {
    id: "sepsis",
    name_ar: "الإنتان والصدمة الإنتانية",
    name_en: "Sepsis / Septic Shock",
    emoji: "🦠",
    severity: "critical",
    goldenTime: "حزمة الساعة الأولى (Hour-1 Bundle)",
    recognize: ["عدوى مشتبهة + qSOFA ≥ ٢ (تنفس ≥٢٢، تغير وعي، SBP ≤١٠٠)", "حرارة >38 أو <36", "لاكتات > 2 mmol/L", "قلة إدرار < 0.5 مل/كغ/سا"],
    steps: [
      { t: "قِس اللاكتات فوراً وأعد القياس خلال ٢–٤ ساعات إذا كان > 2", time: "ساعة 1" },
      { t: "اسحب زرعين دمويين قبل المضاد الحيوي (لا تؤخر المضاد > ٤٥ دقيقة)" },
      { t: "أعطِ مضاداً حيوياً واسع الطيف خلال أول ساعة", warn: "كل ساعة تأخير ترفع الوفيات ~٧٪" },
      { t: "سوائل بلورية ٣٠ مل/كغ خلال ٣ ساعات لهبوط الضغط أو اللاكتات ≥ 4" },
      { t: "رافعات ضغط للحفاظ على MAP ≥ 65 mmHg إذا لم تكفِ السوائل", drug: "Norepinephrine أول خيار" },
      { t: "راقب الإدرار بالساعة، الوعي، تروية الأطراف، SpO₂" },
      { t: "ابحث عن مصدر العدوى واضبطه (خراج/قسطرة/جرح)" },
    ],
    drugs: [
      { name: "Norepinephrine", dose: "0.05–0.3 mcg/kg/min", route: "IV مركزي مفضل" },
      { name: "Crystalloid", dose: "30 ml/kg", route: "IV bolus" },
      { name: "Hydrocortisone", dose: "200 mg/يوم", route: "IV في الصدمة المقاومة" },
    ],
    avoid: ["تأخير المضاد الحيوي", "الإفراط بالسوائل بعد الاستجابة", "إهمال إعادة تقييم التروية"],
    refs: ["Surviving Sepsis Campaign 2021", "WHO Sepsis Technical Guidance"],
  },
  {
    id: "stroke",
    name_ar: "السكتة الدماغية",
    name_en: "Acute Stroke",
    emoji: "🧠",
    severity: "critical",
    goldenTime: "Door-to-CT ≤ ٢٥ دقيقة · Door-to-needle ≤ ٦٠ دقيقة · نافذة الإذابة ٤٫٥ ساعة",
    recognize: ["BE-FAST: توازن، إبصار، وجه، ذراع، كلام، وقت", "خزل نصفي مفاجئ", "تلعثم أو حبسة", "صداع رعدي (نزفي محتمل)"],
    steps: [
      { t: "سجّل الوقت الدقيق لآخر مرة كان فيها المريض طبيعياً (Last Known Well)", warn: "هو الذي يحدد الأهلية للإذابة" },
      { t: "ABC + أكسجين إذا SpO₂ < 94% فقط" },
      { t: "قياس سكر الدم فوراً — نقص السكر يقلد السكتة" },
      { t: "CT دماغ بدون صبغة عاجل لاستبعاد النزف" },
      { t: "لا شيء بالفم حتى تقييم البلع (dysphagia screen)" },
      { t: "لا تخفض الضغط إلا إذا > 220/120 (أو > 185/110 قبل الإذابة)", warn: "الخفض السريع يوسّع منطقة الاحتشاء" },
      { t: "NIHSS + تنبيه فريق السكتة + تحضير للإذابة/القثطرة" },
    ],
    drugs: [
      { name: "Alteplase (rtPA)", dose: "0.9 mg/kg (max 90 mg)", route: "IV — 10% bolus ثم الباقي بساعة" },
      { name: "Labetalol", dose: "10–20 mg", route: "IV لضبط الضغط قبل الإذابة" },
    ],
    avoid: ["إعطاء أسبرين قبل استبعاد النزف", "إعطاء سوائل سكرية", "تأخير التصوير"],
    refs: ["AHA/ASA Stroke Guidelines 2019/2023", "WHO Stroke Care"],
  },
  {
    id: "acs",
    name_ar: "المتلازمة التاجية الحادة / النوبة القلبية",
    name_en: "Acute Coronary Syndrome",
    emoji: "❤️‍🔥",
    severity: "critical",
    goldenTime: "ECG خلال ١٠ دقائق · Door-to-balloon ≤ ٩٠ دقيقة",
    recognize: ["ألم صدري ضاغط > ٢٠ دقيقة", "انتشار للفك/الذراع اليسرى", "تعرق بارد وغثيان", "عرض غير نمطي عند النساء والسكريين (ضيق نفس/تعب)"],
    steps: [
      { t: "ECG بـ ١٢ اتجاهاً خلال ١٠ دقائق من الوصول", time: "≤ 10 د" },
      { t: "أكسجين فقط إذا SpO₂ < 90%" },
      { t: "MONA معدّلة: أسبرين ٣٠٠ ملغ مضغاً + نيتروجليسرين تحت اللسان", warn: "امنع النترات مع سيلدينافيل أو احتشاء البطين الأيمن" },
      { t: "مدخل وريدي + مراقبة قلبية مستمرة + مزيل رجفان قريب" },
      { t: "سحب Troponin + وظائف كلى + تخثر" },
      { t: "STEMI → تفعيل مختبر القثطرة فوراً؛ إن تعذر خلال ١٢٠ دقيقة → إذابة" },
      { t: "مسكن للألم بالمورفين إذا استمر الألم رغم النترات" },
    ],
    drugs: [
      { name: "Aspirin", dose: "300 mg مضغاً", route: "PO" },
      { name: "Clopidogrel/Ticagrelor", dose: "300–600 mg / 180 mg", route: "PO" },
      { name: "GTN", dose: "0.4 mg", route: "SL كل 5 د × 3" },
      { name: "Morphine", dose: "2–4 mg", route: "IV بطيء" },
    ],
    avoid: ["أكسجين روتيني مع تشبع طبيعي", "النترات في احتشاء البطين الأيمن", "تأخير ECG"],
    refs: ["ESC ACS Guidelines 2023", "AHA/ACC STEMI Guideline"],
  },
  {
    id: "hypoglycemia",
    name_ar: "هبوط سكر الدم الحاد",
    name_en: "Severe Hypoglycemia",
    emoji: "🍬",
    severity: "urgent",
    goldenTime: "التصحيح خلال دقائق — الدماغ لا يتحمل > ٣٠ دقيقة",
    recognize: ["سكر < 70 mg/dL (< 3.9 mmol/L)", "تعرق، رجفة، جوع، خفقان", "تخليط، سلوك غريب، تشنج، غيبوبة"],
    steps: [
      { t: "قِس السكر الشعري فوراً — لا تعتمد على الأعراض وحدها" },
      { t: "واعٍ ويبلع: ١٥ غ كربوهيدرات سريعة ثم أعد القياس بعد ١٥ دقيقة (قاعدة 15/15)" },
      { t: "غير واعٍ + وريد متاح: ٢٥–٥٠ مل Dextrose 50% IV", drug: "D50W 25–50 ml" },
      { t: "غير واعٍ بلا وريد: Glucagon 1 mg IM/SC", warn: "قد لا يعمل في نقص مخزون الكبد/الكحوليين" },
      { t: "بعد الاستقرار أعطِ وجبة نشوية+بروتين لمنع الانتكاس" },
      { t: "ابحث عن السبب: جرعة إنسولين، تخطي وجبة، فشل كلوي، إنتان" },
    ],
    drugs: [
      { name: "Dextrose 50%", dose: "25–50 ml", route: "IV وريد كبير" },
      { name: "Dextrose 10%", dose: "100–200 ml", route: "IV للأطفال/الوريد الصغير" },
      { name: "Glucagon", dose: "1 mg (0.5 mg < 25 kg)", route: "IM/SC" },
    ],
    avoid: ["إعطاء سوائل فموية لمريض غير واعٍ", "استخدام D50% في وريد طرفي صغير", "إهمال إعادة القياس"],
    refs: ["ADA Standards of Care 2025", "Joint British Diabetes Societies"],
  },
  {
    id: "dka",
    name_ar: "الحماض الكيتوني السكري",
    name_en: "Diabetic Ketoacidosis",
    emoji: "🧪",
    severity: "critical",
    goldenTime: "السوائل أولاً — الإنسولين بعد التأكد من البوتاسيوم",
    recognize: ["سكر > 250 mg/dL", "pH < 7.3 و بيكربونات < 18", "كيتونات دم/بول إيجابية", "تنفس كوسماول ورائحة أسيتون وجفاف"],
    steps: [
      { t: "NS 0.9% ١٠–١٥ مل/كغ/ساعة في أول ساعة (١–١٫٥ لتر بالغ)" },
      { t: "قِس البوتاسيوم قبل الإنسولين", warn: "إذا K < 3.3 أجّل الإنسولين وعوّض البوتاسيوم أولاً" },
      { t: "تسريب إنسولين عادي ٠٫١ وحدة/كغ/ساعة", drug: "Regular insulin infusion" },
      { t: "أضف Dextrose 5% عندما يصل السكر إلى ٢٠٠–٢٥٠ واستمر بالإنسولين" },
      { t: "راقب السكر كل ساعة والكهارل و ABG كل ٢–٤ ساعات" },
      { t: "ابحث عن المحرّض: عدوى، تخطي إنسولين، احتشاء" },
      { t: "لا توقف التسريب إلا بعد إغلاق الفجوة الأيونية وتداخل الإنسولين تحت الجلد بـ ١–٢ ساعة" },
    ],
    drugs: [
      { name: "Normal Saline 0.9%", dose: "10–15 ml/kg/hr", route: "IV" },
      { name: "Regular Insulin", dose: "0.1 U/kg/hr", route: "IV infusion" },
      { name: "KCl", dose: "20–40 mEq/L", route: "IV إذا K < 5.3" },
    ],
    avoid: ["تصحيح السكر بسرعة > 100 mg/dL/hr", "بيكربونات روتينية", "بدء الإنسولين قبل معرفة K"],
    refs: ["ADA/ISPAD DKA Guidelines", "JBDS-IP DKA Care Pathway"],
  },
  {
    id: "resp-distress",
    name_ar: "الضائقة التنفسية الحادة",
    name_en: "Acute Respiratory Distress",
    emoji: "🫁",
    severity: "critical",
    goldenTime: "تقييم ABC وتأمين الأكسجة خلال دقائق",
    recognize: ["RR > 30 أو < 8", "SpO₂ < 90% رغم الأكسجين", "استخدام العضلات المساعدة وتنفس متناقض", "جمل مقطّعة، تخليط، زُرقة"],
    steps: [
      { t: "أجلس المريض ٤٥–٩٠ درجة وافتح المجرى الهوائي" },
      { t: "أكسجين معايَر: هدف 94–98% (88–92% في COPD)" },
      { t: "راقب: SpO₂، RR، ECG، ضغط + جهّز الشفط" },
      { t: "حدد السبب: صفير→ربو/COPD | خراخر→وذمة رئة | صمت→استرواح/انصباب | صرير→انسداد علوي" },
      { t: "بخّاخات موسعة قصبية للصفير", drug: "Salbutamol 5 mg + Ipratropium 0.5 mg neb" },
      { t: "وذمة رئة: نترات + فوروسيميد + CPAP/NIV" },
      { t: "فشل رغم كل ذلك → نادِ فريق المجرى الهوائي للتنبيب" },
    ],
    drugs: [
      { name: "Salbutamol neb", dose: "5 mg", route: "استنشاق كل 20 د" },
      { name: "Hydrocortisone", dose: "200 mg", route: "IV" },
      { name: "Furosemide", dose: "40–80 mg", route: "IV لوذمة الرئة" },
      { name: "Magnesium sulfate", dose: "2 g خلال 20 د", route: "IV للربو الشديد" },
    ],
    avoid: ["أكسجين عالي غير معاير في COPD", "الاستلقاء المسطح", "المهدئات"],
    refs: ["GINA 2025", "GOLD 2025", "WHO Emergency Triage"],
  },
  {
    id: "transfusion-reaction",
    name_ar: "تفاعل نقل الدم",
    name_en: "Blood Transfusion Reaction",
    emoji: "🩸",
    severity: "critical",
    goldenTime: "أول ١٥ دقيقة من النقل هي الأخطر — لا تترك المريض",
    recognize: ["حمى ورعشة", "ألم قطني أو صدري", "هبوط ضغط وتسرع قلب", "بول داكن/دموي", "شرى وحكة"],
    steps: [
      { t: "أوقف النقل فوراً وأبقِ الوريد مفتوحاً بمحلول ملحي بخط جديد", warn: "لا تغسل الخط القديم داخل المريض" },
      { t: "قِس العلامات الحيوية وتحقق من هوية المريض ووحدة الدم" },
      { t: "أبلغ الطبيب وبنك الدم فوراً وأعد الكيس والخط للمختبر" },
      { t: "اسحب عينات: زمرة وتوافق، CBC، وظائف كلى، LDH، بيليروبين، عينة بول" },
      { t: "حافظ على الإدرار > 1 مل/كغ/سا بالسوائل ± فوروسيميد" },
      { t: "تفاعل تحسسي بسيط: مضاد هيستامين وقد يُستأنف بحذر بأمر طبيب" },
      { t: "تفاعل انحلالي/TRALI/TACO: دعم كامل ونقل للعناية" },
    ],
    drugs: [
      { name: "Normal Saline", dose: "حسب الحاجة", route: "IV خط جديد" },
      { name: "Chlorphenamine", dose: "10 mg", route: "IV" },
      { name: "Hydrocortisone", dose: "100–200 mg", route: "IV" },
      { name: "Furosemide", dose: "20–40 mg", route: "IV لـ TACO" },
    ],
    avoid: ["إكمال النقل «لنرى ما سيحدث»", "التخلص من الكيس", "إهمال توثيق الوقت والأعراض"],
    refs: ["AABB Standards", "WHO Blood Transfusion Safety"],
  },
  {
    id: "status-epilepticus",
    name_ar: "الحالة الصرعية المستمرة",
    name_en: "Status Epilepticus",
    emoji: "⚡",
    severity: "critical",
    goldenTime: "نوبة > ٥ دقائق = حالة صرعية → تدخل دوائي فوري",
    recognize: ["تشنج مستمر > ٥ دقائق", "نوبات متكررة بلا استعادة وعي بينها", "زُرقة وإفرازات فموية"],
    steps: [
      { t: "احمِ الرأس، أزل الأشياء الخطرة، وضعية جانبية، لا تُدخل شيئاً في الفم" },
      { t: "أكسجين + شفط الإفرازات + مراقبة SpO₂" },
      { t: "قِس السكر فوراً — عالج نقص السكر إن وُجد" },
      { t: "بنزوديازيبين خط أول", drug: "Lorazepam 4 mg IV أو Midazolam 10 mg IM/بخاخ أنفي", time: "5–10 د" },
      { t: "كرر الجرعة مرة واحدة بعد ٥–١٠ دقائق إذا استمرت النوبة", warn: "راقب تثبيط التنفس" },
      { t: "خط ثانٍ إذا استمرت: Levetiracetam / Valproate / Phenytoin", time: "20–40 د" },
      { t: "استمرار > ٤٠ دقيقة → تخدير عام وعناية مركزة" },
    ],
    drugs: [
      { name: "Lorazepam", dose: "0.1 mg/kg (max 4 mg)", route: "IV" },
      { name: "Midazolam", dose: "10 mg", route: "IM / أنفي / فموي" },
      { name: "Levetiracetam", dose: "60 mg/kg (max 4.5 g)", route: "IV" },
      { name: "Phenytoin", dose: "20 mg/kg", route: "IV بطيء مع مراقبة قلبية" },
    ],
    avoid: ["تقييد المريض بالقوة", "وضع شيء بين الأسنان", "تأخير البنزوديازيبين"],
    refs: ["NICE Epilepsy Guideline 2022", "AES Status Epilepticus Guideline"],
  },
  {
    id: "shock",
    name_ar: "الصدمة الدورانية (تمييز الأنواع)",
    name_en: "Shock — Type Differentiation",
    emoji: "📉",
    severity: "critical",
    goldenTime: "تحديد النوع خلال أول ١٥ دقيقة يغيّر العلاج كلياً",
    recognize: ["SBP < 90 أو انخفاض 40 عن الأساس", "تسرع قلب، أطراف باردة/دافئة", "زمن امتلاء شعري > ٣ ثوانٍ", "قلة إدرار وتغير وعي، لاكتات مرتفعة"],
    steps: [
      { t: "نقص حجم: أطراف باردة + أوردة عنق مسطحة → سوائل ودم" },
      { t: "قلبية: أوردة عنق منتفخة + خراخر رئوية → دعم تقلصي، حذر من السوائل" },
      { t: "توزيعية (إنتان/تأق/عصبية): أطراف دافئة + مقاومة منخفضة → سوائل + رافع ضغط" },
      { t: "انسدادية: استرواح ضاغط/اندحاس/صمة رئوية → تخفيف الضغط فوراً" },
      { t: "في كل الأنواع: أكسجين، مدخلان كبيران، مراقبة، إدرار بالساعة، لاكتات" },
      { t: "هدف MAP ≥ 65 mmHg ما لم يُحدد غير ذلك" },
    ],
    drugs: [
      { name: "Crystalloid", dose: "250–500 ml bolus", route: "IV مع إعادة تقييم" },
      { name: "Norepinephrine", dose: "0.05–0.5 mcg/kg/min", route: "IV" },
      { name: "Dobutamine", dose: "2–20 mcg/kg/min", route: "IV للصدمة القلبية" },
    ],
    avoid: ["سوائل غزيرة في الصدمة القلبية", "الاعتماد على الضغط وحده كمؤشر تروية"],
    refs: ["ATLS 10e", "Surviving Sepsis Campaign 2021"],
  },
  {
    id: "poisoning",
    name_ar: "التسمم الدوائي الحاد",
    name_en: "Acute Poisoning / Overdose",
    emoji: "☠️",
    severity: "urgent",
    goldenTime: "الفحم المنشّط مفيد خلال أول ساعة غالباً",
    recognize: ["تغير وعي غير مفسر", "حدقات دبوسية (أفيونات) أو متسعة (مضادات كولين)", "علب دواء فارغة/قصة تناول", "اضطراب نظم أو تنفس"],
    steps: [
      { t: "ABC أولاً — المريض قبل السمّ" },
      { t: "سكر الدم + ECG + حرارة + قصة الدواء والكمية والوقت" },
      { t: "أفيونات (تنفس بطيء + حدقة دبوسية): Naloxone", drug: "Naloxone 0.4–2 mg IV/IM" },
      { t: "باراسيتامول: قِس المستوى بعد ٤ ساعات وابدأ NAC حسب المخطط", drug: "N-Acetylcysteine IV" },
      { t: "بنزوديازيبين: دعم تنفسي — الفلومازينيل بحذر شديد", warn: "قد يُحدث تشنجاً في الاعتماد المزمن" },
      { t: "فحم منشّط ١ غ/كغ إذا كان المريض واعياً وخلال ساعة", warn: "ممنوع مع الكاويات والهيدروكربونات وضعف الوعي" },
      { t: "تواصل مع مركز السموم واحتفظ بالعبوات" },
    ],
    drugs: [
      { name: "Naloxone", dose: "0.4–2 mg قابل للتكرار", route: "IV/IM/أنفي" },
      { name: "N-Acetylcysteine", dose: "بروتوكول 21 ساعة", route: "IV" },
      { name: "Activated Charcoal", dose: "1 g/kg", route: "PO/NGT" },
      { name: "Sodium Bicarbonate", dose: "1–2 mEq/kg", route: "IV لتسمم TCA" },
    ],
    avoid: ["تحريض القيء", "غسيل معدة روتيني", "إهمال حماية المجرى الهوائي"],
    refs: ["WHO Clinical Toxicology", "AACT/EAPCCT Position Statements"],
  },
];

// ============================================================
// Learning Path — مسار تعلّم التمريض المتدرّج
// ============================================================
export interface LearningStage {
  id: string;
  level: "beginner" | "intermediate" | "advanced";
  title: string;
  subtitle: string;
  emoji: string;
  duration: string;
  objectives: string[];
  resources: string[];
}

export const LEARNING_PATH: LearningStage[] = [
  {
    id: "s1",
    level: "beginner",
    title: "الأساسيات والسلامة",
    subtitle: "Foundations & Patient Safety",
    emoji: "🧱",
    duration: "٤ أسابيع",
    objectives: [
      "غسل اليدين والاحتياطات القياسية ومكافحة العدوى",
      "قياس العلامات الحيوية بدقة وتفسير الشاذ منها",
      "التواصل العلاجي وحقوق المريض والسرية",
      "قواعد السلامة الدوائية: الحقوق العشرة لإعطاء الدواء",
    ],
    resources: ["تبويب «علامات حيوية» و«اختصارات» في المرجع", "WHO Hand Hygiene Guidelines"],
  },
  {
    id: "s2",
    level: "beginner",
    title: "التقييم التمريضي الشامل",
    subtitle: "Head-to-Toe Assessment",
    emoji: "🩺",
    duration: "٤ أسابيع",
    objectives: [
      "التقييم من الرأس للقدم بشكل منهجي",
      "تقييم الألم والوعي (GCS) وخطر التقرحات (Braden)",
      "توثيق دقيق بصيغة SOAP / DAR",
      "التعرف على علامات التدهور المبكر",
    ],
    resources: ["حاسبات GCS و Braden", "تبويب NANDA للتشخيص التمريضي"],
  },
  {
    id: "s3",
    level: "intermediate",
    title: "المهارات الإكلينيكية",
    subtitle: "Core Clinical Procedures",
    emoji: "💉",
    duration: "٦ أسابيع",
    objectives: [
      "القسطرة الوريدية وسحب العينات",
      "أنبوب أنفي معدي وقسطرة بولية بتقنية عقيمة",
      "الشفط والأكسجة والعناية بالفغرة الرغامية",
      "العناية بالجروح والضمادات",
    ],
    resources: ["تبويب «إجراءات» (SOPs) داخل المرجع"],
  },
  {
    id: "s4",
    level: "intermediate",
    title: "الحسابات الدوائية",
    subtitle: "Medication Math",
    emoji: "🧮",
    duration: "٣ أسابيع",
    objectives: [
      "حساب الجرعة حسب الوزن ومساحة الجسم",
      "معدل التنقيط وقطرات الدقيقة والمضخات",
      "التخفيفات والتحويلات بين الوحدات",
      "جرعات الأطفال وحدود السلامة",
    ],
    resources: ["تبويب «حاسبات» — Peds Dose, Drip Rate, BSA"],
  },
  {
    id: "s5",
    level: "advanced",
    title: "الطوارئ والحالات الحرجة",
    subtitle: "Emergency & Critical Care",
    emoji: "🚨",
    duration: "٦ أسابيع",
    objectives: [
      "BLS/ACLS وإدارة Code Blue",
      "التعرف المبكر على الإنتان والصدمة",
      "قراءة ECG الأساسية والنظم الخطرة",
      "بروتوكولات التأق والسكتة والحماض الكيتوني",
    ],
    resources: ["تبويب «بروتوكولات» في المرجع", "قسم الإسعافات الأولية داخل التطبيق"],
  },
  {
    id: "s6",
    level: "advanced",
    title: "التخصص والتطوير المهني",
    subtitle: "Specialization & Growth",
    emoji: "🎓",
    duration: "مستمر",
    objectives: [
      "اختيار تخصص من الـ ٥٠ تخصصاً المتاحة",
      "اجتياز اختبار التخصص والحصول على الشهادة",
      "التمريض المبني على الدليل (EBP) وقراءة الأبحاث",
      "القيادة التمريضية وإدارة الفريق",
    ],
    resources: ["وضع «تمريض عام» → التخصصات + الاختبارات والشهادات"],
  },
];
