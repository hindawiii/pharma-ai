// ============================================================
// Nursing Reference Hub — Phase 1
// Sources: WHO, AHA/PALS, CDC, Lippincott, NANDA-I 2024
// ============================================================

// ---------- Vital signs by age ----------
export interface VitalRange {
  group: string;
  ageLabel: string;
  hr: string; // beats/min
  rr: string; // breaths/min
  sbp: string; // systolic mmHg
  temp: string; // °C
}

export const VITAL_SIGNS_BY_AGE: VitalRange[] = [
  { group: "حديثي الولادة", ageLabel: "0 - 28 يوم", hr: "100 - 160", rr: "30 - 60", sbp: "60 - 90", temp: "36.5 - 37.5" },
  { group: "رضيع", ageLabel: "1 - 12 شهر", hr: "90 - 150", rr: "25 - 45", sbp: "70 - 100", temp: "36.5 - 37.5" },
  { group: "طفل صغير", ageLabel: "1 - 3 سنة", hr: "80 - 140", rr: "20 - 30", sbp: "80 - 110", temp: "36.5 - 37.5" },
  { group: "ما قبل المدرسة", ageLabel: "3 - 5 سنة", hr: "80 - 120", rr: "20 - 25", sbp: "80 - 110", temp: "36.5 - 37.5" },
  { group: "طفل مدرسة", ageLabel: "6 - 12 سنة", hr: "70 - 110", rr: "18 - 25", sbp: "85 - 120", temp: "36.5 - 37.5" },
  { group: "مراهق", ageLabel: "13 - 18 سنة", hr: "60 - 100", rr: "12 - 20", sbp: "95 - 130", temp: "36.5 - 37.5" },
  { group: "بالغ", ageLabel: "19 - 64 سنة", hr: "60 - 100", rr: "12 - 20", sbp: "90 - 130", temp: "36.5 - 37.5" },
  { group: "كبار السن", ageLabel: "≥ 65 سنة", hr: "60 - 100", rr: "12 - 22", sbp: "≤ 140", temp: "36.0 - 37.2" },
];

// ---------- Lab values (adult reference) ----------
export interface LabValue {
  category: string;
  test: string;
  abbr?: string;
  range: string;
  unit: string;
  critical?: string;
}

