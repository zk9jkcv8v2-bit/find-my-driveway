import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, X, Star, Zap, ChevronDown, ParkingCircle, Calendar, Music, Building2, Gift, MapPin, Dumbbell, GraduationCap, Landmark, ShoppingBag } from "lucide-react";
import { MOCK_SPOTS, type SpotMarker } from "./MapView";

const FILTERS = [
  { label: "Events", icon: Calendar },
  { label: "Concerts", icon: Music },
  { label: "Downtown", icon: Building2 },
  { label: "Free", icon: Gift },
  { label: "Near Venue", icon: MapPin },
  { label: "Sports", icon: Dumbbell },
  { label: "Schools", icon: GraduationCap },
  { label: "Attractions", icon: Landmark },
  { label: "Shopping", icon: ShoppingBag },
];

interface HomeFeedProps {
  onBook: (spot: SpotMarker) => void;
  onNavigateToExplore: (spot: SpotMarker) => void;
}

export default function HomeFeed({ onBook, onNavigateToExplore }: HomeFeedProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filteredSpots = useMemo(() => {
    let spots = MOCK_SPOTS.filter((s) => s.available);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      spots = spots.filter((s) => s.address.toLowerCase().includes(q));
    }

    if (activeFilter === "Free") {
      spots = spots.filter((s) => s.price === 0);
    } else if (activeFilter === "Near Venue") {
      spots = [...spots].sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    }

    return spots;
  }, [searchQuery, activeFilter]);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="pt-12 px-4 pb-2 flex items-center justify-center">
        <div className="flex items-center gap-1">
          <span className="font-display text-base font-bold text-foreground">Örebro, Sweden</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      {/* Search */}
      <div className="px-4 mb-3">
        <div className="flex items-center gap-3 bg-card rounded-lg px-3 py-2.5 border border-border">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search Parkr..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")}>
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 px-4 mb-4 overflow-x-auto no-scrollbar">
        {FILTERS.map((f) => {
          const Icon = f.icon;
          return (
            <button
              key={f.label}
              onClick={() => setActiveFilter(activeFilter === f.label ? null : f.label)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                activeFilter === f.label
                  ? "bg-foreground text-background border-foreground"
                  : "bg-card text-foreground border-border"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Spot list */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-5">
        {filteredSpots.map((spot, i) => (
          <motion.div
            key={spot.id}
            className="overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            {/* Image */}
            <button
              className="relative w-full aspect-[16/10] overflow-hidden rounded-xl"
              onClick={() => onNavigateToExplore(spot)}
            >
              {spot.image ? (
                <img src={spot.image} alt={spot.address} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-secondary flex items-center justify-center text-3xl">
                  🅿️
                </div>
              )}
              {/* Distance badge */}
              <span className="absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded bg-accent text-accent-foreground">
                📍 {spot.distance}
              </span>
            </button>

            {/* Info */}
            <div className="pt-2 pb-1">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{spot.address.split(",")[0]?.trim()}</p>
                  <p className="font-display font-bold text-foreground text-base">
                    ${spot.price.toFixed(2)} / hour
                  </p>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-warning text-warning" />
                  <span className="text-xs font-semibold text-foreground">{spot.rating}</span>
                  <span className="text-xs text-muted-foreground">(4)</span>
                </div>
              </div>

              <button
                onClick={() => onBook(spot)}
                className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm transition-colors"
                style={{ backgroundColor: "hsl(var(--warning))", color: "hsl(var(--foreground))" }}
              >
                <ParkingCircle className="w-4 h-4" />
                Park now
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
