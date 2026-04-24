import { Facebook, Instagram, Twitter, Lightbulb, RefreshCw, MapPin, ChevronLeft } from "lucide-react";
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
  const initialTip = useMemo(() => Math.floor(Math.random() * DAILY_TIPS.length), []);
  const [tipIdx, setTipIdx] = useState(initialTip);
  const nextTip = () => setTipIdx((i) => (i + 1) % DAILY_TIPS.length);

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-70" />

      <div className="relative px-5 pt-3 pb-6 flex flex-col items-center">
        {/* Nearby services status */}
        <div className="w-full max-w-sm mb-3">
          <button className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-card border border-border shadow-soft active:scale-[0.99] transition-bounce text-right">
            <div className="relative h-12 w-12 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center flex-shrink-0">
              <MapPin className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-secondary ring-2 ring-card animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-muted-foreground">حالة الخدمات القريبة</p>
              <p className="text-sm font-extrabold text-foreground leading-snug">
                هناك <span className="text-secondary">3 صيدليات</span> متاحة حالياً بالقرب منك
              </p>
            </div>
            <ChevronLeft className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          </button>
        </div>

        {/* Brand mark */}
        <div className="relative mt-2 mb-5 flex items-center justify-center">
          <span className="absolute h-40 w-40 rounded-full opacity-50 blur-3xl gradient-ai" aria-hidden />
          <div className="relative h-24 w-24 rounded-full p-[3px] gradient-primary shadow-elegant">
            <div className="h-full w-full rounded-full bg-card flex items-center justify-center overflow-hidden">
              <img src={logo} alt="Pharma-i" className="h-16 w-16 object-contain" />
            </div>
          </div>
        </div>

        {/* Daily medical tip */}
        <div className="w-full max-w-sm">
          <div className="rounded-2xl p-4 bg-card border border-border shadow-soft relative overflow-hidden">
            <div className="absolute -top-8 -left-8 w-28 h-28 rounded-full bg-secondary/10 blur-2xl" />
            <div className="relative flex items-start gap-3">
              <div className="h-11 w-11 rounded-2xl gradient-ai text-white flex items-center justify-center flex-shrink-0 shadow-card">
                <Lightbulb className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-extrabold text-primary">نصيحة طبية اليوم</p>
                  <button
                    onClick={nextTip}
                    aria-label="نصيحة جديدة"
                    className="h-8 w-8 rounded-full bg-muted text-muted-foreground hover:text-primary flex items-center justify-center"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-base font-bold leading-relaxed text-foreground/85">{DAILY_TIPS[tipIdx]}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 w-full max-w-sm">
          <p className="text-sm font-bold text-muted-foreground text-center mb-2">شارك التطبيق</p>
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
