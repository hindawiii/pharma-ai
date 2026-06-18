// Lovable AI streaming chat for the Nursing Hub.
// Supports plain Q&A and optional image input (wound/burn analysis).
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `أنت "ممرض Pharma-i" — مساعد تمريضي ذكي يتحدث العربية بطلاقة.
- أجب باختصار ووضوح بأسلوب تمريضي مهني وعملي.
- قدّم خطوات الرعاية، تقييم العلامات الحيوية، العناية بالجروح، إدارة الأدوية، والإسعاف الأولي.
- إذا أرسل المستخدم صورة لجرح أو حرق أو طفح جلدي:
  • صف ما تراه بدقة (الموقع، اللون، الحجم التقريبي، علامات العدوى).
  • قدّم درجة تقديرية (Stage I–IV لقرح الفراش، Superficial/Partial/Full Thickness للحروق).
  • اقترح خطوات العناية الأولية والضماد المناسب.
  • نبّه فوراً للعلامات التي تستوجب الذهاب للطوارئ.
- لا تقدّم تشخيصاً نهائياً؛ ذكّر دائماً بضرورة استشارة الطبيب/الممرض المختص.
- في حالات الطوارئ انصح فوراً بالاتصال بالإسعاف.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...(messages ?? [])],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429)
        return new Response(JSON.stringify({ error: "تم تجاوز حد الاستخدام، حاول لاحقاً." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      if (response.status === 402)
        return new Response(JSON.stringify({ error: "نفذت الأرصدة. أضف رصيداً للمساعد." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      const t = await response.text();
      console.error("nurse-ai gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("nurse-ai error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
