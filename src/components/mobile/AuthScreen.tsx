import { useState } from "react";
import { Mail, Lock, User, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const AuthScreen = () => {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } =
      mode === "signin"
        ? await signIn(email, password)
        : await signUp(email, password, name || undefined);
    setLoading(false);
    if (error) {
      toast.error(error.includes("already") ? "هذا البريد مسجّل بالفعل" : error);
    } else if (mode === "signup") {
      toast.success("تم إنشاء الحساب! يمكنك تسجيل الدخول الآن.");
      setMode("signin");
    }
  };

  return (
    <div className="min-h-dvh bg-background flex flex-col items-center justify-center p-6" dir="rtl">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 rounded-3xl gradient-primary text-white items-center justify-center shadow-elegant mb-4">
            <Sparkles className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-primary">Pharma-i</h1>
          <p className="text-sm text-muted-foreground mt-1">مساعدك الطبي الذكي</p>
        </div>

        <div className="bg-card border border-border rounded-3xl p-6 shadow-card">
          <div className="grid grid-cols-2 bg-muted rounded-2xl p-1 mb-5">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`py-2 rounded-xl text-sm font-bold transition-smooth ${
                mode === "signin" ? "bg-card shadow-soft text-primary" : "text-muted-foreground"
              }`}
            >
              تسجيل الدخول
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`py-2 rounded-xl text-sm font-bold transition-smooth ${
                mode === "signup" ? "bg-card shadow-soft text-primary" : "text-muted-foreground"
              }`}
            >
              حساب جديد
            </button>
          </div>

          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" && (
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="الاسم الكامل"
                  className="w-full h-12 rounded-xl bg-background border border-input pr-10 pl-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="البريد الإلكتروني"
                className="w-full h-12 rounded-xl bg-background border border-input pr-10 pl-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
              />
            </div>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="كلمة المرور (6 أحرف فأكثر)"
                className="w-full h-12 rounded-xl bg-background border border-input pr-10 pl-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl gradient-primary text-white font-extrabold shadow-card active:scale-[.98] transition-bounce disabled:opacity-60"
            >
              {loading ? "جارٍ..." : mode === "signin" ? "دخول" : "إنشاء الحساب"}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-muted-foreground mt-4 leading-relaxed">
          عند إنشاء الحساب، سيتم حفظ ملفك الطبي بأمان لتلقي تحذيرات شخصية على الأدوية.
        </p>
      </div>
    </div>
  );
};
