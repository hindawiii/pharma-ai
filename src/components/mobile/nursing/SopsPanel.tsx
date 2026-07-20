import { useMemo, useState } from "react";
import { Search, X, AlertTriangle, CheckCircle2, ClipboardList, Wrench, ShieldAlert, FileText, BookMarked } from "lucide-react";
import { NURSING_SOPS, SOP_CATEGORY_LABELS, type NursingSop } from "@/data/nursingSops";

const CategoryChip = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold transition-bounce border ${
      active ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground"
    }`}
  >
    {children}
  </button>
);

const SopSheet = ({ sop, onClose }: { sop: NursingSop; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end" onClick={onClose}>
    <div
      className="w-full max-w-md mx-auto bg-card rounded-t-3xl max-h-[88vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="sticky top-0 bg-card/95 backdrop-blur border-b border-border p-4 flex items-center gap-3 z-10">
        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl">{sop.emoji}</div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-extrabold text-foreground leading-tight">{sop.name_ar}</h3>
          <p className="text-[10px] text-muted-foreground" dir="ltr">{sop.name_en}</p>
        </div>
        <button onClick={onClose} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4 space-y-4 pb-8">
        <p className="text-sm text-foreground leading-relaxed">{sop.purpose}</p>

        <section>
          <h4 className="text-xs font-extrabold text-primary mb-1.5 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" /> دواعي الاستخدام
          </h4>
          <ul className="space-y-1 text-[12px] text-foreground">
            {sop.indications.map((s, i) => <li key={i} className="flex gap-2"><span className="text-primary">●</span>{s}</li>)}
          </ul>
        </section>

        {sop.contraindications.length > 0 && (
          <section>
            <h4 className="text-xs font-extrabold text-[hsl(0_72%_45%)] mb-1.5 flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5" /> موانع الاستخدام
            </h4>
            <ul className="space-y-1 text-[12px] text-foreground">
              {sop.contraindications.map((s, i) => <li key={i} className="flex gap-2"><span className="text-[hsl(0_72%_45%)]">●</span>{s}</li>)}
            </ul>
          </section>
        )}

        <section>
          <h4 className="text-xs font-extrabold text-secondary mb-1.5 flex items-center gap-1.5">
            <Wrench className="h-3.5 w-3.5" /> الأدوات
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {sop.equipment.map((t, i) => (
              <span key={i} className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-secondary/10 text-secondary">{t}</span>
            ))}
          </div>
        </section>

        <section>
          <h4 className="text-xs font-extrabold text-primary mb-2 flex items-center gap-1.5">
            <ClipboardList className="h-3.5 w-3.5" /> الخطوات
          </h4>
          <ol className="space-y-2">
            {sop.steps.map((st, i) => (
              <li key={i} className="rounded-2xl border border-border bg-background p-2.5">
                <div className="flex gap-2">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-primary-foreground text-[11px] font-extrabold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="text-[12.5px] text-foreground leading-relaxed">{st.text}</p>
                </div>
                {st.warn && (
                  <div className="mt-1.5 flex items-start gap-1.5 rounded-lg bg-[hsl(0_72%_45%/0.08)] text-[hsl(0_72%_45%)] px-2 py-1 text-[11px]">
                    <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" /> <span>{st.warn}</span>
                  </div>
                )}
                {st.tip && (
                  <div className="mt-1.5 rounded-lg bg-primary/5 text-primary px-2 py-1 text-[11px]">💡 {st.tip}</div>
                )}
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h4 className="text-xs font-extrabold text-[hsl(0_72%_45%)] mb-1.5 flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5" /> المضاعفات المحتملة
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {sop.complications.map((t, i) => (
              <span key={i} className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-[hsl(0_72%_45%/0.08)] text-[hsl(0_72%_45%)]">{t}</span>
            ))}
          </div>
        </section>

        <section>
          <h4 className="text-xs font-extrabold text-muted-foreground mb-1.5 flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" /> التوثيق
          </h4>
          <ul className="space-y-1 text-[12px] text-foreground">
            {sop.documentation.map((s, i) => <li key={i} className="flex gap-2"><span className="text-muted-foreground">•</span>{s}</li>)}
          </ul>
        </section>

        <section className="rounded-2xl bg-muted/50 border border-border p-3">
          <h4 className="text-[10px] font-extrabold text-muted-foreground mb-1 flex items-center gap-1.5">
            <BookMarked className="h-3 w-3" /> المراجع
          </h4>
          <ul className="text-[10px] text-muted-foreground">
            {sop.refs.map((r, i) => <li key={i}>• {r}</li>)}
          </ul>
        </section>
      </div>
    </div>
  </div>
);

export const SopsPanel = () => {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [selected, setSelected] = useState<NursingSop | null>(null);

  const cats = useMemo(() => Array.from(new Set(NURSING_SOPS.map((s) => s.category))), []);
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return NURSING_SOPS.filter((s) => {
      if (cat !== "all" && s.category !== cat) return false;
      if (!query) return true;
      return s.name_ar.includes(query) || s.name_en.toLowerCase().includes(query) || s.purpose.includes(query);
    });
  }, [q, cat]);

  return (
    <div className="space-y-3 pb-4">
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`ابحث في ${NURSING_SOPS.length} إجراء تمريضي...`}
          className="w-full pr-9 pl-3 py-2.5 rounded-2xl bg-card border border-border focus:border-primary outline-none text-sm text-right"
          dir="rtl"
        />
      </div>

      <div className="flex gap-1.5 overflow-x-auto -mx-4 px-4 pb-1" style={{ scrollbarWidth: "none" }}>
        <CategoryChip active={cat === "all"} onClick={() => setCat("all")}>الكل</CategoryChip>
        {cats.map((c) => (
          <CategoryChip key={c} active={cat === c} onClick={() => setCat(c)}>
            {SOP_CATEGORY_LABELS[c as NursingSop["category"]]}
          </CategoryChip>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-2">
        {filtered.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelected(s)}
            className="w-full text-right rounded-2xl bg-card border border-border p-3 flex items-center gap-3 hover:border-primary transition-bounce"
          >
            <div className="h-11 w-11 rounded-2xl bg-primary/10 flex items-center justify-center text-xl flex-shrink-0">{s.emoji}</div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-extrabold text-foreground leading-tight">{s.name_ar}</p>
              <p className="text-[10px] text-muted-foreground truncate">{s.purpose}</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground flex-shrink-0">
              {s.steps.length} خطوة
            </span>
          </button>
        ))}
        {filtered.length === 0 && <p className="text-center text-sm text-muted-foreground py-6">لا نتائج</p>}
      </div>

      {selected && <SopSheet sop={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};
