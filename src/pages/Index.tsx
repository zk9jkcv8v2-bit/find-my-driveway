import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import MapView, { type SpotMarker } from "@/components/MapView";
import FilterBar from "@/components/FilterBar";
import SpotCard from "@/components/SpotCard";
import BookingSheet from "@/components/BookingSheet";
import BottomNav from "@/components/BottomNav";
import EarningsDashboard from "@/components/EarningsDashboard";
import ListSpotWizard from "@/components/ListSpotWizard";
import ProfileView from "@/components/ProfileView";
import { toast } from "@/hooks/use-toast";

export default function Index() {
  const [activeTab, setActiveTab] = useState("discover");
  const [selectedSpot, setSelectedSpot] = useState<SpotMarker | null>(null);
  const [bookingSpot, setBookingSpot] = useState<SpotMarker | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const handleNavigate = (spot: SpotMarker) => {
    toast({
      title: "Opening navigation",
      description: `Directions to ${spot.address}`,
    });
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      {activeTab === "discover" && (
        <div className="h-full flex flex-col">
          {/* Search header */}
          <div className="relative z-20 pt-12 px-4 pb-2">
            <h1 className="font-display font-bold text-lg text-foreground mb-0.5">Find Parking</h1>
            <p className="text-xs text-muted-foreground">San Francisco, CA</p>
          </div>

          <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

          {/* Map */}
          <div className="flex-1 relative">
            <MapView onSpotSelect={setSelectedSpot} selectedSpot={selectedSpot} />
          </div>

          {/* Selected spot card */}
          <div className="pb-20">
            <AnimatePresence>
              {selectedSpot && selectedSpot.available && (
                <SpotCard
                  spot={selectedSpot}
                  onBook={setBookingSpot}
                  onNavigate={handleNavigate}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {activeTab === "list" && <ListSpotWizard />}
      {activeTab === "earnings" && <EarningsDashboard />}
      {activeTab === "profile" && <ProfileView />}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Booking sheet */}
      <AnimatePresence>
        {bookingSpot && (
          <BookingSheet spot={bookingSpot} onClose={() => setBookingSpot(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
