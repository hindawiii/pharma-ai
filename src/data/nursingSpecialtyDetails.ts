// ============================================================
// Detailed curriculum content for nursing specialties (Phase 2)
// Hand-written highlights for the most-requested specialties +
// auto-generated template fallback for the remaining ones.
// ============================================================

import { NURSING_SPECIALTIES } from "./nursingSpecialties";

export interface SpecialtyDetail {
  id: number;
  overview: string;
  scope: string[];
  coreSkills: string[];
  commonProcedures: string[];
  keyDrugs: string[];
  redFlags: string[];
  certifications: string[];
}

const D = (
  id: number,
  overview: string,
  scope: string[],
  coreSkills: string[],
  commonProcedures: string[],
  keyDrugs: string[],
  redFlags: string[],
  certifications: string[],
): [number, SpecialtyDetail] => [id, { id, overview, scope, coreSkills, commonProcedures, keyDrugs, redFlags, certifications }];

const HAND_WRITTEN = new Map<number, SpecialtyDetail>([
  D(
    1,
    "التمريض الطبي-الجراحي هو العمود الفقري للممارسة التمريضية، يعتني بالبالغين قبل وبعد العمليات وفي الأمراض المزمنة والحادة.",
    ["أجنحة الجراحة", "الباطنية", "ما قبل وبعد العمليات", "وحدات الملاحظة"],
    ["تقييم الجسم الكامل", "إدارة الألم", "العناية بالجروح", "تثقيف المريض قبل الخروج"],
    ["وضع IV", "إعطاء الأدوية الوريدية", "تغيير الضمادات", "سحب العينات", "Foley catheter"],
    ["مسكنات الألم", "مضادات حيوية وريدية", "مضادات التخثر (Enoxaparin)", "أنسولين"],
    ["نزيف بعد العملية", "انخفاض ضغط مفاجئ", "ضيق تنفس", "حمى >38.5"],
    ["CMSRN", "Med-Surg Certified (ANCC)"],
  ),
  D(
    6,
    "تمريض الطوارئ يتعامل مع الحالات الحرجة في غرف الطوارئ — صدمات، نوبات قلبية، حوادث.",
    ["ER", "Trauma Bay", "Triage", "Pre-hospital"],
    ["Triage (ESI)", "ACLS", "PALS", "تقييم سريع ABCDE", "إنعاش صدمي"],
    ["تنبيب", "إزالة الرجفان", "Chest compressions", "IO access", "نقل دم طارئ"],
    ["Epinephrine", "Amiodarone", "Atropine", "Adenosine", "Norepinephrine", "TXA"],
    ["GCS<8", "SBP<90", "SpO2<90", "حروق >20%", "نزيف غير مضبوط"],
    ["CEN", "TNCC", "ACLS", "PALS"],
  ),
  D(
    7,
    "تمريض العناية المركزة (ICU) يهتم بالمرضى الحرجين على أجهزة الدعم الحيوي ٢٤ ساعة.",
    ["MICU", "SICU", "Cardiac ICU", "Step-down"],
    ["قراءة Ventilator", "تفسير ABG", "Hemodynamic monitoring", "Sedation scales (RASS)"],
    ["العناية بأنبوب التنفس", "Suctioning", "Arterial line", "CRRT", "ECMO basics"],
    ["Propofol", "Fentanyl", "Norepinephrine", "Vasopressin", "Heparin drip"],
    ["MAP<65", "SpO2<88", "زيادة Lactate", "Arrhythmia جديدة"],
    ["CCRN", "CMC", "ACLS"],
  ),
  D(
    8,
    "NICU يعتني بحديثي الولادة الخدّج أو المرضى — أصغر مرضى المستشفى.",
    ["Level II/III/IV NICU"],
    ["Thermoregulation", "Developmental care", "تغذية وريدية TPN", "Kangaroo care"],
    ["Surfactant administration", "UVC/UAC line", "Phototherapy", "Resuscitation neonate"],
    ["Caffeine citrate", "Surfactant (Poractant)", "Vitamin K", "Erythromycin eye"],
    ["Apnea >20s", "Bradycardia <100", "Cyanosis", "انخفاض حرارة الجسم"],
    ["RNC-NIC", "NRP"],
  ),
  D(
    10,
    "تمريض القلب — متابعة مرضى الذبحة، قصور القلب، اضطرابات الإيقاع وتداخلات القسطرة.",
    ["CCU", "Cath Lab", "Cardiac Step-down", "Cardiac rehab"],
    ["تفسير ECG 12-lead", "تمييز Arrhythmias", "Telemetry monitoring"],
    ["Stress test prep", "Pacemaker care", "Post-PCI care", "إيقاف نزيف الفخذ"],
    ["Aspirin", "Clopidogrel", "Heparin", "Beta-blockers", "ACE-I", "Statins"],
    ["ألم صدر جديد", "ST elevation", "VT/VF", "Bradycardia مع أعراض"],
    ["CCRN-K", "PCCN", "ACLS"],
  ),
  D(
    11,
    "تمريض الأورام — رعاية مرضى السرطان خلال العلاج الكيميائي والإشعاعي.",
    ["Infusion center", "Bone marrow transplant", "Outpatient oncology"],
    ["Chemo administration safety", "Port-a-cath care", "Neutropenic precautions"],
    ["تركيب وإعطاء الكيماوي", "Vesicant extravasation management", "Pain pump"],
    ["Cisplatin", "Doxorubicin", "Filgrastim", "Ondansetron", "Dexamethasone"],
    ["حرارة + ANC<500", "Tumor lysis syndrome", "Anaphylaxis للكيماوي"],
    ["OCN", "BMTCN", "Chemo/Bio certification"],
  ),
  D(
    13,
    "تمريض السكري — تثقيف وإدارة مرضى النوع 1 و2 والحمل.",
    ["عيادات السكري", "Inpatient", "تثقيف مجتمعي"],
    ["Carb counting", "Insulin titration", "حساب Sliding scale", "Foot exam"],
    ["تركيب مضخة أنسولين", "CGM training", "Sick day rules"],
    ["Insulin (Lispro/Glargine)", "Metformin", "GLP-1 agonists", "SGLT2"],
    ["DKA (Glucose>250, ketones)", "HHS", "Hypoglycemia<70"],
    ["BC-ADM", "CDCES"],
  ),
  D(
    15,
    "تمريض الأعصاب — السكتات الدماغية، إصابات الحبل الشوكي، الصرع، أورام الدماغ.",
    ["Stroke unit", "Neuro ICU", "EMU (epilepsy)"],
    ["GCS", "NIH Stroke Scale", "Cranial nerve exam", "ICP monitoring"],
    ["tPA administration", "EVD management", "Seizure precautions"],
    ["Alteplase (tPA)", "Mannitol", "Hypertonic saline", "Levetiracetam"],
    ["انخفاض GCS مفاجئ", "Anisocoria", "Cushing triad", "Seizure >5 دقائق"],
    ["CNRN", "SCRN"],
  ),
  D(
    21,
    "ممرض التخدير (CRNA) — متخصص بدرجة ماستر يقوم بإعطاء التخدير مستقلاً.",
    ["OR", "Pain clinics", "Obstetric anesthesia"],
    ["Airway management متقدم", "Regional blocks", "Hemodynamic management"],
    ["RSI intubation", "Spinal/Epidural", "Nerve blocks بإرشاد الموجات فوق الصوتية"],
    ["Propofol", "Sevoflurane", "Rocuronium", "Sugammadex", "Fentanyl"],
    ["Malignant hyperthermia", "Anaphylaxis", "Awareness under anesthesia"],
    ["CRNA (NBCRNA)", "NCE"],
  ),
  D(
    22,
    "ممرضة القبالة — متابعة الحمل والولادة الطبيعية وما بعد الولادة.",
    ["Birthing center", "Hospital L&D", "Home birth"],
    ["Prenatal care", "Labor support", "Fetal monitoring", "Newborn assessment"],
    ["Vaginal delivery", "Episiotomy repair (limited)", "Postpartum hemorrhage management"],
    ["Oxytocin", "Methergine", "Misoprostol", "Lidocaine", "Rho(D) Ig"],
    ["نزيف >500mL طبيعي/1000mL قيصري", "Pre-eclampsia", "Fetal distress"],
    ["CNM (AMCB)"],
  ),
  D(
    24,
    "الرعاية التلطيفية — راحة وكرامة المرضى في المراحل المتقدمة من المرض.",
    ["Hospice", "Home palliative", "Hospital palliative consult"],
    ["إدارة الألم المتقدمة", "تواصل صعب", "Family support"],
    ["Subcutaneous morphine pump", "Mouth care", "Pressure ulcer prevention"],
    ["Morphine", "Haloperidol", "Lorazepam", "Glycopyrrolate", "Dexamethasone"],
    ["Terminal restlessness", "Air hunger", "ألم غير مضبوط"],
    ["CHPN", "ACHPN"],
  ),
  D(
    39,
    "تمريض الشيخوخة — رعاية كبار السن مع تركيز على الوظيفة والكرامة.",
    ["دور رعاية", "عيادات geriatric", "Home care"],
    ["تقييم متعدد الأبعاد", "منع السقوط", "تقييم الخرف", "Polypharmacy review"],
    ["Skin integrity check", "Cognitive screening (MMSE)", "Continence care"],
    ["تجنب Beers list", "Acetaminophen", "Memantine", "Donepezil"],
    ["تغير عقلي مفاجئ (delirium)", "سقوط مع كسر", "Pressure injury stage 3-4"],
    ["GERO-BC"],
  ),
  D(
    46,
    "ممرض الجروح والفغرات (WOCN) — تخصص متقدم في الجروح المعقدة و colostomy/urostomy.",
    ["Wound clinic", "Inpatient wound team", "Home health"],
    ["Wound staging", "Debridement (sharp/enzymatic)", "Ostomy fitting"],
    ["Negative pressure wound therapy", "Compression bandaging", "Ostomy education"],
    ["Silver dressings", "Hydrocolloid", "Collagenase", "Topical antimicrobials"],
    ["Cellulitis منتشر", "Tunneling deep", "Necrotic tissue"],
    ["CWOCN (WOCNCB)"],
  ),
]);

const genericTemplate = (id: number): SpecialtyDetail => {
  const spec = NURSING_SPECIALTIES.find((s) => s.id === id)!;
  return {
    id,
    overview: `تخصص ${spec.name_ar} (${spec.name_en}) — مجال متقدم يركز على رعاية مرضى محددين بمهارات سريرية متخصصة ومعرفة دوائية وعلمية موثقة.`,
    scope: ["المستشفيات", "العيادات المتخصصة", "الرعاية المنزلية"],
    coreSkills: ["تقييم سريري متخصص", "تثقيف المريض والأسرة", "توثيق دقيق", "تطبيق أحدث الإرشادات"],
    commonProcedures: ["إعطاء الأدوية بأمان", "متابعة العلامات الحيوية", "العناية الوقائية"],
    keyDrugs: ["تحدد حسب الحالة السريرية"],
    redFlags: ["تغير مفاجئ في الحالة", "علامات حيوية خارج النطاق", "ألم غير مضبوط"],
    certifications: ["شهادات متخصصة من ANCC/AACN أو ICN"],
  };
};

export const getSpecialtyDetail = (id: number): SpecialtyDetail =>
  HAND_WRITTEN.get(id) ?? genericTemplate(id);
