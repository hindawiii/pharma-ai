// Lovable AI streaming chat (Gemini)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `أنت "مساعد Pharma-i"، مساعد طبي ذكي يتحدث العربية بطلاقة.
- أجب باختصار ووضوح بأسلوب طبي مهني وودود.
- قدّم معلومات عن الأدوية، الجرعات، البدائل، التفاعلات، والإسعافات الأولية.
- إذا كان السؤال خارج النطاق الطبي، أجب باختصار ثم وجّه المستخدم للسؤال عن دواء أو حالة صحية.
- في حالات الطوارئ، انصح فوراً بالاتصال بالإسعاف.
- لا تقدّم تشخيصاً نهائياً؛ ذكّر دائماً بضرورة استشارة طبيب مختص للحالات الجدية.`;

const SYMPTOM_PROMPT = `أنت "فاحص الأعراض" في تطبيق Pharma-i، مساعد طبي عربي احترافي.

طريقة العمل:
1) في أول ردّين أو ثلاثة، اسأل أسئلة موجّهة قصيرة (سؤال أو سؤالان في كل ردّ) عن: مدة الأعراض، شدتها، الأعراض المصاحبة، العمر، الأمراض المزمنة، الأدوية الحالية، الحساسية، الحمل/الرضاعة.
2) إذا أرسل المستخدم صورة (طفح، جرح، عبوة دواء…) فحلّلها ضمن التقييم.
3) عند توفر معلومات كافية، أعطِ التقييم النهائي بهذا التنسيق بالضبط بعناوين Markdown:

### 🔎 التقييم المبدئي
(أسباب محتملة مرتّبة بالاحتمالية)

### 🚦 مستوى الخطورة
اكتب واحدة فقط: منخفض | متوسط | مرتفع — مع سبب مختصر.

### 💊 دواء مقترح بدون وصفة
الاسم العلمي + التجاري + الجرعة للبالغ والطفل + مدة الاستخدام + أهم موانع الاستعمال.

### 🌿 بديل طبيعي/منزلي
### ⚠️ متى تراجع الطبيب فوراً
### 📌 نصائح عامة

قواعد صارمة:
- في علامات الخطر (ألم صدر، ضيق تنفس شديد، فقدان وعي، نزيف غزير، تشنّج، أعراض سكتة) توقف فوراً وانصح بالاتصال بالإسعاف.
- لا تعطِ تشخيصاً نهائياً ولا أدوية تحتاج وصفة (مضادات حيوية…) دون توجيه المستخدم لطبيب.
- أجب دائماً بالعربية وباختصار منظّم.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { messages, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: mode === "symptom" ? SYMPTOM_PROMPT : SYSTEM_PROMPT },
          ...(messages ?? []),
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "تم تجاوز حد الاستخدام، حاول بعد قليل." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "نفذت الأرصدة. يرجى إضافة رصيد للمساعد." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
