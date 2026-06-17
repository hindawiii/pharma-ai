interface AiNeuralIconProps {
  className?: string;
  size?: number;
}

export const AiNeuralIcon = ({ className = "", size = 64 }: AiNeuralIconProps) => {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hexagon center */}
      <polygon
        points="50,28 68,38 68,58 50,68 32,58 32,38"
        fill="white"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* AI text */}
      <text
        x="50"
        y="54"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="16"
        fontWeight="bold"
        fill="currentColor"
        fontFamily="system-ui, sans-serif"
      >
        AI
      </text>

      {/* ===== Top branch ===== */}
      <line x1="50" y1="28" x2="50" y2="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="50" cy="8" r="4.5" fill="white" stroke="currentColor" strokeWidth="2.5" />

      {/* ===== Top-Left branch (T-junction) ===== */}
      <line x1="32" y1="38" x2="20" y2="26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="20" cy="26" r="4.5" fill="white" stroke="currentColor" strokeWidth="2.5" />
      {/* T: up */}
      <line x1="20" y1="26" x2="20" y2="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="20" cy="8" r="4.5" fill="white" stroke="currentColor" strokeWidth="2.5" />
      {/* T: left */}
      <line x1="20" y1="26" x2="10" y2="26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="5" cy="26" r="4.5" fill="white" stroke="currentColor" strokeWidth="2.5" />

      {/* ===== Top-Right branch (T-junction) ===== */}
      <line x1="68" y1="38" x2="80" y2="26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="80" cy="26" r="4.5" fill="white" stroke="currentColor" strokeWidth="2.5" />
      {/* T: up */}
      <line x1="80" y1="26" x2="80" y2="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="80" cy="8" r="4.5" fill="white" stroke="currentColor" strokeWidth="2.5" />
      {/* T: right */}
      <line x1="80" y1="26" x2="90" y2="26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="95" cy="26" r="4.5" fill="white" stroke="currentColor" strokeWidth="2.5" />

      {/* ===== Middle-Left branch ===== */}
      <line x1="32" y1="48" x2="16" y2="48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="10" cy="48" r="4.5" fill="white" stroke="currentColor" strokeWidth="2.5" />

      {/* ===== Middle-Right branch ===== */}
      <line x1="68" y1="48" x2="84" y2="48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="90" cy="48" r="4.5" fill="white" stroke="currentColor" strokeWidth="2.5" />

      {/* ===== Bottom-Left branch (T-junction) ===== */}
      <line x1="32" y1="58" x2="20" y2="70" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="20" cy="70" r="4.5" fill="white" stroke="currentColor" strokeWidth="2.5" />
      {/* T: down */}
      <line x1="20" y1="70" x2="20" y2="82" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="20" cy="88" r="4.5" fill="white" stroke="currentColor" strokeWidth="2.5" />
      {/* T: left */}
      <line x1="20" y1="70" x2="10" y2="70" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="5" cy="70" r="4.5" fill="white" stroke="currentColor" strokeWidth="2.5" />

      {/* ===== Bottom-Right branch (T-junction) ===== */}
      <line x1="68" y1="58" x2="80" y2="70" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="80" cy="70" r="4.5" fill="white" stroke="currentColor" strokeWidth="2.5" />
      {/* T: down */}
      <line x1="80" y1="70" x2="80" y2="82" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="80" cy="88" r="4.5" fill="white" stroke="currentColor" strokeWidth="2.5" />
      {/* T: right */}
      <line x1="80" y1="70" x2="90" y2="70" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="95" cy="70" r="4.5" fill="white" stroke="currentColor" strokeWidth="2.5" />

      {/* ===== Bottom branch ===== */}
      <line x1="50" y1="68" x2="50" y2="82" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="50" cy="88" r="4.5" fill="white" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
};
