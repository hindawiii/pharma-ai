import { useMemo, useState } from "react";
import { Search, Printer, AlertTriangle, Clock, Ban, Syringe, ChevronDown } from "lucide-react";
import { EMERGENCY_PROTOCOLS, type EmergencyProtocol } from "@/data/nursingProtocols";
import { printHtml, esc } from "@/lib/printExport";

const protocolToHtml = (p: EmergencyProtocol) => `
<h2>${esc(p.emoji)} ${esc(p.name_ar)} — ${esc(p.name_en)}</h2>
<div class="box"><strong>النافذة الذهبية:</strong> ${esc(p.goldenTime)}</div>
<h3>علامات التعرف</h3><ul>${p.recognize.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>
<h3>الخطوات</h3><ol>${p.steps
  .map(
    (s) =>
      `<li>${esc(s.t)}${s.time ? ` <em>(${esc(s.time)})</em>` : ""}${
        s.drug ? `<br/><small>💊 ${esc(s.drug)}</small>` : ""
      }${s.warn ? `<br/><span class="warn">⚠ ${esc(s.warn)}</span>` : ""}</li>`,
  )
  .join("")}</ol>
<h3>الأدوية</h3>
<table><tr><th>الدواء</th><th>الجرعة</th><th>الطريق</th></tr>
${p.drugs.map((d) => `<tr><td>${esc(d.name)}</td><td>${esc(d.dose)}</td><td>${esc(d.route)}</td></tr>`).join("")}
</table>
<h3>تجنّب</h3><ul>${p.avoid.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>
<p style="font-size:11px;color:#667">المراجع: ${p.refs.map(esc).join(" · ")}</p>
`;

