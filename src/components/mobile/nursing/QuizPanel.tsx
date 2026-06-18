import { useMemo, useState } from "react";
import { CheckCircle2, XCircle, Award, RotateCcw, Download } from "lucide-react";
import { getQuiz, PASS_SCORE, type QuizQuestion } from "@/data/nursingQuizzes";
import { generateCertificatePdf } from "@/lib/certificate";

interface Props {
  specialtyId: number;
  specialtyAr: string;
  specialtyEn: string;
}

export const QuizPanel = ({ specialtyId, specialtyAr, specialtyEn }: Props) => {
  const questions = useMemo<QuizQuestion[]>(() => getQuiz(specialtyId), [specialtyId]);
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [showExplain, setShowExplain] = useState(false);
  const [studentName, setStudentName] = useState("");

  const reset = () => {
    setStarted(false);
    setIdx(0);
    setAnswers([]);
    setPicked(null);
    setShowExplain(false);
  };

  if (!started) {
    return (
      <button
        onClick={() => setStarted(true)}
        className="w-full p-4 rounded-2xl bg-primary/10 border border-primary/30 flex items-center gap-3 active:scale-[0.98] transition-bounce"
      >
        <span className="h-11 w-11 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center">
          <Award className="h-5 w-5" />
        </span>
        <span className="flex-1 text-right">
          <span className="block text-sm font-extrabold text-foreground">اختبار تقييمي</span>
          <span className="block text-xs text-muted-foreground">
            {questions.length} أسئلة · اجتز {Math.round(PASS_SCORE * 100)}% لتحصل على شهادة PDF
          </span>
        </span>
      </button>
    );
  }

  // Results view
  if (idx >= questions.length) {
    const correctCount = answers.filter((a, i) => a === questions[i].correct).length;
    const pct = Math.round((correctCount / questions.length) * 100);
    const passed = pct >= PASS_SCORE * 100;

    return (
      <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
        <div className="text-center space-y-2">
          <div
            className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center ${
              passed ? "bg-secondary/20 text-secondary" : "bg-muted text-muted-foreground"
            }`}
          >
            <Award className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-extrabold">
            {passed ? "🎉 مبروك! نجحت" : "حاول مرة أخرى"}
          </h3>
          <p className="text-3xl font-extrabold text-primary">{pct}%</p>
          <p className="text-xs text-muted-foreground">
            {correctCount} من {questions.length} إجابات صحيحة
          </p>
        </div>

        {passed && (
          <div className="space-y-2 pt-2 border-t border-border">
            <label className="text-xs font-bold text-muted-foreground">
              اسمك كما تريد أن يظهر على الشهادة
            </label>
            <input
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Your Name (English preferred for PDF)"
              className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border outline-none focus:border-primary text-sm"
            />
            <button
              onClick={() =>
                generateCertificatePdf({
                  studentName: studentName.trim() || "Nursing Student",
                  specialtyAr,
                  specialtyEn,
                  scorePercent: pct,
                })
              }
              className="w-full py-3 rounded-2xl gradient-primary text-white font-extrabold shadow-glow flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              تحميل الشهادة PDF
            </button>
          </div>
        )}

        <button
          onClick={reset}
          className="w-full py-2.5 rounded-2xl bg-muted text-foreground font-bold flex items-center justify-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          إعادة الاختبار
        </button>
      </div>
    );
  }

  const q = questions[idx];
  const isCorrect = picked !== null && picked === q.correct;

  const submit = () => {
    if (picked === null) return;
    setAnswers((a) => [...a, picked]);
    if (q.explain) {
      setShowExplain(true);
    } else {
      next();
    }
  };

  const next = () => {
    setShowExplain(false);
    setPicked(null);
    setIdx((i) => i + 1);
  };

  return (
    <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-bold">سؤال {idx + 1} / {questions.length}</span>
        <button onClick={reset} className="text-muted-foreground hover:text-foreground">
          إلغاء
        </button>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${(idx / questions.length) * 100}%` }}
        />
      </div>

      <h4 className="text-sm font-extrabold leading-relaxed">{q.q}</h4>

      <div className="space-y-2">
        {q.options.map((opt, i) => {
          const selected = picked === i;
          const reveal = showExplain;
          const isRight = i === q.correct;
          return (
            <button
              key={i}
              disabled={showExplain}
              onClick={() => setPicked(i)}
              className={`w-full p-3 rounded-xl border text-right text-sm transition-smooth flex items-center gap-2 ${
                reveal
                  ? isRight
                    ? "bg-secondary/15 border-secondary text-foreground"
                    : selected
                    ? "bg-destructive/10 border-destructive text-foreground"
                    : "bg-muted border-border text-muted-foreground"
                  : selected
                  ? "bg-primary/10 border-primary"
                  : "bg-muted border-border hover:border-primary/40"
              }`}
            >
              {reveal && isRight && <CheckCircle2 className="h-4 w-4 text-secondary flex-shrink-0" />}
              {reveal && selected && !isRight && (
                <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />
              )}
              <span className="flex-1">{opt}</span>
            </button>
          );
        })}
      </div>

      {showExplain && q.explain && (
        <p
          className={`text-xs p-2.5 rounded-xl leading-relaxed ${
            isCorrect ? "bg-secondary/10 text-foreground" : "bg-muted text-foreground"
          }`}
        >
          💡 {q.explain}
        </p>
      )}

      <button
        onClick={showExplain ? next : submit}
        disabled={picked === null}
        className="w-full py-2.5 rounded-2xl gradient-primary text-white font-extrabold shadow-soft disabled:opacity-50"
      >
        {showExplain ? (idx + 1 < questions.length ? "السؤال التالي" : "عرض النتيجة") : "إرسال الإجابة"}
      </button>
    </div>
  );
};
