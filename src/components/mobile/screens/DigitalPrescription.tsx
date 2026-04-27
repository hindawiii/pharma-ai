import { useRef, useState } from "react";
import { X, Download, Share2, Printer, Loader2, Pill, ShieldCheck, Calendar, User, Stethoscope, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/pharma-i-logo.png";

type Timing = "morning" | "noon" | "evening" | "night";
type DrugForm = "tablet" | "syrup" | "injection";

interface MedItem {
  name: string;
  form: DrugForm;
  dosageText: string;
  timings: Timing[];
  pillsPerDose: number;
  warning?: string;
  withFood?: boolean;
}

interface PrescriptionData {
  patientName: string;
  age: string;
  diagnosis: string;
  examType: string;
  clinic: string;
  meds: MedItem[];
}

interface Props {
  data: PrescriptionData;
  onClose: () => void;
}

const TIMING_LABELS: Record<Timing, string> = {
  morning: "صباحاً",
  noon: "ظهراً",
  evening: "مساءً",
  night: "ليلاً",
};

const TODAY = new Date().toLocaleDateString("ar-EG", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const REF_ID = `RX-${Date.now().toString(36).toUpperCase()}`;

export const DigitalPrescription = ({ data, onClose }: Props) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [busy, setBusy] = useState<"pdf" | "share" | "print" | null>(null);

  const renderCanvas = async () => {
    const html2canvas = (await import("html2canvas")).default;
    if (!cardRef.current) throw new Error("no node");
    return html2canvas(cardRef.current, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
      logging: false,
    });
  };

  const buildPdfBlob = async (): Promise<Blob> => {
    const { jsPDF } = await import("jspdf");
    const canvas = await renderCanvas();
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const ratio = canvas.width / canvas.height;
    let w = pageW - 40;
    let h = w / ratio;
    if (h > pageH - 40) {
      h = pageH - 40;
      w = h * ratio;
    }
    const x = (pageW - w) / 2;
    const y = (pageH - h) / 2;
    pdf.addImage(imgData, "PNG", x, y, w, h);
    return pdf.output("blob");
  };

  const exportPdf = async () => {
    setBusy("pdf");
    try {
      const blob = await buildPdfBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Pharma-i-${REF_ID}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("تم تصدير الروشتة الرقمية");
    } catch (e) {
      console.error(e);
      toast.error("تعذر إنشاء ملف PDF");
    } finally {
      setBusy(null);
    }
  };

  const sharePrescription = async () => {
    setBusy("share");
    try {
      const blob = await buildPdfBlob();
      const file = new File([blob], `Pharma-i-${REF_ID}.pdf`, { type: "application/pdf" });
      const shareText = `روشتة رقمية من Pharma-i\nالمريض: ${data.patientName}\nالتشخيص: ${data.diagnosis}\nرقم المرجع: ${REF_ID}`;
      const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      if (nav.canShare && nav.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "روشتة Pharma-i الرقمية",
          text: shareText,
        });
        toast.success("تمت المشاركة");
      } else {
        // Fallback: WhatsApp text share
        const wa = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        window.open(wa, "_blank", "noopener,noreferrer");
        toast.message("جهازك لا يدعم مشاركة الملفات مباشرةً، تم فتح واتساب لإرسال النص.");
      }
    } catch (e: unknown) {
      const err = e as { name?: string };
      if (err?.name !== "AbortError") {
        console.error(e);
        toast.error("تعذرت المشاركة");
      }
    } finally {
      setBusy(null);
    }
  };

  const printPrescription = async () => {
    setBusy("print");
    try {
      const canvas = await renderCanvas();
      const dataUrl = canvas.toDataURL("image/png");
      const w = window.open("", "_blank");
      if (!w) {
        toast.error("اسمح بالنوافذ المنبثقة لطباعة الروشتة");
        return;
      }
      w.document.write(`<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><title>Pharma-i Prescription ${REF_ID}</title>
        <style>@page{margin:12mm}body{margin:0;display:flex;align-items:center;justify-content:center;background:#fff}img{max-width:100%;height:auto}</style>
        </head><body><img src="${dataUrl}" onload="setTimeout(()=>{window.focus();window.print();},150)"/></body></html>`);
      w.document.close();
    } catch (e) {
      console.error(e);
      toast.error("تعذرت الطباعة");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col" dir="rtl">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 text-white flex-shrink-0">
        <button
          onClick={onClose}
          aria-label="إغلاق"
          className="h-9 w-9 rounded-full bg-white/15 backdrop-blur flex items-center justify-center active:scale-95 transition-bounce"
        >
          <X className="h-4 w-4" />
        </button>
        <p className="text-xs font-bold">المعاينة الرقمية</p>
        <span className="w-9" />
      </div>

      {/* Scrollable preview */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-2">
        <div
          ref={cardRef}
          className="mx-auto max-w-md bg-white text-slate-900 rounded-2xl shadow-elegant overflow-hidden"
          style={{ fontFamily: '"Cairo", "Tajawal", system-ui, sans-serif' }}
        >
          {/* Branded header */}
          <div className="px-5 py-4 bg-gradient-to-l from-[#0B5FFF] to-[#00B894] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Pharma-i" className="h-10 w-10 object-contain bg-white/15 rounded-lg p-1" crossOrigin="anonymous" />
              <div className="leading-tight">
                <p className="font-extrabold text-base">Pharma-i</p>
                <p className="text-[10px] opacity-90">Verified Digital Prescription</p>
              </div>
            </div>
            <div className="text-left">
              <p className="text-[10px] opacity-90">REF</p>
              <p className="text-xs font-bold tracking-wider">{REF_ID}</p>
              <p className="text-[10px] opacity-90 mt-0.5 inline-flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> موثّقة
              </p>
            </div>
          </div>

          {/* Patient block */}
          <div className="px-5 py-4 border-b border-slate-200">
            <div className="grid grid-cols-2 gap-3 text-[12px]">
              <Field icon={<User className="h-3.5 w-3.5" />} label="اسم المريض" value={data.patientName} />
              <Field icon={<Calendar className="h-3.5 w-3.5" />} label="العمر" value={data.age} />
              <Field icon={<Stethoscope className="h-3.5 w-3.5" />} label="التشخيص" value={data.diagnosis} />
              <Field icon={<ClipboardList className="h-3.5 w-3.5" />} label="نوع الفحص" value={data.examType} />
              <Field icon={<User className="h-3.5 w-3.5" />} label="العيادة" value={data.clinic} />
              <Field icon={<Calendar className="h-3.5 w-3.5" />} label="التاريخ" value={TODAY} />
            </div>
          </div>

          {/* Medicines */}
          <div className="px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
              <Pill className="h-4 w-4 text-[#0B5FFF]" />
              <h3 className="font-extrabold text-sm">الأدوية الموصوفة (Prescribed Medications)</h3>
            </div>
            <div className="space-y-2.5">
              {data.meds.map((m, i) => (
                <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="font-extrabold text-[13px] text-slate-900">
                      <span className="inline-block w-5 h-5 leading-5 text-center rounded-full bg-[#0B5FFF] text-white text-[10px] ml-1">{i + 1}</span>
                      {m.name}
                    </p>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{m.form}</span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed mb-1">
                    <span className="font-bold">الجرعة: </span>{m.dosageText}
                  </p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {m.timings.map((t) => (
                      <span key={t} className="text-[10px] bg-[#0B5FFF]/10 text-[#0B5FFF] font-bold px-1.5 py-0.5 rounded">
                        {TIMING_LABELS[t]}
                      </span>
                    ))}
                    {m.warning && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                        ⚠ {m.warning}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 bg-slate-100 text-[10px] text-slate-600 flex items-center justify-between">
            <span>هذه نسخة رقمية صادرة من تطبيق Pharma-i</span>
            <span className="font-bold">© Pharma-i</span>
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex-shrink-0 px-3 pb-4 pt-2 bg-gradient-to-t from-black/80 to-transparent">
        <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
          <ActionBtn onClick={exportPdf} disabled={!!busy} loading={busy === "pdf"} icon={<Download className="h-4 w-4" />} label="تصدير PDF" primary />
          <ActionBtn onClick={sharePrescription} disabled={!!busy} loading={busy === "share"} icon={<Share2 className="h-4 w-4" />} label="مشاركة" />
          <ActionBtn onClick={printPrescription} disabled={!!busy} loading={busy === "print"} icon={<Printer className="h-4 w-4" />} label="طباعة" />
        </div>
      </div>
    </div>
  );
};

const Field = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div>
    <p className="text-[10px] text-slate-500 inline-flex items-center gap-1 mb-0.5">{icon}{label}</p>
    <p className="text-[12px] font-bold text-slate-900 leading-tight">{value}</p>
  </div>
);

const ActionBtn = ({
  onClick, disabled, loading, icon, label, primary,
}: {
  onClick: () => void; disabled?: boolean; loading?: boolean; icon: React.ReactNode; label: string; primary?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`h-12 rounded-2xl font-bold text-xs inline-flex items-center justify-center gap-1.5 active:scale-95 transition-bounce disabled:opacity-60 ${
      primary
        ? "bg-gradient-to-r from-primary to-secondary text-white shadow-elegant"
        : "bg-white/15 backdrop-blur text-white border border-white/20"
    }`}
  >
    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
    {label}
  </button>
);

export type { PrescriptionData };
