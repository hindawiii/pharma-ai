export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      drug_interactions: {
        Row: {
          created_at: string
          description_ar: string
          drug_a: string
          drug_b: string
          id: string
          severity: Database["public"]["Enums"]["interaction_severity"]
        }
        Insert: {
          created_at?: string
          description_ar: string
          drug_a: string
          drug_b: string
          id?: string
          severity: Database["public"]["Enums"]["interaction_severity"]
        }
        Update: {
          created_at?: string
          description_ar?: string
          drug_a?: string
          drug_b?: string
          id?: string
          severity?: Database["public"]["Enums"]["interaction_severity"]
        }
        Relationships: [
          {
            foreignKeyName: "drug_interactions_drug_a_fkey"
            columns: ["drug_a"]
            isOneToOne: false
            referencedRelation: "drugs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drug_interactions_drug_b_fkey"
            columns: ["drug_b"]
            isOneToOne: false
            referencedRelation: "drugs"
            referencedColumns: ["id"]
          },
        ]
      }
      drugs: {
        Row: {
          brand_ar: string
          brand_en: string
          category_ar: string | null
          created_at: string
          description_ar: string | null
          form: string | null
          id: string
          manufacturer: string | null
          price_sdg: number | null
          scientific_ar: string
          scientific_en: string
          search_doc: unknown
        }
        Insert: {
          brand_ar: string
          brand_en: string
          category_ar?: string | null
          created_at?: string
          description_ar?: string | null
          form?: string | null
          id?: string
          manufacturer?: string | null
          price_sdg?: number | null
          scientific_ar: string
          scientific_en: string
          search_doc?: unknown
        }
        Update: {
          brand_ar?: string
          brand_en?: string
          category_ar?: string | null
          created_at?: string
          description_ar?: string | null
          form?: string | null
          id?: string
          manufacturer?: string | null
          price_sdg?: number | null
          scientific_ar?: string
          scientific_en?: string
          search_doc?: unknown
        }
        Relationships: []
      }
      pharmacies: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          id: string
          lat: number | null
          lng: number | null
          name: string
          open_24h: boolean | null
          phone: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          id?: string
          lat?: number | null
          lng?: number | null
          name: string
          open_24h?: boolean | null
          phone?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          id?: string
          lat?: number | null
          lng?: number | null
          name?: string
          open_24h?: boolean | null
          phone?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          allergies: string[]
          blood_type: string | null
          chronic_conditions: string[]
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          age?: number | null
          allergies?: string[]
          blood_type?: string | null
          chronic_conditions?: string[]
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          age?: number | null
          allergies?: string[]
          blood_type?: string | null
          chronic_conditions?: string[]
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      reminders: {
        Row: {
          active: boolean
          created_at: string
          drug_id: string | null
          drug_name: string
          frequency: Database["public"]["Enums"]["reminder_frequency"]
          id: string
          interval_hours: number | null
          notes: string | null
          start_date: string
          times: string[] | null
          user_id: string
          weekdays: number[] | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          drug_id?: string | null
          drug_name: string
          frequency?: Database["public"]["Enums"]["reminder_frequency"]
          id?: string
          interval_hours?: number | null
          notes?: string | null
          start_date?: string
          times?: string[] | null
          user_id: string
          weekdays?: number[] | null
        }
        Update: {
          active?: boolean
          created_at?: string
          drug_id?: string | null
          drug_name?: string
          frequency?: Database["public"]["Enums"]["reminder_frequency"]
          id?: string
          interval_hours?: number | null
          notes?: string | null
          start_date?: string
          times?: string[] | null
          user_id?: string
          weekdays?: number[] | null
        }
        Relationships: [
          {
            foreignKeyName: "reminders_drug_id_fkey"
            columns: ["drug_id"]
            isOneToOne: false
            referencedRelation: "drugs"
            referencedColumns: ["id"]
          },
        ]
      }
      vital_signs: {
        Row: {
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["vital_kind"]
          measured_at: string
          notes: string | null
          patient_ref: string
          unit: string | null
          user_id: string
          value_primary: number
          value_secondary: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          kind: Database["public"]["Enums"]["vital_kind"]
          measured_at?: string
          notes?: string | null
          patient_ref: string
          unit?: string | null
          user_id: string
          value_primary: number
          value_secondary?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["vital_kind"]
          measured_at?: string
          notes?: string | null
          patient_ref?: string
          unit?: string | null
          user_id?: string
          value_primary?: number
          value_secondary?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      interaction_severity: "danger" | "warning" | "safe"
      reminder_frequency: "daily" | "weekdays" | "interval"
      vital_kind: "bp" | "glucose" | "pulse" | "temp" | "spo2" | "weight"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      interaction_severity: ["danger", "warning", "safe"],
      reminder_frequency: ["daily", "weekdays", "interval"],
      vital_kind: ["bp", "glucose", "pulse", "temp", "spo2", "weight"],
    },
  },
} as const
