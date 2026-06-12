import { Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AiChatPanel } from "./AiChatPanel";

const STORAGE_KEY = "pharma-ai-fab-pos";
const SIZE = 36; // h-9 w-9
const MARGIN = 12;

interface Pos {
  x: number; // px from left
  y: number; // px from top
}

const getDefaultPos = (): Pos => {
  const w = typeof window !== "undefined" ? window.innerWidth : 360;
  const h = typeof window !== "undefined" ? window.innerHeight : 640;
  return { x: MARGIN, y: h - SIZE - 88 };
};

const loadPos = (): Pos => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return getDefaultPos();
};

export const AiFab = () => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<Pos>(() => (typeof window !== "undefined" ? loadPos() : { x: 12, y: 600 }));
  const [dragging, setDragging] = useState(false);
  const dragState = useRef<{ startX: number; startY: number; origX: number; origY: number; moved: boolean } | null>(null);

  // Clamp on resize
  useEffect(() => {
    const onResize = () => {
      setPos((p) => ({
        x: Math.min(Math.max(MARGIN, p.x), window.innerWidth - SIZE - MARGIN),
        y: Math.min(Math.max(MARGIN, p.y), window.innerHeight - SIZE - MARGIN),
      }));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: pos.x,
      origY: pos.y,
      moved: false,
    };
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragState.current) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) dragState.current.moved = true;
    const w = window.innerWidth;
    const h = window.innerHeight;
    setPos({
      x: Math.min(Math.max(MARGIN, dragState.current.origX + dx), w - SIZE - MARGIN),
      y: Math.min(Math.max(MARGIN, dragState.current.origY + dy), h - SIZE - MARGIN),
    });
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const moved = dragState.current?.moved ?? false;
    dragState.current = null;
    setDragging(false);

    if (!moved) {
      setOpen((v) => !v);
      return;
    }

    // Snap to nearest horizontal edge
    const w = window.innerWidth;
    setPos((p) => {
      const snappedX = p.x + SIZE / 2 < w / 2 ? MARGIN : w - SIZE - MARGIN;
      const next = { x: snappedX, y: p.y };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
    e.preventDefault();
  };

  return (
    <>
      {open && <AiChatPanel onClose={() => setOpen(false)} variant="fab" />}

      <button
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          dragState.current = null;
          setDragging(false);
        }}
        className="fixed z-50 group touch-none select-none"
        aria-label="مساعد الذكاء الاصطناعي - يمكن السحب"
        style={{
          left: pos.x,
          top: pos.y,
          transition: dragging ? "none" : "left 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          cursor: dragging ? "grabbing" : "grab",
        }}
      >
        <span className="absolute inset-0 rounded-full gradient-ai animate-pulse-ring" />
        <span
          className="relative flex items-center justify-center h-9 w-9 rounded-full gradient-ai text-white shadow-card transition-bounce"
          style={{ transform: dragging ? "scale(1.15)" : "scale(1)" }}
        >
          <Sparkles className="h-4 w-4" />
        </span>
      </button>
    </>
  );
};
