import { memo, useEffect, useState } from "react";
import { Bell, Trash2 } from "lucide-react";
import { getReminders, removeReminder, type LocalReminder } from "@/lib/localHealthStore";

export const RemindersPanel = memo(({ patientId }: { patientId?: string }) => {
  const [items, setItems] = useState<LocalReminder[]>([]);

  const refresh = () =>
    setItems(getReminders().filter((r) => !patientId || r.patient_id === patientId || !r.patient_id));

  useEffect(() => {
    refresh();
    const h = () => refresh();
    window.addEventListener("local-health-changed", h);
    return () => window.removeEventListener("local-health-changed", h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  return (
    <section>
      <h2 className="text-base font-extrabold text-foreground mb-3 flex items-center gap-2">
        <Bell className="h-5 w-5 text-primary" /> تذكيرات الأدوية
      </h2>
      {items.length === 0 ? (
        <div className="rounded-2xl bg-muted/50 border border-border p-4 text-center text-xs text-muted-foreground">
          لا توجد تذكيرات. أضِفها من قسم الأدوية.
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((r) => (
            <li key={r.id} className="rounded-2xl bg-card border border-border p-3 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg">
                💊
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-extrabold text-foreground truncate">{r.drug_name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {r.frequency === "interval"
                    ? `كل ${r.interval_hours} ساعة`
                    : (r.times ?? []).join(" · ")}
                </p>
              </div>
              <button
                onClick={() => removeReminder(r.id)}
                className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground"
                aria-label="حذف"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
});
RemindersPanel.displayName = "RemindersPanel";
