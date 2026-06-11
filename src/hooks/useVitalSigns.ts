import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type VitalKind = "bp" | "glucose" | "pulse" | "temp" | "spo2" | "weight";

export interface VitalReading {
  id: string;
  patient_ref: string;
  kind: VitalKind;
  value_primary: number;
  value_secondary: number | null;
  unit: string | null;
  notes: string | null;
  measured_at: string;
}

export const VITAL_META: Record<VitalKind, { ar: string; emoji: string; unit: string; normal: string; hasSecondary?: boolean }> = {
  bp: { ar: "ضغط الدم", emoji: "💓", unit: "mmHg", normal: "120/80", hasSecondary: true },
  glucose: { ar: "سكر الدم", emoji: "🩸", unit: "mg/dL", normal: "70-140" },
  pulse: { ar: "النبض", emoji: "❤️", unit: "bpm", normal: "60-100" },
  temp: { ar: "الحرارة", emoji: "🌡️", unit: "°C", normal: "36.5-37.5" },
  spo2: { ar: "الأكسجين", emoji: "🫁", unit: "%", normal: "95-100" },
  weight: { ar: "الوزن", emoji: "⚖️", unit: "kg", normal: "—" },
};

export const useVitalSigns = (patientRef: string) => {
  const [readings, setReadings] = useState<VitalReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("vital_signs")
      .select("id,patient_ref,kind,value_primary,value_secondary,unit,notes,measured_at")
      .eq("patient_ref", patientRef)
      .order("measured_at", { ascending: false })
      .limit(200);
    if (error) setError(error.message);
    else setReadings((data ?? []) as VitalReading[]);
    setLoading(false);
  }, [patientRef]);

  useEffect(() => { refresh(); }, [refresh]);

  const add = useCallback(
    async (row: Omit<VitalReading, "id" | "measured_at"> & { measured_at?: string }) => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return { error: "غير مسجل دخول" };
      const { error } = await supabase.from("vital_signs").insert({
        user_id: auth.user.id,
        patient_ref: row.patient_ref,
        kind: row.kind,
        value_primary: row.value_primary,
        value_secondary: row.value_secondary,
        unit: row.unit,
        notes: row.notes,
        measured_at: row.measured_at ?? new Date().toISOString(),
      });
      if (error) return { error: error.message };
      await refresh();
      return { error: null };
    },
    [refresh],
  );

  const remove = useCallback(
    async (id: string) => {
      await supabase.from("vital_signs").delete().eq("id", id);
      await refresh();
    },
    [refresh],
  );

  return { readings, loading, error, add, remove, refresh };
};
