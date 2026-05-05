// Country-specific emergency numbers (ambulance, police, fire)
export interface EmergencyNumbers {
  ambulance: string;
  police: string;
  fire: string;
}

export interface CountryInfo {
  code: string; // ISO-2
  nameAr: string;
  flag: string;
  numbers: EmergencyNumbers;
}

export const COUNTRIES: CountryInfo[] = [
  { code: "SD", nameAr: "السودان", flag: "🇸🇩", numbers: { ambulance: "333", police: "999", fire: "998" } },
  { code: "EG", nameAr: "مصر", flag: "🇪🇬", numbers: { ambulance: "123", police: "122", fire: "180" } },
  { code: "SA", nameAr: "السعودية", flag: "🇸🇦", numbers: { ambulance: "997", police: "999", fire: "998" } },
  { code: "AE", nameAr: "الإمارات", flag: "🇦🇪", numbers: { ambulance: "998", police: "999", fire: "997" } },
  { code: "JO", nameAr: "الأردن", flag: "🇯🇴", numbers: { ambulance: "911", police: "911", fire: "911" } },
  { code: "QA", nameAr: "قطر", flag: "🇶🇦", numbers: { ambulance: "999", police: "999", fire: "999" } },
  { code: "KW", nameAr: "الكويت", flag: "🇰🇼", numbers: { ambulance: "112", police: "112", fire: "112" } },
  { code: "BH", nameAr: "البحرين", flag: "🇧🇭", numbers: { ambulance: "999", police: "999", fire: "999" } },
  { code: "OM", nameAr: "عُمان", flag: "🇴🇲", numbers: { ambulance: "9999", police: "9999", fire: "9999" } },
  { code: "IQ", nameAr: "العراق", flag: "🇮🇶", numbers: { ambulance: "122", police: "104", fire: "115" } },
  { code: "SY", nameAr: "سوريا", flag: "🇸🇾", numbers: { ambulance: "110", police: "112", fire: "113" } },
  { code: "LB", nameAr: "لبنان", flag: "🇱🇧", numbers: { ambulance: "140", police: "112", fire: "175" } },
  { code: "PS", nameAr: "فلسطين", flag: "🇵🇸", numbers: { ambulance: "101", police: "100", fire: "102" } },
  { code: "YE", nameAr: "اليمن", flag: "🇾🇪", numbers: { ambulance: "191", police: "194", fire: "199" } },
  { code: "LY", nameAr: "ليبيا", flag: "🇱🇾", numbers: { ambulance: "1515", police: "1515", fire: "180" } },
  { code: "TN", nameAr: "تونس", flag: "🇹🇳", numbers: { ambulance: "190", police: "197", fire: "198" } },
  { code: "DZ", nameAr: "الجزائر", flag: "🇩🇿", numbers: { ambulance: "14", police: "17", fire: "14" } },
  { code: "MA", nameAr: "المغرب", flag: "🇲🇦", numbers: { ambulance: "150", police: "19", fire: "15" } },
];

export const DEFAULT_COUNTRY: CountryInfo = COUNTRIES[0];

export const getCountryByCode = (code?: string): CountryInfo => {
  if (!code) return DEFAULT_COUNTRY;
  return COUNTRIES.find((c) => c.code === code.toUpperCase()) ?? DEFAULT_COUNTRY;
};
