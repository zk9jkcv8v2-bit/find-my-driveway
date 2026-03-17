import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Zap, Shield, Star } from "lucide-react";

export interface SpotMarker {
  id: string;
  price: number;
  type: "driveway" | "garage" | "lot";
  available: boolean;
  hasEV: boolean;
  hasSecurity: boolean;
  address: string;
  rating: number;
  distance: string;
  lat: number;
  lng: number;
  image?: string;
}

export const MOCK_SPOTS: SpotMarker[] = [
  { id: "1", price: 5, type: "driveway", available: true, hasEV: false, hasSecurity: false, address: "742 Valencia St", rating: 4.8, distance: "2 min walk", lat: 37.7605, lng: -122.4212 },
  { id: "2", price: 8, type: "garage", available: true, hasEV: true, hasSecurity: true, address: "180 Mission St", rating: 4.9, distance: "4 min walk", lat: 37.7912, lng: -122.3944 },
  { id: "3", price: 3, type: "driveway", available: true, hasEV: false, hasSecurity: false, address: "55 3rd St", rating: 4.2, distance: "6 min walk", lat: 37.7855, lng: -122.4005 },
  { id: "4", price: 12, type: "garage", available: false, hasEV: true, hasSecurity: true, address: "401 Hayes St", rating: 4.7, distance: "3 min walk", lat: 37.7763, lng: -122.4238 },
  { id: "5", price: 6, type: "lot", available: true, hasEV: false, hasSecurity: true, address: "888 Brannan St", rating: 4.5, distance: "8 min walk", lat: 37.7716, lng: -122.4035 },
  { id: "6", price: 4, type: "driveway", available: true, hasEV: false, hasSecurity: false, address: "123 Folsom St", rating: 4.6, distance: "5 min walk", lat: 37.7880, lng: -122.3920 },
];

const SF_CENTER: [number, number] = [37.7749, -122.4194];

function createPriceIcon(price: number, isSelected: boolean, hasEV: boolean) {
  const bg = isSelected ? "hsl(217,91%,60%)" : hasEV ? "hsl(152,60%,48%)" : "#fff";
  const color = isSelected || hasEV ? "#fff" : "hsl(220,20%,14%)";
  const border = isSelected || hasEV ? "none" : "1px solid hsl(220,14%,92%)";
  const shadow = isSelected
    ? "0 4px 16px rgba(59,130,246,0.35)"
    : "0 2px 12px rgba(0,0,0,0.08)";
  const scale = isSelected ? "scale(1.15)" : "scale(1)";

  return L.divIcon({
    className: "parkr-marker",
    html: `<div style="
      background:${bg};
      color:${color};
      border:${border};
      box-shadow:${shadow};
      transform:${scale};
      padding:6px 10px;
      border-radius:20px;
      font-weight:700;
      font-size:13px;
      font-family:'Plus Jakarta Sans',system-ui,sans-serif;
      white-space:nowrap;
      transition:all 0.2s ease;
      position:relative;
    ">$${price}<div style="
      position:absolute;
      bottom:-5px;
      left:50%;
      transform:translateX(-50%) rotate(45deg);
      width:8px;
      height:8px;
      background:${bg};
      ${!isSelected && !hasEV ? `border-right:${border};border-bottom:${border};` : ""}
    "></div></div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

function createUserIcon() {
  return L.divIcon({
    className: "parkr-user-loc",
    html: `<div style="position:relative;width:16px;height:16px;">
      <div style="width:16px;height:16px;border-radius:50%;background:hsl(217,91%,60%);border:3px solid #fff;box-shadow:0 2px 8px rgba(59,130,246,0.4);position:relative;z-index:2;"></div>
      <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:40px;height:40px;border-radius:50%;background:hsla(217,91%,60%,0.15);animation:pulse 2s infinite;"></div>
    </div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
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
  const map = useMap();
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const loc: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        onLocate(loc);
      },
      () => onLocate(SF_CENTER),
      { timeout: 5000 }
    );
  }, []);
  return null;
}

interface MapViewProps {
  onSpotSelect: (spot: SpotMarker) => void;
  selectedSpot: SpotMarker | null;
}

export default function MapView({ onSpotSelect, selectedSpot }: MapViewProps) {
  const [userPos, setUserPos] = useState<[number, number]>(SF_CENTER);

  return (
    <div className="relative w-full h-full">
      <style>{`
        .parkr-marker { background: none !important; border: none !important; }
        .parkr-user-loc { background: none !important; border: none !important; }
        @keyframes pulse { 0%,100% { opacity:0.6; transform:translate(-50%,-50%) scale(1); } 50% { opacity:0; transform:translate(-50%,-50%) scale(2); } }
        .leaflet-control-attribution { font-size: 9px !important; opacity: 0.6; }
      `}</style>
      <MapContainer
        center={SF_CENTER}
        zoom={14}
        className="w-full h-full z-0"
        zoomControl={false}
        attributionControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <FlyToSpot spot={selectedSpot} />
        <LocateUser onLocate={setUserPos} />

        {/* User location */}
        <Marker position={userPos} icon={createUserIcon()} />

        {/* Spot markers */}
        {MOCK_SPOTS.filter((s) => s.available).map((spot) => (
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
