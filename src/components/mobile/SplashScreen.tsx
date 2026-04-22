import { useEffect, useState } from "react";
import logo from "@/assets/pharma-i-logo.png";

export const SplashScreen = ({ onDone }: { onDone: () => void }) => {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 1800);
    const t2 = setTimeout(() => onDone(), 2400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gradient-hero transition-opacity duration-500 ${
        leaving ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 gradient-mesh opacity-40" />
      <div className="relative flex flex-col items-center gap-6 animate-fade-up">
        <div className="relative">
          <div className="absolute inset-0 rounded-full animate-pulse-ring" />
          <div className="relative h-32 w-32 rounded-3xl bg-white/95 shadow-elegant flex items-center justify-center backdrop-blur">
            <img src={logo} alt="Pharma-i" className="h-24 w-24 object-contain" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-white font-display tracking-tight">Pharma-i</h1>
          <p className="text-white/90 text-base font-medium">صيدليتك الذكية في جيبك</p>
        </div>
        <div className="mt-6 flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-white/80 animate-pulse" />
          <span className="h-2 w-2 rounded-full bg-white/80 animate-pulse" style={{ animationDelay: "0.2s" }} />
          <span className="h-2 w-2 rounded-full bg-white/80 animate-pulse" style={{ animationDelay: "0.4s" }} />
        </div>
      </div>
    </div>
  );
};