export const LAB_VALUES: LabValue[] = [
  // CBC
  { category: "CBC", test: "الهيموجلوبين (ذكور)", abbr: "Hb", range: "13.5 - 17.5", unit: "g/dL", critical: "< 7 أو > 20" },
  { category: "CBC", test: "الهيموجلوبين (إناث)", abbr: "Hb", range: "12.0 - 15.5", unit: "g/dL", critical: "< 7 أو > 20" },
  { category: "CBC", test: "الهيماتوكريت", abbr: "Hct", range: "36 - 50", unit: "%" },
  { category: "CBC", test: "كريات بيضاء", abbr: "WBC", range: "4.0 - 11.0", unit: "×10³/µL", critical: "< 2 أو > 30" },
  { category: "CBC", test: "الصفائح", abbr: "PLT", range: "150 - 400", unit: "×10³/µL", critical: "< 50 أو > 1000" },
  // Electrolytes
  { category: "الأملاح", test: "الصوديوم", abbr: "Na", range: "135 - 145", unit: "mmol/L", critical: "< 120 أو > 160" },
  { category: "الأملاح", test: "البوتاسيوم", abbr: "K", range: "3.5 - 5.0", unit: "mmol/L", critical: "< 2.5 أو > 6.5" },
  { category: "الأملاح", test: "الكلور", abbr: "Cl", range: "98 - 107", unit: "mmol/L" },
  { category: "الأملاح", test: "الكالسيوم", abbr: "Ca", range: "8.5 - 10.5", unit: "mg/dL", critical: "< 6 أو > 13" },
  { category: "الأملاح", test: "الماغنسيوم", abbr: "Mg", range: "1.7 - 2.4", unit: "mg/dL" },
  { category: "الأملاح", test: "الفوسفات", abbr: "PO4", range: "2.5 - 4.5", unit: "mg/dL" },
  // Kidney
  { category: "الكلى", test: "الكرياتينين", abbr: "Cr", range: "0.6 - 1.3", unit: "mg/dL" },
  { category: "الكلى", test: "يوريا الدم", abbr: "BUN", range: "7 - 20", unit: "mg/dL" },
  { category: "الكلى", test: "معدل الترشيح", abbr: "eGFR", range: "≥ 90", unit: "mL/min/1.73m²" },
  // Liver
  { category: "الكبد", test: "ALT", abbr: "ALT", range: "7 - 56", unit: "U/L" },
  { category: "الكبد", test: "AST", abbr: "AST", range: "10 - 40", unit: "U/L" },
  { category: "الكبد", test: "البيليروبين الكلي", abbr: "T.Bili", range: "0.1 - 1.2", unit: "mg/dL" },
  { category: "الكبد", test: "الألبومين", abbr: "Alb", range: "3.5 - 5.0", unit: "g/dL" },
  // Glucose / Diabetes
  { category: "السكر", test: "سكر صائم", abbr: "FBS", range: "70 - 99", unit: "mg/dL", critical: "< 50 أو > 400" },
  { category: "السكر", test: "سكر عشوائي", abbr: "RBS", range: "< 140", unit: "mg/dL" },
  { category: "السكر", test: "السكر التراكمي", abbr: "HbA1c", range: "< 5.7", unit: "%" },
  // Coagulation
  { category: "التخثر", test: "زمن البروثرومبين", abbr: "PT", range: "11 - 13.5", unit: "sec" },
  { category: "التخثر", test: "INR", abbr: "INR", range: "0.8 - 1.2", unit: "" },
  { category: "التخثر", test: "aPTT", abbr: "aPTT", range: "25 - 35", unit: "sec" },
  { category: "التخثر", test: "D-Dimer", abbr: "D-D", range: "< 0.5", unit: "mg/L" },
  // ABG
  { category: "غازات الدم", test: "pH", abbr: "pH", range: "7.35 - 7.45", unit: "", critical: "< 7.2 أو > 7.6" },
  { category: "غازات الدم", test: "PaCO₂", abbr: "PaCO2", range: "35 - 45", unit: "mmHg" },
  { category: "غازات الدم", test: "PaO₂", abbr: "PaO2", range: "80 - 100", unit: "mmHg" },
  { category: "غازات الدم", test: "HCO₃⁻", abbr: "HCO3", range: "22 - 26", unit: "mmol/L" },
  { category: "غازات الدم", test: "SaO₂", abbr: "SaO2", range: "95 - 100", unit: "%" },
  // Cardiac
  { category: "القلب", test: "تروبونين I", abbr: "TnI", range: "< 0.04", unit: "ng/mL" },
  { category: "القلب", test: "CK-MB", abbr: "CK-MB", range: "0 - 3", unit: "ng/mL" },
  { category: "القلب", test: "BNP", abbr: "BNP", range: "< 100", unit: "pg/mL" },
  // Lipids
  { category: "الدهون", test: "الكوليسترول الكلي", abbr: "TC", range: "< 200", unit: "mg/dL" },
  { category: "الدهون", test: "LDL", abbr: "LDL", range: "< 100", unit: "mg/dL" },
  { category: "الدهون", test: "HDL", abbr: "HDL", range: "> 40", unit: "mg/dL" },
  { category: "الدهون", test: "الدهون الثلاثية", abbr: "TG", range: "< 150", unit: "mg/dL" },
  // Thyroid
  { category: "الغدة الدرقية", test: "TSH", abbr: "TSH", range: "0.4 - 4.0", unit: "mIU/L" },
  { category: "الغدة الدرقية", test: "Free T4", abbr: "FT4", range: "0.8 - 1.8", unit: "ng/dL" },
];

// ---------- Medical abbreviations (150) ----------
export interface Abbreviation {
  abbr: string;
  meaning_en: string;
  meaning_ar: string;
  category: "general" | "route" | "frequency" | "vitals" | "labs" | "diagnosis" | "procedure";
}

