import { MapPin, Navigation, Clock, Cross, Search, Phone } from "lucide-react";

const places = [
  { name: "صيدلية النور", type: "صيدلية · 24 ساعة", distance: "320م", open: true, badge: "24/7", color: "secondary" },
  { name: "مستشفى الأمل", type: "مستشفى حكومي", distance: "1.2كم", open: true, badge: "طوارئ", color: "primary" },
  { name: "الهلال الأحمر", type: "إسعاف", distance: "850م", open: true, badge: "SOS", color: "destructive" },
  { name: "صيدلية الشفاء", type: "صيدلية", distance: "450م", open: false, color: "muted" },
];

export const MapScreen = () => {
  return (
    <div className="relative min-h-[calc(100dvh-9rem)] flex flex-col">
      {/* Map */}
      <div className="relative flex-1 bg-gradient-to-br from-primary/10 via-background to-secondary/10 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="mgrid" width="36" height="36" patternUnits="userSpaceOnUse">
              <path d="M 36 0 L 0 0 0 36" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mgrid)" />
        </svg>
        <div className="absolute top-1/3 inset-x-0 h-10 bg-muted/50 blur-sm" />
        <div className="absolute left-1/2 inset-y-0 w-10 bg-muted/50 blur-sm" />

        {/* Search */}
        <div className="absolute top-3 inset-x-3 z-10">
          <div className="glass rounded-2xl flex items-center px-4 h-12 shadow-card">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="ابحث عن دواء أو صيدلية..."
              className="flex-1 bg-transparent border-0 outline-none px-3 text-sm"
            />
            <button className="h-8 w-8 rounded-xl gradient-primary flex items-center justify-center text-white">
              <Navigation className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Pins */}
        <div className="absolute top-[35%] right-[25%]">
          <div className="h-10 w-10 rounded-full bg-secondary text-white flex items-center justify-center shadow-card animate-float">
            <Cross className="h-5 w-5" />
          </div>
        </div>
        <div className="absolute top-[45%] left-[20%]">
          <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center shadow-card animate-float" style={{ animationDelay: "0.4s" }}>
            <MapPin className="h-5 w-5" />
          </div>
        </div>
        <div className="absolute top-[25%] left-[35%]">
          <div className="h-10 w-10 rounded-full bg-destructive text-white flex items-center justify-center shadow-card animate-float" style={{ animationDelay: "0.8s" }}>
            <Cross className="h-5 w-5" />
          </div>
        </div>

        {/* User */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="absolute inset-0 rounded-full animate-pulse-ring" />
            <div className="relative h-5 w-5 rounded-full gradient-primary border-4 border-white shadow-glow" />
          </div>
        </div>
      </div>

      {/* Bottom sheet of places */}
      <div className="bg-card rounded-t-3xl shadow-elegant -mt-6 relative z-10 p-4 pb-24">
        <div className="mx-auto h-1 w-12 rounded-full bg-muted mb-3" />
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-base">الأقرب إليك</h2>
          <button className="text-xs text-primary font-bold">عرض الكل</button>
        </div>
        <div className="space-y-2">
          {places.map((p, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-2xl bg-background border border-border hover:shadow-soft transition-smooth"
            >
              <div
                className={`h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-soft ${
                  p.open ? `bg-${p.color}` : "bg-muted text-muted-foreground"
                }`}
              >
                <Cross className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm truncate">{p.name}</p>
                  {p.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-warning/20 text-warning-foreground font-bold">
                      {p.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                  <Clock className="h-3 w-3" />
                  {p.type} · {p.distance}
                </p>
              </div>
              <button className="h-10 w-10 rounded-xl gradient-primary text-white flex items-center justify-center" aria-label="اتصال">
                <Phone className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
