import { Bell, X } from "lucide-react";
import { useEffect } from "react";

interface Props {
  open: boolean;
  title: string;
  body?: string;
  onClose: () => void;
  variant?: "reminder" | "danger";
}

/**
 * Centered, full-screen pulsing alert. Used for medication reminders and
 * critical allergy/interaction warnings. Triggers haptic vibration on open.
 */
export const PulseAlert = ({ open, title, body, onClose, variant = "reminder" }: Props) => {
  useEffect(() => {
    if (!open) return;
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate?.([200, 80, 200, 80, 400]);
    }
  }, [open]);

  if (!open) return null;

  const isDanger = variant === "danger";
  const ringColor = isDanger ? "bg-destructive" : "bg-warning";
  const iconBg = isDanger
    ? "bg-gradient-to-br from-destructive to-destructive/70"
    : "bg-gradient-to-br from-warning to-warning/70";
  const titleColor = isDanger ? "text-destructive" : "text-warning";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md animate-fade-up" dir="rtl">
      <button
        onClick={onClose}
        aria-label="إغلاق"
        className="absolute top-6 left-6 h-10 w-10 rounded-full bg-white/15 text-white flex items-center justify-center active:scale-95"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="relative flex flex-col items-center text-center max-w-sm w-full">
        {/* Pulsing rings */}
        <div className="relative h-40 w-40 flex items-center justify-center mb-6">
          <span className={`absolute inset-0 rounded-full ${ringColor} opacity-30 animate-ping`} />
          <span className={`absolute inset-4 rounded-full ${ringColor} opacity-40 animate-ping`} style={{ animationDelay: "0.4s" }} />
          <div className={`relative h-24 w-24 rounded-full ${iconBg} flex items-center justify-center shadow-elegant`}>
            <Bell className="h-11 w-11 text-white drop-shadow-lg" strokeWidth={2.4} />
          </div>
        </div>

        <h2 className={`text-2xl font-extrabold ${titleColor} mb-2`}>{title}</h2>
        {body && <p className="text-base text-white/90 leading-relaxed font-medium">{body}</p>}

        <button
          onClick={onClose}
          className={`mt-8 w-full h-14 rounded-2xl text-white text-base font-extrabold shadow-elegant active:scale-[.98] transition-bounce ${
            isDanger ? "bg-destructive" : "gradient-primary"
          }`}
        >
          {isDanger ? "فهمت" : "تم الاستلام"}
        </button>
      </div>
    </div>
  );
};