export const ABBREVIATIONS: Abbreviation[] = [
  // Routes
  { abbr: "PO", meaning_en: "Per Os / By mouth", meaning_ar: "عن طريق الفم", category: "route" },
  { abbr: "IV", meaning_en: "Intravenous", meaning_ar: "وريدي", category: "route" },
  { abbr: "IM", meaning_en: "Intramuscular", meaning_ar: "عضلي", category: "route" },
  { abbr: "SC / SQ", meaning_en: "Subcutaneous", meaning_ar: "تحت الجلد", category: "route" },
  { abbr: "SL", meaning_en: "Sublingual", meaning_ar: "تحت اللسان", category: "route" },
  { abbr: "PR", meaning_en: "Per Rectum", meaning_ar: "شرجي", category: "route" },
  { abbr: "PV", meaning_en: "Per Vagina", meaning_ar: "مهبلي", category: "route" },
  { abbr: "ID", meaning_en: "Intradermal", meaning_ar: "داخل الأدمة", category: "route" },
  { abbr: "NGT", meaning_en: "Nasogastric Tube", meaning_ar: "أنبوب أنفي معدي", category: "route" },
  { abbr: "PEG", meaning_en: "Percutaneous Gastrostomy", meaning_ar: "فغر معدة عبر الجلد", category: "route" },
  // Frequency
  { abbr: "OD", meaning_en: "Once Daily", meaning_ar: "مرة يومياً", category: "frequency" },
  { abbr: "BID", meaning_en: "Twice Daily", meaning_ar: "مرتين يومياً", category: "frequency" },
  { abbr: "TID", meaning_en: "Three Times Daily", meaning_ar: "ثلاث مرات يومياً", category: "frequency" },
  { abbr: "QID", meaning_en: "Four Times Daily", meaning_ar: "أربع مرات يومياً", category: "frequency" },
  { abbr: "QD", meaning_en: "Every Day", meaning_ar: "كل يوم", category: "frequency" },
  { abbr: "QOD", meaning_en: "Every Other Day", meaning_ar: "يوم بعد يوم", category: "frequency" },
  { abbr: "QH", meaning_en: "Every Hour", meaning_ar: "كل ساعة", category: "frequency" },
  { abbr: "Q4H", meaning_en: "Every 4 Hours", meaning_ar: "كل 4 ساعات", category: "frequency" },
  { abbr: "Q6H", meaning_en: "Every 6 Hours", meaning_ar: "كل 6 ساعات", category: "frequency" },
  { abbr: "Q8H", meaning_en: "Every 8 Hours", meaning_ar: "كل 8 ساعات", category: "frequency" },
  { abbr: "PRN", meaning_en: "As Needed", meaning_ar: "عند الحاجة", category: "frequency" },
  { abbr: "STAT", meaning_en: "Immediately", meaning_ar: "فوراً", category: "frequency" },
  { abbr: "AC", meaning_en: "Before Meals", meaning_ar: "قبل الأكل", category: "frequency" },
  { abbr: "PC", meaning_en: "After Meals", meaning_ar: "بعد الأكل", category: "frequency" },
  { abbr: "HS", meaning_en: "At Bedtime", meaning_ar: "عند النوم", category: "frequency" },
  { abbr: "NPO", meaning_en: "Nothing Per Os", meaning_ar: "ممنوع الأكل والشرب", category: "frequency" },
  // Vitals
  { abbr: "BP", meaning_en: "Blood Pressure", meaning_ar: "ضغط الدم", category: "vitals" },
  { abbr: "HR", meaning_en: "Heart Rate", meaning_ar: "معدل النبض", category: "vitals" },
  { abbr: "RR", meaning_en: "Respiratory Rate", meaning_ar: "معدل التنفس", category: "vitals" },
  { abbr: "T", meaning_en: "Temperature", meaning_ar: "درجة الحرارة", category: "vitals" },
  { abbr: "SpO₂", meaning_en: "Oxygen Saturation", meaning_ar: "تشبع الأكسجين", category: "vitals" },
  { abbr: "MAP", meaning_en: "Mean Arterial Pressure", meaning_ar: "متوسط الضغط الشرياني", category: "vitals" },
  { abbr: "CVP", meaning_en: "Central Venous Pressure", meaning_ar: "الضغط الوريدي المركزي", category: "vitals" },
  { abbr: "ICP", meaning_en: "Intracranial Pressure", meaning_ar: "الضغط داخل الجمجمة", category: "vitals" },
  { abbr: "GCS", meaning_en: "Glasgow Coma Scale", meaning_ar: "مقياس جلاسكو للغيبوبة", category: "vitals" },
  { abbr: "I&O", meaning_en: "Intake & Output", meaning_ar: "السوائل الداخلة والخارجة", category: "vitals" },
  // Labs
  { abbr: "CBC", meaning_en: "Complete Blood Count", meaning_ar: "صورة دم كاملة", category: "labs" },
  { abbr: "BMP", meaning_en: "Basic Metabolic Panel", meaning_ar: "لوحة أيض أساسية", category: "labs" },
  { abbr: "CMP", meaning_en: "Comprehensive Metabolic Panel", meaning_ar: "لوحة أيض شاملة", category: "labs" },
  { abbr: "LFT", meaning_en: "Liver Function Test", meaning_ar: "وظائف الكبد", category: "labs" },
  { abbr: "RFT", meaning_en: "Renal Function Test", meaning_ar: "وظائف الكلى", category: "labs" },
  { abbr: "ABG", meaning_en: "Arterial Blood Gases", meaning_ar: "غازات الدم الشرياني", category: "labs" },
  { abbr: "PT/INR", meaning_en: "Prothrombin/INR", meaning_ar: "زمن البروثرومبين", category: "labs" },
  { abbr: "PTT", meaning_en: "Partial Thromboplastin Time", meaning_ar: "زمن الثرومبوبلاستين الجزئي", category: "labs" },
  { abbr: "ESR", meaning_en: "Erythrocyte Sedimentation Rate", meaning_ar: "سرعة الترسيب", category: "labs" },
  { abbr: "CRP", meaning_en: "C-Reactive Protein", meaning_ar: "بروتين سي التفاعلي", category: "labs" },
  { abbr: "UA", meaning_en: "Urinalysis", meaning_ar: "تحليل بول", category: "labs" },
  { abbr: "C&S", meaning_en: "Culture & Sensitivity", meaning_ar: "زراعة وحساسية", category: "labs" },
  { abbr: "TSH", meaning_en: "Thyroid Stimulating Hormone", meaning_ar: "هرمون الدرقية المنبه", category: "labs" },
  { abbr: "HbA1c", meaning_en: "Glycated Hemoglobin", meaning_ar: "السكر التراكمي", category: "labs" },
  // Diagnoses
  { abbr: "MI", meaning_en: "Myocardial Infarction", meaning_ar: "احتشاء عضلة القلب", category: "diagnosis" },
  { abbr: "CHF", meaning_en: "Congestive Heart Failure", meaning_ar: "قصور القلب الاحتقاني", category: "diagnosis" },
  { abbr: "CAD", meaning_en: "Coronary Artery Disease", meaning_ar: "مرض الشريان التاجي", category: "diagnosis" },
  { abbr: "HTN", meaning_en: "Hypertension", meaning_ar: "ارتفاع ضغط الدم", category: "diagnosis" },
  { abbr: "DM", meaning_en: "Diabetes Mellitus", meaning_ar: "داء السكري", category: "diagnosis" },
  { abbr: "DKA", meaning_en: "Diabetic Ketoacidosis", meaning_ar: "الحماض الكيتوني السكري", category: "diagnosis" },
  { abbr: "HHS", meaning_en: "Hyperosmolar State", meaning_ar: "حالة فرط الأسمولية", category: "diagnosis" },
  { abbr: "CVA", meaning_en: "Cerebrovascular Accident", meaning_ar: "سكتة دماغية", category: "diagnosis" },
  { abbr: "TIA", meaning_en: "Transient Ischemic Attack", meaning_ar: "نوبة إقفارية عابرة", category: "diagnosis" },
  { abbr: "COPD", meaning_en: "Chronic Obstructive Pulmonary Disease", meaning_ar: "الانسداد الرئوي المزمن", category: "diagnosis" },
  { abbr: "PE", meaning_en: "Pulmonary Embolism", meaning_ar: "انصمام رئوي", category: "diagnosis" },
  { abbr: "DVT", meaning_en: "Deep Vein Thrombosis", meaning_ar: "تخثر وريدي عميق", category: "diagnosis" },
  { abbr: "ARDS", meaning_en: "Acute Respiratory Distress", meaning_ar: "متلازمة ضائقة تنفسية حادة", category: "diagnosis" },
  { abbr: "AKI", meaning_en: "Acute Kidney Injury", meaning_ar: "إصابة كلوية حادة", category: "diagnosis" },
  { abbr: "CKD", meaning_en: "Chronic Kidney Disease", meaning_ar: "مرض كلى مزمن", category: "diagnosis" },
  { abbr: "UTI", meaning_en: "Urinary Tract Infection", meaning_ar: "التهاب مسالك بولية", category: "diagnosis" },
  { abbr: "URI", meaning_en: "Upper Respiratory Infection", meaning_ar: "التهاب تنفسي علوي", category: "diagnosis" },
  { abbr: "GI", meaning_en: "Gastrointestinal", meaning_ar: "الجهاز الهضمي", category: "diagnosis" },
  { abbr: "GERD", meaning_en: "Gastroesophageal Reflux", meaning_ar: "الارتجاع المريئي", category: "diagnosis" },
  { abbr: "IBD", meaning_en: "Inflammatory Bowel Disease", meaning_ar: "التهاب الأمعاء", category: "diagnosis" },
  { abbr: "IBS", meaning_en: "Irritable Bowel Syndrome", meaning_ar: "القولون العصبي", category: "diagnosis" },
  { abbr: "SOB", meaning_en: "Shortness of Breath", meaning_ar: "ضيق التنفس", category: "diagnosis" },
  { abbr: "LOC", meaning_en: "Loss of Consciousness", meaning_ar: "فقدان الوعي", category: "diagnosis" },
  { abbr: "N/V", meaning_en: "Nausea/Vomiting", meaning_ar: "غثيان وقيء", category: "diagnosis" },
  { abbr: "Fx", meaning_en: "Fracture", meaning_ar: "كسر", category: "diagnosis" },
  { abbr: "Hx", meaning_en: "History", meaning_ar: "التاريخ المرضي", category: "diagnosis" },
  { abbr: "Dx", meaning_en: "Diagnosis", meaning_ar: "تشخيص", category: "diagnosis" },
  { abbr: "Tx", meaning_en: "Treatment", meaning_ar: "علاج", category: "diagnosis" },
  { abbr: "Rx", meaning_en: "Prescription", meaning_ar: "وصفة", category: "diagnosis" },
  { abbr: "Sx", meaning_en: "Symptoms", meaning_ar: "أعراض", category: "diagnosis" },
  { abbr: "Pt", meaning_en: "Patient", meaning_ar: "مريض", category: "diagnosis" },
  // Procedures
  { abbr: "CPR", meaning_en: "Cardiopulmonary Resuscitation", meaning_ar: "إنعاش قلبي رئوي", category: "procedure" },
  { abbr: "ACLS", meaning_en: "Advanced Cardiac Life Support", meaning_ar: "دعم القلب المتقدم", category: "procedure" },
  { abbr: "BLS", meaning_en: "Basic Life Support", meaning_ar: "دعم الحياة الأساسي", category: "procedure" },
  { abbr: "ETT", meaning_en: "Endotracheal Tube", meaning_ar: "أنبوب رغامي", category: "procedure" },
  { abbr: "MV", meaning_en: "Mechanical Ventilation", meaning_ar: "تهوية ميكانيكية", category: "procedure" },
  { abbr: "O₂", meaning_en: "Oxygen", meaning_ar: "أكسجين", category: "procedure" },
  { abbr: "NC", meaning_en: "Nasal Cannula", meaning_ar: "كانيولا أنفية", category: "procedure" },
  { abbr: "NRB", meaning_en: "Non-Rebreather Mask", meaning_ar: "قناع غير مرتد", category: "procedure" },
  { abbr: "BVM", meaning_en: "Bag-Valve-Mask", meaning_ar: "كيس تهوية يدوي", category: "procedure" },
  { abbr: "ECG/EKG", meaning_en: "Electrocardiogram", meaning_ar: "تخطيط قلب", category: "procedure" },
  { abbr: "EEG", meaning_en: "Electroencephalogram", meaning_ar: "تخطيط دماغ", category: "procedure" },
  { abbr: "MRI", meaning_en: "Magnetic Resonance Imaging", meaning_ar: "رنين مغناطيسي", category: "procedure" },
  { abbr: "CT", meaning_en: "Computed Tomography", meaning_ar: "أشعة مقطعية", category: "procedure" },
  { abbr: "US", meaning_en: "Ultrasound", meaning_ar: "موجات فوق صوتية", category: "procedure" },
  { abbr: "CXR", meaning_en: "Chest X-Ray", meaning_ar: "أشعة صدر", category: "procedure" },
  { abbr: "IVF", meaning_en: "IV Fluids", meaning_ar: "سوائل وريدية", category: "procedure" },
  { abbr: "NS", meaning_en: "Normal Saline", meaning_ar: "محلول ملحي 0.9%", category: "procedure" },
  { abbr: "D5W", meaning_en: "Dextrose 5% in Water", meaning_ar: "دكستروز 5%", category: "procedure" },
  { abbr: "LR", meaning_en: "Lactated Ringer's", meaning_ar: "محلول رينجر", category: "procedure" },
  { abbr: "PRBC", meaning_en: "Packed Red Blood Cells", meaning_ar: "كريات حمراء مركزة", category: "procedure" },
  { abbr: "FFP", meaning_en: "Fresh Frozen Plasma", meaning_ar: "بلازما طازجة مجمدة", category: "procedure" },
  { abbr: "Foley", meaning_en: "Foley Catheter", meaning_ar: "قسطرة بولية", category: "procedure" },
  { abbr: "CVC", meaning_en: "Central Venous Catheter", meaning_ar: "قسطرة وريدية مركزية", category: "procedure" },
  { abbr: "PICC", meaning_en: "Peripheral Inserted Central Catheter", meaning_ar: "قسطرة مركزية طرفية", category: "procedure" },
  { abbr: "LP", meaning_en: "Lumbar Puncture", meaning_ar: "بزل قطني", category: "procedure" },
  { abbr: "DNR", meaning_en: "Do Not Resuscitate", meaning_ar: "عدم الإنعاش", category: "procedure" },
  { abbr: "DNI", meaning_en: "Do Not Intubate", meaning_ar: "عدم التنبيب", category: "procedure" },
  // General
  { abbr: "ADL", meaning_en: "Activities of Daily Living", meaning_ar: "أنشطة الحياة اليومية", category: "general" },
  { abbr: "BMI", meaning_en: "Body Mass Index", meaning_ar: "مؤشر كتلة الجسم", category: "general" },
  { abbr: "BSA", meaning_en: "Body Surface Area", meaning_ar: "مساحة سطح الجسم", category: "general" },
  { abbr: "OR", meaning_en: "Operating Room", meaning_ar: "غرفة العمليات", category: "general" },
  { abbr: "ER/ED", meaning_en: "Emergency Room/Department", meaning_ar: "قسم الطوارئ", category: "general" },
  { abbr: "ICU", meaning_en: "Intensive Care Unit", meaning_ar: "العناية المركزة", category: "general" },
  { abbr: "CCU", meaning_en: "Coronary Care Unit", meaning_ar: "عناية قلبية", category: "general" },
  { abbr: "NICU", meaning_en: "Neonatal ICU", meaning_ar: "عناية حديثي الولادة", category: "general" },
  { abbr: "PICU", meaning_en: "Pediatric ICU", meaning_ar: "عناية الأطفال المركزة", category: "general" },
  { abbr: "OB/GYN", meaning_en: "Obstetrics/Gynecology", meaning_ar: "نساء وتوليد", category: "general" },
  { abbr: "L&D", meaning_en: "Labor & Delivery", meaning_ar: "مخاض وولادة", category: "general" },
  { abbr: "PACU", meaning_en: "Post-Anesthesia Care Unit", meaning_ar: "الإفاقة", category: "general" },
  { abbr: "OT", meaning_en: "Occupational Therapy", meaning_ar: "علاج وظيفي", category: "general" },
  { abbr: "PT", meaning_en: "Physical Therapy", meaning_ar: "علاج طبيعي", category: "general" },
  { abbr: "RT", meaning_en: "Respiratory Therapy", meaning_ar: "علاج تنفسي", category: "general" },
  { abbr: "RN", meaning_en: "Registered Nurse", meaning_ar: "ممرض مسجل", category: "general" },
  { abbr: "LPN", meaning_en: "Licensed Practical Nurse", meaning_ar: "ممرض ممارس مرخص", category: "general" },
  { abbr: "CNA", meaning_en: "Certified Nursing Assistant", meaning_ar: "مساعد تمريض معتمد", category: "general" },
  { abbr: "NP", meaning_en: "Nurse Practitioner", meaning_ar: "ممرض ممارس", category: "general" },
  { abbr: "MD", meaning_en: "Medical Doctor", meaning_ar: "طبيب", category: "general" },
  { abbr: "DO", meaning_en: "Doctor of Osteopathy", meaning_ar: "طبيب عظام", category: "general" },
  { abbr: "PA", meaning_en: "Physician Assistant", meaning_ar: "مساعد طبيب", category: "general" },
  { abbr: "AMA", meaning_en: "Against Medical Advice", meaning_ar: "خروج ضد المشورة", category: "general" },
  { abbr: "DOA", meaning_en: "Dead on Arrival", meaning_ar: "متوفي عند الوصول", category: "general" },
  { abbr: "ROM", meaning_en: "Range of Motion", meaning_ar: "مدى الحركة", category: "general" },
  { abbr: "AROM", meaning_en: "Active ROM", meaning_ar: "حركة نشطة", category: "general" },
  { abbr: "PROM", meaning_en: "Passive ROM", meaning_ar: "حركة سلبية", category: "general" },
  { abbr: "WNL", meaning_en: "Within Normal Limits", meaning_ar: "ضمن الحدود الطبيعية", category: "general" },
  { abbr: "S/P", meaning_en: "Status Post", meaning_ar: "بعد", category: "general" },
  { abbr: "c/o", meaning_en: "Complains of", meaning_ar: "يشكو من", category: "general" },
  { abbr: "w/", meaning_en: "With", meaning_ar: "مع", category: "general" },
  { abbr: "w/o", meaning_en: "Without", meaning_ar: "بدون", category: "general" },
  { abbr: "y/o", meaning_en: "Year Old", meaning_ar: "من العمر", category: "general" },
  { abbr: "F/U", meaning_en: "Follow Up", meaning_ar: "متابعة", category: "general" },
  { abbr: "D/C", meaning_en: "Discharge / Discontinue", meaning_ar: "تخريج / إيقاف", category: "general" },
  { abbr: "H&P", meaning_en: "History & Physical", meaning_ar: "التاريخ والفحص", category: "general" },
  { abbr: "R/O", meaning_en: "Rule Out", meaning_ar: "استبعاد", category: "general" },
  { abbr: "SOAP", meaning_en: "Subjective/Objective/Assessment/Plan", meaning_ar: "توثيق طبي منظم", category: "general" },
];

