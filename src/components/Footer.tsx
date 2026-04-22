import { Logo } from "./Logo";
import { Facebook, Twitter, Instagram, MessageCircle } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background pt-16 pb-8">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <Logo size="lg" variant="light" />
            <p className="mt-4 text-background/70 text-sm leading-relaxed max-w-md">
              صيدليتك الذكية في جيبك. مدعوم بالذكاء الاصطناعي لقراءة الروشتات،
              العثور على البدائل، وضمان رعاية صحية موثوقة.
            </p>
            <div className="flex gap-3 mt-6">
              {[
                { icon: MessageCircle, label: "WhatsApp" },
                { icon: Facebook, label: "Facebook" },
                { icon: Twitter, label: "Twitter" },
                { icon: Instagram, label: "Instagram" },
              ].map((s, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={s.label}
                  className="h-10 w-10 rounded-full bg-background/10 hover:gradient-primary flex items-center justify-center transition-smooth"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">المنتج</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="#scanner" className="hover:text-background transition-smooth">الصندوق الذكي</a></li>
              <li><a href="#features" className="hover:text-background transition-smooth">المميزات</a></li>
              <li><a href="#map" className="hover:text-background transition-smooth">الخريطة</a></li>
              <li><a href="#pricing" className="hover:text-background transition-smooth">الباقات</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">الدعم</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="#" className="hover:text-background transition-smooth">مركز المساعدة</a></li>
              <li><a href="#" className="hover:text-background transition-smooth">سياسة الخصوصية</a></li>
              <li><a href="#" className="hover:text-background transition-smooth">شروط الاستخدام</a></li>
              <li><a href="#" className="hover:text-background transition-smooth">تواصل معنا</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-background/60">
          <p>© 2025 Pharma-i. جميع الحقوق محفوظة.</p>
          <p>صُنع بـ ❤️ لخدمة الرعاية الصحية</p>
        </div>
      </div>
    </footer>
  );
};
