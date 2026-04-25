import { Sparkles } from "lucide-react";
import { useState } from "react";
import { AiChatPanel } from "./AiChatPanel";

export const AiFab = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && <AiChatPanel onClose={() => setOpen(false)} variant="fab" />}

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-[5.5rem] left-3 z-50 group"
        aria-label="مساعد الذكاء الاصطناعي"
        style={{ marginBottom: "env(safe-area-inset-bottom)" }}
      >
        <span className="absolute inset-0 rounded-full gradient-ai animate-pulse-ring" />
        <span className="relative flex items-center justify-center h-9 w-9 rounded-full gradient-ai text-white shadow-card group-active:scale-95 transition-bounce">
          <Sparkles className="h-4 w-4" />
        </span>
      </button>
    </>
  );
};
