import { useState, useMemo, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MOCK_SPOTS, type SpotMarker } from "@/components/spots-data";
const LazyMapView = lazy(() => import("@/components/MapView"));
import ErrorBoundary from "@/components/ErrorBoundary";
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
import { Button } from "@/components/ui/button";
import { Search, X, Star, Zap, Shield, MessageCircle, Navigation } from "lucide-react";

export default function Index() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedSpot, setSelectedSpot] = useState<SpotMarker | null>(null);
  const [bookingSpot, setBookingSpot] = useState<SpotMarker | null>(null);
  const [chatSpot, setChatSpot] = useState<SpotMarker | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleNavigate = (spot: SpotMarker) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`;
    window.open(url, "_blank");
  };

  const handleNavigateToExplore = (spot: SpotMarker) => {
    setSelectedSpot(spot);
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
              <div className="flex-1 flex items-center gap-3 bg-card rounded-full px-4 py-3 soft-shadow-lg">
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="Find parking nearby"
                  aria-label="Search parking nearby"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} aria-label="Clear search">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            </motion.div>

            {/* Map — full height */}
            <div className="absolute inset-0">
              <ErrorBoundary fallback={
                <div className="w-full h-full flex items-center justify-center bg-secondary">
                  <p className="text-sm text-muted-foreground">Failed to load map</p>
                </div>
              }>
                <Suspense fallback={
                  <div className="w-full h-full flex items-center justify-center bg-secondary">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                      <span className="text-xs text-muted-foreground">Loading map...</span>
                    </div>
                  </div>
                }>
                  <LazyMapView
                    onSpotSelect={(spot) => setSelectedSpot(spot)}
                    selectedSpot={selectedSpot}
                    spots={filteredSpots}
                  />
                </Suspense>
              </ErrorBoundary>
            </div>

            {/* Bottom sheet — floats over map */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 z-30 bg-card rounded-t-3xl soft-shadow-xl"
              animate={{ y: selectedSpot ? "0%" : "0%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-border" />
              </div>

              {/* Filter bar */}
              <div className="py-2">
                <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
              </div>

              <AnimatePresence mode="wait">
                {selectedSpot ? (
                  /* ── Spot selected: clean info panel + Park button ── */
                  <motion.div
                    key="spot-panel"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.18 }}
                    className="px-4 pb-28"
                  >
                    {/* Name + close */}
                    <div className="flex items-start justify-between mb-3 pt-1">
                      <div className="flex-1 min-w-0 pr-3">
                        <h2 className="font-display font-bold text-[18px] leading-snug text-foreground">
                          {selectedSpot.address.split(",")[0]?.trim()}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {selectedSpot.address} · <span className="text-accent font-medium">Open</span>
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedSpot(null)}
                        aria-label="Close spot"
                        className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center shrink-0 focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Tariff / meta row */}
                    <div className="flex items-center justify-between py-3 border-t border-border">
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <span className="text-muted-foreground">
                          {selectedSpot.type === "garage" ? "🏢 Garage" : selectedSpot.type === "driveway" ? "🏠 Driveway" : "🅿️ Open lot"}
                        </span>
                        {selectedSpot.hasSecurity && (
                          <span className="flex items-center gap-1 text-xs text-primary">
                            <Shield className="w-3 h-3" /> Secured
                          </span>
                        )}
                        {selectedSpot.hasEV && (
                          <span className="flex items-center gap-1 text-xs text-accent">
                            <Zap className="w-3 h-3" /> EV
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-warning text-warning" />
                          <span className="text-sm font-semibold text-foreground">{selectedSpot.rating}</span>
                        </div>
                        <button
                          onClick={() => setChatSpot(selectedSpot)}
                          aria-label="Message host"
                          className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          <MessageCircle className="w-4 h-4 text-foreground" />
                        </button>
                        <button
                          onClick={() => handleNavigate(selectedSpot)}
                          aria-label="Get directions"
                          className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          <Navigation className="w-4 h-4 text-foreground" />
                        </button>
                      </div>
                    </div>

                    {/* Park button */}
                    <Button
                      variant="cta"
                      size="xl"
                      className="w-full rounded-2xl mt-3 text-base gap-2"
                      onClick={() => setBookingSpot(selectedSpot)}
                    >
                      Park here · ${selectedSpot.price.toFixed(2)}/hr
                    </Button>
                  </motion.div>
                ) : (
                  /* ── No spot: spot carousel ── */
                  <motion.div
                    key="carousel"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="pb-24"
                  >
                    <div className="px-4 mb-2">
                      <p className="text-xs font-medium text-muted-foreground">
                        {filteredSpots.length} spots nearby
                      </p>
                    </div>
                    <div className="flex gap-3 px-4 overflow-x-auto no-scrollbar pb-4 snap-x snap-mandatory">
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
                  </motion.div>
                )}
              </AnimatePresence>
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
