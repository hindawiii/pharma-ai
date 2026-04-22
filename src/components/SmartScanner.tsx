import { Camera, ScanBarcode, Image as ImageIcon, Volume2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SmartScanner = () => {
  return (
    <section id="scanner" className="py-20 md:py-28 relative overflow-hidden">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            القلب النابض للتطبيق
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            <span className="text-gradient">الصندوق الذكي</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            واجهة كاميرا واحدة لكل احتياجاتك: صَوِّر الروشتة، اقرأ الباركود، أو ارفع صورة من الاستوديو.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-center">
          {/* Phone mockup */}
          <div className="lg:col-span-2 relative mx-auto">
            <div className="relative w-[280px] h-[560px] rounded-[3rem] bg-gradient-to-b from-slate-900 to-slate-800 p-3 shadow-elegant">
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-20" />
              <div className="relative w-full h-full rounded-[2.4rem] overflow-hidden bg-slate-950">
                {/* Camera viewport */}
                <div className="relative h-full w-full bg-gradient-to-br from-slate-800 via-slate-900 to-black flex flex-col">
                  <div className="flex-1 relative overflow-hidden">
                    {/* Scanner frame */}
                    <div className="absolute inset-8 border-2 border-primary-glow/60 rounded-2xl">
                      <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-secondary rounded-tr-2xl" />
                      <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-secondary rounded-tl-2xl" />
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-secondary rounded-br-2xl" />
                      <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-secondary rounded-bl-2xl" />
                      {/* Scan line */}
                      <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-secondary-glow to-transparent shadow-green-glow animate-scan-line" />
                    </div>
                    <div className="absolute top-4 inset-x-4 flex justify-between text-white/80 text-xs">
                      <span className="px-2 py-1 rounded-md bg-white/10 backdrop-blur">روشتة</span>
                      <span className="px-2 py-1 rounded-md bg-secondary text-secondary-foreground font-bold">
                        وضع AI
                      </span>
                    </div>
                    <div className="absolute bottom-24 inset-x-6 text-center text-white/90 text-sm font-medium">
                      ضع الروشتة داخل الإطار
                    </div>
                  </div>
                  {/* Action bar */}
                  <div className="bg-slate-950/80 backdrop-blur p-4 flex items-center justify-around">
                    <button className="text-white/70 flex flex-col items-center gap-1">
                      <ImageIcon className="h-6 w-6" />
                      <span className="text-[10px]">الاستوديو</span>
                    </button>
                    <button className="relative w-16 h-16 rounded-full bg-white flex items-center justify-center animate-pulse-ring">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary" />
                    </button>
                    <button className="text-white/70 flex flex-col items-center gap-1">
                      <ScanBarcode className="h-6 w-6" />
                      <span className="text-[10px]">باركود</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features list */}
          <div className="lg:col-span-3 space-y-5">
            {[
              { icon: Camera, color: "primary", title: "تصوير الروشتات", desc: "كاميرا ذكية مع تثبيت تلقائي وقراءة فورية لخطوط الأطباء." },
              { icon: ScanBarcode, color: "secondary", title: "قراءة الباركود", desc: "تعرّف على الدواء فوراً عبر الباركود واطّلع على نشرته كاملة." },
              { icon: Sparkles, color: "accent", title: "تحليل AI متطور", desc: "نموذج ذكاء اصطناعي مدرّب على آلاف الروشتات الطبية والمصطلحات الدوائية." },
              { icon: Volume2, color: "primary", title: "التدقيق الصوتي", desc: "نطق اسم الدواء والجرعة صوتياً لمساعدة كبار السن وضِعاف البصر." },
            ].map((f, i) => (
              <div
                key={i}
                className="group flex gap-4 p-5 rounded-2xl gradient-card border border-border hover:shadow-card hover:-translate-y-1 transition-smooth"
              >
                <div className={`flex-shrink-0 h-12 w-12 rounded-xl flex items-center justify-center bg-${f.color}/10 text-${f.color} group-hover:scale-110 transition-bounce`}>
                  <f.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
