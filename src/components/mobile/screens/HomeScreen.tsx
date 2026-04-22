import { Sparkles, Phone, Facebook, Instagram, Twitter } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/pharma-i-logo.png";

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

  const triggerSos = () => {
    setSosArmed(true);
    // Best-effort tel link
    window.location.href = "tel:911";
    setTimeout(() => setSosArmed(false), 1500);
  };

  return (
    <div className="relative min-h-[calc(100dvh-9rem)] overflow-hidden">
      {/* Soft mesh background */}
      <div className="absolute inset-0 gradient-mesh opacity-70" />

      <div className="relative px-5 pt-6 pb-28 flex flex-col items-center">
        {/* AI Halo */}
        <div className="relative mt-4 mb-6 flex items-center justify-center">
          {/* Outer pulsing rings */}
          <span className="absolute h-56 w-56 rounded-full border-2 border-primary/20 animate-pulse-ring" />
          <span
            className="absolute h-44 w-44 rounded-full border-2 border-secondary/30 animate-pulse-ring"
            style={{ animationDelay: "0.6s" }}
          />
          <span
            className="absolute h-64 w-64 rounded-full opacity-60 blur-2xl gradient-ai"
            aria-hidden
          />

          {/* Rotating gradient halo */}
          <div className="relative h-40 w-40 rounded-full p-[3px] gradient-primary shadow-elegant">
            <div className="h-full w-full rounded-full bg-card flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 gradient-mesh opacity-70" />
              <img src={logo} alt="Pharma-i" className="relative h-20 w-20 object-contain animate-float" />
              <span className="absolute top-3 right-3 inline-flex items-center gap-1 bg-secondary/90 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                <Sparkles className="h-2.5 w-2.5" /> AI
              </span>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-extrabold text-gradient">Pharma-i جاهز للمساعدة</h2>
        <p className="text-sm text-muted-foreground mt-1 mb-5">كيف يمكنني مساعدتك اليوم؟</p>

        {/* Quick prompts */}
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

        {/* SOS FAB */}
        <button
          onClick={triggerSos}
          aria-label="طوارئ SOS"
          className="relative group mt-2 active:scale-95 transition-bounce"
        >
          <span className="absolute inset-0 rounded-full bg-destructive/40 animate-pulse-ring" />
          <span
            className="absolute inset-0 rounded-full bg-destructive/40 animate-pulse-ring"
            style={{ animationDelay: "0.7s" }}
          />
          <span
            className={`relative flex flex-col items-center justify-center h-28 w-28 rounded-full text-white shadow-elegant ${
              sosArmed ? "bg-destructive scale-105" : "bg-[hsl(0_75%_38%)]"
            }`}
            style={{ background: sosArmed ? undefined : "linear-gradient(135deg, hsl(0 80% 38%), hsl(0 70% 28%))" }}
          >
            <Phone className="h-6 w-6 mb-0.5" />
            <span className="text-base font-black tracking-tight">SOS</span>
            <span className="text-[10px] font-bold opacity-90">طوارئ</span>
          </span>
        </button>
        <p className="text-[11px] text-muted-foreground mt-3">اضغط للاتصال الفوري بالطوارئ</p>

        {/* Social share */}
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
