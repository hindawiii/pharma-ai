import { useState } from "react";
import { Sparkles, X, Send } from "lucide-react";

export const AiAssistant = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className="fixed bottom-24 left-4 md:left-8 z-50 w-[calc(100%-2rem)] md:w-96 rounded-3xl bg-card border border-border shadow-elegant overflow-hidden animate-fade-up">
          <div className="gradient-ai p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-sm">مساعد Pharma-i</p>
                <p className="text-xs opacity-80 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary-glow animate-pulse" />
                  متاح الآن
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="إغلاق" className="p-1 hover:bg-white/10 rounded-lg">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4 space-y-3 max-h-72 overflow-y-auto">
            <div className="bg-muted rounded-2xl rounded-tr-sm p-3 max-w-[85%] text-sm">
              مرحباً! أنا مساعدك الذكي. اسألني عن أي دواء، جرعة، أو بديل علاجي.
            </div>
            <div className="flex flex-wrap gap-2">
              {["ما بدائل البنادول؟", "موعد جرعتي القادمة", "أقرب صيدلية"].map((q) => (
                <button key={q} className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-semibold hover:bg-primary hover:text-primary-foreground transition-smooth">
                  {q}
                </button>
              ))}
            </div>
          </div>
          <div className="p-3 border-t border-border flex items-center gap-2">
            <input
              placeholder="اكتب سؤالك..."
              className="flex-1 bg-muted rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button className="h-9 w-9 rounded-full gradient-primary text-white flex items-center justify-center shadow-soft" aria-label="إرسال">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 left-6 md:left-8 z-50 group"
        aria-label="مساعد الذكاء الاصطناعي"
      >
        <span className="absolute inset-0 rounded-full gradient-ai animate-pulse-ring" />
        <span className="relative flex items-center justify-center h-16 w-16 rounded-full gradient-ai text-white shadow-elegant group-hover:scale-110 transition-bounce">
          <Sparkles className="h-7 w-7" />
        </span>
      </button>
    </>
  );
};
