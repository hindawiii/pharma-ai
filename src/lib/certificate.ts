// Offline certificate generator.
// Renders a printable A4 landscape certificate in a new window and opens the
// device's native print dialog (user picks "Save as PDF").
// Uses system fonts, so Arabic/RTL text renders perfectly — unlike the previous
// jsPDF/helvetica version which produced garbled Arabic glyphs.

export interface CertificateOptions {
  studentName: string;
  specialtyAr: string;
  specialtyEn: string;
  scorePercent: number;
  date?: Date;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const generateCertificatePdf = (opts: CertificateOptions) => {
  const date = opts.date ?? new Date();
  const name = esc(opts.studentName?.trim() || "Nursing Student");
  const ar = esc(opts.specialtyAr || "");
  const en = esc(opts.specialtyEn || "");
  const dateAr = date.toLocaleDateString("ar-EG");
  const dateEn = date.toLocaleDateString("en-GB");

  const win = window.open("", "_blank", "width=1100,height=800");
  if (!win) return false;

  win.document.write(`<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<title>شهادة إتمام — ${name}</title>
<style>
  @page { size: A4 landscape; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: "Cairo", "Noto Sans Arabic", "Segoe UI", Tahoma, sans-serif;
    color: #17202a; background: #fff;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  .sheet {
    width: 297mm; height: 210mm; padding: 14mm;
    display: flex; align-items: center; justify-content: center;
  }
  .frame {
    width: 100%; height: 100%; border: 3px solid #1450a0; border-radius: 6px;
    padding: 6mm; position: relative;
  }
  .inner {
    width: 100%; height: 100%; border: 1px solid #9fb8dc; border-radius: 4px;
    padding: 10mm 14mm; text-align: center;
    display: flex; flex-direction: column; justify-content: center; gap: 6px;
  }
  .brand { font-size: 13px; color: #667; letter-spacing: 1px; }
  h1 { margin: 4px 0 0; font-size: 34px; color: #1450a0; }
  .sub { font-size: 15px; color: #556; margin-bottom: 10px; }
  .lead { font-size: 14px; color: #333; }
  .name {
    font-size: 34px; font-weight: 800; color: #1450a0; margin: 6px 0;
    border-bottom: 1px solid #cfdcef; display: inline-block; padding: 0 24px 6px;
  }
  .spec-ar { font-size: 21px; font-weight: 800; color: #17202a; margin-top: 8px; }
  .spec-en { font-size: 14px; color: #667; direction: ltr; }
  .score { font-size: 18px; font-weight: 800; color: #0f7a52; margin-top: 10px; }
  .foot {
    position: absolute; inset-inline: 14mm; bottom: 12mm;
    display: flex; justify-content: space-between; align-items: flex-end;
    font-size: 11px; color: #667;
  }
  .sig { text-align: center; }
  .sig .line { width: 55mm; border-top: 1px solid #889; margin-bottom: 4px; }
  .note { font-size: 10px; color: #889; margin-top: 14px; }
</style>
</head>
<body>
<div class="sheet"><div class="frame"><div class="inner">
  <div class="brand">PHARMA-I · NURSING ACADEMY</div>
  <h1>شهادة إتمام</h1>
  <div class="sub">Certificate of Completion</div>

  <div class="lead">تشهد أكاديمية التمريض في Pharma-i بأن</div>
  <div><span class="name">${name}</span></div>
  <div class="lead">قد اجتاز بنجاح الاختبار التقييمي في تخصص</div>

  <div class="spec-ar">${ar}</div>
  <div class="spec-en">${en}</div>

  <div class="score">النتيجة: ${opts.scorePercent}%</div>

  <div class="note">هذه شهادة تعليمية داخل التطبيق ولا تُعد مؤهلاً مهنياً معتمداً.</div>

  <div class="foot">
    <div>تاريخ الإصدار: ${dateAr} <span style="direction:ltr">(${dateEn})</span></div>
    <div class="sig"><div class="line"></div>Pharma-i Nursing Hub</div>
  </div>
</div></div></div>
</body>
</html>`);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 450);
  return true;
};
