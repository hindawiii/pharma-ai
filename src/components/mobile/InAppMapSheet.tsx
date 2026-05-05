import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation, X, MapPin } from "lucide-react";

export interface MapTarget {
  name: string;
  lat: number;
  lng: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  user?: { lat: number; lng: number } | null;
  target: MapTarget | null;
}

export const InAppMapSheet = ({ open, onClose, user, target }: Props) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open || !target || !containerRef.current) return;
    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current, { zoomControl: true, attributionControl: false }).setView(
        [target.lat, target.lng],
        14
      );
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(mapRef.current);
    }
    const map = mapRef.current;
    // clear previous overlays
    map.eachLayer((layer) => {
      if ((layer as any)._url) return; // keep tile layer
      map.removeLayer(layer);
    });

    const targetIcon = L.divIcon({
      className: "",
      html: `<div style="background:#C62828;color:#fff;border:3px solid #fff;border-radius:9999px;width:34px;height:34px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,.3);font-size:18px">📍</div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });
    L.marker([target.lat, target.lng], { icon: targetIcon })
      .addTo(map)
      .bindPopup(`<b>${target.name}</b>`);

    if (user) {
      const userIcon = L.divIcon({
        className: "",
        html: `<div style="background:#1A8FE3;color:#fff;border:3px solid #fff;border-radius:9999px;width:24px;height:24px;box-shadow:0 4px 12px rgba(0,0,0,.3)"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      L.marker([user.lat, user.lng], { icon: userIcon }).addTo(map).bindPopup("موقعك");
      const line = L.polyline(
        [
          [user.lat, user.lng],
          [target.lat, target.lng],
        ],
        { color: "#C62828", weight: 4, opacity: 0.85, dashArray: "8 6" }
      ).addTo(map);
      map.fitBounds(line.getBounds(), { padding: [40, 40] });
    } else {
      map.setView([target.lat, target.lng], 14);
    }

    // Allow proper sizing after render
    setTimeout(() => map.invalidateSize(), 100);
  }, [open, target, user]);

  useEffect(() => {
    if (!open && mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
  }, [open]);

  const distanceKm = useMemo(() => {
    if (!user || !target) return null;
    const R = 6371;
    const dLat = ((target.lat - user.lat) * Math.PI) / 180;
    const dLng = ((target.lng - user.lng) * Math.PI) / 180;
    const s =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((user.lat * Math.PI) / 180) *
        Math.cos((target.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  }, [user, target]);

  if (!open || !target) return null;

  const osrmUrl = user
    ? `https://www.openstreetmap.org/directions?from=${user.lat},${user.lng}&to=${target.lat},${target.lng}`
    : `https://www.openstreetmap.org/?mlat=${target.lat}&mlon=${target.lng}#map=16/${target.lat}/${target.lng}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 backdrop-blur-sm" dir="rtl">
      <div className="w-full max-w-md bg-card rounded-t-3xl shadow-elegant overflow-hidden animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between p-3 border-b border-border">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-9 w-9 rounded-xl bg-[#C62828]/10 text-[#C62828] flex items-center justify-center">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm truncate">{target.name}</p>
              {distanceKm != null && (
                <p className="text-[11px] text-muted-foreground">
                  المسافة التقريبية: {distanceKm < 1 ? `${Math.round(distanceKm * 1000)}م` : `${distanceKm.toFixed(1)} كم`}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center"
            aria-label="إغلاق"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div ref={containerRef} className="w-full h-[55vh]" />
        <div className="p-3">
          <a
            href={osrmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 h-12 rounded-2xl bg-[#C62828] text-white font-bold text-sm shadow-soft active:scale-95 transition-bounce"
          >
            <Navigation className="h-4 w-4" />
            افتح الملاحة الخارجية
          </a>
        </div>
      </div>
    </div>
  );
};
