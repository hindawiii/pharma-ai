
# 🚑 المرحلة ٣ من قسم الإسعافات الأولية — لم تنتهِ بعد

## الوضع الحالي
- ✅ المرحلة ١: قاعدة بيانات لـ ٣٢ موضوعاً موثقاً في `src/data/firstAidTopics.ts` مع مصادر و`updatedAt`.
- ✅ المرحلة ٢: مؤقّت CPR، مؤقّت الشطف، Checklist محلي، بحث فوري.
- ⏳ **المرحلة ٣ (المتبقّية):** إبراز المراجع + شارة آخر تحديث + وضع الطوارئ السريع + الرسوم التوضيحية SVG.

بعد إنهاء هذه المرحلة قسم الإسعافات الأولية يُعتبر مكتملاً، ثم ننتقل لمراجعة قسم التمريض في رسالة منفصلة.

---

## 🎯 ما سأنفّذه في هذه المرحلة

### 1) تحسين عرض المراجع وآخر تحديث
- إضافة **شارة "آخر تحديث"** بارزة أعلى كل موضوع (تُقرأ من `updatedAt` الموجود بالفعل في البيانات).
- **بطاقة مراجع** أنيقة في نهاية كل موضوع تعرض `sources[]` مع أيقونة كتاب، بدل السطر الصغير الحالي — تعزيز الثقة.
- إضافة **شارة تصنيف** ملوّنة (طوارئ حياة / تسمّم / نوبة طبية / أطفال) في رأس الموضوع.

### 2) وضع الطوارئ السريع (Quick Access)
- **زر عائم أحمر (FAB)** داخل نافذة الإسعافات فقط يفتح لوحة سريعة تضم أهم ٦ حالات:
  CPR، الاختناق، النزيف الشديد، الحساسية المفرطة، النوبة القلبية، الاختلاجات.
- ضغطة واحدة تنقل مباشرة لخطوات الإنقاذ + زر اتصال بالإسعاف حسب الدولة (يستخدم `emergencyNumbers.ts` الموجود).

### 3) رسوم توضيحية SVG محلية
- إنشاء `src/components/mobile/firstaid/illustrations/` يضم ٤ رسوم SVG بسيطة inline (بدون صور خارجية، تبقى offline بالكامل وخفيفة):
  - **Recovery Position** (وضعية الإفاقة الجانبية)
  - **CPR Hand Placement** (موضع اليد للتدليك)
  - **Heimlich Maneuver** (بالغ + رضيع)
  - **Tourniquet** (ربط النزيف الشديد)
- ربط كل رسم بموضوعه المناسب في `firstAidTopics.ts` عبر حقل جديد اختياري `illustration?: "recovery" | "cpr-hands" | "heimlich" | "tourniquet"`.

### 4) شارة "طوارئ حرجة" 
- علامة حمراء صغيرة على الحالات التي `category === "life"` في شريط المواضيع، ليعرف المستخدم أولوياتها بصرياً.

---

## 🛠️ التفاصيل التقنية

**ملفات جديدة:**
- `src/components/mobile/firstaid/QuickAccessFab.tsx` — الزر العائم ولوحته.
- `src/components/mobile/firstaid/illustrations/RecoveryPosition.tsx`
- `src/components/mobile/firstaid/illustrations/CprHands.tsx`
- `src/components/mobile/firstaid/illustrations/Heimlich.tsx`
- `src/components/mobile/firstaid/illustrations/Tourniquet.tsx`
- `src/components/mobile/firstaid/illustrations/index.tsx` (Map من مفتاح → مكوّن)

**تعديلات:**
- `src/data/firstAidTopics.ts`: إضافة حقل `illustration?` لبعض المواضيع (cpr, choking, bleeding, unconscious).
- `src/components/mobile/screens/FirstAidContent.tsx`: عرض الشارة، بطاقة المراجع، الرسم التوضيحي أعلى الخطوات.
- `src/components/mobile/screens/HealthGuides.tsx`: تركيب `QuickAccessFab` داخل `FirstAidModal` + شارة "طوارئ حرجة" على الأزرار.

**النطاق:** Frontend فقط، بلا شبكة، بلا قاعدة بيانات، بلا Edge Functions. كل شيء offline.

---

## 📝 ملاحظة على ملفات PDF
لن أضيف PDF خارجية في هذه المرحلة لأنها:
- تُثقل حزمة التطبيق (١-٥ ميغا للملف الواحد).
- محتواها موجود بالفعل بالعربية داخل التطبيق.
- إذا أردت لاحقاً "تصدير الموضوع كـ PDF" (طباعة من الجهاز)، أضيفها كخطوة إضافية منفصلة.

---

## ❓ للتأكيد قبل التنفيذ
هل أبدأ بتنفيذ المرحلة ٣ كما هي أعلاه، أم تفضّل قفزة مباشرة لمراجعة قسم التمريض واعتبار الإسعافات مكتملاً بالمرحلتين ١ و ٢؟
