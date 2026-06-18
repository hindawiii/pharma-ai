// Static MCQ banks per nursing specialty. Phase 3 — offline content.
// Specialties not listed here use a generic fallback bank.

export interface QuizQuestion {
  q: string;
  options: string[];
  correct: number; // index 0..n-1
  explain?: string;
}

const GENERIC: QuizQuestion[] = [
  {
    q: "أول خطوة في تقييم أي مريض حسب بروتوكول ABCDE؟",
    options: ["التنفس Breathing", "مجرى الهواء Airway", "الدورة الدموية Circulation", "الوعي Disability"],
    correct: 1,
    explain: "Airway أولاً — لا فائدة من باقي الخطوات بدون مجرى هواء مفتوح.",
  },
  {
    q: "المعدل الطبيعي للنبض عند البالغ في الراحة؟",
    options: ["40–60", "60–100", "100–140", "20–40"],
    correct: 1,
  },
  {
    q: "أهم خطوة لمنع انتقال العدوى في المستشفى؟",
    options: ["تعقيم الأرضيات", "غسل اليدين", "تغيير الملاءات", "ارتداء الحذاء"],
    correct: 1,
    explain: "غسل اليدين هو الإجراء الأول الذي أوصت به WHO لمكافحة العدوى.",
  },
  {
    q: "علامة خطر تستوجب استدعاء الطبيب فوراً؟",
    options: ["درجة حرارة 37°", "ضغط 120/80", "تشبع أكسجين 88%", "نبض 75"],
    correct: 2,
    explain: "SpO₂ أقل من 92% يستوجب تدخلاً عاجلاً.",
  },
  {
    q: "أفضل وضعية لمريض ضيق التنفس؟",
    options: ["Supine", "Prone", "Semi-Fowler / Fowler", "Trendelenburg"],
    correct: 2,
  },
];

const CUSTOM: Record<number, QuizQuestion[]> = {
  6: [
    {
      q: "في حالة سكتة قلبية، أول إجراء بعد التأكد من الوعي والتنفس؟",
      options: ["إعطاء أدرينالين", "بدء ضغطات صدر 30:2", "توصيل ECG", "نقل المريض"],
      correct: 1,
    },
    {
      q: "عمق ضغطات الصدر للبالغ في CPR؟",
      options: ["2–3 سم", "5–6 سم", "8–10 سم", "1 سم"],
      correct: 1,
    },
    {
      q: "ترتيب فرز الإصابات Triage الأحمر يعني؟",
      options: ["إصابة بسيطة", "حالة حرجة فورية", "متوفى", "تأخير العلاج"],
      correct: 1,
    },
    {
      q: "في إصابة حادث سيارة، تثبيت الرقبة بـ؟",
      options: ["Cervical Collar", "وسادة", "حزام", "لا شيء"],
      correct: 0,
    },
    {
      q: "أول علامة لـ Shock؟",
      options: ["ارتفاع الضغط", "بطء النبض", "تسارع النبض وبرودة الأطراف", "احمرار الجلد"],
      correct: 2,
    },
  ],
  7: [
    {
      q: "ما هو الـ ARDS؟",
      options: ["فشل تنفسي حاد", "نوبة ربو", "التهاب رئوي بسيط", "انسداد رئوي مزمن"],
      correct: 0,
    },
    {
      q: "VAP يعني؟",
      options: ["Ventilator-Associated Pneumonia", "Ventricular Atrial Pulse", "Vital Airway Pressure", "Venous Access Port"],
      correct: 0,
    },
    {
      q: "للوقاية من VAP، رأس السرير يرفع؟",
      options: ["مسطح", "15°", "30–45°", "90°"],
      correct: 2,
    },
    {
      q: "GCS أدنى درجة؟",
      options: ["0", "3", "5", "8"],
      correct: 1,
    },
    {
      q: "السكر الطبيعي عند مريض ICU صائم؟",
      options: ["40–60", "70–110", "140–180", "200–250"],
      correct: 1,
    },
  ],
  13: [
    {
      q: "أعراض هبوط السكر Hypoglycemia؟",
      options: ["عطش وكثرة تبول", "تعرق ورجفة وجوع", "صداع وارتفاع ضغط", "احمرار الجلد"],
      correct: 1,
    },
    {
      q: "علاج هبوط السكر الواعي؟",
      options: ["أنسولين", "15 جم سكر سريع (عصير/سكر)", "ماء فقط", "صيام"],
      correct: 1,
    },
    {
      q: "HbA1c الهدف لمرضى السكر؟",
      options: ["< 5%", "< 7%", "< 10%", "< 15%"],
      correct: 1,
    },
    {
      q: "أين تُحقن الأنسولين عادةً؟",
      options: ["العضل", "الوريد", "الدهون تحت الجلد", "تحت اللسان"],
      correct: 2,
    },
    {
      q: "DKA تتميز بـ؟",
      options: ["انخفاض سكر وحموضة طبيعية", "ارتفاع سكر وحموضة دم", "ضغط مرتفع فقط", "حرارة عالية فقط"],
      correct: 1,
    },
  ],
  46: [
    {
      q: "قرحة فراش Stage II تعني؟",
      options: ["احمرار سطحي بدون تقرح", "فقدان جزء من الجلد — قرحة سطحية", "وصول للعضل", "وصول للعظم"],
      correct: 1,
    },
    {
      q: "أفضل ضماد لقرحة جافة سطحية؟",
      options: ["Gauze جاف", "Hydrocolloid", "Iodine قوي", "ضغط مباشر"],
      correct: 1,
    },
    {
      q: "كم مرة يجب تقليب مريض طريح الفراش؟",
      options: ["كل 12 ساعة", "كل 6 ساعات", "كل ساعتين", "مرة يومياً"],
      correct: 2,
    },
    {
      q: "علامة عدوى في الجرح؟",
      options: ["جلد بارد جاف", "احمرار + سخونة + إفرازات صفراء/خضراء", "لون وردي طبيعي", "حكة خفيفة"],
      correct: 1,
    },
    {
      q: "Stoma صحي يكون لونه؟",
      options: ["وردي/أحمر رطب", "أسود", "أبيض شاحب", "أزرق"],
      correct: 0,
    },
  ],
};

export const getQuiz = (specialtyId: number): QuizQuestion[] =>
  CUSTOM[specialtyId] ?? GENERIC;

export const PASS_SCORE = 0.7; // 70% للحصول على الشهادة
