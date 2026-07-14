import { useEffect, useState } from "react";
import { ListChecks, RotateCcw } from "lucide-react";

// Interactive checklist saved to localStorage per topic key.
export const FirstAidChecklist = ({
  storageKey,
  items,
  title = "قائمة المتابعة",
}: {
  storageKey: string;
  items: string[];
  title?: string;
}) => {
  const key = `firstaid:checklist:${storageKey}`;
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setChecked(JSON.parse(raw));
    } catch { /* ignore */ }
  }, [key]);

  const persist = (next: Record<number, boolean>) => {
    setChecked(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* ignore */ }
  };

  const toggle = (i: number) => persist({ ...checked, [i]: !checked[i] });
  const reset = () => persist({});

  const doneCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="rounded-2xl border-2 border-[#00695C] bg-white p-4 mt-3">
      <div className="flex items-center gap-2 mb-2">
        <ListChecks className="h-4 w-4 text-[#00695C]" />
        <h4 className="text-sm font-extrabold text-[#00695C]">{title}</h4>
        <span className="mr-auto text-[10px] font-bold text-[#00695C]">{doneCount}/{items.length}</span>
        <button
          onClick={reset}
          className="text-[10px] text-muted-foreground flex items-center gap-1 hover:text-[#00695C]"
          aria-label="إعادة تعيين"
        >
          <RotateCcw className="h-3 w-3" /> إعادة
        </button>
      </div>

      <ul className="space-y-1.5">
        {items.map((t, i) => (
          <li key={i}>
            <label className="flex items-start gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={!!checked[i]}
                onChange={() => toggle(i)}
                className="mt-1 h-4 w-4 accent-[#00695C] flex-shrink-0"
              />
              <span className={`text-sm leading-relaxed flex-1 ${checked[i] ? "line-through text-muted-foreground" : "text-foreground"}`}>
                {t}
              </span>
            </label>
          </li>
        ))}
      </ul>
      <p className="text-[10px] text-muted-foreground mt-2">تُحفظ حالتك محلياً على هذا الجهاز فقط.</p>
    </div>
  );
};
