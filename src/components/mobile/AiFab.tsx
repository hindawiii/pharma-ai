import { useEffect, useRef, useState } from "react";
import { AiChatPanel } from "./AiChatPanel";
import logo from "@/assets/pharma-i-logo.png";

const STORAGE_KEY = "pharma-ai-fab-pos";
const SIZE = 56; // hexagon container
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
        <span
          aria-hidden
          className="absolute inset-0 gradient-ai animate-pulse-ring"
          style={{ clipPath: "polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)" }}
        />
        <span
          className="relative flex items-center justify-center text-white shadow-elegant transition-bounce"
          style={{
            width: SIZE,
            height: SIZE,
            transform: dragging ? "scale(1.15)" : "scale(1)",
            background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
            clipPath: "polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)",
            filter: "drop-shadow(0 6px 14px hsl(var(--primary) / 0.45))",
          }}
        >
          <span
            className="flex items-center justify-center bg-white"
            style={{
              width: SIZE - 8,
              height: SIZE - 8,
              clipPath: "polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)",
            }}
          >
            <img src={logo} alt="Pharma-i" className="h-7 w-7 object-contain" />
          </span>
        </span>
      </button>
    </>
  );
};
