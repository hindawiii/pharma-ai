import { useUserLocation } from "@/hooks/useUserLocation";
import { COUNTRIES, getCountryByCode } from "@/lib/emergencyNumbers";
import { LocateFixed, ChevronDown } from "lucide-react";
import { useState } from "react";

export const CountrySelector = ({ compact = false }: { compact?: boolean }) => {
  const { location, loading, detect, setCountry } = useUserLocation();
  const [open, setOpen] = useState(false);
  const current = getCountryByCode(location?.countryCode);

  return (
    <div className="relative" dir="rtl">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setOpen((o) => !o)}
          className={`flex items-center gap-1.5 rounded-full bg-white border-2 border-[#C62828]/30 px-3 ${
            compact ? "h-8 text-[11px]" : "h-9 text-xs"
          } font-bold text-foreground active:scale-95 transition-bounce`}
        >
          <span>{current.flag}</span>
          <span>{current.nameAr}</span>
          <ChevronDown className="h-3 w-3 opacity-60" />
        </button>
        <button
          onClick={detect}
          disabled={loading}
          aria-label="تحديد الموقع تلقائياً"
          className={`${compact ? "h-8 w-8" : "h-9 w-9"} rounded-full bg-[#C62828] text-white flex items-center justify-center shadow-soft active:scale-95 transition-bounce`}
        >
          <LocateFixed className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
        {location?.city && (
          <span className="text-[10px] text-muted-foreground truncate">{location.city}</span>
        )}
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute z-50 mt-1 right-0 w-56 max-h-72 overflow-y-auto rounded-2xl bg-card border border-border shadow-elegant p-1">
            {COUNTRIES.map((c) => (
              <button
                key={c.code}
                onClick={() => {
                  setCountry(c.code, c.nameAr);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-right hover:bg-muted ${
                  c.code === current.code ? "bg-[#C62828]/10 text-[#C62828]" : "text-foreground"
                }`}
              >
                <span className="text-base">{c.flag}</span>
                <span className="flex-1">{c.nameAr}</span>
                <span className="text-[10px] text-muted-foreground">{c.code}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
