import { memo } from "react";
import { X, BookOpen, Wrench, Library } from "lucide-react";
import { getSpecialtyContent } from "@/data/nursingSpecialtyContent";
import type { NursingSpecialty } from "@/data/nursingSpecialties";

export const SpecialtyDetailSheet = memo(
  ({ specialty, onClose }: { specialty: NursingSpecialty | null; onClose: () => void }) => {
    if (!specialty) return null;
    const c = getSpecialtyContent(specialty.id);
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end" onClick={onClose}>
        <div
          className="w-full max-w-md mx-auto bg-card rounded-t-3xl max-h-[85vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-card/95 backdrop-blur border-b border-border p-4 flex items-center gap-3 z-10">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl">
              {specialty.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-extrabold text-foreground leading-tight">{specialty.name_ar}</h3>
              <p className="text-[11px] text-muted-foreground">{specialty.name_en}</p>
            </div>
            <button onClick={onClose} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-4 space-y-5 pb-8">
            <p className="text-sm text-foreground leading-relaxed">{c.overview}</p>

            <section>
              <h4 className="text-sm font-extrabold mb-2 flex items-center gap-1.5 text-primary">
                <BookOpen className="h-4 w-4" /> المهارات الأساسية
              </h4>
              <ul className="space-y-1.5">
                {c.skills.map((s, i) => (
                  <li key={i} className="text-sm text-foreground flex items-start gap-2 leading-relaxed">
                    <span className="text-primary mt-0.5">●</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h4 className="text-sm font-extrabold mb-2 flex items-center gap-1.5 text-secondary">
                <Wrench className="h-4 w-4" /> الأدوات والأجهزة
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {c.tools.map((t, i) => (
                  <span key={i} className="text-xs font-bold px-2.5 py-1 rounded-xl bg-secondary/10 text-secondary">
                    {t}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h4 className="text-sm font-extrabold mb-2 flex items-center gap-1.5 text-muted-foreground">
                <Library className="h-4 w-4" /> المراجع
              </h4>
              <ul className="text-[11px] text-muted-foreground space-y-0.5">
                {c.refs.map((r, i) => (
                  <li key={i}>• {r}</li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl bg-muted/50 border border-border p-3">
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                المحتوى الكامل (المنهج · الاختبارات · الشهادات) قادم في المرحلة ٣.
              </p>
            </section>
          </div>
        </div>
      </div>
    );
  },
);
SpecialtyDetailSheet.displayName = "SpecialtyDetailSheet";
