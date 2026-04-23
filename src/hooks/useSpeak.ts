import { useCallback } from "react";
import { toast } from "sonner";

export const useSpeak = () => {
  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast.error("النطق الصوتي غير مدعوم على هذا الجهاز");
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "ar-SA";
      utter.rate = 0.9;
      utter.pitch = 1;
      const voices = window.speechSynthesis.getVoices();
      const arVoice = voices.find((v) => v.lang?.toLowerCase().startsWith("ar"));
      if (arVoice) utter.voice = arVoice;
      window.speechSynthesis.speak(utter);
    } catch (e) {
      console.error(e);
      toast.error("تعذر تشغيل النطق");
    }
  }, []);
  return speak;
};
