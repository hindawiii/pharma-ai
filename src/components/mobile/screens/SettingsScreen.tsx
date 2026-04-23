import { Moon, Info, Bell, Globe, Shield, ChevronLeft, X, Sun, HeartPulse } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { Switch } from "@/components/ui/switch";
import logo from "@/assets/pharma-i-logo.png";

export const SettingsScreen = () => {
  const { theme, toggle } = useTheme();
  const [aboutOpen, setAboutOpen] = useState(false);

  const items = [
    { icon: Bell, label: "التنبيهات", hint: "تذكير بمواعيد الأدوية" },
    { icon: Globe, label: "اللغة", hint: "العربية" },
    { icon: Shield, label: "الخصوصية والأمان", hint: "إدارة بياناتك الطبية" },
  ];

  return (
    <div className="min-h-[calc(100dvh-9rem)] bg-background pb-24">
      <div className="px-4 pt-4">
        <div className="rounded-3xl gradient-primary p-5 text-white shadow-elegant relative overflow-hidden">
          <div className="absolute -bottom-12 -right-12 w-44 h-44 bg-white/10 rounded-full blur-2xl" />
          <h2 className="text-2xl font-extrabold">الإعدادات</h2>
          <p className="text-base opacity-90 mt-1">تخصيص تجربتك الطبية</p>
        </div>
      </div>

      {/* Dark Mode */}
      <div className="px-4 mt-5">
        <div className="rounded-2xl p-4 bg-card border border-border shadow-soft flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center">
            {theme === "dark" ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-extrabold text-lg">الوضع الليلي</p>
            <p className="text-sm text-muted-foreground">مريح للعين في الإضاءة المنخفضة</p>
          </div>
          <Switch checked={theme === "dark"} onCheckedChange={toggle} aria-label="تبديل الوضع الليلي" />
        </div>
      </div>

      {/* Other settings */}
      <div className="px-4 mt-3 space-y-2">
        {items.map(({ icon: Icon, label, hint }) => (
          <button
            key={label}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card border border-border shadow-soft text-right active:scale-[0.99] transition-bounce"
          >
            <div className="h-12 w-12 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center">
              <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-extrabold text-lg">{label}</p>
              <p className="text-sm text-muted-foreground">{hint}</p>
            </div>
            <ChevronLeft className="h-5 w-5 text-muted-foreground" />
          </button>
        ))}

        {/* About App */}
        <button
          onClick={() => setAboutOpen(true)}
          className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card border border-border shadow-soft text-right active:scale-[0.99] transition-bounce"
        >
          <div className="h-12 w-12 rounded-2xl bg-accent/15 text-accent flex items-center justify-center">
            <Info className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-extrabold text-lg">حول التطبيق</p>
            <p className="text-sm text-muted-foreground">معلومات عن العيان منو والإصدار</p>
          </div>
          <ChevronLeft className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

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
    </div>
  );
};
