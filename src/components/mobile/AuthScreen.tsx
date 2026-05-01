import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import logo from "@/assets/pharma-i-logo.png";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.1A6.97 6.97 0 0 1 5.46 12c0-.73.13-1.43.36-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.93l3.66-2.83z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z" />
  </svg>
);

export const AuthScreen = () => {
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

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

  const handleGoogle = async () => {
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      setGoogleLoading(false);
      toast.error(error);
    }
    // On success, browser redirects; spinner stays.
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return toast.error("أدخل بريدك الإلكتروني");
    setForgotLoading(true);
    const { error } = await resetPassword(forgotEmail.trim());
    setForgotLoading(false);
    if (error) return toast.error(error);
    toast.success("تم إرسال رابط الاستعادة إلى بريدك");
    setForgotOpen(false);
    setForgotEmail("");
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
                  className="w-full h-12 rounded-xl bg-background border border-input pr-10 pl-3 text-sm placeholder:text-muted-foreground outline-none focus:border-primary"
                  style={{ color: "#333333" }}
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
                className="w-full h-12 rounded-xl bg-background border border-input pr-10 pl-3 text-sm placeholder:text-muted-foreground outline-none focus:border-primary"
                style={{ color: "#333333" }}
              />
            </div>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type={showPwd ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="كلمة المرور (6 أحرف فأكثر)"
                className="w-full h-12 rounded-xl bg-background border border-input pr-10 pl-10 text-sm placeholder:text-muted-foreground outline-none focus:border-primary"
                style={{ color: "#333333" }}
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground active:scale-95 transition"
                aria-label={showPwd ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {mode === "signin" && (
              <div className="flex justify-start">
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setForgotOpen(true);
                  }}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  هل نسيت كلمة المرور؟
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl gradient-primary text-white font-extrabold shadow-card active:scale-[.98] transition-bounce disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "جارٍ..." : mode === "signin" ? "دخول" : "إنشاء الحساب"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <span className="h-px flex-1 bg-border" />
            <span className="text-[11px] text-muted-foreground font-bold">أو عبر</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full h-12 rounded-xl bg-white border-2 border-input text-foreground font-bold shadow-soft active:scale-[.98] transition-bounce disabled:opacity-60 inline-flex items-center justify-center gap-3"
          >
            {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
            <span style={{ color: "#333333" }}>المتابعة عبر Google</span>
          </button>
        </div>

        <p className="text-center text-[11px] text-muted-foreground mt-4 leading-relaxed">
          عند إنشاء الحساب، سيتم حفظ ملفك الطبي بأمان لتلقي تحذيرات شخصية على الأدوية.
        </p>
      </div>

      {/* Forgot password modal — centered */}
      {forgotOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6 animate-fade-in" onClick={() => setForgotOpen(false)}>
          <div
            className="bg-card rounded-3xl shadow-elegant p-6 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-extrabold text-foreground text-center">استعادة كلمة المرور</h3>
            <p className="text-xs text-muted-foreground text-center mt-1 mb-4">
              سنرسل لك رابطًا لإعادة التعيين على بريدك الإلكتروني.
            </p>
            <form onSubmit={handleForgot} className="space-y-3">
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="بريدك الإلكتروني"
                  className="w-full h-12 rounded-xl bg-background border border-input pr-10 pl-3 text-sm outline-none focus:border-primary"
                  style={{ color: "#333333" }}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setForgotOpen(false)}
                  className="flex-1 h-12 rounded-xl bg-muted text-foreground font-bold active:scale-[.98] transition-bounce"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="flex-1 h-12 rounded-xl gradient-primary text-white font-extrabold shadow-card active:scale-[.98] transition-bounce disabled:opacity-60 inline-flex items-center justify-center gap-2"
                >
                  {forgotLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  إرسال
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
