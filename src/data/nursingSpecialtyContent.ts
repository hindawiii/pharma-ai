// Brief Arabic-first content per specialty. Static, offline. Phase 2 teaser.
// Full curricula + MCQs arrive in Phase 3.

export interface SpecialtyContent {
  overview: string;
  skills: string[];
  tools: string[];
  refs: string[];
}

const DEFAULT: SpecialtyContent = {
  overview:
    "تخصص تمريضي معتمد عالمياً يقدّم رعاية متخصصة وفق أحدث البروتوكولات الدولية (WHO · ANA · ICN).",
  skills: [
    "تقييم الحالة الأولي وعلامات الحياة",
    "تطبيق خطة الرعاية التمريضية (NCP)",
    "التوثيق الطبي والمتابعة",
    "التواصل العلاجي مع المريض والأسرة",
    "الالتزام بمعايير السلامة ومكافحة العدوى",
  ],
  tools: ["الموبايل وأجهزة التوثيق", "أدوات القياس الأساسية", "بروتوكولات القسم المعتمدة"],
  refs: ["WHO Patient Safety", "ANA Scope & Standards", "Lippincott Nursing Procedures"],
};

// Curated content for the most commonly searched specialties.
// Anything not listed falls back to DEFAULT.
const CUSTOM: Record<number, Partial<SpecialtyContent>> = {
  6: {
    overview: "تمريض الطوارئ: تقييم وفرز سريع (Triage) وإنقاذ الحياة خلال الدقائق الذهبية.",
    skills: [
      "بروتوكول ABCDE للتقييم السريع",
      "إنعاش قلبي رئوي متقدم (ACLS)",
      "إيقاف النزيف وتثبيت الكسور",
      "إعطاء الأدوية الطارئة بدقة",
      "تنسيق فرق الإسعاف",
    ],
    tools: ["دفايبريلاتور AED", "حقيبة الإنعاش", "جهاز مراقبة العلامات الحيوية"],
  },
  7: {
    overview: "العناية المركزة (ICU): متابعة لحظية للحالات الحرجة وأجهزة دعم الحياة.",
    skills: [
      "إدارة أجهزة التنفس الصناعي",
      "متابعة الـ Hemodynamics و ABG",
      "العناية بالخطوط المركزية",
      "الوقاية من VAP و CLABSI",
      "تقييم الوعي بـ GCS",
    ],
    tools: ["Ventilator", "Cardiac Monitor", "Infusion Pumps"],
  },
  8: {
    overview: "NICU: رعاية حديثي الولادة المبتسرين والحالات الحرجة في أول أيام الحياة.",
    skills: [
      "Thermoregulation للحاضنات",
      "تغذية أنبوبية OG/NG",
      "العناية بالـ CPAP للرضع",
      "Kangaroo Care والدعم النفسي للأم",
    ],
    tools: ["Incubator", "Phototherapy", "Pulse Oximeter صغير"],
  },
  10: {
    overview: "تمريض القلب: مراقبة ECG والتعامل مع AMI وفشل القلب.",
    skills: [
      "قراءة تخطيط القلب 12-Lead",
      "التعرف على عدم انتظام النبض",
      "إعطاء مذيبات الجلطة بأمان",
      "تثقيف المريض حول نمط الحياة",
    ],
    tools: ["ECG Machine", "Telemetry", "Defibrillator"],
  },
  13: {
    overview: "تمريض السكري: ضبط الجلوكوز ومنع المضاعفات الحادة والمزمنة.",
    skills: [
      "قياس السكر وتفسير النتائج",
      "تقنية حقن الأنسولين الصحيحة",
      "إدارة Hypoglycemia و DKA",
      "تثقيف غذائي وقدمي",
    ],
    tools: ["Glucometer", "Insulin Pen", "CGM"],
  },
  21: {
    overview: "ممرض تخدير (CRNA): يدير التخدير قبل وأثناء وبعد العمليات.",
    skills: [
      "تقييم ما قبل التخدير",
      "إدارة الـ Airway المتقدم",
      "ضبط جرعات المخدرات الوريدية والاستنشاقية",
      "التعامل مع المضاعفات (Hypotension, MH)",
    ],
    tools: ["Anesthesia Machine", "Laryngoscope", "Capnography"],
  },
  27: {
    overview: "تمريض الحروق: تقييم درجة وعمق الحرق وتعويض السوائل.",
    skills: [
      "تطبيق قاعدة 9s لحساب المساحة",
      "Parkland Formula للسوائل",
      "العناية بالجروح الحرارية",
      "إدارة الألم والتغذية البروتينية",
    ],
    tools: ["Silver Sulfadiazine", "Burn dressings", "Fluid pumps"],
  },
  46: {
    overview: "WOCN: تخصص الجروح المزمنة وقرح الفراش والفغرات.",
    skills: [
      "تصنيف قرح الفراش (Stage I–IV)",
      "اختيار الضماد المناسب",
      "العناية بـ Stoma والتغذية",
      "الوقاية وتقليل الضغط",
    ],
    tools: ["Hydrocolloid", "Foam dressings", "Ostomy bags"],
  },
};

export const getSpecialtyContent = (id: number): SpecialtyContent => ({
  ...DEFAULT,
  ...CUSTOM[id],
  skills: CUSTOM[id]?.skills ?? DEFAULT.skills,
  tools: CUSTOM[id]?.tools ?? DEFAULT.tools,
  refs: CUSTOM[id]?.refs ?? DEFAULT.refs,
});