// ---------- NANDA-I diagnoses (top 50) ----------
export interface NandaDiagnosis {
  id: number;
  code: string;
  name_en: string;
  name_ar: string;
  domain: string;
}

export const NANDA_DIAGNOSES: NandaDiagnosis[] = [
  { id: 1, code: "00032", name_en: "Ineffective Breathing Pattern", name_ar: "نمط تنفس غير فعّال", domain: "التنفس" },
  { id: 2, code: "00030", name_en: "Impaired Gas Exchange", name_ar: "اختلال تبادل الغازات", domain: "التنفس" },
  { id: 3, code: "00031", name_en: "Ineffective Airway Clearance", name_ar: "قصور تنظيف مجرى الهواء", domain: "التنفس" },
  { id: 4, code: "00092", name_en: "Activity Intolerance", name_ar: "عدم تحمل النشاط", domain: "النشاط والراحة" },
  { id: 5, code: "00085", name_en: "Impaired Physical Mobility", name_ar: "اختلال الحركة الجسدية", domain: "النشاط والراحة" },
  { id: 6, code: "00095", name_en: "Insomnia", name_ar: "الأرق", domain: "النشاط والراحة" },
  { id: 7, code: "00093", name_en: "Fatigue", name_ar: "التعب", domain: "النشاط والراحة" },
  { id: 8, code: "00132", name_en: "Acute Pain", name_ar: "ألم حاد", domain: "الراحة" },
  { id: 9, code: "00133", name_en: "Chronic Pain", name_ar: "ألم مزمن", domain: "الراحة" },
  { id: 10, code: "00214", name_en: "Impaired Comfort", name_ar: "اختلال الراحة", domain: "الراحة" },
  { id: 11, code: "00002", name_en: "Imbalanced Nutrition: Less Than Body Requirements", name_ar: "سوء التغذية: أقل من الاحتياج", domain: "التغذية" },
  { id: 12, code: "00001", name_en: "Imbalanced Nutrition: More Than Requirements", name_ar: "زيادة التغذية عن الحاجة", domain: "التغذية" },
  { id: 13, code: "00027", name_en: "Deficient Fluid Volume", name_ar: "نقص حجم السوائل", domain: "التغذية" },
  { id: 14, code: "00026", name_en: "Excess Fluid Volume", name_ar: "زيادة حجم السوائل", domain: "التغذية" },
  { id: 15, code: "00179", name_en: "Risk for Unstable Blood Glucose", name_ar: "خطر عدم استقرار السكر", domain: "التغذية" },
  { id: 16, code: "00011", name_en: "Constipation", name_ar: "الإمساك", domain: "الإخراج" },
  { id: 17, code: "00013", name_en: "Diarrhea", name_ar: "الإسهال", domain: "الإخراج" },
  { id: 18, code: "00020", name_en: "Urinary Incontinence", name_ar: "سلس البول", domain: "الإخراج" },
  { id: 19, code: "00023", name_en: "Urinary Retention", name_ar: "احتباس البول", domain: "الإخراج" },
  { id: 20, code: "00047", name_en: "Risk for Impaired Skin Integrity", name_ar: "خطر تلف سلامة الجلد", domain: "السلامة" },
  { id: 21, code: "00046", name_en: "Impaired Skin Integrity", name_ar: "اختلال سلامة الجلد", domain: "السلامة" },
  { id: 22, code: "00044", name_en: "Impaired Tissue Integrity", name_ar: "تلف سلامة الأنسجة", domain: "السلامة" },
  { id: 23, code: "00004", name_en: "Risk for Infection", name_ar: "خطر العدوى", domain: "السلامة" },
  { id: 24, code: "00155", name_en: "Risk for Falls", name_ar: "خطر السقوط", domain: "السلامة" },
  { id: 25, code: "00035", name_en: "Risk for Injury", name_ar: "خطر الإصابة", domain: "السلامة" },
  { id: 26, code: "00007", name_en: "Hyperthermia", name_ar: "ارتفاع الحرارة", domain: "السلامة" },
  { id: 27, code: "00006", name_en: "Hypothermia", name_ar: "انخفاض الحرارة", domain: "السلامة" },
  { id: 28, code: "00005", name_en: "Risk for Imbalanced Body Temperature", name_ar: "خطر عدم توازن الحرارة", domain: "السلامة" },
  { id: 29, code: "00206", name_en: "Risk for Bleeding", name_ar: "خطر النزيف", domain: "السلامة" },
  { id: 30, code: "00204", name_en: "Ineffective Peripheral Tissue Perfusion", name_ar: "قصور التروية النسيجية الطرفية", domain: "الدورة الدموية" },
  { id: 31, code: "00200", name_en: "Risk for Decreased Cardiac Tissue Perfusion", name_ar: "خطر نقص تروية القلب", domain: "الدورة الدموية" },
  { id: 32, code: "00029", name_en: "Decreased Cardiac Output", name_ar: "انخفاض النتاج القلبي", domain: "الدورة الدموية" },
  { id: 33, code: "00146", name_en: "Anxiety", name_ar: "القلق", domain: "الإدراك" },
  { id: 34, code: "00148", name_en: "Fear", name_ar: "الخوف", domain: "الإدراك" },
  { id: 35, code: "00069", name_en: "Ineffective Coping", name_ar: "قصور التأقلم", domain: "التأقلم" },
  { id: 36, code: "00124", name_en: "Hopelessness", name_ar: "اليأس", domain: "التأقلم" },
  { id: 37, code: "00054", name_en: "Risk for Loneliness", name_ar: "خطر الوحدة", domain: "العلاقات" },
  { id: 38, code: "00052", name_en: "Impaired Social Interaction", name_ar: "اختلال التفاعل الاجتماعي", domain: "العلاقات" },
  { id: 39, code: "00051", name_en: "Impaired Verbal Communication", name_ar: "اختلال التواصل اللفظي", domain: "الإدراك" },
  { id: 40, code: "00126", name_en: "Deficient Knowledge", name_ar: "نقص المعرفة", domain: "الإدراك" },
  { id: 41, code: "00128", name_en: "Acute Confusion", name_ar: "تشوش حاد", domain: "الإدراك" },
  { id: 42, code: "00129", name_en: "Chronic Confusion", name_ar: "تشوش مزمن", domain: "الإدراك" },
  { id: 43, code: "00108", name_en: "Bathing Self-Care Deficit", name_ar: "قصور الرعاية الذاتية للاستحمام", domain: "الرعاية الذاتية" },
  { id: 44, code: "00109", name_en: "Dressing Self-Care Deficit", name_ar: "قصور ارتداء الملابس", domain: "الرعاية الذاتية" },
  { id: 45, code: "00102", name_en: "Feeding Self-Care Deficit", name_ar: "قصور الإطعام الذاتي", domain: "الرعاية الذاتية" },
  { id: 46, code: "00110", name_en: "Toileting Self-Care Deficit", name_ar: "قصور دخول الحمام", domain: "الرعاية الذاتية" },
  { id: 47, code: "00118", name_en: "Disturbed Body Image", name_ar: "اضطراب صورة الجسم", domain: "الإدراك الذاتي" },
  { id: 48, code: "00119", name_en: "Chronic Low Self-Esteem", name_ar: "تدني تقدير الذات المزمن", domain: "الإدراك الذاتي" },
  { id: 49, code: "00099", name_en: "Ineffective Health Maintenance", name_ar: "قصور المحافظة على الصحة", domain: "تعزيز الصحة" },
  { id: 50, code: "00078", name_en: "Ineffective Health Management", name_ar: "قصور إدارة الصحة", domain: "تعزيز الصحة" },
];
