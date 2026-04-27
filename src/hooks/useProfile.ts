import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Profile {
  id: string;
  display_name: string | null;
  age: number | null;
  blood_type: string | null;
  allergies: string[];
  chronic_conditions: string[];
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("id, display_name, age, blood_type, allergies, chronic_conditions")
      .eq("id", user.id)
      .maybeSingle();
    setProfile(data as Profile | null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const update = useCallback(
    async (patch: Partial<Profile>) => {
      if (!user) return { error: "غير مسجل" };
      const { error } = await supabase
        .from("profiles")
        .update({ ...patch, updated_at: new Date().toISOString() })
        .eq("id", user.id);
      if (!error) await fetchProfile();
      return { error: error?.message ?? null };
    },
    [user, fetchProfile],
  );

  return { profile, loading, update, refetch: fetchProfile };
};
