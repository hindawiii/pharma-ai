import { useEffect, useState } from "react";
import { Printer, CheckCircle2, Circle, Sparkles } from "lucide-react";
import { LEARNING_PATH, type LearningStage } from "@/data/nursingProtocols";
import { printHtml, esc } from "@/lib/printExport";

const KEY = "pharma_i_learning_path_done";

const levelStyle: Record<LearningStage["level"], { label: string; cls: string }> = {
  beginner: { label: "مبتدئ", cls: "bg-[hsl(150_60%_40%/0.18)] text-[hsl(150_60%_32%)]" },
  intermediate: { label: "متوسط", cls: "bg-[hsl(210_85%_50%/0.18)] text-[hsl(210_85%_42%)]" },
  advanced: { label: "متقدم", cls: "bg-[hsl(270_60%_55%/0.18)] text-[hsl(270_60%_45%)]" },
};

const pathHtml = () =>
  LEARNING_PATH.map(
    (s) => `
<h2>${esc(s.emoji)} ${esc(s.title)} — ${esc(s.subtitle)}</h2>
<div class="box"><strong>المستوى:</strong> ${esc(levelStyle[s.level].label)} · <strong>المدة:</strong> ${esc(s.duration)}</div>
<h3>الأهداف</h3><ul>${s.objectives.map((o) => `<li>${esc(o)}</li>`).join("")}</ul>
<h3>المصادر داخل التطبيق</h3><ul>${s.resources.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>`,
  ).join("");

export const LearningPathPanel = () => {
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setDone(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const toggle = (id: string) => {
    setDone((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };

  const pct = Math.round((done.length / LEARNING_PATH.length) * 100);

  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-card border border-border p-3.5">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-extrabold text-foreground flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-primary" /> تقدّمك في المسار
          </h4>
          <span className="text-sm font-extrabold text-primary" dir="ltr">{pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-primary transition-smooth" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5">
          {done.length} من {LEARNING_PATH.length} مراحل مكتملة — يُحفظ محلياً على جهازك فقط.
        </p>
      </div>

      <div className="space-y-2">
        {LEARNING_PATH.map((s, idx) => {
          const isDone = done.includes(s.id);
          const lvl = levelStyle[s.level];
          return (
            <div key={s.id} className={`rounded-2xl border p-3.5 ${isDone ? "bg-primary/5 border-primary/30" : "bg-card border-border"}`}>
              <div className="flex items-start gap-3">
                <button onClick={() => toggle(s.id)} className="flex-shrink-0 mt-0.5 active:scale-90 transition-bounce">
                  {isDone ? <CheckCircle2 className="h-5 w-5 text-primary" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg leading-none">{s.emoji}</span>
                    <h4 className="text-[13px] font-extrabold text-foreground">{idx + 1}. {s.title}</h4>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${lvl.cls}`}>{lvl.label}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5" dir="ltr">{s.subtitle} · {s.duration}</p>

                  <ul className="mt-2 space-y-1">
                    {s.objectives.map((o, i) => (
                      <li key={i} className="text-[12px] text-foreground flex items-start gap-1.5 leading-relaxed">
                        <span className="text-primary mt-0.5">●</span><span>{o}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {s.resources.map((r, i) => (
                      <span key={i} className="text-[10px] font-bold px-2 py-1 rounded-lg bg-secondary/10 text-secondary">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => printHtml("مسار تعلّم التمريض المتدرّج", pathHtml())}
        className="w-full flex items-center justify-center gap-1.5 py-3 rounded-2xl bg-primary text-primary-foreground text-xs font-extrabold active:scale-95 transition-bounce"
      >
        <Printer className="h-4 w-4" /> تصدير المسار كـ PDF
      </button>
    </div>
  );
};
