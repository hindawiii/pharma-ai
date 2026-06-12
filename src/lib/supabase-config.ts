// ⚠️ External Supabase configuration — PREPARED FOR THE FUTURE, NOT ACTIVE.
//
// Health data MUST NOT be uploaded to any Cloud without explicit user permission.
// Currently, all health data lives in localStorage (see src/lib/localHealthStore.ts).
//
// TODO: activate only when the user says "ابدأ المرحلة ٣ — فعّل Supabase الخارجي"
//       and provides:
//         • SUPABASE_URL
//         • SUPABASE_ANON_KEY
//         • encryption key (or a method to generate it client-side)
//
// import { createClient } from "@supabase/supabase-js";
//
// const SUPABASE_URL = "https://your-external-project.supabase.co";
// const SUPABASE_ANON_KEY = "your-anon-key";
//
// export const supabaseExternal = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const EXTERNAL_SUPABASE_ENABLED = false;
