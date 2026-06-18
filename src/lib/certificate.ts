// PDF certificate generator using jsPDF.
// Generates a clean offline certificate. Arabic text is rendered via the
// existing default font (Arabic glyphs may display via the viewer's fallback);
// the layout focuses on a clear, printable result.

import { jsPDF } from "jspdf";

export interface CertificateOptions {
  studentName: string;
  specialtyAr: string;
  specialtyEn: string;
  scorePercent: number;
  date?: Date;
}

export const generateCertificatePdf = (opts: CertificateOptions) => {
  const date = opts.date ?? new Date();
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  // Outer border
  doc.setDrawColor(20, 80, 160);
  doc.setLineWidth(2.5);
  doc.rect(8, 8, W - 16, H - 16);
  doc.setLineWidth(0.6);
  doc.rect(12, 12, W - 24, H - 24);

  // Header
  doc.setTextColor(20, 80, 160);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(30);
  doc.text("Certificate of Completion", W / 2, 36, { align: "center" });

  doc.setFontSize(14);
  doc.setTextColor(80, 80, 80);
  doc.setFont("helvetica", "normal");
  doc.text("Pharma-i Nursing Academy", W / 2, 46, { align: "center" });

  // Body
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(13);
  doc.text("This is to certify that", W / 2, 70, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(20, 80, 160);
  doc.text(opts.studentName || "Student", W / 2, 88, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(40, 40, 40);
  doc.text("has successfully completed the nursing specialty assessment", W / 2, 100, {
    align: "center",
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(20, 80, 160);
  doc.text(`${opts.specialtyEn}`, W / 2, 115, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(80, 80, 80);
  doc.text(`(${opts.specialtyAr})`, W / 2, 124, { align: "center" });

  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text(`with a score of ${opts.scorePercent}%`, W / 2, 138, { align: "center" });

  // Footer
  const dateStr = date.toLocaleDateString("en-GB");
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text(`Issued: ${dateStr}`, 30, H - 22);
  doc.text("Pharma-i Nursing Hub", W - 30, H - 22, { align: "right" });

  doc.setDrawColor(80, 80, 80);
  doc.setLineWidth(0.3);
  doc.line(W / 2 - 35, H - 30, W / 2 + 35, H - 30);
  doc.setFontSize(10);
  doc.text("Authorized Signature", W / 2, H - 24, { align: "center" });

  const safe = (opts.studentName || "student").replace(/\s+/g, "_");
  doc.save(`Pharma-i_Certificate_${safe}_${opts.specialtyEn.replace(/\s+/g, "_")}.pdf`);
};
