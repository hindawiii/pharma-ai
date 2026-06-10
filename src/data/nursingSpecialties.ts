// ============================================================
// 50 Nursing specialties — teaser list for Phase 1
// Full content (curricula, MCQs, certificates) arrives in Phase 2/3
// ============================================================

export interface NursingSpecialty {
  id: number;
  name_ar: string;
  name_en: string;
  emoji: string;
  era: "classic" | "modern";
}

export const NURSING_SPECIALTIES: NursingSpecialty[] = [
  { id: 1, name_ar: "التمريض الطبي-الجراحي", name_en: "Medical-Surgical", emoji: "🩺", era: "classic" },
  { id: 2, name_ar: "التمريض النفسي والعقلي", name_en: "Psychiatric/Mental Health", emoji: "🧠", era: "classic" },
  { id: 3, name_ar: "تمريض الأمومة والطفولة", name_en: "Maternal & Child Health", emoji: "👶", era: "classic" },
  { id: 4, name_ar: "تمريض صحة المجتمع", name_en: "Community/Public Health", emoji: "🏘️", era: "classic" },
  { id: 5, name_ar: "التمريض التعليمي", name_en: "Nursing Education", emoji: "📚", era: "classic" },
  { id: 6, name_ar: "تمريض الطوارئ", name_en: "Emergency/Trauma", emoji: "🚨", era: "modern" },
  { id: 7, name_ar: "تمريض العناية المركزة (ICU)", name_en: "Critical Care", emoji: "🫁", era: "modern" },
  { id: 8, name_ar: "NICU — حديثي الولادة", name_en: "Neonatal ICU", emoji: "👶", era: "modern" },
  { id: 9, name_ar: "PICU — الأطفال", name_en: "Pediatric ICU", emoji: "🧒", era: "modern" },
  { id: 10, name_ar: "تمريض القلب والأوعية", name_en: "Cardiac Care", emoji: "❤️", era: "modern" },
  { id: 11, name_ar: "تمريض الأورام", name_en: "Oncology", emoji: "🎗️", era: "modern" },
  { id: 12, name_ar: "تمريض الكلى والغسيل", name_en: "Nephrology/Dialysis", emoji: "🫘", era: "modern" },
  { id: 13, name_ar: "تمريض السكري", name_en: "Diabetes", emoji: "🍬", era: "modern" },
  { id: 14, name_ar: "تمريض الجهاز الهضمي", name_en: "Gastroenterology", emoji: "🍽️", era: "modern" },
  { id: 15, name_ar: "تمريض الأعصاب", name_en: "Neuroscience", emoji: "🧠", era: "modern" },
  { id: 16, name_ar: "تمريض العظام والمفاصل", name_en: "Orthopedic", emoji: "🦴", era: "modern" },
  { id: 17, name_ar: "تمريض الجلدية", name_en: "Dermatology", emoji: "🩹", era: "modern" },
  { id: 18, name_ar: "تمريض العيون", name_en: "Ophthalmic", emoji: "👁️", era: "modern" },
  { id: 19, name_ar: "تمريض الأنف والأذن والحنجرة", name_en: "ENT", emoji: "👂", era: "modern" },
  { id: 20, name_ar: "تمريض المسالك البولية", name_en: "Urologic", emoji: "🚽", era: "modern" },
  { id: 21, name_ar: "تمريض التخدير (CRNA)", name_en: "Nurse Anesthetist", emoji: "💉", era: "modern" },
  { id: 22, name_ar: "تمريض التوليد والقبالة", name_en: "Nurse Midwife", emoji: "🤰", era: "modern" },
  { id: 23, name_ar: "تمريض التأهيل", name_en: "Rehabilitation", emoji: "🏋️", era: "modern" },
  { id: 24, name_ar: "تمريض الرعاية التلطيفية", name_en: "Hospice/Palliative", emoji: "🕊️", era: "modern" },
  { id: 25, name_ar: "تمريض الصحة المهنية", name_en: "Occupational Health", emoji: "🏭", era: "modern" },
  { id: 26, name_ar: "تمريض المدارس", name_en: "School Nursing", emoji: "🏫", era: "modern" },
  { id: 27, name_ar: "تمريض الحروق", name_en: "Burn Care", emoji: "🔥", era: "modern" },
  { id: 28, name_ar: "تمريض الدم والأورام", name_en: "Hematology/Oncology", emoji: "🩸", era: "modern" },
  { id: 29, name_ar: "تمريض العدوى والوقاية", name_en: "Infection Control", emoji: "🦠", era: "modern" },
  { id: 30, name_ar: "تمريض التغذية الوريدية", name_en: "Infusion Nursing", emoji: "💧", era: "modern" },
  { id: 31, name_ar: "تمريض الأبحاث", name_en: "Nurse Researcher", emoji: "🔬", era: "modern" },
  { id: 32, name_ar: "تمريض المعلوماتية الصحية", name_en: "Informatics", emoji: "💻", era: "modern" },
  { id: 33, name_ar: "تمريض السفر", name_en: "Travel Nursing", emoji: "✈️", era: "modern" },
  { id: 34, name_ar: "تمريض الطيران/النقل", name_en: "Flight/Transport", emoji: "🚁", era: "modern" },
  { id: 35, name_ar: "التمريض الشرعي", name_en: "Forensic", emoji: "⚖️", era: "modern" },
  { id: 36, name_ar: "تمريض الإعاقة التنموية", name_en: "Developmental Disability", emoji: "♿", era: "modern" },
  { id: 37, name_ar: "تمريض العنف المنزلي", name_en: "Domestic Violence", emoji: "🛡️", era: "modern" },
  { id: 38, name_ar: "تمريض الإيدز/الأمراض المعدية", name_en: "HIV/AIDS", emoji: "🩺", era: "modern" },
  { id: 39, name_ar: "تمريض الشيخوخة", name_en: "Geriatric", emoji: "👴", era: "modern" },
  { id: 40, name_ar: "تمريض الصحة النفسية للأطفال", name_en: "Pediatric Psychiatric", emoji: "🧒", era: "modern" },
  { id: 41, name_ar: "تمريض الألم", name_en: "Pain Management", emoji: "😣", era: "modern" },
  { id: 42, name_ar: "تمريض السموم", name_en: "Toxicology", emoji: "☠️", era: "modern" },
  { id: 43, name_ar: "تمريض الزراعة", name_en: "Transplant", emoji: "🫀", era: "modern" },
  { id: 44, name_ar: "تمريض الجينات", name_en: "Genetics", emoji: "🧬", era: "modern" },
  { id: 45, name_ar: "تمريض متعدد الثقافات", name_en: "Transcultural", emoji: "🌍", era: "modern" },
  { id: 46, name_ar: "تمريض الجروح والفغرات", name_en: "Wound/Ostomy (WOCN)", emoji: "🩹", era: "modern" },
  { id: 47, name_ar: "تمريض الصحة الإنجابية", name_en: "Reproductive/Fertility", emoji: "🍼", era: "modern" },
  { id: 48, name_ar: "تمريض الروماتيزم", name_en: "Rheumatology", emoji: "🦴", era: "modern" },
  { id: 49, name_ar: "تمريض إدارة الحالات", name_en: "Case Management", emoji: "📋", era: "modern" },
  { id: 50, name_ar: "تمريض السياسات الصحية", name_en: "Health Policy", emoji: "🏛️", era: "modern" },
];

export const NURSING_TIMELINE = [
  { year: "٣٠٠م", text: "بداية التمريض في الإمبراطورية الرومانية" },
  { year: "١٨٦٠", text: "فلورنس نايتينجيل تؤسس أول مدرسة تمريض حديثة في لندن" },
  { year: "١٨٧٨", text: "ماري إليزا ماهوني — أول ممرضة أمريكية من أصل أفريقي" },
  { year: "١٩٢٥", text: "ماري بريكينريدج — تمريض القبالة في المناطق الريفية" },
  { year: "١٩٥٠–١٩٧٠", text: "ظهور التخصصات التمريضية الحديثة" },
  { year: "١٩٩٠", text: "تمريض المعلوماتية (Informatics)" },
  { year: "٢٠٠٠", text: "تمريض الطوارئ والحروق المتقدم" },
  { year: "٢٠١٠", text: "التمريض الرقمي و Telehealth" },
  { year: "٢٠٢٦", text: "٥٠+ تخصص معتمد عالمياً" },
];
