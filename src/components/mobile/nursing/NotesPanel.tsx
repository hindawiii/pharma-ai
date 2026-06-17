import { memo, useEffect, useState } from "react";
import { NotebookPen, Plus, Trash2 } from "lucide-react";
import { addNote, getNotes, removeNote, type DailyNote } from "@/lib/localHealthStore";

export const NotesPanel = memo(({ patientId }: { patientId?: string }) => {
  const [notes, setNotes] = useState<DailyNote[]>([]);
  const [text, setText] = useState("");

  const refresh = () => setNotes(getNotes().filter((n) => !patientId || n.patient_id === patientId));

  useEffect(() => {
    refresh();
    const h = () => refresh();
    window.addEventListener("local-health-changed", h);
    return () => window.removeEventListener("local-health-changed", h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  const submit = () => {
    const t = text.trim();
    if (!t) return;
    addNote({ text: t, patient_id: patientId });
    setText("");
  };

  const fmt = (d: string) =>
    new Date(d).toLocaleString("ar-EG", { dateStyle: "short", timeStyle: "short" });

  return (
    <section>
      <h2 className="text-base font-extrabold text-foreground mb-3 flex items-center gap-2">
        <NotebookPen className="h-5 w-5 text-secondary" /> ملاحظات يومية
      </h2>
      <div className="rounded-2xl bg-card border border-border p-3 space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="مثال: أكل جيداً اليوم، الضغط مستقر..."
          dir="rtl"
          rows={3}
          className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border outline-none resize-none text-sm leading-relaxed"
        />
        <button
          onClick={submit}
          disabled={!text.trim()}
          className="w-full py-2.5 rounded-2xl bg-secondary text-secondary-foreground font-extrabold disabled:opacity-50 flex items-center justify-center gap-1.5"
        >
          <Plus className="h-4 w-4" /> إضافة ملاحظة
        </button>
        <p className="text-[10px] text-center text-muted-foreground">🔒 محفوظة محلياً فقط</p>
      </div>

      {notes.length > 0 && (
        <ul className="mt-3 space-y-2">
          {notes.slice(0, 10).map((n) => (
            <li key={n.id} className="rounded-2xl bg-card border border-border p-3 flex gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{n.text}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{fmt(n.date)}</p>
              </div>
              <button
                onClick={() => removeNote(n.id)}
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
NotesPanel.displayName = "NotesPanel";
