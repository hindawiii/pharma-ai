import { Sparkles, Phone, Facebook, Instagram, Twitter, Lightbulb, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import logo from "@/assets/pharma-i-logo.png";

const DAILY_TIPS = [
  "اشرب ٨ أكواب ماء يومياً للحفاظ على صحة الكلى ونضارة البشرة.",
  "لا تتناول المضاد الحيوي بدون وصفة طبية حتى لا تفقد فاعليته.",
  "احفظ الأدوية في مكان جاف بعيداً عن الشمس وحرارة المطبخ.",
  "قس ضغط الدم في نفس التوقيت يومياً للحصول على قراءة دقيقة.",
  "تناول دواء الضغط حتى لو شعرت بتحسن — التوقف المفاجئ خطر.",
  "افحص تاريخ صلاحية الأدوية شهرياً وتخلّص من المنتهية بأمان.",
  "المشي ٣٠ دقيقة يومياً يقلل خطر السكري وأمراض القلب.",
  "تجنّب دمج المسكنات مع مضادات التجلط دون استشارة الصيدلي.",
];

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

const socials = [
  { name: "WhatsApp", Icon: WhatsAppIcon, color: "bg-[#25D366]" },
  { name: "Facebook", Icon: Facebook, color: "bg-[#1877F2]" },
  { name: "Instagram", Icon: Instagram, color: "bg-gradient-to-tr from-[#FEDA75] via-[#FA7E1E] to-[#D62976]" },
  { name: "X", Icon: Twitter, color: "bg-foreground" },
];

export const HomeScreen = () => {
  const [sosArmed, setSosArmed] = useState(false);
  const initialTip = useMemo(() => Math.floor(Math.random() * DAILY_TIPS.length), []);
  const [tipIdx, setTipIdx] = useState(initialTip);

  const triggerSos = () => {
    setSosArmed(true);
    window.location.href = "tel:911";
    setTimeout(() => setSosArmed(false), 1500);
  };

  const nextTip = () => setTipIdx((i) => (i + 1) % DAILY_TIPS.length);

  return (
    <div className="relative min-h-[calc(100dvh-9rem)] overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-70" />

      <div className="relative px-5 pt-4 pb-28 flex flex-col items-center">
        {/* Larger AI Halo */}
        <div className="relative mt-2 mb-5 flex items-center justify-center">
          <span className="absolute h-72 w-72 rounded-full border-2 border-primary/20 animate-pulse-ring" />
          <span
            className="absolute h-60 w-60 rounded-full border-2 border-secondary/30 animate-pulse-ring"
            style={{ animationDelay: "0.6s" }}
          />
          <span
            className="absolute h-80 w-80 rounded-full opacity-60 blur-3xl gradient-ai"
            aria-hidden
          />

          <div className="relative h-56 w-56 rounded-full p-[4px] gradient-primary shadow-elegant">
            <div className="h-full w-full rounded-full bg-card flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 gradient-mesh opacity-70" />
              <img src={logo} alt="Pharma-i" className="relative h-32 w-32 object-contain animate-float" />
              <span className="absolute top-4 right-4 inline-flex items-center gap-1 bg-secondary/90 text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-card">
                <Sparkles className="h-3 w-3" /> AI
              </span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-gradient">Pharma-i جاهز للمساعدة</h2>
        <p className="text-sm text-muted-foreground mt-1 mb-5">كيف يمكنني مساعدتك اليوم؟</p>

        <div className="grid grid-cols-2 gap-2 w-full max-w-sm mb-6">
          {["تحليل روشتة", "تذكير دواء", "بديل علاجي", "أقرب صيدلية"].map((p) => (
            <button
              key={p}
              className="px-3 py-2.5 rounded-2xl bg-card border border-border text-xs font-bold shadow-soft hover:shadow-card transition-smooth text-foreground/80 hover:text-primary"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Rectangular SOS button */}
        <button
          onClick={triggerSos}
          aria-label="طوارئ SOS"
          className="relative group w-full max-w-sm active:scale-[0.98] transition-bounce"
        >
          <span className="absolute inset-0 rounded-2xl bg-destructive/30 animate-pulse-ring" />
          <span
            className={`relative flex items-center justify-center gap-3 w-full h-16 rounded-2xl text-white shadow-elegant border border-white/10 ${
              sosArmed ? "scale-[1.01]" : ""
            }`}
            style={{ background: "linear-gradient(135deg, hsl(0 80% 38%), hsl(0 70% 25%))" }}
          >
            <Phone className="h-6 w-6" />
            <span className="text-xl font-black tracking-tight">SOS طوارئ</span>
          </span>
        </button>
        <p className="text-[11px] text-muted-foreground mt-2">اضغط للاتصال الفوري بالطوارئ</p>

        <div className="mt-6 w-full max-w-sm">
          <p className="text-[11px] text-muted-foreground text-center mb-2">شارك التطبيق</p>
          <div className="flex items-center justify-center gap-3">
            {socials.map(({ name, Icon, color }) => (
              <button
                key={name}
                aria-label={`مشاركة عبر ${name}`}
                className={`h-12 w-12 rounded-2xl ${color} text-white flex items-center justify-center shadow-card hover:scale-105 transition-bounce`}
              >
                <Icon className="h-5 w-5" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
