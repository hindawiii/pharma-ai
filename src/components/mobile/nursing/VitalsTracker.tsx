import { memo, useMemo, useState } from "react";
import { Plus, Trash2, TrendingUp, Loader2 } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { useVitalSigns, VITAL_META, type VitalKind } from "@/hooks/useVitalSigns";

const KINDS: VitalKind[] = ["bp", "glucose", "pulse", "temp", "spo2", "weight"];

const VitalsAddSheet = ({
  open,
  onClose,
  onSave,
  defaultKind,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (k: VitalKind, v1: number, v2?: number, notes?: string) => Promise<void>;
  defaultKind: VitalKind;
}) => {
  const [kind, setKind] = useState<VitalKind>(defaultKind);
  const [v1, setV1] = useState("");
  const [v2, setV2] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  if (!open) return null;
  const meta = VITAL_META[kind];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-card rounded-t-3xl p-5 space-y-4" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-extrabold flex items-center gap-2">
          <span className="text-2xl">{meta.emoji}</span> قياس جديد
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {KINDS.map((k) => (
            <button
              key={k}
              onClick={() => setKind(k)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                kind === k ? "bg-primary text-primary-foreground border-primary" : "bg-muted border-border text-foreground"
              }`}
            >
              {VITAL_META[k].emoji} {VITAL_META[k].ar}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input
            value={v1}
            onChange={(e) => setV1(e.target.value)}
            type="number"
            inputMode="decimal"
            placeholder={meta.hasSecondary ? "الانقباضي" : `القيمة (${meta.unit})`}
            className="px-3 py-3 rounded-2xl bg-muted border border-border text-right"
            dir="rtl"
          />
          {meta.hasSecondary && (
            <input
              value={v2}
              onChange={(e) => setV2(e.target.value)}
              type="number"
              inputMode="decimal"
              placeholder="الانبساطي"
              className="px-3 py-3 rounded-2xl bg-muted border border-border text-right"
              dir="rtl"
            />
          )}
        </div>
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="ملاحظات (اختياري)"
          className="w-full px-3 py-3 rounded-2xl bg-muted border border-border text-right text-sm"
          dir="rtl"
        />
        <p className="text-[11px] text-muted-foreground text-center">النطاق الطبيعي: {meta.normal} {meta.unit}</p>
        <button
          disabled={!v1 || saving}
          onClick={async () => {
            setSaving(true);
            await onSave(kind, parseFloat(v1), v2 ? parseFloat(v2) : undefined, notes || undefined);
            setSaving(false);
            setV1(""); setV2(""); setNotes("");
            onClose();
          }}
          className="w-full py-3 rounded-2xl gradient-primary text-white font-extrabold disabled:opacity-50"
        >
          {saving ? "جارٍ الحفظ..." : "حفظ القياس"}
        </button>
      </div>
    </div>
  );
};

const KindChart = ({ kind, data }: { kind: VitalKind; data: { t: string; v: number; v2?: number | null }[] }) => {
  const meta = VITAL_META[kind];
  const points = useMemo(
    () => [...data].reverse().slice(-12).map((d, i) => ({ i, v: d.v, v2: d.v2 ?? undefined, label: d.t })),
    [data],
  );
  if (!points.length) return null;
  return (
    <div className="h-32 mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <XAxis dataKey="i" hide />
          <YAxis hide domain={["auto", "auto"]} />
          <Tooltip
            contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 11 }}
            labelFormatter={(_, p) => p?.[0]?.payload?.label ?? ""}
            formatter={(val: number) => [`${val} ${meta.unit}`, meta.ar]}
          />
          <Line type="monotone" dataKey="v" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 3 }} />
          {meta.hasSecondary && <Line type="monotone" dataKey="v2" stroke="hsl(var(--secondary))" strokeWidth={2} dot={{ r: 2 }} />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const VitalsTracker = memo(({ patientRef, patientName }: { patientRef: string; patientName: string }) => {
  const { readings, loading, add, remove } = useVitalSigns(patientRef);
  const [open, setOpen] = useState(false);
  const [defaultKind, setDefaultKind] = useState<VitalKind>("bp");

  const grouped = useMemo(() => {
    const g: Record<VitalKind, VitalReading_[]> = { bp: [], glucose: [], pulse: [], temp: [], spo2: [], weight: [] };
    for (const r of readings) {
      g[r.kind].push({
        id: r.id,
        v: Number(r.value_primary),
        v2: r.value_secondary != null ? Number(r.value_secondary) : null,
        t: new Date(r.measured_at).toLocaleString("ar", { dateStyle: "short", timeStyle: "short" }),
        notes: r.notes,
      });
    }
    return g;
  }, [readings]);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          مؤشرات {patientName}
        </h2>
        <button
          onClick={() => { setDefaultKind("bp"); setOpen(true); }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl gradient-primary text-white text-xs font-extrabold shadow-soft active:scale-95 transition-bounce"
        >
          <Plus className="h-4 w-4" /> قياس
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5">
          {KINDS.map((k) => {
            const meta = VITAL_META[k];
            const list = grouped[k];
            const latest = list[0];
            return (
              <article
                key={k}
                onClick={() => { setDefaultKind(k); setOpen(true); }}
                className="rounded-2xl bg-card border border-border p-3 active:scale-[0.97] transition-bounce cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{meta.emoji}</span>
                  <span className="text-[10px] font-bold text-muted-foreground">{list.length}</span>
                </div>
                <p className="text-[11px] font-bold text-muted-foreground mt-1">{meta.ar}</p>
                <p className="text-base font-extrabold text-foreground mt-0.5">
                  {latest ? (
                    <>
                      {latest.v}
                      {latest.v2 != null && <span className="text-muted-foreground">/{latest.v2}</span>}
                      <span className="text-[10px] text-muted-foreground mr-1">{meta.unit}</span>
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground font-normal">لا يوجد</span>
                  )}
                </p>
                <KindChart kind={k} data={list} />
              </article>
            );
          })}
        </div>
      )}

      {readings.length > 0 && (
        <details className="rounded-2xl bg-card border border-border p-3">
          <summary className="text-sm font-extrabold cursor-pointer">سجل القياسات ({readings.length})</summary>
          <ul className="mt-3 space-y-2 max-h-64 overflow-y-auto">
            {readings.slice(0, 50).map((r) => {
              const m = VITAL_META[r.kind];
              return (
                <li key={r.id} className="flex items-center gap-2 text-xs p-2 rounded-xl bg-muted/50">
                  <span className="text-lg">{m.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-foreground">
                      {m.ar}: {Number(r.value_primary)}
                      {r.value_secondary != null && `/${Number(r.value_secondary)}`} {m.unit}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(r.measured_at).toLocaleString("ar")}
                      {r.notes && ` — ${r.notes}`}
                    </p>
                  </div>
                  <button
                    onClick={() => remove(r.id)}
                    className="h-7 w-7 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center active:scale-90"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              );
            })}
          </ul>
        </details>
      )}

      <VitalsAddSheet
        open={open}
        onClose={() => setOpen(false)}
        defaultKind={defaultKind}
        onSave={async (kind, v1, v2, notes) => {
          await add({
            patient_ref: patientRef,
            kind,
            value_primary: v1,
            value_secondary: v2 ?? null,
            unit: VITAL_META[kind].unit,
            notes: notes ?? null,
          });
        }}
      />
    </section>
  );
});

VitalsTracker.displayName = "VitalsTracker";

// Local row helper (mirrors hook shape without re-export collision)
type VitalReading_ = { id: string; v: number; v2: number | null; t: string; notes: string | null };
