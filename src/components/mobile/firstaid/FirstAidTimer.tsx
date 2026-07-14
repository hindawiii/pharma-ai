import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Timer as TimerIcon } from "lucide-react";

// Countdown timer for tasks like burn rinsing (20 min) or eye flush (15 min).
export const FirstAidTimer = ({
  minutes,
  label,
  hint,
}: {
  minutes: number;
  label: string;
  hint?: string;
}) => {
  const total = minutes * 60;
  const [left, setLeft] = useState(total);
  const [running, setRunning] = useState(false);
  const beepedRef = useRef(false);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          window.clearInterval(id);
          setRunning(false);
          if (!beepedRef.current) {
            beepedRef.current = true;
            try {
              const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
              const ctx = new AC();
              const osc = ctx.createOscillator();
              const g = ctx.createGain();
              osc.frequency.value = 880;
              g.gain.setValueAtTime(0.25, ctx.currentTime);
              g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
              osc.connect(g).connect(ctx.destination);
              osc.start(); osc.stop(ctx.currentTime + 0.85);
            } catch { /* silent */ }
          }
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const reset = () => { setRunning(false); setLeft(total); beepedRef.current = false; };
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  const pct = ((total - left) / total) * 100;

  return (
    <div className="rounded-2xl border-2 border-[#E65100] bg-white p-4 mt-3">
      <div className="flex items-center gap-2 mb-2">
        <TimerIcon className="h-4 w-4 text-[#E65100]" />
        <h4 className="text-sm font-extrabold text-[#E65100]">{label}</h4>
        <span className="mr-auto text-[10px] text-muted-foreground">{minutes} دقيقة</span>
      </div>

      <div className="text-center py-2">
        <div className="text-4xl font-extrabold text-foreground tabular-nums" dir="ltr">{mm}:{ss}</div>
      </div>

      <div className="h-2 rounded-full bg-[#E65100]/15 overflow-hidden mb-3">
        <div className="h-full bg-[#E65100] transition-all" style={{ width: `${pct}%` }} />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setRunning((r) => !r)}
          className="flex-1 h-10 rounded-xl bg-[#E65100] text-white font-extrabold flex items-center justify-center gap-2 active:scale-95"
        >
          {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {running ? "إيقاف" : "بدء"}
        </button>
        <button
          onClick={reset}
          className="h-10 px-3 rounded-xl border-2 border-[#E65100] text-[#E65100] font-bold flex items-center gap-1 active:scale-95"
        >
          <RotateCcw className="h-4 w-4" /> صفر
        </button>
      </div>
      {hint && <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">{hint}</p>}
    </div>
  );
};
