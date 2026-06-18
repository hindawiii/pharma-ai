import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from "react";
import { Sparkles, X, Send, Loader2, ImagePlus, Stethoscope } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Props {
  onClose: () => void;
}

type Part =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

type Msg = { role: "user" | "assistant"; content: string | Part[] };

const ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/nurse-ai`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const SUGGESTIONS = [
  "كيف أعتني بقرحة الفراش Stage II؟",
  "خطوات قياس ضغط الدم الصحيحة",
  "ماذا أفعل عند هبوط السكر؟",
];

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = () => rej(r.error);
    r.readAsDataURL(file);
  });

const renderText = (m: Msg): string => {
  if (typeof m.content === "string") return m.content;
  return m.content
    .map((p) => (p.type === "text" ? p.text : "📷 صورة"))
    .join(" ");
};

export const NurseAiPanel = ({ onClose }: Props) => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if ((!trimmed && !pendingImage) || loading) return;

    const userContent: Part[] = [];
    if (trimmed) userContent.push({ type: "text", text: trimmed });
    if (pendingImage) userContent.push({ type: "image_url", image_url: { url: pendingImage } });

    const userMsg: Msg =
      userContent.length === 1 && userContent[0].type === "text"
        ? { role: "user", content: trimmed }
        : { role: "user", content: userContent };

    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setPendingImage(null);
    setLoading(true);

    let accum = "";
    const upsert = (chunk: string) => {
      accum += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: accum } : m));
        }
        return [...prev, { role: "assistant", content: accum }];
      });
    };

    try {
      const resp = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ANON_KEY}`,
        },
        body: JSON.stringify({ messages: next }),
      });

      if (!resp.ok || !resp.body) {
        let msg = "تعذر الاتصال بالمساعد";
        try {
          const j = await resp.json();
          if (j?.error) msg = j.error;
        } catch { /* ignore */ }
        upsert(`⚠️ ${msg}`);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let done = false;
      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const j = line.slice(6).trim();
          if (j === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(j);
            const c = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (c) upsert(c);
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }
    } catch (e) {
      upsert(`⚠️ ${e instanceof Error ? e.message : "خطأ غير متوقع"}`);
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const onPickImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("الصورة كبيرة جداً (أقل من 5MB)");
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    setPendingImage(dataUrl);
    e.target.value = "";
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm animate-fade-up"
        onClick={onClose}
        aria-hidden
      />
      <div className="fixed inset-x-3 top-16 bottom-20 z-[60] mx-auto max-w-md rounded-3xl bg-card border border-border shadow-elegant overflow-hidden animate-fade-up flex flex-col">
        <div className="gradient-primary p-3 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <Stethoscope className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="font-extrabold text-sm">ممرض Pharma-i الذكي</p>
              <p className="text-[10px] opacity-80 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                نص + صور جروح/حروق
              </p>
            </div>
          </div>
          <button onClick={onClose} aria-label="إغلاق" className="p-1 hover:bg-white/10 rounded-lg">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div ref={scrollRef} className="p-3 space-y-2 overflow-y-auto flex-1 min-h-0">
          {messages.length === 0 && (
            <>
              <div className="bg-muted rounded-2xl rounded-tr-sm p-3 text-xs leading-relaxed">
                مرحباً 👋 أنا مساعدك التمريضي. اسألني عن العناية بالجروح، الأدوية، العلامات الحيوية —
                أو أرسل لي صورة جرح/حرق لأقيّمها.
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="text-[11px] px-3 py-1.5 rounded-full bg-primary/10 text-primary font-semibold"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </>
          )}

          {messages.map((m, i) => {
            const isUser = m.role === "user";
            const text = renderText(m);
            const imageUrl =
              !isUser
                ? null
                : Array.isArray(m.content)
                ? (m.content.find((p) => p.type === "image_url") as
                    | { type: "image_url"; image_url: { url: string } }
                    | undefined
                  )?.image_url.url ?? null
                : null;

            return (
              <div
                key={i}
                className={`rounded-2xl p-3 max-w-[88%] text-xs leading-relaxed ${
                  isUser
                    ? "bg-primary text-primary-foreground rounded-tl-sm mr-auto"
                    : "bg-muted text-foreground rounded-tr-sm"
                }`}
              >
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="مرفق"
                    className="mb-2 rounded-xl max-h-40 object-cover"
                  />
                )}
                {m.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2">
                    <ReactMarkdown>{text || "..."}</ReactMarkdown>
                  </div>
                ) : (
                  text && <span>{text}</span>
                )}
              </div>
            );
          })}

          {loading && messages[messages.length - 1]?.role === "user" && (
            <div className="bg-muted rounded-2xl rounded-tr-sm p-3 max-w-[85%] text-xs flex items-center gap-2">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>جاري التحليل...</span>
            </div>
          )}
        </div>

        {pendingImage && (
          <div className="px-3 pb-2 flex items-center gap-2 border-t border-border pt-2">
            <img src={pendingImage} alt="معاينة" className="h-12 w-12 rounded-lg object-cover" />
            <span className="text-[11px] text-muted-foreground flex-1">
              صورة جاهزة للإرسال مع رسالتك
            </span>
            <button
              onClick={() => setPendingImage(null)}
              className="h-7 w-7 rounded-full bg-muted flex items-center justify-center"
              aria-label="إزالة الصورة"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <form
          className="p-3 border-t border-border flex items-center gap-2 flex-shrink-0"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            hidden
            onChange={onPickImage}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={loading}
            className="h-8 w-8 rounded-full bg-muted text-foreground flex items-center justify-center"
            aria-label="إضافة صورة"
          >
            <ImagePlus className="h-4 w-4" />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder="اكتب سؤالك أو أرفق صورة..."
            disabled={loading}
            className="flex-1 bg-muted rounded-full px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={loading || (!input.trim() && !pendingImage)}
            className="h-8 w-8 rounded-full gradient-primary text-white flex items-center justify-center shadow-soft disabled:opacity-50"
            aria-label="إرسال"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
          </button>
        </form>
      </div>
    </>
  );
};
