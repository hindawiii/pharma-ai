import { memo, useMemo, useState } from "react";
import {
  ScanLine,
  MapPin,
  Pill,
  BellRing,
  Heart,
  Apple,
  Shield,
  ChevronLeft,
  Droplet,
  Brain,
  Sun,
  Moon,
  Activity,
  Utensils,
} from "lucide-react";
import { AiChatPanel } from "../AiChatPanel";
import { HealthGuidesSection } from "./HealthGuides";
import logo from "@/assets/pharma-i-logo.png";

// Social brand icons (inline SVGs for crisp rendering)
const WhatsAppIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
  </svg>
);

const FacebookIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
);

const XIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const SHARE_TEXT = "اكتشف Pharma-i — مساعدك الطبي الذكي";
const buildShare = (base: string) => `${base}${encodeURIComponent("https://lovable.dev")}`;

const tip = {
  title: "اشرب الماء بانتظام",
  body: "تناوُل 8 أكواب من الماء يومياً يعزّز وظائف الكلى ويقلّل الإجهاد ويُحسّن التركيز.",
  tag: "توعية",
  icon: Heart,
};

const features = [
  { key: "scanner", title: "الماسح الذكي", desc: "تحليل الروشتة والباركود فوراً", icon: ScanLine, accent: "from-primary to-primary-glow" },
  { key: "map", title: "رادار الصيدليات", desc: "أقرب صيدلية مفتوحة الآن", icon: MapPin, accent: "from-secondary to-secondary-glow" },
  { key: "library", title: "مكتبة الدواء", desc: "معلومات موثوقة عن كل دواء", icon: Pill, accent: "from-accent to-primary-glow" },
  { key: "reminders", title: "تذكير الجرعات", desc: "تنبيهات ذكية في موعدها", icon: BellRing, accent: "from-secondary-glow to-accent" },
] as const;

interface Props {
  onOpenScanner?: () => void;
}

