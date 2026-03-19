import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import spotResidential from "@/assets/spot-residential-1.jpg";
import spotCityGarage from "@/assets/spot-city-garage-1.jpg";
import spotOffice from "@/assets/spot-office-1.jpg";
import spotUnderground from "@/assets/spot-underground-1.jpg";
import spotShoppingLot from "@/assets/spot-shopping-lot.jpg";
import spotPrivateGarage from "@/assets/spot-private-garage.jpg";

export interface HostProfile {
  name: string;
  avatar: string;
  responseTime: string;
  verified: boolean;
  memberSince: string;
  totalSpots: number;
}

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
  host: HostProfile;
}

const spotImages = {
  driveway: spotResidential,
  garage: spotCityGarage,
  lot: spotShoppingLot,
  office: spotOffice,
  underground: spotUnderground,
  privateGarage: spotPrivateGarage,
};

const HOSTS: HostProfile[] = [
  { name: "Erik Lindberg", avatar: "https://i.pravatar.cc/150?img=12", responseTime: "< 5 min", verified: true, memberSince: "2023", totalSpots: 2 },
  { name: "Anna Svensson", avatar: "https://i.pravatar.cc/150?img=5", responseTime: "< 10 min", verified: true, memberSince: "2024", totalSpots: 1 },
  { name: "Lars Johansson", avatar: "https://i.pravatar.cc/150?img=15", responseTime: "< 15 min", verified: false, memberSince: "2024", totalSpots: 3 },
  { name: "Sofia Karlsson", avatar: "https://i.pravatar.cc/150?img=9", responseTime: "< 5 min", verified: true, memberSince: "2022", totalSpots: 4 },
  { name: "Oscar Nilsson", avatar: "https://i.pravatar.cc/150?img=33", responseTime: "< 30 min", verified: true, memberSince: "2025", totalSpots: 1 },
  { name: "Maja Eriksson", avatar: "https://i.pravatar.cc/150?img=25", responseTime: "< 5 min", verified: true, memberSince: "2023", totalSpots: 2 },
];

export const MOCK_SPOTS: SpotMarker[] = [
  { id: "1", price: 2.30, type: "driveway", available: true, hasEV: false, hasSecurity: false, address: "Storgatan 12, Örebro", rating: 4.8, distance: "2 min walk", lat: 59.2753, lng: 15.2134, image: spotImages.driveway, host: HOSTS[0] },
  { id: "2", price: 3.15, type: "garage", available: true, hasEV: true, hasSecurity: true, address: "Drottninggatan 40, Örebro", rating: 4.9, distance: "4 min walk", lat: 59.2770, lng: 15.2060, image: spotImages.underground, host: HOSTS[1] },
  { id: "3", price: 1.75, type: "driveway", available: true, hasEV: false, hasSecurity: false, address: "Kungsgatan 8, Örebro", rating: 4.2, distance: "6 min walk", lat: 59.2730, lng: 15.2180, image: spotImages.privateGarage, host: HOSTS[2] },
  { id: "4", price: 4.50, type: "garage", available: false, hasEV: true, hasSecurity: true, address: "Järnvägsgatan 5, Örebro", rating: 4.7, distance: "3 min walk", lat: 59.2790, lng: 15.2110, image: spotImages.garage, host: HOSTS[3] },
  { id: "5", price: 2.85, type: "lot", available: true, hasEV: false, hasSecurity: true, address: "Fabriksgatan 22, Örebro", rating: 4.5, distance: "8 min walk", lat: 59.2710, lng: 15.2050, image: spotImages.office, host: HOSTS[4] },
  { id: "6", price: 1.95, type: "driveway", available: true, hasEV: false, hasSecurity: false, address: "Rudbecksgatan 15, Örebro", rating: 4.6, distance: "5 min walk", lat: 59.2765, lng: 15.2200, image: spotImages.driveway, host: HOSTS[5] },
  { id: "7", price: 3.40, type: "lot", available: true, hasEV: true, hasSecurity: false, address: "Vasagatan 3, Örebro", rating: 4.3, distance: "7 min walk", lat: 59.2740, lng: 15.2000, image: spotImages.lot, host: HOSTS[0] },
  { id: "8", price: 3.95, type: "garage", available: true, hasEV: true, hasSecurity: true, address: "Trädgårdsgatan 18, Örebro", rating: 4.9, distance: "1 min walk", lat: 59.2760, lng: 15.2150, image: spotImages.garage, host: HOSTS[3] },
  { id: "9", price: 1.50, type: "driveway", available: true, hasEV: false, hasSecurity: false, address: "Nygatan 25, Örebro", rating: 4.1, distance: "10 min walk", lat: 59.2720, lng: 15.2230, image: spotImages.office, host: HOSTS[2] },
  { id: "10", price: 3.65, type: "lot", available: true, hasEV: false, hasSecurity: true, address: "Engelbrektsgatan 7, Örebro", rating: 4.6, distance: "5 min walk", lat: 59.2800, lng: 15.2080, image: spotImages.underground, host: HOSTS[1] },
  { id: "11", price: 6, type: "driveway", available: true, hasEV: false, hasSecurity: false, address: "Ånäsgatan 14, Örebro", rating: 4.4, distance: "9 min walk", lat: 59.2695, lng: 15.2120, image: spotImages.privateGarage, host: HOSTS[5] },
  { id: "12", price: 15, type: "garage", available: true, hasEV: true, hasSecurity: true, address: "Klostergatan 2, Örebro", rating: 5.0, distance: "2 min walk", lat: 59.2775, lng: 15.2170, image: spotImages.lot, host: HOSTS[3] },
];

