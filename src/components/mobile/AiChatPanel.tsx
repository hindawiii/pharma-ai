import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Sparkles, X, Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Props {
  onClose: () => void;
  variant?: "fab" | "centered";
}

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const SUGGESTIONS = ["ما بدائل البنادول؟", "موعد جرعتي القادمة", "أقرب صيدلية"];

export const AiChatPanel = ({ onClose, variant = "fab" }: Props) => {
  const positionClass =
    variant === "centered"
      ? "fixed inset-x-3 top-20 bottom-24 z-[60] mx-auto max-w-md"
      : "fixed bottom-24 left-3 z-50 w-[calc(100%-1.5rem)] max-w-sm";

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const userMsg: Msg = { role: "user", content: trimmed };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    let accum = "";
    const upsertAssistant = (chunk: string) => {
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
      const resp = await fetch(CHAT_URL, {
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
        upsertAssistant(`⚠️ ${msg}`);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });
        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e) {
      upsertAssistant(`⚠️ ${e instanceof Error ? e.message : "خطأ غير متوقع"}`);
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

  return (
    <>
      {variant === "centered" && (
        <div
          className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm animate-fade-up"
          onClick={onClose}
          aria-hidden
        />
      )}
      <div
        className={`${positionClass} rounded-3xl bg-card border border-border shadow-elegant overflow-hidden animate-fade-up flex flex-col`}
      >
        <div className="gradient-ai p-3 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold text-xs">مساعد Pharma-i</p>
              <p className="text-[10px] opacity-80 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary-glow animate-pulse" />
                متاح الآن
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
              <div className="bg-muted rounded-2xl rounded-tr-sm p-3 max-w-[85%] text-xs leading-relaxed">
                مرحباً! أنا مساعد Pharma-i الطبي. اسألني عن أي دواء، جرعة، أو بديل علاجي.
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="text-[11px] px-3 py-1.5 rounded-full bg-primary/10 text-primary font-semibold hover:bg-primary hover:text-primary-foreground transition-smooth"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`rounded-2xl p-3 max-w-[85%] text-xs leading-relaxed ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tl-sm mr-auto"
                  : "bg-muted text-foreground rounded-tr-sm"
              }`}
            >
              {m.role === "assistant" ? (
                <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2">
                  <ReactMarkdown>{m.content || "..."}</ReactMarkdown>
                </div>
              ) : (
                m.content
              )}
            </div>
          ))}
          {loading && messages[messages.length - 1]?.role === "user" && (
            <div className="bg-muted rounded-2xl rounded-tr-sm p-3 max-w-[85%] text-xs flex items-center gap-2">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>جاري الرد...</span>
            </div>
          )}
        </div>

        <form
          className="p-3 border-t border-border flex items-center gap-2 flex-shrink-0"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder="اكتب سؤالك..."
            disabled={loading}
            className="flex-1 bg-muted rounded-full px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
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
