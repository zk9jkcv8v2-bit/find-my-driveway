import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, X, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_SPOTS, type SpotMarker } from "./MapView";

const FILTERS = ["Nearest", "Events", "Concerts", "Downtown", "EV", "Cheapest", "Garage"];

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

    if (activeFilter === "Cheapest") {
      spots = [...spots].sort((a, b) => a.price - b.price);
    } else if (activeFilter === "EV") {
      spots = spots.filter((s) => s.hasEV);
    } else if (activeFilter === "Nearest") {
      spots = [...spots].sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    } else if (activeFilter === "Garage") {
      spots = spots.filter((s) => s.type === "garage");
    }

    return spots;
  }, [searchQuery, activeFilter]);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="pt-14 px-4 pb-3">
        <h1 className="font-display text-2xl font-extrabold text-foreground mb-1">Parkr</h1>
        <p className="text-sm text-muted-foreground">Find your perfect spot</p>
      </div>

      {/* Search */}
      <div className="px-4 mb-3">
        <div className="flex items-center gap-3 bg-card rounded-full px-4 py-3 soft-shadow border border-border/50">
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
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(activeFilter === f ? null : f)}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
              activeFilter === f
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground border border-border"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Spot list */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-4">
        {filteredSpots.map((spot, i) => (
          <motion.div
            key={spot.id}
            className="soft-card overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            {/* Image */}
            <button
              className="relative w-full aspect-[16/9] overflow-hidden"
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
              <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-[11px] font-bold px-2.5 py-1 rounded-full">
                {spot.distance}
              </span>
              {spot.hasEV && (
                <span className="absolute top-3 right-3 bg-accent/90 text-accent-foreground text-[11px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <Zap className="w-3 h-3" /> EV
                </span>
              )}
            </button>

            {/* Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-display font-bold text-foreground text-sm flex-1 mr-2">{spot.address}</h3>
                <div className="flex items-center gap-1 shrink-0">
                  <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                  <span className="text-xs font-semibold text-foreground">{spot.rating}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-baseline gap-0.5">
                  <span className="font-display font-extrabold text-lg text-foreground">${spot.price}</span>
                  <span className="text-xs text-muted-foreground">/hr</span>
                </div>
                <Button
                  variant="cta"
                  size="sm"
                  className="rounded-full h-9 px-5"
                  onClick={() => onBook(spot)}
                >
                  Park now
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
