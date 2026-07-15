export const RecoveryPosition = () => (
  <svg viewBox="0 0 320 140" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="وضعية الإفاقة">
    <rect x="0" y="115" width="320" height="25" fill="#F1F5F9" />
    {/* body torso */}
    <path d="M60 100 Q90 70 150 78 Q220 85 260 95 L260 115 L60 115 Z" fill="#FBCFE8" stroke="#9D174D" strokeWidth="2"/>
    {/* head */}
    <circle cx="65" cy="90" r="18" fill="#FDE68A" stroke="#92400E" strokeWidth="2"/>
    {/* hair */}
    <path d="M50 85 Q60 72 82 78" fill="none" stroke="#78350F" strokeWidth="3" strokeLinecap="round"/>
    {/* upper arm bent under head */}
    <path d="M85 95 Q75 110 70 108" fill="none" stroke="#9D174D" strokeWidth="6" strokeLinecap="round"/>
    {/* top arm forward */}
    <path d="M150 82 Q170 60 200 65" fill="none" stroke="#9D174D" strokeWidth="6" strokeLinecap="round"/>
    {/* top leg bent */}
    <path d="M235 100 Q260 70 285 85" fill="none" stroke="#1E3A8A" strokeWidth="8" strokeLinecap="round"/>
    {/* bottom leg straight */}
    <path d="M235 108 L305 108" stroke="#1E3A8A" strokeWidth="8" strokeLinecap="round"/>
    <text x="160" y="20" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0F172A">وضعية الإفاقة الجانبية</text>
    <text x="160" y="36" textAnchor="middle" fontSize="10" fill="#475569">للمصاب فاقد الوعي مع تنفّس طبيعي</text>
  </svg>
);
