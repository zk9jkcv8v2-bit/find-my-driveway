import { motion } from "framer-motion";
import { Star, Zap, Shield, MapPin, Navigation, MessageCircle, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SpotMarker } from "./MapView";

interface SpotCardProps {
  spot: SpotMarker;
  onBook: (spot: SpotMarker) => void;
  onNavigate: (spot: SpotMarker) => void;
  onChat?: (spot: SpotMarker) => void;
  compact?: boolean;
}

export default function SpotCard({ spot, onBook, onNavigate, onChat, compact = false }: SpotCardProps) {
  const typeLabel = spot.type === "driveway" ? "Driveway" : spot.type === "garage" ? "Garage" : "Parking Lot";
  const typeEmoji = spot.type === "garage" ? "🏢" : spot.type === "driveway" ? "🏠" : "🅿️";

  if (compact) {
    return (
      <motion.button
        className="soft-card p-3 w-[180px] shrink-0 text-left"
        whileTap={{ scale: 0.97 }}
        onClick={() => onBook(spot)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-start justify-between mb-2">
          <span className="text-lg">{typeEmoji}</span>
          <div className="flex items-center gap-0.5">
            <Star className="w-3 h-3 text-warning fill-warning" />
            <span className="text-xs font-medium text-foreground">{spot.rating}</span>
          </div>
        </div>
        <p className="text-sm font-semibold text-foreground truncate">{spot.address}</p>
        <p className="text-xs text-muted-foreground mb-2">{spot.distance} · {typeLabel}</p>
        <div className="flex items-center gap-1.5">
          <span className="font-display font-bold text-primary text-lg">${spot.price.toFixed(2)}</span>
          <span className="text-xs text-muted-foreground">/hr</span>
          {spot.hasEV && <Zap className="w-3.5 h-3.5 text-accent ml-auto" />}
        </div>
      </motion.button>
    );
  }

  return (
    <motion.div
      className="soft-card p-4 soft-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      layout
    >
      <div className="flex items-start gap-3">
        {/* Spot image */}
        {spot.image ? (
          <img src={spot.image} alt={spot.address} className="w-20 h-20 rounded-xl object-cover shrink-0" />
        ) : (
          <div className="w-20 h-20 rounded-xl bg-secondary flex items-center justify-center text-2xl shrink-0">
            {typeEmoji}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-display font-bold text-foreground text-sm">{spot.address}</h3>
            <div className="flex items-center gap-0.5 shrink-0 ml-2">
              <Star className="w-3.5 h-3.5 text-warning fill-warning" />
              <span className="text-xs font-semibold text-foreground">{spot.rating}</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mb-2">{spot.distance} · {typeLabel}</p>

          {/* Host info */}
          <div className="flex items-center gap-2 mb-2">
            <img src={spot.host.avatar} alt={spot.host.name} className="w-5 h-5 rounded-full object-cover" />
            <span className="text-[11px] font-medium text-foreground">{spot.host.name}</span>
            {spot.host.verified && <BadgeCheck className="w-3.5 h-3.5 text-primary" />}
          </div>

          {/* Tags */}
          <div className="flex gap-1.5 mb-3 flex-wrap">
            {spot.hasEV && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-medium">
                <Zap className="w-2.5 h-2.5" /> EV
              </span>
            )}
            {spot.hasSecurity && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                <Shield className="w-2.5 h-2.5" /> Secured
              </span>
            )}
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-medium">
              <MapPin className="w-2.5 h-2.5" /> Available
            </span>
          </div>

          {/* Price + actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-0.5">
              <span className="font-display font-extrabold text-xl text-foreground">${spot.price}</span>
              <span className="text-xs text-muted-foreground">/hr</span>
            </div>
            <div className="flex gap-2">
              {onChat && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full"
                  onClick={() => onChat(spot)}
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full"
                onClick={() => onNavigate(spot)}
              >
                <Navigation className="w-4 h-4" />
              </Button>
              <Button
                variant="cta"
                size="sm"
                className="rounded-full h-9 px-4"
                onClick={() => onBook(spot)}
              >
                Book
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
