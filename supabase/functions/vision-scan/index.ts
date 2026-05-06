// Lovable AI Vision: extract structured prescription/barcode data from an image
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PRESCRIPTION_TOOL = {
  type: "function" as const,
  function: {
    name: "extract_prescription",
    description: "Extract structured prescription data from a doctor's handwritten or printed prescription image.",
    parameters: {
      type: "object",
      properties: {
        patientName: { type: "string", description: "Patient full name in Arabic if visible, else empty string" },
        age: { type: "string", description: "Age (e.g. '34 سنة') or empty" },
        diagnosis: { type: "string", description: "Diagnosis in Arabic or empty" },
        examType: { type: "string", description: "Type of exam/specialty in Arabic or empty" },
        clinic: { type: "string", description: "Doctor name and clinic in Arabic or empty" },
        meds: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string", description: "Drug name (Arabic preferred)" },
              form: { type: "string", enum: ["tablet", "syrup", "injection"] },
              dosageText: { type: "string", description: "Human-readable dosage in Arabic" },
              timings: {
                type: "array",
                items: { type: "string", enum: ["morning", "noon", "evening", "night"] },
              },
              pillsPerDose: { type: "number" },
              warning: { type: "string", description: "Optional warning in Arabic" },
              withFood: { type: "boolean" },
            },
            required: ["name", "form", "dosageText", "timings", "pillsPerDose"],
            additionalProperties: false,
          },
        },
      },
      required: ["patientName", "age", "diagnosis", "examType", "clinic", "meds"],
      additionalProperties: false,
    },
  },
};

const BARCODE_TOOL = {
  type: "function" as const,
  function: {
    name: "extract_barcode_drug",
    description: "Identify a medication from its packaging/barcode image.",
    parameters: {
      type: "object",
      properties: {
        brand: { type: "string" },
        scientific: { type: "string", description: "Active ingredients in Arabic" },
        manufacturer: { type: "string" },
        price: { type: "string", description: "Approximate price or empty" },
        category: { type: "string", description: "Therapeutic category in Arabic" },
        activeIngredient: { type: "string", description: "Brief Arabic explanation of the active ingredient" },
        verified: { type: "boolean" },
      },
      required: ["brand", "scientific", "manufacturer", "category", "activeIngredient", "verified"],
      additionalProperties: false,
    },
  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { imageBase64, mode } = await req.json();
    if (!imageBase64) throw new Error("imageBase64 required");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const isPrescription = mode === "prescription";
    const tool = isPrescription ? PRESCRIPTION_TOOL : BARCODE_TOOL;
    const sys = isPrescription
      ? "You are a careful Arabic medical OCR. Read the prescription and call extract_prescription with structured data. Translate Latin drug names to Arabic when common. If a field is unreadable, return an empty string."
      : "You identify medications from packaging photos or barcodes. Call extract_barcode_drug with structured Arabic data.";

    const dataUrl = imageBase64.startsWith("data:") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: sys },
          {
            role: "user",
            content: [
              { type: "text", text: isPrescription ? "استخرج بيانات هذه الروشتة." : "حدد هذا الدواء من العبوة/الباركود." },
              { type: "image_url", image_url: { url: dataUrl } },
            ],
          },
        ],
        tools: [tool],
        tool_choice: { type: "function", function: { name: tool.function.name } },
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      console.error("vision gateway error:", resp.status, t);
      if (resp.status === 429) return new Response(JSON.stringify({ error: "تم تجاوز حد الاستخدام" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (resp.status === 402) return new Response(JSON.stringify({ error: "نفذ رصيد المساعد" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ error: "AI gateway error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const json = await resp.json();
    const call = json.choices?.[0]?.message?.tool_calls?.[0];
    if (!call) {
      return new Response(JSON.stringify({ error: "لم يتم استخراج البيانات" }), { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const args = JSON.parse(call.function.arguments);
    return new Response(JSON.stringify({ data: args }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("vision-scan error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
