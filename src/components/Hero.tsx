import { Button } from "@/components/ui/button";
import { ScanLine, Sparkles, ShieldCheck } from "lucide-react";
import heroImg from "@/assets/hero-scanner.jpg";

export const Hero = () => {
  return (
    <section className="relative pt-28 md:pt-36 pb-16 md:pb-24 overflow-hidden gradient-mesh">
      <div className="container grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-7 animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-bold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            مدعوم بالذكاء الاصطناعي · يقرأ خط الطبيب
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
            <span className="text-gradient">Pharma-i</span>
            <br />
            صيدليتك الذكية
            <br />
            <span className="text-foreground/80 text-3xl md:text-4xl lg:text-5xl">في جيبك</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
            صَوِّر روشتتك، اقرأ الباركود، اعثر على أقرب صيدلية، واكتشف بدائل دوائك
            بضغطة زر — بدقة الذكاء الاصطناعي وأمان الرعاية الطبية.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button variant="hero" size="xl">
              <ScanLine className="ml-1 h-5 w-5" />
              ابدأ المسح الآن
            </Button>
            <Button variant="outline" size="xl">
              شاهد العرض التوضيحي
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-secondary" />
              <span>4 محاولات مجانية يومياً</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              <span>دقة AI تصل إلى 98%</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 gradient-primary blur-3xl opacity-30 rounded-full" />
          <div className="relative rounded-[2rem] overflow-hidden shadow-elegant border border-white/40 animate-float">
            <img
              src={heroImg}
              alt="كبسولة دواء ذكية تعرض شبكة الذكاء الاصطناعي"
              className="w-full h-auto"
              width={1280}
              height={1280}
            />
          </div>

          {/* Floating stat cards */}
          <div className="absolute -top-4 -right-4 md:top-6 md:-right-8 glass rounded-2xl p-4 shadow-card animate-float" style={{ animationDelay: "0.5s" }}>
            <div className="text-xs text-muted-foreground">دواء تم تحليله</div>
            <div className="text-2xl font-bold text-gradient">+12,400</div>
          </div>
          <div className="absolute -bottom-4 -left-4 md:bottom-10 md:-left-8 glass rounded-2xl p-4 shadow-card animate-float" style={{ animationDelay: "1s" }}>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <div className="text-xs font-semibold">صيدلية متاحة الآن</div>
            </div>
            <div className="text-sm text-muted-foreground mt-1">على بُعد 320م</div>
          </div>
        </div>
      </div>
    </section>
  );
};
