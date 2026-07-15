export const Heimlich = () => (
  <svg viewBox="0 0 320 180" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="مناورة هايمليك">
    <text x="80" y="16" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0F172A">البالغ</text>
    <text x="240" y="16" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0F172A">الرضيع</text>

    {/* ADULT */}
    <g transform="translate(20,25)">
      {/* victim body */}
      <circle cx="60" cy="20" r="12" fill="#FDE68A" stroke="#92400E" strokeWidth="2"/>
      <path d="M45 32 L75 32 L80 110 L40 110 Z" fill="#BFDBFE" stroke="#1E3A8A" strokeWidth="2"/>
      {/* navel */}
      <circle cx="60" cy="75" r="2" fill="#1E3A8A"/>
      {/* rescuer arms wrapping */}
      <path d="M20 70 Q60 60 100 70" fill="none" stroke="#9D174D" strokeWidth="5" strokeLinecap="round"/>
      {/* fist */}
      <circle cx="60" cy="68" r="8" fill="#F87171" stroke="#991B1B" strokeWidth="2"/>
      {/* arrow up+in */}
      <path d="M60 100 L60 78 M55 84 L60 76 L65 84" stroke="#C62828" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <text x="60" y="128" textAnchor="middle" fontSize="9" fill="#475569">فوق السرّة · للداخل وللأعلى</text>
    </g>

    {/* divider */}
    <line x1="160" y1="30" x2="160" y2="160" stroke="#E2E8F0" strokeWidth="1"/>

    {/* INFANT — back blows / chest thrusts */}
    <g transform="translate(180,30)">
      {/* forearm */}
      <path d="M0 90 L130 65" stroke="#FDE68A" strokeWidth="18" strokeLinecap="round"/>
      <path d="M0 90 L130 65" stroke="#92400E" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* baby head down */}
      <circle cx="115" cy="55" r="10" fill="#FDE68A" stroke="#92400E" strokeWidth="1.5"/>
      {/* baby body */}
      <path d="M25 82 L100 62 L108 72 L35 92 Z" fill="#FBCFE8" stroke="#9D174D" strokeWidth="1.5"/>
      {/* rescuer hand slapping between shoulder blades */}
      <ellipse cx="55" cy="70" rx="10" ry="6" fill="#F87171" stroke="#991B1B" strokeWidth="1.5"/>
      <path d="M55 50 L55 62 M50 58 L55 66 L60 58" stroke="#C62828" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <text x="65" y="118" textAnchor="middle" fontSize="9" fill="#475569">٥ ضربات ظهرية · الرأس أسفل</text>
    </g>
  </svg>
);
