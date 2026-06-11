
CREATE TYPE public.vital_kind AS ENUM ('bp','glucose','pulse','temp','spo2','weight');

CREATE TABLE public.vital_signs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_ref text NOT NULL,
  kind public.vital_kind NOT NULL,
  value_primary numeric NOT NULL,
  value_secondary numeric,
  unit text,
  notes text,
  measured_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.vital_signs TO authenticated;
GRANT ALL ON public.vital_signs TO service_role;

ALTER TABLE public.vital_signs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "vitals own select" ON public.vital_signs FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "vitals own insert" ON public.vital_signs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "vitals own update" ON public.vital_signs FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "vitals own delete" ON public.vital_signs FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX vital_signs_user_patient_kind_time_idx
  ON public.vital_signs (user_id, patient_ref, kind, measured_at DESC);