export const HomeScreen = memo(({ onOpenScanner: _ }: Props) => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="relative min-h-full pb-32">
      {/* Ambient mesh background */}
      <div className="absolute inset-0 -z-10 gradient-mesh opacity-80 pointer-events-none" />

      <div className="px-4 pt-4 space-y-6">
        {/* ===== Hero greeting ===== */}
        <header className="text-center space-y-1.5 pt-2">
          <p className="text-xs font-semibold text-secondary tracking-wide">Pharma-i</p>
          <h1 className="text-2xl font-extrabold text-foreground leading-tight">
            مرحباً بك في رفيقك <span className="text-gradient">الصحي</span>
          </h1>
          <p className="text-sm text-muted-foreground">اضغط على المساعد للدردشة الفورية</p>
        </header>

        {/* ===== Pulsing AI Centerpiece ===== */}
        <section className="flex items-center justify-center py-4">
          <button
            onClick={() => setChatOpen(true)}
            aria-label="افتح المساعد الذكي"
            className="relative group focus:outline-none"
          >
            {/* Outer ripple rings */}
            <span
              className="absolute inset-0 rounded-full"
              style={{
                background: "radial-gradient(circle, hsl(var(--secondary) / 0.35) 0%, transparent 70%)",
                animation: "pulse-ring 2.4s cubic-bezier(0.4,0,0.6,1) infinite",
              }}
            />
            <span
              className="absolute -inset-4 rounded-full"
              style={{
                background: "radial-gradient(circle, hsl(var(--primary-glow) / 0.25) 0%, transparent 70%)",
                animation: "pulse-ring 2.4s cubic-bezier(0.4,0,0.6,1) infinite",
                animationDelay: "0.6s",
              }}
            />
            <span
              className="absolute -inset-8 rounded-full"
              style={{
                background: "radial-gradient(circle, hsl(var(--accent) / 0.18) 0%, transparent 70%)",
                animation: "pulse-ring 2.4s cubic-bezier(0.4,0,0.6,1) infinite",
                animationDelay: "1.2s",
              }}
            />

            {/* Core button — Living gradient orb with logo */}
            <span className="relative flex h-32 w-32 items-center justify-center rounded-full overflow-hidden shadow-elegant transition-bounce group-active:scale-95 group-hover:scale-105">
              {/* Animated conic gradient background */}
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "conic-gradient(from 0deg, hsl(var(--primary)), hsl(var(--secondary)), hsl(var(--primary-glow)), hsl(var(--accent)), hsl(var(--primary)))",
                  animation: "spin 6s linear infinite",
                }}
              />
              {/* Inner glass core */}
              <span className="absolute inset-2 rounded-full bg-white/95 backdrop-blur-sm shadow-inner" />
              {/* Subtle inner pulse */}
              <span
                className="absolute inset-3 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, hsl(var(--secondary) / 0.25) 0%, transparent 70%)",
                  animation: "pulse-ring 2.4s cubic-bezier(0.4,0,0.6,1) infinite",
                }}
              />
              <span className="absolute inset-0 rounded-full ring-2 ring-white/40" />
              {/* Logo */}
              <img
                src={logo}
                alt="Pharma-i"
                className="relative h-16 w-16 object-contain drop-shadow-lg"
              />
            </span>

            <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold text-primary">
              اسأل المساعد
            </span>
          </button>
        </section>

        {/* ===== Daily Medical Tip (Glassmorphism) ===== */}
        <section aria-labelledby="tip-title" className="pt-6">
          <div className="relative overflow-hidden rounded-3xl glass border border-white/40 dark:border-border/50 shadow-card p-5">
            {/* Decorative blobs */}
            <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-secondary/30 blur-2xl" />
            <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-primary/25 blur-2xl" />

            <div className="relative flex items-start gap-3">
              <div className="flex-shrink-0 h-12 w-12 rounded-2xl gradient-primary shadow-soft flex items-center justify-center">
                <tip.icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary/15 text-secondary text-[11px] font-bold">
                    <Apple className="h-3 w-3" /> {tip.tag}
                  </span>
                  <span className="text-[10px] font-semibold text-muted-foreground">نصيحة اليوم</span>
                </div>
                <h2 id="tip-title" className="text-lg font-extrabold text-foreground leading-snug">
                  {tip.title}
                </h2>
                <p className="text-[15px] text-foreground/80 leading-relaxed mt-1">
                  {tip.body}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Feature Showcase Carousel ===== */}
        <section aria-labelledby="features-title">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 id="features-title" className="text-base font-extrabold text-foreground">
              ماذا يقدم لك Pharma-i؟
            </h2>
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          </div>

          <div
            className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}
          >
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <article
                  key={f.key}
                  className="snap-start flex-shrink-0 w-[160px] rounded-3xl bg-card border border-border shadow-soft p-4 transition-bounce active:scale-95 hover:shadow-card"
                >
                  <div
                    className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${f.accent} shadow-soft flex items-center justify-center mb-3`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-sm font-extrabold text-foreground leading-tight mb-1">
                    {f.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* ===== Health Guides: First Aid + Blood Types ===== */}
        <HealthGuidesSection />

        {/* ===== Trust badge ===== */}
        <section className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-1">
          <Shield className="h-3.5 w-3.5 text-secondary" />
          <span>محتوى طبي موثوق · تحديث يومي</span>
        </section>
      </div>

      {/* ===== Floating Social Share Bar ===== */}
      <div className="absolute bottom-3 left-3 right-3 z-30">
        <div className="rounded-2xl glass border border-white/40 dark:border-border/50 shadow-elegant px-3 py-2.5">
          <p className="text-center text-[11px] font-bold text-foreground mb-2">
            ساهم في نشر الوعي الطبي
          </p>
          <div className="flex items-center justify-center gap-3">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(SHARE_TEXT + " ")}${buildShare("")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="مشاركة عبر واتساب"
              className="h-10 w-10 rounded-full flex items-center justify-center text-white shadow-soft transition-bounce active:scale-90"
              style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
            >
              <WhatsAppIcon className="h-5 w-5" />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${buildShare("")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="مشاركة عبر فيسبوك"
              className="h-10 w-10 rounded-full flex items-center justify-center text-white shadow-soft transition-bounce active:scale-90"
              style={{ background: "linear-gradient(135deg, #1877F2, #0a5fc7)" }}
            >
              <FacebookIcon className="h-5 w-5" />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="إنستجرام"
              className="h-10 w-10 rounded-full flex items-center justify-center text-white shadow-soft transition-bounce active:scale-90"
              style={{ background: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)" }}
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${buildShare("")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="مشاركة عبر X"
              className="h-10 w-10 rounded-full flex items-center justify-center text-white shadow-soft transition-bounce active:scale-90 bg-foreground"
            >
              <XIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
      {/* AI Chat Pop-up */}
      {chatOpen && <AiChatPanel onClose={() => setChatOpen(false)} variant="centered" />}
    </div>
  );
});

HomeScreen.displayName = "HomeScreen";
