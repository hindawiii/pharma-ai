import { FileText, Calendar, AlertOctagon, Plus, User, Droplet, LogOut, Pill, ShieldAlert, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import logo from "@/assets/pharma-i-logo.png";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

export const RecordScreen = () => {
  const { user, signOut } = useAuth();
  const { profile, loading, update } = useProfile();

  const [allergies, setAllergies] = useState<string[]>([]);
  const [chronic, setChronic] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState<string>("");
  const [newAllergy, setNewAllergy] = useState("");
  const [newChronic, setNewChronic] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setAllergies(profile.allergies ?? []);
      setChronic(profile.chronic_conditions ?? []);
      setName(profile.display_name ?? "");
      setAge(profile.age ? String(profile.age) : "");
    }
  }, [profile]);

  const persist = async (patch: { allergies?: string[]; chronic_conditions?: string[]; display_name?: string; age?: number | null }) => {
    setSaving(true);
    const { error } = await update(patch);
    setSaving(false);
    if (error) toast.error(error);
  };

  const addAllergy = async () => {
    const v = newAllergy.trim();
    if (!v) return;
    const next = [...allergies, v];
    setAllergies(next);
    setNewAllergy("");
    await persist({ allergies: next });
  };
  const removeAllergy = async (i: number) => {
    const next = allergies.filter((_, j) => j !== i);
    setAllergies(next);
    await persist({ allergies: next });
  };
  const addChronic = async () => {
    const v = newChronic.trim();
    if (!v) return;
    const next = [...chronic, v];
    setChronic(next);
    setNewChronic("");
    await persist({ chronic_conditions: next });
  };
  const removeChronic = async (i: number) => {
    const next = chronic.filter((_, j) => j !== i);
    setChronic(next);
    await persist({ chronic_conditions: next });
  };

  const saveProfile = async () => {
    await persist({ display_name: name.trim() || null as any, age: age ? parseInt(age) : null });
    toast.success("تم حفظ البيانات");
  };

  return (
    <div className="min-h-[calc(100dvh-9rem)] bg-background pb-24">
      <div className="px-4 pt-4">
        <div className="rounded-3xl gradient-ai p-5 text-white shadow-elegant relative overflow-hidden">
          <div className="absolute -bottom-12 -right-12 w-44 h-44 bg-white/10 rounded-full blur-2xl" />
          <div className="flex items-center gap-3">
            <div className="h-16 w-16 rounded-2xl bg-white/95 flex items-center justify-center shadow-card">
              <img src={logo} alt="" className="h-12 w-12 object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs opacity-80">أهلاً بعودتك</p>
              <h2 className="text-xl font-extrabold truncate">{profile?.display_name ?? user?.email ?? "ضيف"}</h2>
              <p className="text-xs opacity-90 mt-0.5">الهوية الطبية الرقمية</p>
            </div>
            {user && (
              <button
                onClick={signOut}
                className="h-10 w-10 rounded-full bg-white/15 backdrop-blur flex items-center justify-center active:scale-95"
                aria-label="تسجيل الخروج"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
        </div>
      )}

      {/* Personal info */}
      <div className="px-4 mt-4">
        <h2 className="font-bold text-base mb-3 flex items-center gap-2 text-foreground">
          <User className="h-4 w-4 text-primary" />
          البيانات الشخصية
        </h2>
        <div className="rounded-2xl p-4 bg-card border border-border shadow-soft space-y-3">
          <div>
            <label className="text-xs font-bold text-foreground block mb-1.5">الاسم الكامل</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={saveProfile}
              placeholder="اكتب اسمك..."
              className="w-full h-11 rounded-xl bg-background border-2 border-input px-3 text-sm font-semibold text-[#333333] placeholder:text-muted-foreground outline-none focus:border-primary"
              style={{ color: "#333333" }}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-foreground block mb-1.5">العمر</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              onBlur={saveProfile}
              placeholder="مثال: 35"
              className="w-full h-11 rounded-xl bg-background border-2 border-input px-3 text-sm font-semibold text-[#333333] placeholder:text-muted-foreground outline-none focus:border-primary"
              style={{ color: "#333333" }}
            />
          </div>
        </div>
      </div>

      {/* ALLERGIES — high contrast */}
      <div className="px-4 mt-5">
        <div className="rounded-2xl p-4 bg-destructive/5 border-2 border-destructive/30 shadow-soft">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="h-5 w-5 text-destructive" />
            <h3 className="font-extrabold text-base text-destructive">الحساسية الدوائية</h3>
          </div>
          <p className="text-xs text-foreground/70 mb-3 font-medium">
            تُستخدم تلقائياً لتحذيرك عند مسح أي روشتة أو دواء.
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {allergies.map((c, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 bg-white text-destructive border-2 border-destructive/40 rounded-full px-3 py-1.5 text-sm font-bold shadow-soft">
                {c}
                <button onClick={() => removeAllergy(i)} className="text-destructive/80 hover:text-destructive text-lg leading-none" aria-label="حذف">×</button>
              </span>
            ))}
            {allergies.length === 0 && <span className="text-xs text-muted-foreground">لا توجد بيانات بعد</span>}
          </div>
          <div className="flex gap-2">
            <input
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addAllergy()}
              placeholder="مثال: البنسلين، الأسبرين..."
              className="flex-1 h-11 rounded-xl bg-white border-2 border-input px-3 text-sm font-semibold placeholder:text-muted-foreground outline-none focus:border-destructive"
              style={{ color: "#333333" }}
            />
            <button onClick={addAllergy} className="h-11 px-4 rounded-xl bg-destructive text-destructive-foreground text-sm font-bold flex items-center gap-1 shadow-card active:scale-95">
              <Plus className="h-4 w-4" /> إضافة
            </button>
          </div>
        </div>
      </div>

      {/* CHRONIC */}
      <div className="px-4 mt-4">
        <div className="rounded-2xl p-4 bg-warning/10 border-2 border-warning/40 shadow-soft">
          <div className="flex items-center gap-2 mb-2">
            <AlertOctagon className="h-5 w-5 text-warning" />
            <h3 className="font-extrabold text-base text-foreground">الأمراض المزمنة</h3>
          </div>
          <p className="text-xs text-foreground/70 mb-3 font-medium">
            مثل ضغط الدم، السكري، أمراض القلب، الكلى، الربو...
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {chronic.map((c, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 bg-white text-foreground border-2 border-warning/50 rounded-full px-3 py-1.5 text-sm font-bold shadow-soft">
                {c}
                <button onClick={() => removeChronic(i)} className="text-destructive/70 hover:text-destructive text-lg leading-none" aria-label="حذف">×</button>
              </span>
            ))}
            {chronic.length === 0 && <span className="text-xs text-muted-foreground">لا توجد بيانات بعد</span>}
          </div>
          <div className="flex gap-2">
            <input
              value={newChronic}
              onChange={(e) => setNewChronic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addChronic()}
              placeholder="مثال: ضغط الدم، السكري النوع الثاني..."
              className="flex-1 h-11 rounded-xl bg-white border-2 border-input px-3 text-sm font-semibold placeholder:text-muted-foreground outline-none focus:border-warning"
              style={{ color: "#333333" }}
            />
            <button onClick={addChronic} className="h-11 px-4 rounded-xl bg-warning text-warning-foreground text-sm font-bold flex items-center gap-1 shadow-card active:scale-95">
              <Plus className="h-4 w-4" /> إضافة
            </button>
          </div>
        </div>
      </div>

      {saving && <p className="text-center text-xs text-muted-foreground mt-3">جارٍ الحفظ...</p>}
    </div>
  );
};