const ProtocolCard = ({ p }: { p: EmergencyProtocol }) => {
  const [open, setOpen] = useState(false);
  const crit = p.severity === "critical";
  return (
    <div className={`rounded-2xl border overflow-hidden ${crit ? "border-[hsl(0_70%_50%/0.35)]" : "border-border"} bg-card`}>
      <button onClick={() => setOpen((o) => !o)} className="w-full p-3.5 flex items-center gap-3 text-right">
        <span className="text-2xl leading-none">{p.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-extrabold text-foreground leading-tight">{p.name_ar}</p>
          <p className="text-[10px] text-muted-foreground truncate" dir="ltr">{p.name_en}</p>
        </div>
        <span className={`flex-shrink-0 text-[9px] font-extrabold px-2 py-0.5 rounded-full ${crit ? "bg-[hsl(0_70%_50%/0.15)] text-[hsl(0_72%_45%)]" : "bg-[hsl(40_90%_50%/0.18)] text-[hsl(40_90%_35%)]"}`}>
          {crit ? "حرج" : "عاجل"}
        </span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-smooth ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="px-3.5 pb-4 space-y-3.5 border-t border-border pt-3">
          <div className="rounded-xl bg-[hsl(40_90%_50%/0.12)] p-2.5 flex items-start gap-2">
            <Clock className="h-3.5 w-3.5 text-[hsl(40_90%_38%)] mt-0.5 flex-shrink-0" />
            <p className="text-[11.5px] font-bold text-[hsl(40_90%_32%)] leading-relaxed">{p.goldenTime}</p>
          </div>

          <section>
            <h5 className="text-[11px] font-extrabold text-primary mb-1.5">علامات التعرف</h5>
            <ul className="space-y-1">
              {p.recognize.map((r, i) => (
                <li key={i} className="text-[12px] text-foreground flex items-start gap-1.5 leading-relaxed">
                  <span className="text-primary mt-0.5">◆</span><span>{r}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h5 className="text-[11px] font-extrabold text-primary mb-1.5">خطوات التدخل</h5>
            <ol className="space-y-2">
              {p.steps.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-primary/10 text-primary text-[10px] font-extrabold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12.5px] text-foreground leading-relaxed">{s.t}</p>
                    {s.time && <p className="text-[10px] font-bold text-secondary mt-0.5">⏱ {s.time}</p>}
                    {s.drug && <p className="text-[10px] text-muted-foreground mt-0.5" dir="ltr">💊 {s.drug}</p>}
                    {s.warn && (
                      <p className="text-[10.5px] text-[hsl(0_72%_45%)] mt-0.5 leading-relaxed">⚠ {s.warn}</p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h5 className="text-[11px] font-extrabold text-secondary mb-1.5 flex items-center gap-1">
              <Syringe className="h-3 w-3" /> الأدوية والجرعات
            </h5>
            <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
              {p.drugs.map((d, i) => (
                <div key={i} className="p-2 flex items-center gap-2">
                  <p className="text-[11.5px] font-extrabold text-foreground flex-1 min-w-0 truncate" dir="ltr">{d.name}</p>
                  <p className="text-[11px] font-bold text-secondary" dir="ltr">{d.dose}</p>
                  <p className="text-[10px] text-muted-foreground" dir="ltr">{d.route}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h5 className="text-[11px] font-extrabold text-[hsl(0_72%_45%)] mb-1.5 flex items-center gap-1">
              <Ban className="h-3 w-3" /> تجنّب تماماً
            </h5>
            <ul className="space-y-1">
              {p.avoid.map((a, i) => (
                <li key={i} className="text-[11.5px] text-[hsl(0_72%_45%)] flex items-start gap-1.5 leading-relaxed">
                  <span className="mt-0.5">✕</span><span>{a}</span>
                </li>
              ))}
            </ul>
          </section>

          <p className="text-[10px] text-muted-foreground leading-relaxed">المراجع: {p.refs.join(" · ")}</p>

          <button
            onClick={() => printHtml(p.name_ar, protocolToHtml(p))}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-2xl bg-primary text-primary-foreground text-xs font-extrabold active:scale-95 transition-bounce"
          >
            <Printer className="h-3.5 w-3.5" /> تصدير كـ PDF / طباعة
          </button>
        </div>
      )}
    </div>
  );
};

export const ProtocolsPanel = () => {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return EMERGENCY_PROTOCOLS;
    return EMERGENCY_PROTOCOLS.filter(
      (p) =>
        p.name_ar.includes(query) ||
        p.name_en.toLowerCase().includes(query) ||
        p.recognize.some((r) => r.includes(query)) ||
        p.drugs.some((d) => d.name.toLowerCase().includes(query)),
    );
  }, [q]);

  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-[hsl(0_70%_50%/0.1)] border border-[hsl(0_70%_50%/0.3)] p-3 flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 text-[hsl(0_72%_45%)] mt-0.5 flex-shrink-0" />
        <p className="text-[11px] text-[hsl(0_72%_40%)] font-bold leading-relaxed">
          بروتوكولات سريعة للحالات الحرجة — للاستخدام التعليمي والتذكيري، والتزم دائماً ببروتوكول منشأتك.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`ابحث في ${EMERGENCY_PROTOCOLS.length} بروتوكول...`}
          dir="rtl"
          className="w-full pr-9 pl-3 py-2.5 rounded-2xl bg-card border border-border focus:border-primary outline-none text-sm text-right"
        />
      </div>

      <div className="space-y-2">
        {filtered.map((p) => (
          <ProtocolCard key={p.id} p={p} />
        ))}
        {filtered.length === 0 && <p className="text-center text-sm text-muted-foreground py-6">لا نتائج</p>}
      </div>

      <button
        onClick={() =>
          printHtml("بروتوكولات الطوارئ التمريضية", EMERGENCY_PROTOCOLS.map(protocolToHtml).join(""))
        }
        className="w-full flex items-center justify-center gap-1.5 py-3 rounded-2xl bg-card border border-border text-xs font-extrabold text-foreground active:scale-95 transition-bounce"
      >
        <Printer className="h-4 w-4" /> تصدير جميع البروتوكولات كـ PDF
      </button>
    </div>
  );
};
