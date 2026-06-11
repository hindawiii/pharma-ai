import { memo } from "react";
import { X, Briefcase, Activity, Syringe, Pill, AlertTriangle, Award, BookOpen } from "lucide-react";
import { NURSING_SPECIALTIES } from "@/data/nursingSpecialties";
import { getSpecialtyDetail } from "@/data/nursingSpecialtyDetails";

interface Props {
  id: number | null;
  onClose: () => void;
}

const Section = ({
  icon,
  title,
  items,
  tone = "default",
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
  tone?: "default" | "danger";
}) => (
  <section
    className={`rounded-2xl border p-3.5 ${
      tone === "danger" ? "bg-[hsl(0_70%_50%/0.08)] border-[hsl(0_70%_50%/0.3)]" : "bg-card border-border"
    }`}
  >
    <h4
      className={`text-sm font-extrabold mb-2 flex items-center gap-1.5 ${
        tone === "danger" ? "text-[hsl(0_72%_45%)]" : "text-primary"
      }`}
    >
      {icon} {title}
    </h4>
    <ul className="space-y-1.5">
      {items.map((it, i) => (
        <li key={i} className="text-sm text-foreground/90 flex items-start gap-2 leading-relaxed">
          <span className={tone === "danger" ? "text-[hsl(0_72%_45%)]" : "text-primary"}>●</span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  </section>
);

export const SpecialtyDetailSheet = memo(({ id, onClose }: Props) => {
  if (id == null) return null;
  const spec = NURSING_SPECIALTIES.find((s) => s.id === id);
  if (!spec) return null;
  const d = getSpecialtyDetail(id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-background rounded-t-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-5 py-3.5 flex items-center gap-3">
          <span className="text-3xl">{spec.emoji}</span>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-extrabold text-foreground leading-tight">{spec.name_ar}</h3>
            <p className="text-xs text-muted-foreground leading-tight">{spec.name_en} · #{spec.id}</p>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-3">
          <section className="rounded-2xl bg-primary/10 border border-primary/30 p-3.5">
            <h4 className="text-sm font-extrabold text-primary mb-1.5 flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" /> نظرة عامة
            </h4>
            <p className="text-sm text-foreground leading-relaxed">{d.overview}</p>
          </section>

          <Section icon={<Briefcase className="h-4 w-4" />} title="مجالات العمل" items={d.scope} />
          <Section icon={<Activity className="h-4 w-4" />} title="المهارات الأساسية" items={d.coreSkills} />
          <Section icon={<Syringe className="h-4 w-4" />} title="إجراءات شائعة" items={d.commonProcedures} />
          <Section icon={<Pill className="h-4 w-4" />} title="أدوية مفتاحية" items={d.keyDrugs} />
          <Section icon={<AlertTriangle className="h-4 w-4" />} title="علامات الخطر" items={d.redFlags} tone="danger" />
          <Section icon={<Award className="h-4 w-4" />} title="الشهادات والاعتمادات" items={d.certifications} />

          <p className="text-[11px] text-muted-foreground text-center pt-2">
            المصادر: ANCC · AACN · ICN · WHO — للتعليم فقط ولا يغني عن المراجع المعتمدة.
          </p>
        </div>
      </div>
    </div>
  );
});

SpecialtyDetailSheet.displayName = "SpecialtyDetailSheet";
