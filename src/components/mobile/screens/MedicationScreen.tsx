import { Pill, Clock, Bell, AlertTriangle, Plus, CheckCircle2, ShieldAlert } from "lucide-react";

const reminders = [
  { name: "أوجمنتين 1g", dose: "قرص واحد", time: "08:00 صباحاً", taken: true, color: "primary" },
  { name: "بانادول إكسترا", dose: "قرص واحد", time: "02:00 ظهراً", taken: false, color: "secondary" },
  { name: "كونكور 5mg", dose: "نصف قرص", time: "09:00 مساءً", taken: false, color: "accent" },
];

export const MedicationScreen = () => {
  return (
    <div className="min-h-[calc(100dvh-9rem)] bg-background pb-24">
      {/* Header card */}
      <div className="px-4 pt-4">
        <div className="rounded-3xl gradient-hero p-5 text-white shadow-elegant relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <p className="text-xs font-bold opacity-80">تقدّمك اليوم</p>
          <div className="flex items-end justify-between mt-2">
            <div>
              <p className="text-4xl font-extrabold">1<span className="text-white/60 text-2xl">/3</span></p>
              <p className="text-sm opacity-90 mt-1">جرعات تم تناولها</p>
            </div>
            <div className="h-16 w-16 rounded-full border-4 border-white/30 flex items-center justify-center text-lg font-bold">
              33%
            </div>
          </div>
        </div>
      </div>

      {/* Drug interaction checker */}
      <div className="px-4 mt-4">
        <button className="w-full text-right rounded-2xl p-4 bg-warning/10 border border-warning/30 flex items-center gap-3 transition-smooth active:scale-[0.99]">
          <div className="h-12 w-12 rounded-2xl bg-warning text-warning-foreground flex items-center justify-center shadow-soft">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm">فاحص التداخل الدوائي</p>
            <p className="text-xs text-muted-foreground mt-0.5">تحقق من أمان دمج أدويتك معاً</p>
          </div>
          <Plus className="h-5 w-5 text-warning-foreground/70" />
        </button>
      </div>

      {/* Today reminders */}
      <div className="px-4 mt-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-base flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            تذكيرات اليوم
          </h2>
          <button className="inline-flex items-center gap-1 text-xs text-primary font-bold">
            <Plus className="h-3.5 w-3.5" /> إضافة
          </button>
        </div>

        <div className="space-y-3">
          {reminders.map((r, i) => (
            <div
              key={i}
              className="rounded-2xl p-4 bg-card border border-border shadow-soft flex items-center gap-3"
            >
              <div className={`h-12 w-12 rounded-2xl bg-${r.color}/15 text-${r.color} flex items-center justify-center`}>
                <Pill className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">{r.name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                  <Clock className="h-3 w-3" />
                  {r.time} · {r.dose}
                </p>
              </div>
              <button
                aria-label={r.taken ? "تم" : "وضع علامة كمأخوذ"}
                className={`h-10 w-10 rounded-full flex items-center justify-center transition-bounce ${
                  r.taken ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                <CheckCircle2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Active prescription */}
      <div className="px-4 mt-5">
        <div className="rounded-2xl p-4 bg-card border border-border shadow-soft">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-secondary" />
            <h3 className="font-bold text-sm">روشتة فعّالة — د. أحمد سمير</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            علاج لمدة 7 أيام · باقي 4 أيام. لا تنسَ أخذ الجرعة بعد الأكل بنصف ساعة.
          </p>
        </div>
      </div>
    </div>
  );
};
