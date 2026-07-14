import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Music2 } from "lucide-react";

// CPR Metronome — 110 BPM with 30:2 compression/breath cycle counter.
// Uses WebAudio for a short click; no external assets.
export const CprMetronome = () => {
  const [bpm, setBpm] = useState(110);
  const [running, setRunning] = useState(false);
  const [count, setCount] = useState(0); // compressions in current cycle
  const [cycles, setCycles] = useState(0);
  const [phase, setPhase] = useState<"compress" | "breath">("compress");
  const ctxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);

  const click = () => {
    try {
      if (!ctxRef.current) {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        ctxRef.current = new AC();
      }
      const ctx = ctxRef.current!;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = phase === "breath" ? 440 : 880;
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch { /* silent */ }
  };

  useEffect(() => {
    if (!running) return;
    const intervalMs = 60000 / bpm;
    timerRef.current = window.setInterval(() => {
      click();
      setCount((c) => {
        if (phase === "compress") {
          if (c + 1 >= 30) {
            setPhase("breath");
            return 0;
          }
          return c + 1;
        } else {
          // breath phase: 2 breaths then reset
          if (c + 1 >= 2) {
            setPhase("compress");
            setCycles((x) => x + 1);
            return 0;
          }
          return c + 1;
        }
      });
    }, phase === "breath" ? 1500 : intervalMs);
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, [running, bpm, phase]);

  const reset = () => {
    setRunning(false);
    setCount(0);
    setCycles(0);
    setPhase("compress");
  };

  return (
    <div className="rounded-2xl border-2 border-[#C62828] bg-white p-4 mt-3">
      <div className="flex items-center gap-2 mb-3">
        <Music2 className="h-4 w-4 text-[#C62828]" />
        <h4 className="text-sm font-extrabold text-[#C62828]">مؤقّت إيقاع CPR</h4>
        <span className="mr-auto text-[10px] text-muted-foreground">{bpm} نبضة/د · 30:2</span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3 text-center">
        <div className="rounded-xl bg-[#C62828]/5 p-2">
          <div className="text-[10px] text-muted-foreground">المرحلة</div>
          <div className="text-sm font-extrabold text-[#C62828]">{phase === "compress" ? "ضغط" : "تنفّس"}</div>
        </div>
        <div className="rounded-xl bg-[#C62828]/5 p-2">
          <div className="text-[10px] text-muted-foreground">العدّ</div>
          <div className="text-lg font-extrabold text-foreground">{count}/{phase === "compress" ? 30 : 2}</div>
        </div>
        <div className="rounded-xl bg-[#C62828]/5 p-2">
          <div className="text-[10px] text-muted-foreground">دورات</div>
          <div className="text-lg font-extrabold text-foreground">{cycles}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setRunning((r) => !r)}
          className="flex-1 h-10 rounded-xl bg-[#C62828] text-white font-extrabold flex items-center justify-center gap-2 active:scale-95 transition-bounce"
        >
          {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {running ? "إيقاف" : "تشغيل"}
        </button>
        <button
          onClick={reset}
          className="h-10 px-3 rounded-xl border-2 border-[#C62828] text-[#C62828] font-bold flex items-center gap-1 active:scale-95"
        >
          <RotateCcw className="h-4 w-4" /> صفر
        </button>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <label className="text-[10px] text-muted-foreground">السرعة</label>
        <input
          type="range"
          min={100}
          max={120}
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
          className="flex-1 accent-[#C62828]"
        />
        <span className="text-[10px] font-bold text-[#C62828]">{bpm}</span>
      </div>
      <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
        المعدّل الموصى به من AHA: 100–120 نبضة/د بعمق 5–6 سم للبالغ.
      </p>
    </div>
  );
};
