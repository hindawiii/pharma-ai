import { useCallback, useEffect, useState } from "react";

export interface NursingPatient {
  id: string;
  name: string;
  emoji: string;
  age?: number;
  conditions?: string;
}

const STORAGE_KEY = "pharma-i:nursing:patients:v1";
const ACTIVE_KEY = "pharma-i:nursing:active-patient:v1";

const DEFAULT_PATIENTS: NursingPatient[] = [
  { id: "father", name: "والدي", emoji: "👴" },
  { id: "mother", name: "والدتي", emoji: "👵" },
  { id: "child", name: "طفلي", emoji: "👶" },
];

const read = (): NursingPatient[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PATIENTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_PATIENTS;
  } catch {
    return DEFAULT_PATIENTS;
  }
};

export const useNursingPatients = () => {
  const [patients, setPatients] = useState<NursingPatient[]>(read);
  const [activeId, setActiveId] = useState<string>(
    () => localStorage.getItem(ACTIVE_KEY) || DEFAULT_PATIENTS[0].id,
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem(ACTIVE_KEY, activeId);
  }, [activeId]);

  const addPatient = useCallback((p: Omit<NursingPatient, "id">) => {
    const id = `p-${Date.now()}`;
    setPatients((prev) => [...prev, { ...p, id }]);
    setActiveId(id);
  }, []);

  const removePatient = useCallback((id: string) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
    setActiveId((curr) => (curr === id ? DEFAULT_PATIENTS[0].id : curr));
  }, []);

  const active = patients.find((p) => p.id === activeId) ?? patients[0];

  return { patients, active, activeId, setActiveId, addPatient, removePatient };
};