const OREBRO_CENTER: [number, number] = [59.2753, 15.2134];

function createPriceIcon(price: number, isSelected: boolean, hasEV: boolean) {
  const bg = isSelected
    ? "linear-gradient(135deg, hsl(217, 91%, 55%), hsl(217, 91%, 45%))"
    : hasEV
      ? "linear-gradient(135deg, hsl(152, 60%, 45%), hsl(152, 60%, 38%))"
      : "linear-gradient(135deg, hsl(0, 0%, 100%), hsl(220, 14%, 96%))";
  const flatBg = isSelected
    ? "hsl(217, 91%, 50%)"
    : hasEV
      ? "hsl(152, 60%, 42%)"
      : "hsl(220, 14%, 96%)";
  const color = isSelected || hasEV ? "#ffffff" : "hsl(220, 20%, 14%)";
  const shadow = isSelected
    ? "0 6px 20px rgba(59, 130, 246, 0.45), 0 2px 6px rgba(59, 130, 246, 0.2)"
    : hasEV
      ? "0 4px 14px rgba(34, 197, 94, 0.3), 0 2px 4px rgba(34, 197, 94, 0.1)"
      : "0 3px 12px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.06)";
  const border = isSelected || hasEV ? "none" : "1.5px solid hsl(220, 14%, 88%)";
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
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      white-space: nowrap;
      ${scale}
      position: relative;
      cursor: pointer;
      line-height: 1;
      letter-spacing: -0.02em;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    ">
      ${hasEV ? '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" style="margin-right:4px;filter:drop-shadow(0 0 3px rgba(255,255,255,0.6))"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>' : ''}
      $${price.toFixed(2)}
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
          background: hsl(217, 91%, 60%);
          border: 3px solid #fff;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
          position: relative; z-index: 2;
        "></div>
        <div style="
          position: absolute; top: -11px; left: -11px;
          width: 40px; height: 40px;
          border-radius: 50%;
          background: hsla(217, 91%, 60%, 0.12);
          animation: parkr-pulse 2s ease-in-out infinite;
        "></div>
      </div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
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
        .leaflet-container { background: hsl(220, 14%, 96%); }
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
