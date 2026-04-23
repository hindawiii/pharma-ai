import { ChevronLeft, FileText, Calendar, AlertOctagon, Plus, User, Droplet, Cake } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/pharma-i-logo.png";

const history = [
  { title: "روشتة د. أحمد سمير", date: "12 أبريل 2026", tag: "نزلة معوية" },
  { title: "تحاليل دم شاملة", date: "28 مارس 2026", tag: "روتيني" },
  { title: "روشتة د. منى فؤاد", date: "10 مارس 2026", tag: "حساسية" },
];

export const RecordScreen = () => {
  const [conditions, setConditions] = useState<string[]>(["ضغط الدم", "حساسية البنسلين"]);
  const [newItem, setNewItem] = useState("");

  const addItem = () => {
    const v = newItem.trim();
    if (!v) return;
    setConditions((c) => [...c, v]);
    setNewItem("");
  };

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
              <p className="text-xs opacity-90 mt-0.5">الهوية الطبية الرقمية</p>
            </div>
          </div>
        </div>
      </div>

      {/* Personal info: Name / Age / Blood */}
      <div className="px-4 mt-4">
        <h2 className="font-bold text-base mb-3 flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          البيانات الشخصية
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl p-3 bg-card border border-border shadow-soft text-center">
            <div className="mx-auto h-10 w-10 rounded-2xl bg-primary/15 text-primary flex items-center justify-center mb-2">
              <User className="h-5 w-5" />
            </div>
            <p className="text-[10px] text-muted-foreground">الاسم</p>
            <p className="text-sm font-extrabold mt-0.5">محمد عبدالله</p>
          </div>
          <div className="rounded-2xl p-3 bg-card border border-border shadow-soft text-center">
            <div className="mx-auto h-10 w-10 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center mb-2">
              <Cake className="h-5 w-5" />
            </div>
            <p className="text-[10px] text-muted-foreground">العمر</p>
            <p className="text-sm font-extrabold mt-0.5">32 سنة</p>
          </div>
          <div className="rounded-2xl p-3 bg-card border border-border shadow-soft text-center">
            <div className="mx-auto h-10 w-10 rounded-2xl bg-destructive/15 text-destructive flex items-center justify-center mb-2">
              <Droplet className="h-5 w-5" />
            </div>
            <p className="text-[10px] text-muted-foreground">فصيلة الدم</p>
            <p className="text-sm font-extrabold mt-0.5">O+</p>
          </div>
        </div>
      </div>

      {/* Chronic diseases & allergies */}
      <div className="px-4 mt-5">
        <div className="rounded-2xl p-4 bg-warning/10 border border-warning/30 shadow-soft">
          <div className="flex items-center gap-2 mb-3">
            <AlertOctagon className="h-4 w-4 text-warning-foreground" />
            <h3 className="font-bold text-sm">الأمراض المزمنة والحساسية</h3>
          </div>
          <p className="text-[11px] text-muted-foreground mb-3">
            معلومات حيوية تظهر للطوارئ والصيدلي عند المسح السريع.
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {conditions.map((c, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 bg-white text-warning-foreground border border-warning/40 rounded-full px-3 py-1 text-xs font-bold shadow-soft"
              >
                {c}
                <button
                  onClick={() => setConditions((arr) => arr.filter((_, j) => j !== i))}
                  className="text-destructive/70 hover:text-destructive"
                  aria-label="حذف"
                >
                  ×
                </button>
              </span>
            ))}
            {conditions.length === 0 && (
              <span className="text-xs text-muted-foreground">لا توجد بيانات بعد</span>
            )}
          </div>
          <div className="flex gap-2">
            <input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addItem()}
              placeholder="مثال: السكري، حساسية الفول السوداني..."
              className="flex-1 h-10 rounded-xl bg-white border border-border px-3 text-xs outline-none focus:border-primary"
            />
            <button
              onClick={addItem}
              className="h-10 px-3 rounded-xl gradient-primary text-white text-xs font-bold flex items-center gap-1 shadow-card"
            >
              <Plus className="h-4 w-4" /> إضافة
            </button>
          </div>
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
