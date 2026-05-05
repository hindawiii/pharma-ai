import { useEffect, useState, useCallback } from "react";

export interface UserLocation {
  lat: number;
  lng: number;
  countryCode?: string; // ISO-2
  countryNameAr?: string;
  city?: string;
}

const STORAGE_KEY = "pharma-i.user-location";

const reverseGeocode = async (lat: number, lng: number): Promise<Partial<UserLocation>> => {
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`,
      { headers: { "Accept": "application/json" } }
    );
    const j = await r.json();
    const a = j.address || {};
    return {
      countryCode: (a.country_code || "").toUpperCase(),
      countryNameAr: a.country,
      city: a.city || a.town || a.village || a.state,
    };
  } catch {
    return {};
  }
};

export const useUserLocation = () => {
  const [location, setLocation] = useState<UserLocation | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as UserLocation) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const persist = (loc: UserLocation) => {
    setLocation(loc);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
    } catch {}
  };

  const detect = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setError("الموقع غير مدعوم");
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const base: UserLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        const meta = await reverseGeocode(base.lat, base.lng);
        persist({ ...base, ...meta });
        setLoading(false);
      },
      (e) => {
        setError(e.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const setCountry = useCallback((countryCode: string, countryNameAr: string) => {
    persist({
      lat: location?.lat ?? 0,
      lng: location?.lng ?? 0,
      countryCode,
      countryNameAr,
      city: location?.city,
    });
  }, [location]);

  // Auto-detect once on first mount if nothing stored
  useEffect(() => {
    if (!location) detect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { location, loading, error, detect, setCountry };
};
