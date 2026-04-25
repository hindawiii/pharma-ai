import { Image as ImageIcon, Zap, Sparkles, AlertTriangle, FileText, ScanBarcode, Camera, Power } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ScanResultsOverlay } from "./ScanResultsOverlay";

type ScanMode = "prescription" | "barcode";

interface Props {
  isActive?: boolean;
}

export const ScannerScreen = ({ isActive = true }: Props) => {
  const [mode, setMode] = useState<ScanMode>("prescription");
  const [flash, setFlash] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStreaming(false);
    setFlash(false);
  }, []);

  const startCamera = useCallback(async () => {
    if (streamRef.current) return; // Already running
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setStreaming(true);
    } catch (err) {
      console.error(err);
      toast.error("تعذر الوصول إلى الكاميرا. يرجى السماح بالإذن.");
    }
  }, []);

  // Stop camera when leaving the tab; do NOT auto-start (manual activation)
  useEffect(() => {
    if (!isActive) stopCamera();
    return () => stopCamera();
  }, [isActive, stopCamera]);

  // Pause when tab hidden (background)
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) stopCamera();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [stopCamera]);

  const toggleFlash = async () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track) {
      toast.error("شغّل الكاميرا أولاً");
      return;
    }
    const caps = (track.getCapabilities?.() ?? {}) as { torch?: boolean };
    if (!caps.torch) {
      toast.error("الفلاش غير مدعوم على هذا الجهاز");
      return;
    }
    try {
      const next = !flash;
      // @ts-expect-error - torch constraint
      await track.applyConstraints({ advanced: [{ torch: next }] });
      setFlash(next);
    } catch (e) {
      console.error(e);
      toast.error("تعذر تشغيل الفلاش");
    }
  };

  const capture = () => {
    if (!streaming) {
      startCamera();
      return;
    }
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const url = canvas.toDataURL("image/jpeg", 0.9);
    setCapturedUrl(url);
    toast.success("تم التقاط الصورة، جاري التحليل...");
  };

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCapturedUrl(url);
    toast.success("تم رفع الصورة، جاري التحليل...");
  };

  return (
    <div className="relative h-full w-full flex flex-col items-stretch bg-slate-950 text-white overflow-hidden">
      {/* Camera view */}
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          streaming ? "opacity-100" : "opacity-0"
        }`}
      />
      {!streaming && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-black" />
          <div className="absolute inset-0 opacity-30 gradient-mesh" />
        </>
      )}

      {capturedUrl && (
        <ScanResultsOverlay
          imageUrl={capturedUrl}
          mode={mode}
          onClose={() => setCapturedUrl(null)}
        />
      )}

      {/* Mode toggle — Glassmorphic */}
      <div className="relative z-10 flex justify-center pt-3 px-4 flex-shrink-0">
        <div className="relative inline-flex rounded-full p-1 text-sm border border-white/20 bg-white/10 backdrop-blur-xl shadow-card">
          <span
            aria-hidden
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 ease-out"
            style={{
              right: mode === "prescription" ? "4px" : "calc(50% + 0px)",
            }}
          />
          <button
            onClick={() => setMode("prescription")}
            className={`relative z-10 px-5 py-2 rounded-full font-bold inline-flex items-center gap-1.5 transition-colors ${
              mode === "prescription" ? "text-white" : "text-white/70"
            }`}
          >
            <FileText className="h-4 w-4" /> روشتة
          </button>
          <button
            onClick={() => setMode("barcode")}
            className={`relative z-10 px-5 py-2 rounded-full font-bold inline-flex items-center gap-1.5 transition-colors ${
              mode === "barcode" ? "text-white" : "text-white/70"
            }`}
          >
            <ScanBarcode className="h-4 w-4" /> باركود
          </button>
        </div>
      </div>

      {/* Scan frame — Lens style (smaller, fluid) */}
      <div className="relative z-10 flex-1 min-h-0 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/30 to-black/70 pointer-events-none" />
        <div
          key={mode}
          className={`relative rounded-3xl border-2 border-white/40 transition-all duration-500 ease-out animate-fade-up ${
            mode === "prescription"
              ? "w-[55vw] max-w-[220px] aspect-[4/5]"
              : "w-[60vw] max-w-[240px] aspect-[5/3]"
          }`}
        >
          <span className="absolute -top-1 -right-1 h-6 w-6 border-t-4 border-r-4 border-secondary rounded-tr-3xl" />
          <span className="absolute -top-1 -left-1 h-6 w-6 border-t-4 border-l-4 border-secondary rounded-tl-3xl" />
          <span className="absolute -bottom-1 -right-1 h-6 w-6 border-b-4 border-r-4 border-secondary rounded-br-3xl" />
          <span className="absolute -bottom-1 -left-1 h-6 w-6 border-b-4 border-l-4 border-secondary rounded-bl-3xl" />
          <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-secondary-glow to-transparent shadow-green-glow animate-scan-line rounded-full" />
          <div className="absolute -bottom-8 inset-x-0 text-center text-white/90 text-[11px] font-bold whitespace-nowrap">
            {mode === "prescription" ? "وجّه الكاميرا نحو الروشتة" : "ضع الباركود داخل الإطار"}
          </div>
          <div className="absolute top-2 right-2 inline-flex items-center gap-1 bg-secondary/90 px-2 py-0.5 rounded-full text-[10px] font-bold">
            <Sparkles className="h-3 w-3" /> AI
          </div>
        </div>
      </div>

      {/* Floating tip */}
      <div className="absolute top-16 right-3 z-20 max-w-[170px] rounded-2xl bg-warning/90 text-warning-foreground p-2 shadow-card text-[11px] font-medium flex gap-1.5">
        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
        ثبّت يدك للحصول على دقة أعلى
      </div>

      {/* Action bar — Glassmorphic */}
      <div className="relative z-10 mx-3 mb-3 px-4 pb-3 pt-3 rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-elegant flex-shrink-0">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onPickFile}
        />
        <div className="flex items-center justify-around">
          <button
            aria-label="من المعرض"
            onClick={() => fileInputRef.current?.click()}
            className="h-11 w-11 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center active:scale-95 transition-bounce"
          >
            <ImageIcon className="h-5 w-5" />
          </button>

          <button
            aria-label="التقاط"
            onClick={capture}
            className="relative h-16 w-16 rounded-full bg-white p-1.5 active:scale-95 transition-bounce"
          >
            <span className="absolute inset-0 rounded-full animate-pulse-ring" />
            <span className="block h-full w-full rounded-full gradient-primary" />
          </button>

          <button
            aria-label="فلاش"
            onClick={toggleFlash}
            className={`h-11 w-11 rounded-2xl backdrop-blur flex items-center justify-center active:scale-95 transition-bounce ${
              flash ? "bg-warning text-warning-foreground" : "bg-white/10"
            }`}
          >
            <Zap className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
