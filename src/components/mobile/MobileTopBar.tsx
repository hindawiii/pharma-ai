import { Settings, Bell, Moon, Sun, Info, X, HeartPulse } from "lucide-react";
import { memo, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { Switch } from "@/components/ui/switch";
import logo from "@/assets/pharma-i-logo.png";

interface Props {
  title: string;
}

export const MobileTopBar = memo(({ title }: Props) => {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="flex items-center justify-between px-4 h-14">
          {/* Right (RTL first) - settings */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen(true)}
              aria-label="الإعدادات"
              className="h-10 w-10 rounded-full bg-white/70 flex items-center justify-center text-foreground/80 hover:bg-white shadow-soft transition-smooth"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 text-center">
            <h1 className="text-base font-bold text-foreground">{title}</h1>
          </div>

          {/* Left - notifications */}
          <div className="flex items-center gap-2">
            <button
              aria-label="التنبيهات"
              className="relative h-10 w-10 rounded-full bg-white/70 flex items-center justify-center text-foreground/80 hover:bg-white shadow-soft transition-smooth"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 left-2 h-2 w-2 rounded-full bg-destructive" />
            </button>
          </div>
        </div>
      </header>

      {/* Settings sheet */}
      {open && (
        <div
          className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 pt-20 animate-fade-up"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md bg-card rounded-3xl shadow-elegant overflow-hidden border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="gradient-primary p-4 text-white flex items-center justify-between">
              <h3 className="text-lg font-extrabold">الإعدادات</h3>
              <button
                onClick={() => setOpen(false)}
                aria-label="إغلاق"
                className="h-8 w-8 rounded-full bg-white/15 flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-3 space-y-2">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-background border border-border">
                <div className="h-11 w-11 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                  {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-extrabold">الوضع الليلي</p>
                  <p className="text-xs text-muted-foreground">مريح للعين في الإضاءة المنخفضة</p>
                </div>
                <Switch checked={theme === "dark"} onCheckedChange={toggle} aria-label="تبديل الوضع الليلي" />
              </div>

              <button
                onClick={() => setAboutOpen(true)}
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-background border border-border text-right active:scale-[0.99] transition-bounce"
              >
                <div className="h-11 w-11 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
                  <Info className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-extrabold">حول التطبيق</p>
                  <p className="text-xs text-muted-foreground">العيان منو · الإصدار 1.0.0</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* About modal */}
      {aboutOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-up"
          onClick={() => setAboutOpen(false)}
        >
          <div
            className="w-full max-w-md bg-card rounded-3xl shadow-elegant overflow-hidden border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="gradient-primary p-5 text-white relative">
              <button
                onClick={() => setAboutOpen(false)}
                aria-label="إغلاق"
                className="absolute top-3 left-3 h-9 w-9 rounded-full bg-white/15 flex items-center justify-center"
              >
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
                <p className="text-base font-bold leading-relaxed">
                  Developed for the Sudanese medical community.
                </p>
              </div>
              <button
                onClick={() => setAboutOpen(false)}
                className="w-full h-12 rounded-2xl gradient-primary text-white font-extrabold text-base shadow-card"
              >
                تم
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

MobileTopBar.displayName = "MobileTopBar";
