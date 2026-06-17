// Local-only health data store. All sensitive health data lives in localStorage,
// lightly obfuscated with Base64. No Cloud, no network. Do not change this without
// explicit user permission.

const KEYS = {
  vitals: "pharma-i:health:vitals:v1",
  reminders: "pharma-i:health:reminders:v1",
  notes: "pharma-i:health:notes:v1",
} as const;

export type HealthKey = keyof typeof KEYS;

// --- Base64 obfuscation (NOT real encryption — see src/lib/crypto.ts for future) ---
const enc = (data: unknown) => {
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  } catch {
    return "";
  }
};
const dec = <T,>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try {
    return JSON.parse(decodeURIComponent(escape(atob(raw)))) as T;
  } catch {
    try { return JSON.parse(raw) as T; } catch { return fallback; }
  }
};

const read = <T,>(key: HealthKey, fallback: T): T =>
  dec<T>(localStorage.getItem(KEYS[key]), fallback);

const write = (key: HealthKey, value: unknown) => {
  localStorage.setItem(KEYS[key], enc(value));
  window.dispatchEvent(new CustomEvent("local-health-changed", { detail: { key } }));
};

// --- Vitals ---
export interface VitalReading {
  id: string;
  patient_id?: string;
  type: "bp" | "glucose" | "weight" | "temp" | "spo2" | "pulse";
  systolic?: number;
  diastolic?: number;
  value?: number;
  unit?: string;
  note?: string;
  date: string; // ISO
}

export const getVitals = () => read<VitalReading[]>("vitals", []);
export const saveVital = (v: Omit<VitalReading, "id" | "date">) => {
  const list = getVitals();
  list.unshift({ ...v, id: crypto.randomUUID(), date: new Date().toISOString() });
  write("vitals", list);
};
export const deleteVital = (id: string) =>
  write("vitals", getVitals().filter((v) => v.id !== id));

// --- Reminders (medication) ---
export interface LocalReminder {
  id: string;
  patient_id?: string;
  drug_name: string;
  frequency: "daily" | "weekdays" | "interval";
  weekdays: number[] | null;
  interval_hours: number | null;
  times: string[] | null;
  active: boolean;
  notes: string | null;
  start_date: string;
  created_at: string;
}

export const getReminders = () => read<LocalReminder[]>("reminders", []);
export const addReminder = (r: Omit<LocalReminder, "id" | "created_at">) => {
  const list = getReminders();
  list.unshift({ ...r, id: crypto.randomUUID(), created_at: new Date().toISOString() });
  write("reminders", list);
};
export const removeReminder = (id: string) =>
  write("reminders", getReminders().filter((r) => r.id !== id));

// --- Daily notes ---
export interface DailyNote {
  id: string;
  patient_id?: string;
  text: string;
  date: string;
}
export const getNotes = () => read<DailyNote[]>("notes", []);
export const addNote = (n: Omit<DailyNote, "id" | "date">) => {
  const list = getNotes();
  list.unshift({ ...n, id: crypto.randomUUID(), date: new Date().toISOString() });
  write("notes", list);
};
export const removeNote = (id: string) =>
  write("notes", getNotes().filter((n) => n.id !== id));

// --- Export / Import / Wipe ---
export const exportAllHealthData = () => ({
  exported_at: new Date().toISOString(),
  version: 1,
  vitals: getVitals(),
  reminders: getReminders(),
  notes: getNotes(),
});

export const downloadHealthBackup = () => {
  const blob = new Blob([JSON.stringify(exportAllHealthData(), null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `pharma-i-health-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importHealthBackup = async (file: File): Promise<boolean> => {
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed.vitals)) write("vitals", parsed.vitals);
    if (Array.isArray(parsed.reminders)) write("reminders", parsed.reminders);
    if (Array.isArray(parsed.notes)) write("notes", parsed.notes);
    return true;
  } catch {
    return false;
  }
};

export const wipeAllHealthData = () => {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  window.dispatchEvent(new CustomEvent("local-health-changed", { detail: { key: "all" } }));
};
