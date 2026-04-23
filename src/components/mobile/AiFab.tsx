import { Sparkles, X, Send } from "lucide-react";
import { useState } from "react";

export const AiFab = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className="fixed bottom-24 left-3 z-50 w-[calc(100%-1.5rem)] max-w-sm rounded-3xl bg-card border border-border shadow-elegant overflow-hidden animate-fade-up">
          <div className="gradient-ai p-3 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="font-bold text-xs">مساعد Pharma-i</p>
                <p className="text-[10px] opacity-80 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary-glow animate-pulse" />
                  متاح الآن
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="إغلاق" className="p-1 hover:bg-white/10 rounded-lg">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-3 space-y-2 max-h-60 overflow-y-auto">
            <div className="bg-muted rounded-2xl rounded-tr-sm p-3 max-w-[85%] text-xs leading-relaxed">
              مرحباً! اسألني عن أي دواء، جرعة، أو بديل علاجي.
            </div>
          </div>
          <div className="p-3 border-t border-border flex items-center gap-2">
            <input
              placeholder="اكتب سؤالك..."
              className="flex-1 bg-muted rounded-full px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button className="h-8 w-8 rounded-full gradient-primary text-white flex items-center justify-center shadow-soft" aria-label="إرسال">
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-20 left-3 z-50 group"
        aria-label="مساعد الذكاء الاصطناعي"
        style={{ marginBottom: "env(safe-area-inset-bottom)" }}
      >
        <span className="absolute inset-0 rounded-full gradient-ai animate-pulse-ring" />
        <span className="relative flex items-center justify-center h-11 w-11 rounded-full gradient-ai text-white shadow-card group-active:scale-95 transition-bounce">
          <Sparkles className="h-5 w-5" />
        </span>
      </button>
    </>
  );
};
