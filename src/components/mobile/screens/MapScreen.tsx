import { MapPin, Navigation, Clock, Cross, Search, Phone, LocateFixed } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Place {
  name: string;
  type: string;
  distanceKm: number;
  open: boolean;
  badge?: string;
  color: "secondary" | "primary" | "destructive" | "muted";
}

const basePlaces: Place[] = [
  { name: "صيدلية النور", type: "صيدلية · 24 ساعة", distanceKm: 0.32, open: true, badge: "24/7", color: "secondary" },
  { name: "مستشفى الأمل", type: "مستشفى حكومي", distanceKm: 1.2, open: true, badge: "طوارئ", color: "primary" },
  { name: "الهلال الأحمر", type: "إسعاف", distanceKm: 0.85, open: true, badge: "SOS", color: "destructive" },
  { name: "صيدلية الشفاء", type: "صيدلية", distanceKm: 0.45, open: false, color: "muted" },
];

export const MapScreen = () => {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const locate = () => {
    if (!("geolocation" in navigator)) {
      toast.error("خدمة الموقع غير مدعومة على جهازك");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
        toast.success("تم تحديد موقعك");
      },
      (err) => {
        setLoading(false);
        toast.error("تعذر الحصول على الموقع: " + err.message);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const formatDist = (km: number) => (km < 1 ? `${Math.round(km * 1000)}م` : `${km.toFixed(1)}كم`);

  return (
    <div className="relative h-[calc(100dvh-3.5rem-64px)] overflow-hidden flex flex-col items-stretch">
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
            <button
              onClick={locate}
              className="h-8 w-8 rounded-xl gradient-primary flex items-center justify-center text-white"
              aria-label="موقعي"
            >
              <Navigation className="h-4 w-4" />
            </button>
          </div>
          {coords && (
            <div className="mt-2 mx-1 text-[11px] text-muted-foreground bg-card/80 backdrop-blur rounded-full px-3 py-1 inline-flex items-center gap-1.5">
              <LocateFixed className="h-3 w-3 text-secondary" />
              {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
            </div>
          )}
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

        {/* Locate FAB */}
        <button
          onClick={locate}
          disabled={loading}
          className="absolute bottom-4 left-4 z-10 h-12 w-12 rounded-full gradient-primary text-white shadow-elegant flex items-center justify-center active:scale-95 transition-bounce"
          aria-label="حدد موقعي"
        >
          <LocateFixed className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Bottom sheet of places */}
      <div className="bg-card rounded-t-3xl shadow-elegant -mt-6 relative z-10 p-4 pb-2 max-h-[44%] overflow-y-auto">
        <div className="mx-auto h-1 w-12 rounded-full bg-muted mb-3" />
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-base">{coords ? "الأقرب إليك" : "اضغط على الموقع لتفعيل GPS"}</h2>
          <button className="text-xs text-primary font-bold">عرض الكل</button>
        </div>
        <div className="space-y-2">
          {basePlaces.map((p, i) => (
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
                  {p.type} · {formatDist(p.distanceKm)}
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
