export const CprHands = () => (
  <svg viewBox="0 0 320 160" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="موضع اليد للتدليك">
    {/* chest outline */}
    <ellipse cx="160" cy="105" rx="110" ry="45" fill="#FEE2E2" stroke="#991B1B" strokeWidth="2"/>
    {/* sternum midline */}
    <line x1="160" y1="65" x2="160" y2="145" stroke="#991B1B" strokeWidth="1.5" strokeDasharray="4 3"/>
    {/* nipple line */}
    <line x1="80" y1="90" x2="240" y2="90" stroke="#F87171" strokeWidth="1" strokeDasharray="2 3"/>
    <circle cx="115" cy="90" r="3" fill="#991B1B"/>
    <circle cx="205" cy="90" r="3" fill="#991B1B"/>
    {/* Hand placement */}
    <ellipse cx="160" cy="110" rx="22" ry="14" fill="#FDE68A" stroke="#92400E" strokeWidth="2"/>
    <ellipse cx="160" cy="110" rx="16" ry="10" fill="#FCD34D" stroke="#92400E" strokeWidth="1.5"/>
    <line x1="148" y1="105" x2="172" y2="105" stroke="#92400E" strokeWidth="1"/>
    <line x1="148" y1="115" x2="172" y2="115" stroke="#92400E" strokeWidth="1"/>
    {/* Arrow down */}
    <path d="M160 30 L160 65 M155 60 L160 68 L165 60" stroke="#C62828" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <text x="160" y="22" textAnchor="middle" fontSize="11" fontWeight="700" fill="#C62828">اضغط 5-6 سم</text>
    <text x="160" y="158" textAnchor="middle" fontSize="10" fill="#475569">النصف السفلي من عظمة القص · 100-120/د</text>
  </svg>
);
