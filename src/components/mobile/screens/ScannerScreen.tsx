import { Image as ImageIcon, Zap, ScanBarcode, Sparkles, AlertTriangle, X, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useSpeak } from "@/hooks/useSpeak";

export const ScannerScreen = () => {
  const speak = useSpeak();
  const [flash, setFlash] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStreaming(true);
    } catch (err) {
      console.error(err);
      toast.error("تعذر الوصول إلى الكاميرا. يرجى السماح بالإذن.");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setStreaming(false);
    setFlash(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

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
    <div className="relative min-h-[calc(100dvh-9rem)] flex flex-col bg-slate-950 text-white overflow-hidden">
      {/* Camera view */}
      <video
        ref={videoRef}
        playsInline
        muted
        className={`absolute inset-0 w-full h-full object-cover ${streaming ? "opacity-100" : "opacity-0"}`}
      />
      {!streaming && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-black" />
          <div className="absolute inset-0 opacity-30 gradient-mesh" />
        </>
      )}

      {capturedUrl && (
        <div className="absolute inset-0 z-30 bg-black/90 flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setCapturedUrl(null)}
            className="absolute top-4 left-4 h-10 w-10 rounded-full bg-white/10 flex items-center justify-center"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
          <img src={capturedUrl} alt="معاينة" className="max-h-[60vh] rounded-2xl shadow-elegant" />
          <div className="mt-4 inline-flex items-center gap-2 bg-secondary/90 px-4 py-2 rounded-full text-sm font-bold">
            <Sparkles className="h-4 w-4" /> AI يحلل الروشتة...
          </div>
        </div>
      )}

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

      {/* Scan frame — smaller, centered, professional */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="relative w-56 h-56 rounded-2xl border-2 border-primary-glow/60">
          <span className="absolute -top-1 -right-1 h-6 w-6 border-t-4 border-r-4 border-secondary rounded-tr-2xl" />
          <span className="absolute -top-1 -left-1 h-6 w-6 border-t-4 border-l-4 border-secondary rounded-tl-2xl" />
          <span className="absolute -bottom-1 -right-1 h-6 w-6 border-b-4 border-r-4 border-secondary rounded-br-2xl" />
          <span className="absolute -bottom-1 -left-1 h-6 w-6 border-b-4 border-l-4 border-secondary rounded-bl-2xl" />
          <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-secondary-glow to-transparent shadow-green-glow animate-scan-line" />
          <div className="absolute -bottom-10 inset-x-0 text-center text-white/90 text-xs font-medium">
            {streaming ? "ضع الباركود داخل المربع" : "اضغط الزر لتشغيل الكاميرا"}
          </div>
          <div className="absolute top-2 right-2 inline-flex items-center gap-1 bg-secondary/90 px-2 py-0.5 rounded-full text-[10px] font-bold">
            <Sparkles className="h-3 w-3" /> AI
          </div>
        </div>
      </div>

      {/* Floating tip */}
      <div className="absolute top-16 right-4 z-20 max-w-[180px] rounded-2xl bg-warning/90 text-warning-foreground p-2.5 shadow-card text-[11px] font-medium flex gap-1.5">
        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
        ثبّت يدك للحصول على دقة أعلى
      </div>

      {/* Action bar */}
      <div className="relative z-10 px-6 pb-6 pt-4 bg-gradient-to-t from-black/80 to-transparent">
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
            className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-bounce"
          >
            <ImageIcon className="h-5 w-5" />
          </button>

          <button
            aria-label="التقاط"
            onClick={capture}
            className="relative h-20 w-20 rounded-full bg-white p-1.5 active:scale-95 transition-bounce"
          >
            <span className="absolute inset-0 rounded-full animate-pulse-ring" />
            <span className="block h-full w-full rounded-full gradient-primary" />
          </button>

          <button
            aria-label="فلاش"
            onClick={toggleFlash}
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
