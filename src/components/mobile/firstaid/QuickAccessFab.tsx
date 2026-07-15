import { memo, useState } from "react";
import { Siren, X, Phone, Zap } from "lucide-react";
import { useUserLocation } from "@/hooks/useUserLocation";
import { getCountryByCode } from "@/lib/emergencyNumbers";

const QUICK_TOPICS: { key: string; label: string; emoji: string }[] = [
  { key: "cpr", label: "CPR", emoji: "❤️" },
  { key: "choking", label: "اختناق", emoji: "🫁" },
  { key: "bleeding", label: "نزيف شديد", emoji: "🩸" },
  { key: "anaphylaxis", label: "حساسية مفرطة", emoji: "💉" },
  { key: "heart-attack", label: "نوبة قلبية", emoji: "💔" },
  { key: "seizure", label: "اختلاجات", emoji: "⚡" },
];

export const QuickAccessFab = memo(({ onSelect }: { onSelect: (k: string) => void }) => {
  const [open, setOpen] = useState(false);
  const { location } = useUserLocation();
  const country = getCountryByCode(location?.countryCode);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="طوارئ سريعة"
        className="absolute bottom-5 left-5 z-30 h-14 w-14 rounded-full text-white shadow-elegant flex items-center justify-center active:scale-90 transition-bounce"
        style={{ background: "linear-gradient(135deg,#C62828 0%,#8B1A1A 100%)" }}
      >
        <Zap className="h-6 w-6" fill="currentColor" strokeWidth={2.5} />
        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-yellow-400 border-2 border-white animate-pulse" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in-0"
          onClick={() => setOpen(false)}
          dir="rtl"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden animate-in slide-in-from-bottom-8"
          >
            <div className="px-4 py-3 flex items-center justify-between text-white" style={{ background: "linear-gradient(135deg,#C62828 0%,#8B1A1A 100%)" }}>
              <div className="flex items-center gap-2">
                <Siren className="h-5 w-5" />
                <h3 className="text-base font-extrabold">وضع الطوارئ السريع</h3>
              </div>
              <button onClick={() => setOpen(false)} className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <a
                href={`tel:${country.numbers.ambulance}`}
                className="w-full flex items-center gap-3 rounded-2xl bg-[#C62828] text-white px-4 py-3 shadow-soft active:scale-[0.98] transition-bounce"
              >
                <Phone className="h-5 w-5" />
                <div className="flex-1 text-right">
                  <div className="text-sm font-extrabold">اتصل بالإسعاف الآن</div>
                  <div className="text-xs opacity-90">{country.flag} {country.nameAr} · {country.numbers.ambulance}</div>
                </div>
              </a>

              <p className="text-[11px] font-bold text-muted-foreground">أو ابدأ خطوات الإنقاذ فوراً:</p>

              <div className="grid grid-cols-2 gap-2">
                {QUICK_TOPICS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => {
                      onSelect(t.key);
                      setOpen(false);
                    }}
                    className="rounded-2xl border-2 border-[#C62828]/30 bg-[#C62828]/5 hover:bg-[#C62828]/10 p-3 text-right active:scale-95 transition-bounce"
                  >
                    <div className="text-2xl mb-1">{t.emoji}</div>
                    <div className="text-sm font-extrabold text-[#C62828]">{t.label}</div>
                  </button>
                ))}
              </div>

              <p className="text-[10px] text-muted-foreground text-center leading-relaxed mt-2">
                لا يغني عن الاتصال بالإسعاف. الأولوية دائماً لطلب المساعدة الطبية.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
});
QuickAccessFab.displayName = "QuickAccessFab";
