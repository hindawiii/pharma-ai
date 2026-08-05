// Offline "Export as PDF" helper.
// Opens a clean printable window with the given HTML and triggers the
// device's native print dialog (user chooses "Save as PDF").
// No network, no libraries, full Arabic/RTL support via the system fonts.

export const printHtml = (title: string, bodyHtml: string) => {
  const win = window.open("", "_blank", "width=820,height=1000");
  if (!win) return false;

  win.document.write(`<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<title>${title}</title>
<style>
  @page { size: A4; margin: 14mm; }
  * { box-sizing: border-box; }
  body {
    font-family: "Cairo", "Noto Sans Arabic", "Segoe UI", Tahoma, sans-serif;
    color: #17202a; line-height: 1.75; margin: 0; padding: 0 4px;
  }
  header { border-bottom: 3px solid #1450a0; padding-bottom: 10px; margin-bottom: 18px; }
  header h1 { margin: 0; font-size: 21px; color: #1450a0; }
  header p { margin: 4px 0 0; font-size: 11px; color: #667; }
  h2 { font-size: 16px; color: #1450a0; margin: 18px 0 6px; page-break-after: avoid; }
  h3 { font-size: 13px; margin: 12px 0 4px; color: #333; }
  ul, ol { margin: 4px 0 10px; padding-right: 20px; }
  li { font-size: 12.5px; margin-bottom: 4px; }
  .warn { color: #b32020; font-size: 11.5px; }
  .box { border: 1px solid #dde; border-radius: 8px; padding: 10px 12px; margin-bottom: 12px; page-break-inside: avoid; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 10px; }
  th, td { border: 1px solid #dde; padding: 5px 7px; text-align: right; }
  th { background: #f3f6fb; }
  footer { margin-top: 22px; border-top: 1px solid #dde; padding-top: 8px; font-size: 10px; color: #778; text-align: center; }
</style>
</head>
<body>
<header>
  <h1>${title}</h1>
  <p>Pharma-i · مركز التمريض — نسخة للطباعة · ${new Date().toLocaleDateString("ar-EG")}</p>
</header>
${bodyHtml}
<footer>محتوى تعليمي فقط — لا يغني عن البروتوكولات المعتمدة في منشأتك الصحية. © Pharma-i</footer>
</body>
</html>`);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 400);
  return true;
};

export const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
