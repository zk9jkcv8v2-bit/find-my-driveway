import { useState } from "react";
import { motion } from "framer-motion";
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
  image?: string;
}

export const MOCK_SPOTS: SpotMarker[] = [
  { id: "1", price: 5, type: "driveway", available: true, hasEV: false, hasSecurity: false, address: "742 Valencia St", rating: 4.8, distance: "2 min walk" },
  { id: "2", price: 8, type: "garage", available: true, hasEV: true, hasSecurity: true, address: "180 Mission St", rating: 4.9, distance: "4 min walk" },
  { id: "3", price: 3, type: "driveway", available: true, hasEV: false, hasSecurity: false, address: "55 3rd St", rating: 4.2, distance: "6 min walk" },
  { id: "4", price: 12, type: "garage", available: false, hasEV: true, hasSecurity: true, address: "401 Hayes St", rating: 4.7, distance: "3 min walk" },
  { id: "5", price: 6, type: "lot", available: true, hasEV: false, hasSecurity: true, address: "888 Brannan St", rating: 4.5, distance: "8 min walk" },
  { id: "6", price: 4, type: "driveway", available: true, hasEV: false, hasSecurity: false, address: "123 Folsom St", rating: 4.6, distance: "5 min walk" },
];

interface MapViewProps {
  onSpotSelect: (spot: SpotMarker) => void;
  selectedSpot: SpotMarker | null;
}

export default function MapView({ onSpotSelect, selectedSpot }: MapViewProps) {
  // Spot positions on the simulated map
  const spotPositions = [
    { x: 25, y: 30 },
    { x: 60, y: 25 },
    { x: 40, y: 50 },
    { x: 75, y: 45 },
    { x: 20, y: 65 },
    { x: 55, y: 70 },
  ];

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Light map background */}
      <div className="absolute inset-0 bg-[#f0ede6]">
        {/* Simulated streets */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 600" preserveAspectRatio="none">
          {/* Major roads */}
          <rect x="0" y="120" width="400" height="8" fill="#fff" rx="1" />
          <rect x="0" y="280" width="400" height="10" fill="#fff" rx="1" />
          <rect x="0" y="420" width="400" height="8" fill="#fff" rx="1" />
          <rect x="100" y="0" width="8" height="600" fill="#fff" rx="1" />
          <rect x="250" y="0" width="10" height="600" fill="#fff" rx="1" />
          <rect x="340" y="0" width="8" height="600" fill="#fff" rx="1" />

          {/* Minor roads */}
          <rect x="0" y="190" width="400" height="4" fill="#faf8f4" rx="1" />
          <rect x="0" y="350" width="400" height="4" fill="#faf8f4" rx="1" />
          <rect x="0" y="500" width="400" height="4" fill="#faf8f4" rx="1" />
          <rect x="170" y="0" width="4" height="600" fill="#faf8f4" rx="1" />
          <rect x="50" y="0" width="4" height="600" fill="#faf8f4" rx="1" />

          {/* Building blocks */}
          <rect x="55" y="130" width="40" height="55" fill="#e8e5de" rx="3" />
          <rect x="110" y="130" width="55" height="55" fill="#e8e5de" rx="3" />
          <rect x="260" y="130" width="70" height="55" fill="#e8e5de" rx="3" />
          <rect x="55" y="200" width="40" height="70" fill="#e8e5de" rx="3" />
          <rect x="110" y="200" width="55" height="70" fill="#e8e5de" rx="3" />
          <rect x="175" y="290" width="70" height="55" fill="#e8e5de" rx="3" />
          <rect x="260" y="290" width="70" height="55" fill="#e8e5de" rx="3" />
          <rect x="55" y="290" width="40" height="55" fill="#e8e5de" rx="3" />
          <rect x="110" y="360" width="55" height="55" fill="#e8e5de" rx="3" />
          <rect x="260" y="430" width="70" height="60" fill="#e8e5de" rx="3" />
          <rect x="55" y="430" width="40" height="60" fill="#e8e5de" rx="3" />

          {/* Parks/green areas */}
          <rect x="175" y="130" width="70" height="55" fill="#d4e8d0" rx="6" />
          <rect x="175" y="430" width="70" height="60" fill="#d4e8d0" rx="6" />
        </svg>

        {/* Spot markers */}
        {MOCK_SPOTS.filter(s => s.available).map((spot, index) => {
          const pos = spotPositions[index];
          if (!pos) return null;
          const isSelected = selectedSpot?.id === spot.id;

          return (
            <motion.button
              key={spot.id}
              className="absolute z-10"
              style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -50%)" }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onSpotSelect(spot)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.08, type: "spring", stiffness: 400, damping: 20 }}
            >
              <div className={`
                relative px-2.5 py-1.5 rounded-full font-display font-bold text-xs
                transition-all duration-200
                ${isSelected
                  ? "bg-primary text-primary-foreground soft-shadow-lg scale-110"
                  : spot.hasEV
                    ? "bg-accent text-accent-foreground soft-shadow"
                    : "bg-card text-foreground soft-shadow border border-border/60"
                }
              `}>
                ${spot.price}
                {/* Arrow */}
                <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 ${
                  isSelected ? "bg-primary" : spot.hasEV ? "bg-accent" : "bg-card border-r border-b border-border/60"
                }`} />
              </div>
            </motion.button>
          );
        })}

        {/* User location */}
        <div className="absolute top-[48%] left-[48%] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <div className="relative">
            <div className="w-4 h-4 rounded-full bg-primary border-[3px] border-card soft-shadow" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary/10 animate-ping" />
          </div>
        </div>
      </div>
    </div>
  );
}
