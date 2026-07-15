export const Tourniquet = () => (
  <svg viewBox="0 0 320 150" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="الرباط الضاغط">
    {/* arm */}
    <rect x="30" y="60" width="260" height="30" rx="15" fill="#FDE68A" stroke="#92400E" strokeWidth="2"/>
    {/* wound */}
    <circle cx="220" cy="75" r="10" fill="#DC2626" stroke="#7F1D1D" strokeWidth="1.5"/>
    <path d="M215 68 L225 82 M225 68 L215 82" stroke="#7F1D1D" strokeWidth="1.5"/>
    {/* tourniquet strap */}
    <rect x="150" y="52" width="20" height="46" fill="#1F2937" stroke="#000" strokeWidth="1.5"/>
    {/* windlass rod */}
    <rect x="140" y="40" width="40" height="8" rx="2" fill="#78350F" stroke="#3F1B00" strokeWidth="1.5"/>
    {/* label on strap */}
    <text x="160" y="82" textAnchor="middle" fontSize="9" fontWeight="700" fill="#F9FAFB">T</text>

    {/* distance indicator */}
    <line x1="170" y1="105" x2="220" y2="105" stroke="#0F172A" strokeWidth="1"/>
    <line x1="170" y1="102" x2="170" y2="108" stroke="#0F172A" strokeWidth="1"/>
    <line x1="220" y1="102" x2="220" y2="108" stroke="#0F172A" strokeWidth="1"/>
    <text x="195" y="120" textAnchor="middle" fontSize="10" fill="#0F172A">5-7 سم فوق الجرح</text>

    <text x="160" y="20" textAnchor="middle" fontSize="12" fontWeight="700" fill="#C62828">الرباط الضاغط (Tourniquet)</text>
    <text x="160" y="36" textAnchor="middle" fontSize="10" fill="#475569">للأطراف فقط · سجّل وقت التطبيق</text>

    {/* time tag */}
    <rect x="20" y="105" width="90" height="30" rx="4" fill="#FEF3C7" stroke="#92400E" strokeWidth="1.5"/>
    <text x="65" y="118" textAnchor="middle" fontSize="9" fontWeight="700" fill="#7C2D12">T + الساعة</text>
    <text x="65" y="130" textAnchor="middle" fontSize="8" fill="#7C2D12">اكتبها على الرباط</text>
  </svg>
);
