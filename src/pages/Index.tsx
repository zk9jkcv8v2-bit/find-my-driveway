import { useState, useMemo, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MOCK_SPOTS, type SpotMarker } from "@/components/spots-data";
const LazyMapView = lazy(() => import("@/components/MapView"));
import FilterBar from "@/components/FilterBar";
import SpotCard from "@/components/SpotCard";
import BookingSheet from "@/components/BookingSheet";
import ChatSheet from "@/components/ChatSheet";
import BottomNav from "@/components/BottomNav";
import EarningsDashboard from "@/components/EarningsDashboard";
import ListSpotWizard from "@/components/ListSpotWizard";
import ProfileView from "@/components/ProfileView";
import HomeFeed from "@/components/HomeFeed";
import ActivityView from "@/components/ActivityView";
import { toast } from "@/hooks/use-toast";
import { Search, X } from "lucide-react";

export default function Index() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedSpot, setSelectedSpot] = useState<SpotMarker | null>(null);
  const [bookingSpot, setBookingSpot] = useState<SpotMarker | null>(null);
  const [chatSpot, setChatSpot] = useState<SpotMarker | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const handleNavigate = (spot: SpotMarker) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`;
    window.open(url, "_blank");
  };

  const handleNavigateToExplore = (spot: SpotMarker) => {
    setSelectedSpot(spot);
    setSheetExpanded(true);
    setActiveTab("explore");
  };

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
    <div className="h-screen w-screen overflow-hidden bg-background">
      <AnimatePresence mode="wait">
        {activeTab === "home" && (
          <motion.div
            key="home"
            className="h-full"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            <HomeFeed onBook={setBookingSpot} onNavigateToExplore={handleNavigateToExplore} />
          </motion.div>
        )}

        {activeTab === "explore" && (
          <motion.div
            key="explore"
            className="h-full flex flex-col relative"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
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
              <Suspense fallback={
                <div className="flex-1 h-full flex items-center justify-center bg-secondary">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <span className="text-xs text-muted-foreground">Loading map...</span>
                  </div>
                </div>
              }>
                <LazyMapView
                  onSpotSelect={(spot) => {
                    setSelectedSpot(spot);
                    setSheetExpanded(true);
                  }}
                  selectedSpot={selectedSpot}
                  spots={filteredSpots}
                />
              </Suspense>
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
                  <SpotCard spot={selectedSpot} onBook={setBookingSpot} onNavigate={handleNavigate} onChat={setChatSpot} />
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
          </motion.div>
        )}

        {activeTab === "list" && (
          <motion.div
            key="list"
            className="h-full overflow-y-auto"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            <ListSpotWizard />
          </motion.div>
        )}
        {activeTab === "earnings" && (
          <motion.div
            key="earnings"
            className="h-full"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            <EarningsDashboard />
          </motion.div>
        )}
        {activeTab === "activity" && (
          <motion.div
            key="activity"
            className="h-full"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            <ActivityView />
          </motion.div>
        )}
        {activeTab === "profile" && (
          <motion.div
            key="profile"
            className="h-full overflow-y-auto"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            <ProfileView />
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      <AnimatePresence>
        {bookingSpot && (
          <BookingSheet spot={bookingSpot} onClose={() => setBookingSpot(null)} onNavigate={handleNavigate} />
        )}
        {chatSpot && (
          <ChatSheet spot={chatSpot} onClose={() => setChatSpot(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
