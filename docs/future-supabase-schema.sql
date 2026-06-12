-- ⚠️ FOR THE FUTURE ONLY — DO NOT RUN.
-- This schema is for an EXTERNAL Supabase project (supabase.com), not Lovable Cloud.
-- Activate only when the user explicitly approves phase 3 and provides credentials.

CREATE TABLE IF NOT EXISTS vitals_encrypted (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  encrypted_data TEXT NOT NULL, -- 🔒 AES-256-GCM, key stays on the user's device
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON vitals_encrypted TO authenticated;
GRANT ALL ON vitals_encrypted TO service_role;

ALTER TABLE vitals_encrypted ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their data"
  ON vitals_encrypted FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
