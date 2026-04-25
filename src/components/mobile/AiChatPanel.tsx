import { Sparkles, X, Send } from "lucide-react";

interface Props {
  onClose: () => void;
  variant?: "fab" | "centered";
}

export const AiChatPanel = ({ onClose, variant = "fab" }: Props) => {
  const positionClass =
    variant === "centered"
      ? "fixed inset-x-3 top-20 bottom-24 z-[60] mx-auto max-w-md"
      : "fixed bottom-24 left-3 z-50 w-[calc(100%-1.5rem)] max-w-sm";

  return (
    <>
      {variant === "centered" && (
        <div
          className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm animate-fade-up"
          onClick={onClose}
          aria-hidden
        />
      )}
      <div
        className={`${positionClass} rounded-3xl bg-card border border-border shadow-elegant overflow-hidden animate-fade-up flex flex-col`}
      >
        <div className="gradient-ai p-3 text-white flex items-center justify-between flex-shrink-0">
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
          <button onClick={onClose} aria-label="إغلاق" className="p-1 hover:bg-white/10 rounded-lg">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-3 space-y-2 overflow-y-auto flex-1 min-h-0">
          <div className="bg-muted rounded-2xl rounded-tr-sm p-3 max-w-[85%] text-xs leading-relaxed">
            مرحباً! أنا مساعد Pharma-i الطبي. اسألني عن أي دواء، جرعة، أو بديل علاجي.
          </div>
          {variant === "centered" && (
            <div className="flex flex-wrap gap-2 pt-1">
              {["ما بدائل البنادول؟", "موعد جرعتي القادمة", "أقرب صيدلية"].map((q) => (
                <button
                  key={q}
                  className="text-[11px] px-3 py-1.5 rounded-full bg-primary/10 text-primary font-semibold hover:bg-primary hover:text-primary-foreground transition-smooth"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="p-3 border-t border-border flex items-center gap-2 flex-shrink-0">
          <input
            placeholder="اكتب سؤالك..."
            className="flex-1 bg-muted rounded-full px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <button
            className="h-8 w-8 rounded-full gradient-primary text-white flex items-center justify-center shadow-soft"
            aria-label="إرسال"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </>
  );
};
