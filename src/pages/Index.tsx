import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MapView, { MOCK_SPOTS, type SpotMarker } from "@/components/MapView";
import FilterBar from "@/components/FilterBar";
import SpotCard from "@/components/SpotCard";
import BookingSheet from "@/components/BookingSheet";
import BottomNav from "@/components/BottomNav";
import EarningsDashboard from "@/components/EarningsDashboard";
import ListSpotWizard from "@/components/ListSpotWizard";
import ProfileView from "@/components/ProfileView";
import { toast } from "@/hooks/use-toast";
import { Search, X } from "lucide-react";

export default function Index() {
  const [activeTab, setActiveTab] = useState("discover");
  const [selectedSpot, setSelectedSpot] = useState<SpotMarker | null>(null);
  const [bookingSpot, setBookingSpot] = useState<SpotMarker | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const handleNavigate = (spot: SpotMarker) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`;
    window.open(url, "_blank");
  };

  const filteredSpots = useMemo(() => {
    let spots = MOCK_SPOTS.filter((s) => s.available);

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      spots = spots.filter((s) => s.address.toLowerCase().includes(q));
    }

    // Active filter
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
    <div className="h-screen w-screen overflow-hidden bg-background">
      {activeTab === "discover" && (
        <div className="h-full flex flex-col relative">
          {/* Search bar */}
          <motion.div
            className="absolute top-12 left-4 right-4 z-20"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-3 bg-card rounded-full px-4 py-3 soft-shadow-lg">
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="Find parking nearby"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")}>
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Map */}
          <div className="flex-1">
            <MapView
              onSpotSelect={(spot) => {
                setSelectedSpot(spot);
                setSheetExpanded(true);
              }}
              selectedSpot={selectedSpot}
              spots={filteredSpots}
            />
          </div>

          {/* Bottom sheet */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 z-30 bg-card rounded-t-3xl soft-shadow-xl"
            initial={{ y: "60%" }}
            animate={{ y: sheetExpanded && selectedSpot ? "10%" : "55%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >
            <button
              className="w-full pt-3 pb-2 flex justify-center"
              onClick={() => {
                if (selectedSpot) {
                  setSheetExpanded(!sheetExpanded);
                }
              }}
            >
              <div className="w-10 h-1 rounded-full bg-border" />
            </button>

            <div className="mb-3">
              <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
            </div>

            {selectedSpot && sheetExpanded ? (
              <div className="px-4 pb-24 overflow-y-auto max-h-[60vh]">
                <SpotCard spot={selectedSpot} onBook={setBookingSpot} onNavigate={handleNavigate} />
              </div>
            ) : (
              <div className="pb-24">
                <div className="px-4 mb-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    {filteredSpots.length} spots nearby
                  </p>
                </div>
                <div className="flex gap-3 px-4 overflow-x-auto no-scrollbar pb-4">
                  {filteredSpots.map((spot) => (
                    <SpotCard
                      key={spot.id}
                      spot={spot}
                      onBook={setBookingSpot}
                      onNavigate={handleNavigate}
                      compact
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {activeTab === "list" && <div className="h-full overflow-y-auto"><ListSpotWizard /></div>}
      {activeTab === "earnings" && <EarningsDashboard />}
      {activeTab === "profile" && <div className="h-full overflow-y-auto"><ProfileView /></div>}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      <AnimatePresence>
        {bookingSpot && (
          <BookingSheet spot={bookingSpot} onClose={() => setBookingSpot(null)} onNavigate={handleNavigate} />
        )}
      </AnimatePresence>
    </div>
  );
}
