import { Check, Crown, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Pricing = () => {
  return (
    <section id="pricing" className="py-20 md:py-28 bg-muted/40 relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-50" />
      <div className="container relative">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            ابدأ مجاناً <span className="text-gradient">وارتقِ متى شئت</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            نظام ربحي مبسّط وعادل — استمتع بـ 4 محاولات يومياً مجاناً، أو فاجئ نفسك بتجربة بلا حدود.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Free */}
          <div className="rounded-3xl bg-card border border-border p-8 shadow-soft">
            <div className="text-sm font-bold text-muted-foreground mb-2">مجاني</div>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-5xl font-extrabold">0</span>
              <span className="text-muted-foreground">دائماً</span>
            </div>
            <ul className="space-y-3 mb-8 text-sm">
              {["4 محاولات مسح يومياً", "خريطة الصيدليات", "السجل الطبي الأساسي", "تذكيرات الجرعات"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-secondary flex-shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full">ابدأ مجاناً</Button>
          </div>

          {/* Rewarded */}
          <div className="rounded-3xl bg-card border-2 border-secondary/50 p-8 shadow-card relative">
            <div className="absolute -top-3 right-1/2 translate-x-1/2 bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full">
              ذكي ومُربح
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Play className="h-4 w-4 text-secondary" />
              <div className="text-sm font-bold text-secondary">المكافآت</div>
            </div>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-5xl font-extrabold">+1</span>
              <span className="text-muted-foreground">/ فيديو</span>
            </div>
            <ul className="space-y-3 mb-8 text-sm">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-secondary flex-shrink-0" /> كل ميزات الباقة المجانية</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-secondary flex-shrink-0" /> فيديو قصير = محاولة إضافية</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-secondary flex-shrink-0" /> فوري بدون انتظار</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-secondary flex-shrink-0" /> بلا تسجيل بطاقة</li>
            </ul>
            <Button variant="secondary" className="w-full">شاهد كيف يعمل</Button>
          </div>

          {/* Premium */}
          <div className="rounded-3xl gradient-hero p-8 shadow-elegant relative text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-4 w-4" />
                <div className="text-sm font-bold">Premium</div>
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-5xl font-extrabold">29</span>
                <span className="opacity-80">جنيه/شهر</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                {["محاولات مسح غير محدودة", "إزالة جميع الإعلانات", "أولوية في الدعم الفني", "محرك بدائل متقدم", "تنبيهات للمراقبين"].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 flex-shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <Button variant="glow" className="w-full">
                ترقية الآن
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
