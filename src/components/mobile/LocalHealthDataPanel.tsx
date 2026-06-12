import { useEffect, useRef, useState } from "react";
import { Download, Upload, Trash2, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  downloadHealthBackup,
  importHealthBackup,
  wipeAllHealthData,
  getVitals,
  getReminders,
  getNotes,
} from "@/lib/localHealthStore";

export const LocalHealthDataPanel = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [counts, setCounts] = useState({ vitals: 0, reminders: 0, notes: 0 });

  const refresh = () =>
    setCounts({
      vitals: getVitals().length,
      reminders: getReminders().length,
      notes: getNotes().length,
    });

  useEffect(() => {
    refresh();
    const h = () => refresh();
    window.addEventListener("local-health-changed", h);
    return () => window.removeEventListener("local-health-changed", h);
  }, []);

  const onImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    const ok = await importHealthBackup(file);
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
    ok ? toast.success("تم استيراد بياناتك") : toast.error("ملف غير صالح");
  };

  const onWipe = () => {
    wipeAllHealthData();
    setConfirm(false);
    toast.success("تم حذف كل بياناتك الصحية المحلية");
  };

  return (
    <div className="px-4 mt-5">
      <div className="rounded-2xl p-4 bg-card border border-border shadow-soft">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="h-5 w-5 text-success" />
          <h3 className="font-extrabold text-base text-foreground">بياناتي الصحية المحلية</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          العلامات الحيوية، التذكيرات، والملاحظات تُحفظ على جهازك فقط — لا تُرفع إلى أي سحابة.
        </p>

        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { label: "علامات", v: counts.vitals },
            { label: "تذكيرات", v: counts.reminders },
            { label: "ملاحظات", v: counts.notes },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-muted/50 py-2 text-center">
              <p className="text-lg font-extrabold text-foreground">{s.v}</p>
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={downloadHealthBackup}
            className="h-11 rounded-xl bg-secondary/15 text-secondary text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Download className="h-4 w-4" /> تصدير بياناتي
          </button>
          <button
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="h-11 rounded-xl bg-primary/15 text-primary text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            استيراد بياناتي
          </button>
        </div>
        <input ref={inputRef} type="file" accept="application/json" className="hidden" onChange={onImport} />

        <button
          onClick={() => setConfirm(true)}
          className="mt-2 w-full h-11 rounded-xl bg-destructive/10 text-destructive text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95"
        >
          <Trash2 className="h-4 w-4" /> حذف كل بياناتي الصحية
        </button>
      </div>

      {confirm && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6"
          onClick={() => setConfirm(false)}
        >
          <div className="bg-card rounded-3xl shadow-elegant p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-extrabold text-center text-destructive">حذف نهائي؟</h3>
            <p className="text-xs text-center text-muted-foreground mt-1 mb-5">
              سيتم مسح العلامات الحيوية والتذكيرات والملاحظات من هذا الجهاز. لا يمكن التراجع.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setConfirm(false)} className="flex-1 h-12 rounded-xl bg-muted font-bold">
                تراجع
              </button>
              <button onClick={onWipe} className="flex-1 h-12 rounded-xl bg-destructive text-white font-extrabold">
                نعم، احذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
