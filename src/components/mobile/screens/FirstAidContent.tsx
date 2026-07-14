import { memo, useState } from "react";
import * as Icons from "lucide-react";
import {
  Flame, Shield, Siren, AlertTriangle, CheckCircle2, XCircle, Info, BookOpen, ListChecks,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useUserLocation } from "@/hooks/useUserLocation";
import { getCountryByCode } from "@/lib/emergencyNumbers";
import { CountrySelector } from "../CountrySelector";
import {
  FIRST_AID_TOPICS,
  FIRST_AID_CATEGORIES,
  getTopic,
  type FirstAidSection,
} from "@/data/firstAidTopics";
import { CprMetronome } from "../firstaid/CprMetronome";
import { FirstAidTimer } from "../firstaid/FirstAidTimer";
import { FirstAidChecklist } from "../firstaid/FirstAidChecklist";

// Re-export for backward compatibility
export type FirstAidKey = string;

// Build tabs dynamically from data
export const FIRST_AID_TABS: { key: FirstAidKey; label: string; icon: LucideIcon }[] =
  FIRST_AID_TOPICS.map((t) => {
    const Ic = (Icons as unknown as Record<string, LucideIcon>)[t.icon] ?? Icons.HeartPulse;
    return { key: t.key, label: t.label, icon: Ic };
  });

// ────────────────────────────────────────────────────────────
// Reusable presentational pieces
// ────────────────────────────────────────────────────────────
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h4 className="text-sm font-extrabold text-[#C62828] mt-4 mb-2 flex items-center gap-2">
    <span className="h-1.5 w-1.5 rounded-full bg-[#C62828]" />
    {children}
  </h4>
);

const Steps = ({ items }: { items: string[] }) => (
  <ol className="space-y-2 text-sm leading-relaxed text-foreground">
    {items.map((s, i) => (
      <li key={i} className="flex gap-2">
        <span className="flex-shrink-0 h-6 w-6 rounded-full bg-[#C62828] text-white text-[11px] font-bold flex items-center justify-center">
          {i + 1}
        </span>
        <span className="flex-1 pt-0.5">{s}</span>
      </li>
    ))}
  </ol>
);

const Bullets = ({ items, tone = "default" }: { items: string[]; tone?: "default" | "do" | "dont" }) => {
  const Icon = tone === "dont" ? XCircle : tone === "do" ? CheckCircle2 : Info;
  const color = tone === "dont" ? "text-[#C62828]" : tone === "do" ? "text-emerald-600" : "text-[#1D3557]";
  return (
    <ul className="space-y-1.5 text-sm leading-relaxed text-foreground">
      {items.map((s, i) => (
        <li key={i} className="flex gap-2">
          <Icon className={`h-4 w-4 flex-shrink-0 mt-0.5 ${color}`} />
          <span className="flex-1">{s}</span>
        </li>
      ))}
    </ul>
  );
};

const Warning = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl bg-[#C62828]/10 border border-[#C62828]/30 p-3 flex items-start gap-2 mt-3">
    <AlertTriangle className="h-4 w-4 text-[#C62828] flex-shrink-0 mt-0.5" />
    <div className="text-xs font-bold text-[#C62828] leading-relaxed">{children}</div>
  </div>
);

const InfoBox = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl bg-[#1D3557]/5 border border-[#1D3557]/20 p-3 text-xs text-[#1D3557] leading-relaxed mt-3">
    {children}
  </div>
);

