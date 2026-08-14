/** بنية بطاقة الدواء الموحّدة — 19 نقطة بيانات سريرية */

export type InteractionSeverity = "danger" | "caution";

export interface MonographInteraction {
  with: string;
  note: string;
  severity: InteractionSeverity;
}

export interface MonographDosage {
  group: string;
  text: string;
}

export interface MonographPregnancy {
  /** فئة الحمل A / B / C / D / X أو "غير مصنف" */
  category: string;
  note: string;
}

export interface DrugMonograph {
  id: string;
  /** 1. الاسم */
  nameAr: string;
  nameEn: string;
  scientificAr: string;
  scientificEn: string;
  /** 2. الفئة الدوائية */
  categoryAr: string;
  /** 3. دواعي الاستعمال */
  indications: string[];
  /** 4. الجرعة */
  dosage: MonographDosage[];
  /** 5. موانع الاستعمال */
  contraindications: string[];
  /** 6. التحذيرات */
  warnings: string[];
  /** 7. التفاعلات الدوائية */
  interactions: MonographInteraction[];
  /** 8. التكلفة التقريبية */
  cost: string;
  /** 9. الفئات العمرية */
  ageGroups: string;
  /** 10. الفشل الكبدي */
  hepatic: string;
  /** 11. الفشل الكلوي */
  renal: string;
  /** 12. كبار السن */
  elderly: string;
  /** 13. الأطفال */
  pediatric: string;
  /** 14. الحمل */
  pregnancy: MonographPregnancy;
  /** 15. الرضاعة */
  lactation: string;
  /** 16. التخزين */
  storage: string;
  /** 17. الأشكال الصيدلانية */
  forms: string[];
  /** 18. الجرعة الزائدة */
  overdose: string;
  /** 19. إرشادات المريض */
  patientAdvice: string[];
  /** المصادر الطبية المعتمدة */
  sources: string[];
}
