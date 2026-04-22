import { Image as ImageIcon, Zap, ScanBarcode, Sparkles, AlertTriangle, Phone } from "lucide-react";
import { useState } from "react";

export const ScannerScreen = () => {
  const [flash, setFlash] = useState(false);

  return (
    <div className="relative min-h-[calc(100dvh-9rem)] flex flex-col bg-slate-950 text-white overflow-hidden">
      {/* Camera view backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-black" />
      <div className="absolute inset-0 opacity-30 gradient-mesh" />

      {/* Mode pill */}
      <div className="relative z-10 flex justify-center pt-3">
        <div className="inline-flex rounded-full bg-black/40 backdrop-blur p-1 text-xs">
          <button className="px-4 py-1.5 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold">
            روشتة
          </button>
          <button className="px-4 py-1.5 rounded-full text-white/70">باركود</button>
          <button className="px-4 py-1.5 rounded-full text-white/70">دواء</button>
        </div>
      </div>

      {/* Scan frame */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="relative w-full max-w-xs aspect-[3/4] rounded-3xl border-2 border-primary-glow/60">
          <span className="absolute -top-1 -right-1 h-8 w-8 border-t-4 border-r-4 border-secondary rounded-tr-3xl" />
          <span className="absolute -top-1 -left-1 h-8 w-8 border-t-4 border-l-4 border-secondary rounded-tl-3xl" />
          <span className="absolute -bottom-1 -right-1 h-8 w-8 border-b-4 border-r-4 border-secondary rounded-br-3xl" />
          <span className="absolute -bottom-1 -left-1 h-8 w-8 border-b-4 border-l-4 border-secondary rounded-bl-3xl" />
          <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-secondary-glow to-transparent shadow-green-glow animate-scan-line" />
          <div className="absolute bottom-4 inset-x-4 text-center text-white/90 text-sm font-medium bg-black/40 backdrop-blur rounded-full py-2">
            ضع الروشتة داخل الإطار
          </div>
          <div className="absolute top-3 right-3 inline-flex items-center gap-1 bg-secondary/90 px-2 py-1 rounded-full text-[10px] font-bold">
            <Sparkles className="h-3 w-3" /> AI
          </div>
        </div>
      </div>

      {/* Floating SOS */}
      <button
        aria-label="طوارئ"
        className="absolute top-20 left-4 z-20 h-12 w-12 rounded-full bg-destructive text-white shadow-elegant flex flex-col items-center justify-center animate-pulse-ring"
      >
        <Phone className="h-4 w-4" />
        <span className="text-[8px] font-black">SOS</span>
      </button>

      {/* Floating tip */}
      <div className="absolute top-16 right-4 z-20 max-w-[180px] rounded-2xl bg-warning/90 text-warning-foreground p-2.5 shadow-card text-[11px] font-medium flex gap-1.5">
        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
        ثبّت يدك للحصول على دقة أعلى
      </div>

      {/* Action bar */}
      <div className="relative z-10 px-6 pb-6 pt-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center justify-around">
          <button
            aria-label="من المعرض"
            className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-bounce"
          >
            <ImageIcon className="h-5 w-5" />
          </button>

          <button
            aria-label="التقاط"
            className="relative h-20 w-20 rounded-full bg-white p-1.5 active:scale-95 transition-bounce"
          >
            <span className="absolute inset-0 rounded-full animate-pulse-ring" />
            <span className="block h-full w-full rounded-full gradient-primary" />
          </button>

          <button
            aria-label="فلاش"
            onClick={() => setFlash((f) => !f)}
            className={`h-12 w-12 rounded-2xl backdrop-blur flex items-center justify-center active:scale-95 transition-bounce ${
              flash ? "bg-warning text-warning-foreground" : "bg-white/10"
            }`}
          >
            <Zap className="h-5 w-5" />
          </button>
        </div>
        <div className="flex justify-center mt-3">
          <button className="inline-flex items-center gap-1.5 text-xs text-white/70">
            <ScanBarcode className="h-4 w-4" /> التبديل لقراءة الباركود
          </button>
        </div>
      </div>
    </div>
  );
};
