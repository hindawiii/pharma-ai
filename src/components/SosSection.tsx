import { Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SosSection = () => {
  return (
    <section className="py-20 md:py-24">
      <div className="container">
        <div className="rounded-[2.5rem] gradient-emergency p-10 md:p-14 shadow-elegant relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

          <div className="relative grid md:grid-cols-2 gap-10 items-center text-white">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur px-4 py-1.5 text-xs font-bold mb-4">
                <Phone className="h-3.5 w-3.5" />
                طوارئ بضغطة واحدة
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                زر SOS<br />
                ينقذ حياة
              </h2>
              <p className="text-white/90 text-lg leading-relaxed mb-6">
                اتصال فوري بالإسعاف مع إرسال موقعك الجغرافي تلقائياً عبر SMS لجهات الاتصال الموثوقة.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="glow" size="lg">
                  <Phone className="ml-1 h-4 w-4" />
                  جرّب زر الطوارئ
                </Button>
                <Button variant="outline" size="lg" className="bg-white/10 border-white/40 text-white hover:bg-white hover:text-destructive">
                  <MapPin className="ml-1 h-4 w-4" />
                  مشاركة الموقع
                </Button>
              </div>
            </div>

            <div className="flex justify-center">
              <button className="relative group" aria-label="زر SOS">
                <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse-ring" />
                <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse-ring" style={{ animationDelay: "0.7s" }} />
                <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full bg-white text-destructive flex flex-col items-center justify-center shadow-elegant group-hover:scale-105 transition-bounce">
                  <span className="text-6xl md:text-7xl font-black tracking-tighter">SOS</span>
                  <span className="text-xs font-bold mt-1 opacity-80">اضغط مطولاً</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
