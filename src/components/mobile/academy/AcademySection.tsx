import { useEffect, useMemo, useState } from "react";
import { ACADEMY_CATEGORIES, ACADEMY_COURSES, Course, Lesson, totalLessons } from "@/data/academyCourses";
import { ArrowRight, CheckCircle2, Circle, Clock, GraduationCap, Volume2, X } from "lucide-react";
import { useSpeak } from "@/hooks/useSpeak";

const KEY = "pharma_academy_progress";

const loadDone = (): string[] => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
};

const saveDone = (v: string[]) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(v));
  } catch {
    /* ignore */
  }
};

const LessonReader = ({
  course,
  lesson,
  done,
  onToggle,
  onBack,
}: {
  course: Course;
  lesson: Lesson;
  done: boolean;
  onToggle: () => void;
  onBack: () => void;
}) => {
  const speak = useSpeak();
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button onClick={onBack} className="p-1.5 rounded-xl bg-card border border-border" aria-label="رجوع">
          <ArrowRight className="h-4 w-4 text-foreground" />
        </button>
        <p className="text-[11px] font-bold text-muted-foreground truncate">{course.title}</p>
      </div>

      <div className="rounded-3xl bg-card border border-border p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-extrabold text-foreground leading-snug">{lesson.title}</h3>
          <button
            onClick={() => speak(`${lesson.title}. ${lesson.body.join(" ")}`)}
            className="flex-shrink-0 h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center"
            aria-label="استمع للدرس"
          >
            <Volume2 className="h-4 w-4" />
          </button>
        </div>

        {lesson.body.map((p, i) => (
          <p key={i} className="text-[13.5px] leading-relaxed text-foreground/85">
            {p}
          </p>
        ))}

        {lesson.keyPoints && lesson.keyPoints.length > 0 && (
          <div className="rounded-2xl bg-secondary/10 border border-secondary/20 p-3 space-y-1.5">
            <p className="text-[11px] font-extrabold text-secondary">نقاط أساسية</p>
            {lesson.keyPoints.map((k, i) => (
              <p key={i} className="text-[12.5px] text-foreground/85 leading-snug">• {k}</p>
            ))}
          </div>
        )}

        <button
          onClick={onToggle}
          className={`w-full py-2.5 rounded-2xl text-sm font-extrabold transition-bounce active:scale-95 ${
            done ? "bg-secondary/15 text-secondary border border-secondary/30" : "gradient-primary text-white shadow-soft"
          }`}
        >
          {done ? "تم إنجاز الدرس ✓" : "وضع علامة كمكتمل"}
        </button>
      </div>
    </div>
  );
};

export const AcademySection = () => {
  const [open, setOpen] = useState(false);
  const [cat, setCat] = useState<string>("الكل");
  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => setDone(loadDone()), []);

  const toggle = (id: string) => {
    setDone((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      saveDone(next);
      return next;
    });
  };

  const courses = useMemo(
    () => (cat === "الكل" ? ACADEMY_COURSES : ACADEMY_COURSES.filter((c) => c.category === cat)),
    [cat],
  );

  const pct = Math.round((done.length / totalLessons) * 100);

  return (
    <section aria-labelledby="academy-title">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 id="academy-title" className="text-base font-extrabold text-foreground">
          الأكاديمية الطبية
        </h2>
        <span className="text-[11px] font-bold text-muted-foreground">
          {done.length}/{totalLessons} درس
        </span>
      </div>

      <button
        onClick={() => setOpen(true)}
        className="w-full text-right rounded-3xl overflow-hidden shadow-elegant active:scale-[0.98] transition-bounce"
        style={{ background: "linear-gradient(135deg, hsl(265 55% 30%), hsl(280 60% 45%))" }}
      >
        <div className="relative p-5 text-white flex items-center gap-3">
          <div className="absolute -left-6 -bottom-6 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
          <div className="h-14 w-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center flex-shrink-0">
            <GraduationCap className="h-7 w-7" />
          </div>
          <div className="flex-1 min-w-0 relative">
            <p className="text-[11px] font-bold text-white/80 mb-0.5">تعلّم مجاناً</p>
            <h3 className="text-base font-extrabold leading-tight">دورات طبية مبسّطة</h3>
            <p className="text-xs text-white/85 mt-0.5 leading-snug">
              {ACADEMY_COURSES.length} دورات · {totalLessons} دروس · صيدلة وتمريض وإسعافات
            </p>
            <div className="mt-2 h-1.5 rounded-full bg-white/20 overflow-hidden">
              <div className="h-full rounded-full bg-white/90" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col app-shell">
          <header className="flex items-center justify-between px-4 h-14 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-extrabold text-foreground">الأكاديمية الطبية</h3>
            </div>
            <button
              onClick={() => {
                setOpen(false);
                setCourse(null);
                setLesson(null);
              }}
              className="p-2 rounded-xl bg-card border border-border"
              aria-label="إغلاق"
            >
              <X className="h-4 w-4 text-foreground" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
            {course && lesson ? (
              <LessonReader
                course={course}
                lesson={lesson}
                done={done.includes(`${course.id}:${lesson.id}`)}
                onToggle={() => toggle(`${course.id}:${lesson.id}`)}
                onBack={() => setLesson(null)}
              />
            ) : course ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <button onClick={() => setCourse(null)} className="p-1.5 rounded-xl bg-card border border-border" aria-label="رجوع">
                    <ArrowRight className="h-4 w-4 text-foreground" />
                  </button>
                  <p className="text-sm font-extrabold text-foreground truncate">{course.title}</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{course.subtitle}</p>
                <div className="space-y-2">
                  {course.lessons.map((l, i) => {
                    const isDone = done.includes(`${course.id}:${l.id}`);
                    return (
                      <button
                        key={l.id}
                        onClick={() => setLesson(l)}
                        className="w-full text-right rounded-2xl bg-card border border-border p-3 flex items-center gap-3 active:scale-[0.98] transition-bounce"
                      >
                        {isDone ? (
                          <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-extrabold text-foreground truncate">
                            {i + 1}. {l.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Clock className="h-3 w-3" /> {l.minutes} دقائق
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-1.5 overflow-x-auto -mx-4 px-4 pb-1" style={{ scrollbarWidth: "none" }}>
                  {ACADEMY_CATEGORIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCat(c)}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold transition-bounce ${
                        cat === c ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>

                {courses.map((c) => {
                  const cDone = c.lessons.filter((l) => done.includes(`${c.id}:${l.id}`)).length;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setCourse(c)}
                      className="w-full text-right rounded-3xl bg-card border border-border p-4 flex items-center gap-3 active:scale-[0.98] transition-bounce shadow-soft"
                    >
                      <span className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl flex-shrink-0">
                        {c.emoji}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-[14px] font-extrabold text-foreground truncate">{c.title}</p>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground flex-shrink-0">
                            {c.level}
                          </span>
                        </div>
                        <p className="text-[11.5px] text-muted-foreground leading-snug mt-0.5">{c.subtitle}</p>
                        <p className="text-[10.5px] font-bold text-primary mt-1">
                          {cDone}/{c.lessons.length} دروس مكتملة
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
