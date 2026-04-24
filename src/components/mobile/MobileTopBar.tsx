import { Settings, Bell, Moon, Sun, Info, X, HeartPulse, Shield, LogOut, ChevronLeft } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import logo from "@/assets/pharma-i-logo.png";

interface Props {
  title: string;
}

type Modal = null | "about" | "privacy";

export const MobileTopBar = memo(({ title }: Props) => {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState<Modal>(null);

  // Lock background scroll while drawer open
  useEffect(() => {
    if (open || modal) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, modal]);

  return (
    <>
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen(true)}
              aria-label="الإعدادات"
              className="h-10 w-10 rounded-full bg-white/70 dark:bg-white/10 flex items-center justify-center text-foreground/80 hover:bg-white shadow-soft transition-smooth"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 text-center">
            <h1 className="text-base font-bold text-foreground">{title}</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              aria-label="التنبيهات"
              className="relative h-10 w-10 rounded-full bg-white/70 dark:bg-white/10 flex items-center justify-center text-foreground/80 hover:bg-white shadow-soft transition-smooth"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 left-2 h-2 w-2 rounded-full bg-destructive" />
            </button>
          </div>
        </div>
      </header>

      {/* Right Side Drawer (RTL: appears on the right) */}
      <div
        className={`fixed inset-0 z-[55] transition-opacity duration-200 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <aside
          dir="rtl"
          onClick={(e) => e.stopPropagation()}
          className={`absolute top-0 right-0 h-full w-[82%] max-w-sm glass border-l border-border/60 shadow-elegant transition-transform duration-300 ease-out will-change-transform ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ background: "hsl(var(--card) / 0.85)" }}
        >
          {/* Header */}
          <div className="gradient-primary p-5 text-white relative">
            <button
              onClick={() => setOpen(false)}
              aria-label="إغلاق"
              className="absolute top-3 left-3 h-9 w-9 rounded-full bg-white/15 flex items-center justify-center"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-2xl bg-white/95 flex items-center justify-center shadow-card">
                <img src={logo} alt="" className="h-10 w-10 object-contain" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold">العيان منو</h3>
                <p className="text-xs opacity-90">الإصدار 1.0.0</p>
              </div>
            </div>
          </div>

          {/* Menu */}
          <nav className="p-3 space-y-2 overflow-y-auto h-[calc(100%-7rem)]">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border">
              <div className="h-12 w-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                {theme === "dark" ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-base">الوضع الليلي</p>
                <p className="text-xs text-muted-foreground">مريح للعين في الإضاءة المنخفضة</p>
              </div>
              <Switch checked={theme === "dark"} onCheckedChange={toggle} aria-label="تبديل الوضع الليلي" />
            </div>

            <button
              onClick={() => setModal("privacy")}
              className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card border border-border text-right active:scale-[0.99] transition-bounce"
            >
              <div className="h-12 w-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center">
                <Shield className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-base">سياسة الخصوصية</p>
                <p className="text-xs text-muted-foreground">كيف نتعامل مع بياناتك</p>
              </div>
            </button>

            <button
              onClick={() => setModal("about")}
              className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card border border-border text-right active:scale-[0.99] transition-bounce"
            >
              <div className="h-12 w-12 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
                <Info className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-base">حول التطبيق</p>
                <p className="text-xs text-muted-foreground">معلومات وإهداء</p>
              </div>
            </button>

            <button
              onClick={() => {
                toast.success("تم تسجيل الخروج");
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 p-4 rounded-2xl bg-destructive/10 border border-destructive/30 text-right active:scale-[0.99] transition-bounce mt-4"
            >
              <div className="h-12 w-12 rounded-xl bg-destructive/15 text-destructive flex items-center justify-center">
                <LogOut className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-base text-destructive">تسجيل الخروج</p>
                <p className="text-xs text-destructive/70">إنهاء الجلسة الحالية</p>
              </div>
            </button>
          </nav>
        </aside>
      </div>

      {/* About modal */}
      {modal === "about" && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-up"
          onClick={() => setModal(null)}
        >
          <div className="w-full max-w-md bg-card rounded-3xl shadow-elegant overflow-hidden border border-border" onClick={(e) => e.stopPropagation()}>
            <div className="gradient-primary p-5 text-white relative">
              <button onClick={() => setModal(null)} aria-label="إغلاق" className="absolute top-3 left-3 h-9 w-9 rounded-full bg-white/15 flex items-center justify-center">
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 rounded-2xl bg-white/95 flex items-center justify-center shadow-card">
                  <img src={logo} alt="" className="h-12 w-12 object-contain" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold">العيان منو</h3>
                  <p className="text-sm opacity-90">الإصدار 1.0.0</p>
                </div>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <HeartPulse className="h-5 w-5 text-secondary" />
                  <p className="font-extrabold text-lg">الرسالة</p>
                </div>
                <p className="text-base leading-relaxed text-foreground/85">
                  دليلك الطبي — للوصول السريع للمعلومات والخدمات الطبية.
                </p>
              </div>
              <div className="rounded-2xl bg-muted/60 p-4">
                <p className="text-sm font-bold text-muted-foreground mb-1">إهداء</p>
                <p className="text-base font-bold leading-relaxed">Developed for the Sudanese medical community.</p>
              </div>
              <button onClick={() => setModal(null)} className="w-full h-12 rounded-2xl gradient-primary text-white font-extrabold text-base shadow-card">تم</button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy modal */}
      {modal === "privacy" && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-up"
          onClick={() => setModal(null)}
        >
          <div className="w-full max-w-md bg-card rounded-3xl shadow-elegant overflow-hidden border border-border" onClick={(e) => e.stopPropagation()}>
            <div className="gradient-primary p-5 text-white relative">
              <button onClick={() => setModal(null)} aria-label="إغلاق" className="absolute top-3 left-3 h-9 w-9 rounded-full bg-white/15 flex items-center justify-center">
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-2xl bg-white/95 text-primary flex items-center justify-center shadow-card">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-extrabold">سياسة الخصوصية</h3>
              </div>
            </div>
            <div className="p-5 space-y-3 text-base leading-relaxed text-foreground/85 max-h-[60vh] overflow-y-auto">
              <p>نحن في <b>العيان منو</b> نحترم خصوصيتك ونلتزم بحماية بياناتك.</p>
              <ul className="list-disc pr-5 space-y-2">
                <li>لا نجمع أي بيانات شخصية بدون إذنك الصريح.</li>
                <li>الموقع الجغرافي يُستخدم فقط لإيجاد أقرب الصيدليات والمستشفيات.</li>
                <li>الكاميرا تُستخدم حصراً لمسح الروشتات والباركود محلياً على جهازك.</li>
                <li>لا نشارك معلوماتك مع أي طرف ثالث لأغراض تسويقية.</li>
              </ul>
              <p className="text-xs text-muted-foreground pt-2">آخر تحديث: 2026</p>
            </div>
            <div className="p-4 border-t border-border">
              <button onClick={() => setModal(null)} className="w-full h-12 rounded-2xl gradient-primary text-white font-extrabold text-base shadow-card">حسناً</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

MobileTopBar.displayName = "MobileTopBar";
