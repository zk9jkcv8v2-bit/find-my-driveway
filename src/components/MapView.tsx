import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MOCK_SPOTS, type SpotMarker } from "./spots-data";

export type { HostProfile, SpotMarker } from "./spots-data";
export { MOCK_SPOTS } from "./spots-data";

const OREBRO_CENTER: [number, number] = [59.2753, 15.2134];

function createPriceIcon(price: number, isSelected: boolean, hasEV: boolean) {
  const bg = isSelected
    ? "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary)))"
    : hasEV
      ? "linear-gradient(135deg, hsl(var(--accent)), hsl(var(--accent)))"
      : "linear-gradient(135deg, hsl(var(--card)), hsl(var(--secondary)))";
  const flatBg = isSelected
    ? "hsl(var(--primary))"
    : hasEV
      ? "hsl(var(--accent))"
      : "hsl(var(--secondary))";
  const color = isSelected || hasEV ? "#ffffff" : "hsl(var(--foreground))";
  const shadow = isSelected
    ? "0 6px 20px hsl(var(--primary) / 0.45), 0 2px 6px hsl(var(--primary) / 0.2)"
    : hasEV
      ? "0 4px 14px hsl(var(--accent) / 0.3), 0 2px 4px hsl(var(--accent) / 0.1)"
      : "0 3px 12px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.06)";
  const border = isSelected || hasEV ? "none" : "1.5px solid hsl(var(--border))";
  const scale = isSelected ? "transform: scale(1.15);" : "";
  const fontSize = isSelected ? "14px" : "12.5px";

  const html = `
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${bg};
      color: ${color};
      border: ${border};
      box-shadow: ${shadow};
      padding: 6px 12px;
      border-radius: 22px;
      font-weight: 800;
      font-size: ${fontSize};
      font-family: 'Neue Haas Grotesk Display Pro', 'Inter', system-ui, sans-serif;
      white-space: nowrap;
      ${scale}
      position: relative;
      cursor: pointer;
      line-height: 1;
      letter-spacing: -0.02em;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    ">
      ${hasEV ? '<span style="display:inline-flex;align-items:center;margin-right:3px;"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none" style="display:block;filter:drop-shadow(0 0 2px rgba(255,255,255,0.5))"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg></span>' : ''}<span style="display:inline-flex;align-items:center;">$${price.toFixed(2)}</span>
      <div style="
        position: absolute;
        bottom: -5px;
        left: 50%;
        transform: translateX(-50%) rotate(45deg);
        width: 9px;
        height: 9px;
        background: ${flatBg};
        ${!isSelected && !hasEV ? `border-right: ${border}; border-bottom: ${border};` : ""}
      "></div>
    </div>
  `;

  return L.divIcon({
    className: "",
    html,
    iconSize: [70, 40],
    iconAnchor: [35, 40],
  });
}

function createUserIcon() {
  return L.divIcon({
    className: "",
    html: `
      <div style="position: relative; width: 18px; height: 18px;">
        <div style="
          width: 18px; height: 18px;
          border-radius: 50%;
          background: hsl(var(--primary));
          border: 3px solid hsl(var(--card));
          box-shadow: 0 2px 8px hsl(var(--primary) / 0.4);
          position: relative; z-index: 2;
        "></div>
        <div style="
          position: absolute; top: -11px; left: -11px;
          width: 40px; height: 40px;
          border-radius: 50%;
          background: hsl(var(--primary) / 0.12);
          animation: parkr-pulse 2s ease-in-out infinite;
        "></div>
      </div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function TileLoadingIndicator() {
  const [loading, setLoading] = useState(true);
  const map = useMap();
  useEffect(() => {
    const onLoad = () => setLoading(false);
    const onLoading = () => setLoading(true);
    map.on("loading", onLoading);
    map.on("load", onLoad);
    const fallback = setTimeout(() => setLoading(false), 3000);
    return () => {
      map.off("loading", onLoading);
      map.off("load", onLoad);
      clearTimeout(fallback);
    };
  }, [map]);
  if (!loading) return null;
  return (
    <div style={{
      position: "absolute",
      top: 80,
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 1000,
      background: "hsl(var(--card))",
      padding: "6px 14px",
      borderRadius: 20,
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      fontSize: 12,
      color: "hsl(var(--muted-foreground))",
      display: "flex",
      alignItems: "center",
      gap: 8,
    }}>
      <div style={{
        width: 12, height: 12, borderRadius: "50%",
        border: "2px solid hsl(var(--primary))",
        borderTopColor: "transparent",
        animation: "spin 0.8s linear infinite",
      }} />
      Loading map...
    </div>
  );
}

function FlyToSpot({ spot }: { spot: SpotMarker | null }) {
  const map = useMap();
  useEffect(() => {
    if (spot) {
      map.flyTo([spot.lat, spot.lng], 16, { duration: 0.8 });
    }
  }, [spot, map]);
  return null;
}

function LocateUser({ onLocate }: { onLocate: (pos: [number, number]) => void }) {
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => onLocate([pos.coords.latitude, pos.coords.longitude]),
      () => onLocate(OREBRO_CENTER),
      { timeout: 5000 }
    );
  }, []);
  return null;
}

interface MapViewProps {
  onSpotSelect: (spot: SpotMarker) => void;
  selectedSpot: SpotMarker | null;
  spots?: SpotMarker[];
}

export default function MapView({ onSpotSelect, selectedSpot, spots }: MapViewProps) {
  const [userPos, setUserPos] = useState<[number, number]>(OREBRO_CENTER);

  return (
    <div className="relative w-full h-full">
      <style>{`
        @keyframes parkr-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0; transform: scale(2.2); }
        }
        .leaflet-control-attribution { font-size: 9px !important; opacity: 0.5; }
        .leaflet-container { background: hsl(var(--secondary)); }
        .leaflet-control-zoom {
          border: none !important;
          border-radius: 12px !important;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
        }
        .leaflet-control-zoom a {
          background: hsl(var(--card)) !important;
          color: hsl(var(--foreground)) !important;
          border: 1px solid hsl(var(--border)) !important;
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          font-size: 18px !important;
        }
        .leaflet-control-zoom a:hover {
          background: hsl(var(--secondary)) !important;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <MapContainer
        center={OREBRO_CENTER}
        zoom={14}
        className="w-full h-full z-0"
        zoomControl={false}
        attributionControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <TileLoadingIndicator />
        <FlyToSpot spot={selectedSpot} />
        <LocateUser onLocate={setUserPos} />
        <Marker position={userPos} icon={createUserIcon()} />
        {(spots || MOCK_SPOTS.filter((s) => s.available)).map((spot) => (
          <Marker
            key={spot.id}
            position={[spot.lat, spot.lng]}
            icon={createPriceIcon(spot.price, selectedSpot?.id === spot.id, spot.hasEV)}
            eventHandlers={{ click: () => onSpotSelect(spot) }}
          />
        ))}
      </MapContainer>
    </div>
  );
}
