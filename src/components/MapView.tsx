import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Zap, Shield, Car } from "lucide-react";

interface SpotMarker {
  id: string;
  lat: number;
  lng: number;
  price: number;
  type: "driveway" | "garage" | "lot";
  available: boolean;
  hasEV: boolean;
  hasSecurity: boolean;
  address: string;
  rating: number;
  distance: string;
}

const MOCK_SPOTS: SpotMarker[] = [
  { id: "1", lat: 37.78, lng: -122.42, price: 5, type: "driveway", available: true, hasEV: false, hasSecurity: false, address: "742 Valencia St", rating: 4.8, distance: "0.2 mi" },
  { id: "2", lat: 37.775, lng: -122.418, price: 8, type: "garage", available: true, hasEV: true, hasSecurity: true, address: "180 Mission St", rating: 4.9, distance: "0.4 mi" },
  { id: "3", lat: 37.782, lng: -122.415, price: 3, type: "driveway", available: true, hasEV: false, hasSecurity: false, address: "55 3rd St", rating: 4.2, distance: "0.6 mi" },
  { id: "4", lat: 37.777, lng: -122.425, price: 12, type: "garage", available: false, hasEV: true, hasSecurity: true, address: "401 Hayes St", rating: 4.7, distance: "0.3 mi" },
  { id: "5", lat: 37.785, lng: -122.41, price: 6, type: "lot", available: true, hasEV: false, hasSecurity: true, address: "888 Brannan St", rating: 4.5, distance: "0.8 mi" },
];

interface MapViewProps {
  onSpotSelect: (spot: SpotMarker) => void;
  selectedSpot: SpotMarker | null;
}

export default function MapView({ onSpotSelect, selectedSpot }: MapViewProps) {
  return (
    <div className="relative w-full h-full bg-secondary/30 overflow-hidden">
      {/* Simulated dark map background */}
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(ellipse at 30% 40%, hsl(222 44% 12%) 0%, hsl(222 47% 6%) 70%),
          linear-gradient(180deg, hsl(222 47% 8%) 0%, hsl(222 47% 4%) 100%)
        `
      }}>
        {/* Grid lines to simulate map streets */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.06]">
          {Array.from({ length: 20 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={`${i * 5}%`} x2="100%" y2={`${i * 5}%`} stroke="hsl(210 40% 96%)" strokeWidth="1" />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <line key={`v${i}`} x1={`${i * 5}%`} y1="0" x2={`${i * 5}%`} y2="100%" stroke="hsl(210 40% 96%)" strokeWidth="1" />
          ))}
        </svg>

        {/* Spot markers */}
        {MOCK_SPOTS.map((spot, index) => {
          const x = 15 + (index * 17) % 70;
          const y = 20 + (index * 23) % 50;
          const isSelected = selectedSpot?.id === spot.id;

          return (
            <motion.button
              key={spot.id}
              className="absolute"
              style={{ left: `${x}%`, top: `${y}%` }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onSpotSelect(spot)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
            >
              <div className={`relative flex items-center justify-center ${isSelected ? 'z-20' : 'z-10'}`}>
                {/* Pulse ring for available spots */}
                {spot.available && (
                  <div className="absolute w-12 h-12 rounded-full bg-primary/20 spot-pulse" />
                )}

                {/* Price bubble */}
                <div className={`
                  flex items-center gap-1 px-3 py-1.5 rounded-full font-display font-semibold text-sm
                  transition-all duration-200
                  ${spot.available
                    ? isSelected
                      ? 'bg-primary text-primary-foreground glow-primary scale-110'
                      : 'bg-primary/90 text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                  }
                `}>
                  ${spot.price}/hr
                  {spot.hasEV && <Zap className="w-3 h-3" />}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Center pin */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
        <div className="w-3 h-3 rounded-full bg-accent glow-accent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-accent/30" />
      </div>
    </div>
  );
}

export type { SpotMarker };
