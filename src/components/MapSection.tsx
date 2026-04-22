import { MapPin, Navigation, Clock, Cross } from "lucide-react";
import { Button } from "@/components/ui/button";

const places = [
  { name: "صيدلية النور", type: "صيدلية", distance: "320م", status: "مفتوح الآن", open: true, badge: "24/7" },
  { name: "مستشفى الأمل", type: "مستشفى حكومي", distance: "1.2كم", status: "مفتوح الآن", open: true, badge: "طوارئ" },
  { name: "الهلال الأحمر", type: "إسعاف", distance: "850م", status: "مفتوح الآن", open: true, badge: "SOS" },
  { name: "صيدلية الشفاء", type: "صيدلية", distance: "450م", status: "مغلق", open: false },
];

export const MapSection = () => {
  return (
    <section id="map" className="py-20 md:py-28">
      <div className="container grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5 text-xs font-bold text-secondary">
            <Navigation className="h-3.5 w-3.5" />
            خدمات لوجستية لحظية
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
            دواؤك القريب <br />
            <span className="text-gradient">على الخريطة</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            ربط ذكي بين روشتتك المسحوبة والصيدليات القريبة لمعرفة توفر الدواء حالياً،
            مع ملاحة كاملة داخل التطبيق دون الحاجة لتطبيقات خارجية.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button variant="hero">
              <MapPin className="ml-1 h-4 w-4" />
              ابحث عن أقرب صيدلية
            </Button>
            <Button variant="outline">
              <Cross className="ml-1 h-4 w-4" />
              مستشفيات الطوارئ
            </Button>
          </div>
        </div>

        <div className="relative">
          {/* Map mockup */}
          <div className="relative rounded-3xl overflow-hidden shadow-elegant border border-border h-[480px] bg-gradient-to-br from-primary/5 via-background to-secondary/5">
            {/* Grid lines */}
            <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Roads */}
            <div className="absolute top-1/3 inset-x-0 h-12 bg-gradient-to-r from-transparent via-muted to-transparent opacity-60" />
            <div className="absolute left-1/2 inset-y-0 w-12 bg-gradient-to-b from-transparent via-muted to-transparent opacity-60" />

            {/* User location */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="absolute inset-0 rounded-full animate-pulse-ring" />
                <div className="relative w-6 h-6 rounded-full gradient-primary border-4 border-white shadow-glow" />
              </div>
              <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold bg-foreground text-background px-2 py-1 rounded-md">
                موقعك
              </div>
            </div>

            {/* Pins */}
            <div className="absolute top-[20%] left-[25%]">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shadow-card animate-float">
                  <Cross className="h-5 w-5 text-white" />
                </div>
                <div className="w-1 h-2 bg-secondary -mt-1" />
              </div>
            </div>
            <div className="absolute top-[30%] right-[20%]">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-card animate-float" style={{ animationDelay: "0.5s" }}>
                  <MapPin className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
            <div className="absolute bottom-[25%] left-[35%]">
              <div className="w-10 h-10 rounded-full bg-destructive flex items-center justify-center shadow-card animate-float" style={{ animationDelay: "1s" }}>
                <Cross className="h-5 w-5 text-white" />
              </div>
            </div>

            {/* Places card */}
            <div className="absolute bottom-4 inset-x-4 glass rounded-2xl p-3 space-y-2 max-h-48 overflow-y-auto">
              {places.slice(0, 3).map((p, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/50 transition-smooth">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${p.open ? "bg-secondary/20 text-secondary" : "bg-muted text-muted-foreground"}`}>
                    <Cross className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm truncate">{p.name}</p>
                      {p.badge && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-warning/20 text-warning-foreground font-bold">{p.badge}</span>}
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      {p.status} · {p.distance}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
