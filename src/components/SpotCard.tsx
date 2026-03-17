import { motion } from "framer-motion";
import { Star, Zap, Shield, Car, Navigation, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SpotMarker } from "./MapView";

interface SpotCardProps {
  spot: SpotMarker;
  onBook: (spot: SpotMarker) => void;
  onNavigate: (spot: SpotMarker) => void;
}

export default function SpotCard({ spot, onBook, onNavigate }: SpotCardProps) {
  const typeLabel = spot.type === "driveway" ? "Driveway" : spot.type === "garage" ? "Garage" : "Parking Lot";
  const typeIcon = spot.type === "garage" ? "🏢" : spot.type === "driveway" ? "🏠" : "🅿️";

  return (
    <motion.div
      className="glass-card p-4 mx-4 mb-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      layout
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{typeIcon}</span>
            <h3 className="font-display font-semibold text-foreground">{spot.address}</h3>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Car className="w-3.5 h-3.5" />
              {typeLabel}
            </span>
            <span className="flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5" />
              {spot.distance}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-accent" />
              {spot.rating}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="font-display font-bold text-2xl text-primary">${spot.price}</div>
          <div className="text-xs text-muted-foreground">per hour</div>
        </div>
      </div>

      {/* Amenities */}
      <div className="flex gap-2 mb-4">
        {spot.hasEV && (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-spot-ev/10 text-spot-ev text-xs font-medium">
            <Zap className="w-3 h-3" /> EV Charging
          </span>
        )}
        {spot.hasSecurity && (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
            <Shield className="w-3 h-3" /> Secured
          </span>
        )}
        {spot.available && (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
            <Clock className="w-3 h-3" /> Available Now
          </span>
        )}
      </div>

      {/* Actions - thumb-friendly large buttons */}
      <div className="flex gap-3">
        <Button
          variant="glow"
          className="flex-1 h-12 text-base font-display font-semibold rounded-xl"
          onClick={() => onBook(spot)}
        >
          Book Now
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="h-12 w-12 rounded-xl"
          onClick={() => onNavigate(spot)}
        >
          <Navigation className="w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  );
}
