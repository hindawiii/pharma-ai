import { useMemo, useState } from "react";
import { Search, Activity, FlaskConical, BookOpen, Calculator, FileText } from "lucide-react";
import {
  VITAL_SIGNS_BY_AGE,
  LAB_VALUES,
  ABBREVIATIONS,
  NANDA_DIAGNOSES,
} from "@/data/nursingReference";
import { NursingCalculators } from "./NursingCalculators";

type RefTab = "vitals" | "labs" | "abbr" | "nanda" | "calc";

const TABS: { id: RefTab; label: string; icon: typeof Activity }[] = [
  { id: "vitals", label: "علامات حيوية", icon: Activity },
  { id: "labs", label: "قيم مخبرية", icon: FlaskConical },
  { id: "abbr", label: "اختصارات", icon: FileText },
  { id: "nanda", label: "NANDA", icon: BookOpen },
  { id: "calc", label: "حاسبات", icon: Calculator },
];

const SearchBar = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) => (
  <div className="relative">
    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pr-9 pl-3 py-2.5 rounded-2xl bg-card border border-border focus:border-primary outline-none text-sm text-right"
      dir="rtl"
    />
  </div>
);

const VitalsView = () => (
  <div className="space-y-2.5">
    {VITAL_SIGNS_BY_AGE.map((v) => (
      <div key={v.group} className="rounded-2xl bg-card border border-border p-3.5">
        <div className="flex items-baseline justify-between mb-2">
          <h4 className="text-sm font-extrabold text-foreground">{v.group}</h4>
          <span className="text-[11px] text-muted-foreground">{v.ageLabel}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[12px]">
          <div className="rounded-xl bg-[hsl(0_70%_50%/0.08)] p-2">
            <p className="text-[10px] text-muted-foreground">النبض HR</p>
            <p className="font-extrabold text-[hsl(0_72%_45%)]" dir="ltr">{v.hr}</p>
          </div>
          <div className="rounded-xl bg-[hsl(210_85%_50%/0.08)] p-2">
            <p className="text-[10px] text-muted-foreground">التنفس RR</p>
            <p className="font-extrabold text-[hsl(210_85%_45%)]" dir="ltr">{v.rr}</p>
          </div>
          <div className="rounded-xl bg-[hsl(270_60%_55%/0.08)] p-2">
            <p className="text-[10px] text-muted-foreground">SBP mmHg</p>
            <p className="font-extrabold text-[hsl(270_60%_50%)]" dir="ltr">{v.sbp}</p>
          </div>
          <div className="rounded-xl bg-[hsl(40_90%_50%/0.1)] p-2">
            <p className="text-[10px] text-muted-foreground">الحرارة °C</p>
            <p className="font-extrabold text-[hsl(40_90%_38%)]" dir="ltr">{v.temp}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const LabsView = () => {
  const [q, setQ] = useState("");
  const cats = useMemo(() => Array.from(new Set(LAB_VALUES.map((l) => l.category))), []);
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return LAB_VALUES;
    return LAB_VALUES.filter(
      (l) =>
        l.test.toLowerCase().includes(query) ||
        (l.abbr ?? "").toLowerCase().includes(query) ||
        l.category.toLowerCase().includes(query),
    );
  }, [q]);
  return (
    <div className="space-y-3">
      <SearchBar value={q} onChange={setQ} placeholder="ابحث عن تحليل (Na, Hb, ...)" />
      {cats.map((cat) => {
        const rows = filtered.filter((l) => l.category === cat);
        if (rows.length === 0) return null;
        return (
          <section key={cat}>
            <h4 className="text-xs font-extrabold text-primary mb-1.5">{cat}</h4>
            <div className="rounded-2xl bg-card border border-border overflow-hidden divide-y divide-border">
              {rows.map((l, i) => (
                <div key={i} className="p-2.5 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-foreground truncate">{l.test}</p>
                    {l.abbr && <p className="text-[10px] text-muted-foreground" dir="ltr">{l.abbr}</p>}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[13px] font-extrabold text-foreground" dir="ltr">{l.range} <span className="text-[10px] text-muted-foreground">{l.unit}</span></p>
                    {l.critical && <p className="text-[10px] text-[hsl(0_72%_45%)]" dir="ltr">⚠ {l.critical}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
      {filtered.length === 0 && <p className="text-center text-sm text-muted-foreground py-6">لا نتائج</p>}
    </div>
  );
};

const AbbrView = () => {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const cats = useMemo(() => Array.from(new Set(ABBREVIATIONS.map((a) => a.category))), []);
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return ABBREVIATIONS.filter((a) => {
      if (cat !== "all" && a.category !== cat) return false;
      if (!query) return true;
      return (
        a.abbr.toLowerCase().includes(query) ||
        a.meaning_en.toLowerCase().includes(query) ||
        a.meaning_ar.includes(query)
      );
    });
  }, [q, cat]);
  const catLabel: Record<string, string> = {
    general: "عام", route: "طرق إعطاء", frequency: "تكرار", vitals: "علامات", labs: "تحاليل", diagnosis: "تشخيصات", procedure: "إجراءات",
  };
  return (
    <div className="space-y-3">
      <SearchBar value={q} onChange={setQ} placeholder={`ابحث في ${ABBREVIATIONS.length} اختصار...`} />
      <div className="flex gap-1.5 overflow-x-auto -mx-4 px-4 pb-1" style={{ scrollbarWidth: "none" }}>
        {["all", ...cats].map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold transition-bounce ${
              cat === c ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"
            }`}
          >
            {c === "all" ? "الكل" : catLabel[c]}
          </button>
        ))}
      </div>
      <div className="rounded-2xl bg-card border border-border overflow-hidden divide-y divide-border">
        {filtered.map((a, i) => (
          <div key={i} className="p-2.5 flex items-center gap-3">
            <div className="flex-shrink-0 min-w-[70px] px-2 py-1 rounded-lg bg-primary/10 text-primary text-center">
              <p className="text-[13px] font-extrabold" dir="ltr">{a.abbr}</p>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold text-foreground truncate">{a.meaning_ar}</p>
              <p className="text-[10px] text-muted-foreground truncate" dir="ltr">{a.meaning_en}</p>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-center text-sm text-muted-foreground py-6">لا نتائج</p>}
    </div>
  );
};

const NandaView = () => {
  const [q, setQ] = useState("");
  const domains = useMemo(() => Array.from(new Set(NANDA_DIAGNOSES.map((n) => n.domain))), []);
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return NANDA_DIAGNOSES;
    return NANDA_DIAGNOSES.filter(
      (n) => n.name_ar.includes(query) || n.name_en.toLowerCase().includes(query) || n.code.includes(query),
    );
  }, [q]);
  return (
    <div className="space-y-3">
      <SearchBar value={q} onChange={setQ} placeholder={`ابحث في ${NANDA_DIAGNOSES.length} تشخيص تمريضي...`} />
      {domains.map((d) => {
        const rows = filtered.filter((n) => n.domain === d);
        if (rows.length === 0) return null;
        return (
          <section key={d}>
            <h4 className="text-xs font-extrabold text-primary mb-1.5">{d}</h4>
            <div className="space-y-1.5">
              {rows.map((n) => (
                <div key={n.id} className="rounded-2xl bg-card border border-border p-2.5 flex items-start gap-2.5">
                  <span className="flex-shrink-0 text-[10px] font-extrabold text-muted-foreground bg-muted rounded-md px-1.5 py-0.5" dir="ltr">
                    {n.code}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-extrabold text-foreground leading-tight">{n.name_ar}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5" dir="ltr">{n.name_en}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
      {filtered.length === 0 && <p className="text-center text-sm text-muted-foreground py-6">لا نتائج</p>}
    </div>
  );
};

export const NursingReferenceHub = () => {
  const [tab, setTab] = useState<RefTab>("vitals");
  return (
    <div className="space-y-4 pb-8">
      {/* Tab bar */}
      <div className="flex gap-1.5 overflow-x-auto -mx-4 px-4 pb-1" style={{ scrollbarWidth: "none" }}>
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-extrabold transition-bounce border ${
                active ? "bg-primary text-primary-foreground border-primary shadow-soft" : "bg-card border-border text-muted-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {tab === "vitals" && <VitalsView />}
      {tab === "labs" && <LabsView />}
      {tab === "abbr" && <AbbrView />}
      {tab === "nanda" && <NandaView />}
      {tab === "calc" && <NursingCalculators />}

      {/* Sources */}
      <section className="rounded-2xl bg-muted/50 border border-border p-3 mt-4">
        <p className="text-[10px] text-muted-foreground leading-relaxed text-center">
          المصادر: WHO · CDC · AHA/PALS · Lippincott · NANDA-I 2024
        </p>
      </section>
    </div>
  );
};
