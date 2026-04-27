import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase puts the recovery token in the URL hash
    const hash = window.location.hash;
    if (hash.includes("type=recovery") || hash.includes("access_token")) {
      setReady(true);
    } else {
      // Also accept if a session is established by Supabase auto-handler
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) setReady(true);
      });
    }
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("كلمة المرور قصيرة (6 أحرف فأكثر)");
    if (password !== confirm) return toast.error("كلمتا المرور غير متطابقتين");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("تم تحديث كلمة المرور");
    setTimeout(() => navigate("/"), 600);
  };

  return (
    <div className="min-h-dvh bg-background flex items-center justify-center p-6" dir="rtl">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="inline-flex h-14 w-14 rounded-3xl gradient-primary text-white items-center justify-center shadow-elegant mb-3">
            <Sparkles className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-primary">إعادة تعيين كلمة المرور</h1>
          <p className="text-xs text-muted-foreground mt-1">أدخل كلمة المرور الجديدة لحسابك</p>
        </div>

        <div className="bg-card border border-border rounded-3xl p-6 shadow-card">
          {!ready ? (
            <p className="text-center text-sm text-muted-foreground">
              رابط الاستعادة غير صالح أو منتهي. يرجى طلب رابط جديد من شاشة تسجيل الدخول.
            </p>
          ) : (
            <form onSubmit={submit} className="space-y-3">
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="كلمة المرور الجديدة"
                  className="w-full h-12 rounded-xl bg-background border border-input pr-10 pl-3 text-sm outline-none focus:border-primary"
                  style={{ color: "#333333" }}
                />
              </div>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="تأكيد كلمة المرور"
                  className="w-full h-12 rounded-xl bg-background border border-input pr-10 pl-3 text-sm outline-none focus:border-primary"
                  style={{ color: "#333333" }}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl gradient-primary text-white font-extrabold shadow-card active:scale-[.98] transition-bounce disabled:opacity-60 inline-flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "جارٍ الحفظ..." : "حفظ كلمة المرور"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