const SimpleTable = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div className="rounded-2xl border border-[#C62828]/20 overflow-hidden mt-3">
    <table className="w-full text-xs" dir="rtl">
      <thead className="bg-[#C62828] text-white">
        <tr>
          {headers.map((h, i) => (
            <th key={i} className="px-2 py-2 text-right font-bold">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, ri) => (
          <tr key={ri} className={ri % 2 ? "bg-[#C62828]/5" : "bg-white"}>
            {r.map((c, ci) => (
              <td key={ci} className="px-2 py-2 text-foreground border-t border-[#C62828]/10">{c}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ────────────────────────────────────────────────────────────
// Section renderer (data → JSX)
// ────────────────────────────────────────────────────────────
const RenderSection = ({ s }: { s: FirstAidSection }) => {
  switch (s.type) {
    case "heading":
      return <SectionTitle>{s.title}</SectionTitle>;
    case "paragraph":
      return <p className="text-sm text-foreground leading-relaxed mt-2">{s.text}</p>;
    case "steps":
      return <Steps items={s.items ?? []} />;
    case "bullets":
      return <Bullets items={s.items ?? []} tone={s.tone} />;
    case "table":
      return <SimpleTable headers={s.headers ?? []} rows={s.rows ?? []} />;
    case "warning":
      return <Warning>{s.text}</Warning>;
    case "info":
      return <InfoBox>{s.text}</InfoBox>;
    default:
      return null;
  }
};

// ────────────────────────────────────────────────────────────
// Intro block (unchanged behavior)
// ────────────────────────────────────────────────────────────
export const FirstAidIntro = memo(() => {
  const { location } = useUserLocation();
  const country = getCountryByCode(location?.countryCode);
  const items = [
    { label: "الإسعاف", num: country.numbers.ambulance, icon: Siren },
    { label: "الطوارئ", num: country.numbers.police, icon: Shield },
    { label: "المطافئ", num: country.numbers.fire, icon: Flame },
  ];

  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-gradient-to-l from-[#C62828] to-[#8B1A1A] text-white p-4 shadow-soft">
        <h3 className="text-base font-extrabold mb-2">أهمية الإسعافات الأولية</h3>
        <p className="text-xs leading-relaxed text-white/95">
          الإسعافات الأولية هي المساعدة الطبية الفورية التي تُقدَّم لمصاب قبل وصول المساعدة الطبية المتخصصة.
        </p>
        <p className="text-xs leading-relaxed text-white/95 mt-2">
          تهدف إلى إنقاذ الحياة، منع تفاقم الإصابة، تخفيف الألم، وتجنب المضاعفات.
        </p>
      </div>

      <div className="rounded-2xl border-r-4 border-[#C62828] bg-[#C62828]/5 p-3">
        <p className="text-sm font-bold text-[#C62828] leading-relaxed">"كل دقيقة لها أهميتها"</p>
        <p className="text-xs text-foreground mt-1 leading-relaxed">
          السرعة في التدخل هي الفرق بين الحياة والوفاة.
        </p>
      </div>

      {/* Emergency numbers — country aware */}
      <div>
        <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
          <h4 className="text-sm font-extrabold text-foreground">أرقام الطوارئ ({country.nameAr})</h4>
          <CountrySelector compact />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {items.map((x) => {
            const Icon = x.icon;
            return (
              <a
                key={x.label}
                href={`tel:${x.num}`}
                className="rounded-2xl bg-white border-2 border-[#C62828] p-3 flex flex-col items-center gap-1 transition-bounce active:scale-95 hover:bg-[#C62828]/5"
              >
                <Icon className="h-4 w-4 text-[#C62828]" />
                <span className="text-[11px] font-bold text-foreground">{x.label}</span>
                <span className="text-base font-extrabold text-[#C62828] tracking-wider">{x.num}</span>
              </a>
            );
          })}
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
          الأرقام تتحدث تلقائياً حسب موقعك. اضغط على المؤشّر لتحديد الموقع أو غيّر الدولة يدوياً.
        </p>
      </div>

      {/* Category legend */}
      <div className="rounded-2xl border border-border p-3 bg-card">
        <h4 className="text-xs font-extrabold text-foreground mb-2">تصنيفات المواضيع</h4>
        <div className="flex flex-wrap gap-1.5">
          {FIRST_AID_CATEGORIES.map((c) => (
            <span
              key={c.key}
              className="text-[10px] font-bold px-2 py-1 rounded-lg"
              style={{ backgroundColor: `${c.color}15`, color: c.color }}
            >
              {c.label}
            </span>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
          {FIRST_AID_TOPICS.length} موضوعاً مبنياً على بروتوكولات دولية معتمدة (AHA · WHO · IFRC · Red Cross).
        </p>
      </div>
    </div>
  );
});
FirstAidIntro.displayName = "FirstAidIntro";

// ────────────────────────────────────────────────────────────
// Content renderer
// ────────────────────────────────────────────────────────────
export const FirstAidContent = memo(({ section }: { section: FirstAidKey }) => {
  const topic = getTopic(section);
  const [checklistMode, setChecklistMode] = useState(false);
  if (!topic) return null;

  const cat = FIRST_AID_CATEGORIES.find((c) => c.key === topic.category);

  // Aggregate all step items across "steps" sections for checklist mode
  const allSteps = topic.sections.filter((s) => s.type === "steps").flatMap((s) => s.items ?? []);

  // Topic-specific tools
  const tool = (() => {
    if (topic.key === "cpr") return <CprMetronome />;
    if (topic.key === "burns") return <FirstAidTimer minutes={20} label="مؤقّت شطف الحرق بالماء" hint="اشطف بماء جارٍ فاتر 15–20 دقيقة. لا تستخدم ثلجاً." />;
    if (topic.key === "eye") return <FirstAidTimer minutes={15} label="مؤقّت غسل العين" hint="غسل مستمر بماء نظيف لا يقل عن 15 دقيقة." />;
    if (topic.key === "poison-ingest") return <FirstAidTimer minutes={2} label="مؤقّت الاتصال بمركز السموم" hint="اتصل بمركز السموم فوراً وقدّم عمر المصاب واسم المادة." />;
    return null;
  })();

  return (
    <div>
      {/* Category badge + summary */}
      <div className="flex items-center justify-between gap-2 mb-2">
        {cat && (
          <span
            className="text-[10px] font-bold px-2 py-1 rounded-lg"
            style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
          >
            {cat.label}
          </span>
        )}
        <span className="text-[10px] text-muted-foreground">آخر تحديث: {topic.updatedAt}</span>
      </div>

      {topic.summary && (
        <p className="text-xs text-muted-foreground leading-relaxed mb-2">{topic.summary}</p>
      )}

      {/* Checklist toggle */}
      {allSteps.length > 0 && (
        <div className="flex items-center justify-end mt-2">
          <button
            onClick={() => setChecklistMode((v) => !v)}
            className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border-2 flex items-center gap-1 transition-bounce active:scale-95 ${
              checklistMode ? "bg-[#00695C] text-white border-[#00695C]" : "bg-white text-[#00695C] border-[#00695C]"
            }`}
          >
            <ListChecks className="h-3.5 w-3.5" />
            {checklistMode ? "عرض التفاصيل" : "وضع قائمة التنفيذ"}
          </button>
        </div>
      )}

      {checklistMode ? (
        <FirstAidChecklist storageKey={topic.key} items={allSteps} title={`قائمة تنفيذ · ${topic.label}`} />
      ) : (
        topic.sections.map((s, i) => <RenderSection key={i} s={s} />)
      )}

      {/* Interactive tool for this topic */}
      {!checklistMode && tool}

      {/* Sources */}
      {topic.sources.length > 0 && (
        <div className="mt-5 rounded-2xl bg-muted/50 border border-border p-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[11px] font-extrabold text-foreground">المصادر</span>
          </div>
          <ul className="text-[10px] text-muted-foreground space-y-0.5">
            {topic.sources.map((src, i) => (
              <li key={i}>• {src.name}{src.year ? ` (${src.year})` : ""}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-[10px] text-muted-foreground mt-3 text-center leading-relaxed">
        المحتوى للتوعية فقط ولا يُغني عن استشارة طبيب مختص أو الاتصال بالطوارئ.
      </p>
    </div>
  );
});
FirstAidContent.displayName = "FirstAidContent";
