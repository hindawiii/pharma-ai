import { FileHeart, Heart, Droplet, Activity, ChevronLeft, FileText, Calendar } from "lucide-react";
import logo from "@/assets/pharma-i-logo.png";

const vitals = [
  { label: "النبض", value: "78", unit: "نبضة", icon: Heart, color: "destructive" },
  { label: "السكر", value: "98", unit: "mg/dl", icon: Droplet, color: "primary" },
  { label: "الضغط", value: "120/80", unit: "mmHg", icon: Activity, color: "secondary" },
];

const history = [
  { title: "روشتة د. أحمد سمير", date: "12 أبريل 2026", tag: "نزلة معوية" },
  { title: "تحاليل دم شاملة", date: "28 مارس 2026", tag: "روتيني" },
  { title: "روشتة د. منى فؤاد", date: "10 مارس 2026", tag: "حساسية" },
];

export const RecordScreen = () => {
  return (
    <div className="min-h-[calc(100dvh-9rem)] bg-background pb-24">
      {/* Profile card */}
      <div className="px-4 pt-4">
        <div className="rounded-3xl gradient-ai p-5 text-white shadow-elegant relative overflow-hidden">
          <div className="absolute -bottom-12 -right-12 w-44 h-44 bg-white/10 rounded-full blur-2xl" />
          <div className="flex items-center gap-3">
            <div className="h-16 w-16 rounded-2xl bg-white/95 flex items-center justify-center shadow-card">
              <img src={logo} alt="" className="h-12 w-12 object-contain" />
            </div>
            <div>
              <p className="text-xs opacity-80">أهلاً بعودتك</p>
              <h2 className="text-xl font-extrabold">محمد عبدالله</h2>
              <p className="text-xs opacity-90 mt-0.5">فصيلة الدم: O+ · 32 سنة</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vitals */}
      <div className="px-4 mt-4">
        <h2 className="font-bold text-base mb-3 flex items-center gap-2">
          <FileHeart className="h-4 w-4 text-primary" />
          مؤشراتك الحيوية
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {vitals.map((v, i) => {
            const Icon = v.icon;
            return (
              <div key={i} className="rounded-2xl p-3 bg-card border border-border shadow-soft text-center">
                <div className={`mx-auto h-10 w-10 rounded-2xl bg-${v.color}/15 text-${v.color} flex items-center justify-center mb-2`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-base font-extrabold">{v.value}</p>
                <p className="text-[10px] text-muted-foreground">{v.unit}</p>
                <p className="text-[10px] font-bold mt-0.5">{v.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* History */}
      <div className="px-4 mt-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-secondary" />
            سجل الروشتات والتحاليل
          </h2>
          <button className="text-xs text-primary font-bold">الكل</button>
        </div>
        <div className="space-y-2">
          {history.map((h, i) => (
            <button
              key={i}
              className="w-full flex items-center gap-3 p-3 rounded-2xl bg-card border border-border shadow-soft text-right active:scale-[0.99] transition-bounce"
            >
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{h.title}</p>
                <p className="text-xs text-muted-foreground">{h.date}</p>
              </div>
              <span className="text-[10px] px-2 py-1 rounded-full bg-secondary/15 text-secondary font-bold">
                {h.tag}
              </span>
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
