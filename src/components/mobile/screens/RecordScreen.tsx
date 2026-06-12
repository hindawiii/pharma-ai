import { Calendar, AlertOctagon, Plus, User, LogOut, ShieldAlert, Loader2, Pencil, Save, X, Droplet } from "lucide-react";
import { useEffect, useState } from "react";
import logo from "@/assets/pharma-i-logo.png";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const CHRONIC_BLUE = "#1A237E";

export const RecordScreen = () => {
  const { user, signOut } = useAuth();
  const { profile, loading, update } = useProfile();

  // Editable form state (mirrors profile)
  const [allergies, setAllergies] = useState<string[]>([]);
  const [chronic, setChronic] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState<string>("");
  const [bloodType, setBloodType] = useState<string>("");
  const [newAllergy, setNewAllergy] = useState("");
  const [newChronic, setNewChronic] = useState("");

  const [editing, setEditing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setAllergies(profile.allergies ?? []);
      setChronic(profile.chronic_conditions ?? []);
      setName(profile.display_name ?? "");
      setAge(profile.age ? String(profile.age) : "");
      setBloodType(profile.blood_type ?? "");
    }
  }, [profile]);

  const cancelEdit = () => {
    if (profile) {
      setAllergies(profile.allergies ?? []);
      setChronic(profile.chronic_conditions ?? []);
      setName(profile.display_name ?? "");
      setAge(profile.age ? String(profile.age) : "");
      setBloodType(profile.blood_type ?? "");
    }
    setNewAllergy("");
    setNewChronic("");
    setEditing(false);
  };

  const requestSave = () => setConfirmOpen(true);

  const confirmSave = async () => {
    setSaving(true);
    const { error } = await update({
      display_name: name.trim() || null,
      age: age ? parseInt(age) : null,
      blood_type: bloodType || null,
      allergies,
      chronic_conditions: chronic,
    });
    setSaving(false);
    setConfirmOpen(false);
    if (error) {
      toast.error(error);
      return;
    }
    setEditing(false);
    toast.success("تم حفظ التعديلات");
  };

  const addAllergy = () => {
    const v = newAllergy.trim();
    if (!v) return;
    setAllergies((prev) => [...prev, v]);
    setNewAllergy("");
  };
  const removeAllergy = (i: number) => setAllergies((prev) => prev.filter((_, j) => j !== i));
  const addChronic = () => {
    const v = newChronic.trim();
    if (!v) return;
    setChronic((prev) => [...prev, v]);
    setNewChronic("");
  };
  const removeChronic = (i: number) => setChronic((prev) => prev.filter((_, j) => j !== i));

  const ro = !editing; // read-only

  return (
    <div className="min-h-[calc(100dvh-9rem)] bg-background pb-24" dir="rtl">
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

      {/* Edit / Save controls */}
      <div className="px-4 mt-4 flex items-center justify-between">
        <h2 className="font-bold text-base flex items-center gap-2 text-foreground">
          <User className="h-4 w-4 text-primary" />
          البيانات الشخصية
        </h2>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl gradient-primary text-white text-xs font-extrabold shadow-card active:scale-95"
          >
            <Pencil className="h-3.5 w-3.5" />
            تعديل الملف
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={cancelEdit}
              className="inline-flex items-center gap-1 h-9 px-3 rounded-xl bg-muted text-foreground text-xs font-bold active:scale-95"
            >
              <X className="h-3.5 w-3.5" />
              إلغاء
            </button>
            <button
              onClick={requestSave}
              className="inline-flex items-center gap-1 h-9 px-3 rounded-xl bg-secondary text-white text-xs font-extrabold shadow-card active:scale-95"
            >
              <Save className="h-3.5 w-3.5" />
              حفظ
            </button>
          </div>
        )}
      </div>

      {/* Personal info */}
      <div className="px-4 mt-3">
        <div className="rounded-2xl p-4 bg-card border border-border shadow-soft space-y-3">
          <div>
            <label className="text-xs font-bold text-foreground block mb-1.5">الاسم بالكامل</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              readOnly={ro}
              placeholder="اكتب اسمك الكامل..."
              className={`w-full h-11 rounded-xl border-2 px-3 text-sm font-semibold placeholder:text-muted-foreground outline-none ${
                ro ? "bg-muted/50 border-transparent" : "bg-background border-input focus:border-primary"
              }`}
              style={{ color: "#333333" }}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-foreground block mb-1.5">العمر</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                readOnly={ro}
                placeholder="مثال: 35"
                className={`w-full h-11 rounded-xl border-2 px-3 text-sm font-semibold placeholder:text-muted-foreground outline-none ${
                  ro ? "bg-muted/50 border-transparent" : "bg-background border-input focus:border-primary"
                }`}
                style={{ color: "#333333" }}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-foreground mb-1.5 flex items-center gap-1">
                <Droplet className="h-3 w-3 text-destructive" />
                فصيلة الدم
              </label>
              {ro ? (
                <div className="w-full h-11 rounded-xl bg-muted/50 px-3 text-sm font-bold flex items-center" style={{ color: "#333333" }}>
                  {bloodType || <span className="text-muted-foreground font-normal">—</span>}
                </div>
              ) : (
                <select
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="w-full h-11 rounded-xl bg-background border-2 border-input px-3 text-sm font-semibold outline-none focus:border-primary"
                  style={{ color: "#333333" }}
                >
                  <option value="">— اختر —</option>
                  {BLOOD_TYPES.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ALLERGIES */}
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
                {!ro && (
                  <button onClick={() => removeAllergy(i)} className="text-destructive/80 hover:text-destructive text-lg leading-none" aria-label="حذف">×</button>
                )}
              </span>
            ))}
            {allergies.length === 0 && <span className="text-xs text-muted-foreground">لا توجد بيانات بعد</span>}
          </div>
          {!ro && (
            <div className="flex gap-2">
              <input
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAllergy())}
                placeholder="مثال: البنسلين، الأسبرين..."
                className="flex-1 h-11 rounded-xl bg-white border-2 border-input px-3 text-sm font-semibold placeholder:text-muted-foreground outline-none focus:border-destructive"
                style={{ color: "#333333" }}
              />
              <button onClick={addAllergy} className="h-11 px-4 rounded-xl bg-destructive text-destructive-foreground text-sm font-bold flex items-center gap-1 shadow-card active:scale-95">
                <Plus className="h-4 w-4" /> إضافة
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CHRONIC — Bold dark blue */}
      <div className="px-4 mt-4">
        <div className="rounded-2xl p-4 bg-warning/10 border-2 border-warning/40 shadow-soft">
          <div className="flex items-center gap-2 mb-2">
            <AlertOctagon className="h-5 w-5" style={{ color: CHRONIC_BLUE }} />
            <h3 className="font-extrabold text-base" style={{ color: CHRONIC_BLUE }}>الأمراض المزمنة</h3>
          </div>
          <p className="text-xs mb-3 font-bold" style={{ color: CHRONIC_BLUE, opacity: 0.85 }}>
            مثل ضغط الدم، السكري، أمراض القلب، الكلى، الربو...
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {chronic.map((c, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 bg-white border-2 rounded-full px-3 py-1.5 text-sm font-extrabold shadow-soft"
                style={{ color: CHRONIC_BLUE, borderColor: CHRONIC_BLUE }}
              >
                {c}
                {!ro && (
                  <button onClick={() => removeChronic(i)} className="text-destructive/70 hover:text-destructive text-lg leading-none" aria-label="حذف">×</button>
                )}
              </span>
            ))}
            {chronic.length === 0 && <span className="text-xs text-muted-foreground">لا توجد بيانات بعد</span>}
          </div>
          {!ro && (
            <div className="flex gap-2">
              <input
                value={newChronic}
                onChange={(e) => setNewChronic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addChronic())}
                placeholder="مثال: ضغط الدم، السكري النوع الثاني..."
                className="flex-1 h-11 rounded-xl bg-white border-2 px-3 text-sm font-bold placeholder:text-muted-foreground outline-none"
                style={{ color: CHRONIC_BLUE, borderColor: CHRONIC_BLUE + "55" }}
              />
              <button
                onClick={addChronic}
                className="h-11 px-4 rounded-xl text-white text-sm font-bold flex items-center gap-1 shadow-card active:scale-95"
                style={{ backgroundColor: CHRONIC_BLUE }}
              >
                <Plus className="h-4 w-4" /> إضافة
              </button>
            </div>
          )}
        </div>
      </div>

      <LocalHealthDataPanel />


      {/* Confirm save modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6 animate-fade-in" onClick={() => !saving && setConfirmOpen(false)}>
          <div className="bg-card rounded-3xl shadow-elegant p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto h-14 w-14 rounded-2xl bg-secondary/15 flex items-center justify-center mb-3">
              <Save className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="text-lg font-extrabold text-center text-foreground">هل أنت متأكد من حفظ التعديلات؟</h3>
            <p className="text-xs text-center text-muted-foreground mt-1 mb-5">
              سيتم تحديث ملفك الطبي وستُستخدم البيانات في تحذيرات الأدوية والحساسية.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmOpen(false)}
                disabled={saving}
                className="flex-1 h-12 rounded-xl bg-muted text-foreground font-bold active:scale-[.98] transition-bounce disabled:opacity-60"
              >
                لا، تراجع
              </button>
              <button
                onClick={confirmSave}
                disabled={saving}
                className="flex-1 h-12 rounded-xl gradient-primary text-white font-extrabold shadow-card active:scale-[.98] transition-bounce disabled:opacity-60 inline-flex items-center justify-center gap-2"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {saving ? "جارٍ الحفظ..." : "نعم، احفظ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
